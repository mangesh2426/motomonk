import mongoose, { Schema, Document } from 'mongoose';

export interface ICallRecord extends Document {
  leadId?: mongoose.Types.ObjectId;
  phoneNumber: string;
  duration: number;
  status: 'completed' | 'failed' | 'no-answer';
  summary?: string;
  transcript?: string;
  createdAt: Date;
}

const callRecordSchema = new Schema(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['completed', 'failed', 'no-answer'],
      required: true,
    },
    summary: {
      type: String,
    },
    transcript: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CallRecord = mongoose.model<ICallRecord>('CallRecord', callRecordSchema);

export default CallRecord;
