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
/* table for mood graph*/
CREATE TABLE IF NOT EXISTS moods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day VARCHAR(10) NOT NULL,
    mood INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
/* table for journal*/
CREATE TABLE IF NOT EXISTS journal(
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  day VARCHAR(10) NOT NULL,
  entry TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);