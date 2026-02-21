# Project Overview

This is a full-stack e-commerce or web application project containing a React frontend and a Node.js/Express backend.

## Structure

- **`frontend/`**: Contains the frontend application built with React, Vite, Tailwind CSS, Shadcn UI, Zustand, and React Router.
- **`backend/`**: Contains the backend REST API built with Express.js and Mongoose (MongoDB).

## Getting Started

### Prerequisites

- Node.js
- pnpm

### Installation

1. Install frontend dependencies:
   ```bash
   cd frontend
   pnpm install
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   pnpm install
   ```

### Running Locally

You can run both the frontend and backend concurrently using the provided script at the root of the project:

```bash
./dev.sh
```

Alternatively, you can run them individually:

**Frontend (Vite dev server):**
```bash
cd frontend
npm run dev
```

**Backend (Nodemon dev server):**
```bash
cd backend
npm run dev
```

## Technologies Used

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Shadcn UI, React Query, Zustand, React Router 7.
- **Backend**: Node.js, Express 5, TypeScript, Mongoose, JWT.
