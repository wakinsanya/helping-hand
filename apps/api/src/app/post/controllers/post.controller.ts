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
import { PostService } from '@api/post/services/post.service';
import {
  Post as IPost,
  PostQueryResult,
  UpdatePostDto,
  CreatePostDto
} from '@helping-hand/api-common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() postDto: CreatePostDto): Observable<IPost> {
    return this.postService.create(postDto);
  }

  @Get()
  list(
    @Query('owner') owner: string,
    @Query('sort') sort: string,
    @Query('skip') skip: string,
    @Query('limit') limit: string
  ): Observable<PostQueryResult> {
    return this.postService.list(
      owner,
      sort === 'true',
      parseInt(skip, 10),
      parseInt(limit, 10)
    );
  }

  @Get(':postId')
  get(@Param('postId') postId: string): Observable<IPost> {
    return this.postService.getById(postId);
  }

  @Patch(':postId')
  update(
    @Param('postId') postId: string,
    @Body() postDto: UpdatePostDto
  ): Observable<IPost> {
    return this.postService.updateById(postId, postDto);
  }

  @Delete(':postId')
  delete(@Param('postId') postId: string): Observable<any> {
    return this.postService.delete(postId);
  }
}
