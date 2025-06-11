import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Song } from '../interfaces/song';

@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {
  private apiUrl = 'https://spotifyclone.vps.webdock.cloud/api'; // Your Symfony backend URL
  private authUrl = 'https://spotifyclone.vps.webdock.cloud'; // Your Symfony backend URL for auth
  private spotifyApiUrl = 'https://api.spotify.com/v1/me'; // Your Spotify API URL
  constructor(private http: HttpClient) { }

  login(): Observable<any> {
    return this.http.post(`${this.authUrl}/startLogin`,{});
  }

  refreshToken(): Observable<any> {
    const token: string = localStorage.getItem('refresh_token') || '';
    const body = {
      refresh_token: token
    }
    return this.http.post('https://spotifyclone.vps.webdock.cloud/api/token/refresh',body);
  }

  logout(): Observable<any> {
    const token: string = localStorage.getItem('jwt_token') || '';
    const headers: HttpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });
    localStorage.removeItem('jwt_token');
    return this.http.get(`${this.authUrl}/logout`,{ headers: headers });
  }

  getUserProfile(): Observable<any> {
    const token: string = localStorage.getItem('jwt_token') || '';
    const headers: HttpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/user/profile`, { headers: headers });
  }

  getUserPlaylists(): Observable<any> {
    const token: string = localStorage.getItem('jwt_token') || '';
    const headers: HttpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/myPlaylists`, { headers: headers });
  }

  search(query: string): Observable<any> {
    const token: string = localStorage.getItem('jwt_token') || '';
    const headers: HttpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/search/${query}`, { headers: headers });
  }

  popularArtists(): Observable<any> {
    const token: string = localStorage.getItem('jwt_token') || '';
    const headers: HttpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/popularArtists`, { headers: headers });
  }

  getRecommendations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recommendations`);
  }

  getFeaturedPlaylists(): Observable<any> {
    return this.http.get(`${this.apiUrl}/featured-playlists`);
  }

  getPlaylistTracks(playlistId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/playlist/${playlistId}/tracks`);
  }

  getArtistTracks(artistId: string): Observable<any> {
    const token: string = localStorage.getItem('jwt_token') || '';
    const headers: HttpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/artist/${artistId}`, { headers: headers });
  }

  streamSong(song: string, artist: string): Observable<any> {
    return this.http.get(`${this.authUrl}/stream/${song}/${artist}`);
  }

  getMySavedTracks(): Observable<any>{
    const token: string = localStorage.getItem('jwt_token') || '';
    const headers: HttpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/myTracks`, {headers: headers})
  }
}
