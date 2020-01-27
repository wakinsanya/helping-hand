import { Injectable, ExecutionContext } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { TokenExpiredError } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
