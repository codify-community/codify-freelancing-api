import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import dbConsts from './constants/database';
import { Controller } from './controller/controller';
import { DatabaseUriNotFoundException } from './exceptions/database_url_not_found_exception';

export class App {
  private _server: Application;

  public get server() {
    return this._server;
  }

  constructor() {
    this._server = express();
    this.setConfig();
    this.setControllers();
    this.setMongoConnection();
  }

  private setConfig() {
    this._server.use(bodyParser.json({ limit: '50mb' }));
    this._server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this._server.use(cors());
  }

  private setControllers() {
    const freelaController = new Controller();
    this._server.use('/codify', freelaController.router);
  }

  private async setMongoConnection() {
    mongoose.Promise = global.Promise;
    try {
      if (!dbConsts.DATABASE_ADDRESS) {
        throw new DatabaseUriNotFoundException(
          'missing environment variable [DATABASE_ADDRESS]'
        );
      }

      const server = await mongoose.connect(
        `${dbConsts.DATABASE_ADDRESS}/codefreelas`
      );

      console.log(
        `[MongoDB Connection] server.connection.name: ${server.connection.name}`
      );
    } catch (error) {
      console.error('Could not connect into MongoDB, error: ', error);
      process.exit();
    }
  }
}
