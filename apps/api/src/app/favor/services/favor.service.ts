import { Inject, Injectable } from '@nestjs/common';
import { Model, Schema, Mongoose } from 'mongoose';
import { FAVOR_MODEL } from '../../constants';
import {
  Favor,
  UpdateFavorDto,
  CreateFavorDto,
  FavorQueryResult
} from '@helping-hand/api-common';
import { Observable, from, of, ObjectUnsubscribedError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { FavorDocument } from '../interfaces/favor-document.interface';

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
    sort: boolean,
    skip: number,
    limit: number
  ): Observable<FavorQueryResult> {
    const pipeline = this.constructQueryPipeline(
      owners.map(v => new Mongoose().Types.ObjectId(v)),
      sort,
      skip,
      limit
    );
    return from(
      this.favorModel.aggregate([
        {
          $match: {
            owner: { $in: owners.map(v => new Mongoose().Types.ObjectId(v)) }
          }
        },
        {
          $facet: {
            favors: [
              {
                $skip: skip
              },
              {
                $limit: limit
              },
              {
                $sort: {
                  deadline: -1
                }
              }
            ],
            totalFavorCount: [
              {
                $count: 'count'
              }
            ]
          }
        },
        {
          $project: {
            favors: 1,
            totalFavorCount: {
              $arrayElemAt: ['$totalFavorCount.count', 0]
            }
          }
        }
      ])
    ).pipe(
      map(data => data[0]),
      mergeMap(data => {
        return of({
          favors: (data as any).favors.map(v => v as Favor),
          totalCount: (data as any).totalFavorCount
        });
      })
    );
  }

  delete(_id: string): Observable<any> {
    return from(this.favorModel.deleteOne({ _id }));
  }

  private constructQueryPipeline(
    owners: Array<Schema.Types.ObjectId>,
    sort: boolean,
    skip: number,
    limit: number
  ) {

  }
}
