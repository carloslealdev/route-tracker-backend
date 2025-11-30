/*Rutas de rutagramas
host + api/routegrams
*/

import { Router } from "express";
import { createRoutegram } from "../controllers/routegrams.js";
import protect from "../middlewares/protect.js";

const routegramsRouter = Router();

routegramsRouter.post("/", protect, createRoutegram);

export default routegramsRouter;
