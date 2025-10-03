# 🚀 NestJS Blog API with Browser Tester

[![GitHub](https://img.shields.io/github/license/35sonu/Blog-API-Tester)](https://github.com/35sonu/Blog-API-Tester/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/35sonu/Blog-API-Tester)](https://github.com/35sonu/Blog-API-Tester/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/35sonu/Blog-API-Tester)](https://github.com/35sonu/Blog-API-Tester/issues)

A comprehensive REST API for a blogging platform built with **NestJS**, **PostgreSQL**, and **TypeORM**. Features include JWT authentication, post management, comprehensive unit testing, and an **interactive HTML browser tester** for easy API testing.

## 🎯 Live Demo & Testing

### 🌐 Browser API Tester
Open [`api-test.html`](./api-test.html) in your browser for an interactive web interface to test all API endpoints:
- 🔐 User registration and authentication
- 📝 Complete CRUD operations for blog posts
- 🎫 Automatic JWT token management
- 🎨 Beautiful, responsive interface
- ⚡ Real-time API response display

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication system with secure password hashing
- Environment-based configuration management
- Input validation and comprehensive error handling
- Role-based access control for post management

### 📊 Database & ORM
- PostgreSQL database with TypeORM integration
- Entity relationships and migrations
- Optimized queries and database performance

### 🎯 API Features
- Complete CRUD operations for blog posts
- User management and profile handling
- RESTful API design with proper HTTP status codes
- Comprehensive error handling and validation

### 🧪 Testing & Quality
- 100% unit test coverage with Jest
- Integration testing for all endpoints
- Clean, modular architecture following NestJS best practices
- TypeScript for type safety and better developer experience

### 🌐 Browser Testing Interface
- Interactive HTML interface for API testing
- No additional tools required - just open in browser
- Real-time response visualization
- Pre-filled test data for quick testing

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

### 🚀 Running the Application

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run build
npm start

# Watch mode for development
npm run start:debug
```

### 🌐 Testing with Browser Interface

1. Start the API server:
   ```bash
   npm run start:dev
   ```

2. Open `api-test.html` in your browser

3. Test all endpoints interactively:
   - Sign up new users
   - Authenticate and get JWT tokens
   - Create, read, update, and delete blog posts
   - View real-time API responses

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

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:cov

# Run end-to-end tests
npm run test:e2e
```

### Manual Testing
- Use the included `api-test.html` for browser-based testing
- Use tools like Postman or curl for API testing
- All endpoints include proper error handling and validation

## 📂 Project Structure

```
src/
├── 🔐 auth/
│   ├── auth.controller.ts      # Authentication endpoints
│   ├── auth.service.ts         # Authentication logic
│   ├── jwt.strategy.ts         # JWT strategy
│   ├── jwt-auth.guard.ts       # JWT guard
│   └── dto/auth.dto.ts         # Data transfer objects
├── 👤 user/
│   ├── user.entity.ts          # User database entity
│   ├── user.service.ts         # User business logic
│   └── user.module.ts          # User module
├── 📝 post/
│   ├── post.controller.ts      # Post CRUD endpoints
│   ├── post.service.ts         # Post business logic
│   ├── post.entity.ts          # Post database entity
│   └── dto/create-post.dto.ts  # Post DTOs
├── 🛡️ common/
│   └── http-exception.filter.ts # Global exception filter
└── 🏠 app.module.ts            # Main application module

📄 Root Files:
├── api-test.html              # 🌟 Browser API tester
├── README.md                  # Documentation
├── package.json               # Dependencies
└── .env.example               # Environment template
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: [https://github.com/35sonu/Blog-API-Tester](https://github.com/35sonu/Blog-API-Tester)
- **Issues**: [https://github.com/35sonu/Blog-API-Tester/issues](https://github.com/35sonu/Blog-API-Tester/issues)
- **Documentation**: [README.md](./README.md)

## 👨‍💻 Author

**35sonu**
- GitHub: [@35sonu](https://github.com/35sonu)
- Repository: [Blog-API-Tester](https://github.com/35sonu/Blog-API-Tester)

---

⭐ **Star this repository if you find it helpful!** ⭐
