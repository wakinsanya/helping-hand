import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common';
import { FavorService } from '@api/favor/services/favor.service';
import {
  CreateFavorDto,
  Favor,
  UpdateFavorDto,
  FavorQueryResult
} from '@helping-hand/api-common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('favors')
export class FavorController {
  constructor(private readonly favorService: FavorService) {}

  @Post()
  create(@Body() favorDto: CreateFavorDto): Observable<Favor> {
    return this.favorService.create(favorDto);
  }

  @Get()
  list(
    @Query('owners') owners: string,
    @Query('notOwners') notOwners: string,
    @Query('sort') sort: string,
    @Query('skip') skip: string,
    @Query('limit') limit: string,
    @Query('fufilled') fufilled: string,
  ): Observable<FavorQueryResult> {
    return this.favorService.list(
      owners && owners.length ? owners.split(',') : [],
      notOwners && notOwners.length ? notOwners.split(',') : [],
      sort === 'true',
      parseInt(skip, 10),
      parseInt(limit, 10),
      fufilled === 'false' ? false : undefined,
    );
  }

  @Get(':favorId')
  get(@Param('favorId') favorId: string): Observable<Favor> {
    return this.favorService.getById(favorId);
  }

  @Patch(':favorId')
  update(
    @Param('favorId') favorId: string,
    @Body() favorDto: UpdateFavorDto
  ): Observable<Favor> {
    return this.favorService.updateById(favorId, favorDto);
  }

  @Delete(':favorId')
  delete(@Param('favorId') favorId: string): Observable<any> {
    return this.favorService.delete(favorId);
  }
}
