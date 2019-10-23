import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { Observable } from 'rxjs';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() userDto: UserDto): Observable<User> {
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
  update(@Body() userDto: UserDto): Observable<User> {
    return this.usersService.update(userDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Observable<{ [key: string]: number }> {
    return this.usersService.delete(id);
  }
}
