import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SpotifyApiService } from '../../services/spotify-api.service';

@Component({
  selector: 'app-login-success',
  templateUrl: './login-success.component.html'
})
export class LoginSuccessComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private spotifyService: SpotifyApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const refreshToken = params['refreshToken']
      if (token) {
        // Guardar token en localStorage o estado global
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('refresh_token', refreshToken);

        this.spotifyService.getUserProfile().subscribe({
            next: (profile) => {
              localStorage.setItem('user', JSON.stringify(profile));
              this.auth.logged = true;
              this.auth.userProfile = profile 
              this.auth.setToken(token) // Emitir el token a través del BehaviorSubject
            },
            error: (error) => console.error('Error loading profile:', error)
        });
        this.router.navigate(['/']);
      }
    });
  }
}
