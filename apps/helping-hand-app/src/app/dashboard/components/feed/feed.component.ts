import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import {
  Post,
  PostQuery,
  Comment,
  CreatePostDto
} from '@helping-hand/api-common';
import { PostService } from '@helping-hand/core/services/post.service';
import { CommentService } from '@helping-hand/core/services/comment.service';
import {
  tap,
  map,
  switchMap,
  filter,
  mergeMap,
  toArray,
  takeUntil
} from 'rxjs/operators';
import { from, Subject, Observable, of, forkJoin } from 'rxjs';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { UserService } from '@helping-hand/core/services/user.service';

interface PostComment {
  post: Post;
  owner: { firstName: string; lastName: string; pictureUrl: string };
  commentData: {
    isVisible: boolean;
    comments: Comment[];
    commentsTotalCount: number;
  };
}

@Component({
  selector: 'helping-hand-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {
  postQuery: PostQuery = {
    skip: 0,
    limit: 10,
    orderByVotes: true
  };
  postsTotalCount = 0;
  createPostDto: CreatePostDto = {
    owner: undefined,
    title: undefined,
    text: undefined,
    media: undefined
  };
  postCommentList: PostComment[] = [];
  private createPostDialogRef: NbDialogRef<any>;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private toastrService: NbToastrService,
    private userService: UserService,
    private postService: PostService,
    private commentService: CommentService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit() {
    this.userService.loggedInUser$
      .pipe(
        takeUntil(this.destroy$),
        tap(user => {
          this.createPostDto = {
            owner: user._id,
            title: undefined,
            text: undefined,
            media: undefined
          };
        }),
        switchMap(() => this.updatePostCommentList())
      )
      .subscribe({ error: e => console.error(e) });
  }

  updatePostCommentList(): Observable<{}> {
    return this.postService.getPosts(this.postQuery).pipe(
      tap(({ postsTotalCount }) => {
        this.postsTotalCount = postsTotalCount;
      }),
      map(({ posts }) => posts.map(x => ({ post: x }))),
      switchMap(postCommentList =>
        from(postCommentList).pipe(filter(x => !!x && !!x.post))
      ),
      mergeMap((postComment: PostComment) => {
        return forkJoin([
          this.userService.getUserById(postComment.post.owner).pipe(
            tap(({ firstName, lastName, pictureUrl }) => {
              postComment.owner = {
                firstName,
                lastName,
                pictureUrl
              };
            })
          ),
          this.commentService
            .getComments({
              ids: postComment.post.comments,
              orderByDate: true,
              skip: 0,
              limit: 10
            })
            .pipe(
              tap(({ comments, commentsTotalCount }) => {
                postComment.commentData = {
                  comments,
                  isVisible: false,
                  commentsTotalCount: commentsTotalCount || 0
                };
              }),
              map(() => postComment)
            )
        ]).pipe(map(() => postComment));
      }),
      toArray(),
      tap(postComments => (this.postCommentList = postComments)),
      switchMap(() => of({}))
    );
  }

  createPost() {
    if (this.createPostDto.owner && this.createPostDto.title) {
      this.postService
        .createPost(this.createPostDto)
        .pipe(
          tap(() => {
            this.resetCreatePostBody();
            this.createPostDialogRef.close();
            this.toastrService.success('Your post has been created!');
          }),
          switchMap(() => this.updatePostCommentList())
        )
        .subscribe({
          error: e => {
            console.error(e);
            this.toastrService.warning(
              'We were unable to create your post, please try again.'
            );
          }
        });
    } else {
      this.toastrService.info('A post must have at minimum a title.');
    }
  }

  resetCreatePostBody() {
    this.createPostDto = {
      ...this.createPostDto,
      title: undefined,
      text: undefined,
      media: undefined
    };
  }

  startPostCreation(template: TemplateRef<any>) {
    this.createPostDialogRef = this.dialogService.open(template);
  }

  toggleCommentVisibility(postCommentIndex: number) {
    if (this.postCommentList[postCommentIndex]) {
      this.postCommentList[postCommentIndex].commentData.isVisible = !this
        .postCommentList[postCommentIndex].commentData.isVisible;
    } else {
      throw new Error('Post comment does not exist');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
