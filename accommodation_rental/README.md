# AI-Powered Accommodation Rental Platform

This project is a full-stack accommodation rental platform built with a Django REST Framework backend and a React frontend. It features traditional and AI-powered natural language property search, location-based search, role-based access control, and booking management.

## Features Completed
- **User Authentication**: Registration, login, and JWT-based authentication.
- **Role-Based Access**: Separation of Admin and standard User privileges.
- **Property Management**: Listing, searching, and viewing detailed properties.
- **Location-Based Search**: Find properties near specific coordinates using Haversine distance calculations.
- **AI-Powered Search**: Natural-language property search integrated with Google Gemini API.
- **Booking System**: Users can book properties and view their booking history.
- **API Documentation**: Automated Swagger UI documentation via `drf-spectacular`.
- **Database**: PostgreSQL integration.

## Setup Instructions

### Prerequisites
- Python 3.10+
- PostgreSQL
- Node.js (for React frontend)

### Backend Setup (Django)

1. **Clone the repository and navigate to the backend folder:**
   ```bash
   cd accommodation_rental
   ```

2. **Create a PostgreSQL database:**
   ```sql
   CREATE DATABASE rental_db;
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory (`accommodation_rental/`) with the following keys:
   ```env
   SECRET_KEY=your_django_secret_key
   DB_NAME=rental_db
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Install Dependencies:**
   Since this project uses a streamlined `requirements.txt`:
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: It is highly recommended to do this inside a virtual environment: `python3 -m venv venv && source venv/bin/activate`)*

5. **Run Migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create an Admin User:**
   ```bash
   python manage.py createsuperuser
   ```

7. **Seed the Database with Sample Properties (Optional):**
   ```bash
   python manage.py seed_properties
   ```

8. **Run the Backend Server:**
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://127.0.0.1:8000/`. You can view the API Documentation (Swagger) at `http://127.0.0.1:8000/api/docs/`.

---

### Frontend Setup (React)

1. **Navigate to the frontend folder:**
   ```bash
   cd ../accommodation_rental_react
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the React Development Server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at the local URL provided by Vite (usually `http://localhost:5174/`).
