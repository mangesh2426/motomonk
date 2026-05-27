import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  assistantName: string;
  systemPrompt: string;
  humanHandoff: boolean;
  productionSecretKey?: string;
  whatsappWebhookVerifyToken?: string;
}

const settingsSchema = new Schema(
  {
    assistantName: {
      type: String,
      default: 'Moto Monk Sales Assistant',
    },
    systemPrompt: {
      type: String,
      default: 'You are a helpful sales assistant for Moto Monk. You help users find motorcycles, answer questions about pricing, and schedule test rides. Always be polite and try to gather their contact information for a follow-up.',
    },
    humanHandoff: {
      type: Boolean,
      default: true,
    },
    productionSecretKey: {
      type: String,
      default: '',
    },
    whatsappWebhookVerifyToken: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model<ISettings>('Settings', settingsSchema);

export default Settings;
