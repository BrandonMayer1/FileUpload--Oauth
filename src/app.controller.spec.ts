import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });
//Tests the root for proper Hello World return
  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
//Tests the /hello endpoint for proper Hello World endpoint return
  describe('hello endpoint', () => {
    it('should return "Hello World endpoint!"', () => {
      expect(appController.getHelloEndpoint()).toBe('Hello World endpoint!');
    });
  });
});
