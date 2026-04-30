# Team Task Manager

A full-stack web application designed for seamless team collaboration and task management. It allows users to create projects, assign tasks to members, track progress, and manage role-based access.

## Features

- **Authentication System:** Secure sign up and login with JWT and bcrypt.
- **Role-Based Access Control (RBAC):** Admin and Member roles (Admins can create projects).
- **Project Management:** Create and view projects.
- **Task Tracking (Kanban-style):** Create, update, and track task statuses (To Do, In Progress, Done).
- **Premium Aesthetics:** Stunning dark mode with glassmorphism and modern UI elements.
- **Responsive Dashboard:** Overview of all tasks across projects, including overdue alerts.

## Technology Stack

- **Frontend:** React, Vite, React Router v6, Zustand, Vanilla CSS.
- **Backend:** Node.js, Express.js.
- **Database:** Prisma ORM with SQLite (locally) / PostgreSQL (production ready).

## Local Development

1. **Install Dependencies**
   ```bash
   npm run postinstall
   ```
2. **Setup Database**
   ```bash
   cd backend
   npx prisma db push
   npx prisma generate
   ```
3. **Start Development Servers**
   - Backend: `npm run dev:backend`
   - Frontend: `npm run dev:frontend`

## Deployment on Railway

This repository is optimized for zero-config deployment on Railway.

1. Create a GitHub repository and push this code.
2. Log in to [Railway](https://railway.app/).
3. Click "New Project" -> "Deploy from GitHub repo".
4. Select your repository. Railway will automatically detect the `railway.json` and build both the frontend and backend using the root `package.json` scripts.
5. In your Railway project settings, add the following Environment Variables:
   - `DATABASE_URL` (You can add a PostgreSQL plugin in Railway or use a Volume with SQLite `file:/data/dev.db`).
   - `JWT_SECRET` (A secure random string).
   - `NODE_ENV=production`
6. The Express server will automatically serve the built React frontend on the provided Railway domain!
