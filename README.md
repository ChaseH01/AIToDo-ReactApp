## Intro:
This repo is an adaptation of a final project for WashU's CSE330 Rapid Prototype and Development. My partner contributed to the CSS styling, while I was responsible for all other aspects of the project. All design and implementation are mine. Note: AI was used to generate parts of this ReadMe

#  🔍 Summary
This full-stack To-Do List application allows users to register, log in, and manage their personal to-do items in a seamless and secure environment. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), this app supports essential task operations like adding, editing, completing, and deleting to-do items. Users can track their progress and export their list to share with others. 
🤖 OpenAI API is used to automatically summarize and enhance user task entries.
📧 SendGrid (via Twilio) is used to automatically send a welcome email when a user signs up — adding a professional touch to user onboarding.
🧾MongoDB is used to store user information across sessions and ensure data integrity across users.

## How to run this code:
##### 🧾 1. Prerequisites
Make sure you have the following installed:
Node.js (v18+ recommended): https://nodejs.org

##### 2. Clone the Repository
##### 3. Delete and Re-Install Dependencies
in ```./server```:
```
cd server
rm -rf node_modules package-lock.json
npm install
```
For the Frontend:
Open a second terminal tab or window and run:
```
cd to_do_app
rm -rf node_modules package-lock.json
npm install
```
##### 🔐 4. Set Up API Keys
The server uses the OpenAI API, MongoDB, Twilio SendGrid, so you'll need a .env file.

In ```server/.env```, create this file with the following contents:
```
PORT=8080
MONGO_URI= ...
TWILIO_SENDGRID_API_KEY=...
OPENAI_API_KEY=...
```

##### ▶️ 5. Run the App
run ```npm start in /to_do_app```
run ```npm start in /server```

## Don't want to do all that? See screenshots below for app walk through

## 💡 Key Features
Modern Frontend with React.js
Designed a responsive and intuitive UI that lets users add, edit, complete, and delete tasks. The interface automatically updates based on user actions and login state.

Secure Backend with Express.js & Node.js
Created a robust backend to handle routing, authentication, and API requests, following RESTful design conventions.

MongoDB Integration
Implemented persistent data storage using MongoDB, allowing users' to-do items to be saved and retrieved across sessions. The database includes structured collections for users and tasks.

User Authentication System
Built a secure login and registration system using sessions and hashed passwords. Users can create accounts, log in/out, and manage their own data securely.

SendGrid API Integration
Upon user registration, the backend uses Twilio's SendGrid API to automatically send a confirmation email—adding a polished, professional touch to the signup experience.

OpenAI API Integration
Integrated the OpenAI API to provide users with personalized to-dos based on broad goals.

Clean Code & Best Practices
Maintained a modular codebase with readable, well-documented files. API endpoints and database schemas are logically structured and follow best practices.

### 1. The loading page when a user logs in:
![Login Screen](/images/login.png)

### 2. The home page a user sees when upon a successful log in:
![Home Screen](/images/home.png)

### 3. A user can add a to-do as a simple input:
![Login Screen](/images/walgreens_before.png)

### 4. And a unique to-do is created and stored in mongoDB for that specific user:
![Login Screen](/images/walgreens_after.png)

### 5. A progress bar also tracks how many tasks a user has completed:
![Login Screen](/images/progress.png)

### 6. Utilizing the OpenAI API, a user can harness the power of AI to add to their to-dos
![Login Screen](/images/AI_before.png)

### 7. And these to-dos are parsed and stored to this user in mongoDB as well
![Login Screen](/images/AI_after.png)

### 8. If a user wants to share their list, they can download a PDF copy of it:
![Login Screen](/images/PDF.png)

### 9. Logging out and signing back in as a different user preserves data integrity
![Login Screen](/images/Unique.png)
