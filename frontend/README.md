# Digital Library - MERN Stack Application

A full-stack digital library application where users can browse, search, and read books online.

## Features

### Frontend
- 📚 Browse books by category
- 🔍 Search functionality
- 📖 Read book previews
- 🔐 User authentication (Login/Register)
- ⭐ Book ratings
- 📱 Fully responsive design

### Backend
- REST API with Express.js
- MongoDB database with Mongoose
- JWT authentication
- Password hashing with bcrypt
- Role-based access control (User/Admin)
- CRUD operations for books
- User favorites system

## Tech Stack

**Frontend:**
- React 18
- React Router
- Axios
- Tailwind CSS
- Lucide React (icons)

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
   cd backend
```

2. Install dependencies:
```bash
   npm install
```

3. Create `.env` file:
```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/digital-library
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
```

4. Start the server:
```bash
   npm run dev
```

   Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
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

   Frontend will run on `http://localhost:3000`

## API Endpoints

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Protected)
- `POST /api/users/favorites/:bookId` - Add to favorites (Protected)
- `DELETE /api/users/favorites/:bookId` - Remove from favorites (Protected)

## Project Structure