import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import {
  FavorQuery,
  User,
  Favor,
  CreateFavorDto,
  UpdateFavorDto,
  FavorQueryResult
} from '@helping-hand/api-common';
import { Subject, throwError } from 'rxjs';
import { FavorService } from '@helping-hand/core/services/favor.service';
import { UserService } from '@helping-hand/core/services/user.service';
import { takeUntil, tap, mergeMap, catchError } from 'rxjs/operators';
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
  favorBody: FavorBody = {
    title: '',
    text: '',
    deadline: new Date()
  };
  favorFormWindowRef$: NbWindowRef;
  today: Date;
  favorQuery: FavorQuery;
  loggedInUser: User;
  favorList: Favor[] = [];
  totalFavorCount: number;
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
        tap((data: FavorQueryResult) => {
          this.favorList = data.favors;
        })
      )
      .subscribe({ error: e => console.error(e) });
    this.today = this.dateService.addMonth(this.dateService.today(), 0);
  }

  createFavor() {
    if (this.favorBody.title && this.favorBody.deadline) {
      const favorDto: CreateFavorDto = {
        owner: this.loggedInUser._id,
        title: this.favorBody.title,
        text: this.favorBody.text,
        deadline: this.favorBody.deadline
      };
      this.favorService
        .createFavor(favorDto)
        .pipe(
          tap(() => {
            this.favorFormWindowRef$.close();
            this.resetNewFavorBody();
            this.toastrService.success('Your favour request has been created.');
          }),
          mergeMap(() => {
            return this.favorService.getFavors(this.favorQuery);
          }),
          tap(({ favors, totalFavorCount }) => {
            this.favorList = favors;
            this.totalFavorCount = totalFavorCount;
          })
        )
        .subscribe({ error: e => console.error(e) });
    } else {
      this.toastrService.warning(
        'Please enter at minimum a title and deadline for your favour request.'
      );
    }
  }

  openFavorEditWindow(favorForm: TemplateRef<any>, favorIndex: number) {
    this.resetNewFavorBody();
    this.favorBody = {
      title: this.favorList[favorIndex].title,
      text: this.favorList[favorIndex].text,
      deadline: this.favorList[favorIndex].deadline
    };
    this.openFavorFormWindow(favorForm, 'Edit your favor request');
  }

  deleteFavor(favorIndex: number) {
    this.favorService
      .deleteFavor(this.favorList[favorIndex]._id)
      .pipe(
        tap(() => {
          this.toastrService.success('Your favour request has been deleted.');
        }),
        catchError(e => {
          this.toastrService.danger(
            'Something went wrong when deleting your favour request, please try again!'
          );
          return throwError(e);
        })
      )
      .subscribe({ error: e => console.error(e) });
  }

  updateFavor(favorIndex: number) {
    this.favorService
      .updateFavor(this.favorList[favorIndex]._id, this
        .favorBody as UpdateFavorDto)
      .pipe(
        tap((updatedFavor: Favor) => {
          this.toastrService.success('Your favour request has been updated.');
          this.favorList[favorIndex] = updatedFavor;
        }),
        catchError(e => {
          this.toastrService.danger(
            'Something went wrong when updating your favour request, please try again!'
          );
          return throwError(e);
        })
      ).subscribe({ error: e => console.error(e) });
  }

  getMoreFavors() {
    //infinite list trigger query
  }

  resetNewFavorBody() {
    this.favorBody = {
      title: '',
      text: '',
      deadline: new Date()
    };
  }

  openFavorFormWindow(favorForm: TemplateRef<any>, title: string) {
    this.favorFormWindowRef$ = this.windowService.open(favorForm, {
      title
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
