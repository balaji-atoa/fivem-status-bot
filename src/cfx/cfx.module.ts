import { Module } from '@nestjs/common';
import { CfxService } from './cfx.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StatusChannels,
  StatusChannelsSchema,
} from '../schemas/status-channels.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StatusChannels.name, schema: StatusChannelsSchema },
    ]),
  ],
  providers: [CfxService],
  exports: [CfxService],
})
export class CfxModule {}
