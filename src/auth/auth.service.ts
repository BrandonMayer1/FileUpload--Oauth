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
    console.log('OAuth validate received profile:', profile);
    
    // Store the token using the email as the key
    if (profile?.email) {
      console.log('Storing token for email:', profile.email);
      this.tokenService.storeToken(profile.email, accessToken);
    } else {
      console.error('No email found in profile:', profile);
    }
    
    return { 
      accessToken, 
      profile: {
        email: profile.email,
        name: profile.displayName,
        picture: profile.photos?.[0]?.value
      }
    };
  }
}
