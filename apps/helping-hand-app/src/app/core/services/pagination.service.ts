import { Injectable } from '@angular/core';
import {
  UserQuery,
  CommentQuery,
  PostQuery,
  ProfileQuery,
  SubscriptionQuery
} from '@helping-hand/api-common';
import { CommentService } from './comment.service';

declare type AppQuery = UserQuery | CommentQuery | PostQuery | ProfileQuery;

export enum PageDirection {
  Left = 'left',
  Right = 'right'
}

@Injectable({ providedIn: 'root' })
export class PaginationService {
  constructor(private commentService: CommentService) {}

  resolve(data: {
    direction: PageDirection;
    query: AppQuery;
    currentPage: number;
  }): {
    query: AppQuery;
    currentPage: number;
  } {
    switch (data.direction) {
      case PageDirection.Right:
        data.query.skip += data.query.limit;
        ++data.currentPage;
        break;
      case PageDirection.Left:
        data.query.skip -= data.query.limit;
        --data.currentPage;
        break;
      default:
        throw new Error('Invalid page direciton');
    }
    return { query: data.query, currentPage: Math.max(1, data.currentPage) };
  }
}
