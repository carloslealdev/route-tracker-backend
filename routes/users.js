/*Rutas de usuarios
host + api/users
*/

import { Router } from "express";
import {
  deleteUser,
  getAllUsersInfo,
  getUserById,
  updateUserInfo,
} from "../controllers/users.js";
import protect from "../middlewares/protect.js";
import validateJWT from "../middlewares/validateJWT.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const usersRouter = Router();

//Obtener todos los usuarios
usersRouter.get("/all", [protect, validateJWT, adminOnly], getAllUsersInfo);

//Obtener usuario por Id
usersRouter.get("/:id", [protect, validateJWT, adminOnly], getUserById);

//Eliminar usuario
usersRouter.delete("/:id", [protect, validateJWT, adminOnly], deleteUser);

//Actualizar usuario
usersRouter.put("/:id", [protect, validateJWT, adminOnly], updateUserInfo);

export default usersRouter;
