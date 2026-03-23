import { Component, inject, Input, input, signal } from '@angular/core';
import { PostService } from '../../../data/services/post-service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { ImgUrlPipe } from "../../../helpers/pipes/img-url-pipe";
import { SvgIcon } from '../../../common-ui/svg-icon/svg-icon';

@Component({
  selector: 'app-post',
  imports: [AsyncPipe, DatePipe, ImgUrlPipe, SvgIcon],
  standalone: true,
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post {
  postService = inject(PostService);
  route = inject(ActivatedRoute);
  showMenu = signal(false);
  @Input() post?: Post;

  posts$ = this.route.params
    .pipe(
      switchMap(({id}) => {
        return this.postService.getPosts();
      })
    );

  deletePost(postId: number) {
    this.postService.deletePost(postId).subscribe({
      next: () => {window.location.reload()}
    });
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.showMenu.set(!this.showMenu());
  }

  closeMenu() {
    this.showMenu.set(false);
  }
}
