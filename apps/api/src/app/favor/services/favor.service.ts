import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { FAVOR_MODEL } from '../../constants';
import {
  Favor,
  UpdateFavorDto,
  CreateFavorDto
} from '@helping-hand/api-common';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
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

  list(): Observable<Favor[]> {
    return from(this.favorModel.find({})).pipe(
      map((profileDocs: FavorDocument[]) =>
        profileDocs.map(doc => doc as Favor)
      )
    );
  }

  delete(_id: string): Observable<any> {
    return from(this.favorModel.deleteOne({ _id }));
  }
}
