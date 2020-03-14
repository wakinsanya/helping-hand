declare type sortOrder = 'ascending' | 'descending';

/**
 * Interface describing pagination options that can be set.
 */
export interface PaginationOptions {
  /**
   * Whether to sort retrived documents. If true, both the sort field
   * and the ascending flag are required.
   */
  sort: boolean;
  /**
   * Specifies the document odering.
   */
  sortOrder?: sortOrder;
  /**
   * Field to sort by,
   */
  sortField?: string;
  /**
   * Number of documents to be skipped.
   */
  skip: number;
  /**
   * Maximum number of documents to return.
   */
  limit: number;
  /**
   * Name of entity being paginated.
   */
  entity: string;
}


interface Filterable {
  key: string;
  value: string | string[];
  range: boolean;
}
