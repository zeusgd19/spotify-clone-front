import { Injectable } from '@angular/core';
import { Artist } from '../interfaces/artist';

@Injectable({
  providedIn: 'root'
})
export class ArtistsService {
    private _artists: Artist[] = localStorage.getItem('userTopArtists')
    ? JSON.parse(localStorage.getItem('userTopArtists')!)
    : localStorage.getItem('popularArtists')
      ? JSON.parse(localStorage.getItem('popularArtists')!)
      : [];

    private _searchedArtists: Artist[] = [];

    private _artist: Artist = localStorage.getItem('currentArtist') ? JSON.parse(localStorage.getItem('currentArtist')!) : {} as Artist;
    
    get artists(): Artist[] {
        return this._artists;
    }
    
    set artists(value: Artist[]) {
        this._artists = value;
    }

    set artist(value: Artist) {
        this._artist = value;
    }

    get artist(): Artist {
        return this._artist;
    }

    get searchedArtists(): Artist[] {
        return this._searchedArtists;
    }

    set searchedArtists(value: Artist[]) {
        this._searchedArtists = value;
    }

    getArtistById(id: string): Artist | undefined {
        return this._artists.find(artist => artist.id === id);
    }

    getSearchedArtistById(id: string): Artist | undefined {
        return this._searchedArtists.find(artist => artist.id === id);
    }
    
    constructor() { }
}