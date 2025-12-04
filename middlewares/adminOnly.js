import { request, response } from "express";

const adminOnly = (req = request, res = response, next) => {
  //Extraigo el role de user que está inyectado en la request gracias al middleware protecy
  const { role } = req.user;

  //Verifico que el rol sea Admin
  if (role !== "Admin") {
    return res.status(401).json({
      ok: false,
      msg: "Usuario no autorizado",
    });
  }

  next();
};

export { adminOnly };
