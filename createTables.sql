CREATE DATABASE IF NOT EXISTS quest;
USE quest;

CREATE TABLE user (
    id INT AUTO_INCREMENT NOT NULL,
    username VARCHAR(25) NOT NULL,
    email VARCHAR(50) NOT NULL,
    passwd VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE(username),
    UNIQUE(email)
);


CREATE TABLE rooms (
    id INT AUTO_INCREMENT NOT NULL,
    label VARCHAR(25) NOT NULL,
    descr VARCHAR(200) NOT NULL,
    passwd VARCHAR(100),
    ownerid INT NOT NULL,
    available BOOLEAN NOT NULL,
    capacity INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(ownerid)
        REFERENCES user(id)
);