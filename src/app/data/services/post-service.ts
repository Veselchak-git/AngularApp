import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Post } from '../interfaces/post.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';

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

  getPosts(){
    return this.http.get<Post[]>(`${this.baseApiUrl}post/`)
  }

  getPostById(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseApiUrl}post/${postId}`);
  }

  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}post/${postId}`);
  }
}
