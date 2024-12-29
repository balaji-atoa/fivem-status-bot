import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type StatusChannelsDocument = HydratedDocument<StatusChannels>;

@Schema()
export class StatusChannels {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: ObjectId;

  @Prop({ required: true })
  messageId: string;

  @Prop({ required: true })
  channelId: string;

  @Prop({ required: true })
  guildId: string;

  @Prop({ type: Boolean, default: true })
  active?: boolean;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Date, default: new Date().toISOString() })
  createdAt?: Date;
}

export const StatusChannelsSchema =
  SchemaFactory.createForClass(StatusChannels);
