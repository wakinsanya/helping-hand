import { Component, OnInit } from '@angular/core';
import { PostService } from '@helping-hand/core/services/post.service';
import { Post } from '@helping-hand/api-common';
import { ActivatedRoute } from '@angular/router';
import { tap, switchMap } from 'rxjs/operators';
import { UserService } from '@helping-hand/core/services/user.service';

@Component({
  selector: 'helping-hand-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  post: Post;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getPost();
  }

  getPost() {
    const postId = this.activatedRoute.snapshot.paramMap.get('postId');
    this.postService
      .getPostById(postId)
      .pipe(
        tap(post => (this.post = post)),
        switchMap(() => {
          return this.
        })
      )
      .subscribe({ error: err => console.error(err) });
  }
}
