import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
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
import { paginationQuery } from '@helping-hand/api-core';
import { FavorQueryAggregationResult } from '../interfaces/favor-query-aggregation-result.interface';

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
    const matchStage: any = {
      $match: {
        owner: {
          $in: owners.map(v => Types.ObjectId(v))
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
        sortField: 'deadline',
        entity: 'favors'
      })
    ];
    return from(this.favorModel.aggregate(pipeline)).pipe(
      map((data: FavorQueryAggregationResult[]) => {
        if (data && data.length) {
          return data[0];
        } else {
          return {
            favors: [],
            favorsTotalCount: 0
          };
        }
      })
    );
  }

  delete(_id: string): Observable<any> {
    return from(this.favorModel.deleteOne({ _id }));
  }

  private buildQueryPipeline(
    owners: Array<Types.ObjectId>,
    sort: boolean,
    skip: number,
    limit: number
  ): any[] {
    const pipeline = [];
    if (owners) {
      const matchStage: any = {
        $match: {
          owner: {
            $in: owners
          }
        }
      };
      const facetStage: any = {
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
        facetStage.$facet.favors.push({
          $sort: {
            deadline: -1
          }
        });
      } else {
        facetStage.$facet.favors.push({
          $sort: {
            deadline: 1
          }
        });
      }

      const projectStage = {
        $project: {
          favors: 1,
          totalFavorCount: {
            $arrayElemAt: ['$totalFavorCount.count', 0]
          }
        }
      };
      pipeline.push(matchStage, facetStage, projectStage);
      return pipeline;
    } else {
      throw new Error('Incomplete query.');
    }
  }
}
