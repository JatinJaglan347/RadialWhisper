﻿# RadialWhisper

<p align="center">
  <img src="client/public/darkmainlogo.png" alt="RadialWhisper Logo" width="200" height="200" style="border-radius: 20px;"/>
</p>

<p align="center">
  <b>Connect with nearby people anonymously and form real connections</b>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#license">License</a>
</p>

---

## 📋 Overview

RadialWhisper is a location-based anonymous chat platform that connects users within their geographic proximity. Unlike traditional social networks, RadialWhisper prioritizes authentic connections by allowing users to chat anonymously before deciding to reveal their identity.

The application leverages geolocation technology to find nearby users and enables real-time communication with enhanced privacy features. Messages are automatically deleted based on predefined timeframes to maintain privacy and optimize performance.

## ✨ Features

### Core Functionality
- **Location-Based Matching**: Find and connect with users in your geographical radius
- **Anonymous Chatting**: Communicate without revealing your identity
- **Customizable Radius**: Set your preferred distance for finding connections
- **Progressive Relationship Building**: Transition from anonymous to identified connections
- **Friend System**: Add users as friends after establishing a connection
- **Auto-Generated Identity**: Unique tag and profile picture for initial anonymity
- **Real-Time Communication**: Instant messaging with nearby users

### Privacy & Security
- **Auto-Message Deletion**: Automatically removes messages after predefined periods
  - Friend messages: 48 hours
  - Nearby user messages: 1 hour
  - Unread messages: 60 hours
- **Secure Authentication**: JWT-based authentication with token rotation
- **Data Encryption**: Password hashing and secure data storage
- **Privacy Controls**: Granular control over personal information disclosure

### Administration
- **Comprehensive Admin Panel**: Tools for user management and content moderation
- **User Management**: Ban/unban capabilities and user activity monitoring
- **Content Moderation**: Tools to maintain community standards
- **Analytics Dashboard**: Insights into app usage and user engagement

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **State Management**: Zustand
- **UI Components**: Tailwind CSS, DaisyUI
- **Animations**: Framer Motion
- **Real-time Communication**: Socket.io
- **Charting**: Recharts
- **Icons**: Lucide React
- **Form Handling**: React Hook Form

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Real-time Server**: Socket.io
- **Scheduled Tasks**: Node-cron
- **Security**: bcrypt for password hashing

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/radial-whisper.git
   cd radial-whisper
   ```

2. **Install dependencies for both client and server**
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` files in both client and server directories based on the provided examples:
   
   **For server/.env:**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/radialwhisper
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_token_secret
   CLIENT_URL=http://localhost:5173
   ```
   
   **For client/.env:**
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start the development servers**
   
   In the server directory:
   ```bash
   npm run dev
   ```
   
   In the client directory:
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## 📱 Usage

### User Journey

1. **Registration**: Create an account with email, name, and other required information
2. **Location Sharing**: Allow the app to access your location
3. **Set Radius**: Choose how far you want to search for nearby users
4. **Discover**: Browse anonymous profiles of nearby users
5. **Chat**: Start conversations with users in your radius
6. **Connect**: Add users as friends if you want to maintain longer connections
7. **Reveal**: After becoming friends, both users can see each other's real identity

### User Roles

- **Normal User**: Regular application users
- **Moderator**: Users with limited administrative capabilities
- **Admin**: Users with full administrative access
- **King**: Super admin with complete control over the application

## 🏛️ Architecture

### Project Structure

```
radial-whisper/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Page components
│       ├── store/          # Zustand state management
│       └── lib/            # Utilities and helpers
│
└── server/                 # Backend Node.js application
    ├── src/
    │   ├── controllers/    # Request handlers
    │   ├── middlewares/    # Express middlewares
    │   ├── models/         # Mongoose data models
    │   ├── routes/         # API route definitions
    │   ├── utils/          # Helper functions
    │   ├── db/             # Database connection
    │   └── scheduler/      # Scheduled tasks
    └── public/             # Uploaded files and static assets
```

## 📄 License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License - see the [LICENSE](./LICENCE) file for details.

### License Summary

- **Viewing & Reference**: You may view and download the code for personal reference
- **Contributions**: You can submit issues and pull requests to suggest improvements
- **Restrictions**:
  - No commercial use
  - No distribution or republishing
  - No modification for use in other projects
  - License and copyright notice must be preserved

## 👥 Contact

Project created and maintained by [Jatin Jaglan](https://github.com/JatinJaglan347).

---

<p align="center">
  Made with ❤️ by Jatin Jaglan
</p>
