import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SpotifyApiService } from '../../services/spotify-api.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [RouterLink]
})
export class SidebarComponent {
  constructor(private spotifyService: SpotifyApiService) {}

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
}
