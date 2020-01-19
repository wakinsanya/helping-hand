import { Component, OnInit } from '@angular/core';
import { UserService } from '@helping-hand/core/services/user.service';
import { UserQuery, User } from '@helping-hand/api-common';
import { tap, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'helping-hand-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {
  userQuery: UserQuery = {
    skip: 0,
    limit: 10,
    sort: true
  };
  currentPage = 1;
  userList: User[] = [];
  usersTotalCount: number;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.updateUserList().subscribe({ error: e => console.error(e) });
  }

  updateUserList(): Observable<{}> {
    return this.userService.getUsers(this.userQuery).pipe(
      tap(({ users, usersTotalCount }) => {
        this.userList = users;
        this.usersTotalCount = usersTotalCount;
      }),
      mergeMap(() => of({}))
    );
  }

  onPageNav(direction: 'next' | 'prev') {
    if (direction === 'next') {
      this.userQuery.skip += this.userQuery.limit;
      this.currentPage++;
    } else {
      this.userQuery.skip -= this.userQuery.limit;
      this.currentPage--;
    }
    this.updateUserList().subscribe({ error: e => console.error(e) });
  }
}
