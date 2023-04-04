import { Controller, Post, Body, Get, Req, Param } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Controller('users')
export class UserController {
  constructor(private readonly myAuthService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() body) {
    const { email, password } = body;
    const user = await this.myAuthService.signUpWithEmailAndPassword(email,password)
    return { user };
  }

  @Post('/login')
  async login(@Body() body) {
    console.log("Come to login");
    
    const { email, password } = body;
    const user = await this.myAuthService.signInWithEmailAndPassword(email, password);
    
    // const token = await this.myAuthService.getUserToken(user);
    return { user };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string }) {
    const { email } = body;
    console.log(body);
    
    await this.myAuthService.resetPassword(email);
    return { message: 'Password reset email sent.' };
  }

  @Post('/logout')
  async logout() {
    await this.myAuthService.signOut();
    return { message: 'User logged out' };
  }

  @Post('/getUserToken')
  async getUserToken(@Body() useruid:any) {
    console.log('Come to get user token',useruid);
    
    return await this.myAuthService.getUserToken(useruid.uid);
  }
  
  @Post('/setUserToken')
  async setUserToken(@Body() usertoken:any) {
    console.log("Come" , usertoken);
    
    return await this.myAuthService.setUserToken(usertoken)
  }

}
