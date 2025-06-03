import { Injectable } from '@angular/core';
import { SpotifyApiService } from './spotify-api.service';
import { User } from '../interfaces/user';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _logged = localStorage.getItem('user') ? true : false;
  private _userProfile: User = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

  private spotifyTokenSubject = new BehaviorSubject<string | null>(null);
  public spotifyToken$ = this.spotifyTokenSubject.asObservable();

  constructor(
    private spotifyApiService: SpotifyApiService,
    private router: Router
  ) {}

  setToken(token: string) {
    localStorage.setItem('jwt_token', token);
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const spotifyToken = tokenPayload.spotify_token;
    this.spotifyTokenSubject.next(spotifyToken);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  get logged(): boolean {
    return this._logged;
  }

  set logged(value: boolean) {
    this._logged = value;
  }

  get userProfile(): any {
    return this._userProfile;
  }

  set userProfile(value: any) {
    this._userProfile = value;
  }

  logout(){
    this.logged = false;
    this.userProfile = null;
    localStorage.clear()
    window.location.href = '/'
  }

  refreshToken(){
    this.spotifyApiService.refreshToken().subscribe({
      next: (response) => {
        localStorage.setItem('jwt_token', response.token);
      },
      error: (err) => {
        console.error('Error al refrescar el token:', err);
      }
    });
  }
}
