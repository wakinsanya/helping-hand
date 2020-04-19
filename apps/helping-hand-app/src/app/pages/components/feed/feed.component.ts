import {
  Component,
  OnInit,
  TemplateRef,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  Post,
  PostQuery,
  Comment,
  CreatePostDto,
  Profile,
  CreateProfileDto,
  ProfileDataKey,
  User
} from '@helping-hand/api-common';
import { PostService } from '@helping-hand/core/services/post.service';
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
export class FeedComponent implements AfterViewInit, OnDestroy {
  postQuery: PostQuery = {
    skip: 0,
    limit: 5,
    orderByVotes: true
  };
  today = new Date();
  userFirstName = '';
  currentPage = 1;
  postsTotalCount = 0;
  createPostDto: CreatePostDto;
  postList: Post[] = [];
  feedDataList: {
    post?: Post;
    ownerFirstName?: string;
    ownerLastName?: string;
    ownerPictureUrl?: string;
    ownerProfile?: Profile;
  }[] = [];
  isLoading = false;
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
    private dialogService: NbDialogService
  ) {
    this.createPostDto = {
      title: '',
      text: '',
      owner: (this.userService.loggedInUser || { _id: undefined })._id
    };
  }

  ngAfterViewInit() {
    this.welcomeUser().subscribe({ error: err => console.error(err) });
  }

  welcomeUser(): Observable<any> {
    const loggedInUser = this.userService.loggedInUser;
    if (loggedInUser && !loggedInUser.profile) {
      this.isLoading = true;
      const profileDto: CreateProfileDto = {
        owner: this.userService.loggedInUser._id,
        bio: '',
        publicDataKeys: [ProfileDataKey.Email],
        data: {
          email: this.userService.loggedInUser.email
        }
      };
      return this.profileService.createProfile(profileDto).pipe(
        switchMap((profile: Profile) => {
          return this.userService.updateUser(loggedInUser._id, {
            profile: profile._id
          });
        }),
        switchMap(() => {
          return this.userService.getUserById(loggedInUser._id);
        }),
        tap((user: User) => {
          this.userService.setLoggedInUser(user);
          this.isLoading = false;
        }),
        switchMap(() => this.dialogService.open(this.welcomeCard).onClose),
        tap(() => {
          window.location.reload();
        })
      );
    } else {
      return of(null);
    }
  }

  updateFeedDataList(): Observable<{}> {
    return this.postService.getPosts(this.postQuery).pipe(
      tap(({ postsTotalCount }) => {
        this.postsTotalCount = postsTotalCount;
      }),
      map(({ posts }) =>
        posts.map(post => ({
          post: {
            ...post,
            createdAt: new Date(post.createdAt),
            updatedAt: new Date(post.updatedAt)
          }
        }))
      ),
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
    this.updateFeedDataList().subscribe({ error: err => console.error(err) });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
