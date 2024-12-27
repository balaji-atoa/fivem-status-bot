import { Test, TestingModule } from '@nestjs/testing';
import { TextCommandsService } from './text-commands.service';

describe('TextCommandsService', () => {
  let service: TextCommandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextCommandsService],
    }).compile();

    service = module.get<TextCommandsService>(TextCommandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
