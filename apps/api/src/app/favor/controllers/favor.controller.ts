import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete
} from '@nestjs/common';
import { FavorService } from '@api/favor/services/favor.service';
import {
  CreateFavorDto,
  Favor,
  UpdateFavorDto
} from '@helping-hand/api-common';
import { Observable } from 'rxjs';

@Controller('favor')
export class FavorController {
  constructor(private readonly favorService: FavorService) {}

  @Post()
  create(@Body() favorDto: CreateFavorDto): Observable<Favor> {
    return this.favorService.create(favorDto);
  }

  @Get(':id')
  get(@Param('id') id: string): Observable<Favor> {
    return this.favorService.getById(id);
  }

  @Get()
  list(): Observable<Favor[]> {
    return this.favorService.list();
  }

  @Patch()
  update(
    @Param('favorId') favorId: string,
    @Body() favorDto: UpdateFavorDto
  ): Observable<Favor> {
    return this.favorService.updateById(favorId, favorDto);
  }

  @Delete(':favorId')
  delete(@Param('favorId') userId: string): Observable<any> {
    return this.favorService.delete(userId);
  }
}
