# Car Sourcing App - Backend

This is the backend service for the Car Sourcing application, built with Node.js, Express, and MongoDB.

## Features

- Secure authentication with JWT
- Rate limiting and request validation
- File uploads
- Comprehensive error handling
- Logging system
- Environment-based configuration

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/car-sourcing-app.git
   cd car-sourcing-app/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGO_URI=mongodb://localhost:27017/car-sourcing
   
   # Security
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRES_IN=30d
   
   # File Uploads
   UPLOAD_DIR=./public/uploads
   MAX_FILE_SIZE=5MB
   
   # CORS
   FRONTEND_URL=http://localhost:3000
   ```

4. **Create required directories**
   ```bash
   mkdir -p logs public/uploads
   ```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Documentation

API documentation is available at `/api-docs` when running in development mode.

## Testing

Run tests with:
```bash
npm test
```

## Environment Variables

See `.env.example` for all available environment variables and their descriptions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
