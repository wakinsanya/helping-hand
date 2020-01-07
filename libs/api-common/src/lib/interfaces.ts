import { UserProvider, UserRole } from './enums';

export interface User {
  readonly _id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly profile: string;
  readonly pictureUrl: string;
  readonly provider: UserProvider;
  readonly thirdPartyId: string;
  readonly role: UserRole;
  readonly access_token?: string;
}

export interface Profile {
  readonly _id: string;
  readonly owner: string;
  readonly bio: string;
}

export interface Favor {
  readonly _id: string;
  readonly owner: string;
  readonly title: string;
  readonly text: string;
  readonly deadline: Date;
  readonly media: string;
  readonly isFufilled: boolean;
  readonly fufilledAt: Date;
  readonly fuffiledBy: string;
}

export interface PaginationQuery {
  skip?: number;
  limit?: number;
}

export interface FavorQuery extends PaginationQuery {
 sort: boolean;
 owners: string[];
}

export interface UserQuery extends PaginationQuery {
  userIds?: string[];
  sort: boolean;
}

export interface ProfileQuery extends PaginationQuery {
  owners: string[];
}

export interface QueryResult {
  totalCount: number;
}

export interface FavorQueryResult extends QueryResult {
  favors: Favor[];
}

export interface UserQueryResult extends QueryResult {
  users: User[];
}
