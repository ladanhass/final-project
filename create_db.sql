/*ensure database exists */
CREATE DATABASE IF NOT EXISTS havenmind;
USE havenmind;

/* table for registering users and login*/
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashedPassword TEXT NOT NULL
);