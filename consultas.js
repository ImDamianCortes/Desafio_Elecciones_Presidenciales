const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'elecciones',
    password: '123456',
    port: 5432
});

//guardar candidatos
const guardarCandidato = async (candidato) => {
    const values = Object.values(candidato);
    const consulta = {
        text: `INSERT INTO candidatos (nombre, foto, color, votos) VALUES ($1, $2, $3, 0) RETURNING *`,
        values: values
    }
    const result = await pool.query(consulta);
    return result;

}
//obtener candidatos
const getCandidatos = async () => {
    const consulta = {
        text: `SELECT * FROM candidatos`
    }
    const result = await pool.query(consulta);
    return result.rows;
}
//editando candidatos
const editCandidato = async (candidato) => {
    const values = Object.values(candidato);
    const consulta = {
        text: `UPDATE candidatos SET nombre = $1, foto=$2 WHERE id=$3 RETURNING *`,
        values: values
    }
    const result = await pool.query(consulta);
    return result;
}
//eliminar candidatos
const eliminarCandidatos = async (id) => {
    console.log(id);
    const consulta = {
        text: `DELETE FROM candidatos WHERE id = ${id}`
    }
    const result = await pool.query(consulta);
    return result.rows;
}
//agregar votos
const registrarVotos = async (voto) => {
    const values = Object.values(voto);
    //console.log(values);

    const registrarVotoHistorial = {
        text: `INSERT INTO historial (estado, votos, ganador) VALUES ($1, $2, $3)`,
        values,
    };

    const registrarVotoCandidato = {
        text: "UPDATE candidatos SET votos = votos + $1 WHERE nombre = $2",
        values: [Number(values[1]), values[2]],
    };

    try{
        await pool.query('BEGIN');
        await pool.query(registrarVotoHistorial);
        await pool.query(registrarVotoCandidato);
        await pool.query('COMMIT');
        return true;
    }catch(err){
        await pool.query('ROLLBACK');
        throw err;
    }

}
//obtener historial
const getHistorial = async () => {
    const consulta = {
        text: `SELECT * FROM historial`,
        rowMode: 'array'
    }
    const result = await pool.query(consulta);
    return result.rows;
}

module.exports = { guardarCandidato , getCandidatos, editCandidato, eliminarCandidatos, registrarVotos, getHistorial};

