import { Document } from 'mongoose';
import { FreelaDocument } from './freela';
export interface UserDocument extends Document {
  _id: string;
  name: string;
  description: string;
  banner_url: string;
  avatar_url: string;
  whatsapp: string;
  instagram: string;
  freelas: [FreelaDocument];
  total_posts: number;
  active_posts: number;
}
