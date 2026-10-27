CREATE DATABASE tarefas_db;
USE tarefas_db;

CREATE TABLE tarefas(
id INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(100) NOT NULL,
descricao TEXT (100) NOT NULL,
responsavel VARCHAR(100) NOT NULL,
data_tarefa INT NOT NULL,
concluido BOOLEAN NOT NULL
);
