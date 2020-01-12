import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { USER_MODEL } from '@api/constants';
import {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserQuery,
  UserQueryResult
} from '@helping-hand/api-common';
import { Observable, from, of } from 'rxjs';
import { UserDocument } from '@api/users/interfaces/user-document.interface';
import { map, mergeMap } from 'rxjs/operators';
import { paginationQuery } from '@helping-hand/api-core';
import { UserQueryAggregationResult } from '../interfaces/user-query-aggregation-result.interface';

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
    return from(this.userModel.updateOne({ _id }, { $set: userDto })).pipe(
      map((userDoc: UserDocument) => userDoc as User)
    );
  }

  list(
    users: string[],
    sort: boolean,
    skip: number,
    limit: number
  ): Observable<UserQueryResult> {
    const matchStage: any = {
      $match: {
        owner: {
          $in: users.map(v => Types.ObjectId(v))
        }
      }
    };

    const pipeline = [
      matchStage,
      ...paginationQuery({
        skip,
        limit,
        sort,
        sortOrder: 'ascending',
        sortField: 'createdAt',
        entity: 'users'
      })
    ];
    return from(this.userModel.aggregate(pipeline)).pipe(
      map(data => {
        if (data && data.length) {
          return data[0];
        } else {
          return {
            users: [],
            totalUsersCount: 0
          };
        }
      }),
      mergeMap((data: UserQueryAggregationResult) => {
        return of({
          users: data.users as User[],
          totalUsersCount: data.totalUsersCount
        });
      })
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
