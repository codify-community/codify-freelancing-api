import { FreelaDocument } from '../document/freela';
import { Repository } from '../repository/repository';
import { AmountOfLargeCharacters } from '../exceptions/amount_of_large_characters';
import { UserNotFound } from '../exceptions/user_not_found_exception';
import { UserDocument } from '../document/user';
import { UserFoundException } from '../exceptions/user_found';
import { FreelaGetDocument } from '../document/freelaGet';
import { FreelaNotFound } from '../exceptions/freela_not_found_exception';
import { UserHasBannedException } from '../exceptions/user_has_banned';
export class Service {
  private Repository = new Repository();
  public async registerBan(user_id) {
    const hasBan = await this.findBan(user_id);
    if (hasBan) {
      throw new UserFoundException('User already banned');
    }
    await this.Repository.registerBan(user_id);
  }

  public async findBan(user_id) {
    return await this.Repository.findBanById(user_id);
  }

  public async removeBan(user_id) {
    const user = this.findBan(user_id);
    if (!user) {
      throw new UserNotFound('User id not banned');
    }
    await this.Repository.removeBan(user_id);
  }

  public async updateFreela(user_id, freela_id, freela_updated) {
    let user = await this.Repository.findById(user_id);
    const freela_index = user.freelas.findIndex(
      (freela) => freela.id == freela_id
    );

    const freela: FreelaDocument = {
      ...user.freelas[freela_index],
      title: freela_updated.title,
      description: freela_updated.description,
      price: freela_updated.price,
      deadline: freela_updated.deadline,
      technologies: freela_updated.technologies
    };
    user.freelas[freela_index] = freela;
    await this.Repository.saveUser(user);
  }

  public async updateUser(user_id, user_updated) {
    const hasBan = await this.findBan(user_id);
    if (hasBan) {
      throw new UserHasBannedException('User has banned');
    }
    try {
      await this.createUser(user_id, user_updated);
    } catch (error) {
      console.log(error);
      if (error instanceof UserHasBannedException) {
        throw new UserHasBannedException('User has banned');
      }
      if (error instanceof UserFoundException) {
        throw new UserFoundException('User already exists');
      }
      let user = await this.Repository.findById(user_id);
      user.name = user_updated.name;
      user.avatar_url = user_updated.avatar_url;
      user.description = user_updated.description;
      user.banner_url = user_updated.banner_url;
      user.whatsapp = user_updated.whatsapp;
      user.instagram = user_updated.instagram;
      this.Repository.saveUser(user);
    }
  }

  public async getFreela(
    user_id: string,
    freela_id
  ): Promise<FreelaGetDocument> {
    const user = await this.getUser(user_id);
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
      user_name: user.name,
      user_instagram: user.instagram,
      user_whatsapp: user.whatsapp
    };

    return freela;
  }
  public async quitFreela(user_id: string, freela_id, deleted: boolean) {
    let user = await this.Repository.findById(user_id);
    if (!user) {
      throw new UserNotFound('User Not found!');
    }
    const freela_index = user?.freelas.findIndex((obj) => obj.id === freela_id);

    if (freela_index || freela_index > -1) {
      user?.freelas.splice(freela_index, 1);
      if (deleted) {
        user.total_posts -= 1;
      }
      user.active_posts -= 1;
      return this.Repository.saveUser(user);
    }
    throw new FreelaNotFound('Freela id not found');
  }

  public async getUser(_id): Promise<UserDocument> {
    const user = await this.Repository.findById(_id);
    if (!user) {
      throw new UserNotFound('User not found');
    }
    user.freelas.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
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
          user_name: users[i].name,
          user_instagram: users[i].instagram,
          user_whatsapp: users[i].whatsapp
        };
        freelas.push(freela);
      }
    }

    freelas.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    return freelas;
  }

  public async createUser(_id: string, user: UserDocument) {
    const hasBan = await this.findBan(_id);
    if (hasBan) {
      throw new UserHasBannedException('User has banned');
    }

    const foundUser = await this.Repository.findById(_id);

    if (foundUser) {
      throw new UserFoundException('User already exists');
    }

    this.Repository.registerUser(user);
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
    return await this.Repository.saveUser(user);
  }
}
