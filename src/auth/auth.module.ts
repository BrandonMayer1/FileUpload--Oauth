import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OAuthStrategy } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'oauth' })],
  providers: [OAuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}