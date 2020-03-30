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
import { tap, switchMap, map, filter } from 'rxjs/operators';
import { UserService } from '@helping-hand/core/services/user.service';
import { ProfileService } from '@helping-hand/core/services/profile.service';
import { Observable, of, forkJoin } from 'rxjs';
import { NbToastrService } from '@nebular/theme';

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
  isPostStarred: boolean;
  isPostFavorited: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private profileService: ProfileService,
    private userService: UserService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit() {
    this.getPost();
    this.userService.loggedInUser$
      .pipe(
        tap(user => (this.loggedInUser = user)),
        map(({ profile }) => profile),
        filter(x => !!x),
        switchMap(profileId => this.profileService.getProfileById(profileId)),
        tap(profile => (this.loggedInUserProfile = profile)),
        tap(() => {
          this.setupPostMetadata();
        })
      )
      .subscribe({ error: err => console.error(err) });
  }

  getPost(): Observable<{}> {
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

  toggleMetadataByKey(key: 'star' | 'favorite') {
    // key is used to handle any post update interaction
    const localKey = key === 'star' ? 'isPostStarred' : 'isPostFavorited';
    const updateKey = key === 'star' ? 'starredPosts' : 'favoritePosts';
    const ownerUpdateKey = key === 'star' ? 'totalStars' : 'totalFavorites';
    this[localKey] = !this[localKey];
    const postMetadata = this.post.metadata || { stars: 0, favorites: 0 };

    const defaultProfileMetadata = {
      totalStars: 0,
      totalFavorites: 0,
      favoritePosts: [],
      starredPosts: []
    };

    const updatePostDto = {
      metadata: {
        ...postMetadata,
        [`${key}s`]: this[localKey]
          ? postMetadata[`${key}s`] + 1
          : Math.max(postMetadata[`${key}s`] - 1, 0)
      }
    } as UpdatePostDto;

    const profileMetadata =
      this.loggedInUserProfile.metadata || defaultProfileMetadata;

    const updateProfileDto = {
      metadata: {
        ...profileMetadata,
        starredPosts: this.isPostStarred
          ? [...profileMetadata[updateKey], this.post._id]
          : profileMetadata[updateKey].filter(x => x !== this.post._id)
      }
    } as UpdateProfileDto;

    // Base operations for post metadata update, and user profile metadata update
    const ops = [
      this.postService.updatePost(this.post._id, updatePostDto),
      this.profileService.updateProfile(
        this.loggedInUser.profile,
        updateProfileDto
      )
    ];

    const ownerProfileMetadata =
      this.postOwnerProfile.metadata || defaultProfileMetadata;
    ops.push(
      this.profileService.updateProfile(this.postOwnerProfile._id, {
        metadata: {
          ...ownerProfileMetadata,
          [ownerUpdateKey]: this[localKey]
            ? ownerProfileMetadata[ownerUpdateKey] + 1
            : Math.max(ownerProfileMetadata[ownerUpdateKey] - 1, 0)
        }
      })
    );

    forkJoin(ops)
      .pipe(
        tap(() => {
          if (this.isPostStarred) {
            this.toastrService.success(
              `We're sending ${this.postOwner.firstName} ` +
                `${this.postOwner.lastName} their star!`
            );
          } else if (this.isPostFavorited) {
            this.toastrService.success(`Added post to your favourites!`);
          }
        })
      )
      .subscribe({ error: err => console.error(err) });
  }

  togglePostFavoriteStatus() {}

  setupPostMetadata() {
    if (
      this.loggedInUserProfile.metadata &&
      this.loggedInUserProfile.metadata.starredPosts
    ) {
      this.isPostStarred =
        this.loggedInUserProfile.metadata.starredPosts.includes(
          this.post._id
        ) || false;
    }
    if (
      this.loggedInUserProfile.metadata &&
      this.loggedInUserProfile.metadata.favoritePosts
    ) {
      this.isPostFavorited =
        this.loggedInUserProfile.metadata.favoritePosts.includes(
          this.post._id
        ) || false;
    }
  }
}
