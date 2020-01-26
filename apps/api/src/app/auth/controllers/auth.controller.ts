import { Controller, Req, Post } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Req() req: Request): Observable<{ access_token: string }> {
    return this.authService.login(req.body.user);
  }
}
