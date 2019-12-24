import { Injectable } from '@angular/core';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Providers, User } from '@helping-hand/common';
import { ConfigService } from '../../config/config.service';
import { ConfigKeys } from '../../enums/config-keys.enum';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}


  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  async loginWithOAuth(profile: any) {
    console.log(profile);
  }

  async validateOAuthLogin(
    thirdPartyId: string,
    provider: Providers
  ): Promise<string> {
    try {
      let user: any = await this.usersService.getByThirdPartyId(thirdPartyId);

      const payload = {
        thirdPartyId,
        provider
      };

      const jwt: string = sign(
        payload,
        this.configService.get(ConfigKeys.JWT_SECRET_KEY),
        { expiresIn: 3600 }
      );
      return jwt;
    } catch (e) {
      throw e;
    }
  }
}
