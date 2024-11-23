Dog Kennel Management System

A simple login and registration system using Node.js, Express.js, and SQLite for managing user authentication.

Prerequisites

To set up this project, ensure the following tools are installed:

1. Node.js  
   Used to run the backend server.  
   ➡️ https://nodejs.org

2. SQLite  
   The lightweight database used to store user credentials.  
   ➡️ https://www.sqlite.org/download.html

3. DB Browser for SQLite (Optional, for database visualization)  
   A GUI tool to view and manage SQLite databases. Use it to inspect the dog_kennel.db database if needed.  
   ➡️ https://sqlitebrowser.org  

4. Postman (Optional, for API testing)  
   Postman is a popular API development and testing tool. Use it to send HTTP requests to test the backend endpoints.  
   ➡️ https://www.postman.com/downloads/  

5. A modern web browser  
   Any modern browser like Chrome, Firefox, or Edge will work to run the frontend.

Step-by-Step Instructions

1. Clone the Repository
First, clone this repository to your local machine:
```bash
cd Desktop
git clone https://github.com/Connor3008/DogReservationSystem.git
```

2. Install Dependencies
Install the required Node.js dependencies by running:
```bash
npm install
```

3. Set Up the Database

Option A: Using the Provided Database File  
If you want to use the included sample dog_kennel.db file:  
- Ensure the dog_kennel.db file is present in the database folder.

Option B: Creating a New Database File  
If you want to initialize your own fresh database:
1. Create the Database File:  
   Run the following command in your terminal:
   ```bash
   sqlite3 database/dog_kennel.db < scripts/init.sql
   ```
   This command will:
   - Create the dog_kennel.db file in the database folder.
   - Populate it with the required users table.

2. Verify the Database (Optional):  
   Open the dog_kennel.db file in DB Browser for SQLite to inspect the structure or data.

4. Start the Server
Run the backend server using:
```bash
node scripts/app.js
```
You should see output like this:
```
Server is running on http://localhost:3000
Connected to SQLite database.
```

5. Run the Frontend
Open the login.html file in your browser:
1. Right-click the file in your project folder.
2. Select Open With and choose your browser (e.g., Chrome, Firefox).

6. Test the Application

Option A: Using the Frontend
1. Open the login page in your browser.
2. Create an account by clicking Register.
3. Log in using your registered credentials.

Option B: Using Postman  
If you want to test the backend API endpoints:
1. Open Postman.
2. Test the following endpoints:

   - POST /register: To register a new user.  
     Example payload:
     ```json
     {
       "username": "exampleUser",
       "password": "examplePass",
       "role": "user"
     }
     ```

   - POST /login: To log in with existing credentials.  
     Example payload:
     ```json
     {
       "username": "exampleUser",
       "password": "examplePass"
     }
     ```

Project Features
1. Login System: Securely authenticate users.
2. Registration System: Allow new users to register accounts.
3. SQLite Integration: Manage user data in a lightweight database.

Best Practices

1. Exclude Sensitive Data: Avoid uploading the database file (dog_kennel.db) to GitHub if it contains sensitive or unnecessary data. Use .gitignore to exclude it:
   ```
   database/dog_kennel.db
   ```
2. Provide an Initialization Script: Include an init.sql file (already provided in scripts folder) to allow others to set up their database easily.


