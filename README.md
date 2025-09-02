# Civic Issue Reporting System

A fullstack application for citizens to report civic issues to local authorities.

## Tech Stack

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Frontend
- Next.js
- Tailwind CSS

### Deployment
- Docker
- Vercel (Frontend)
- Railway (Backend & Database)

## Project Structure

```
├── README.md
├── docker-compose.yml
├── backend/
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   ├── prisma/schema.prisma
│   └── src/index.js
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── pages/_app.js
    └── pages/index.js
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)
- Cloudinary account (for image uploads)
- Mailtrap account (for email testing)

### Local Development Setup

1. Clone the repository

```bash
git clone <repository-url>
cd civic-issue-system
```

2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Update with your environment variables
```

Update the `.env` file with your database credentials, JWT secret, Cloudinary keys, and Mailtrap configuration.

```bash
npx prisma migrate dev --name init
npm run dev
```

3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env  # Update with your environment variables
npm run dev
```

4. Using Docker for Local Development

```bash
# Start all services (backend, frontend, and PostgreSQL)
docker-compose up -d

# Start only the database
docker-compose up -d postgres

# Start only the backend
docker-compose up -d backend

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Features

- User authentication (signup, login, profile management)
- Report civic issues with location, category, and description
- Upload images for issues
- Track status of reported issues
- Admin dashboard for managing issues
- Public API for integration with other services

## API Documentation

API documentation is available at `/api/docs` when the backend server is running.

## Deployment

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend`
3. Configure environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed backend API

The `vercel.json` file in the frontend directory contains the necessary configuration for deployment.

### Backend Deployment Options

#### Option 1: Railway

1. Connect your GitHub repository to Railway
2. Set the root directory to `backend`
3. Configure environment variables in the Railway dashboard (refer to `.env.example`)
4. Add PostgreSQL plugin for the database

#### Option 2: Docker Deployment

1. Build and push the Docker image to a container registry:

```bash
cd backend
docker build -t your-registry/civic-backend:latest .
docker push your-registry/civic-backend:latest
```

2. Deploy to your preferred container hosting service (AWS ECS, Google Cloud Run, DigitalOcean App Platform, etc.)

3. Configure environment variables according to `.env.example`

#### Option 3: Manual Deployment

1. Set up a server with Node.js installed
2. Clone the repository and navigate to the backend directory
3. Install dependencies: `npm install --production`
4. Build the application: `npm run build`
5. Set up environment variables according to `.env.example`
6. Start the server: `npm start`

### Database Setup for Production

1. Set up a PostgreSQL database (managed service recommended)
2. Update the `DATABASE_URL` environment variable with your production database connection string
3. Run migrations: `npx prisma migrate deploy`

## License

MIT