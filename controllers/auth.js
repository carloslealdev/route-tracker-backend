import express from "express";
import User from "../models/User.js";
import { genSaltSync, hashSync } from "bcryptjs";
import generateJWT from "../helpers/jwt.js";

const createUser = async (req = express.request, res = express.response) => {
  //Extraigo los valores del body de la request
  //identityCard => como valor unico de cada trabajador
  //name => para el JWT
  //password para el hash
  const { identityCard, name, password } = req.body;

  try {
    //Verificamos si existe algún usuario con el identityCard
    let user = await User.findOne({ identityCard });

    if (user) {
      res.status(409).json({
        ok: false,
        msg: "Ya existe un usuario con estas credenciales",
      });
    }

    //Si no existe entonces creamos el usuario con el modelo de mongoose
    user = new User(req.body);

    //Encriptar el password
    //Generamos el salt
    const salt = genSaltSync(10);

    //Hasheamos el password
    user.password = hashSync(password, salt);

    //Generamos el JWT
    const token = await generateJWT(user.id, name);

    //Guardo el user
    await user.save();

    //Devuelvo la respuesta
    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const loginUser = async (req = express.request, res = express.response) => {
  // Extraigo los valores del body de la request para loguear al usuario
  const { identityCard, password } = req.body;

  try {
  } catch (error) {}
};

export { createUser, loginUser };
