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
    const user = request.user;
    if (!user?.profile?.email) {
      return false;
    }    const storedToken = this.tokenService.getToken(user.profile.email);
    return storedToken === user.accessToken;
  }
}