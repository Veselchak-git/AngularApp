import { Component, inject, signal } from '@angular/core';
import { ProfileCard } from '../../common-ui/profile-card/profile-card';
import { ProfileService } from '../../data/services/profile';
import { Profile } from '../../data/interfaces/profile.interface';

@Component({
  selector: 'app-search-page',
  imports: [ProfileCard],
  standalone: true,
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage {
  protected readonly title = signal('AngularApp');
  profileService = inject(ProfileService);
  profiles: Profile[] = []

  constructor() {
    this.profileService.getTestAccounts().subscribe(value => {
      this.profiles = value;
    })
  }
}
