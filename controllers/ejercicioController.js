
// Importar el servicio necesario para la consulta
const { listarEjercicioPorGrupoMuscular } = require('../services/ejercicioService');


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