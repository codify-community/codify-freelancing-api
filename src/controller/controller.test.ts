const ROUTER_MOCK = { get: jest.fn(), post: jest.fn()};
import { Controller } from "./controller";

jest.mock('express', () => ({
    ...jest.requireActual('express'),
    Router: () => ROUTER_MOCK
}));

describe('Controller Tests', () => {
    test('should set routes properly', () => {
        new Controller();
        expect(ROUTER_MOCK.post).toHaveBeenCalledTimes(2);
        expect(ROUTER_MOCK.post).toHaveBeenCalledWith('/', expect.any(Function));
        expect(ROUTER_MOCK.post).toHaveBeenCalledWith('/freela', expect.any(Function));
        
    })
})