import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from '@helping-hand/api-common';
import { Router, NavigationEnd } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap, takeUntil, filter, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from '@helping-hand/core/services/user.service';
import { NbMenuService, NbThemeService } from '@nebular/theme';

enum AppTheme {
  Light = 'light',
  Dark = 'dark'
}

enum PageRoute {
  Feed = '/pages/favours',
  Post = '/pages/post',
  Profile = '/pages/profile',
  Community = '/pages/community',
  PostManagement = '/pages/posts/manage',
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
  appTheme = AppTheme;
  currentAppTheme = AppTheme.Light;
  currentPageRoute: PageRoute;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: NbAuthService,
    private nbMenuService: NbMenuService,
    private themeService: NbThemeService
  ) {}

  ngOnInit() {
    this.resolveAppTheme();
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
        error: err => console.error(err)
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
      .subscribe({ error: err => console.error(err) });
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

  resolveAppTheme() {
    const preExistingTheme = JSON.parse(localStorage.getItem('appTheme'));
    if (preExistingTheme) {
      this.currentAppTheme = preExistingTheme as AppTheme;
      switch (this.currentAppTheme) {
        case AppTheme.Dark:
          this.themeService.changeTheme('helping-hand-dark');
          break;
        case AppTheme.Light:
          this.themeService.changeTheme('helping-hand');
          break;
        default:
          this.themeService.changeTheme('helping-hand');
          console.warn('Attempted to set unknown application theme.');
      }
    }
  }

  toggleAppTheme() {
    switch (this.currentAppTheme) {
      case AppTheme.Light:
        this.themeService.changeTheme('helping-hand-dark');
        this.currentAppTheme = AppTheme.Dark;
        break;
      case AppTheme.Dark:
        this.themeService.changeTheme('helping-hand');
        this.currentAppTheme = AppTheme.Light;
        break;
      default:
        throw new Error('Unknown theme');
    }
    localStorage.setItem('appTheme', JSON.stringify(this.currentAppTheme));
  }
}
