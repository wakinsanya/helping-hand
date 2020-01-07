import { Inject, Injectable } from '@nestjs/common';
import { Model, Schema, Types } from 'mongoose';
import { FAVOR_MODEL } from '../../constants';
import {
  Favor,
  UpdateFavorDto,
  CreateFavorDto,
  FavorQueryResult
} from '@helping-hand/api-common';
import { Observable, from, of } from 'rxjs';
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
      owners.map(v => Types.ObjectId(v)),
      sort,
      skip,
      limit
    );
    return from(this.favorModel.aggregate(pipeline)).pipe(
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
    owners: Array<Types.ObjectId>,
    sort: boolean,
    skip: number,
    limit: number
  ): any[] {
    const pipeline = [];
    if (owners && skip && limit) {
      const matchStage = {
        $match: {
          owner: {
            $in: owners
          }
        }
      };
      const facetStage = {
        $facet: {
          favors: [
            {
              $skip: skip
            },
            {
              $limit: limit
            }
          ],
          totalFavorCount: [
            {
              $count: 'count'
            }
          ]
        }
      };

      if (sort) {
        (facetStage as any).favors.push({
          $sort: {
            deadline: -1
          }
        });
      } else {
        (facetStage as any).favors.push({
          $sort: {
            deadline: 1
          }
        });
      }

      const projectStagge = {
        $project: {
          favors: 1,
          totalFavorCount: {
            $arrayElemAt: ['$totalFavorCount.count', 0]
          }
        }
      };
      pipeline.push(matchStage, facetStage, projectStagge);
      return pipeline;
    } else {
      throw new Error('Incomplete query.');
    }
  }
}
