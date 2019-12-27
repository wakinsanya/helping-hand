import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch
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

  @Get(':id')
  get(@Param('id') id: string): Observable<User> {
    return this.usersService.getById(id);
  }

  @Get()
  list(): Observable<User[]> {
    return this.usersService.list();
  }

  @Patch()
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