import {
  Component,
  TemplateRef,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  Post,
  PostQuery,
  CreatePostDto,
  Profile,
  CreateProfileDto,
  ProfileDataKey
} from '@helping-hand/api-common';
import { PostService } from '@helping-hand/core/services/post.service';
import { tap, map, switchMap, filter, mergeMap, toArray } from 'rxjs/operators';
import { from, Subject, Observable, of, forkJoin } from 'rxjs';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { UserService } from '@helping-hand/core/services/user.service';
import { Router } from '@angular/router';
import { ProfileService } from '@helping-hand/core/services/profile.service';

interface FeedData {
  post?: Post;
  ownerFirstName?: string;
  ownerLastName?: string;
  ownerPictureUrl?: string;
  ownerProfile?: Profile;
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
  feedDataList: FeedData[] = [];
  isLoading = false;
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
      owner: this.userService.loggedInUser._id
    };
  }

  ngAfterViewInit() {
    this.welcomeUser()
      .pipe(switchMap(() => this.updateFeedDataList()))
      .subscribe({ error: err => console.error(err) });
  }

  // setup the user profile if this is the first login
  welcomeUser(): Observable<any> {
    const loggedInUser = this.userService.loggedInUser;
    if (loggedInUser && !loggedInUser.profile) {
      this.isLoading = true;
      const profileDto: CreateProfileDto = {
        bio: '',
        publicDataKeys: [ProfileDataKey.Email],
        owner: this.userService.loggedInUser._id,
        data: {
          email: this.userService.loggedInUser.email
        }
      };
      return this.profileService.createProfile(profileDto).pipe(
        switchMap(profile => {
          return this.userService.updateUser(loggedInUser._id, {
            profile: profile._id
          });
        }),
        switchMap(() => this.userService.getUserById(loggedInUser._id)),
        tap(user => {
          this.userService.setLoggedInUser({
            ...user,
            access_token: loggedInUser.access_token
          });
          this.isLoading = false;
        }),
        switchMap(() => this.dialogService.open(this.welcomeCard).onClose)
      );
    } else {
      return of(null);
    }
  }

  // refresh the feed data list
  updateFeedDataList(): Observable<{}> {
    return this.postService.getPosts(this.postQuery).pipe(
      tap(({ postsTotalCount }) => (this.postsTotalCount = postsTotalCount)),
      map(({ posts }) =>
        posts.map(
          post =>
            ({
              post: {
                ...post,
                createdAt: new Date(post.createdAt),
                updatedAt: new Date(post.updatedAt)
              }
            } as FeedData)
        )
      ),
      switchMap(posts => from(posts).pipe(filter(post => !!post))),
      mergeMap(feedDataEntry => {
        return forkJoin([
          this.userService.getUserById(feedDataEntry.post.owner).pipe(
            tap(({ firstName, lastName, pictureUrl }) => {
              feedDataEntry.ownerFirstName = firstName;
              feedDataEntry.ownerLastName = lastName;
              feedDataEntry.ownerPictureUrl = pictureUrl;
            })
          ),
          this.profileService
            .getProfileByOwner(feedDataEntry.post.owner)
            .pipe(tap(profile => (feedDataEntry.ownerProfile = profile)))
        ]).pipe(map(() => feedDataEntry));
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
          error: err => {
            console.error(err);
            this.toastrService.warning(
              'We were unable to create your post, please try again.'
            );
          }
        });
    } else {
      this.toastrService.info(
        'Your post needs to have a title and some content.'
      );
    }
  }

  resetCreatePostBody() {
    this.createPostDto = {
      ...this.createPostDto,
      title: '',
      text: ''
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
