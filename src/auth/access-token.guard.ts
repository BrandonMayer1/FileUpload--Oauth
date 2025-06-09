import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from './token.service';

interface User {
  accessToken: string;
  profile?: {
    email?: string;
    name?: string;
    picture?: string;
  };
}

interface RequestWithUser extends Request {
  user?: User;
}

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = request.cookies?.auth_token;
    
    if (!token) {
      console.log('No auth token found in cookie');
      const response = context.switchToHttp().getResponse();
      response.redirect('/auth/login');
      return false;
    }

    // Verify the token exists in our storage
    const storedToken = this.tokenService.getToken(token);
    if (!storedToken) {
      console.log('Token not found in storage');
      const response = context.switchToHttp().getResponse();
      response.redirect('/auth/login');
      return false;
    }

    // Set user info in the request
    request.user = {
      accessToken: token,
      profile: {}
    };

    return true;
  }
}