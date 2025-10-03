# Blog API

A REST API for a blogging platform built with NestJS, PostgreSQL, and TypeORM. Features include user authentication, post management, and role-based access control.

## Features

- JWT-based authentication system
- PostgreSQL database with TypeORM
- User registration and login
- Post creation, editing, and deletion
- Input validation and error handling
- Unit testing with Jest
- Clean modular architecture

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator & class-transformer
- **Testing**: Jest
- **Language**: TypeScript

## Setup

### Requirements
- Node.js 16+
- PostgreSQL 12+

### Installation

```bash
npm install
```

### Environment Setup

Create `.env` file:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=blog_db
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
PORT=3000
```

### Running

```bash
# Development
npm run start:dev

# Production
npm start
```

## API Endpoints

### Auth
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Login user

### Posts (requires JWT)
- `POST /posts` - Create post
- `GET /posts` - Get all posts
- `GET /posts/my-posts` - Get user's posts
- `GET /posts/:id` - Get post by ID
- `PATCH /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

## Testing

```bash
npm test
```

## Project Structure

```
src/
├── auth/          # Authentication
├── user/          # User management  
├── post/          # Post CRUD
├── common/        # Shared utilities
└── app.module.ts  # Main module
```

## License

MIT
