import { Document } from 'mongoose';

export interface BannedUserDocument extends Document {
  id: string;
  banned_at: Date;
}
