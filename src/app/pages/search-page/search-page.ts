import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ProfileCard } from '../../common-ui/profile-card/profile-card';
import { ProfileService } from '../../data/services/profile';
import { Profile } from '../../data/interfaces/profile.interface';
import { ProfileFilters } from "./profile-filters/profile-filters";

@Component({
  selector: 'app-search-page',
  imports: [ProfileCard, ProfileFilters],
  standalone: true,
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage {
  protected readonly title = signal('AngularApp');
  profileService = inject(ProfileService);
  profiles = this.profileService.filteredProfiles

  constructor() {
  }
}
