// Importar el servicio necesario para la consulta
const { listarRutinaByIdAtleta, listarRutinaByIdCreador,
    listarRutinasFree, crearRutinaYAsignarAtleta,
    editarRutinaYAsignarAtleta, eliminarRutinaConRelaciones,
    listarRutinaByIdRutina,
    listarRutinasByIdAtleta,
    buscarRutinasByFiltro
} = require('../services/rutinaService');

exports.obtenerRutinaByIdAtleta = async (req, res) => {
    const { id_atleta } = req.body;

    if (!id_atleta) {

        return res.status(400).json({ message: 'El id_atleta es obligatorio' });
    }

    try {

        const resultados = await listarRutinasByIdAtleta(id_atleta);

        if (resultados && resultados.length > 0) {

            return res.json(
                resultados
            );
        } else {

            return res.status(404).json({ message: 'No se encontraron rutinas para este atleta' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

exports.filtrarRutinas = async (req, res) => {
    // Extraer los filtros del cuerpo de la solicitud
    const {
        nombre = '',
        fechaDesde = null,
        fechaHasta = null,
        objetivo = '',
        nivelAtleta = '',
        cantidadDias = '',
        idCreador = null
    } = req.body;

    // Validar que al menos un filtro esté presente
    if (
        !nombre &&
        !fechaDesde &&
        !fechaHasta &&
        !objetivo &&
        !nivelAtleta &&
        !cantidadDias &&
        !idCreador
    ) {
        return res.status(400).json({ message: 'Debe proporcionar al menos un criterio de búsqueda' });
    }

    try {
        // Llamar al servicio para buscar las rutinas con los filtros proporcionados
        const resultados = await buscarRutinasByFiltro({
            nombre,
            fechaDesde,
            fechaHasta,
            objetivo,
            nivelAtleta,
            cantidadDias,
            idCreador,
        });

        // Si no se encuentran resultados, devolver un mensaje adecuado
        if (resultados.length === 0) {
            return res.status(404).json({ message: 'No se encontraron rutinas con los criterios proporcionados' });
        }

        // Devolver las rutinas encontradas
        return res.json(resultados);
    } catch (error) {
        // Manejar errores y devolver una respuesta de error
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

exports.obtenerRutinaByIdCreador = async (req, res) => {
    const { id_persona } = req.body;

    if (!id_persona) {

        return res.status(400).json({ message: 'El id_persona es obligatorio' });
    }

    try {

        const resultados = await listarRutinaByIdCreador(id_persona);

        if (resultados && resultados.length > 0) {

            return res.json({
                rutinas: resultados
            });
        } else {

            return res.status(404).json({ message: 'No se encontraron rutinas para esta persona' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

exports.obtenerRutinaByIdRutina = async (req, res) => {
    const { id_rutina } = req.body;

    if (!id_rutina) {

        return res.status(400).json({ message: 'El id_rutina es obligatorio' });
    }

    try {

        const resultados = await listarRutinaByIdRutina(id_rutina);

        if (resultados) {

            return res.json(resultados
            );
        } else {

            return res.status(404).json({ message: 'No se encontraron rutinas para ese id' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos', error: error.message });
    }
};

exports.obtenerRutinasFree = async (req, res) => {

    try {
        const resultados = await listarRutinasFree();

        if (resultados && resultados.length > 0) {

            return res.json({ rutinas: resultados });
        } else {
            return res.status(404).json({ message: 'Rutinas no encontrados' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
};


exports.crearRutinaYAsignarAtleta = async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { rutina, ejercicios } = req.body;
        console.log(rutina, ejercicios);

        // Validación de los parámetros recibidos
        if (!rutina || !ejercicios) {
            return res.status(400).json({ message: 'Faltan parámetros requeridos' });
        }

        // Llamar al servicio que crea la rutina y asigna los datos
        const resultado = await crearRutinaYAsignarAtleta(rutina, ejercicios);

        // Si la operación es exitosa, devolver el mensaje de éxito
        return res.status(201).json(resultado);
    } catch (error) {
        // Si hay un error, mostrar el mensaje de error
        console.error('Error al crear la rutina:', error);
        return res.status(500).json({ message: 'Error al crear la rutina y asignar al atleta' });
    }
};


exports.editarRutinaYAsignarAtleta = async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { id_rutina, rutina, ejercicios, fecha_asignacion } = req.body;

        // Validación de los parámetros recibidos
        if (!id_rutina || !rutina || !ejercicios || !fecha_asignacion) {
            return res.status(400).json({ message: 'Faltan parámetros requeridos' });
        }

        // Llamar al servicio que edita la rutina y asigna los datos
        const resultado = await editarRutinaYAsignarAtleta(
            id_rutina,
            rutina,
            ejercicios,
            fecha_asignacion
        );

        // Si la operación es exitosa, devolver el mensaje de éxito
        return res.status(200).json(resultado);
    } catch (error) {
        // Si hay un error, mostrar el mensaje de error
        console.error('Error al editar la rutina:', error);
        return res.status(500).json({ message: 'Error al editar la rutina y asignar al atleta' });
    }
};

exports.eliminarRutina = async (req, res) => {
    try {
        const { id_rutina } = req.body;

        // Validar que se envíe el id_rutina en el cuerpo
        if (!id_rutina) {
            return res.status(400).json({ message: 'El ID de la rutina es requerido en el cuerpo de la solicitud' });
        }

        // Llamar al servicio para eliminar la rutina y sus relaciones
        const resultado = await eliminarRutinaConRelaciones(id_rutina);
        return res.status(200).json({ message: resultado });
    } catch (error) {
        console.error('Error al eliminar la rutina:', error);
        return res.status(500).json({ message: 'Error al eliminar la rutina y sus relaciones' });
    }
};



// {
//     rutina: {
//         id_creador: 1,
//         nombre: "Fuerza y Resistencia",
//         cantidad_dias: 4,
//         nivel_atleta: "Intermedio",
//         objetivo: "Ganar masa muscular",
//         descripcion: "Rutina enfocada en hipertrofia con ejercicios compuestos y aislados.",
//         id_atleta: 10,
//         fecha_asignacion: "2025-02-16"
//     },
//     ejercicios: [
//         {
//             dia: 1,
//             ejercicios: [
//                 { id_grupo_muscular: 1, id_ejercicio: 101, id_repeticion: 3 },
//                 { id_grupo_muscular: 2, id_ejercicio: 102, id_repeticion: 4 }
//             ]
//         },
//         {
//             dia: 2,
//             ejercicios: [
//                 { id_grupo_muscular: 3, id_ejercicio: 201, id_repeticion: 3 },
//                 { id_grupo_muscular: 4, id_ejercicio: 202, id_repeticion: 4 }
//             ]
//         },
//         {
//             dia: 3,
//             ejercicios: [
//                 { id_grupo_muscular: 1, id_ejercicio: 103, id_repeticion: 3 },
//                 { id_grupo_muscular: 2, id_ejercicio: 104, id_repeticion: 4 }
//             ]
//         },
//         {
//             dia: 4,
//             ejercicios: [
//                 { id_grupo_muscular: 3, id_ejercicio: 203, id_repeticion: 3 },
//                 { id_grupo_muscular: 4, id_ejercicio: 204, id_repeticion: 4 }
//             ]
//         }
//     ]
// }
