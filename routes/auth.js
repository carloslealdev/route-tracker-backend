/*Rutas de autenticación
host + api/auth
*/

import { Router } from "express";
import { createUser, loginUser } from "../controllers/auth.js";

const authRouter = Router();

//TODO: Implementar validaciones con express-validator en todas las rutas
authRouter.post("/new", createUser);

authRouter.post("/", loginUser);

export default authRouter;
