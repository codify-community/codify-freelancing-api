import { FreelaDocument } from '../document/freela';
import { Repository } from '../repository/repository';
import { AmountOfLargeCharacters } from '../exceptions/amount-of-large-characters';
import { UserNotFound } from '../exceptions/user_not_found_exception';
import { UserDocument } from '../document/user';
import { UserFoundException } from '../exceptions/user_found';
import { FreelaGetDocument } from '../document/freela_get';
import { FreelaNotFound } from '../exceptions/freela_not_found_exception';

export class Service {
  private Repository = new Repository();

  public async update_user(user_id, user_updated) {
    try {
      await this.createUser(user_id, user_updated);
    } catch (error) {
      let user = await this.Repository.findById(user_id);
      user.name = user_updated.name;
      user.avatar_url = user_updated.avatar_url;
      user.description = user_updated.description;
      user.banner_url = user_updated.banner_url;
      user.whatsapp = user_updated.whatsapp;
      user.instagram = user_updated.instagram;
      this.Repository.save_user(user);
    }
  }

  public async get_freela(
    user_id: string,
    freela_id
  ): Promise<FreelaGetDocument> {
    const user = await this.get_user(user_id);
    let freela = user.freelas.find(
      (freela) => freela.id === freela_id
    ) as FreelaGetDocument;
    if (!freela) {
      throw new FreelaNotFound('Freela not found');
    }
    freela = {
      ...freela,
      user_id: user.id,
      user_avatar: user.avatar_url,
      user_name: user.name
    };

    return freela;
  }

  public async delete_freela(user_id: string, freela_id) {
    let user = await this.Repository.findById(user_id);
    if (!user) {
      throw new UserNotFound('User Not found!');
    }
    const freela_index = user?.freelas.findIndex((obj) => obj.id === freela_id);
    console.log(freela_index);
    if (freela_index || freela_index > -1) {
      user?.freelas.splice(freela_index, 1);
      user.active_posts -= 1;
      user.total_posts -= 1;
      return this.Repository.save_user(user);
    }
    throw new FreelaNotFound('Freela id not found');
  }

  public async get_user(_id): Promise<UserDocument> {
    const user = await this.Repository.findById(_id);
    if (!user) {
      throw new UserNotFound('User not found');
    }
    return user;
  }

  public async get() {
    let freelas: FreelaGetDocument[] = [];
    const users: UserDocument[] = await this.Repository.get();
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < users[i].freelas.length; j++) {
        const freela: FreelaGetDocument = {
          ...users[i].freelas[j],
          user_id: users[i].id,
          user_avatar: users[i].avatar_url,
          user_name: users[i].name
        };
        freelas.push(freela);
      }
    }

    freelas.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    return freelas;
  }

  public async createUser(_id: string, user: UserDocument) {
    const foundUser = await this.Repository.findById(_id);

    if (foundUser) {
      throw new UserFoundException('User already exists');
    }

    this.Repository.register_user(user);
  }

  public async createFreela(_id: string, freela: FreelaDocument) {
    let user = await this.Repository.findById(_id);
    if (!user) {
      throw new UserNotFound('User Not found!');
    }

    if (freela.title.length > 70) {
      throw new AmountOfLargeCharacters('Too many characters in title');
    }
    user.active_posts += 1;
    user.total_posts += 1;
    user.freelas.push(freela);
    return await this.Repository.save_user(user);
  }
}
