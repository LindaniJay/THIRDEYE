# THIRDEYE Backend

Node.js + Express + MongoDB backend for THIRDEYE.

## Features

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
   Create a `.env` file in `backend/` based on `.env.example`.

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

## API Endpoints

- `GET /api/health` – server health
- `GET /api/inspections` – inspection counter
- `POST /api/inspections/increment` – increment counter
- `POST /api/bookings` – create booking (multipart form-data)
- `GET /api/bookings` – list bookings

## Environment Variables

See `.env.example` for available environment variables.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
