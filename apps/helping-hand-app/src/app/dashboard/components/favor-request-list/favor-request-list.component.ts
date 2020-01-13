import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavorService } from '@helping-hand/core/services/favor.service';
import { User, FavorQuery, Favor } from '@helping-hand/api-common';
import { Observable, of, Subject } from 'rxjs';
import { tap, mergeMap, takeUntil } from 'rxjs/operators';
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
        mergeMap(() => this.updateFavorList())
      )
      .subscribe({ error: e => console.error(e) });
  }

  updateFavorList(): Observable<{}> {
    return this.favorService.getFavors(this.favorQuery).pipe(
      tap(({ favors, favorsTotalCount }) => {
        console.log('favor req', favors);
        this.favorList = favors;
        this.favorsTotalCount = favorsTotalCount;
      }),
      mergeMap(() => of({}))
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
