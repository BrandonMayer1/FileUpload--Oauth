import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHelloEndpoint(): string {
    return 'Hello World endpoint!';
  }
}
