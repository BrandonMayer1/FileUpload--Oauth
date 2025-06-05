import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OAuthStrategy } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenService } from './token.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'oauth' })],
  providers: [OAuthStrategy, TokenService],
  controllers: [AuthController],
  exports: [TokenService]
})
export class AuthModule {}