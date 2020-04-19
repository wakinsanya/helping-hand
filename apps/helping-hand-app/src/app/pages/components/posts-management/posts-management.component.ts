import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { UserService } from '@helping-hand/core/services/user.service';
import { PostService } from '@helping-hand/core/services/post.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { User, PostQuery, Post, UpdatePostDto } from '@helping-hand/api-common';
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
  quillModuleConfig = {};
  postsTotalCount: number;
  postQuery: PostQuery = {
    skip: 0,
    limit: 5
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

  confirmPostDeletion(postIndex: number, tempalate: TemplateRef<any>) {
    this.dialogService.open(tempalate, { context: { postIndex } });
  }

  deleteUserPost(postIndex: number, dialogRef: NbDialogRef<any>) {
    const postId = this.posts[postIndex]._id;
    this.postService
      .deletePost(postId)
      .pipe(
        tap(() => {
          dialogRef.close();
          this.toastrService.success(`We've deleted your post.`);
          this.posts = this.posts.filter(({ _id }) => _id !== postId);
        })
      )
      .subscribe({
        error: err => {
          dialogRef.close();
          this.toastrService.warning(
            'Something went wrong and we could not delete your post, please try again.'
          );
          console.error(err);
        }
      });
  }

  openPostEditDialog(template: TemplateRef<any>, postIndex: number) {
    const editablePost = { ...this.posts[postIndex] };
    this.dialogService.open(template, {
      context: { post: editablePost, postIndex }
    });
  }

  commitPostEdit(post: Post, postIndex: number, dialogRef: NbDialogRef<any>) {
    const { _id, title, text } = post;
    this.postService
      .updatePost(_id, { title, text })
      .pipe(
        tap(() => {
          this.posts[postIndex] = post;
          this.toastrService.success('Your post has been successfully updated');
          dialogRef.close();
        })
      )
      .subscribe({
        error: err => {
          console.error(err);
          dialogRef.close();
          this.toastrService.danger(
            'We were unable to save your changes, please try agian.'
          );
        }
      });
  }
}
