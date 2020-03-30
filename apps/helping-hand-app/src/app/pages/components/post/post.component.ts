import { Component, OnInit } from '@angular/core';
import { PostService } from '@helping-hand/core/services/post.service';
import {
  Post,
  User,
  Profile,
  ProfileDataKey,
  UpdatePostDto
} from '@helping-hand/api-common';
import { ActivatedRoute } from '@angular/router';
import { tap, switchMap, map, filter } from 'rxjs/operators';
import { UserService } from '@helping-hand/core/services/user.service';
import { ProfileService } from '@helping-hand/core/services/profile.service';
import { Observable, of } from 'rxjs';

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
    private userService: UserService
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

  togglePostStarStatus() {
    const metadata = this.loggedInUserProfile.metadata || {};
    let updatePostDto: UpdatePostDto;
    if (this.isPostStarred) {
      updatePostDto = {
        metadata: {
          ...metadata,
          starredPosts: (metadata['starredPosts'] || []).push(this.post._id)
        }
      } as UpdatePostDto;
    } else {
      updatePostDto = {
        metadata: {
          ...metadata,
          starredPosts: (metadata['starredPosts'] || []).filter(
            (x: string) => x !== this.post._id
          )
        }
      } as UpdatePostDto;
    }
    this.isPostStarred = !this.isPostStarred;
    this.postService.updatePost(this.post._id, updatePostDto)
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
      this.isPostStarred =
        this.loggedInUserProfile.metadata.favoritePosts.includes(
          this.post._id
        ) || false;
    }
  }
}
