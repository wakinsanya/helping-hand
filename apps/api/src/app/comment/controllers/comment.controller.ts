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
import {
  CommentQueryResult,
  UpdateCommentDto,
  CreateCommentDto,
  Comment
} from '@helping-hand/api-common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { CommentService } from '@api/comment/services/comment.service';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() commentDto: CreateCommentDto): Observable<Comment> {
    return this.commentService.create(commentDto);
  }

  @Get()
  list(
    @Query('post') post: string,
    @Query('owner') owner: string,
    @Query('sort') sort: string,
    @Query('skip') skip: string,
    @Query('limit') limit: string
  ): Observable<CommentQueryResult> {
    return this.commentService.list(
      post,
      owner,
      sort === 'true',
      parseInt(skip, 10),
      parseInt(limit, 10)
    );
  }

  @Get(':commentId')
  get(@Param('commentId') commentId: string): Observable<Comment> {
    return this.commentService.getById(commentId);
  }

  @Patch(':commentId')
  update(
    @Param('commentId') commentId: string,
    @Body() commentDto: UpdateCommentDto
  ): Observable<Comment> {
    return this.commentService.updateById(commentId, commentDto);
  }

  @Delete(':commentId')
  delete(@Param('commentId') commentId: string): Observable<any> {
    return this.commentService.delete(commentId);
  }
}
