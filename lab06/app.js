const express = require('express');
const cursoRoutes = require('./routes/cursoRoutes');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use((req, res, next) => {
    const inicio = Date.now();
    res.on('finish', () => {
        const duracion = Date.now() - inicio;
        console.log(`[${new Date().toISOString()}] ${req.method} en ${req.originalUrl} - Respondió en ${duracion}ms`);
    });
    next();
});

app.use('/api/cursos', cursoRoutes);
app.get('/api/error-test', (req, res, next) => {
    const error = new Error('Error simulado en el servidor');
    error.statusCode = 500;
    next(error);
});

app.use((err, req, res, next) => {
    console.error('ERROR capturado:', err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Error interno del servidor'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});