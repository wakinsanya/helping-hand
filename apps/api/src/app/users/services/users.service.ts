import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { USER_MODEL } from '@api/constants';
import { CreateUserDto, UpdateUserDto, User } from '@helping-hand/api-common';
import { Observable, from, of } from 'rxjs';
import { UserDocument } from '@api/users/interfaces/user-document.interface';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_MODEL) private readonly userModel: Model<UserDocument>
  ) {}

  create(userDto: CreateUserDto): Observable<User> {
    return from(
      this.userModel.findOne({ thirdPartyId: userDto.thirdPartyId })
    ).pipe(
      mergeMap((userDoc: UserDocument) => {
        if (userDoc) {
          return of(userDoc);
        } else {
          return from(this.userModel.create(userDto));
        }
      }),
      map((userDoc: UserDocument) => userDoc as User)
    );
  }

  getById(_id: string): Observable<User> {
    return from(this.userModel.findOne({ _id })).pipe(
      map((userDoc: UserDocument) => userDoc as User)
    );
  }

  updateById(_id: string, userDto: UpdateUserDto): Observable<User> {
    return from(this.userModel.updateOne({ _id }, userDto, { new: true })).pipe(
      map((userDoc: UserDocument) => userDoc as User)
    );
  }

  list(): Observable<User[]> {
    return from(this.userModel.find({})).pipe(
      map((userDocs: UserDocument[]) => userDocs.map(doc => doc as User))
    );
  }

  delete(_id: string) {
    return from(this.userModel.deleteOne({ _id }));
  }

  getByThirdPartyId(thirdPartyId: string): Observable<User> {
    return from(this.userModel.findOne({ thirdPartyId })).pipe(
      map((userDoc: UserDocument) => userDoc as User)
    );
  }
}
