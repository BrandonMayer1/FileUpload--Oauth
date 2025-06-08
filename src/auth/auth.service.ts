import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
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
      clientID: clientID as string,
      clientSecret: clientSecret as string,
      callbackURL: 'http://localhost:8080/auth/callback',
      scope: ['profile', 'email']
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    console.log('OAuth validate received profile:', profile);
    
    // Store the token using the email as the key
    if (profile?.emails?.[0]?.value) {
      const email = profile.emails[0].value;
      console.log('Storing token for email:', email);
      this.tokenService.storeToken(email, accessToken);
    } else {
      console.error('No email found in profile:', profile);
    }
    
    return { 
      accessToken, 
      profile: {
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        picture: profile.photos?.[0]?.value
      }
    };
  }
}
