import { PaginationOptions } from './interfaces';

/**
 * Creates a MongoDB sub-aggregate for paginating and sorting a collection
 * @param opts pagination opts
 */
export function paginationQuery(opts: PaginationOptions): any[] {
  const facetStage: {
    $facet: {
      [key: string]: {
        [key: string]: string | number | { [key: string]: number };
      }[];
    };
  } = {
    $facet: {
      [`${opts.entity}`]: [
        {
          $skip: opts.skip
        },
        {
          $limit: opts.limit
        }
      ],
      [`${opts.entity}TotalCount`]: [
        {
          $count: 'count'
        }
      ]
    }
  };

  let sortStage: { $sort: { [key: string]: number } };

  if (opts.sort && (!opts.sortField || !opts.sortOrder)) {
    throw new Error('Sorting requires a sort field and sort order');
  } else if (opts.sort && opts.sortField && opts.sortOrder) {
    sortStage = {
      $sort: {
        [`${opts.sortField}`]: opts.sortOrder === 'ascending' ? 1 : -1
      }
    };
  }

  const projectStage = {
    $project: {
      [`${opts.entity}`]: 1,
      [`${opts.entity}TotalCount`]: {
        $arrayElemAt: [`$${opts.entity}TotalCount.count`, 0]
      }
    }
  };

  if (sortStage) {
    facetStage.$facet[`${opts.entity}`].unshift(sortStage);
  }

  return [facetStage, projectStage];
}
