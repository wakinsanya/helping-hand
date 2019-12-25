import { Providers } from './enums';

export interface User {
  readonly _id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly profile: string;
  readonly provider: Providers;
  readonly thirdPartyId: string;
}

export interface Profile {
  readonly _id: string;
  readonly owner: string;
  readonly bio: string;
}

export interface Favor {
  readonly _id: string;
  readonly owner: string;
  readonly text: string;
  readonly media: string;
  readonly isFufilled: boolean;
  readonly fufilledAt: Date;
  readonly fuffiledBy: string;
}
