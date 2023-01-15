import { UserDocument } from '../document/user';
import User from '../models/user';
import BannedUsers from '../models/bannedUsers';
export class Repository {
  public registerBan = (_id: string) => {
    return new BannedUsers({ _id }).save();
  };

  public findBanById = (_id: string): Promise<Boolean> => {
    return BannedUsers.findOne({ _id })
      .exec()
      .then((user) => {
        if (user) {
          return true;
        }
        return false;
      });
  };

  public removeBan = (_id: string) => {
    return BannedUsers.deleteOne({ _id }).exec();
  };

  public findById = (_id: string): Promise<UserDocument> =>
    User.findOne({ _id }).exec() as any;

  public get(): Promise<UserDocument[]> {
    return User.find().exec();
  }

  public registerUser(user: UserDocument) {
    return new User(user).save();
  }

  public deleteUser(_id: string) {
    return User.deleteOne({ _id }).exec();
  }
  public async saveUser(user) {
    return user.save();
  }
}
