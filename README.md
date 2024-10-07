# Csv-DBI
CSV-DBI 📊🔌
CSV Database Injector is a Node.js-based tool designed to help users quickly and efficiently insert CSV data into a database! 🚀

Purpose
This application simplifies the process of handling large volumes of CSV data by automating the insertion into a database without hassle. Simply upload your CSV file, map the columns, and let the tool handle the rest! 🎉

Key Features:
📂 CSV Upload: Choose the CSV file you want to insert into the database.
🗄️ Database Connection: Supports multiple databases such as MySQL, PostgreSQL, SQLite, and more.
🔄 Column Mapping: Map your CSV columns to the appropriate database fields effortlessly.
🚦 Data Validation: Automatically checks the data format before inserting it into the database.
⚙️ Customization: Allows you to configure custom insertion rules, such as skipping duplicate rows or handling null values.
How It Works
This application is built using Node.js and relies on the popular csv-parser dependency to parse CSV files.

Prerequisites
To run this application, you need to have the following installed on your machine:

Node.js (version 14 or higher)
A database of your choice (MySQL, PostgreSQL, SQLite, etc.)
Getting Started
Clone the Repository:

bash
Copiar código
git clone https://github.com/your-username/csv-dbi.git
cd csv-dbi
Install Dependencies: This project requires some dependencies like csv-parser for CSV file processing and database libraries such as mysql2 or pg depending on the database you want to use.

Run the following command to install the dependencies:

bash
Copiar código
npm install
Set Up Database Connection: Configure your database connection settings in the .env file. This may include your database host, user, password, and database name.

Example for MySQL:

bash
Copiar código
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=mydatabase
Run the Application: Once everything is set up, you can run the application with the following command:

bash
Copiar código
npm start
The application will prompt you to upload a CSV file, map the columns, and then proceed to insert the data into the specified database.

Example Usage
Once the app is running, you'll be able to:

📥 Upload a CSV file.
🗄️ Map the CSV columns to your database table fields.
🚀 Insert the data into the database with a click of a button!
Dependencies
Node.js: The runtime environment for the application.
csv-parser: A fast and lightweight CSV parsing library used to process CSV files.
Database Libraries: Install the necessary library depending on your database (e.g., mysql2 for MySQL, pg for PostgreSQL).
Conclusion
This application makes inserting large CSV datasets into databases a breeze! With a simple setup, you can automate data migration in just a few steps. 😊
