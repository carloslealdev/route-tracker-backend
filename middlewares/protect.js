import { request, response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req = request, res = response, next) => {
  //Verifico si hay token en la petición y si es valido
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No existe token en la petición",
    });
  }

  //Extraigo el uid del token
  const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);
  //   console.log(uid);

  //Consulto a la base de datos el user con este uid con la finalidad de extraer el rol (worker o admin)
  let user = await User.findOne({ _id: uid });
  //   console.log(user);

  if (!user) {
    return res.status(404).json({
      ok: false,
      msg: "El usuario fue eliminado",
    });
  }

  //Inyecto el user en la request
  req.user = user;

  next();
};

export default protect;
