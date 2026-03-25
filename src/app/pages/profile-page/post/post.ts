import { switchMap } from 'rxjs';
import { Post as PostModel} from './../../../data/interfaces/post.interface';
import { Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { PostService } from '../../../data/services/post-service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ImgUrlPipe } from "../../../helpers/pipes/img-url-pipe";
import { SvgIcon } from '../../../common-ui/svg-icon/svg-icon';
import { ProfileService } from '../../../data/services/profile';
import { toObservable } from '@angular/core/rxjs-interop';
import { PostEditor } from '../post-editor/post-editor';
import { PostInput } from "../post-input/post-input";

@Component({
  selector: 'app-post',
  imports: [AsyncPipe, DatePipe, ImgUrlPipe, SvgIcon, PostEditor, PostInput],
  standalone: true,
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post {
  @Input() post?: PostModel | null = null;
  selectedPost?: PostModel | null = null;
  postService = inject(PostService);
  route = inject(ActivatedRoute);
  profileService = inject(ProfileService);
  me$ = toObservable(this.profileService.me);
  posts$ = this.postService.getPosts();
  subPosts$ = this.postService.getSubscriptionPosts();
  postMenuMap = new Map<number, boolean>();
  commentsMenuMap = new Map<number, boolean>();
  isCurrentUser!: boolean;
  isLiked!: boolean;
  postText = '';
  showPicker = false;
  showEditModal = false;

  profiles$ = this.route.params
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

  editPost(post: PostModel) {
    this.selectedPost = post;
    this.showEditModal = true;
  }

  onEditModalClose(event: { action: string; content?: string }) {
    if (event.action === 'save' && event.content && this.selectedPost) {
      const updateData = { content: event.content };
      // Оптимистичное обновление (меняем текст сразу)
      const previousContent = this.selectedPost.content;
      this.selectedPost.content = event.content;



      this.postService.updatePost(this.selectedPost.id, updateData).subscribe({
        next: (updatedPost) => {
          // После успеха перезагружаем список, чтобы синхронизировать
          this.posts$ = this.postService.getPosts();
          this.closeEditModal();
        },
        error: (error) => {
          // Откат при ошибке
          if (this.selectedPost) {
            this.selectedPost.content = previousContent;
          }
          console.error('Ошибка при редактировании', error);
          this.closeEditModal();
        }
      });
      this.closeEditModal();
    } else {
      this.closeEditModal();
    }
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedPost = null;
  }

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

  toggleLike(post: PostModel, profileId: number) {
      if (post.likesUsers.includes(profileId.toString())) {
        this.isLiked = true
      }
      else {
        this.isLiked = false;
      }

      if (this.isLiked) {
        post.likesUsers = post.likesUsers.filter(id => id !== post.author.id.toString());
      } else {
        post.likesUsers = [...post.likesUsers, post.author.id.toString()];
      }
      if (post.likes !== undefined) {
              post.likes = post.likesUsers.length;
            }
      const request$ = this.isLiked
        ? this.postService.unlikePost(post.id)
        : this.postService.likePost(post.id);


      request$.subscribe({
        next: (response) => {
          if (response?.likesUsers) {
            post.likesUsers = response.likesUsers;
            if (post.likes !== undefined) {
              post.likes = post.likesUsers.length;
            }
          }
        },
        error: (error) => {
          this.isLiked = true;
          post.likes += this.isLiked ? 1 : -1;
          console.error('Ошибка при изменении лайка', error);
        }
      });
  }

  
}
