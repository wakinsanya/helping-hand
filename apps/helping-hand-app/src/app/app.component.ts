import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  trigger,
  transition,
  query,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'helping-hand-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fade', [
      transition('* <=> *', [
        query(
          ':enter, :leave',
          [
            style({
              position: 'absolute',
              left: 0,
              width: '100%',
              opacity: 0,
              transform: 'scale(0) translateY(100%)'
            })
          ],
          { optional: true }
        ),
        query(
          ':enter',
          [
            animate(
              '300ms ease',
              style({ opacity: 1, transform: 'scale(1) translateY(0)' })
            )
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class AppComponent {
  animation: string;
  constructor() {}

  prepareRoute(outlet: RouterOutlet) {
    return  outlet &&
    outlet.activatedRouteData &&
    outlet.activatedRouteData['state'];
  }
}
