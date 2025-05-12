import { Image } from "./image";

export interface Album {
    id: string;
    name: string;
    uri: string;
    images: Array<Image>;
}