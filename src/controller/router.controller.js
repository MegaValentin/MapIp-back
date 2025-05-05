import Router from "../models/router.model.js";
import Ip from "../models/ip.model.js";

import mongoose from "mongoose";

export const getIpsByRouter = async (req, res) => {
  const { id } = req.params;

  try {
    const router = await Router.findById(id);

    if (!router) {
      return res.status(404).json({ message: "Router no encontrado" });
    }

    const ips = await Ip.find({ puertaEnlace: router.puertaEnlace });

    res.json({
      router: router.nombre,
      puertaEnlace: router.puertaEnlace,
      cantidadIPs: ips.length,
      ips,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las IPs del router" });
  }
};

export const createRouter = async (req, res) => {
  const { nombre, wan, puertaEnlace, observaciones, area } = req.body;

  // Validación básica
  if (!nombre || !wan || !puertaEnlace) {
    return res
      .status(400)
      .json({ message: "Nombre, WAN y puerta de enlace son obligatorios" });
  }

  // Validar que wan sea un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(wan)) {
    return res.status(400).json({ message: "ID de IP WAN no válido" });
  }

  try {
    const ipWan = await Ip.findById(wan);

    if (!ipWan) {
      return res.status(404).json({ message: "La IP WAN no existe" });
    }

    if (ipWan.estado !== "libre") {
      return res.status(400).json({ message: "La IP WAN no está disponible" });
    }

    // Crear el router
    const nuevoRouter = new Router({
      nombre,
      wan,
      puertaEnlace,
      observaciones,
      area,
    });

    await nuevoRouter.save();

    // Actualizar la IP WAN
    ipWan.estado = "ocupada";
    ipWan.isRouter = true;
    ipWan.obsevaciones = `Asignada al router "${nombre}"`;
    await ipWan.save();

    res
      .status(201)
      .json({ message: "Router creado correctamente", router: nuevoRouter });
  } catch (error) {
    console.error("Error al crear router:", error);
    res.status(500).json({ message: "Error interno al crear el router" });
  }
};
