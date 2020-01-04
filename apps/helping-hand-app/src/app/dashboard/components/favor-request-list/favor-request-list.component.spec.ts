import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorRequestListComponent } from './favor-request-list.component';

describe('FavorRequestListComponent', () => {
  let component: FavorRequestListComponent;
  let fixture: ComponentFixture<FavorRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavorRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavorRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
