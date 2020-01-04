import { Component, OnInit } from '@angular/core';
import { UserService } from '@helping-hand/core/services/user.service';
import { UserQuery, User } from '@helping-hand/api-common';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'helping-hand-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {
  userLimit = 10;

  private userQuery: UserQuery = {
    sort: true,
    skip: 0,
    limit: 10
  }
  users: User[] = [];
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers()
      .pipe(
        tap((users: User[]) => (this.users = users))
      ).subscribe({ error: e => console.error(e) })
  }

}
