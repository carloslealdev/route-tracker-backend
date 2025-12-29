/*Rutas de rutagramas
host + api/routegrams
*/

import { Router } from "express";
import {
  createRoutegram,
  deleteRoutegram,
  getAllRoutegrams,
  getMyRoutegrams,
  getRoutegramsByWorkerId,
  updateRoutegram,
} from "../controllers/routegrams.js";
import protect from "../middlewares/protect.js";
import { adminOnly } from "../middlewares/adminOnly.js";
import validateJWT from "../middlewares/validateJWT.js";

const routegramsRouter = Router();

//Todas las rutas deben utilizar este middleware para validar el JWT
routegramsRouter.use(validateJWT);

//TODO: realizar vvalidaciones en las rutas con express validator
//Crar y guardar rutagrama
routegramsRouter.post("/", protect, createRoutegram);

//Actualizar rutagrama
routegramsRouter.put("/:id", protect, updateRoutegram);

//Eliminar rutagrama
routegramsRouter.delete("/:id", protect, deleteRoutegram);

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
