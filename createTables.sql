CREATE DATABASE IF NOT EXISTS quest;
USE quest;

CREATE TABLE IF NOT EXISTS user(
    id INT AUTO_INCREMENT NOT NULL,
    username VARCHAR(25) NOT NULL,
    email VARCHAR(50) NOT NULL,
    passwd VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE(username),
    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS questionaire(
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(25) NOT NULL,
    ownerid INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(ownerid)
        REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT NOT NULL,
    label VARCHAR(25) NOT NULL,
    descr VARCHAR(200) NOT NULL,
    passwd VARCHAR(100),
    ownerid INT NOT NULL,
    available BOOLEAN NOT NULL,
    capacity INT NOT NULL,
    quest_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(ownerid)
        REFERENCES user(id),
    FOREIGN KEY(quest_id)
        REFERENCES questionaire(id)
);


CREATE TABLE IF NOT EXISTS question(
    questionaire_id INT NOT NULL,
    ord INT NOT NULL,
    quest VARCHAR(100) NOT NULL,
    answers VARCHAR(500) NOT NULL,
    FOREIGN KEY(questionaire_id)
        REFERENCES questionaire(id)
);
DROP TABLE answer;
CREATE TABLE IF NOT EXISTS answer(
    room_id INT NOT NULL,
    answeredby VARCHAR(25) NOT NULL,
    choice INT NOT NULL,
    ord INT NOT NULL,
    FOREIGN KEY(room_id)
        REFERENCES rooms(id)
);