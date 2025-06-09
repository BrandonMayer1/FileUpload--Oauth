import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  private tokens: Map<string, string> = new Map();

  storeToken(token: string, tokenValue: string) {
    this.tokens.set(token, tokenValue);
  }

  getToken(token: string): string | undefined {
    return this.tokens.get(token);
  }

  removeToken(token: string) {
    this.tokens.delete(token);
  }
} 