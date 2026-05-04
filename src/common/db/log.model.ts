import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {


  @Prop({ required: true, unique: true })
  email!: string;

  @Prop()
  lastLogin!: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);