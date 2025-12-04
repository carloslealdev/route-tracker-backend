/*Rutas de rutagramas
host + api/routegrams
*/

import { Router } from "express";
import {
  createRoutegram,
  getAllRoutegrams,
  getMyRoutegrams,
  getRoutegramsByWorkerId,
} from "../controllers/routegrams.js";
import protect from "../middlewares/protect.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const routegramsRouter = Router();

//TODO: realizar vvalidaciones en las rutas con express validator
//Crar y guardar rutagrama
routegramsRouter.post("/", protect, createRoutegram);

//Obtener rutagramas del usuario logueado
routegramsRouter.get("/my-routegrams", protect, getMyRoutegrams);

//Obtener todos los rutagramas (Admin)
routegramsRouter.get("/", [protect, adminOnly], getAllRoutegrams);

//Obtener rutagramas por workerId (Admin)
routegramsRouter.get(
  "/:workerId",
  [protect, adminOnly],
  getRoutegramsByWorkerId
);

export default routegramsRouter;
