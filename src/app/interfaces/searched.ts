import { Artist } from "./artist";
import { Song } from "./song";

export interface Searched {
    artists: Artist[];
    songs: Song[];
}