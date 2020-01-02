import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PROFILE_MODEL } from '@api/constants';
import {
  Profile,
  CreateProfileDto,
  UpdateProfileDto
} from '@helping-hand/api-common';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileDocument } from '@api/profile/interfaces/profile-document.interface';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(PROFILE_MODEL) private readonly profileModel: Model<ProfileDocument>
  ) {}

  create(profileDto: CreateProfileDto): Observable<Profile> {
    return from(this.profileModel.create(profileDto)).pipe(
      map((profileDoc: ProfileDocument) => profileDoc as Profile)
    );
  }

  getById(_id: string): Observable<Profile> {
    return from(this.profileModel.findOne({ _id })).pipe(
      map((profileDoc: ProfileDocument) => profileDoc as Profile)
    );
  }

  updateById(_id: string, profileDto: UpdateProfileDto): Observable<Profile> {
    return from(
      this.profileModel.updateOne({ _id }, profileDto, { new: true })
    ).pipe(map((profileDoc: ProfileDocument) => profileDoc as Profile));
  }

  list(): Observable<Profile[]> {
    return from(this.profileModel.find({})).pipe(
      map((profileDocs: ProfileDocument[]) =>
        profileDocs.map(doc => doc as Profile)
      )
    );
  }

  delete(_id: string): Observable<any> {
    return from(this.profileModel.deleteOne({ _id }));
  }
}
