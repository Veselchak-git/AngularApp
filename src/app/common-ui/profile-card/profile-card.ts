import { ProfileService } from './../../data/services/profile';
import { Profile } from './../../data/interfaces/profile.interface';
import { Component, inject, Input } from '@angular/core';
import { ImgUrlPipe } from '../../helpers/pipes/img-url-pipe';
import { SvgIcon } from "../svg-icon/svg-icon";
import {Router } from '@angular/router';
@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [ImgUrlPipe, SvgIcon],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.scss',
})
export class ProfileCard {
  @Input() profile!: Profile;
  profileService = inject(ProfileService);
  router = inject(Router);

  goToProfile(profileId: number): void {
    this.router.navigate(['/profile', profileId]);
  }
}
