<h1>Fitkeep - Your AI-Powered Fitness & Nutrition Coach</h1>


<p align="center">
A full-stack web application designed to simplify fitness tracking through intelligent automation and personalized, AI-driven insights.
</p>

<p align="center">
<a href="#key-features"><strong>Key Features</strong></a> ·
<a href="#tech-stack"><strong>Tech Stack</strong></a> ·
<a href="#setup-and-installation"><strong>Setup</strong></a> ·
<a href="#future-scope"><strong>Future Scope</strong></a>
</p>

🚀 Overview
Fitkeep is a comprehensive fitness and nutrition application built to provide a personalized coaching experience. It leverages the power of AI to make logging meals and workouts effortless, offers a data-rich dashboard for tracking progress, and fosters a supportive community through a built-in blog platform. This project showcases a robust backend API built with Django REST Framework and a dynamic, responsive frontend with React.

✨ Key Features
🤖 AI-Powered Logging:

Meal Logging: Log meals using natural language (e.g., "a bowl of oatmeal with berries"). The Nutritionix API integration handles the complex nutritional analysis.

Workout Logging: Describe workouts in plain English (e.g., "ran for 30 minutes") for accurate, personalized calorie-burn calculations.

📊 Personalized Dashboard & Data Visualization:

A real-time dashboard featuring interactive charts built with Recharts.

A dynamic calorie and macro tracker with a progress ring.

Weekly trend charts for key metrics like steps, water intake, and sleep.

🧠 AI Nutritionist & Daily Tip:

An AI nutritionist chatbot, powered by the Groq API, to answer user questions.

A smart "Daily Tip" on the dashboard that provides personalized, motivational advice based on the user's logged activity.

✍️ Full-Featured Blog Platform:

A complete CRUD application for a community blog.

Users can create, read, update, and delete their own posts with image uploads.

Functionality to like and comment on posts, with custom permissions ensuring users can only edit their own content.

👤 Comprehensive User Profiles & Goal Setting:

A complete user management system with secure registration and token-based authentication (Simple JWT).

Detailed user profiles with biometrics, personalized goal setting (calories, steps, water, sleep), and image upload functionality with automatic resizing.

📈 Data Analysis & Export:

A dedicated analysis page to generate and display monthly/weekly reports on user progress.

Interactive charts for weight trends, calorie balance, and macro distribution.

A feature to export all user data to a downloadable CSV file using pandas.

🛠️ Tech Stack
Backend

Frontend

AI & Data

Django

React

Groq

Django REST Framework

React Router

Nutritionix

PostgreSQL

Tailwind CSS

Pandas

Simple JWT

Recharts

Matplotlib & Seaborn



Framer Motion



⚙️ Setup and Installation
To run this project locally, you'll need to set up both the backend and frontend.

Backend (Django)

Clone the repository:



Create and activate a virtual environment:

python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

Install dependencies:

pip install -r requirements.txt

Set up environment variables:

Create a .env file in the root of the backend directory.

Add your secret keys and API keys:

SECRET_KEY='your-django-secret-key'
NUTRITIONIX_APP_ID='your-nutritionix-app-id'
NUTRITIONIX_API_KEY='your-nutritionix-api-key'
GROQ_API_KEY='your-groq-api-key'

Run database migrations:

python manage.py migrate

Run the server:

python manage.py runserver

The backend will be running at http://127.0.0.1:8000.

Frontend (React)

Clone the repository:

git clone [https://github.com/your-username/fitness_project.git](https://github.com/your-username/fitness_project.git)
cd fitness_project

Install dependencies:

npm install

Run the development server:

npm run dev

The frontend will be running at http://localhost:5173.

🚀 Future Scope
Social Features: Introduce community challenges and leaderboards to boost engagement.

Wearable Integration: Allow users to automatically sync their data from popular fitness watches like Fitbit and Apple Watch.

Advanced Meal Planning: Use AI to generate full weekly meal plans based on user preferences and goals.

This project was created as a comprehensive showcase of full-stack development skills.

