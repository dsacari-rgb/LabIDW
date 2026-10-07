const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/cursos.json');
const leerCursos = () => {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const guardarCursos = (cursos) => {
    fs.writeFileSync(dataPath, JSON.stringify(cursos, null, 2), 'utf8');};
exports.obtenerCursos = (req, res, next) => {
    try {
        let cursos = leerCursos();
        const { creditos } = req.query;
        if (creditos) {
            cursos = cursos.filter(c => c.creditos === parseInt(creditos));}
        res.status(200).json({
            status: 'success',
            results: cursos.length,
            data: cursos
        });
    } catch (error) {
        next(error);}
};

exports.obtenerCursoPorId = (req, res, next) => {
    try {
        const cursos = leerCursos();
        const id = parseInt(req.params.id);
        const curso = cursos.find(c => c.id === id);
        if (!curso) {
            return res.status(404).json({
                status: 'fail',
                message: `No se encontró ningún curso con el ID ${id}`
            });
        }
        res.status(200).json({
            status: 'success',
            data: curso
        });
    } catch (error) {
        next(error);}
};

exports.crearCurso = (req, res, next) => {
    try {
        const { nombre, codigo, creditos } = req.body;
        if (!nombre || !codigo || creditos === undefined) {
            return res.status(400).json({
                status: 'fail',
                message: 'Faltan campos obligatorios: nombre, codigo y creditos son requeridos.'
            });
        }
        const cursos = leerCursos();
        const nuevoId = cursos.length > 0 ? cursos[cursos.length - 1].id + 1 : 1;
        const nuevoCurso = {
            id: nuevoId,
            nombre,
            codigo,
            creditos: parseInt(creditos)
        };
        cursos.push(nuevoCurso);
        guardarCursos(cursos);
        res.status(201).json({
            status: 'success',
            data: nuevoCurso
        });
    } catch (error) {
        next(error);}
};

exports.actualizarCurso = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { nombre, codigo, creditos } = req.body;
        const cursos = leerCursos();
        const index = cursos.findIndex(c => c.id === id);
        if (index === -1) {
            return res.status(404).json({
                status: 'fail',
                message: `No se encontró el curso con ID ${id} para actualizar.`
            });
        }
        cursos[index] = {
            ...cursos[index],
            nombre: nombre || cursos[index].nombre,
            codigo: codigo || cursos[index].codigo,
            creditos: creditos !== undefined ? parseInt(creditos) : cursos[index].creditos
        };
        guardarCursos(cursos);
        res.status(200).json({
            status: 'success',
            data: cursos[index]
        });
    } catch (error) {
        next(error);}
};

exports.eliminarCurso = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        let cursos = leerCursos();
        const cursoExistente = cursos.find(c => c.id === id);
        if (!cursoExistente) {
            return res.status(404).json({
                status: 'fail',
                message: `No se encontró el curso con ID ${id} para eliminar.`
            });
        }
        cursos = cursos.filter(c => c.id !== id);
        guardarCursos(cursos);
        res.status(200).json({
            status: 'success',
            message: `Curso con ID ${id} eliminado correctamente.`
        });
    } catch (error) {
        next(error);}
};