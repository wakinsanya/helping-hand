import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '@helping-hand/api-common';
import { Router } from '@angular/router';

@Component({
  selector: 'helping-hand-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  type = 'default';
  loggedInUser: User;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.loggedInUser$.subscribe({
      next: (user: User) => (this.loggedInUser = user),
      error: e => console.error(e)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
