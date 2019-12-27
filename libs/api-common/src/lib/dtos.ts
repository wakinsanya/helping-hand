import { Providers } from './enums';

export class CreateUserDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly thirdPartyId: string;
  readonly provider: Providers;
  readonly pictureUrl: string;
}

export class UpdateUserDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly pictureUrl: string;
}

export class CreateProfileDto {
  readonly owner: string;
  readonly bio: string;
}

export class UpdateProfileDto {
  readonly bio: string;
}

export class CreateFavorDto {
  readonly owner: string;
  readonly title: string;
  readonly text: string;
  readonly media: string;
}

export class UpdateFavorDto {
  readonly title: string;
  readonly text: string;
  readonly media: string;
  readonly isFufilled: boolean;
  readonly fufilledAt: Date;
  readonly fuffiledBy: string;
}