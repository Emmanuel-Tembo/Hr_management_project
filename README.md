# FullStack HR Management System

A comprehensive HR management system built using Node.js, Vue.js, and MySQL, designed to streamline employee registration, attendance tracking, leave management, payroll processing, and performance review.

## Technologies Used
- Frontend: Vue.js
- Backend: Node.js, Express.js
- Database: MySQL

## Features
- Employee Registration - Add and manage employee profiles using unique employee IDs
- Attendance tracking - Maintain attendance records
- Payroll Management - Automate salary calculations with base and final salary breakdowns
- Performance Reviews - Add, update and manage employee reviews with average rating updates
- Leave Requests - View and manage employee leave apllications
- Authentication - Secure login system with JWT-based session handling

## Installation

1. Git clone the url

```bash
git clone https://github.com/Emmanuel-Tembo/Hr_management_project.git
```
2. Open the fullstack folder and open on Visual Studio Code

3. Install the project 
```bash
cd backend
npm install
npm install -g nodemon
```
```bash
cd frontend
npm install
```

4. Create or adjust .env file to include your details
```bash
PORT = 3030
DB_NAME = hr_data
DB_USER = root
DB_PASSWORD = [insert your password here]
DB_HOST = localhost
JWT_SECRET= [insert your jwt secret here]
```

5. Open MySQL database file in workbench and run it

6. With a split terminal, run backend and frontend
```bash
//backend
nodemon index.js
```
```bash
//frontend
npm run serve
```

## Usage
- Click "Get Started" button
- Register employee id "EMP-700" with desired username and password
- Sign in using registered credentials
- Explore and use the site

## Notes
- Ensure MySQL is running and properly configured before starting the backend
- Initial user registration is limited to employees already on the system: EMP-700 to EMP-709
- Attendance should be manually types in and dates to note are in July 2025 between 23rd and 29th
- Department ID is 101-109.
