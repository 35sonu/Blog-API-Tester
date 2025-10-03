# NestJS PostgreSQL API

A robust REST API built with NestJS, PostgreSQL, TypeORM, and JWT authentication. This project provides a complete backend solution with user authentication, CRUD operations, and comprehensive testing.

## Features

- 🔐 **JWT Authentication**: Secure user registration and login
- 🗃️ **PostgreSQL Database**: Reliable data persistence with TypeORM
- 📝 **CRUD Operations**: Complete Create, Read, Update, Delete functionality for posts
- ✅ **Input Validation**: Comprehensive request validation using class-validator
- 🛡️ **Error Handling**: Global exception filters with detailed error responses
- 🧪 **Unit Testing**: Comprehensive test coverage using Jest
- 📱 **RESTful API**: Well-structured REST endpoints
- 🏗️ **Clean Architecture**: Modular design with separation of concerns

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator & class-transformer
- **Testing**: Jest
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nestjs-postgres-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=postgres
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
PORT=3000
```

4. Start PostgreSQL and ensure the database exists

5. Run the application:
```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Documentation

### Authentication

#### Register User
```http
POST /auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /auth/signin
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Posts (Protected Routes)

All post endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Create Post
```http
POST /posts
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "title": "My First Post",
  "content": "This is the content of my first post."
}
```

#### Get All Posts
```http
GET /posts
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "My First Post",
    "content": "This is the content of my first post.",
    "authorId": 1,
    "author": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    },
    "createdAt": "2025-01-03T17:30:00.000Z",
    "updatedAt": "2025-01-03T17:30:00.000Z"
  }
]
```

#### Get My Posts
```http
GET /posts/my-posts
Authorization: Bearer <your-jwt-token>
```

#### Get Single Post
```http
GET /posts/:id
Authorization: Bearer <your-jwt-token>
```

#### Update Post
```http
PATCH /posts/:id
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "title": "Updated Post Title",
  "content": "Updated content"
}
```

**Note**: Users can only update their own posts.

#### Delete Post
```http
DELETE /posts/:id
Authorization: Bearer <your-jwt-token>
```

**Note**: Users can only delete their own posts.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Posts Table
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  "authorId" INTEGER REFERENCES users(id),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Error Responses

The API uses consistent error response format:

```json
{
  "statusCode": 400,
  "message": "Username already exists",
  "timestamp": "2025-01-03T17:30:00.000Z",
  "path": "/auth/signup",
  "method": "POST"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## Validation Rules

### User Registration/Login
- **username**: Minimum 4 characters, string
- **email**: Valid email format
- **password**: Minimum 6 characters, string

### Posts
- **title**: Required, non-empty string
- **content**: Required, non-empty string

## Testing

Run the test suite:

```bash
# Unit tests
npm test

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch

# E2E tests
npm run test:e2e
```

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data Transfer Objects
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── common/              # Shared utilities
│   └── http-exception.filter.ts
├── post/                # Posts module
│   ├── dto/
│   ├── post.controller.ts
│   ├── post.service.ts
│   ├── post.entity.ts
│   └── post.module.ts
├── user/                # Users module
│   ├── user.service.ts
│   ├── user.entity.ts
│   └── user.module.ts
├── app.module.ts        # Root module
└── main.ts              # Application entry point
```

## Development Scripts

```bash
# Development mode with hot reload
npm run start:dev

# Build for production
npm run build

# Production mode
npm run start:prod

# Linting
npm run lint

# Format code
npm run format
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|  
| `DATABASE_HOST` | PostgreSQL host | localhost |
| `DATABASE_PORT` | PostgreSQL port | 5432 |
| `DATABASE_USERNAME` | Database username | postgres |
| `DATABASE_PASSWORD` | Database password | postgres |
| `DATABASE_NAME` | Database name | postgres |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h |
| `PORT` | Application port | 3000 |

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt
- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **Input Validation**: All inputs are validated and sanitized
- **SQL Injection Protection**: TypeORM provides protection against SQL injection
- **CORS**: Configure CORS for cross-origin requests as needed

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@example.com or open an issue on GitHub.
