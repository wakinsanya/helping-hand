import { Document } from 'mongoose';

export interface User {
  readonly firstName: string;
  readonly lastName: string;
  readonly provider: string;
  readonly profile: string;
  readonly thirdPartyId: string;
}

export interface UserDocument extends User, Document {}

export interface Profile {
  readonly owner: string;
  readonly bio: string;
}

export interface ProfileDocument extends Profile, Document {}

export interface Favor {
  readonly owner: string;
  readonly text: string;
  readonly media: string;
  readonly isFufilled: boolean;
  readonly createdAt: Date;
  readonly fufilledAt: Date;
  readonly fuffiledBy: string;
}

export interface FavorDocument extends Favor, Document {}
