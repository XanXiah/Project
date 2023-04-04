import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './app.usercontroller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [],
  controllers: [AppController , UserController],
  providers: [AppService, AuthService],
})
export class AppModule {}
