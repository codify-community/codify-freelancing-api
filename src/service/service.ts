import { FreelaDocument } from '../document/freela';
import { Repository } from '../repository/repository';
import { AmountOfLargeCharacters } from '../exceptions/amount-of-large-characters';
import { UserNotFound } from '../exceptions/user_not_found_exception';
import { UserDocument } from '../document/user';
import { UserFoundException } from '../exceptions/user_found';
import { FreelaGetDocument } from '../document/freela_get';

export class Service {
  private Repository = new Repository();

  public async get() {
    let freelas: FreelaGetDocument[] = []
    const users: UserDocument[] = await this.Repository.get()
    for(let i = 0; i < users.length; i++ ) {
      for(let j = 0; j < users[i].freelas.length; j++){
        console.log(users[i].name)
        const freela: FreelaGetDocument = {
          ...users[i].freelas[j],
          user_id: users[i].id,
          user_avatar: users[i].avatar_url,
          user_name: users[i].name
        }
        freelas.push(freela)
      }
    }
    
    freelas.sort((a, b) => (a.createdAt > b.createdAt) ? -1 : 1);
    return freelas
  }

  public async createUser(_id: string, user: UserDocument) {
    const foundUser = await this.Repository.findById(_id);

    if (foundUser) {
      throw new UserFoundException('User already exists');
    }

    this.Repository.register_user(user);
  }

  public async createFreela(_id: string, freela: FreelaDocument) {
    const user = this.Repository.findById(_id);
    if (!user) {
      throw new UserNotFound('User Not found!');
    }

    if (freela.title.length > 70) {
      throw new AmountOfLargeCharacters('Too many characters in title');
    }

    return this.Repository.register_freela(_id, freela);
  }
}
