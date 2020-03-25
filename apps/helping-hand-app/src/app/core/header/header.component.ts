import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from '@helping-hand/api-common';
import { Router, NavigationEnd } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap, takeUntil, filter, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from '@helping-hand/core/services/user.service';
import { NbMenuService } from '@nebular/theme';

enum PageRoute {
  Feed = '/pages/feed',
  Post = '/pages/post',
  Profile = '/pages/profile',
  Community = '/pages/community'
}

@Component({
  selector: 'helping-hand-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedInUser: User;
  pageRoute = PageRoute;
  currentPageRoute: PageRoute;
  private destroy$: Subject<void> = new Subject<void>();

  readonly userContextMenu = [
    {
      title: 'Log Out',
      icon: 'unlock-outline'
    }
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: NbAuthService,
    private nbMenuService: NbMenuService
  ) {}

  ngOnInit() {
    this.setUpUserListener();
    this.setUpLogOutHandler();
    this.router.events
      .pipe(
        filter(navEvent => navEvent instanceof NavigationEnd),
        map((navEnd: NavigationEnd) => navEnd.url),
        tap(url => (this.currentPageRoute = url as PageRoute))
      )
      .subscribe({ error: err => console.error(err) });
  }

  logout() {
    this.authService
      .logout(this.userService.userProvider)
      .pipe(
        tap(() => {
          this.userService.removeLoggedInUser();
          this.userService.removeUserProvider();
        })
      )
      .subscribe({
        next: () => window.location.reload(),
        error: e => console.error(e)
      });
  }

  goHome() {
    this.router.navigate(['/pages/feed']);
  }
  setUpUserListener() {
    this.userService.loggedInUser$
      .pipe(
        takeUntil(this.destroy$),
        tap(user => (this.loggedInUser = user))
      )
      .subscribe({ error: e => console.error(e) });
  }

  setUpLogOutHandler() {
    this.nbMenuService
      .onItemClick()
      .pipe(
        takeUntil(this.destroy$),
        filter(
          ({ tag, item }) => tag === 'profile' && item.title === 'Log Out'
        ),
        tap(() => this.logout())
      )
      .subscribe({ error: err => console.error(err) });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
