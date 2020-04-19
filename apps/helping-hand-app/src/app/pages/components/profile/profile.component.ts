import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  User,
  Profile,
  UpdateProfileDto,
  ProfileDataKey
} from '@helping-hand/api-common';
import { ProfileService } from '@helping-hand/core/services/profile.service';
import { tap, map, switchMap, filter, first } from 'rxjs/operators';
import { UserService } from '@helping-hand/core/services/user.service';
import { Subject } from 'rxjs';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'helping-hand-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  newBio = '';
  profile: Profile;
  loggedInUser: User;
  profileDataKeys: string[];
  profileDataKeyDisplayMap = {
    [ProfileDataKey.Email]: 'email',
    [ProfileDataKey.PhoneNumber]: 'phone number',
    [ProfileDataKey.InstagramUsername]: 'instagram username',
    [ProfileDataKey.TwitterUsername]: 'twitter username'
  };
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private toastrService: NbToastrService,
    private profileService: ProfileService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.loggedInUser$
      .pipe(
        first(),
        tap(user => (this.loggedInUser = user)),
        map(user => user.profile),
        filter(profileId => !!profileId),
        switchMap(profileId => this.profileService.getProfileById(profileId)),
        tap(profile => {
          this.newBio = profile.bio;
          this.profile = profile;
          this.profileDataKeys = Object.values(ProfileDataKey)
        })
      )
      .subscribe({ error: err => console.error(err) });
  }

  toggleDataKeyVisibility(key: string) {
    const profileDto: UpdateProfileDto = this.profile.publicDataKeys.includes(
      key as ProfileDataKey
    )
      ? {
          publicDataKeys: this.profile.publicDataKeys.filter(
            data => data !== key
          )
        }
      : {
          publicDataKeys: [...this.profile.publicDataKeys, key]
        };
    this.profileService
      .updateProfile(this.profile._id, profileDto)
      .pipe(
        switchMap(() => this.profileService.getProfileById(this.profile._id)),
        tap(profile => {
          this.profile = profile;
          if (this.profile.publicDataKeys.includes(key as ProfileDataKey)) {
            this.toastrService.success(
              `Helping Hand will now share your
                ${this.profileDataKeyDisplayMap[key]}
                  with members of the community.`
            );
          } else {
            this.toastrService.info(
              `Helping Hand will no longer share your
                ${this.profileDataKeyDisplayMap[key]}
                 with members of the community.`
            );
          }
        })
      )
      .subscribe({ error: err => console.error(err) });
  }

  saveProfile() {
    this.profileService
      .updateProfile(this.profile._id, {
        bio: this.newBio,
        publicDataKeys: this.profile.publicDataKeys,
        data: this.profile.data
      })
      .pipe(
        switchMap(() => this.profileService.getProfileById(this.profile._id)),
        tap(profile => {
          this.profile = profile;
          this.toastrService.success('Your profile has been updated');
        })
      )
      .subscribe({ error: err => console.error(err) });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
