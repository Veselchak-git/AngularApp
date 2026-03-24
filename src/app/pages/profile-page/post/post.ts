import { Post as PostModel} from './../../../data/interfaces/post.interface';
import { Component, inject, Input} from '@angular/core';
import { PostService } from '../../../data/services/post-service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ImgUrlPipe } from "../../../helpers/pipes/img-url-pipe";
import { SvgIcon } from '../../../common-ui/svg-icon/svg-icon';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { PostInput } from "../post-input/post-input";

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
  postMenuMap = new Map<number, boolean>();
  commentsMenuMap = new Map<number, boolean>();
  posts$ = this.postService.getPosts();
  subPosts$ = this.postService.getSubscriptionPosts();
  isLiked!: boolean;
  postText = '';
  showPicker = false;
  @Input() post?: PostModel;


  deletePost(postId: number) {
    this.postService.deletePost(postId).subscribe({
      next: () => {window.location.reload()}
    });
  }

  togglePostMenu(event: Event, postId: number) {
    event.stopPropagation();
    const current = this.postMenuMap.get(postId) || false;
    this.postMenuMap.set(postId, !current);
  }

  toggleCommentsMenu(event: Event, postId: number) {
    event.stopPropagation();
    const current = this.commentsMenuMap.get(postId) || false;
    this.commentsMenuMap.set(postId, !current);
  }

  isPostMenuOpen(postId: number): boolean {
    return this.postMenuMap.get(postId) || false;
  }

  isCommentsMenuOpen(postId: number): boolean {
    return this.commentsMenuMap.get(postId) || false;
  }

  toggleLike(post: PostModel) {
      for (let i = 0; i < post.likesUsers.length;i++) {
        if (post.author.id.toString() == post.likesUsers[i]) {
          this.isLiked = true;
        }
      }

      const request$ = this.isLiked
        ? this.postService.unlikePost(post.id)
        : this.postService.likePost(post.id);

      request$.subscribe({
        next: (response) => {
          if (response?.likes !== undefined) {
            post.likes = response.likes;
          }
          window.location.reload()
        },
        error: (error) => {
          this.isLiked = true;
          post.likes += this.isLiked ? 1 : -1;
          console.error('Ошибка при изменении лайка', error);
        }
      });
  }
}
