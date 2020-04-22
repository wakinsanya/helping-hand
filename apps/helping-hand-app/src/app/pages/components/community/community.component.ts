import { Component, OnInit } from '@angular/core';
import { UserService } from '@helping-hand/core/services/user.service';
import { UserQuery, User, Profile } from '@helping-hand/api-common';
import { tap, mergeMap, switchMap, filter, toArray, map } from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';
import { ProfileService } from '@helping-hand/core/services/profile.service';

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

  constructor(
    private userService: UserService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.updateUserList().subscribe({ error: e => console.error(e) });
  }

  updateUserList(): Observable<{}> {
    return this.userService.getUsers(this.userQuery).pipe(
      tap(({ usersTotalCount }) => {
        this.usersTotalCount = usersTotalCount;
      }),
      switchMap(({ users }) => from(users).pipe(filter(x => !!x))),
      mergeMap((user: User) => {
        return this.profileService.getProfileByOwner(user._id).pipe(
          tap((profile: Profile) => (user.profileBody = profile)),
          map(() => user)
        );
      }),
      toArray(),
      tap((users: User[]) => (this.userList = users)),
      switchMap(() => of({}))
    );
  }

  handlePageChange(query: UserQuery) {
    this.userQuery = query;
    this.updateUserList().subscribe({ error: err => console.error(err) });
  }
}
