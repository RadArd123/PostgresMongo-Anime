# PERN Anime App

This is a full-stack web application for browsing and managing information about anime. It features a React-based frontend and a Node.js/Express backend with a PostgreSQL and MongoDb database.

## Tech Stack

### Backend

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL and MongoDB
- **Authentication**: JSON Web Tokens (JWT) with bcrypt for password hashing
- **File Uploads**: Cloudinary for cloud-based image storage
- **Validation**: Zod
- **ORM/Database Driver**: `pg` for PostgreSQL, `mongoose` for MongoDB
- **Other**: `dotenv` for environment variables, `cors` for resource sharing

### Frontend

- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **State Management**: Zustand
- **Styling**: Tailwind CSS with shadcn/ui components
- **HTTP Client**: Axios
- **UI Components**: Radix UI, lucide-react, embla-carousel-react

## Features

- **User Authentication**: Secure user registration and login system.
- **Admin Panel**: Special administrative privileges for managing site content.
- **Anime Browsing**: View a comprehensive list of anime.
- **Detailed Views**: Get more information on a specific anime or episode.
- **Personal Lists**:
    - Add anime to a personal **Watchlist**.
    - Mark favorite anime in a **Favorites** list.
- **Community Features**:
    - Write and read **Reviews** for anime.
- **Dynamic Content**:
    - Hero banner for featured anime.
    - Suggested anime section.
    - Latest anime news updates.
- **File Management**: Admins can upload images for anime, news, and episodes.

## Getting Started

### Prerequisites

- Node.js
- npm (or a similar package manager)
- PostgreSQL instance
- MongoDB instance

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd PERN-Anime-App
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    # Create a .env file based on the required environment variables (e.g., database connection strings, JWT secret, Cloudinary credentials)
    npm run dev
    ```

3.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

The application should now be running, with the frontend accessible at `http://localhost:5173` (or another port specified by Vite) and the backend at its configured port.

## Folder Structure

```
PERN-Anime-App/
├── backend/
│   ├── src/
│   │   ├── controllers/ # Request handling logic
│   │   ├── model/       # Database interaction logic (PostgreSQL)
│   │   ├── mongoSchema/ # Database schemas (MongoDB)
│   │   ├── routes/      # API endpoint definitions
│   │   ├── middleware/  # Express middleware
│   │   └── ...
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Application pages
    │   ├── store/       # Zustand state management stores
    │   ├── hooks/       # Custom React hooks
    │   ├── lib/         # Utility functions and Axios setup
    │   └── ...
    └── package.json
```
