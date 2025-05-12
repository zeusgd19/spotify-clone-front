import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyApiService } from '../../services/spotify-api.service';
import { AuthService } from '../../services/auth.service';
import { SpotifyPlaybackService } from '../../services/spotify-playback.service';
import { Artist } from '../../interfaces/artist';
import { Song } from '../../interfaces/song';
import { CommonModule } from '@angular/common';
import { ArtistCardComponent } from '../../components/artist-card/artist-card.component';
import { ArtistSongsComponent } from '../../components/artist-songs/artist-songs.component';
import { ArtistsService } from '../../services/artists.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CommonModule, ArtistCardComponent],
  standalone: true
})
export class HomeComponent implements OnInit {
  artists: Artist[] = [];
  songs: Song[] = [];
  viewSongs = false;
  clickedArtist: Artist | null = null;

  constructor(
    private spotifyService: SpotifyApiService,
    private auth: AuthService,
    private playbackService: SpotifyPlaybackService,
    private router: Router,
    private route: ActivatedRoute,
    private artistsService: ArtistsService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const artistId = params.get('id');
      if (artistId) {
        this.viewSongs = true;
        this.getArtistData(artistId);
      } else {
        this.viewSongs = false;
        this.popularArtists();
      }
    });
  }

  popularArtists() {
    const artists = this.artistsService.artists;
    if (artists.length > 0) {
      this.artists = artists
    } else {
      this.spotifyService.popularArtists().subscribe({
        next: (response) => {
          this.artists = response.artists;
          this.artistsService.artists = response.artists;
          localStorage.setItem(
            this.auth.logged ? 'userTopArtists' : 'popularArtists',
            JSON.stringify(response.artists)
          );
        },
        error: (error) => console.error('Error fetching artists:', error)
      });
    }
  }

  getClickedArtist(artist: Artist) {
    this.clickedArtist = artist;
    this.viewSongs = true;
  }

  getArtistData(id: string) {
    this.spotifyService.getArtistTracks(id).subscribe({
        next: (response) => {
          this.songs = response.songs;
          this.clickedArtist = response.artist;
        },
        error: (error) => {
            console.error('Error fetching artist data:', error);
        }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  get isLogged(): boolean {
    return this.auth.logged;
  }
}
