import { response } from "express";
import User from "../models/User.js";
import Routegram from "../models/Routegram.js";

const getDashboardStats = async (req, res = response) => {
  try {
    // Promise.all ejecuta todo al mismo tiempo.
    // Si una tarda 100ms y otra 200ms, el total será 200ms, no 300ms.
    const [
      totalEmployees,
      totalRoutegrams,
      longestRoute,
      shortestRoute,
      distanceRangeGraph,
    ] = await Promise.all([
      // 1. Total Empleados
      User.countDocuments({ role: { $ne: "Admin" } }), // Opcional: Excluir admins

      // 2. Total Rutagramas
      Routegram.countDocuments(),

      // 3. Rutagrama más largo (Ordenamos descendente por distancia y tomamos 1)
      Routegram.findOne()
        .sort({ distance: -1 })
        .select("name distance duration typeRoute"),

      // 4. Rutagrama más corto (Ordenamos ascendente por distancia y tomamos 1)
      Routegram.findOne()
        .sort({ distance: 1 })
        .select("name distance duration typeRoute"),

      //5. Estadísticas para la gráfica
      // Gráfica: Distribución de empleados por distancia (Casa-Trabajo)
      Routegram.aggregate([
        {
          // 1. Filtramos solo rutas de ida para no duplicar data
          $match: { typeRoute: "Casa-Trabajo" && "Trabajo-Casa" },
        },
        {
          // 2. Clasificamos en rangos (Buckets)
          $bucket: {
            groupBy: "$distance", // Campo a evaluar (en metros)
            boundaries: [0, 5000, 10000, 20000, 30000, 40000, 50000], // Cortes: 0-5km, 5-10km, 10-20km, 20-50km
            default: "Mas de 50km", // Para los que superen el último limite
            output: {
              count: { $sum: 1 },
            },
          },
        },
        {
          // 3. Formateamos para el frontend
          $project: {
            _id: 0,
            range: {
              $switch: {
                branches: [
                  { case: { $eq: ["$_id", 0] }, then: "0-5 km" },
                  { case: { $eq: ["$_id", 5000] }, then: "5-10 km" },
                  { case: { $eq: ["$_id", 10000] }, then: "10-20 km" },
                  { case: { $eq: ["$_id", 20000] }, then: "20-30 km" },
                  { case: { $eq: ["$_id", 30000] }, then: "30-40 km" },
                  { case: { $eq: ["$_id", 40000] }, then: "40-50 km" },
                  { case: { $eq: ["$_id", 50000] }, then: "50-60 km" },
                ],
                default: "Extremo (+60km)",
              },
            },
            trabajadores: "$count",
          },
        },
      ]),
    ]);

    res.json({
      ok: true,
      stats: {
        totalEmployees,
        totalRoutegrams,
        longestRoute: longestRoute || null, // Manejo por si no hay rutas aun
        shortestRoute: shortestRoute || null,
        distanceRangeGraph,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Error al cargar estadísticas" });
  }
};

export { getDashboardStats };
