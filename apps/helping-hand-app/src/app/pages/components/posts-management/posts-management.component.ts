import { Component, OnInit } from '@angular/core';
import { UserService } from '@helping-hand/core/services/user.service';
import { PostService } from '@helping-hand/core/services/post.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { User, PostQuery, Post } from '@helping-hand/api-common';
import { first, tap, switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

@Component({
  selector: 'helping-hand-posts-management',
  templateUrl: './posts-management.component.html',
  styleUrls: ['./posts-management.component.scss']
})
export class PostsManagementComponent implements OnInit {
  loggedInUser: User;
  posts: Post[] = [];
  currentPage = 1;
  postsTotalCount: number;
  postQuery: PostQuery = {
    skip: 0,
    limit: 5,
    orderByVotes: true
  };

  constructor(
    private userService: UserService,
    private postService: PostService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit() {
    this.userService.loggedInUser$
      .pipe(
        first(),
        tap(user => {
          this.loggedInUser = user;
          this.postQuery.owner = user._id;
        }),
        switchMap(() => {
          if (this.postQuery.owner) {
            return of({});
          } else {
            this.toastrService.warning(
              'Something went wrong, please refresh the page.'
            );
            return throwError(new Error('Current user could not be resolved'));
          }
        }),
        switchMap(() => this.getUserPosts())
      )
      .subscribe({ error: err => console.error(err) });
  }

  getUserPosts() {
    return this.postService.getPosts(this.postQuery).pipe(
      tap(({ postsTotalCount, posts }) => {
        this.postsTotalCount = postsTotalCount;
        this.posts = posts;
      })
    );
  }

  onPageNav(direction: 'prev' | 'next') {
    if (direction === 'next') {
      this.postQuery.skip += this.postQuery.limit;
      this.currentPage++;
    } else {
      this.postQuery.skip -= this.postQuery.limit;
      this.currentPage--;
    }
    this.getUserPosts().subscribe({ error: err => console.error(err) });
  }

  deleteUserPost(postIndex: number) {
    const postId = this.posts[postIndex]._id;
    this.postService
      .deletePost(postId)
      .pipe(
        tap(() => {
          this.toastrService.success(`We've deleted your post.`);
          this.posts = this.posts.filter(({ _id }) => _id !== postId);
        })
      )
      .subscribe({ error: err => console.error(err) });
  }
}
