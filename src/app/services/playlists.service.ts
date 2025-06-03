import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Playlist} from '../interfaces/playlist';
import {Song} from '../interfaces/song';
import {Artist} from '../interfaces/artist';

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {
  private _playlistsSubject = new BehaviorSubject<Playlist[]>([]);
  public playlists$ = this._playlistsSubject.asObservable()
  private _playlistTracks: Song[] = [];

  get playlists(){
    return this._playlistsSubject.value
  }

  public setPlaylists(playlist: Playlist[]) {
    this._playlistsSubject.next(playlist);
  }

  get playlistTracks(){
    return this._playlistTracks;
  }

  set playlistTracks(playlistTracks: Song[]) {
    this._playlistTracks = playlistTracks;
  }

  getPlaylistById(id: string): Playlist {
    return <Playlist>this._playlistsSubject.value.find(playlist => playlist.id === id);
  }

  constructor() {
    const playlistsItem = localStorage.getItem('playlists');
    if (playlistsItem) {
      try {
        const playlists: Playlist[] = JSON.parse(playlistsItem);
        this._playlistsSubject.next(playlists);
      } catch (e) {
        console.error('Error parsing playlists from localStorage', e);
      }
    }
  }
}
