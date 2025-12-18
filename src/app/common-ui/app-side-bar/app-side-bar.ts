import { ProfileService } from './../../data/services/profile';
import { Component, inject } from '@angular/core';
import { SvgIcon } from "../svg-icon/svg-icon";
import { SubscriberCard } from "../sidebar/subscriber-card/subscriber-card";
import { RouterLink } from "@angular/router";
import { AsyncPipe, JsonPipe} from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ImgUrlPipe } from "../../helpers/pipes/img-url-pipe";

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [SvgIcon, SubscriberCard, RouterLink, AsyncPipe, ImgUrlPipe],
  templateUrl: './app-side-bar.html',
  styleUrl: './app-side-bar.scss',
})
export class AppSideBar {
  profileService = inject(ProfileService);


  subscribers$ = this.profileService.getSubscribersShortList();

  me = this.profileService.me

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: ''
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats'
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search'
    }
  ]

  ngOnInit() {
    firstValueFrom(this.profileService.getMe())
  }

}

