import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { USER_MODEL } from '../constants';
import { CreateUserDto, UpdateUserDto, UserDocument, User } from '@helping-hand/common';
import { Observable, from } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@Inject(USER_MODEL) private readonly userModel: Model<UserDocument>) {}

  create(user: CreateUserDto): Observable<User> {
    return from(this.userModel.create(user));
  }

  getById(_id: string): Observable<User> {
    return from(this.userModel.findOne({ _id }));
  }

  update(thirdPartyId: string, user: UpdateUserDto): Observable<User> {
    return from(
      this.userModel.updateOne({ thirdPartyId }, user, { new: true })
    );
  }

  list(): Observable<User[]> {
    return from(this.userModel.find({}));
  }

  delete(_id: string) {
    return from(this.userModel.deleteOne({ _id }));
  }

  getByThirdPartyId(thirdPartyId: string): Observable<User> {
    return from(this.userModel.findOne({ thirdPartyId }));
  }
}
