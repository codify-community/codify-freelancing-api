import { FreelaDocument } from '../document/freela';
import { UserDocument } from '../document/user';
import User from '../models/user';
export class Repository {
  public findById = (_id: string) => User.findOne({ _id }).exec();

  public get(): Promise<UserDocument[]> {
    return User.find().exec();
  }

  public register_user(user: UserDocument) {
    return new User(user).save();
  }

  public async register_freela(_id: string, freela: FreelaDocument) {
    const user = await User.findOne({ _id });
    user?.freelas.push(freela);
    return user?.save();
  }
}
