import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SpotifyApiService } from '../../services/spotify-api.service';
import { CommonModule } from '@angular/common';
import { LoginSuccessComponent } from '../login-success/login-success.component';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterLink, CommonModule, LoginSuccessComponent, ReactiveFormsModule ]
})
export class HeaderComponent {
  showDropdown = false;
  user: any = {};
  loggingIn = false;
  searchControl = new FormControl('');
  searchQuery: string = '';

  constructor(
    public auth: AuthService,
    private spotifyService: SpotifyApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.searchControl.valueChanges
    .pipe(debounceTime(400))
    .subscribe(value => {
      if (value) {
        this.router.navigate(['/search', value]);
      }
    });
}

  get isLogged(): boolean {
    return this.auth.logged;
  }

  get userProfile() {
    return this.auth.userProfile;
  }

  login() {
    localStorage.removeItem('popularArtists');
    this.loggingIn = true;
    window.location.href = 'https://admin.spotifyclone.shop/startLogin';
  }

  logout() {
    this.auth.logout();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
}
