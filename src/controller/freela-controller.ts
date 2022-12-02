import { Request, Response, Router } from 'express';
import { FreelaService } from '../service/freela-service';


export class FreelaController {
  private _router = Router();
  private freelaService = new FreelaService();

  public get router() {
    return this._router;
  }

  constructor() {
    this._router.get('/', this.hello);
  }


  private hello = async (req: Request, res: Response) => {
    res.send('hello_world')
  }
}