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

  getProfile(profileId: string): Observable<Profile> {
    return this.httpClient.get<Profile>(`api/profiles/${profileId}`);
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

  deleteProfile(profileId: string): Observable<any> {
    return this.httpClient.delete(`/api/profiles/${profileId}`);
  }
}
