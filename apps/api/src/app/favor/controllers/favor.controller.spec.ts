import { Test, TestingModule } from '@nestjs/testing';
import { FavorController } from './favor.controller';

describe('Favor Controller', () => {
  let controller: FavorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavorController],
    }).compile();

    controller = module.get<FavorController>(FavorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
