# Campus Pulse Plus - Frontend

A modern React frontend for Campus Pulse, a student voice platform that allows college students to anonymously share campus issues, connect with the community, and drive positive change.

## 🚀 Features

### Core Features
- **Anonymous Posting** - Share campus issues without revealing your identity
- **Category Filtering** - Filter posts by category:
  - Facilities & Maintenance (dorm showers, recycling bins, building repairs)
  - Tech Issues (WiFi problems, computer labs, online systems)
  - Safety (campus security, emergency concerns, safety protocols)
  - Housing (room assignments, maintenance requests, housing policies)
- **Sort Options** - Sort posts by:
  - Newest First
  - Oldest First
  - Most Likes
  - Most Comments
- **Search** - Search posts by content
- **Reactions** - Like posts to show support
- **Comments** - Engage in discussions on campus issues

### Additional Features
- **User Authentication** - Login/Signup functionality
- **User Profiles** - View your post history
- **Admin Dashboard** - Manage posts, users, and view analytics
- **Analytics** - Visual charts showing post distribution by category and engagement metrics
- **Responsive Design** - Mobile-first design that works on all devices

## 🛠 Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Analytics charting library
- **ESLint** - Code linting

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd campus_pulse_plus_frontend2
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## 🏗 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin-specific components
│   ├── analytics/       # Chart components
│   ├── layout/          # Navbar, Footer
│   └── posts/           # Post-related components
├── context/             # React contexts (Auth)
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── App.jsx              # Main app component
└── main.jsx             # Entry point
```

## 🎨 Design System

The application uses a clean, modern design with:
- Gradient accents
- Card-based layouts
- Responsive grid systems
- Smooth transitions and animations

## 📱 Pages

- **Home** - Landing page with hero section, categories overview, and featured posts
- **Posts** - Browse and filter all community posts
- **Create Post** - Share a new campus issue
- **Login/Signup** - User authentication
- **Profile** - User profile and post history
- **Admin Dashboard** - Admin overview with statistics
- **Analytics** - Visual analytics of post data
- **User Management** - Admin user management
- **Category Manager** - Admin category management
- **Post Manager** - Admin post moderation

## 🔐 Authentication

The app includes authentication context that handles:
- User login/logout
- Protected routes
- Session management

## 🎯 API Integration

The frontend is designed to integrate with a backend API. Configure the API endpoint in your environment or API service layer.

## Backend repository
This is the URL for the backend repo: https://github.com/HidayaMohamed/campus_pulse_plus_backend.git


## Live Demo

- Frontend: https://campuspulseplusfrontenddeployed.vercel.app/
- Backend API: https://campus-pulse-plus-backend.onrender.com


##  Test Credentials

Use the following accounts to test the application:

### Admin User
- Email: admin@campus.com
- Password: admin123

### Regular User
- Email: student1@campus.com
- Password: password1

## 📄 License

MIT License - feel free to use this project for learning and development.

