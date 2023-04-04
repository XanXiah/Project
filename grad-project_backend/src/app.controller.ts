import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/adding_sf_movie')
  async sf_movie_data() {
    console.log("sf_movie_adding");
    const httpService = new HttpService();
    // console.log("In function");
    const response = await httpService.get('http://localhost:5000/scraping_sf_movie').toPromise();
    // console.log(response.data.data);
    return await this.appService.adding_sf_movie_data(response.data.data);
  }

  @Post('/adding_major_movie')
  async major_movie_data_2() {
    console.log("major_movie_adding");
    const httpService = new HttpService();
    // console.log("In function");
    const response = await httpService.get('http://localhost:5000/scraping_major_movie').toPromise();
    // console.log(response.data.data);
    console.log('finish scraping');
    
    return await this.appService.adding_major_movie_data(response.data.data);
  }

  @Get('/get_sf_movie')
  async get_sf_movie() {
    return await this.appService.get_sf_movie_data();
  }

  @Get('/get_major_movie')
  async get_major_movie(): Promise<any> {
    return await this.appService.get_major_movie_data();
  }

  @Get('get_sf_ranking')
  async get_sf_ranking() {
    return await this.appService.get_sf_ranking();
  }

  @Get('get_major_ranking')
  async get_major_ranking() {
    return await this.appService.get_major_ranking();
  }

  @Post('addmovie')
  async addmovie(@Body() data:any) {
    return await this.appService.addmovie(data);
  }
  
  @Post('getusermovie')
  async getusermovie(@Body() data:any) {
    console.log("get movie" , data);
    
    return await this.appService.get_user_movie(data);
  }

  @Post('removemovie')
  async removemovie(@Body() data:any) {
    console.log('remove movie');
    
    return await this.appService.remove_movie(data);
  }

  @Get('notification')
  async notification() {
    return await this.appService.notification();
  }
}
