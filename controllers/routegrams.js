import { request, response } from "express";
import Routegram from "../models/Routegram.js";

const createRoutegram = async (req = request, res = response) => {
  const { _id } = req.user;

  const routegramData = {
    location: req.body,
    workerId: _id,
  };

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

export { createRoutegram };
