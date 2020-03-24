import { Component } from '@angular/core';
import { slide, transform, fade, step } from './route-animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'helping-hand-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fade]
})
export class AppComponent {
  constructor() {}

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }
}
