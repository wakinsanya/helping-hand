import { UserDocument } from './user-document.interface';

export interface UserQueryAggregationResult {
  users: UserDocument[];
  usersTotalCount: number;
}
