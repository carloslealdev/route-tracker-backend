import e, { json, request, response } from "express";
import Routegram from "../models/Routegram.js";
import User from "../models/User.js";

const createRoutegram = async (req = request, res = response) => {
  //Extraigo el id de user que está inyectado en la request gracias al middleware protect
  const { _id } = req.user;

  //Validar si el usuario ya posee una ruta del tipo que se quiere crear ("Casa-Trabajo", "Trabajo-Casa"), desea sobreescribirla?
  const typeRoute = req.body.typeRoute;
  const validateTypeRouteForWorker = await Routegram.find({
    workerId: _id,
    typeRoute,
  });

  // console.log(validateTypeRouteForWorker);

  if (validateTypeRouteForWorker.length > 0) {
    return res.json({
      ok: false,
      msg: "El usuario ya posee una ruta de este tipo, ¿Desea sobreescribirla?",
    });
  }

  //Estructuro la data para crear el rutagrama según el modelo de mongoose
  const routegramData = {
    workerId: _id,
    typeRoute: req.body.typeRoute,
    location: req.body,
  };

  //Creo el rutagrama
  try {
    const routegram = new Routegram(routegramData);

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

const updateRoutegram = async (req = request, res = response) => {
  const routegramId = req.params.id;
  const uid = req.uid;

  try {
    const routegram = await Routegram.findById(routegramId);

    if (!routegram) {
      return res.status(404).json({
        ok: false,
        msg: "No existe ruta con este Id",
      });
    }

    if (routegram.workerId.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No está autorizado para editar esta ruta",
      });
    }

    //Estrucuturar de manera correcta el objeto GEOJson para el rutagrama (especificar el typeRoute y Location)
    const newRoutegram = {
      ...req.body,
      location: req.body,
      workerId: uid,
    };

    const routegramUpdated = await Routegram.findByIdAndUpdate(
      routegramId,
      newRoutegram,
      { new: true }
    );

    res.json({
      ok: true,
      routegram: routegramUpdated,
    });
  } catch (error) {
    console.log(error);
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
  updateRoutegram,
};
