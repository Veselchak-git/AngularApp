import { Component, inject, input} from '@angular/core';
import { ImgUrlPipe } from "../../../helpers/pipes/img-url-pipe";
import { Profile } from '../../../data/interfaces/profile.interface';
import { ActivatedRoute } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { ProfileService } from '../../../data/services/profile';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SvgIcon } from "../../../common-ui/svg-icon/svg-icon";

@Component({
  selector: 'app-post-input',
  imports: [ImgUrlPipe, AsyncPipe, SvgIcon],
  templateUrl: './post-input.html',
  styleUrl: './post-input.scss',
})
export class PostInput {
  profile = input<Profile>()
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute);
  me$ = toObservable(this.profileService.me);
  subscribers$ = this.profileService.getSubscribersShortList(5);

  isCurrentUser: boolean = false;

  profile$ = this.route.params
    .pipe(
      switchMap(({id}) => {
        if (id === 'me') {
          this.isCurrentUser = true;
          return this.me$
        }
        this.isCurrentUser = false;
        return this.profileService.getAccount(id);
      })
    );
}
