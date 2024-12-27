import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SlashCommandsService } from './slash-commands/slash-commands.service';
import { TextCommandsService } from './text-commands/text-commands.service';
import { NecordModule } from 'necord';
import { ConfigModule, ConfigService } from '@nestjs/config';
import loadEnvVars from './config';
import { IntentsBitField } from 'discord.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadEnvVars],
      isGlobal: true,
    }),
    NecordModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const botToken = configService.get<string>('botToken');
        const intents = [
          IntentsBitField.Flags.Guilds,
          IntentsBitField.Flags.GuildMessages,
          IntentsBitField.Flags.DirectMessages,
          IntentsBitField.Flags.MessageContent,
        ];
        return { token: botToken, intents };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, SlashCommandsService, TextCommandsService],
})
export class AppModule {}
