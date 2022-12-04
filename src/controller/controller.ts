import { Request, Response, Router } from 'express';
import { UserDocument } from '../document/user';
import { Service } from '../service/service';
import { validateUserPayload } from './validations/register_user';
import { toDocument } from './dto/user-request-dto';
import { InvalidPayloadException } from '../exceptions/invalid-payload-exception';
import { UserFoundException } from '../exceptions/user_found';

export class Controller {
  private _router = Router();
  private Service = new Service();

  public get router() {
    return this._router;
  }

  constructor() {
    this._router.post('/', this.register_user);
  }

  private register_user = async (req: Request, res: Response) => {
    let user: UserDocument = req.body;
    try {
      validateUserPayload(user);
      user = toDocument(user);
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
}
