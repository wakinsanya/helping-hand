import { Injectable, Inject } from '@nestjs/common';
import { COMMENT_MODEL } from '@api/constants';
import { Model, Types } from 'mongoose';
import {
  Comment,
  CreateCommentDto,
  CommentQueryResult,
  UpdateCommentDto
} from '@helping-hand/api-common';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { paginationQuery } from '@helping-hand/api-core';
import { CommentDocument } from '@api/comment/interfaces/comment-document.interface';
import { CommentQueryAggregationResult } from '@api/comment/interfaces/comment-query-aggregation-result';

@Injectable()
export class CommentService {
  constructor(
    @Inject(COMMENT_MODEL) private readonly commentModel: Model<CommentDocument>
  ) {}

  create(commentDto: CreateCommentDto): Observable<Comment> {
    return from(this.commentModel.create(commentDto)).pipe(
      map((commentDoc: CommentDocument) => commentDoc as Comment)
    );
  }

  getById(_id: string): Observable<Comment> {
    return from(this.commentModel.findOne({ _id })).pipe(
      map((commentDoc: CommentDocument) => commentDoc as Comment)
    );
  }

  updateById(_id: string, commentDto: UpdateCommentDto): Observable<Comment> {
    return from(
      this.commentModel.updateOne(
        { _id },
        {
          $set: {
            ...commentDto,
            edited: true
          }
        },
        { new: true }
      )
    ).pipe(map((commentDoc: CommentDocument) => commentDoc as Comment));
  }

  list(
    post: string,
    owner: string,
    sort: boolean,
    skip: number,
    limit: number
  ): Observable<CommentQueryResult> {
    const matchStage: any = {
      $match: {}
    };

    if (owner) {
      matchStage.$match.owner = Types.ObjectId(owner);
    }

    if (post) {
      matchStage.$match.post = Types.ObjectId(post);
    }

    const pipeline = [
      matchStage,
      ...paginationQuery({
        skip,
        limit,
        sort,
        sortOrder: 'descending',
        sortField: 'createdAt',
        entity: 'comments'
      })
    ];

    return from(this.commentModel.aggregate(pipeline)).pipe(
      map((data: CommentQueryAggregationResult[]) => {
        return data && data.length
          ? data[0]
          : {
              comments: [],
              commentsTotalCount: 0
            };
      })
    );
  }

  delete(_id: string): Observable<any> {
    return from(this.commentModel.deleteOne({ _id }));
  }
}
