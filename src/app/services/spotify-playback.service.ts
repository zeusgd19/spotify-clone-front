import { Injectable } from '@angular/core';
import { SpotifyApiService } from './spotify-api.service';
import { SongsService } from './songs.service';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class SpotifyPlaybackService {
  private player: any;
  private deviceId: string = '';
  private token: string = '';

  constructor(
    private spotifyApiService: SpotifyApiService,
    private songService: SongsService,
  ) {
  }

waitForSpotifySDK(token: string) {
  if ((window as any).Spotify) {
    console.log('Spotify SDK disponible');
    this.setupPlayer(token);
  } else {
    console.log('Esperando SDK...');
    setTimeout(() => this.waitForSpotifySDK(token), 100);
  }
}

  private setupPlayer(token: string) {
    const player = new window.Spotify.Player({
      name: 'Spotify Clone',
      getOAuthToken: (cb: (token: string) => void) => {
        cb(token);
      },
      volume: 0.5,
    });

    this.player = player;

    player.addListener('ready', ({ device_id }: any) => {
      this.deviceId = device_id;
      this.token = token;
      console.log('Spotify Player initialized:', player);
      this.transferPlayback();
    });

    player.addListener('initialization_error', ({ message }: any) => {
      console.error('Initialization error:', message);
    });

     player.addListener('authentication_error', ({ message }: any) => {
      console.error('Auth error:', message);
      this.spotifyApiService.refreshToken().subscribe({
        next: res => {
          localStorage.setItem('jwt_token', res.token);
          this.token = res.token;
          const payload = JSON.parse(atob(token.split('.')[1]));
          const spotifyToken = payload.spotify_token;
          this.player.disconnect();
          console.log('Reinitializing player with new token:', res.token);
          this.reinitPlayer(spotifyToken).then(() => {
            // Reintentar lo que falló (ej: reproducir canción actual)
            this.playCurrent(spotifyToken); // <--- asegúrate de tener esto
          });
        },
        error: ({ message }: any) => {
          console.warn('Reinitializing player with new token:', message);
          localStorage.clear()
          window.location.reload()
        }
      });
    });

    player.addListener('player_state_changed', ({
      position,
    }: any) => {
      console.log('Player state changed:', position);
      this.songService.position = position;
      localStorage.setItem('position', position);
    });

    player.connect();
  }

  private transferPlayback() {
    fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      body: JSON.stringify({ device_ids: [this.deviceId], play: false }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  public play(uri: string) {
    this.songService.setPlaybackSource('spotify');
    this.songService.isPlaying = true
    fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      body: JSON.stringify({ uris: [uri] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    });

    console.log(this.token)
  }

  public playCurrent(token: string) {
    this.songService.isPlaying = true
    fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      body: JSON.stringify({ uris: [this.songService.song.uri] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }


  public pause() {
    this.songService.isPlaying = false
    fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  public resume() {
    this.songService.isPlaying = true
    this.player.resume().then(() => {
      console.log('Resumed!');
    })
  }

  public volume(value: number) {
    this.player.setVolume(value).then(() => {
      console.log('Volume set to ' + value);
    })
  }

  async reinitPlayer(newToken: string) {

    this.token = newToken;

    this.player = new window.Spotify.Player({
      name: 'Spotify Clone',
      getOAuthToken: (cb: (token: string) => void) => {
        cb(newToken);
      },
      volume: 0.5,
    });

    this.player.addListener('ready', ({ device_id }: any) => {
      this.deviceId = device_id;
      this.transferPlayback();
    });

    this.player.addListener('authentication_error', ({ message }: any) => {
      console.error('Auth error:', message);
    });

    this.player.connect();
  }

  getPlayer() {
    return this.player;
  }
}
