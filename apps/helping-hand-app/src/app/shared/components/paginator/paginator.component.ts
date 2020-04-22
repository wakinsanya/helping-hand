import { Component, Output, EventEmitter, Input } from '@angular/core';
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
export class PaginatorComponent {
  @Input() query: AppQuery;
  @Input() resourceTotalCount: number;
  @Output() pageChange = new EventEmitter<AppQuery>();

  currentPage = 1;
  paginationDirection = PageDirection;

  onPageNav(direction: PageDirection) {
    if (direction === PageDirection.Left) {
      this.query.skip = Math.max(0, this.query.skip - this.query.limit);
      this.currentPage = Math.max(1, this.currentPage - 1);
    } else {
      this.query.skip += this.query.limit;
      this.currentPage += 1;
    }
    this.pageChange.emit(this.query);
  }
}
