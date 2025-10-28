import { ProfileService } from './data/services/profile';
import { Component, inject, signal } from '@angular/core';
import { ProfileCard } from './common-ui/profile-card/profile-card';
import { Profile } from './data/interfaces/profile.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProfileCard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('AngularApp');
  profileService = inject(ProfileService);
  profiles: Profile[] = []

  constructor() {
    this.profileService.getTestAccounts().subscribe(value => {
      this.profiles = value;
    })
  }
}
