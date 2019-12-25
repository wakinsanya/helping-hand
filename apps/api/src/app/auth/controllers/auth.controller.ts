import { Controller, Get, UseGuards, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '../../config/services/config.service';
import { ConfigKeys } from '../../enums/config-keys.enum';

@Controller('auth')
export class AuthController {
  constructor(private configService: ConfigService) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req: Request, @Res() res: Response) {
    const jwt: string = (req as any).user.jwt;
    if (jwt) {
      res.redirect(
        `${this.configService.get(
          ConfigKeys.GOOGLE_REDIRECT_URL_SUCCESS
        )}/${jwt}`
      );
    } else {
      res.redirect(
        `${this.configService.get(ConfigKeys.GOOGLE_REDIRECT_URL_FAILURE)}`
      );
    }
  }
}
