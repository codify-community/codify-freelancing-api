import { Request, Response, Router } from 'express';
import { UserDocument } from '../document/user';
import { Service } from '../service/service';
import { validateUserPayload } from './validations/register_user';
import { toUserDocument } from './dto/user-request-dto';
import { InvalidPayloadException } from '../exceptions/invalid-payload-exception';
import { UserFoundException } from '../exceptions/user_found';
import { validateFreelaPayload } from './validations/register_freela';
import { FreelaDocument } from '../document/freela';
import { AmountOfLargeCharacters } from '../exceptions/amount-of-large-characters';
import { toFreelaDocument } from './dto/freela-request-dto';

export class Controller {
  private _router = Router();
  private Service = new Service();

  public get router() {
    return this._router;
  }

  constructor() {
    this._router.post('/', this.register_user);
    this._router.post('/freela', this.register_freela);
    this._router.get('/freela', this.get_freelas);
  }

  private get_freelas = async (req: Request, res: Response) => {
    const freelas = await this.Service.get()
    res.status(200).send(freelas)
  }

  private register_user = async (req: Request, res: Response) => {
    let user: UserDocument = req.body;
    try {
      validateUserPayload(user);
      user = toUserDocument(user);
      await this.Service.createUser(user._id, user);
      return res.sendStatus(201);
    } catch (error) {
      if (error instanceof InvalidPayloadException) {
        return res.status(422).send(error.message);
      }
      if (error instanceof UserFoundException) {
        return res.status(302).send(error.message);
      }
    }
  };

  private register_freela = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      validateFreelaPayload(data);
      let user_id: string = data.user_id;
      delete data.user_id;
      let freela: FreelaDocument = data;
      freela = toFreelaDocument(freela);
      await this.Service.createFreela(user_id, freela);
      return res.sendStatus(201);
    } catch (error) {
      if (error instanceof InvalidPayloadException) {
        return res.status(422).send(error.message);
      }
      if (error instanceof AmountOfLargeCharacters) {
        return res.status(413).send(error.message);
      }
    }
  };
}
