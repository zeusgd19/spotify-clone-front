import { Component } from '@angular/core';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CommonModule} from '@angular/common';
import {EditProfileModalComponent} from '../edit-profile-modal/edit-profile-modal.component';
import {User} from '../../interfaces/user';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  imports: [FontAwesomeModule, CommonModule, EditProfileModalComponent],
  templateUrl: './user-profile.component.html',
  standalone: true
})
export class UserProfileComponent {

  faPen = faPen;
  showModal = false
  user: User = {} as User;

  constructor(private authService: AuthService) {
    this.user = this.authService.userProfile
  }

  openEditModal() {
    // Lógica para abrir modal
    this.showModal = true;
  }
}
