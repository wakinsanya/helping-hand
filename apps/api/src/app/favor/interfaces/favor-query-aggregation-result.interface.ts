import { FavorDocument } from './favor-document.interface';

export interface FavorQueryAggregationResult {
  favors: FavorDocument[];
  favorsTotalCount: number;
}
