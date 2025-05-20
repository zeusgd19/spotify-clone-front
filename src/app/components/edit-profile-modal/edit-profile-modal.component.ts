import { Component, Input, Output, EventEmitter } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {User} from '../../interfaces/user';

@Component({
  selector: 'app-edit-profile-modal',
  imports: [FormsModule],
  templateUrl: './edit-profile-modal.component.html',
  standalone: true
})
export class EditProfileModalComponent {
  @Input() user: User = {} as User;
  @Output() close = new EventEmitter<void>();

  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveChanges() {
    if (this.selectedFile) {
      // Aquí deberías subir la imagen al backend o a un storage (Firebase, S3, etc.)
      // Por ejemplo, podrías usar FormData:
      // const formData = new FormData();
      // formData.append('image', this.selectedFile);

      // Por ahora, solo actualizamos la preview
      this.user.previewUrl = this.previewUrl;
    }

    console.log('Perfil actualizado:', this.user);
    this.close.emit();
  }

  closeModal() {
    this.close.emit();
  }
}
