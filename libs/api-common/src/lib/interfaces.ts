import { Providers } from './enums';

export interface User {
  readonly firstName: string;
  readonly lastName: string;
  readonly profile: string;
  readonly provider: Providers;
  readonly thirdPartyId: string;
}

export interface Profile {
  readonly owner: string;
  readonly bio: string;
}

export interface Favor {
  readonly owner: string;
  readonly text: string;
  readonly media: string;
  readonly isFufilled: boolean;
  readonly fufilledAt: Date;
  readonly fuffiledBy: string;
}
