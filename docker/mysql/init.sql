CREATE DATABASE IF NOT EXISTS taxitech;

USE taxitech;


CREATE TABLE IF NOT EXISTS rides (
    ride_id INT AUTO_INCREMENT PRIMARY KEY,
    started_at DATETIME NOT NULL,
    finished_at DATETIME NOT NULL,
    stopped_time DECIMAL(10,3) NOT NULL,
    moving_time DECIMAL(10,3) NOT NULL,
    stopped_cost DECIMAL(10,4) NOT NULL,
    moving_cost DECIMAL(10,4) NOT NULL,
    total DECIMAL(10,4) NOT NULL
);


CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'operator',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);