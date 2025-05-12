import { Album } from "./album";
import { Artist } from "./artist";

export interface Song {
    id: string;
    name: string;
    duration_ms: number; 
    uri: string;
    album: Album;
    artist: Artist
}