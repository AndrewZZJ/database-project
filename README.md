# Additional Information

## About This README
This is a slightly modified version of the original project README. It retains the essential information, removes any personal details about my teammates, and adds clarification regarding my individual contributions to the project.

## My Contributions to the Project

### 1. General Project Management
- Organized and led weekly meetings.
- Prepared and distributed weekly meeting minutes.
- Other relating chores.

### 2. Architecture Design
- Designed the high-level architecture and workflow for the web application.
- Defined the core project structure.

### 3. Frontend Implementation
- Developed customer-facing features such as registration, login, ticket purchasing, and booking cancellation.
- Built company-facing features, including viewing customer booking statuses and sending gift cards.
- Implemented RESTful endpoints using the `Express` framework.

### 4. Backend Implementation
- Developed SQL queries (`INSERT`, `UPDATE`, `DELETE`, and part of the complicated ones) using `oracledb`.
- Implemented company-facing backend features, such as managing provided services and handling customer interactions.

### 5. Feature Integration
- Collaborated closely with team members on both frontend and backend tasks.
- Integrated features like instructor management (add, update, delete), retrieving all lesson available, and get the ages of the youngest student of each class.
- Ensured smooth functionality across the entire application.

### 6. Demonstration and Final Setup
- Set up and configured the full project environment.
- Conducted thorough testing to verify feature completeness and stability.


# 🏔️ Course Project- Ski Resort Navigator

## 📌 Group Project  

### 👥 Team Members & Responsibilities  

| Member | Role | Responsibilities |
|--------|------|----------------|
| **JC** | Frontend Developer | Designing & implementing GUI, handling half of frontend features |
| **AL** | Backend Developer | Implementing graph-related features, handling customer features |
| **Andrew** | Fullstack Developer | Building SQL queries, Express backend, and half of frontend features |

## 📜 Project Description  
In this project, we created a **ski resort management system** for the purpose of allowing customers
of a ski resort to search for and locate routes to travel up and down a chosen mountain via lifts and
runs, without having to download or carry a map. The customers will be able to write Review for
runs they have taken, as well as track their purchase history of tickets and lessons at each mountain.

## Features Implemented for Demo Purposes

### ✅ Database Initialization  
1. **Automated Table Creation:** A script that initializes all tables and populates the database with data.

### ✅ CRUD Operations  
2. **INSERT Operation:** Add a new instructor.  
3. **DELETE Operation:** Remove an instructor using their ID.  
4. **UPDATE Operation:** Modify an instructor's email and phone number.  

### ✅ Query Operations  
5. **Selection:** Retrieve all mountains.  
6. **Projection:** Extract only the necessary ticket information for a customer.  
7. **Join:** Retrieve all lessons by joining `Teaches_Lesson`, `Level_Price`, and `Instructor` tables.  

### ✅ Aggregation & Advanced Queries  
8. **Aggregation (GROUP BY):** Group students (customers who purchased lessons) by lesson and find the youngest student.  
9. **Aggregation (HAVING):** Group run scores and filter runs with an average score higher than a given input value.  
10. **Nested Aggregation with GROUP BY:** Identify the run with the highest average score.  
11. **Division:** Retrieve instructors who teach lessons across all difficulty levels.  


## 🛠️ Setup & Installation 
```sh
git clone https://github.students.cs.ubc.ca/CPSC304-2024W-T2/project_d4i7b_p4m3h_w7t6w
cd project_d4i7b_p4m3h_w7t6w
npm install
npm start
```
Remember manually changing the `.env` file for remote server deployment.

## Database Deployment
Follow the instructions from class resource: https://www.students.cs.ubc.ca/~cs-304/resources/javascript-oracle-resources/node-setup.html

## Unit tests 
We didn't finish writing unit tests for features, but we tried to cover a good portion of it.
The prerequisite is to install mocha:

For Mac:
```sh
npm install --save-dev mocha
```
For Windows:
```sh
npm install
```

After connecting to the database, run:
```sh
npm test
```