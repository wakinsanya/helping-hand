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

  getProfileById(profileId: string): Observable<Profile> {
    return this.httpClient.get<Profile>(`api/profiles/${profileId}`);
  }

  updateProfile(
    profileId: string,
    profileDto: UpdateProfileDto
  ): Observable<any> {
    return this.httpClient.patch<any>(
      `api/profiles/${profileId}`,
      profileDto
    );
  }

  deleteProfile(profileId: string): Observable<any> {
    return this.httpClient.delete(`/api/profiles/${profileId}`);
  }
}
