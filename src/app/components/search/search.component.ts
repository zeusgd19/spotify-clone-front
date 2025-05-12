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

  showLoginModal: boolean = false;

  constructor(
    private spotifyApiService: SpotifyApiService, 
    private route: ActivatedRoute,
    private router: Router,
    private artistsService: ArtistsService,
    private songsService: SongsService,
    private spotifyPlaybackService: SpotifyPlaybackService
  ) { }


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
    const query = params.get('search');
    if (query && query.trim()) {
      this.searchQuery = query;
      this.search(query);
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
    this.spotifyPlaybackService.play(song.id);
  }

  goToArtist(artistId: string | undefined ) {
    if (!localStorage.getItem('jwt_token')) {
      this.showLoginModal = true;
      return;
    }
    this.router.navigate(['/artist', artistId]);
  }

  closeModal() {
    this.showLoginModal = false;
  }
}
