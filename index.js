//Importando paquetes
const http = require('http');
const fs = require('fs');
const url = require('url');

//
const { guardarCandidato, getCandidatos, editCandidato, eliminarCandidatos} = require('./consultas');
const { registrarVotos, getHistorial } = require('./consultas');

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

//Creando servidor
http.createServer(async (req, res) => {

    //Obteniendo la url
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    //ruta raiz
    if (req.url == '/' && req.method == 'GET') {

        //Leer el archivo index.html
        fs.readFile('index.html', (err, data) => {
            //Si hay un error
            if (err) {
                res.writeHead(404);
                res.end('File not found');
            }
            //Si no hay error
            else {
                res.setHeader('Content-Type', 'text/html');
                //Enviar el archivo index.html
                res.end(data);
            }
        });
    }

    //ruta registro de candidatos
    if (req.url == '/candidato' && req.method == 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const candidato = JSON.parse(body);
            try {
                const result = await guardarCandidato(candidato);
                res.statusCode = 201;
                res.end(JSON.stringify(result));
            } catch (err) {
                res.statusCode = 500;
                res.end('Error al guardar el candidato', err);
            }
        })

    }

    //ruta para obtener los candidatos
    if (req.url == '/candidatos' && req.method == 'GET') {
        try {
            const candidatos = await getCandidatos();
            res.statusCode = 200;
            res.end(JSON.stringify(candidatos));
        } catch (err) {
            res.statusCode = 500;
            res.end('Error al obtener los candidatos', err);
        }
    }
    //ruta para editar candidatos
    if (req.url == '/candidato' && req.method == 'PUT') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const candidato = JSON.parse(body);
            try {
                const result = await editCandidato(candidato);
                res.statusCode = 201;
                res.end(JSON.stringify(result));
            } catch (err) {
                res.statusCode = 500;
                res.end('Error al guardar el candidato', err);
            }
        })

    }
    //ruta para eliminar candidatos
    if (req.url.startsWith('/candidato?id') && req.method == 'DELETE') {
        try {
            let { id } = url.parse(req.url, true).query;
            await eliminarCandidatos(id);
            res.statusCode = 200;
            res.end("Candidato eliminado");
        } catch (err) {
            res.statusCode = 500;
            res.end('Error al obtener los candidatos', err);
        }
    }
    //ruta para registrar votos
    if (req.url == '/votos' && req.method == 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const voto = JSON.parse(body);
                const result = await registrarVotos(voto);
                res.statusCode = 201;
                res.end(JSON.stringify(result));
            } catch (err) {
                res.statusCode = 500;
                res.end('Ocurrio un problema en el servidor', err);
            }
        })

    }
    //ruta para obtener los votos
    if (req.url == '/historial' && req.method == 'GET') {
        try {
            const historial = await getHistorial();
            res.statusCode = 200;
            res.end(JSON.stringify(historial));
        } catch (err) {
            res.statusCode = 500;
            res.end('Error al obtener los votos', err);
        }
    }

}).listen(`${port}`, () => { console.log(`\nServidor iniciado en el puerto ${port}.\nhttp://${host}:${port}\n`) });