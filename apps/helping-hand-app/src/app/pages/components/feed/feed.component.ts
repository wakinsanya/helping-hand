import {
  Component,
  OnInit,
  TemplateRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  Post,
  PostQuery,
  Comment,
  CreatePostDto,
  Profile
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
import { Router } from '@angular/router';
import { ProfileService } from '@helping-hand/core/services/profile.service';

interface PostComment {
  post: Post;
  owner: { firstName: string; lastName: string; pictureUrl: string };
  commentData: {
    isVisible: boolean;
    comments: Comment[];
    commentsTotalCount: number;
  };
  ownerProfile: Profile;
}

@Component({
  selector: 'helping-hand-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {
  postQuery: PostQuery = {
    skip: 0,
    limit: 5,
    orderByVotes: true
  };
  today = new Date();
  userFirstName = '';
  currentPage = 1;
  postsTotalCount = 0;
  createPostDto: CreatePostDto = {
    owner: undefined,
    title: undefined,
    text: undefined,
    media: undefined
  };
  postList: Post[] = [];
  feedDataList: {
    post?: Post;
    ownerFirstName?: string;
    ownerLastName?: string;
    ownerPictureUrl?: string;
    ownerProfile?: Profile;
  }[] = [];
  postCommentList: PostComment[] = [];
  private createPostDialogRef: NbDialogRef<any>;
  private destroy$: Subject<void> = new Subject<void>();

  @ViewChild('welcomeCard', { static: true }) welcomeCard: TemplateRef<any>;
  @ViewChild('welcomeBackCard', { static: true }) welcomeBackCard: TemplateRef<
    any
  >;

  constructor(
    private router: Router,
    private profileService: ProfileService,
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
          const isLoggingIn = JSON.parse(localStorage.getItem('isLoggingIn'));
          if (isLoggingIn) {
            this.dialogService.open(
              user.profile ? this.welcomeBackCard : this.welcomeCard
            );
            localStorage.removeItem('isLoggingIn');
          }
          this.userFirstName = user.firstName;
          this.createPostDto = {
            owner: user._id,
            title: undefined,
            text: undefined,
            media: undefined
          };
        }),
        switchMap(() => this.updateFeedDataList())
      )
      .subscribe({ error: err => console.error(err) });
  }

  updateFeedDataList(): Observable<{}> {
    return this.postService.getPosts(this.postQuery).pipe(
      tap(({ postsTotalCount }) => {
        this.postsTotalCount = postsTotalCount;
      }),
      map(({ posts }) => posts.map(post => ({
         post: {
           ...post,
           createdAt: new Date(post.createdAt),
           updatedAt: new Date(post.updatedAt)
         }
        }))),
      switchMap(posts => from(posts).pipe(filter(x => !!x))),
      mergeMap(data => {
        return forkJoin([
          this.userService.getUserById(data.post.owner).pipe(
            tap(({ firstName, lastName, pictureUrl }) => {
              data['ownerFirstName'] = firstName;
              data['ownerLastName'] = lastName;
              data['ownerPictureUrl'] = pictureUrl;
            })
          ),
          this.profileService
            .getProfileByOwner(data.post.owner)
            .pipe(tap(profile => (data['ownerProfile'] = profile)))
        ]).pipe(map(() => data));
      }),
      toArray(),
      tap(data => (this.feedDataList = data)),
      switchMap(() => of({}))
    );
  }

  // legacy
  // updatePostCommentList(): Observable<{}> {
  //   return this.postService.getPosts(this.postQuery).pipe(
  //     tap(({ postsTotalCount }) => {
  //       this.postsTotalCount = postsTotalCount;
  //     }),
  //     map(({ posts }) => {
  //       return posts.map(entry => ({
  //         post: { ...entry }
  //       }));
  //     }),
  //     switchMap(postCommentList =>
  //       from(postCommentList).pipe(filter(x => !!x && !!x.post))
  //     ),
  //     mergeMap((postComment: PostComment) => {
  //       return forkJoin([
  //         this.userService.getUserById(postComment.post.owner).pipe(
  //           tap(({ firstName, lastName, pictureUrl }) => {
  //             postComment.owner = {
  //               firstName,
  //               lastName,
  //               pictureUrl
  //             };
  //           })
  //         ),
  //         this.commentService
  //           .getComments({
  //             ids: postComment.post.comments,
  //             orderByDate: true,
  //             skip: 0,
  //             limit: 10
  //           })
  //           .pipe(
  //             tap(({ comments, commentsTotalCount }) => {
  //               postComment.commentData = {
  //                 comments,
  //                 isVisible: false,
  //                 commentsTotalCount: commentsTotalCount || 0
  //               };
  //             }),
  //             map(() => postComment)
  //           )
  //       ]).pipe(map(() => postComment));
  //     }),
  //     toArray(),
  //     tap(postComments => (this.postCommentList = postComments)),
  //     switchMap(() => of({}))
  //   );
  // }

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
          switchMap(() => this.updateFeedDataList())
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

  navigateToPost(postIndex: number) {
    const postId = this.feedDataList[postIndex].post._id;
    this.router.navigate(['/pages/posts', postId]);
  }

  onPageNav(direction: 'next' | 'prev') {
    if (direction === 'next') {
      this.postQuery.skip += this.postQuery.limit;
      this.currentPage++;
    } else {
      this.postQuery.skip -= this.postQuery.limit;
      this.currentPage--;
    }
    this.updateFeedDataList().subscribe({ error: e => console.error(e) });
  }

  foo() {
    console.log(this.createPostDto.text);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
