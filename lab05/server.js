const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;
const server = http.createServer((req, res) => {
    console.log(`Petición recibida: ${req.method} ${req.url}`);

    if (req.url === '/api/estudiantes' && req.method === 'GET') {
        const dataPath = path.join(__dirname, 'data', 'estudiantes.json');
        
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error al leer la base de datos' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
        return;
    }

    if (req.url === '/api/estudiantes' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const nuevoEstudiante = JSON.parse(body);
                const dataPath = path.join(__dirname, 'data', 'estudiantes.json');

                fs.readFile(dataPath, 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'Error al leer la base de datos' }));
                    }
                    const estudiantes = JSON.parse(data);
                    nuevoEstudiante.id = estudiantes.length > 0 ? estudiantes[estudiantes.length - 1].id + 1 : 1;
                    estudiantes.push(nuevoEstudiante);
                    fs.writeFile(dataPath, JSON.stringify(estudiantes, null, 2), (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ message: 'Error al guardar el estudiante' }));
                        }
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(nuevoEstudiante));
                    });
                });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Formato JSON inválido' }));
            }
        });
        return;
    }
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    let contentType = 'text/html; charset=utf-8';
    if (ext === '.css') {
        contentType = 'text/css';
    }
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Recurso no encontrado' }));
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});