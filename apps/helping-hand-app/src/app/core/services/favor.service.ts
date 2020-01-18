import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CreateFavorDto,
  Favor,
  FavorQuery,
  UpdateFavorDto,
  FavorQueryResult,
  User
} from '@helping-hand/api-common';
import { Observable, forkJoin, of, from } from 'rxjs';
import { queryString } from '@helping-hand/core/helpers/query-string';
import { mergeMap, switchMap } from 'rxjs/operators';

@Injectable()
export class FavorService {
  constructor(private httpClient: HttpClient) {}

  createFavor(favorDto: CreateFavorDto): Observable<Favor> {
    return this.httpClient.post<Favor>('api/favors', favorDto);
  }

  getFavors(query: FavorQuery): Observable<FavorQueryResult> {
    return this.httpClient.get<FavorQueryResult>(
      `api/favors${queryString(query)}`
    );
  }

  getFavorById() {}

  updateFavor(favorId: string, favorDto: UpdateFavorDto): Observable<any> {
    return this.httpClient.patch(`api/favors/${favorId}`, favorDto);
  }

  deleteFavor(favorId: string): Observable<any> {
    return this.httpClient.delete(`api/favors/${favorId}`);
  }
}
