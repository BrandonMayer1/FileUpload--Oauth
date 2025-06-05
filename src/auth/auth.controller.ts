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
    // Get the user information from the request
    const user = req.user;
    
    // Here you would typically:
    // 1. Create or update the user in your database
    // 2. Generate a JWT token or session
    // 3. Set cookies or other authentication mechanisms
    
    // For now, let's just return the user info
    res.json({
      message: 'Successfully authenticated',
      user: {
        email: user.profile?.email,
        name: user.profile?.name,
        picture: user.profile?.picture
      }
    });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    // Clear any session data or cookies
    res.clearCookie('session'); // If you're using cookies
    res.clearCookie('token');   // If you're using JWT tokens
    
    // Redirect to login page or return success message
    res.json({
      message: 'Successfully logged out'
    });
  }
}