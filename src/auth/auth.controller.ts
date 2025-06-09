import { Controller, Get, Req, UseGuards, Res, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AccessTokenGuard } from 'src/auth/access-token.guard';
import { TokenService } from './token.service';

@Controller('auth')
export class AuthController {
  constructor(private tokenService: TokenService) {}

  @Get('login')
  @UseGuards(AuthGuard('oauth'))
  async login() {
  }

  @Get('callback')
  @UseGuards(AuthGuard('oauth'))
  async callback(@Req() req, @Res() res: Response) {
    const user = req.user;
    console.log('OAuth callback received user:', user);
    
    if (user?.accessToken) {
      this.tokenService.storeToken(user.accessToken, user.accessToken);
      
      // Set the token in a cookie
      res.cookie('auth_token', user.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      // Set user info in the request
      req.user = {
        accessToken: user.accessToken,
        profile: user.profile
      };
    }

    // Redirect back to root
    res.redirect('/');
  }

  @Get('logout')
  async logout(@Req() req, @Res() res: Response) {
    const token = req.cookies?.auth_token;
    if (token) {
      this.tokenService.removeToken(token);
      res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }
    res.redirect('/');
  }
}