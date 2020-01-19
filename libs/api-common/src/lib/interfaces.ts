import { UserProvider, UserRole, SubscriptionLabel } from './enums';

export interface User {
  readonly _id: string;
  readonly email: string;
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
  readonly subscriptions: Subscription[];
}

export interface Subscription {
  subscription: {
    endpoint: string;
    expirationTime: number;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
  label: SubscriptionLabel;
  owner: string;
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
  date?: Date;
  user?: User;
}

export interface PaginationQuery {
  skip?: number;
  limit?: number;
}

export interface FavorQuery extends PaginationQuery {
  sort: boolean;
  owners?: string[];
  notOwners?: string[];
}

export interface UserQuery extends PaginationQuery {
  sort: boolean;
  users?: string[];
}

export interface ProfileQuery extends PaginationQuery {
  owners: string[];
}

export interface FavorQueryResult {
  favors: Favor[];
  favorsTotalCount: number;
}

export interface UserQueryResult {
  users: User[];
  usersTotalCount: number;
}

export interface SubscriptionQuery {
  owner: string;
  labels: SubscriptionLabel[];
}
