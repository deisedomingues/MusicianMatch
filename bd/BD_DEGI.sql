CREATE DATABASE IF NOT EXISTS Musician_Match;
USE Musician_Match;

CREATE TABLE Usuario (
    cpf VARCHAR(11) PRIMARY KEY,      
    nome VARCHAR(100) NOT NULL,   
    email VARCHAR(100) NOT NULL UNIQUE, 
    senha VARCHAR(100) NOT NULL,
    telefone VARCHAR(15),
    tipo ENUM('comum', 'musico') NOT NULL
);

CREATE TABLE Musico (
    cpf_usuario VARCHAR(11) PRIMARY KEY,
    instrumentos TEXT,
    avaliacao DECIMAL(3, 2),
    localizacao VARCHAR(255), 
    descricao TEXT,
    FOREIGN KEY (cpf_usuario) REFERENCES Usuario(cpf)
);

CREATE TABLE Disponibilidade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpf_musico VARCHAR(11),
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    FOREIGN KEY (cpf_musico) REFERENCES Musico(cpf_usuario)
);

CREATE TABLE Contratacao (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    cpf_contratante VARCHAR(11),
    cpf_musico VARCHAR(11), 
    data DATE NOT NULL,                
    horario TIME NOT NULL,
    localizacao VARCHAR(255),
    FOREIGN KEY (cpf_contratante) REFERENCES Usuario(cpf),
    FOREIGN KEY (cpf_musico) REFERENCES Musico(cpf_usuario)
);

CREATE TABLE Instrumento (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nome VARCHAR(100) NOT NULL,
    cpf_musico VARCHAR(11),
    FOREIGN KEY (cpf_musico) REFERENCES Musico(cpf_usuario)
);


