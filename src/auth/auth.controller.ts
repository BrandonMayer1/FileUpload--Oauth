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
    // This route will redirect the user to the OAuth provider
  }

  @Get('callback')
  @UseGuards(AuthGuard('oauth'))
  async callback(@Req() req, @Res() res: Response) {
    const user = req.user;
    console.log('OAuth callback received user:', user);
    
    // Store the token
    if (user?.profile?.email) {
      this.tokenService.storeToken(user.profile.email, user.accessToken);
    }

    // Redirect back to root with the token
    const redirectUrl = `/?token=${encodeURIComponent(user.accessToken)}`;
    console.log('Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    res.redirect('/');
  }
}