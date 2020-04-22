import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from '@helping-hand/core/services/comment.service';
import {
  CommentQuery,
  Comment,
  Profile,
  UpdateCommentDto
} from '@helping-hand/api-common';
import { Observable, from, forkJoin } from 'rxjs';
import { tap, map, switchMap, filter, mergeMap, toArray } from 'rxjs/operators';
import { ProfileService } from '@helping-hand/core/services/profile.service';
import { UserService } from '@helping-hand/core/services/user.service';
import { NbToastrService } from '@nebular/theme';
import { DialogService } from '@helping-hand/core/services/dialog.service';
import { ActivatedRoute } from '@angular/router';

interface CommentUser {
  comment: Comment;
  profile: Profile;
  userInfo: {
    userId: string;
    firstName: string;
    lastName: string;
    pictureUrl: string;
  };
}

@Component({
  selector: 'helping-hand-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
  commentQuery: CommentQuery;
  commentsTotalCount: number;
  commentUserList: CommentUser[] = [];
  commentBody = {
    post: '',
    text: '',
    owner: '',
    metadata: {
      stars: 0
    }
  };

  constructor(
    private readonly userService: UserService,
    private readonly dialogService: DialogService,
    private readonly toastrService: NbToastrService,
    private readonly commentService: CommentService,
    private readonly profileService: ProfileService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const post = this.activatedRoute.snapshot.paramMap.get('postId');
    this.commentQuery = {
      post,
      sort: true,
      skip: 0,
      limit: 2
    };
    this.commentBody.post = post;
    this.commentBody.owner = this.userService.loggedInUser._id;
    this.getComments().subscribe({ error: err => console.error(err) });
  }

  getComments(): Observable<{}> {
    return this.commentService.getComments(this.commentQuery).pipe(
      tap(({ commentsTotalCount }) => {
        this.commentsTotalCount = commentsTotalCount;
      }),
      map(({ comments }) => comments.map(comment => ({ comment }))),
      switchMap((commentList: CommentUser[]) =>
        from(commentList).pipe(filter(entry => !!entry))
      ),
      mergeMap(entry => {
        return forkJoin([
          this.profileService
            .getProfileByOwner(entry.comment.owner)
            .pipe(tap(profile => (entry.profile = profile))),
          this.userService.getUserById(entry.comment.owner).pipe(
            tap(user => {
              entry.userInfo = {
                userId: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                pictureUrl: user.pictureUrl
              };
            })
          )
        ]).pipe(map(() => entry));
      }),
      toArray(),
      tap((data: CommentUser[]) => {
        this.commentUserList = data.map(entry => ({
          ...entry,
          comment: {
            ...entry.comment,
            createdAt: new Date(entry.comment.createdAt)
          }
        }));
      })
    );
  }

  createComment() {
    if (this.commentBody.text && this.commentBody.owner) {
      this.commentService
        .createComment(this.commentBody)
        .pipe(
          switchMap(() => this.getComments()),
          tap(() => {
            this.commentBody.text = '';
            this.toastrService.show('Your comment has been posted');
          })
        )
        .subscribe({ error: err => console.error(err) });
    }
  }

  deleteComment(commentId: string) {
    this.dialogService
      .confirm()
      .pipe(
        filter(({ confirmed }) => confirmed),
        switchMap(() => this.commentService.deleteComment(commentId)),
        tap(() => {
          this.toastrService.success(`We've deleted your comment`);
        }),
        switchMap(() => this.getComments())
      )
      .subscribe({ error: err => console.error(err) });
  }

  startCommentEdit(commentIndex: number) {}

  saveCommentEdit(commentId: string, commentDto: UpdateCommentDto) {
    this.commentService
      .updateComment(commentId, commentDto)
      .pipe(
        tap(() => {
          this.toastrService.success(`Done! We've updated your comment`);
        })
      )
      .subscribe({
        error: err => {
          this.toastrService.warning(
            'We were not able to save your changes at this time, please try again.'
          );
          console.error(err);
        }
      });
  }

  handlePageChange(query: CommentQuery) {
    this.commentQuery = query;
    this.getComments().subscribe({ error: err => console.error(err) });
  }
}
