import { Component, inject, Input, input } from '@angular/core';
import { PostService } from '../../../data/services/post-service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { ImgUrlPipe } from "../../../helpers/pipes/img-url-pipe";

@Component({
  selector: 'app-post',
  imports: [AsyncPipe, DatePipe, ImgUrlPipe],
  standalone: true,
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post {
  postService = inject(PostService);
  route = inject(ActivatedRoute);
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
}
