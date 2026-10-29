# EventHub — Frontend

![React](https://img.shields.io/badge/React-19-087EA4?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Multi--stage-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**EventHub** is a responsive event and community management web application built with React, Vite, and Tailwind CSS.

Users can explore events, join communities, manage event participation, and interact through discussions. The application also provides organizer and admin interfaces.

Developed as part of the Koda Academy Full-Stack Web Development project.

**Backend:** [EventHub REST API](https://github.com/rlanakomara7/koda-b9-eventhub-backend)

## Technologies

| Technology     | Purpose                           |
| -------------- | --------------------------------- |
| React 19       | Component-based user interface    |
| Vite 8         | Development server and build tool |
| Tailwind CSS 4 | Responsive styling                |
| React Router   | Navigation and protected routes   |
| Redux Toolkit  | Application state management      |
| React Redux    | Connecting components to Redux    |
| Redux Persist  | Persisting authentication state   |
| React Icons    | Interface icons                   |
| Chart.js       | Dashboard visualization           |
| Nginx          | Serving production frontend       |
| Docker         | Multi-stage container build       |

## Features

### Authentication

- Register and login
- Logout
- Forgot and reset password
- Protected application routes

### Events

- Browse and search events
- Filter by category and event format
- View event details
- Join and leave events
- Save and unsave events
- View joined and saved events
- Event discussions

### Communities

- Browse and search communities
- Filter by category and membership status
- Join and leave communities
- Save and unsave communities
- View community members
- Community discussions

### User Profile

- View and update profile
- Upload avatar
- View notifications

### Organizer

- Dashboard
- Create events
- Edit events
- Delete events

### Admin

- Admin dashboard
- User, event, and community management interfaces

Some admin interfaces currently use local or demonstration data.

## Project Structure

```text
src/
├── components/        # Reusable UI components
├── context/           # Theme context
├── hooks/             # Custom hooks
├── layouts/           # Page layouts
├── pages/             # Application pages
│   ├── admin/
│   ├── attendee/
│   ├── auth/
│   ├── guest/
│   └── organizer/
├── redux/
│   ├── slice/         # Redux slices
│   └── store.js
├── services/          # Backend API requests
├── Router.jsx         # Application routing
└── main.jsx           # Application entry point
```

## Getting Started

### Prerequisites

- Git
- Node.js compatible with Vite 8
- npm
- Running EventHub Backend API

### Clone Repository

```bash
git clone https://github.com/rlanakomara7/EventHub.git
cd EventHub
```

### Install Dependencies

```bash
npm ci
```

### Environment Configuration

Create `.env.local` in the frontend root directory:

```env
VITE_API_URL=http://localhost:8500
```

This URL points to EventHub Backend through Nginx.

Variables prefixed with `VITE_` are visible in the browser. Never store secrets in these variables.

### Run Development Server

```bash
npm run dev
```

Open the address displayed by Vite, normally:

http://localhost:5173

### Build for Production

```bash
npm run build
```

Build output is generated in `dist/`.

## Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build production files   |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## Application Routes

| Route              | Page                | Access    |
| ------------------ | ------------------- | --------- |
| `/`                | Explore             | Public    |
| `/event`           | Event listing       | Public    |
| `/communities`     | Community listing   | Public    |
| `/signin`          | Sign in             | Public    |
| `/signup`          | Sign up             | Public    |
| `/event/:id`       | Event detail        | Protected |
| `/communities/:id` | Community detail    | Protected |
| `/myevents`        | My Events           | Protected |
| `/profile`         | User profile        | Protected |
| `/notification`    | Notifications       | Protected |
| `/dashboard`       | Organizer dashboard | Protected |
| `/admin`           | Admin dashboard     | Protected |

Protected routes use authentication state from Redux.

## Backend API Integration

The frontend communicates with the backend using `fetch` and service modules under `src/services/`.

| Method | Endpoint                    | Purpose          |
| ------ | --------------------------- | ---------------- |
| POST   | `/api/auth/login`           | Login            |
| POST   | `/api/auth/register`        | Register         |
| GET    | `/api/events`               | List events      |
| GET    | `/api/events/:id`           | Event details    |
| POST   | `/api/events/:id/join`      | Join event       |
| GET    | `/api/communities`          | List communities |
| POST   | `/api/communities/:id/join` | Join community   |
| GET    | `/api/profile`              | Get user profile |
| PATCH  | `/api/profile`              | Update profile   |

Authenticated requests use a JWT Bearer token.

See the backend repository for the complete API implementation.

## Docker

The frontend includes a multi-stage Dockerfile.

1. **Builder stage:** Node.js installs dependencies and builds the React application.
2. **Production stage:** Nginx serves the generated static files.

In the integrated production setup, frontend and backend can use the same origin through the backend repository's Nginx reverse proxy.

Production Compose configuration is maintained in the backend repository.

## Related Repository

[EventHub Backend — Go Gin](https://github.com/rlanakomara7/koda-b9-eventhub-backend)

## Project

Koda Academy — Full-Stack Web Development.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
