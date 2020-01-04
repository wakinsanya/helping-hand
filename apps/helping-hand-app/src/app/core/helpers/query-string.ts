import { FavorQuery, UserQuery, ProfileQuery } from '@helping-hand/api-common';

export function queryString(
  query: FavorQuery | UserQuery | ProfileQuery
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
