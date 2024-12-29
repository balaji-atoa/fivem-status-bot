import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { CfxService } from '../cfx/cfx.service';
import { InjectModel } from '@nestjs/mongoose';
import { StatusChannels } from '../schemas/status-channels.schema';
import { Model } from 'mongoose';

@Injectable()
export class SlashCommandsService {
  constructor(
    private cfxService: CfxService,
    @InjectModel(StatusChannels.name)
    private statusChannels: Model<StatusChannels>,
  ) {}

  @SlashCommand({
    name: 'set-status-channel',
    description: 'set a channel to report the status',
  })
  async handleStatusReportChannelSetup(
    @Context() [interaction]: SlashCommandContext,
  ) {
    const isSendable = interaction.channel.isSendable();
    const isThread = interaction.channel.isThread();
    const isTextBased = interaction.channel.isTextBased();

    if (!isSendable || !isTextBased) {
      await interaction.reply({
        content: `I dont have permission to send message on this channel, or it is not text based`,
        ephemeral: true,
      });
      return;
    }

    if (isThread) {
      await interaction.reply({
        content: `Can't setup status channel on threads`,
        ephemeral: true,
      });
      return;
    }
    const latestEmbed = await this.cfxService.fetchDataAndGenerateEmbed();

    const message = await interaction.channel.send({ embeds: [latestEmbed] });

    const document = await this.statusChannels.create({
      channelId: interaction.channelId,
      guildId: interaction.guildId,
      messageId: message.id,
      updatedAt: new Date().toISOString(),
    });
    await document.save();
    await interaction.reply({
      content: `ReferenceId: ${document._id} - SETUP DONE!`,
      ephemeral: true,
    });
  }

  // TODO: remove-status-channel
}
