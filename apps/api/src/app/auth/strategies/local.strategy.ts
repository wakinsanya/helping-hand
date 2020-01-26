import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from '@api/auth/services/auth.service';
import { Observable, of, throwError } from 'rxjs';
import { User } from '@helping-hand/api-common';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);
  constructor(
    private readonly authService: AuthService
  ) {
    super();
  }

  validate(username: string, password: string): Promise<{}> {
    return Promise.resolve({});
  }
}
