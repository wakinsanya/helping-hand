import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { USER_MODEL } from '../constants';
import { UserDto } from './dtos/user.dto';
import { Observable, from } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@Inject(USER_MODEL) private readonly userModel: Model<User>) {}

  create(user: UserDto): Observable<User> {
    return from(this.userModel.create(user));
  }

  getById(_id: string): Observable<User> {
    return from(this.userModel.findOne({ _id }));
  }

  update(user: UserDto): Observable<User> {
    return from(
      this.userModel.updateOne({ email: user.email }, user, { new: true })
    );
  }

  list(): Observable<User[]> {
    return from(this.userModel.find({}));
  }

  delete(_id: string) {
    return from(this.userModel.deleteOne({ _id }));
  }
}
