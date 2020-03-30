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
        switchMap(() => this.getPost()),
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
      switchMap(() => of({}))
    );
  }

  toggleMetadataByKey(key: 'star' | 'favorite') {
    // key is used to handle any post update interaction
    const localKey = key === 'star' ? 'isPostStarred' : 'isPostFavorited';
    const updateKey = key === 'star' ? 'starredPosts' : 'favoritePosts';
    this[localKey] = !this[localKey];
    const postMetadata = this.post.metadata || { stars: 0, favorites: 0 };

    const updatePostDto = {
      metadata: {
        ...postMetadata,
        [`${key}s`]: this.isPostStarred
          ? postMetadata[`${key}s`] + 1
          : Math.max(postMetadata[`${key}s`] - 1, 0)
      }
    } as UpdatePostDto;

    const profileMetadata = this.loggedInUserProfile.metadata || {
      totalStars: 0,
      totalFavorites: 0,
      favoritePosts: [],
      starredPosts: []
    };

    const updateProfileDto = {
      ...profileMetadata,
      starredPosts: this.isPostStarred
        ? [...profileMetadata[updateKey], this.post._id]
        : profileMetadata[updateKey].filter(x => x !== this.post._id)
    } as UpdateProfileDto;

    // Base operations for post metadata update, and user profile metadata update
    const ops = [
      this.postService.updatePost(this.post._id, updatePostDto),
      this.profileService.updateProfile(
        this.loggedInUser.profile,
        updateProfileDto
      )
    ];

    // If the action is a star, then also queue an update for the post owner profile
    if (key === 'star') {
      ops.push()
    }


    forkJoin([
      this.postService.updatePost(this.post._id, updatePostDto),
      this.profileService.updateProfile(
        this.postOwner.profile,
        updateProfileDto
      )
    ])
      .pipe(
        tap(() => {
          if (this.isPostStarred) {
            this.toastrService.success(
              `We're sending ${this.postOwner.firstName} ` +
                `${this.postOwner.lastName} their star!`
            );
          }
        })
      )
      .subscribe({ error: err => console.error(err) });
    // const metadata = this.loggedInUserProfile.metadata || {};

    // let updatePostDto: UpdatePostDto;
    // if (this.isPostStarred) {
    //   updatePostDto = {
    //     metadata: {
    //       ...metadata,
    //       starredPosts: (metadata['starredPosts'] || []).push(this.post._id)
    //     }
    //   } as UpdatePostDto;
    // } else {
    //   updatePostDto = {
    //     metadata: {
    //       ...metadata,
    //       starredPosts: (metadata['starredPosts'] || []).filter(
    //         (x: string) => x !== this.post._id
    //       )
    //     }
    //   } as UpdatePostDto;
    // }
    // console.log({
    //   POST_DTO: updatePostDto
    // })
    // this.isPostStarred = !this.isPostStarred;
    // this.postService
    //   .updatePost(this.post._id, updatePostDto)
    //   .subscribe({ error: err => console.error(err) });
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
    console.log({
      isFav: this.isPostFavorited,
      isStar: this.isPostStarred
    });
  }
}
