import { Request, Response, Router } from 'express';
import { UserDocument } from '../document/user';
import { Service } from '../service/service';
import { validateUserPayload } from './validations/register_user';
import { toUserDocument } from './dto/user-request-dto';
import { InvalidPayloadException } from '../exceptions/invalid_payload_exception';
import { UserFoundException } from '../exceptions/user_found';
import { validateFreelaPayload } from './validations/register_freela';
import { FreelaDocument } from '../document/freela';
import { AmountOfLargeCharacters } from '../exceptions/amount_of_large_characters';
import { toFreelaDocument } from './dto/freela-request-dto';
import { UserNotFound } from '../exceptions/user_not_found_exception';
import { FreelaNotFound } from '../exceptions/freela_not_found_exception';
import { UserHasBannedException } from '../exceptions/user_has_banned';
export class Controller {
  private _router = Router();
  private Service = new Service();

  public get router() {
    return this._router;
  }

  constructor() {
    this._router.post('/', this.registerUser);
    this._router.post('/freela', this.registerFreela);
    this._router.post('/ban/:user_id', this.banUser);
    this._router.get('/ban/:user_id', this.hasBan);
    this._router.get('/freela', this.getFreelas);
    this._router.get('/:id', this.getUser);
    this._router.get('/:user_id/:freela_id', this.getFreela);
    this._router.delete('/:user_id/:freela_id', this.deleteFreela);
    this._router.delete('/ban/:user_id', this.removeBan);
    this._router.put('/:user_id/:freela_id', this.completeFreela);
    this._router.post('/:user_id/:freela_id', this.updateFreela);
  }

  private banUser = async (req: Request, res: Response) => {
    const user_id = req.params.user_id;
    console.log('Ban User');
    try {
      await this.Service.registerBan(user_id);
      return res.sendStatus(201);
    } catch (error) {
      if (error instanceof UserFoundException) {
        return res.sendStatus(409);
      }
      res.sendStatus(500);
    }
  };

  private hasBan = async (req: Request, res: Response) => {
    const user_id = req.params.user_id;
    try {
      const hasBan = await this.Service.findBan(user_id);
      if (hasBan) {
        return res.sendStatus(302);
      }
      return res.sendStatus(404);
    } catch (error) {
      res.sendStatus(500);
    }
  };

  private removeBan = async (req: Request, res: Response) => {
    const user_id = req.params.user_id;
    try {
      await this.Service.removeBan(user_id);
      return res.sendStatus(200);
    } catch (error) {
      res.sendStatus(404);
    }
  };

  private updateFreela = async (req: Request, res: Response) => {
    const user_id = req.params.user_id;
    const freela_id = req.params.freela_id;
    const freela_updated = req.body;
    try {
      await this.Service.updateFreela(user_id, freela_id, freela_updated);
      return res.sendStatus(200);
    } catch (error) {
      res.sendStatus(404);
    }
  };

  private deleteFreela = async (req: Request, res: Response) => {
    const user_id = req.params.user_id;
    const freela_id = req.params.freela_id;
    try {
      await this.Service.quitFreela(user_id, freela_id, true);
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

  private completeFreela = async (req: Request, res: Response) => {
    const user_id = req.params.user_id;
    const freela_id = req.params.freela_id;
    try {
      await this.Service.quitFreela(user_id, freela_id, false);
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

  private getFreela = async (req: Request, res: Response) => {
    const user_id = req.params.user_id;
    const freela_id = req.params.freela_id;

    try {
      const freela = await this.Service.getFreela(user_id, freela_id);
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

  private getUser = async (req: Request, res: Response) => {
    const _id: string = req.params.id;
    try {
      const user = await this.Service.getUser(_id);
      return res.status(200).send(user);
    } catch (error) {
      if (error instanceof UserNotFound) {
        return res.sendStatus(404);
      }
    }
  };

  private getFreelas = async (req: Request, res: Response) => {
    const freelas = await this.Service.get();
    res.status(200).send(freelas);
  };

  private registerUser = async (req: Request, res: Response) => {
    let user: UserDocument = req.body;
    try {
      validateUserPayload(user);
      user = toUserDocument(user);
      await this.Service.updateUser(user._id, user);
      return res.sendStatus(201);
    } catch (error) {
      if (error instanceof InvalidPayloadException) {
        return res.status(422).send(error.message);
      }
      if (error instanceof UserFoundException) {
        return res.status(302).send(error.message);
      }
      if (error instanceof UserHasBannedException) {
        return res.status(403).send(error.message);
      }
    }
  };

  private registerFreela = async (req: Request, res: Response) => {
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
