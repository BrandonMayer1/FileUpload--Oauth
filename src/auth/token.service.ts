import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  private tokens: Map<string, string> = new Map();

  storeToken(email: string, token: string) {
    this.tokens.set(email, token);
  }

  getToken(email: string): string | undefined {
    return this.tokens.get(email);
  }

  removeToken(email: string) {
    this.tokens.delete(email);
  }
} 