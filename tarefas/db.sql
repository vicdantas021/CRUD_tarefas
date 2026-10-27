CREATE DATABASE biblioteca;
USE biblioteca;

CREATE TABLE livro(
id INT PRIMARY KEY AUTO_INCREMENT,
titulo VARCHAR(100),
descricao TEXT,
autor VARCHAR (150)
);
