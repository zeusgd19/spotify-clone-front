import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './pages/home/home.component';
import { SpotifyPlaybackService } from './services/spotify-playback.service';
import { SearchComponent } from './components/search/search.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SidebarComponent, HomeComponent, SearchComponent],
})
export class AppComponent {
  constructor(private playbackService: SpotifyPlaybackService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.spotifyToken$.subscribe(token => {
      if (token) {
        console.log('Token recibido:', token);
        this.playbackService.waitForSpotifySDK(token);
      }
    });
  
    // Si ya está en localStorage al cargar la página
    const storedToken = this.authService.getToken();
    if (storedToken) {
      const payload = JSON.parse(atob(storedToken.split('.')[1]));
      const spotifyToken = payload.spotify_token;
      this.playbackService.waitForSpotifySDK(spotifyToken);
    }
  }

  initSpotify() {
  this.authService.spotifyToken$.subscribe(token => {
      if (token) {
        console.log('Token recibido:', token);
        this.playbackService.waitForSpotifySDK(token);
      }
    });
  }
}