# Chat App

## Live Demo

You can view the live demo of the project here: [ChatApp](https://chatapp-sy99.onrender.com/)

## Project Setup Guide

Follow the steps below to set up the project on your local machine:

### Prerequisite

Ensure you have the following installed:

- **Node.js** (perferably version 20)
- **npm** (Node Package Manager)
- **PostgreSQL** (Database)
- **Git** (Version Control)

### 1. Clone the Repository

Clone the project repository to your local machine:

```bash
git clone https://github.com/whogoodluck/chatapp.git
```

Navigate to the project folder:

```bash
cd chatapp
```

### 2. Install Dependencies

Run the following command to install the project dependencies:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a .env file at the root of the project. Use the .env.example file as a reference for required environment variables:

```bash
cp .env.example .env
```

### 4. Run Database Migrations

Apply the database migrations to set up the schema:

```bash
npx prisma migrate deploy
```

To verify that the database is correctly set up, you can use Prisma Studio to view the data:

```bash
npx prisma studio
```

### 5. Run Seed Script (Optional)

You can run a seed script to populate the database with sample data (if provided):

```bash
npm run db:seed
```

This step is optional and only needed if you want to populate your database with initial data.

### 6. Start Development Server

```bash
npm run dev
```

This will start the server on http://localhost:3000. Open the URL in your browser to view the project.

### 7. Build for Production and Start

To build the project for production and start the server, run the following:

```bash
npm run build
npm start
```

The production build will be available at http://localhost:3000.

### 8. Linting and Formatting (Optional)

To ensure consistent code style, you can run the following commands for linting and formatting:

Linting:

```bash
npm run lint
```

Formatting:

```bash
npm run format
```

## Tech Stack

The project uses the following technologies:

- **React** (JavaScript library for building user interfaces)
- **Next.js** (React framework for building web applications)
- **Tailwind CSS** (Utility-first CSS framework)
- **Shadcn UI** (Component library for React)
- **React Hook Form** (Form management library for React)
- **Zod** (Schema validation library)
- **TypeScript** (Typed superset of JavaScript)
- **Prisma** (ORM for PostgreSQL database)
- **PostgreSQL** (Relational database)
- **NextAuth.js** (Authentication)
- **ESLint** (JavaScript linting)
- **Prettier** (Code formatting)
- **Git** (Version control)

## Next.js Features Used

- **App Router** – File-based routing and data fetching.
- **React Server Components (RSC)** – Server-side rendering for better performance.
- **Server Actions** – Simplified server-side data fetching and state.
- **Middleware** – Handles routing, authentication, and redirects.
- **Dynamic Routing** – Flexible routes based on data.
- **Custom Error and Loading Pages** – Custom error handling and loading built-in.
