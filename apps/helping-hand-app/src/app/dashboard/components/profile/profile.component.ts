import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, Profile, UpdateProfileDto } from '@helping-hand/api-common';
import { ProfileService } from '@helping-hand/core/services/profile.service';
import { tap, takeUntil, map, mergeMap } from 'rxjs/operators';
import { UserService } from '@helping-hand/core/services/user.service';
import { Subject } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { SubscriptionService } from '@helping-hand/core/services/subscription.service';

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
        mergeMap((profile: string) => {
          return this.profileService.getProfileById(profile);
        }),
        tap((profile: Profile) => {
          this.newBio = profile.bio;
          this.profile = profile;
          this.profileDataKeys = Object.keys(profile.data);
        })
      )
      .subscribe({ error: e => console.error(e) });
  }

  toggleDataKeyVisibility(key: string) {
    const profileDto: UpdateProfileDto = this.profile.publicDataKeys.includes(
      key
    )
      ? {
          publicDataKeys: this.profile.publicDataKeys.filter(x => x !== key)
        }
      : {
          publicDataKeys: [...this.profile.publicDataKeys, key]
        };
    this.profileService.updateProfile(this.profile._id, profileDto).pipe(
      tap((profile: Profile) => {
        this.profile = profile;
        this.toastrService.success(
          `Helping Hand will now share your ${key} with potential helpers.`
        );
      })
    ).subscribe({ error: e => console.error(e) })
  }

  saveProfile() {
    this.profileService
      .updateProfile(this.profile._id, { bio: this.newBio })
      .pipe(
        mergeMap(() => {
          return this.profileService.getProfileById(this.profile._id);
        }),
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
