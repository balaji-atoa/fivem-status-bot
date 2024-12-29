import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SlashCommandsService } from './slash-commands/slash-commands.service';
import { TextCommandsService } from './text-commands/text-commands.service';
import { NecordModule } from 'necord';
import { ConfigModule, ConfigService } from '@nestjs/config';
import loadEnvVars from './config';
import { IntentsBitField } from 'discord.js';
import { CfxModule } from './cfx/cfx.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongooseConnectionUrl = configService.getOrThrow<string>(
          'mongooseConnectionUrl',
        );

        return {
          uri: mongooseConnectionUrl,
          dbName: 'cfx-core',
        };
      },
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [loadEnvVars],
      isGlobal: true,
    }),
    NecordModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const botToken = configService.getOrThrow<string>('botToken');
        const intents = [
          IntentsBitField.Flags.Guilds,
          IntentsBitField.Flags.GuildMessages,
          IntentsBitField.Flags.DirectMessages,
          IntentsBitField.Flags.MessageContent,
        ];
        const developmentGuildIds = configService.getOrThrow<string[]>(
          'developmentGuildIds',
        );

        return { token: botToken, intents, development: developmentGuildIds };
      },
    }),
    CfxModule,
  ],
  controllers: [AppController],
  providers: [AppService, SlashCommandsService, TextCommandsService],
})
export class AppModule {}
