import { Providers } from './enums';

export class CreateUserDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly provider: Providers;
  readonly thirdyPartyId: string;
}

export class UpdateUserDto {
  readonly firstName: string;
  readonly lastName: string;
}

export class CreateFavorDto {
  readonly owner: string;
  readonly text: string;
  readonly media: string;
}

export class UpdateFavorDto {
  readonly text: string;
  readonly media: string;
  readonly isFufilled: boolean;
  readonly fufilledAt: Date;
  readonly fuffiledBy: string;
}

export class CreateProfileDto {
  readonly owner: string;
  readonly bio: string;
}

export class UpdateProfileDto {
  readonly bio: string;
}
