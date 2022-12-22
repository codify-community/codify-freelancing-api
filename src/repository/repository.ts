import { FreelaDocument } from '../document/freela';
import { UserDocument } from '../document/user';
import User from '../models/user';
export class Repository {
  public findById = (_id: string): Promise<UserDocument> => User.findOne({ _id }).exec() as any;

  public get(): Promise<UserDocument[]> {
    return User.find().exec();
  }

  public register_user(user: UserDocument) {
    return new User(user).save();
  }

  public async save_user(user) {
    user.save();
  }
}
