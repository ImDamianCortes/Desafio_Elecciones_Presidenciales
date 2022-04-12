CREATE DATABASE elecciones;

CREATE TABLE candidatos (
    id SERIAL,
    nombre VARCHAR(50),
    foto VARCHAR(200),
    color VARCHAR(9),
    votos INT
);

CREATE TABLE historial (
    estado VARCHAR(35) UNIQUE,
    votos INT,
    ganador VARCHAR(40)
);