/*Rutas de autenticación
host + api/auth
*/

import { Router } from "express";
import {
  createUser,
  getAllUsersInfo,
  loginUser,
  revalidateJWT,
} from "../controllers/auth.js";
import { check } from "express-validator";
import validateFields from "../middlewares/validateFields.js";
import validateJWT from "../middlewares/validateJWT.js";
import protect from "../middlewares/protect.js";

const authRouter = Router();

//TODO: Implementar validaciones con express-validator en todas las rutas
//Crear usuario
authRouter.post(
  "/new",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe tener al menos 6 caracteres").isLength({
      min: 6,
    }),
    check("identityCard", "El documento de identidad es obligatorio")
      .not()
      .isEmpty(),
    validateFields,
  ],
  createUser
);

//Login usuario
authRouter.post(
  "/",
  [
    check("password", "El password debe tener al menos 6 caracteres").isLength({
      min: 6,
    }),
    check("identityCard", "El documento de identidad es obligatorio")
      .not()
      .isEmpty(),

    validateFields,
  ],
  loginUser
);

//Obtener todos los usuarios
authRouter.get("/all", [protect, validateJWT], getAllUsersInfo);

//Renovar JWT
authRouter.get("/renew", [protect, validateJWT], revalidateJWT);

export default authRouter;
