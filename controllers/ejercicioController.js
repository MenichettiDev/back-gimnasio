// Importar el servicio necesario para la consulta
const { listarEjercicioPorGrupoMuscular, actualizarEjercicio, eliminarEjercicioPorId, listarEjercicioById, crearEjercicio } = require('../services/ejercicioService');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const multer = require('multer');

// Añadir configuración para carpeta media (puedes sobrescribir con MEDIA_ROOT env)
const MEDIA_ROOT = process.env.MEDIA_ROOT || path.join(path.sep, 'media');
const EJERCICIOS_BASE = path.join(MEDIA_ROOT, 'Ejercicios');

// Temp upload dir for multer
const tempDir = path.join(__dirname, '..', 'uploads', 'temp');
fsSync.mkdirSync(tempDir, { recursive: true });

// Multer middleware: store temporales en uploads/temp
const upload = multer({ dest: tempDir });

// Exportar middleware para usar en rutas: upload.fields([{name:'img_1'}, ...])
exports.upload = upload.fields([
    { name: 'img_1', maxCount: 1 },
    { name: 'img_2', maxCount: 1 },
    { name: 'img_3', maxCount: 1 }
]);

// Asegurar que la carpeta MEDIA_ROOT y EJERCICIOS_BASE existan (evita errores al mover/leer archivos)
try {
    // fsSync.mkdirSync acepta rutas absolutas como '/media' en Linux
    fsSync.mkdirSync(MEDIA_ROOT, { recursive: true });
    fsSync.mkdirSync(EJERCICIOS_BASE, { recursive: true });
} catch (e) {
    console.warn('No se pudo crear MEDIA_ROOT/Ejercicios en init:', e.message);
}

