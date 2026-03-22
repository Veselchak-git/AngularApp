import { Component, inject, input} from '@angular/core';
import { ImgUrlPipe } from "../../../helpers/pipes/img-url-pipe";
import { Profile } from '../../../data/interfaces/profile.interface';
import { ActivatedRoute } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { ProfileService } from '../../../data/services/profile';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SvgIcon } from "../../../common-ui/svg-icon/svg-icon";
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-input',
  imports: [ImgUrlPipe, AsyncPipe, SvgIcon, PickerComponent, FormsModule],
  standalone: true,
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

  postText = '';
  showPicker = false;

  toggleEmojiPicker() {
    this.showPicker = !this.showPicker;
  }

  addEmoji(event: any) {
    this.postText += event.emoji.native;
  }

  sendPost() {
  }

  autoResize(event: Event) {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';           // сбрасываем высоту
  textarea.style.height = textarea.scrollHeight + 'px'; // устанавливаем по содержимому
}
}

