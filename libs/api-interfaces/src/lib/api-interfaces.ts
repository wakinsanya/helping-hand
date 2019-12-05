export interface User {
  readonly _id: string,
  readonly firstName: string,
  readonly lastName: string,
  readonly provider: string,
  readonly profile: string,
  readonly thirdPartyId: string
}

export interface Profile {
  readonly owner: string;
  readonly bio: string;
  readonly picture: string;
}

export interface Favor {
  readonly owner: string;
  readonly isFufilled: boolean;
  readonly createdAt: Date;
  readonly fufilledAt: Date;
  readonly fuffiledBy: string;
}