exports.getEjercicioById = async (req, res) => {
    const { id_ejercicio } = req.body; // Obtener el id_ejercicio desde los parámetros de la solicitud

    if (!id_ejercicio) {
        // Si no se pasa el id_ejercicio, respondemos con un error
        return res.status(400).json({ message: 'El id_ejercicio es obligatorio' });
    }

    try {
        // Llamar al servicio que obtiene el ejercicio por id
        const resultados = await listarEjercicioById(id_ejercicio);

        if (resultados && resultados.length > 0) {
            // Si se encuentra el ejercicio, devolver los datos
            return res.json(
                resultados[0] // Retornar el primer resultado porque es un solo ejercicio
            );
        } else {
            // Si no se encuentra el ejercicio, devolver un mensaje adecuado
            return res.status(404).json({ message: 'No se encontró ejercicio con este ID' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};



exports.getEjercicioPorGrupoMuscular = async (req, res) => {
    const { id_grupo_muscular } = req.body; // Obtener el id_persona del cuerpo de la solicitud (req.body)

    if (!id_grupo_muscular) {
        // Si no se pasa el id_persona, respondemos con un error
        return res.status(400).json({ message: 'El id_grupo_muscular es obligatorio' });
    }

    try {
        // Llamar al servicio que obtiene los atletas por el id_persona
        const resultados = await listarEjercicioPorGrupoMuscular(id_grupo_muscular);

        if (resultados && resultados.length > 0) {
            // Si se encuentran atletas, devolver los datos
            return res.json(resultados);
        } else {
            // Si no se encuentran atletas, devolver un mensaje adecuado
            return res.status(404).json({ message: 'No se encontraron ejercicios para este grupo muscular' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

exports.createEjercicio = async (req, res) => {
    const { id_grupo_muscular, nombre, img_1, img_2, img_3, descripcion, link_video } = req.body;

    try {
        // Crear objeto del nuevo ejercicio con los datos proporcionados
        const nuevoEjercicio = { id_grupo_muscular, nombre, img_1, img_2, img_3, descripcion, link_video };

        // Llamar al servicio para crear el ejercicio
        const insertId = await crearEjercicio(nuevoEjercicio);

        if (insertId) {
            // Si se creó correctamente, devolver un mensaje de éxito junto con el ID generado
            return res.status(201).json({ message: 'Ejercicio creado exitosamente', id: insertId });
        } else {
            // Si no se creó por alguna razón inesperada, devolver un mensaje adecuado
            return res.status(400).json({ message: 'No se pudo crear el ejercicio' });
        }
    } catch (error) {
        console.error('Error al crear el ejercicio:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

exports.deleteEjercicio = async (req, res) => {
    const { id_ejercicio } = req.body;

    if (!id_ejercicio) {
        // Validar que el id_ejercicio sea proporcionado
        return res.status(400).json({ message: 'El id_ejercicio es obligatorio' });
    }

    try {
        // 1) Obtener el registro para conocer id_grupo_muscular y validar existencia
        const registros = await listarEjercicioById(id_ejercicio);
        if (!registros || registros.length === 0) {
            return res.status(404).json({ message: 'No se encontró ejercicio para eliminar' });
        }
        const ejercicio = registros[0];

        // 2) Construir ruta absoluta de la carpeta en MEDIA_ROOT: <MEDIA_ROOT>/Ejercicios/<id_grupo_muscular>/<id_ejercicio>
        const dirEjercicio = path.join(EJERCICIOS_BASE, String(ejercicio.id_grupo_muscular), String(id_ejercicio));

        // 3) Borrar carpeta completa del ejercicio (ignorar si no existe)
        try {
            // fs.rm es más moderno; usar force + recursive para eliminar todo sin fallar si no existe
            if (typeof fs.rm === 'function') {
                await fs.rm(dirEjercicio, { recursive: true, force: true });
            } else {
                // Compatibilidad: usar rmdir (puede estar deprecado en algunas versiones)
                await fs.rmdir(dirEjercicio, { recursive: true }).catch(err => {
                    if (err.code !== 'ENOENT') throw err;
                });
            }
        } catch (err) {
            // No crítico: loguear y continuar con eliminación en BD
            console.warn('No se pudo eliminar la carpeta del ejercicio:', dirEjercicio, err.message);
        }

        // 4) Eliminar registro en la base de datos
        const resultados = await eliminarEjercicioPorId(id_ejercicio);

        if (resultados.affectedRows > 0) {
            return res.json({ message: 'Ejercicio y carpeta asociados eliminados exitosamente' });
        } else {
            return res.status(404).json({ message: 'No se encontró ejercicio para eliminar' });
        }
    } catch (error) {
        console.error('Error en la eliminación:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

// Nuevo handler para crear ejercicio con archivos (multipart/form-data)
exports.createEjercicioWithFiles = async (req, res) => {
    // DEBUG: mostrar lo que llegó
    console.log('Content-Type:', req.headers['content-type']);
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    const { id_grupo_muscular, nombre, descripcion, link_video, id_entrenador } = req.body;

    if (!id_grupo_muscular || !nombre) {
        return res.status(400).json({ message: 'Faltan campos obligatorios: id_grupo_muscular y nombre' });
    }

    // Directorio base público fuera del proyecto (EJERCICIOS_BASE). Puedes cambiar MEDIA_ROOT con la var de entorno.
    const ejerciciosBase = EJERCICIOS_BASE;

    try {
        // Asegurar que la carpeta base exista
        await fs.mkdir(ejerciciosBase, { recursive: true });

        // 1) Insertar registro inicial en la BD sin imágenes
        const nuevoEjercicioParaInsert = {
            id_grupo_muscular,
            nombre,
            img_1: null,
            img_2: null,
            img_3: null,
            descripcion: descripcion || null,
            link_video: link_video || null,
            id_entrenador: id_entrenador || null
        };

        const insertId = await crearEjercicio(nuevoEjercicioParaInsert);
        if (!insertId || typeof insertId !== 'number') throw new Error('No se obtuvo id al insertar ejercicio');

        // 2) Crear carpeta destino: <MEDIA_ROOT>/Ejercicios/<id_grupo_muscular>/<id_ejercicio>/
        const destDir = path.join(ejerciciosBase, String(id_grupo_muscular), String(insertId));
        await fs.mkdir(destDir, { recursive: true });

        // Helper para mover archivo desde temp a destino y devolver ruta pública (URL empieza con /media)
        const moveFileToDest = async (fileObj, targetName) => {
            if (!fileObj || !fileObj[0]) return null;
            const file = fileObj[0];
            const ext = path.extname(file.originalname) || '';
            const finalName = `${targetName}${ext}`;
            const destPath = path.join(destDir, finalName);
            await fs.rename(file.path, destPath); // mover temp -> final
            // devolver ruta accesible por el cliente. Asegúrate de exponer /media como estático en tu app.
            const publicPath = path.posix.join('/media', 'Ejercicios', String(id_grupo_muscular), String(insertId), finalName);
            return publicPath;
        };

        // 3) Mover las imágenes si existen
        const img1Path = await moveFileToDest(req.files?.img_1, 'img_1');
        const img2Path = await moveFileToDest(req.files?.img_2, 'img_2');
        const img3Path = await moveFileToDest(req.files?.img_3, 'img_3');

        // 4) Actualizar registro con las rutas finales de las imágenes
        const ejercicioParaUpdate = {
            id_ejercicio: insertId,
            id_entrenador: id_entrenador || null,
            id_grupo_muscular,
            nombre,
            img_1: img1Path,
            img_2: img2Path,
            img_3: img3Path,
            descripcion: descripcion || null,
            link_video: link_video || null
        };

        const updateResult = await actualizarEjercicio(ejercicioParaUpdate);

        if (updateResult && updateResult.affectedRows === 0) {
            console.warn('Advertencia: no se actualizó el registro de imágenes para id:', insertId);
        }

        return res.status(201).json({
            message: 'Ejercicio creado',
            id: insertId,
            rutas: { img_1: img1Path, img_2: img2Path, img_3: img3Path }
        });
    } catch (error) {
        console.error('Error al crear ejercicio con archivos:', error);

        // Intentar limpiar archivos temporales si quedaron
        try {
            if (req.files) {
                const allFiles = [...(req.files.img_1 || []), ...(req.files.img_2 || []), ...(req.files.img_3 || [])];
                for (const f of allFiles) {
                    try { await fs.unlink(f.path); } catch (e) { /* ignore */ }
                }
            }
        } catch (cleanupErr) {
            console.error('Cleanup error:', cleanupErr);
        }

        return res.status(500).json({ message: 'Error al procesar archivos o la base de datos', error: error.message });
    }
};


exports.updateEjercicio = async (req, res) => {
    const { id_ejercicio, id_entrenador, id_grupo_muscular, nombre, img_1, img_2, img_3, descripcion, link_video } = req.body;


    try {
        // Crear objeto del ejercicio con los datos proporcionados
        const ejercicio = { id_ejercicio, id_entrenador, id_grupo_muscular, nombre, img_1, img_2, img_3, descripcion, link_video };

        // Llamar al servicio para actualizar el ejercicio
        const resultados = await actualizarEjercicio(ejercicio);

        if (resultados.affectedRows > 0) {
            // Si se actualizó correctamente, devolver un mensaje de éxito
            return res.json({ message: 'Ejercicio actualizado exitosamente' });
        } else {
            // Si no se actualizó, devolver un mensaje adecuado
            return res.status(404).json({ message: 'No se encontró ejercicio para actualizar' });
        }
    } catch (error) {
        console.error('Error en la actualización:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

