import express from "express";
import jwt from "jsonwebtoken";

const validateJWT = (req = express.request, res = express.response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No existe token en la petición",
    });
  }

  try {
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);

    (req.uid = uid), (req.name = name);
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token inválido",
    });
  }

  next();
};

export default validateJWT;
