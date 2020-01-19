import {
  Component,
  AfterViewInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Profile, User, CreateProfileDto } from '@helping-hand/api-common';
import { UserService } from '@helping-hand/core/services/user.service';
import { NbDialogService, NbTabComponent } from '@nebular/theme';
import { ProfileService } from '@helping-hand/core/services/profile.service';
import { mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'helping-hand-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  isLoading = false;
  favorRequestCount: number;
  hideFavorRequestCount = false;
  @ViewChild('welcomeCard', { static: true }) welcomeCard: TemplateRef<any>;

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private dialogService: NbDialogService
  ) {}

  ngAfterViewInit() {
    const loggedInUser = this.userService.loggedInUser;
    if (loggedInUser && !loggedInUser.profile) {
      this.isLoading = true;
      this.dialogService.open(this.welcomeCard);
      const profileDto: CreateProfileDto = {
        owner: this.userService.loggedInUser._id,
        bio: ''
      };
      this.profileService
        .createProfile(profileDto)
        .pipe(
          mergeMap((profile: Profile) => {
            return this.userService.updateUser(loggedInUser._id, {
              profile: profile._id
            });
          }),
          mergeMap(() => {
            return this.userService.getUserById(loggedInUser._id);
          }),
          tap((user: User) => {
            this.userService.setLoggedInUser(user);
            this.isLoading = false;
          })
        )
        .subscribe({
          error: e => {
            this.isLoading = false;
            console.error(e);
          }
        });
    }
  }

  updateFavorRequestCount(count: number) {
    this.favorRequestCount = count;
  }

  onTabChange({ tabTitle }) {
    this.hideFavorRequestCount =
      (tabTitle as string).toLowerCase() === 'help others';
  }
}
