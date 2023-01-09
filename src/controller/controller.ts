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
import { UserNotFound } from '../exceptions/user_not_found_exception';
import { FreelaNotFound } from '../exceptions/freela_not_found_exception';

export class Controller {
  private _router = Router();
  private Service = new Service();

  public get router() {
    return this._router;
  }

  constructor() {
    this._router.post('/', this.register_user);
    this._router.post('/freela', this.register_freela);
    this._router.post('/:user_id/:freela_id', this.update_freela);
    this._router.get('/freela', this.get_freelas);
    this._router.get('/:id', this.get_user);
    this._router.get('/:user_id/:freela_id', this.get_freela);
    this._router.delete('/:user_id/:freela_id', this.delete_freela);
  }

  private update_freela = async (req: Request, res: Response) => {
    const user_id = req.params.user_id;
    const freela_id = req.params.freela_id;
    const freela_updated = req.body
    try {
      await this.Service.update_freela(user_id, freela_id, freela_updated)
      return res.sendStatus(200)
    } catch (error) {
      res.sendStatus(404)
    }
  }

  private delete_freela = async (req: Request, res: Response) => {
    const user_id = req.params.user_id;
    const freela_id = req.params.freela_id;
    try {
      await this.Service.delete_freela(user_id, freela_id);
      return res.sendStatus(202);
    } catch (error) {
      if (error instanceof UserNotFound) {
        return res.status(404).send(error.message);
      }
      if (error instanceof FreelaNotFound) {
        return res.status(404).send(error.message);
      }
    }
  };

  private get_freela = async (req: Request, res: Response) => {
    const user_id = req.params.user_id;
    const freela_id = req.params.freela_id;
    
    try {
      const freela = await this.Service.get_freela(user_id, freela_id);
      return res.status(200).send(freela);
    } catch (error) {
      if (error instanceof UserNotFound) {
        return res.status(404).send(error.message);
      }
      if (error instanceof FreelaNotFound) {
        return res.status(404).send(error.message);
      }
    }
  };

  private get_user = async (req: Request, res: Response) => {
    const _id: string = req.params.id;
    try {
      const user = await this.Service.get_user(_id);
      return res.status(200).send(user);
    } catch (error) {
      if (error instanceof UserNotFound) {
        return res.sendStatus(404);
      }
    }
  };

  private get_freelas = async (req: Request, res: Response) => {
    const freelas = await this.Service.get();
    res.status(200).send(freelas);
  };

  private register_user = async (req: Request, res: Response) => {
    let user: UserDocument = req.body;
    try {
      validateUserPayload(user);
      user = toUserDocument(user);
      await this.Service.update_user(user._id, user);
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
