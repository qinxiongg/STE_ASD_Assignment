# STE_ASD_Assignment
This web application allows users to upload a CSV file which is parsed and inserted into MySQL database. 
The following functions are implemented into this app:
- Upload CSV file
- Display data uploaded
- Pagination
- Search

# Frameworks/ Tools used
Frontend:
- Svelte
- Axios

Backend:
- TypeORM
- Fastify
- MySQL
- Node.js
- csv-parser
- dotenv

# How to use
1. Download the zip folder and extract.
2. run ```npm install``` at ```backend``` and ```frontend```.
3. Create a MySQL schema and table using the SQL command found in ```backend/database/db.sql```.
4. Change ```DB_USER``` and ```DB_PASSWORD``` value in ```backend/.env``` according to your MySQL user credentials.
