import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
@Controller()
export class AppController {
  constructor() {}

  @Get()
  getWelcomeMessage(@Req() req: Request, @Res() res: Response): string {
    return 'Helping Hand Api';
  }
}
