import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CreateCommentDto,
  Comment,
  CommentQuery,
  UpdateCommentDto,
  CommentQueryResult
} from '@helping-hand/api-common';
import { Observable } from 'rxjs';
import { queryString } from '@helping-hand/core/helpers/query-string';

@Injectable()
export class CommentService {
  constructor(private httpClient: HttpClient) {}

  createComment(commentDto: CreateCommentDto): Observable<Comment> {
    return this.httpClient.post<Comment>('api/comments', commentDto);
  }

  getComments(query: CommentQuery): Observable<CommentQueryResult> {
    return this.httpClient.get<CommentQueryResult>(
      `api/comments${queryString(query)}`
    );
  }

  updateComment(commentId: string, commentDto: UpdateCommentDto): Observable<any> {
    return this.httpClient.patch(`api/comments/${commentId}`, commentDto);
  }

  deleteComment(commentId: string): Observable<any> {
    return this.httpClient.delete(`api/comments/${commentId}`);
  }
}
