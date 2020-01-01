import { Injectable } from '@angular/core';
import {
  Profile,
  CreateProfileDto,
  UpdateProfileDto
} from '@helping-hand/api-common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class ProfileService {
  constructor(private httpClient: HttpClient) {}

  createProfile(profileDto: CreateProfileDto): Observable<Profile> {
    return this.httpClient.post<Profile>('api/profiles', profileDto);
  }

  updateProfile(
    profileDto: UpdateProfileDto,
    profileId: string
  ): Observable<Profile> {
    return this.httpClient.patch<Profile>(
      `api/profiles/${profileId}`,
      profileDto
    );
  }
}
