# Shop Dashboard with Subdomain Authentication (MERN Stack)

## Overview

This project implements a shop management system with subdomain-based authentication. Users can create multiple shops, and each shop gets its own subdomain (e.g., `shop1.localhost:5173`). Authentication is preserved across all subdomains.

## Features

- ✅ User authentication (signup/login)
- ✅ Shop creation with unique names
- ✅ Subdomain-based shop dashboards
- ✅ Cross-subdomain authentication
- ✅ Protected routes
- ✅ Responsive UI

## Tech Stack

**Frontend:**
- React
- Vite
- React Router
- Tailwind CSS
- Lucide React (icons)

**Backend:**
- Node.js
- Express
- MongoDB (with Prisma ORM)
- JWT authentication



## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/shop-dashboard.git
cd shop-dashboard
```

### 2. Set up the backend

```bash
cd server
npm install
```

```
Note :If prisma schema didn't auto generate on "npm i", use this command "npx prisma generate"
```

Create a `.env` file in the backend directory:

```env
DATABASE_URL="mongodb+srv://username:password@cluster0.qxclpw1.mongodb.net/databasename?retryWrites=true&w=majority"
JWT_SECRET=your_Token_secret_key
JWT_EXPIRES_IN="30m"(optinal)
JWT_REMEMBER_EXPIRES_IN="7d"(optinal)
PORT=5000
```

### 3. Set up the frontend

```bash
cd client
npm install
```

Create a `.env` file in the frontend directory:

```env
<!-- For local -->
VITE_BACKEND_URL=http://localhost:5000/api/v1
VITE_FRONTEND_URL=localhost:5173
<!-- Deployment -->
VITE_FRONTEND_URL=yourdeployfrontendurl
VITE_BACKEND_URL=yourdeploybackendurl/api/v1
```

### 4. Configure hosts file (Optional)

Add these entries to your `/etc/hosts` (Mac/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1 localhost
127.0.0.1 shop1.localhost
127.0.0.1 shop2.localhost
127.0.0.1 shop3.localhost
```

## Running the Application

### Start the backend

```bash
cd server
nodemon
```

### Start the frontend

```bash
cd client
npm run dev
```

The application will be available at:
- Main app: http://localhost:5173
- Shop subdomains: http://exampleshop.localhost:5173, etc.

## Project Structure

```
shop-dashboard/
├── server/               # Node.js backend
│   ├── prisma/           # Prisma schema
│   ├── src/              # Backend source
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # secure data
│   │   ├── routes/       # API routes
│   │   └── app.js        # Express app
├── client/             # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Auth context
│   │   └── App.jsx       # Main app component
```

## Testing Credentials

You can create your own account or use these test credentials:

- Username: `Ahad`
- Password: `ahusha1234@`

## Troubleshooting

**Subdomains not working?**
- Verify your hosts file entries
- Check that cookies are being set with `.localhost` domain
- Ensure Vite is running with `host: true` in config (optional)

**Authentication issues?**
- Verify JWT secret matches between frontend and backend
- Check cookie settings in your browser
- Ensure CORS is properly configured