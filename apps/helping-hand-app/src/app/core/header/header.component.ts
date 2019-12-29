import { Component } from '@angular/core';
import { User } from '@helping-hand/api-common';
import { Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'helping-hand-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  type = 'default';
  isUserLoggedIn: boolean;

  constructor(private router: Router, private authService: NbAuthService) {
    this.authService.logout('google');
    this.authService.isAuthenticated()
      .subscribe({
        next: isAuthenticated => (this.isUserLoggedIn = isAuthenticated),
        error: e => console.error(e)
      })
  }

  logout() {
    this.authService.logout('google');
    this.router.navigate(['/']);
  }

  goHome() {
    this.router.navigate(['/dashboard'])
  }
}
