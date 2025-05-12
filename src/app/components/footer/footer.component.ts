import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faSearch, faHeart, faUser, faRandom, faPlay, faStepBackward, faRedoAlt, faVolumeDown, faAdd, faPause, faStepForward } from '@fortawesome/free-solid-svg-icons';
import { SongsService } from '../../services/songs.service';
import { ArtistsService } from '../../services/artists.service';
import { CommonModule, DatePipe } from '@angular/common';
import { SpotifyPlaybackService } from '../../services/spotify-playback.service';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [FontAwesomeModule, DatePipe, FormsModule, CommonModule],
})
export class FooterComponent {
  faRandom = faRandom;
  faPlay = faPlay;
  faStepBackward = faStepBackward;
  faStepForward = faStepForward;
  faRedoAlt = faRedoAlt;
  faVolumeDown = faVolumeDown
  faLike = faAdd
  faPause = faPause
  position: number = 0;
  volume: number = 0.5;
  isPlaying: boolean = false;


  constructor(
    private router: Router,
    private songsService: SongsService,
    private artistsService: ArtistsService,
    private spotifyPlaybackService: SpotifyPlaybackService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.songsService.isPlaying$.subscribe(isPlaying => {
      console.log('isPlaying:', isPlaying);
      this.isPlaying = isPlaying;
      this.cdr.detectChanges();
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }


  get currentSong() {
    return this.songsService.song;
  }

  get currentArtist() {
    return this.artistsService.artist;
  }

  get currentPosition() {
    return this.songsService.position;
  }
  setVolume() {
    this.spotifyPlaybackService.volume(this.volume);
  }

  pause() {
    if(!localStorage.getItem('jwt_token')){
      this.songsService.isPlaying = false;
      this.songsService.audio?.pause();
    } else {
      if(this.auth.userProfile.product != 'premium'){
        this.songsService.isPlaying = false;
        this.songsService.audio?.pause();
      } else {
        this.spotifyPlaybackService.pause();
      }
    }
  }

  resume() {
    if(!localStorage.getItem('jwt_token')){
      this.songsService.isPlaying = true;
      this.songsService.audio?.play();
    } else {
      if(this.auth.userProfile.product != 'premium'){
        this.songsService.isPlaying = true;
        this.songsService.audio?.play();
      } else {
        this.spotifyPlaybackService.resume();
      }
    }
  }
}