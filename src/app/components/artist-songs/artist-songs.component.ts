import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Artist } from '../../interfaces/artist'; // tu interfaz de artista
import  { ArtistsService } from '../../services/artists.service'; // tu servicio de artistas
import { SongsService } from '../../services/songs.service'; // tu servicio de canciones
import { SpotifyApiService } from '../../services/spotify-api.service'; // tu servicio de SpotifyApiService
import { CommonModule, DatePipe } from '@angular/common';
import { Song } from '../../interfaces/song';
import { Router } from '@angular/router'; // Asegúrate de importar Router
import { SpotifyPlaybackService } from '../../services/spotify-playback.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-artist-songs',
  templateUrl: './artist-songs.component.html',
  standalone: true,
  imports: [CommonModule, DatePipe], // Asegúrate de importar los módulos necesarios aquí
})
export class ArtistSongsComponent implements OnInit {
  artistId: string = '';
  artist: Artist | undefined = undefined; // Inicializa como un objeto vacío o con un valor predeterminado
  songs: Song[] = [];
  isLoading: boolean = localStorage.getItem('songsLoaded') ? false : true; // Variable para controlar el estado de carga
  loadingSong: boolean = false
  constructor(
    private route: ActivatedRoute,
    private artistsService: ArtistsService,
    private spotifyService: SpotifyApiService, // Asegúrate de importar tu servicio de SpotifyApiService
    private router: Router,
    private SpotifyPlaybackService: SpotifyPlaybackService, // Asegúrate de importar tu servicio de SpotifyPlaybackService
    private songsService: SongsService, // Asegúrate de importar tu servicio de canciones // Asegúrate de importar tu servicio de artistas
    private auth: AuthService
  ) {}
  getArtistData(id: string) {

    const allData = localStorage.getItem('songsWithArtist');
    if (allData) {
      const parsed = JSON.parse(allData);
      const artistData = parsed[this.artistId]; // por ejemplo: '5oDg6VKoVfLSpVyMuuumvX'
      if (artistData) {
        this.songs = artistData.songs;
        this.artist = artistData.artist;
        this.artistsService.artist = this.artist!; // Actualiza el artista en el servicio de artistas
        localStorage.setItem('currentArtist', JSON.stringify(this.artist)); // Guarda el artista en localStorage
      }
    }
    if(this.songs.length === 0){
    this.isLoading = true; // Cambia el estado de carga a verdadero antes de hacer la llamada
    this.spotifyService.getArtistTracks(id).subscribe({
        next: (response) => {
          this.songs = response.songs;
          this.artist = response.artist;
          localStorage.setItem('songsLoaded', 'true'); // Cambia el estado de carga a verdadero
          this.isLoading = false; // Cambia el estado de carga a falso una vez que los datos se hayan cargado

          const newEntry = {
            songs: this.songs,
            artist: this.artist
          };

          this.artistsService.artist = this.artist!; // Actualiza el artista en el servicio de artistas
          localStorage.setItem('currentArtist', JSON.stringify(this.artist)); // Guarda el artista en localStorage
          // Obtener lo que ya hay en localStorage
          const existing = localStorage.getItem('songsWithArtist');
          const songsWithArtist = existing ? JSON.parse(existing) : {};

          // Añadir o actualizar el artista actual
          songsWithArtist[this.artist!.id] = newEntry;

          // Guardar de nuevo todo el objeto
          localStorage.setItem('songsWithArtist', JSON.stringify(songsWithArtist));
          
        },
        error: (error) => {
            console.error('Error fetching artist data:', error);
        }
    });
  }
  }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) { // Verifica que el ID se esté obteniendo correctamente
        this.artistId = id;
        this.getArtistData(this.artistId);
      } else {
        console.error('Artist ID is undefined');
      }
      });
  }

  playSong(song: Song) {
    this.loadingSong = true;
    this.songsService.song = song;
    localStorage.setItem('currentSong', JSON.stringify(song));
    if (this.songsService.audio) {
      this.songsService.audio.pause();
      this.songsService.audio = undefined;
    }
    try {
      if(!localStorage.getItem('jwt_token')){
        this.songsService.audio = new Audio(`http://localhost:8000/stream/${song.name}/${song.artist.name}`);
        this.songsService.audio.play();
      } else {
        if(this.auth.userProfile.product != 'premium'){
          this.songsService.audio = new Audio(`http://localhost:8000/stream/${this.artist!.name}/${song.name}`);

          this.songsService.audio.addEventListener('canplay', e => {
              this.loadingSong = false;
              this.songsService.isPlaying = true
              this.songsService.audio?.play()
          })

          this.songsService.setPlaybackSource('native');
          this.songsService.audio.addEventListener('timeupdate', e => {
            const audio = e.target as HTMLAudioElement
            this.songsService.position = audio.currentTime * 1000
          })
          
        } else {
          this.SpotifyPlaybackService.play(song.uri);
        }
      }
    }
    catch (error) {
      console.warn('Warning playing song:', error);
    }
  }

  navigateTo(){
    this.router.navigate(['/']); 
  }
}
