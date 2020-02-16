import { Component, OnInit } from '@angular/core';
import {
  Post,
  PostQuery,
  Comment
} from '@helping-hand/api-common';
import { PostService } from '@helping-hand/core/services/post.service';
import { CommentService } from '@helping-hand/core/services/comment.service';
import { tap, map, switchMap, filter, mergeMap, toArray } from 'rxjs/operators';
import { from } from 'rxjs';

interface PostComment {
  post: Post;
  commentData: {
    comments: Comment[];
    commentsTotalCount: number;
  };
}

@Component({
  selector: 'helping-hand-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  postQuery: PostQuery = {
    skip: 0,
    limit: 10,
    orderByVotes: true
  };
  postsTotalCount = 0;
  postCommentList: PostComment[];

  constructor(
    private postService: PostService,
    private commentService: CommentService
  ) {}

  ngOnInit() {
    this.postService.getPosts(this.postQuery).pipe(
      tap(({ postsTotalCount }) => {
        this.postsTotalCount = postsTotalCount;
      }),
      map(({ posts }) => posts.map(x => ({ post: x }))),
      switchMap(postCommentList =>
        from(postCommentList).pipe(filter(x => !!x))
      ),
      mergeMap((postComment: PostComment) => {
        return this.commentService
          .getComments({
            ids: postComment.post.comments,
            orderByDate: true
          })
          .pipe(
            tap(({ comments, commentsTotalCount }) => {
              postComment.commentData = {
                comments,
                commentsTotalCount
              };
            }),
            map(() => postComment)
          );
      }),
      toArray(),
      tap(postComments => (this.postCommentList = postComments))
    );
  }
}
