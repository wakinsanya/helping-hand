import {
  Component,
  AfterViewInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Profile, User, CreateProfileDto } from '@helping-hand/api-common';
import { UserService } from '@helping-hand/core/services/user.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ProfileService } from '@helping-hand/core/services/profile.service';

@Component({
  selector: 'helping-hand-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  bio: string;
  @ViewChild('profileStepForm', { static: true }) profileStepForm: TemplateRef<
    any
  >;

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
  ) {}

  ngAfterViewInit() {
    if (
      this.userService.loggedInUser &&
      !this.userService.loggedInUser.profile
    ) {
      this.startProfileCreation();
    }
  }

  startProfileCreation() {
    this.dialogService.open(this.profileStepForm);
  }

  createUserProfile() {
    const profileDto: CreateProfileDto = {
      owner: this.userService.loggedInUser._id,
      bio: this.bio
    };
    this.profileService.createProfile(profileDto).subscribe({
      next: () => {
        this.toastrService.success('Profile saved');
      },
      error: e => {
        console.error(e);
        this.toastrService.info(
          'We were unable to save your profile at this time'
        );
      }
    });
  }
}
