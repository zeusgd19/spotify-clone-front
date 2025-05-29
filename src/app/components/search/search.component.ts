import { Component } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify-api.service';
import { Searched } from '../../interfaces/searched';
import { Artist } from '../../interfaces/artist';
import { Song } from '../../interfaces/song';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { ArtistsService } from '../../services/artists.service';
import { SpotifyPlaybackService } from '../../services/spotify-playback.service';
import { SongsService } from '../../services/songs.service';

@Component({
  selector: 'app-search',
  imports: [CommonModule, DatePipe, FontAwesomeModule],
  standalone: true,
  templateUrl: './search.component.html'
})
export class SearchComponent {
  faUser = faUser;
  searchOptions = [
    'ALL',
    'ARTISTS',
    'SONGS',
  ]
  defaultOption = this.searchOptions[0];

  searchedResults: Searched = {} as Searched;
  selectedOption = this.defaultOption;
  searchQuery: string = '';
  artists: Artist[] = [];
  songs: Song[] = [];
  mainArtist: Artist | null = null;
  lastSearchedQuery: string = '';

  showLoginModal: boolean = false;

  constructor(
    private spotifyApiService: SpotifyApiService,
    private route: ActivatedRoute,
    private router: Router,
    private artistsService: ArtistsService,
    private songsService: SongsService,
    private spotifyPlaybackService: SpotifyPlaybackService,
    private activatedRoute: ActivatedRoute,
  ) { }


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const query = params.get('search');
      const option  = params.get('option');

      if(option == 'artists'){
        this.selectedOption = this.searchOptions[1];
      } else if(option == 'tracks'){
        this.selectedOption = this.searchOptions[2];
      } else {
        this.selectedOption = this.defaultOption;
      }
      if (query && query.trim()) {
        this.searchQuery = query;

        const alreadySearched = this.lastSearchedQuery === query && this.artists.length > 0 && this.songs.length > 0;
        if (!alreadySearched) {
          this.lastSearchedQuery = query;
          this.search(query);
        }
      }
    });
  }

  search(query: string = this.searchQuery) {
    const trimmedQuery = query.trim().toLowerCase();
    if (trimmedQuery === '') {
      return;
    }
    this.spotifyApiService.search(query).subscribe({
      next: (response) => {
        this.searchedResults = response;
        this.mainArtist = this.searchedResults.artists[0];
        this.songs = this.searchedResults.songs;
        this.artists = this.searchedResults.artists;

        this.artistsService.searchedArtists = this.artists;
        this.songsService.searchedSongs = this.songs;
      },
      error: (error) => {
        console.error('Error searching:', error);
        if (error.status === 401) {
          this.spotifyApiService.refreshToken().subscribe({
            next: (res) => {
              localStorage.setItem('jwt_token', res.token);
              this.search();
            },
            error: () => this.spotifyApiService.logout()
          });
        }
      }
    });
  }

  playSong(song: Song) {
    if (!localStorage.getItem('jwt_token')) {
      this.showLoginModal = true;
      return;
    }
    const position = this.songs.findIndex((findSong: Song) => findSong.uri == song.uri )
    this.spotifyPlaybackService.play(this.songs, position);
  }

  goToArtist(artistId: string | undefined ) {
    if (!localStorage.getItem('jwt_token')) {
      this.showLoginModal = true;
      return;
    }
    this.router.navigate(['/artist', artistId]);
  }

  showSongs(){
    this.selectedOption = this.searchOptions[2]
    const search = this.activatedRoute.snapshot.paramMap.get('search');
    this.router.navigate(['search', search, 'tracks']);

  }

  showArtists() {
    this.selectedOption = this.searchOptions[1]
    const search = this.activatedRoute.snapshot.paramMap.get('search');
    this.router.navigate(['search', search, 'artists']);
  }

  showAll() {
    this.selectedOption = this.defaultOption
    const search = this.activatedRoute.snapshot.paramMap.get('search');
    this.router.navigate(['search', search, '']);
  }

  closeModal() {
    this.showLoginModal = false;
  }
}
