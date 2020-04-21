import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
  UserQuery,
  CommentQuery,
  PostQuery,
  ProfileQuery
} from '@helping-hand/api-common';

enum PageDirection {
  Left = 'left',
  Right = 'right'
}

declare type AppQuery = UserQuery | CommentQuery | PostQuery | ProfileQuery;

@Component({
  selector: 'helping-hand-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  @Input() query: AppQuery;
  @Input() resourceTotalCount: number;
  @Output() pageChange = new EventEmitter<{ query: AppQuery; currentPage: number }>();

  currentPage = 0;

  constructor() {}

  ngOnInit() {}

  onPageNav(direction: PageDirection) {
    if (direction === PageDirection.Left) {
      this.query.skip += this.query.limit;
      ++this.currentPage;
    } else {
      this.query.skip -= this.query.limit;
      --this.currentPage;
    }
    this.pageChange.emit({
      query: this.query,
      currentPage: this.currentPage
    });
  }
}
