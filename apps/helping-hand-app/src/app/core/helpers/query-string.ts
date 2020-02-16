import {
  FavorQuery,
  UserQuery,
  ProfileQuery,
  SubscriptionQuery,
  CommentQuery,
  PostQuery
} from '@helping-hand/api-common';

declare type ResourceQuery =
  | FavorQuery
  | UserQuery
  | ProfileQuery
  | CommentQuery
  | PostQuery
  | SubscriptionQuery;

export function queryString(query: ResourceQuery): string {
  return '?'.concat(
    Object.keys(query)
      .map(key => {
        if (query[key] instanceof Array) {
          return `${key}=${(query[key] as Array<string>).join(',')}`;
        } else {
          return `${key}=${query[key]}`;
        }
      })
      .join('&')
  );
}
