# Finance Tracker

A full-stack personal finance tracker to manage income and expenses with category-based tracking and JWT authentication.

## Tech Stack

- **Frontend:** React, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcryptjs

## Project Structure

```
finance-tracker/
├── backend/      # Express REST API
└── frontend/     # React app
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/finance-tracker.git
cd finance-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy the sample env file and fill in your values:

```bash
cp .env.sample .env
```

Edit `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your_jwt_secret_key_here
```

Start the backend server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Backend runs on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Add a transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

## Categories

- **Income:** Salary, Freelance
- **Expense:** Food, Rent
