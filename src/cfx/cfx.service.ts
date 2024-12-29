import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { StatusChannels } from '../schemas/status-channels.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  ChannelManager,
  EmbedBuilder,
  GuildManager,
  TextChannel,
} from 'discord.js';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CfxSummaryDto } from '../models/summary.dto';
import { plainToInstance } from 'class-transformer';
import { CfxComponentDto } from '../models/components.dto';
import { ComponentStatusEnum } from '../enum/component-status.enum';
import { CfxStatusDto } from '../models/status.dto';
import { IndicatorEnum } from '../enum/indicator.enum';

@Injectable()
export class CfxService {
  private logger = new Logger(CfxService.name);
  constructor(
    @InjectModel(StatusChannels.name)
    private statusChannels: Model<StatusChannels>,
    private guildManager: GuildManager,
    private channelManager: ChannelManager,
    private configService: ConfigService,
  ) {}

  // RUNS every 5th second
  @Cron(`*/5 * * * * *`)
  async handleCfxStatus() {
    const startTime = Date.now();
    const newEmbed = await this.fetchDataAndGenerateEmbed();
    const statusChannelsToEdit = await this.statusChannels.find().exec();
    for (const statusChannel of statusChannelsToEdit) {
      const message = await this.getMessageById(
        statusChannel.channelId,
        statusChannel.guildId,
        statusChannel.messageId,
      );

      message.edit({ embeds: [newEmbed] });
    }
    const timeTaken = Date.now() - startTime;
    this.logger.log(`${timeTaken}ms - ${new Date().toISOString()}`);
    // console.log(statusChannelsToEdit);
  }

  async getMessageById(channelId: string, guildId: string, messageId: string) {
    const channel = this.channelManager.cache.find(
      (channel) => channel.id === channelId,
    );

    if (!channel)
      this.logger.error(
        `${channelId} - ${guildId} - ${messageId} - FAILED - CHANNEL DOES NOT EXIST`,
      );

    if (!channel.isTextBased())
      this.logger.error(
        `${channelId} - ${guildId} - ${messageId} - FAILED - CHANNEL IS NOT TEXT BASED`,
      );

    const textChannel = channel as TextChannel;
    const messages = await textChannel.messages.fetch({ limit: 50 });
    const wantedMessage = messages.find((message) => message.id === messageId);

    return wantedMessage;
  }

  forgeEmbed(components: CfxComponentDto[], status: CfxStatusDto) {
    let str = `${IndicatorEnum[status.indicator]} ${status.description}\n\n`;
    for (const component of components) {
      component.name = this.sanitizeString(component.name);
      const emoji = ComponentStatusEnum[component.status];
      str += `${emoji} ${component.name} - ${component.status}\n`;
    }
    let color;
    switch (status.indicator) {
      case 'critical':
        color = 'Red';
        break;
      case 'major':
        color = 'Orange';
        break;
      case 'minor':
        color = 'Yellow';
        break;
      default:
        color = 'Green';
        break;
    }
    return new EmbedBuilder()
      .setTitle(`Cfx.re Status`)
      .setDescription(str)
      .setColor(color)
      .setThumbnail(
        'https://avatars.githubusercontent.com/u/25160833?s=280&v=4',
      )
      .setTimestamp();
  }

  sanitizeString(str: string) {
    return str.replace(/"/g, '');
  }

  async fetchDataAndGenerateEmbed() {
    const url = this.configService.getOrThrow<string>('cfxApiSummaryUrl');
    const summary = await axios.get(url);
    const data = plainToInstance(CfxSummaryDto, summary.data, {
      excludeExtraneousValues: true,
    });
    const newEmbed = this.forgeEmbed(data.components, data.status);
    return newEmbed;
  }
}
