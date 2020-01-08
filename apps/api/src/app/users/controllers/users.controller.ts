import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  Query
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User, CreateUserDto, UpdateUserDto } from '@helping-hand/api-common';
import { UsersService } from '@api/users/services/users.service';

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

  @Get()
  list(
    @Query('users') users: string,
    @Query('sort') sort: string,
    @Query('skip') skip: string,
    @Query('limit') limit: string
  ): Observable<User[]> {
    return this.usersService.list();
  }

  @Patch(':userId')
  update(
    @Param('userId') userId: string,
    @Body() userDto: UpdateUserDto
  ): Observable<User> {
    return this.usersService.updateById(userId, userDto);
  }

  @Delete(':userId')
  delete(
    @Param('userId') userId: string
  ): Observable<any> {
    return this.usersService.delete(userId);
  }
}
