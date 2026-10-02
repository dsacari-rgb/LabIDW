const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;
const server = http.createServer((req, res) => {
    console.log(`Petición recibida: ${req.method} ${req.url}`);

    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    
    const ext = path.extname(filePath);
    let contentType = 'text/html; charset=utf-8';

    if (ext === '.css') {
        contentType = 'text/css';
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Recurso no encontrado' }));
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});