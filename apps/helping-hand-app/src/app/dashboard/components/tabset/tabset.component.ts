import {
  Component,
  AfterViewInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  Profile,
  User,
  CreateProfileDto,
  ProfileDataKey
} from '@helping-hand/api-common';
import { UserService } from '@helping-hand/core/services/user.service';
import { NbDialogService } from '@nebular/theme';
import { ProfileService } from '@helping-hand/core/services/profile.service';
import { tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'helping-hand-tabset',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.scss']
})
export class TabsetComponent implements AfterViewInit {
  isLoading = false;
  favorRequestCount: number;
  hideFavorRequestCount = false;
  @ViewChild('welcomeCard', { static: true }) welcomeCard: TemplateRef<any>;

  readonly tabs = [
    {
      title: 'Feed',
      icon: 'radio-outline',
      route: './dashboard',
      responsive: true
    },
    {
      title: 'Profile',
      icon: 'person-outline',
      route: './profile',
      responsive: true
    },
    {
      title: 'Community',
      icon: 'people-outline',
      route: './community',
      responsive: true
    }
  ];

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private dialogService: NbDialogService
  ) {}

  ngAfterViewInit() {
    const loggedInUser = this.userService.loggedInUser;
    if (loggedInUser && !loggedInUser.profile) {
      this.isLoading = true;
      const profileDto: CreateProfileDto = {
        owner: this.userService.loggedInUser._id,
        bio: '',
        publicDataKeys: [ProfileDataKey.Email],
        data: {
          email: this.userService.loggedInUser.email
        }
      };
      this.profileService
        .createProfile(profileDto)
        .pipe(
          switchMap((profile: Profile) => {
            return this.userService.updateUser(loggedInUser._id, {
              profile: profile._id
            });
          }),
          switchMap(() => {
            return this.userService.getUserById(loggedInUser._id);
          }),
          tap((user: User) => {
            this.userService.setLoggedInUser(user);
            this.isLoading = false;
          }),
          switchMap(() => this.dialogService.open(this.welcomeCard).onClose),
          tap(() => location.reload())
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
