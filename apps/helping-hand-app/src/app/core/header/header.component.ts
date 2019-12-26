import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'helping-hand-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  type = 'default';

  constructor() { }

  ngOnInit() {
  }

}
