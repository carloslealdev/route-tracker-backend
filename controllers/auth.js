import express from "express";
import User from "../models/User.js";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import generateJWT from "../helpers/jwt.js";

const createUser = async (req = express.request, res = express.response) => {
  //Extraigo los valores del body de la request
  //identityCard => como valor unico de cada trabajador
  //name => para el JWT
  //password para el hash
  const { identityCard, fullName, password } = req.body;

  try {
    //Verificamos si existe algún usuario con el identityCard
    let user = await User.findOne({ identityCard });

    if (user) {
      return res.status(409).json({
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
    const token = await generateJWT(user.id, user.fullName);

    //Guardo el user
    await user.save();

    //Devuelvo la respuesta
    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.fullName,
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
    //Chequear que el usuaario con identityCard existe en la base de datos
    let user = await User.findOne({ identityCard });

    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "No existen usuarios registrados con estas credenciales",
      });
    }

    //Comparar la contraseña que se ingresa contra el hash en la base de de datos
    const validPassword = compareSync(password, user.password);

    // Si existe y la constraseña es valida creamos el token y devolvemos la informacion del usuario
    if (!validPassword) {
      return res.status(401).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    //Generamos el JWT
    const token = await generateJWT(user.id, user.fullName);

    //Devolvemos la respuesta
    res.status(200).json({
      ok: true,
      uid: user.id,
      name: user.fullName,
      email: user.email,
      identityCard: user.identityCard,
      phone: user.phone,
      address: user.address,
      role: user.role,
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

const getAllUsersInfo = async (req, res) => {
  try {
    const usersWithRoutes = await User.aggregate([
      // 1. Buscamos solo los que tienen rol 'Worker' (opcional)
      // { $match: { role: "Worker" } },

      // 2. Hacemos un "join" con la colección de rutagramas
      {
        $lookup: {
          from: "routegrams", // Nombre de la colección en MongoDB (suele ser en plural)
          localField: "_id", // Campo del Usuario
          foreignField: "workerId", // Campo en el Rutagrama que referencia al ID del usuario
          as: "routegrams", // Nombre del nuevo array que se creará en el resultado
        },
      },

      // 3. Proyectamos solo lo que necesitamos (Seguridad: no enviar password)
      {
        $project: {
          password: 0,
          __v: 0,
          "routegrams.location": 0, // Opcional: ocultamos las coordenadas pesadas para la lista general
          "routegrams.__v": 0,
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      users: usersWithRoutes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Error al obtener usuarios" });
  }
};

const revalidateJWT = async (req = express.request, res = express.res) => {
  const uid = req.uid;
  const { fullName, role } = req.user;

  const token = await generateJWT(uid, fullName);

  res.json({
    ok: true,
    uid,
    name: fullName,
    role,
    token,
  });
};

export { createUser, loginUser, getAllUsersInfo, revalidateJWT };
