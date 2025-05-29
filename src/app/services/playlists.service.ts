import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Playlist} from '../interfaces/playlist';

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {
  private _playlistsSubject = new BehaviorSubject<Playlist[]>([]);
  public playlists$ = this._playlistsSubject.asObservable()

  get playlists(){
    return this._playlistsSubject.value
  }

  public setPlaylists(playlist: Playlist[]) {
    this._playlistsSubject.next(playlist);
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
