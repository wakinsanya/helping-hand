import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavorService } from '@helping-hand/core/services/favor.service';
import {
  User,
  FavorQuery,
  Favor,
  FavorQueryResult
} from '@helping-hand/api-common';
import { Observable, of, Subject, from } from 'rxjs';
import {
  tap,
  mergeMap,
  takeUntil,
  switchMap,
  map,
  toArray
} from 'rxjs/operators';
import { UserService } from '@helping-hand/core/services/user.service';

@Component({
  selector: 'helping-hand-favor-request-list',
  templateUrl: './favor-request-list.component.html',
  styleUrls: ['./favor-request-list.component.scss']
})
export class FavorRequestListComponent implements OnInit, OnDestroy {
  loggedInUser: User;
  favorQuery: FavorQuery;
  favorList: Favor[] = [];
  favorsTotalCount: number;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
    private favorService: FavorService
  ) {}

  ngOnInit() {
    this.userService.loggedInUser$
      .pipe(
        takeUntil(this.destroy$),
        tap((user: User) => {
          this.loggedInUser = user;
          this.favorQuery = {
            notOwners: [user._id],
            sort: true,
            skip: 0,
            limit: 10
          };
        }),
        mergeMap(() => this.updateFavorsAndOwners())
      )
      .subscribe({ error: e => console.error(e) });
  }

  updateFavorsAndOwners() {
    return this.favorService.getFavors(this.favorQuery).pipe(
      tap((data: FavorQueryResult) => {
        this.favorsTotalCount = data.favorsTotalCount;
      }),
      switchMap((data: FavorQueryResult) => {
        return from(data.favors);
      }),
      mergeMap((favor: Favor) => {
        return this.userService.getUserById(favor.owner).pipe(
          tap((user: User) => (favor.user = user)),
          map(() => favor)
        );
      }),
      toArray(),
      tap((favors: Favor[]) => (this.favorList = favors)),
      switchMap(() => of({}))
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
