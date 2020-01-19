import { Injectable } from '@angular/core';
import {
  Profile,
  CreateProfileDto,
  UpdateProfileDto,
  ProfileDataKey
} from '@helping-hand/api-common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class ProfileService {
  private _publicDataKeyMap = {
    [ProfileDataKey.Email]: {
      name: 'email',
      iconKey: 'email-outline'
    },
    [ProfileDataKey.PhoneNumber]: {
      name: 'phone number',
      iconKey: 'phone-outline'
    },
    [ProfileDataKey.InstagramUsername]: {
      name: 'instagram username',
      iconKey: 'camera-outline'
    },
    [ProfileDataKey.TwitterUsername]: {
      name: 'twitter username',
      iconKey: 'twitter-outline'
    }
  };

  public get publicDataKeyMap() {
    return this._publicDataKeyMap;
  }

  constructor(private httpClient: HttpClient) {}

  createProfile(profileDto: CreateProfileDto): Observable<Profile> {
    return this.httpClient.post<Profile>('api/profiles', profileDto);
  }

  getProfileById(profileId: string): Observable<Profile> {
    return this.httpClient.get<Profile>(`api/profiles/${profileId}`);
  }

  getProfileByOwner(ownerId: string): Observable<Profile> {
    return this.httpClient.get<Profile>(`api/profiles/owner/${ownerId}`);
  }

  updateProfile(
    profileId: string,
    profileDto: UpdateProfileDto
  ): Observable<any> {
    return this.httpClient.patch<any>(`api/profiles/${profileId}`, profileDto);
  }

  deleteProfile(profileId: string): Observable<any> {
    return this.httpClient.delete(`/api/profiles/${profileId}`);
  }
}
