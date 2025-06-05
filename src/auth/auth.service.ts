import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { TokenService } from './token.service';

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_SECRET;

if (!clientID || !clientSecret) {
  throw new Error('Missing Google OAuth credentials');
}

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, 'oauth') {
  constructor(private tokenService: TokenService) {
    super({
      authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent',
      tokenURL: 'https://oauth2.googleapis.com/token',
      clientID: clientID as string,
      clientSecret: clientSecret as string,
      callbackURL: 'http://localhost:8080/auth/callback',
      scope: ['profile', 'email'],
      state: false
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    // Store the token using the email as the key
    if (profile?.email) {
      this.tokenService.storeToken(profile.email, accessToken);
    }
    return { accessToken, profile };
  }
}
