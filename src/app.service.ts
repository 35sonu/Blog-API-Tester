import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      message: '🚀 NestJS PostgreSQL API',
      version: '1.0.0',
      status: 'Running',
      endpoints: {
        auth: {
          signup: 'POST /auth/signup',
          signin: 'POST /auth/signin'
        },
        posts: {
          create: 'POST /posts',
          getAll: 'GET /posts',
          getMyPosts: 'GET /posts/my-posts',
          getById: 'GET /posts/:id',
          update: 'PATCH /posts/:id',
          delete: 'DELETE /posts/:id'
        }
      },
      note: 'All post endpoints require JWT authentication',
      testPage: 'Open test-api.html in your browser to test the API'
    };
  }
}
