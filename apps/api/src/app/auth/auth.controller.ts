import { Controller, Get, UseGuards, Res, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '../config/config.service';
import { ConfigKeys } from '../enums/config-keys.enum';

@Controller('auth')
export class AuthController {
  constructor(private configService: ConfigService) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {

  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    const jwt: string = req.user.jwt;
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
