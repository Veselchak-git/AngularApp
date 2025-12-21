import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ProfileService } from '../../../data/services/profile';
import { debounceTime, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [],
  templateUrl: './profile-filters.html',
  styleUrl: './profile-filters.scss',
})
export class ProfileFilters {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: ['']
  })

  searchFormSub!: Subscription;

  constructor() {
    this.searchFormSub = this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
        switchMap(formValue => {
          return this.profileService.filterProfiles(formValue);
        }))
      .subscribe();
  }

  ngOnDestroy() {
    this.searchFormSub.unsubscribe();
  }
}
