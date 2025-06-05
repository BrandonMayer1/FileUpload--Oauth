import { Controller, Get, Req, UseGuards, Res, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  @Get('login')
  @UseGuards(AuthGuard('oauth'))
  async login() {
    // This route will redirect the user to the OAuth provider
  }

  @Get('callback')
  @UseGuards(AuthGuard('oauth'))
  async callback(@Req() req, @Res() res: Response) {
    const user = req.user;

    res.json({
      message: 'Successfully authenticated',
      accessToken: user.accessToken,
      user: {
        email: user.profile?.email,
        name: user.profile?.name,
        picture: user.profile?.picture
      }
    });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('session'); 
    res.clearCookie('token');   
    res.json({
      message: 'Successfully logged out'
    });
  }
}