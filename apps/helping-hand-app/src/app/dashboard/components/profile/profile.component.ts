import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  User,
  Profile,
  UpdateProfileDto,
  ProfileDataKey
} from '@helping-hand/api-common';
import { ProfileService } from '@helping-hand/core/services/profile.service';
import { tap, takeUntil, map, switchMap } from 'rxjs/operators';
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
  loggedInUser: User;
  profile: Profile;
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
        takeUntil(this.destroy$),
        tap((user: User) => (this.loggedInUser = user)),
        map((user: User) => user.profile),
        switchMap((profile: string) => {
          return this.profileService.getProfileById(profile);
        }),
        tap((profile: Profile) => {
          this.newBio = profile.bio;
          this.profile = profile;
          this.profileDataKeys = Object.keys(ProfileDataKey).map(
            x => ProfileDataKey[x]
          );
        })
      )
      .subscribe({ error: e => console.error(e) });
  }

  toggleDataKeyVisibility(key: string) {
    console.log('Data Key Param', key);
    const profileDto: UpdateProfileDto = this.profile.publicDataKeys.includes(
      key as ProfileDataKey
    )
      ? {
          publicDataKeys: this.profile.publicDataKeys.filter(x => x !== key)
        }
      : {
          publicDataKeys: [...this.profile.publicDataKeys, key]
        };
    console.log('resolved dto', profileDto);
    this.profileService
      .updateProfile(this.profile._id, profileDto)
      .pipe(
        switchMap(() => this.profileService.getProfileById(this.profile._id)),
        tap((profile: Profile) => {
          this.profile = profile;
          if (this.profile.publicDataKeys.includes(key as ProfileDataKey)) {
            this.toastrService.success(
              `Helping Hand will now share your ${this.profileDataKeyDisplayMap[key]} with potential helpers.`
            );
          } else {
            this.toastrService.danger(
              `Helping Hand will no longer share your ${this.profileDataKeyDisplayMap[key]} with potential helpers.`
            );
          }
        })
      )
      .subscribe({ error: e => console.error(e) });
  }

  saveProfile() {
    this.profileService
      .updateProfile(this.profile._id, { bio: this.newBio })
      .pipe(
        switchMap(() => this.profileService.getProfileById(this.profile._id)),
        tap((profile: Profile) => {
          this.profile = profile;
          this.toastrService.success('Your profile has been updated');
        })
      )
      .subscribe({ error: e => console.error(e) });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
