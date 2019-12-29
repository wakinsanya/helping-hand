import { Component, OnInit } from '@angular/core';
import { NbAuthService, NbAuthToken, NbAuthOAuth2Token } from '@nebular/auth';
import { UserProvider } from '@helping-hand/api-common';

@Component({
  selector: 'helping-hand-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private authService: NbAuthService) { }

  ngOnInit() {
    // this.authService.logout(UserProvider.GOOGLE)
    //   .subscribe({
    //     next: res => console.log(res),
    //     error: e => console.error(e)
    //   });
    // this.authService.getToken()
    //   .subscribe({
    //     next: ((token: NbAuthOAuth2Token) => {
    //       console.log(token.getPayload());
    //     })
    //   });
  }

  toggle() {}

}
