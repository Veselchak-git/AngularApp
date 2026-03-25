import { HttpClient } from '@angular/common/http';
import { inject, Injectable} from '@angular/core';
import { Post } from '../interfaces/post.interface';
import { BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  http = inject(HttpClient);
  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  postsSubject = new BehaviorSubject<Post[]>([]);
  posts$ = this.postsSubject.asObservable();

  createPost(postData: Partial<Post>): Observable<Post> {
    return this.http.post<Post>(`${this.baseApiUrl}post/`, postData);
  }

  updatePost(postId: number, updateData: Partial<Post>): Observable<Post> {
    return this.http.patch<Post>(`${this.baseApiUrl}post/${postId}`, updateData);
  }
  getPosts() {
      return this.http.get<Post[]>(`${this.baseApiUrl}post/`)
    }
  deletePost(postId: number): Observable<void> {
      return this.http.delete<void>(`${this.baseApiUrl}post/${postId}`);
    }

  getSubscriptionPosts(){
      return this.http.get<Post[]>(`${this.baseApiUrl}post/my_subscriptions`)
    }

  getPostById(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseApiUrl}post/${postId}`);
  }

  createComment(postData: Partial<Post>): Observable<Post> {
    return this.http.post<Post>(`${this.baseApiUrl}comment/`, postData);
  }

  getComment() {

  }

  editComment() {

  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}comment/${commentId}`);
  }

  likePost(postId: number): Observable<Post> {
    return this.http.post<Post>(`${this.baseApiUrl}post/like/${postId}`, {});
  }
  unlikePost(postId: number): Observable<Post> {
    return this.http.delete<Post>(`${this.baseApiUrl}post/like/${postId}`);
  }
}
