# AI-Powered Accommodation Rental Platform

This project is a full-stack accommodation rental platform built with a Django REST Framework backend and a React frontend. It allows users to search properties using standard filters as well as AI-powered natural-language queries.

## 📋 Features Checklist
- [x] **User registration and login**: Integrated with Django user model and React frontend.
- [x] **JWT authentication**: Uses `rest_framework_simplejwt` for secure API access.
- [x] **Property listing & details**: Browse available properties with detailed views.
- [x] **Property search & Location-based search**: Search properties by city, address, and other filters.
- [x] **Property booking & Booking history**: Users can book properties and view their past bookings.
- [x] **Role-based access**: Separation between standard Users and Admin users (with an Admin dashboard).
- [x] **AI-powered natural-language property search**: Integrated with Google Gemini API to parse queries.
- [x] **React frontend**: Modern UI built with React and Vite.
- [x] **Django REST Framework backend**: Robust API backend.
- [x] **PostgreSQL database**: Configured for relational data storage.
- [x] **API documentation**: Automated Swagger UI documentation via `drf-spectacular`.

---

## 🏗️ Architecture & Design Choices

While **React**, **PostgreSQL**, and **JWT Authentication** were explicitly required for this task, the following technical decisions were made for the remaining stack to ensure a robust and scalable product within the 48-hour deadline:

- **Django REST Framework (Backend)**: Given the choice between DRF and FastAPI, DRF was selected because Django provides a massive amount of built-in functionality out-of-the-box (ORM, Admin panel, authentication system). This allowed for rapid development of the property and booking models without reinventing the wheel.
- **Google Gemini API (AI Search)**: To fulfill the "AI-powered natural-language property search" requirement, Gemini was chosen for **semantic parsing** rather than using vector embeddings (like Sentence Transformers + pgvector). While embeddings are great for fuzzy text matching, they struggle heavily with hard numerical constraints (e.g., "under 5000", "exactly 3 bedrooms"). Gemini efficiently extracts structured JSON filters directly from raw user input, allowing us to apply exact relational database filters for numbers/booleans while providing a true "AI" experience with minimal overhead. A keyword-ranking fallback ensures users still get results if the AI parsing fails.
- **Vite (Frontend Tooling)**: Paired with the required React framework, Vite was chosen for its lightning-fast HMR (Hot Module Replacement), which significantly speeds up frontend development compared to alternatives like Create React App.
- **Swagger UI (API Documentation)**: To fulfill the "API documentation" requirement, `drf-spectacular` was integrated to automatically generate an interactive OpenAPI (Swagger) interface. This provides professional, up-to-date documentation where endpoints can be tested directly from the browser, avoiding the need for static, manually updated API docs.

---

## 🚀 Proper Installation Guide

Follow these steps carefully to get the project running on your local machine.

### Prerequisites
- **Python 3.10+** installed
- **PostgreSQL** installed and running
- **Node.js (v18+)** installed
- A **Google Gemini API Key**

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd rentals
```

### 2. Backend Setup (Django)

Open a terminal and navigate to the backend directory:
```bash
cd accommodation_rental
```

**Step 2.1: Database Configuration**
Log into your local PostgreSQL instance and create the database:
```sql
CREATE DATABASE rental_db;
```

**Step 2.2: Environment Variables**
Create a `.env` file inside the `accommodation_rental` folder and add the following:
```env
SECRET_KEY=your_super_secret_django_key_here
DB_NAME=rental_db
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
GEMINI_API_KEY=your_actual_gemini_api_key
```

**Step 2.3: Install Dependencies & Setup Virtual Environment**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

**Step 2.4: Migrations & Admin Account**
```bash
python manage.py migrate
python manage.py createsuperuser
```
*(Follow the prompts to create your admin email/password)*

**Step 2.5: Seed the Database (Highly Recommended)**
To populate your database with initial testing properties, run the seed command. 
*(Note: You can view and customize the seed data by editing [`accommodation_rental/properties/management/commands/seed_properties.py`](file:///Users/princeb/Documents/rentals/accommodation_rental/properties/management/commands/seed_properties.py) before running this command).*
```bash
python manage.py seed_properties
```

**Step 2.6: Start the Backend Server**
```bash
python manage.py runserver
```
The API is now running at `http://127.0.0.1:8000/`. 

---

## 📚 API Documentation (Swagger)

Once the backend server is running, the **Interactive API Documentation** is automatically generated and hosted via Swagger UI.

👉 **Access the Swagger API Docs here:** [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)

From this interface, evaluators and developers can view all available endpoints, required payload structures, and even test API calls directly in the browser!

---

### 3. Frontend Setup (React)

Open a **new terminal window**, and navigate to the frontend directory:
```bash
cd accommodation_rental_react
```

**Step 3.1: Environment Variables**
Create a `.env` file inside `accommodation_rental_react` and configure the API URL:
```env
VITE_API_URL=http://localhost:8000
```

**Step 3.2: Install Node Modules**
```bash
npm install
```

**Step 3.3: Start the Frontend Server**
```bash
npm run dev
```
The frontend is now running! Visit the local URL provided in the terminal (usually `http://localhost:5174/`) to view the application.
