# Task Management Application

A full-featured task management application built using React.js and Node.js. This project helps users manage their tasks effectively by creating, updating, and tracking tasks such as important, completed, and incomplete tasks. The application also features user authentication and a dynamic UI with Tailwind CSS.

---

## Features

- **User Authentication**: Secure login and registration using JWT.
- **Create Tasks**: Add new tasks with a title and description.
- **Mark Important**: Highlight tasks by marking them as important (red heart feature).
- **Track Task Status**: Manage completed and incomplete tasks.
- **Dynamic UI**: Responsive and interactive user interface powered by Tailwind CSS.
- **Protected Routes**: Access control for authenticated users.
- **Real-time Updates**: Task list updates dynamically after creation.

---

## Tech Stack

### Frontend:
- **React.js**: UI library for building dynamic interfaces.
- **React Router**: For navigation and route management.
- **Tailwind CSS**: For styling and responsive design.
- **React Icons**: For customizable icons.

### Backend:
- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building REST APIs.
- **MongoDB**: Database for storing user and task information.
- **JWT**: For secure user authentication.

---

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB instance running locally or in the cloud

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/MeghrajGadhave/task-management-app.git
   cd task-management-app

PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
