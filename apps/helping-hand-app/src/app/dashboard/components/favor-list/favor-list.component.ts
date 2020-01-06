import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import {
  FavorQuery,
  User,
  Favor,
  CreateFavorDto,
  UpdateFavorDto
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
          console.log(favors);
          this.favorList = favors;
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

  openFavorEditWindow(favorForm: TemplateRef<any>, favorIndex: number) {
    this.favorBody = {
      title: this.favorList[favorIndex].title,
      text: this.favorList[favorIndex].text,
      deadline: this.favorList[favorIndex].deadline
    };
    this.openFavorFormWindow(favorForm, 'Edit your help request');
  }

  deleteFavor() {}

  updateFavor() {
    const favorDto: UpdateFavorDto = {

    }
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
