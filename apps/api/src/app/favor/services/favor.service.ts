import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { FAVOR_MODEL } from '@api/constants';
import {
  Favor,
  UpdateFavorDto,
  CreateFavorDto,
  FavorQueryResult
} from '@helping-hand/api-common';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { FavorDocument } from '@api/favor/interfaces/favor-document.interface';
import { paginationQuery } from '@helping-hand/api-core';
import { FavorQueryAggregationResult } from '@api/favor/interfaces/favor-query-aggregation-result.interface';

@Injectable()
export class FavorService {
  constructor(
    @Inject(FAVOR_MODEL) private readonly favorModel: Model<FavorDocument>
  ) {}

  create(favorDto: CreateFavorDto): Observable<Favor> {
    return from(this.favorModel.create(favorDto)).pipe(
      map((favorDoc: FavorDocument) => favorDoc as Favor)
    );
  }

  getById(_id: string): Observable<Favor> {
    return from(this.favorModel.findOne({ _id })).pipe(
      map((favorDoc: FavorDocument) => favorDoc as Favor)
    );
  }

  updateById(_id: string, favorDto: UpdateFavorDto): Observable<Favor> {
    return from(
      this.favorModel.updateOne({ _id }, favorDto, { new: true })
    ).pipe(map((favorDoc: FavorDocument) => favorDoc as Favor));
  }

  list(
    owners: string[],
    notOwners: string[],
    sort: boolean,
    skip: number,
    limit: number,
    fufilled: boolean
  ): Observable<FavorQueryResult> {
    const matchStage: any = {
      $match: {
        owner: {}
      }
    };

    if (owners && owners.length) {
      matchStage.$match.owner.$in = owners.map(v => Types.ObjectId(v));
    }

    if (notOwners && notOwners.length) {
      matchStage.$match.owner.$nin = notOwners.map(v => Types.ObjectId(v));
    }

    if (fufilled === false) {
      matchStage.$match.isFufilled = false;
    }

    const pipeline = [
      matchStage,
      ...paginationQuery({
        skip,
        limit,
        sort,
        sortOrder: 'ascending',
        sortField: 'deadline',
        entity: 'favors'
      })
    ];
    return from(this.favorModel.aggregate(pipeline)).pipe(
      map((data: FavorQueryAggregationResult[]) => {
        return data && data.length
          ? data[0]
          : {
              favors: [],
              favorsTotalCount: 0
            };
      })
    );
  }

  delete(_id: string): Observable<any> {
    return from(this.favorModel.deleteOne({ _id }));
  }
}
