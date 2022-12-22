import { Document } from 'mongoose';
import { FreelaDocument } from './freela';
export interface UserDocument extends Document {
  _id: string;
  name: string;
  description: string | null;
  banner_url: string;
  avatar_url: string;
  whatsapp: string | null;
  instagram: string | null;
  freelas: [FreelaDocument];
  total_posts: number;
  active_posts: number;
}
