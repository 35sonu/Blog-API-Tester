import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      name: 'Blog API',
      status: 'running',
      version: '1.0.0'
    };
  }
}
