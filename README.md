# Third Eye Vehicle & Property Inspection

A full-stack web application for booking professional vehicle and property inspection services. This platform allows users to easily schedule and manage inspections with detailed reporting and professional assessments.

![App Screenshot](/frontend/public/logo512.png)

## 🌟 Features

### Vehicle Inspection
- 200+ point mechanical inspection
- Full diagnostic scan
- Body and chassis assessment
- Digital report with photos

### Property Inspection
- Pre-lease condition assessment
- Plumbing and electrical checks
- Comprehensive photo and video documentation
- Detailed condition report

### User Experience
- Modern, responsive design
- Easy online booking system
- Real-time status updates
- Secure payment processing

## 🚀 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Icons** for iconography

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Multer** for file uploads
- **CORS** for cross-origin requests

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or later)
- npm (v9 or later) or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   UPLOAD_DIR=./public/uploads
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`

## 📦 Deployment

### Vercel (Frontend)
1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set the root directory to `/frontend`
4. Add environment variables if needed
5. Deploy!

### Heroku (Backend)
1. Create a new Heroku app
2. Connect your GitHub repository
3. Set environment variables in Heroku config
4. Deploy the `main` branch

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

For any inquiries, please contact us at [your-email@example.com](mailto:your-email@example.com)
