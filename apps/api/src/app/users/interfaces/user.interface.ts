import { Document } from 'mongoose';

export interface User extends Document {
  readonly email: string;
  readonly lastName: string;
  readonly username: string;
  readonly firstName: string;
  readonly description: string;
}
