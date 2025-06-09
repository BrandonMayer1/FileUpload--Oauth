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
    const authHeader = request.headers.authorization;
    const tokenFromCookie = request.cookies?.auth_token;
    
    const accessToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : tokenFromCookie;

    if (!accessToken) {
      console.log('No access token found');
      const response = context.switchToHttp().getResponse();
      response.redirect('/auth/login');
      return false;
    }

    // Verify the token exists
    const storedToken = this.tokenService.getToken(accessToken);
    if (!storedToken) {
      console.log('Token not found in storage');
      const response = context.switchToHttp().getResponse();
      response.redirect('/auth/login');
      return false;
    }

    // Set user info in the request
    request.user = {
      accessToken,
      profile: {}
    };

    return true;
  }
}