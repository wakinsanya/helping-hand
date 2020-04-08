import { UserProvider, UserRole } from './enums';
import { ProfileData } from './interfaces';

export class CreateUserDto {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly thirdPartyId?: string;
  readonly provider: UserProvider;
  readonly pictureUrl: string;
}

export class UpdateUserDto {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly profile?: string;
  readonly pictureUrl?: string;
}

export class CreateProfileDto {
  readonly owner: string;
  readonly bio: string;
  readonly publicDataKeys?: string[];
  readonly data: ProfileData;
}

export class UpdateProfileDto {
  readonly bio?: string;
  readonly publicDataKeys?: string[];
  readonly data?: ProfileData;
  readonly metadata?: {
    totalStars?: number,
    totalFavorites?: number,
    starredPosts?: string[],
    favoritePosts?: string[]
  }
}

export class CreateFavorDto {
  readonly owner: string;
  readonly title: string;
  readonly deadline: Date;
  readonly text?: string;
  readonly media?: string;
}

export class UpdateFavorDto {
  readonly title?: string;
  readonly text?: string;
  readonly deadline?: Date;
  readonly media?: string;
  readonly isFufilled?: boolean;
  readonly fufilledAt?: Date;
  readonly fuffiledBy?: string;
}

export class CreatePostDto {
  readonly title: string;
  readonly owner: string;
  readonly text?: string;
  readonly media?: string;
}

export class UpdatePostDto {
  readonly title?: string;
  readonly media?: string;
  readonly text?: string;
  readonly metadata: {
    stars?: number,
    favorites?: number,
    favoritePosts: string[],
    starredPosts: string[]
  }
}

export class CreateCommentDto {
  readonly text: string;
  readonly media: string;
  readonly metadata: {
    votes: number;
    isFavorite: boolean
  }
}

export class UpdateCommentDto {
  readonly text: string;
  readonly media: string;
  readonly metadata: {
    votes?: number;
    isFavorite?: boolean
  }
}
