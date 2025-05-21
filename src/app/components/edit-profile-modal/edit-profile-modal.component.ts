import { Component, Input, Output, EventEmitter } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {User} from '../../interfaces/user';
import { supabase} from '../../supbase.client';


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

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async saveChanges() {
    if (!this.selectedFile) return;
    const { data, error } = await supabase.auth.getSession();
    console.log('session:', data?.session);
    const file = this.selectedFile;
    const filePath = `public/${Date.now()}_${file.name}`; // Ruta única
    const bucket = 'avatars'; // Nombre de tu bucket en Supabase

    try {
      // Subir la imagen
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Obtener la URL pública
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      this.user.profilePic = data.publicUrl;
      console.log('Imagen subida y URL asignada:', this.user.profilePic);
    } catch (error) {
      console.error('Error al subir imagen a Supabase:', error);
    }

    this.close.emit();
  }

  closeModal() {
    this.close.emit();
  }
}
