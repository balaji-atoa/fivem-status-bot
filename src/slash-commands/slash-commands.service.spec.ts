import { Test, TestingModule } from '@nestjs/testing';
import { SlashCommandsService } from './slash-commands.service';

describe('SlashCommandsService', () => {
  let service: SlashCommandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlashCommandsService],
    }).compile();

    service = module.get<SlashCommandsService>(SlashCommandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
