import { Component, OnInit } from '@angular/core';
import { UserService } from '@helping-hand/core/services/user.service';
import { UserQuery, User } from '@helping-hand/api-common';
import { Observable, of } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'helping-hand-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  private userQuery: UserQuery = {
    skip: 0,
    limit: 10,
    sort: true
  };
  userList: User[] = [];
  usersTotalCount: number;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.updateUserList().subscribe({ error: e => console.error(e) })
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

}
