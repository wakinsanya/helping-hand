import { Controller, Get, UseGuards, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@api/config/services/config.service';
import { ConfigKeys } from '@api/enums/config-keys.enum';

@Controller('auth')
export class AuthController {
  constructor(private configService: ConfigService) {}
}

