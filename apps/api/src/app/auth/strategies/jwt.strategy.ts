import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/services/config.service';
import { ConfigKeys } from '../../enums/config-keys.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

}
