import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserQueryResult
} from '@helping-hand/api-common';
import { UsersService } from '@api/users/services/users.service';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() userDto: CreateUserDto): Observable<User> {
    return this.usersService.create(userDto);
  }

  @Get(':userId')
  get(@Param('userId') userId: string): Observable<User> {
    return this.usersService.getById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(
    @Query('users') users: string,
    @Query('sort') sort: string,
    @Query('skip') skip: string,
    @Query('limit') limit: string
  ): Observable<UserQueryResult> {
    return this.usersService.list(
      users && users.length ? users.split(',') : [],
      sort === 'true',
      parseInt(skip, 10),
      parseInt(limit, 10)
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':userId')
  update(
    @Param('userId') userId: string,
    @Body() userDto: UpdateUserDto
  ): Observable<User> {
    return this.usersService.updateById(userId, userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  delete(@Param('userId') userId: string): Observable<any> {
    return this.usersService.delete(userId);
  }
}
