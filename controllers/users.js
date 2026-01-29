import express from "express";
import User from "../models/User.js";
import Routegram from "../models/Routegram.js";

const getAllUsersInfo = async (req = express.request, res = express.res) => {
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

const getUserById = async (req = express.request, res = express.res) => {
  const userId = req.params.id;

  try {
    const [user] = await User.aggregate([
      {
        $match: {
          _id: new User.base.mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "routegrams",
          localField: "_id",
          foreignField: "workerId",
          as: "routegrams",
        },
      },
      {
        $project: {
          password: 0,
          __v: 0,
          "routegrams.location": 0,
          "routegrams.__v": 0,
        },
      },
    ]);

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "No existe usuario con este Id",
      });
    }

    res.status(200).json({
      ok: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Error al obtener usuario" });
  }
};

const deleteUser = async (req = express.request, res = express.res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "No existe usuario con este Id",
      });
    }

    await User.findByIdAndDelete(userId);
    await Routegram.deleteMany({ workerId: userId });

    res.status(200).json({
      ok: true,
      msg: "Usuario eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Error al eliminar usuario" });
  }
};

const updateUserInfo = async (req = express.request, res = express.res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "No existe usuario con este Id",
      });
    }

    // await User.findByIdAndUpdate(userId, req.body);
    const userUpdated = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      user: userUpdated,
      msg: "Usuario actualizado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Error al actualizar usuario" });
  }
};

export { getAllUsersInfo, getUserById, deleteUser, updateUserInfo };
