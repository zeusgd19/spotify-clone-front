import { Routes } from '@angular/router';
import { LoginSuccessComponent } from './components/login-success/login-success.component';
import { ArtistSongsComponent } from './components/artist-songs/artist-songs.component';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './components/search/search.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';

export const routes: Routes = [
    { path: 'login-success', component: LoginSuccessComponent },
    { path: 'artist/:id', component: ArtistSongsComponent },
    { path: 'search/:search', component: SearchComponent },
    { path: 'search/:search/:option', component: SearchComponent },
    { path: '', component: HomeComponent },
    { path: 'collection/tracks', component: ArtistSongsComponent },
    { path: 'profile', component: UserProfileComponent }
];
