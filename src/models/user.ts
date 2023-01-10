import { model, Schema } from 'mongoose';
import { UserDocument } from '../document/user';
import { BANNER_URL } from '../controller/dto/user-request-dto';
export const UserSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  banner_url: { type: String, default: BANNER_URL },
  avatar_url: { type: String, required: true },
  whatsapp: { type: String, default: null },
  instagram: { type: String, default: null },
  description: { type: String, required: true },
  freelas: { type: Array, required: false, default: [] },
  total_posts: { type: Number, required: false, default: 0 },
  active_posts: { type: Number, required: false, default: 0 }
});

const User = model<UserDocument>('User', UserSchema);

export default User;
