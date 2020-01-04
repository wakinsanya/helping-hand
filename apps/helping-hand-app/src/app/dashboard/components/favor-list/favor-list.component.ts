import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavorQuery, User, Favor, Profile } from '@helping-hand/api-common';
import { Subject } from 'rxjs';
import { FavorService } from '@helping-hand/core/services/favor.service';
import { UserService } from '@helping-hand/core/services/user.service';
import { takeUntil, tap, map, mergeMap } from 'rxjs/operators';
import { NbAuthService } from '@nebular/auth';

@Component({
  selector: 'helping-hand-favor-list',
  templateUrl: './favor-list.component.html',
  styleUrls: ['./favor-list.component.scss']
})
export class FavorListComponent implements OnInit, OnDestroy {
  favorQuery: FavorQuery;
  loggedInUser: User;
  favorList: Favor[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private authService: NbAuthService,
    private favorService: FavorService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.loggedInUser$
      .pipe(
        takeUntil(this.destroy$),
        tap((user: User) => {
          this.loggedInUser = user;
          this.favorQuery = {
            owners: [user._id],
            sort: true,
            skip: 0,
            limit: 10
          }
        }),
        mergeMap(() => this.favorService.getFavors(this.favorQuery)),
        tap((favors: Favor[]) => {
          this.favorList = favors;
        })
      )
      .subscribe({ error: e => console.error(e) });
  }

  createFaor() {}

  deleteFavor() {}

  updateFavor() {}

  getMoreFavors() {
    //infinite list trigger query
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
