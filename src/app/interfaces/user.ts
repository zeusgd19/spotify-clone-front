export interface User {
    email: string;
    name: string;
    profilePic: string;
    roles: string[];
    product: string;
    previewUrl: string | ArrayBuffer | null
}
