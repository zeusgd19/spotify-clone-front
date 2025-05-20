import { Injectable } from '@angular/core';
import { Song } from '../interfaces/song';
import { BehaviorSubject, interval, filter, map, combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongsService {
    private playbackSource: 'native' | 'spotify' = 'native';
    private _songs: Song[] = [];
    private _song: Song = localStorage.getItem('currentSong') ? JSON.parse(localStorage.getItem('currentSong')!) : {} as Song;
    private positionSubject = new BehaviorSubject<number>(0);
    position$ = this.positionSubject.asObservable();
    private isPlayingSubject = new BehaviorSubject<boolean>(false);
    isPlaying$ = this.isPlayingSubject.asObservable();
    private _audio: HTMLAudioElement | undefined;
    private likedSongsSubject = new BehaviorSubject<Song[]>([]);
    likedSongs$ = this.likedSongsSubject.asObservable();

    private _searchedSongs: Song[] = [];
    constructor() {
            // Solo usar interval si el modo es Spotify
        combineLatest([interval(1000), this.isPlaying$])
        .pipe(
        filter(([_, isPlaying]) => isPlaying && this.playbackSource === 'spotify'),
        map(() => this.positionSubject.value + 1000)
        )
        .subscribe(newPosition => {
        this.positionSubject.next(newPosition);
        });
    }

    get likedSongs(){
        return this.likedSongsSubject.value
    }

    public setLikedSongs(songs: Song[]) {
      this.likedSongsSubject.next(songs);
    }

    set likedSongs(value: Song[]){
        this.likedSongsSubject.next(value);
    }

    setPlaybackSource(source: 'native' | 'spotify') {
        this.playbackSource = source;
    }
    get audio(): HTMLAudioElement | undefined {
        return this._audio;
    }

    set audio(value: HTMLAudioElement | undefined) {
        this._audio = value;
    }

    get searchedSongs(): Song[] {
        return this._searchedSongs;
    }

    set searchedSongs(value: Song[]) {
        this._searchedSongs = value;
    }

      // Opcional: para acceder directamente al valor
    get position(): number {
        return this.positionSubject.value;
    }

    set position(value: number) {
        this.positionSubject.next(value);
    }
    get songs(): Song[] {
        return this._songs;
    }

    set songs(value: Song[]) {
        this._songs = value;
    }

    set song(value: Song) {
        this._song = value;
    }

    get song(): Song {
        return this._song;
    }

    set isPlaying(value: boolean) {
        this.isPlayingSubject.next(value);
    }

    get isPlaying(): boolean {
        return this.isPlayingSubject.value
    }

    getArtistById(id: string): Song | undefined {
        return this._songs.find(songs => songs.id === id);
    }
}
