import { Injectable, Inject } from '@nestjs/common';
import { POST_MODEL } from '@api/constants';
import { Model, Types } from 'mongoose';
import { PostDocument } from '@api/post/interfaces/post-document.interface';
import {
  CreatePostDto,
  Post,
  UpdatePostDto,
  PostQueryResult
} from '@helping-hand/api-common';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { paginationQuery } from '@helping-hand/api-core';
import { PostQueryAggregationResult } from '@api/post/interfaces/post-query-aggregation-result';

@Injectable()
export class PostService {
  constructor(
    @Inject(POST_MODEL) private readonly postModel: Model<PostDocument>
  ) {}

  create(postDto: CreatePostDto): Observable<Post> {
    return from(this.postModel.create(postDto)).pipe(
      map(postDoc => postDoc as Post)
    );
  }
  getById(_id: string): Observable<Post> {
    return from(this.postModel.findOne({ _id })).pipe(
      map(postDoc => postDoc as Post)
    );
  }

  updateById(_id: string, postDto: UpdatePostDto): Observable<Post> {
    return from(
      this.postModel.findByIdAndUpdate(
        _id,
        { ...(postDto as Post) },
        { new: true }
      )
    ).pipe(map(postDoc => postDoc as Post));
  }

  list(
    owner: string,
    sort: boolean,
    skip: number,
    limit: number
  ): Observable<PostQueryResult> {
    const matchStage: any = {
      $match: {}
    };

    if (owner) {
      matchStage.$match.owner = Types.ObjectId(owner);
    }

    const pipeline = [
      matchStage,
      ...paginationQuery({
        skip,
        limit,
        sort,
        sortField: 'createdAt',
        sortOrder: 'descending',
        entity: 'posts'
      })
    ];
    return from(this.postModel.aggregate(pipeline)).pipe(
      map((data: PostQueryAggregationResult[]) => {
        return data && data.length
          ? data[0]
          : {
              posts: [],
              postsTotalCount: 0
            };
      })
    );
  }

  delete(_id: string): Observable<any> {
    return from(this.postModel.deleteOne({ _id }));
  }
}
