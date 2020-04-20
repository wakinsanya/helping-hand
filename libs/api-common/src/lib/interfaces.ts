import {
  UserProvider,
  UserRole,
  SubscriptionLabel,
  ProfileDataKey
} from './enums';

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
  access_token?: string;
  profileBody?: Profile;
}

export interface Profile {
  readonly _id: string;
  readonly owner: string;
  readonly bio: string;
  readonly subscriptions: Subscription[];
  readonly publicDataKeys: ProfileDataKey[];
  readonly data: ProfileData;
  readonly metadata?: {
    totalStars: number;
    totalFavorites: number;
    favoritePosts: string[];
    starredPosts: string[];
  };
}

export interface Post {
  readonly _id: string;
  readonly owner: string;
  readonly title: string;
  readonly text: string;
  readonly edited: boolean;
  readonly media: string;
  readonly comments: string[];
  readonly createdAt: string | Date;
  readonly updatedAt: string | Date;
  readonly metadata: {
    stars: number;
    favorites: number;
  };
}

export interface Comment {
  readonly _id: string;
  readonly owner: string;
  readonly text: string;
  readonly edited: boolean;
  readonly metadata: {
    stars: number;
  };
  readonly createdAt: string | Date;
  readonly updatedAt: string | Date;
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
  profile?: Profile;
}

export interface ProfileData {
  email?: string;
  phoneNumber?: string;
  instagramUsername?: string;
  twitterUsername?: string;
}

export interface PaginationQuery {
  skip?: number;
  limit?: number;
}

export interface FavorQuery extends PaginationQuery {
  sort: boolean;
  owners?: string[];
  notOwners?: string[];
  ignoreExpired?: boolean;
  fufilled?: boolean;
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

export interface PostQueryResult {
  posts: Post[];
  postsTotalCount: number;
}

export interface UserQueryResult {
  users: User[];
  usersTotalCount: number;
}

export interface SubscriptionQuery {
  owner: string;
  labels: SubscriptionLabel[];
}

export interface PostQuery extends PaginationQuery {
  owner?: string;
  orderByVotes?: boolean;
  orderByDate?: boolean;
}

export interface CommentQuery extends PaginationQuery {
  ids?: string[];
  post: string;
  sort?: boolean;
}

export interface CommentQueryResult {
  comments: Comment[];
  commentsTotalCount: number;
}
