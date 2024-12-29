import { Test, TestingModule } from '@nestjs/testing';
import { CfxService } from './cfx.service';

describe('CfxService', () => {
  let service: CfxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CfxService],
    }).compile();

    service = module.get<CfxService>(CfxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
