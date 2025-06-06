import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
    const tokenFromQuery = request.query?.token as string;
    
    const accessToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : tokenFromQuery;

    if (!accessToken) {
      console.log('No access token found');
      const response = context.switchToHttp().getResponse();
      response.redirect('/auth/login');
      return false;
    }

    request.user = {
      accessToken,
      profile: {}
    };

    return true;
  }
}