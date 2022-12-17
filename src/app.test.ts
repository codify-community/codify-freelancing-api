const JSON_MOCK = { limit: '50mb' };
const URL_ENCODED_MOCK = { limit: '50mb', extended: true };
const CORS_RETURN_MOCK = 'cors return';

const expressMock = { use: jest.fn() };
const bodyParserMock = {
  json: jest.fn(() => JSON_MOCK),
  urlencoded: jest.fn(() => URL_ENCODED_MOCK)
};
const corsMock = jest.fn(() => CORS_RETURN_MOCK);
const mongoDbConnectionMock = jest.fn(() => ({
  connection: { name: 'teste-connection-name' }
}));

import dotenv from 'dotenv';
import { App } from './app';
dotenv.config();

const DATABASE_ADDRESS = process.env.DATABASE_ADDRESS;

jest.mock('express', () => () => expressMock);
jest.mock('body-parser', () => bodyParserMock);
jest.mock('cors', () => corsMock);
jest.mock('./controller/controller');
jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  connect: mongoDbConnectionMock
}));

describe('App tests', () => {
  test('should create and call setConfig method properly', () => {
    // act
    new App();

    // assert
    expect(expressMock.use).toHaveBeenCalledTimes(4);
    expect(expressMock.use).toHaveBeenNthCalledWith(1, JSON_MOCK);
    expect(expressMock.use).toHaveBeenNthCalledWith(2, URL_ENCODED_MOCK);
    expect(expressMock.use).toHaveBeenNthCalledWith(3, CORS_RETURN_MOCK);
    expect(bodyParserMock.json).toBeCalledWith(JSON_MOCK);
    expect(bodyParserMock.urlencoded).toBeCalledWith(URL_ENCODED_MOCK);
    expect(mongoDbConnectionMock).toBeCalledWith(
      `${DATABASE_ADDRESS}/CodeFreelas`
    );
  });
});
