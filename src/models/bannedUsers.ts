import { model, Schema } from 'mongoose';
import { BannedUserDocument } from '../document/bannedUser';

export const BannedSchema = new Schema({
  _id: { type: String, required: true },
  banned_at: { type: Date, required: false, default: new Date() }
});

const BannedUsers = model<BannedUserDocument>('BannedUsers', BannedSchema);
export default BannedUsers;
