import {
  FavorQuery,
  UserQuery,
  ProfileQuery,
  SubscriptionQuery
} from '@helping-hand/api-common';

export function queryString(
  query: FavorQuery | UserQuery | ProfileQuery | SubscriptionQuery
): string {
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
