import { Test, TestingModule } from '@nestjs/testing';
import { Comment.Provider } from './comment.provider';

describe('Comment.Provider', () => {
  let provider: Comment.Provider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Comment.Provider],
    }).compile();

    provider = module.get<Comment.Provider>(Comment.Provider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
