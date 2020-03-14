import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CreatePostDto,
  Post,
  PostQuery,
  UpdatePostDto,
  PostQueryResult
} from '@helping-hand/api-common';
import { Observable } from 'rxjs';
import { queryString } from '@helping-hand/core/helpers/query-string';

@Injectable()
export class PostService {
  constructor(private httpClient: HttpClient) {}

  createPost(postDto: CreatePostDto): Observable<Post> {
    return this.httpClient.post<Post>('api/posts', postDto);
  }

  getPosts(query: PostQuery): Observable<PostQueryResult> {
    console.log('get req!')
    return this.httpClient.get<PostQueryResult>(
      `api/posts${queryString(query)}`
    );
  }

  updatePost(postId: string, postDto: UpdatePostDto): Observable<any> {
    return this.httpClient.patch(`api/posts/${postId}`, postDto);
  }

  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(`api/posts/${postId}`);
  }
}
