import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import {
  FavorQuery,
  User,
  Favor,
  CreateFavorDto
} from '@helping-hand/api-common';
import { Subject } from 'rxjs';
import { FavorService } from '@helping-hand/core/services/favor.service';
import { UserService } from '@helping-hand/core/services/user.service';
import { takeUntil, tap, mergeMap } from 'rxjs/operators';
import {
  NbWindowService,
  NbDateService,
  NbWindowRef,
  NbToastrService
} from '@nebular/theme';

interface FavorBody {
  title: string;
  text: string;
  deadline?: Date;
}

@Component({
  selector: 'helping-hand-favor-list',
  templateUrl: './favor-list.component.html',
  styleUrls: ['./favor-list.component.scss']
})
export class FavorListComponent implements OnInit, OnDestroy {
  newFavorBody: FavorBody = {
    title: '',
    text: ''
  };
  createFavorWindowRef$: NbWindowRef;
  today: Date;
  favorQuery: FavorQuery;
  loggedInUser: User;
  favorList: Favor[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private favorService: FavorService,
    private userService: UserService,
    private windowService: NbWindowService,
    private dateService: NbDateService<Date>,
    private toastrService: NbToastrService
  ) {}

  ngOnInit() {
    this.userService.loggedInUser$
      .pipe(
        takeUntil(this.destroy$),
        tap((user: User) => {
          this.loggedInUser = user;
          this.favorQuery = {
            owners: [user._id],
            sort: true,
            skip: 0,
            limit: 10
          };
        }),
        mergeMap(() => this.favorService.getFavors(this.favorQuery)),
        tap((favors: Favor[]) => {
          this.favorList = favors;
        })
      )
      .subscribe({ error: e => console.error(e) });
    this.today = this.dateService.addMonth(this.dateService.today(), 0);
  }

  openFavorCreationWindow(favorCreationForm: TemplateRef<any>) {
    this.createFavorWindowRef$ = this.windowService.open(favorCreationForm);
  }

  createFavor() {
    if (this.newFavorBody.title && this.newFavorBody.deadline) {
      const favorDto: CreateFavorDto = {
        owner: this.loggedInUser._id,
        title: this.newFavorBody.title,
        text: this.newFavorBody.text,
        deadline: this.newFavorBody.deadline
      };
      this.favorService
        .createFavor(favorDto)
        .pipe(
          tap(() => {
            this.createFavorWindowRef$.close();
            this.toastrService.success(
              'Your request for help has been created.'
            );
          }),
          mergeMap(() => {
            return this.favorService.getFavors(this.favorQuery);
          }),
          tap((favorList: Favor[]) => (this.favorList = favorList))
        )
        .subscribe({ error: e => console.error(e) });
    } else {
      this.toastrService.warning(
        'Please enter at minimum a title and deadline for your help request.'
      );
    }
  }

  deleteFavor() {}

  updateFavor() {}

  getMoreFavors() {
    //infinite list trigger query
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
