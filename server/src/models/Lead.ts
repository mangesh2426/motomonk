import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source: string;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    message: {
      type: String,
    },

    source: {
      type: String,
      enum: ['web', 'whatsapp', 'call'],
      default: 'web',
    },

    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'],
      default: 'New',
    },

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model<ILead>('Lead', leadSchema);

export default Lead;