import { PaginationOptions } from './interfaces';

export function paginationQuery(opts: PaginationOptions): any[] {
  const facetStage: any = {
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

  let sortStage: any;

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
