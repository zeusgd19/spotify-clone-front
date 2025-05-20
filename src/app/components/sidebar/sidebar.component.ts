import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { SpotifyApiService } from '../../services/spotify-api.service';
import {faBook, faHeart} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SongsService } from '../../services/songs.service';
import {CommonModule} from '@angular/common';

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
  constructor(
    private spotifyService: SpotifyApiService,
    private songsService: SongsService,
    private router: Router,
  ) {
   this.likedSongs$ = this.songsService.likedSongs$;
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

  goToCollection(){
    this.router.navigate(['/collection/tracks']);
  }
}
