/*Rutas de autenticación
host + api/auth
*/

import { Router } from "express";
import { createUser } from "../controllers/auth.js";

const authRouter = Router();

authRouter.post("/new", createUser);

export default authRouter;
