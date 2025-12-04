import { json, request, response } from "express";
import Routegram from "../models/Routegram.js";
import User from "../models/User.js";

const createRoutegram = async (req = request, res = response) => {
  //Extraigo el id de user que está inyectado en la request gracias al middleware protect
  const { _id } = req.user;

  //Estructuro la data para crear el rutagrama según el modelo de mongoose
  const routegramData = {
    location: req.body,
    workerId: _id,
  };

  //Creo el rutagrama
  try {
    let routegram = new Routegram(routegramData);

    await routegram.save();

    res.status(201).json({
      ok: true,
      routegram: routegram,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor comunicarse con el administrador",
    });
  }
};

const getMyRoutegrams = async (req = request, res = response) => {
  //Extraigo el id de user que está inyectado en la request gracias al middleware protect
  const { _id } = req.user;

  //Busco en la base de dator los rutagramas de ese trabajador
  try {
    const routegrams = await Routegram.find({ workerId: _id });

    res.status(200).json({
      ok: true,
      routegrams: routegrams,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error al cargar rutagramas",
    });
  }
};

//Controller para admins
const getAllRoutegrams = async (req = request, res = response) => {
  //Traigo todas las rutas de la base de datos
  try {
    const routegrams = await Routegram.find({}).populate("workerId", [
      "name",
      "identityCard",
      "role",
    ]);
    res.status(200).json({
      ok: true,
      routegrams: routegrams,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor comuniquese con el administrador",
    });
  }
};

//Controller para admins
const getRoutegramsByWorkerId = async (req = request, res = response) => {
  //Recupero el workerId a buscar desde el body de la request
  const workerId = req.params.workerId;

  try {
    const routegrams = await Routegram.find({ workerId }).populate("workerId", [
      "name",
      "identityCard",
      "role",
    ]);

    if (!routegrams) {
      return res.status(404).json({
        ok: false,
        msg: "El trabajador no posee rutas registradas",
      });
    }
    res.status(200).json({
      ok: true,
      routegrams: routegrams,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por fvor comunicarse con el administrador",
    });
  }
};

export {
  createRoutegram,
  getMyRoutegrams,
  getAllRoutegrams,
  getRoutegramsByWorkerId,
};
