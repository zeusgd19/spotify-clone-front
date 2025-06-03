import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { SpotifyApiService } from '../../services/spotify-api.service';
import {faBook, faHeart, faMusic} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SongsService } from '../../services/songs.service';
import {CommonModule} from '@angular/common';
import {Song} from '../../interfaces/song';
import {isEmpty, Observable} from 'rxjs';
import {PlaylistsService} from '../../services/playlists.service';
import {Playlist} from '../../interfaces/playlist';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule, CommonModule]
})
export class SidebarComponent {
  faLike = faHeart;
  faLibrary = faBook
  likedSongs$
  playlists$
  loadingPlaylist: boolean = false;
  constructor(
    private spotifyService: SpotifyApiService,
    protected songsService: SongsService,
    private router: Router,
    private playlistService: PlaylistsService
  ) {
   this.likedSongs$ = this.songsService.likedSongs$
   this.playlists$ = this.playlistService.playlists$
  }

  myPlaylists() {
    this.spotifyService.getUserPlaylists().subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
        if (error.status === 401) {
          this.spotifyService.refreshToken().subscribe({
            next: (res) => {
              localStorage.setItem('jwt_token', res.token);
              this.myPlaylists();
            },
            error: () => this.spotifyService.logout()
          });
        }
      }
    });
  }

  ngAfterViewInit() {
    const sidebar = document.getElementById('resizableSidebar');
    const resizer = document.getElementById('resizer');

    let isResizing = false;

    resizer?.addEventListener('mousedown', function () {
      isResizing = true;
      document.body.style.cursor = 'col-resize';
    });

    document.addEventListener('mousemove', function (e) {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 180 && newWidth <= 400) {
        sidebar!.style.width = `${newWidth}px`;
      }
    });

    document.addEventListener('mouseup', function () {
      isResizing = false;
      document.body.style.cursor = 'default';
    });
  }

  goToCollection(){
    this.router.navigate(['/collection/tracks']);
  }

  goToPlaylist(playlist: Playlist) {
    this.loadingPlaylist = true;

    this.spotifyService.getPlaylistTracks(playlist.id).subscribe({
      next: ({ tracks }) => {
        this.playlistService.playlistTracks = tracks;
        this.loadingPlaylist = false;
        this.router.navigate(['/playlist', playlist.id]);
      },
      error: (err) => {
        console.error('Error al cargar playlist', err);
        this.loadingPlaylist = false;
      }
    });
  }


  protected readonly faMusic = faMusic;
  protected readonly isEmpty = isEmpty;
}
