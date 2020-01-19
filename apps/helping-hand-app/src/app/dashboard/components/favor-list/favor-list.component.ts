import { Component, OnInit, OnDestroy, TemplateRef, ViewEncapsulation } from '@angular/core';
import {
  FavorQuery,
  User,
  Favor,
  CreateFavorDto
} from '@helping-hand/api-common';
import { Subject, throwError, of, Observable } from 'rxjs';
import { FavorService } from '@helping-hand/core/services/favor.service';
import { UserService } from '@helping-hand/core/services/user.service';
import {
  takeUntil,
  tap,
  mergeMap,
  catchError,
  switchMap
} from 'rxjs/operators';
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
  styleUrls: ['./favor-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FavorListComponent implements OnInit, OnDestroy {
  today: Date;
  currentPage = 1;
  loggedInUser: User;
  favorQuery: FavorQuery;
  favorList: Favor[] = [];
  favorBody: FavorBody = {
    title: '',
    text: '',
    deadline: new Date()
  };
  favorsTotalCount: number;
  currentFavorIndex: number;
  favorWindowRef$: NbWindowRef;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private favorService: FavorService,
    private userService: UserService,
    private windowService: NbWindowService
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
        mergeMap(() => this.updateFavorList())
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
            this.favorWindowRef$.close();
            this.resetNewFavorBody();
            this.toastrService.success('Your favour request has been created.');
          }),
          mergeMap(() => this.updateFavorList())
        )
        .subscribe({ error: e => console.error(e) });
    } else {
      this.toastrService.info(
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
    this.currentFavorIndex = favorIndex;
    this.openFavorFormWindow(favorForm, 'Edit your favor request', {
      isEditing: true
    });
  }

  fufillFavor(favorIndex: number) {
    this.favorService
      .updateFavor(this.favorList[favorIndex]._id, { isFufilled: true })
      .pipe(
        tap(() => {
          this.toastrService.success(
            'Hooray! You were able to get some help. Be sure to help others out too!'
          );
        }),
        switchMap(() => this.updateFavorList())
      )
      .subscribe({ error: e => console.error(e) });
  }

  deleteFavor(favorIndex: number) {
    this.favorService
      .deleteFavor(this.favorList[favorIndex]._id)
      .pipe(
        tap(() => {
          this.toastrService.success('Your favour request has been deleted.');
        }),
        switchMap(() => this.updateFavorList()),
        catchError(e => {
          this.toastrService.danger(
            'Something went wrong when deleting your favour request, please try again.'
          );
          return throwError(e);
        })
      )
      .subscribe({ error: e => console.error(e) });
  }

  updateFavor(favorIndex: number) {
    this.favorService
      .updateFavor(this.favorList[this.currentFavorIndex]._id, this.favorBody)
      .pipe(
        tap(() => {
          this.favorWindowRef$.close();
          this.resetNewFavorBody();
          this.toastrService.success('Your favour request has been updated.');
        }),
        mergeMap(() => this.updateFavorList()),
        catchError(e => {
          this.toastrService.danger(
            'Something went wrong when updating your favour request, please try again.'
          );
          return throwError(e);
        })
      )
      .subscribe({ error: e => console.error(e) });
  }

  resetNewFavorBody() {
    this.favorBody = {
      title: '',
      text: '',
      deadline: new Date()
    };
  }

  openFavorFormWindow(
    favorForm: TemplateRef<any>,
    title: string,
    context = {},
  ) {
    this.favorWindowRef$ = this.windowService.open(favorForm, {
      title,
      context,
      windowClass: 'favor-form-window'
    });
  }

  updateFavorList(): Observable<{}> {
    return this.favorService.getFavors(this.favorQuery).pipe(
      tap(({ favors, favorsTotalCount }) => {
        this.favorList = favors;
        this.favorsTotalCount = favorsTotalCount;
      }),
      mergeMap(() => of({}))
    );
  }

  onPageNav(direction: 'next' | 'prev') {
    if (direction === 'next') {
      this.favorQuery.skip += this.favorQuery.limit;
      this.currentPage++;
    } else {
      this.favorQuery.skip -= this.favorQuery.limit;
      this.currentPage--;
    }
    this.updateFavorList().subscribe({ error: e => console.error(e) });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
