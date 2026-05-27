import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  sessionId: string;
  sender: 'user' | 'bot';
  message: string;
  source: 'web' | 'whatsapp';
  createdAt: Date;
}

const chatMessageSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    sender: {
      type: String,
      enum: ['user', 'bot'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: ['web', 'whatsapp'],
      default: 'web',
    },
  },
  {
    timestamps: true,
  }
);

const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);

export default ChatMessage;
