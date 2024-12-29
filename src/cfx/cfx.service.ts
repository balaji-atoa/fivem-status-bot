import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { StatusChannels } from '../schemas/status-channels.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ChannelManager, GuildManager } from 'discord.js';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CfxStatusDto } from '../models/status.dto';

@Injectable()
export class CfxService {
  constructor(
    @InjectModel(StatusChannels.name)
    private statusChannels: Model<StatusChannels>,
    private guildManager: GuildManager,
    private channelManager: ChannelManager,
    private configService: ConfigService,
  ) {}

  @Cron('5 * * * * *')
  async handleCfxStatus() {
    const url = this.configService.getOrThrow<string>('cfxApiSummaryUrl');
    const summary = await axios.get(url);
    const data = summary.data;
    const cfxStatus = data.status as CfxStatusDto;
    console.log(summary, cfxStatus);
  }
}
