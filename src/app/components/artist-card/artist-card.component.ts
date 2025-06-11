import {Component, Input, ViewChild} from '@angular/core';
import { Artist } from '../../interfaces/artist';
import { Router } from '@angular/router';
import { EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
  imports: [CommonModule],
  standalone: true
})
export class ArtistCardComponent {
  @Input() artist!: Artist;
  @Output() artistClicked: EventEmitter<Artist> = new EventEmitter<Artist>();
  showLoginModal: boolean = false;

  constructor(private router: Router) {}

  getClickArtist(artist: Artist) {
    if (!localStorage.getItem('jwt_token')) {
      this.showLoginModal = true; // Mostrar el modal de inicio de sesión
      return;
    }
    this.artistClicked.emit(artist); // solo emitir
    this.router.navigate(['/artist', this.artist.id]);
  }

  closeModal() {
    this.showLoginModal = false;
  }
}
