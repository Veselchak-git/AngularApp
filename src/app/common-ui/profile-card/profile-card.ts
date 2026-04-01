import { ProfileService } from './../../data/services/profile';
import { Profile } from './../../data/interfaces/profile.interface';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ImgUrlPipe } from '../../helpers/pipes/img-url-pipe';
import { SvgIcon } from "../svg-icon/svg-icon";
import {Router } from '@angular/router';
import { debounceTime, firstValueFrom, forkJoin } from 'rxjs';
import { Pageble } from '../../data/interfaces/pageble.interface';
@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [ImgUrlPipe, SvgIcon],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.scss',
})
export class ProfileCard {
  @Input() profile!: Profile;
  @Input() isCurrentUser = false;
  @Input() isSubscribed = false;
  @Output() subscriptionChanged = new EventEmitter<{ profileId: number; isSubscribed: boolean }>();
  profileService = inject(ProfileService);
  router = inject(Router);

  isSubscribing = false;

  toggleSubscription() {
    if (this.isSubscribing) return;

    this.isSubscribing = true;

    // Сохраняем старое состояние для отката
    const oldState = this.isSubscribed;

    // 🔥 Оптимистичное обновление (меняем сразу)
    this.isSubscribed = !this.isSubscribed;
    this.subscriptionChanged.emit({
      profileId: this.profile.id,
      isSubscribed: this.isSubscribed
    });

    const request$ = this.isSubscribed
      ? this.profileService.subscribeToUser(this.profile.id)
      : this.profileService.unsubscribeFromUser(this.profile.id);

    request$.subscribe({
      next: () => {
        // Успех - обновляем кеш в фоне
        this.profileService.refreshSubscriptions();
        this.isSubscribing = false;
      },
      error: (err) => {
        console.error('Ошибка', err);
        // Откат при ошибке
        this.isSubscribed = oldState;
        this.subscriptionChanged.emit({
          profileId: this.profile.id,
          isSubscribed: this.isSubscribed
        });
        this.isSubscribing = false;
      }
    });
  }

  goToProfile(profileId: number): void {
    this.router.navigate(['/profile', profileId]);
  }
}
