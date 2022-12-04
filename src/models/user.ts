import { model, Schema } from 'mongoose';
import { UserDocument } from '../document/user';
export const UserSchema = new Schema({
  _id: { type: String, required: true },
  banner_url: { type: String, required: true },
  avatar_url: { type: String, required: true },
  whatsapp: {type: String, required: true},
  instagram: { type: String, required: true },
  description: { type: String, required: true },
  freelas: { type: Array, required: false, default: [] }
});

const User = model<UserDocument>('User', UserSchema);

export default User;
