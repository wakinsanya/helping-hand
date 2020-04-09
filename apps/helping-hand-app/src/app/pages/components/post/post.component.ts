import { Component, OnInit } from '@angular/core';
import { PostService } from '@helping-hand/core/services/post.service';
import {
  Post,
  User,
  Profile,
  UpdatePostDto,
  UpdateProfileDto
} from '@helping-hand/api-common';
import { ActivatedRoute } from '@angular/router';
import { tap, switchMap, map, filter, first } from 'rxjs/operators';
import { UserService } from '@helping-hand/core/services/user.service';
import { ProfileService } from '@helping-hand/core/services/profile.service';
import { Observable, of, forkJoin } from 'rxjs';
import { NbToastrService } from '@nebular/theme';

enum PostActionType {
  Star = 'star',
  Favorite = 'favorite',
  Unstar = 'unstar',
  Unfavorite = 'unfavorite'
}

@Component({
  selector: 'helping-hand-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  post: Post;
  postOwner: User;
  loggedInUser: User;
  postOwnerProfile: Profile;
  loggedInUserProfile: Profile;
  isPostStarred = false;
  isPostFavorited = false;
  postActionType = PostActionType;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private profileService: ProfileService,
    private userService: UserService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit() {
    forkJoin([
      this.getPostAndOwner(),
      this.userService.loggedInUser$.pipe(
        first(),
        tap(user => (this.loggedInUser = user)),
        map(({ profile }) => profile),
        filter(x => !!x),
        switchMap(profileId => this.profileService.getProfileById(profileId)),
        tap(profile => (this.loggedInUserProfile = profile))
      )
    ])
      .pipe(tap(() => this.setupPostMetadata()))
      .subscribe({ error: err => console.error(err) });
  }

  getPostAndOwner(): Observable<{}> {
    const postId = this.activatedRoute.snapshot.paramMap.get('postId');
    return this.postService.getPostById(postId).pipe(
      tap(post => (this.post = post)),
      switchMap(() => {
        return this.userService.getUserById(this.post.owner);
      }),
      tap(user => (this.postOwner = user)),
      switchMap(({ _id }) => this.profileService.getProfileByOwner(_id)),
      tap(profile => (this.postOwnerProfile = profile)),
      switchMap(() => of({}))
    );
  }

  toggleMetadataByKey(action: PostActionType) {
    const jobs: Observable<any>[] = [];
    const defaultProfileMetadata = {
      totalStars: 0,
      totalFavorites: 0,
      favoritePosts: new Array<string>(),
      starredPosts: new Array<string>()
    };
    const defaultPostMetadata = {
      stars: 0,
      favorites: 0
    };

    const postMetadata = this.post.metadata || defaultPostMetadata;
    const userProfileMetadata =
      this.loggedInUserProfile.metadata || defaultProfileMetadata;
    const ownerProfileMetadata =
      this.postOwnerProfile.metadata || defaultProfileMetadata;

    switch (action) {
      case PostActionType.Star:
        jobs.push(
          this.updatePostMetadata(this.post._id, {
            ...postMetadata,
            stars: postMetadata.stars + 1
          }),
          this.updateProfileMetadata(this.loggedInUserProfile._id, {
            ...userProfileMetadata,
            starredPosts: [...userProfileMetadata.starredPosts, this.post._id]
          }),
          this.updateProfileMetadata(this.postOwnerProfile._id, {
            ...ownerProfileMetadata,
            totalStars: ownerProfileMetadata.totalStars + 1
          })
        );
        break;
      case PostActionType.Unstar:
        jobs.push(
          this.updatePostMetadata(this.post._id, {
            ...postMetadata,
            stars: Math.max(postMetadata.stars - 1, 0)
          }),
          this.updateProfileMetadata(this.loggedInUserProfile._id, {
            ...userProfileMetadata,
            starredPosts: userProfileMetadata.starredPosts.filter(
              post => post !== this.post._id
            )
          }),
          this.updateProfileMetadata(this.postOwnerProfile._id, {
            ...ownerProfileMetadata,
            totalStars: Math.max(ownerProfileMetadata.totalStars - 1, 0)
          })
        );
        break;
      case PostActionType.Favorite:
        jobs.push(
          this.updatePostMetadata(this.post._id, {
            ...postMetadata,
            favorites: postMetadata.favorites + 1
          }),
          this.updateProfileMetadata(this.loggedInUserProfile._id, {
            ...userProfileMetadata,
            favoritePosts: [...userProfileMetadata.favoritePosts, this.post._id]
          }),
          this.updateProfileMetadata(this.postOwnerProfile._id, {
            ...ownerProfileMetadata,
            totalFavorites: ownerProfileMetadata.totalFavorites + 1
          })
        );
        break;
      case PostActionType.Unfavorite:
        jobs.push(
          this.updatePostMetadata(this.post._id, {
            ...postMetadata,
            favorites: Math.max(postMetadata.favorites - 1, 0)
          }),
          this.updateProfileMetadata(this.loggedInUserProfile._id, {
            ...userProfileMetadata,
            favoritePosts: userProfileMetadata.favoritePosts.filter(
              post => post !== this.post._id
            )
          }),
          this.updateProfileMetadata(this.postOwnerProfile._id, {
            ...ownerProfileMetadata,
            totalFavorites: Math.max(ownerProfileMetadata.totalFavorites - 1, 0)
          })
        );
        break;
      default:
      throw new Error('Unknown action type');
    }

    forkJoin(jobs)
      .pipe(
        switchMap(() => {
          return forkJoin([
            this.profileService
              .getProfileById(this.loggedInUserProfile._id)
              .pipe(tap(profile => (this.loggedInUserProfile = profile))),
            this.profileService
              .getProfileById(this.postOwnerProfile._id)
              .pipe(tap(profile => (this.postOwnerProfile = profile)))
          ]);
        }),
        tap(() => this.setupPostMetadata())
      )
      .subscribe({ error: err => console.error(err) });
  }

  updatePostMetadata(
    postId: string,
    metadata: {
      stars: number;
      favorites: number;
    }
  ): Observable<{}> {
    return of({});
  }

  updateProfileMetadata(
    profileId: string,
    metadata: {
      totalStars: number;
      totalFavorites: number;
      favoritePosts: string[];
      starredPosts: string[];
    }
  ): Observable<Profile> {
    return this.profileService.updateProfile(profileId, { metadata }).pipe(
      switchMap(() => {
        return this.profileService.getProfileById(profileId);
      })
    );
  }

  setupPostMetadata() {
    if (
      this.loggedInUserProfile.metadata &&
      this.loggedInUserProfile.metadata.starredPosts
    ) {
      this.isPostStarred = this.loggedInUserProfile.metadata.starredPosts.includes(
        this.post._id
      );
    }
    if (
      this.loggedInUserProfile.metadata &&
      this.loggedInUserProfile.metadata.favoritePosts
    ) {
      this.isPostFavorited = this.loggedInUserProfile.metadata.favoritePosts.includes(
        this.post._id
      );
    }
  }
}
