
// Importar el servicio necesario para la consulta
const { listarEjercicioPorGrupoMuscular, actualizarEjercicio, eliminarEjercicioPorId, listarEjercicioById } = require('../services/ejercicioService');


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
            return res.json({
                ejercicios: resultados // Retornar los resultados de los atletas
            });
        } else {
            // Si no se encuentran atletas, devolver un mensaje adecuado
            return res.status(404).json({ message: 'No se encontraron ejercicios para este grupo muscular' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};


exports.updateEjercicio = async (req, res) => {
    const { id_ejercicio, id_entrenador, id_grupo_muscular, nombre, img_1, img_2, img_3, descripcion, link_video } = req.body;


    try {
        // Crear objeto del ejercicio con los datos proporcionados
        const ejercicio = { id_ejercicio,id_entrenador, id_grupo_muscular, nombre, img_1, img_2, img_3, descripcion, link_video };

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


exports.deleteEjercicio = async (req, res) => {
    const { id_ejercicio } = req.body;

    if (!id_ejercicio) {
        // Validar que el id_ejercicio sea proporcionado
        return res.status(400).json({ message: 'El id_ejercicio es obligatorio' });
    }

    try {
        // Llamar al servicio para eliminar el ejercicio
        const resultados = await eliminarEjercicioPorId(id_ejercicio);

        if (resultados.affectedRows > 0) {
            // Si se eliminó correctamente, devolver un mensaje de éxito
            return res.json({ message: 'Ejercicio eliminado exitosamente' });
        } else {
            // Si no se eliminó, devolver un mensaje adecuado
            return res.status(404).json({ message: 'No se encontró ejercicio para eliminar' });
        }
    } catch (error) {
        console.error('Error en la eliminación:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};


