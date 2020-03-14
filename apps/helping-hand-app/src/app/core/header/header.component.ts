import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@helping-hand/api-common';
import { Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap, takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from '@helping-hand/core/services/user.service';
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'helping-hand-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedInUser: User;
  private destroy$: Subject<void> = new Subject<void>();
  readonly profileContextMenu = [
    {
      title: 'Profile',
      icon: 'person-outline',
      link: 'pages/profile'
    },
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
