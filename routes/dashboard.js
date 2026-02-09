/*Rutas de dashboard
host + api/dashboard
*/

import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.js";
import protect from "../middlewares/protect.js";
import { adminOnly } from "../middlewares/adminOnly.js";
import validateJWT from "../middlewares/validateJWT.js";

const dashboardRouter = Router();

//Todas las rutas usan validación de JWT
dashboardRouter.use(validateJWT);

//Obtener estadísticas para los indicadores del dashboard (Admin)
dashboardRouter.get("/", [protect, adminOnly], getDashboardStats);

export default dashboardRouter;
