import Router from "../models/router.model.js";
import Ip from "../models/ip.model.js";

import mongoose from "mongoose";
import ip from "ip";


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
  const { nombre, wan, lanCidr, puertaEnlace, observaciones, area } = req.body;

  // Validación básica
  if (!lanCidr || !wan || !puertaEnlace) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  // Validar que wan sea un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(wan)) {
    return res.status(400).json({ message: "ID de IP WAN no válido" });
  }

  try {
    const ipWan = await Ip.findById(wan)

    if (!ipWan) {
      return res.status(404).json({ message: "La IP WAN no existe" });
    }

    if (ipWan.estado !== "libre") {
      return res.status(400).json({ message: "La IP WAN no está disponible" });
    }

    // Crear el router
    const nuevoRouter = new Router({
      nombre,
      wan: ipWan._id,
      puertaEnlace,
      observaciones,
      area,
    });

    await nuevoRouter.save();

    // Actualizar la IP WAN
    ipWan.estado = "ocupada";
    ipWan.isRouter = true;
    ipWan.router = nuevoRouter._id;
    ipWan.observaciones = "${nombre}";

    await ipWan.save();

    const subnet = ip.cidrSubnet(lanCidr);
    const start = ip.toLong(subnet.firstAddress);
    const end = ip.toLong(subnet.lastAddress);
    const gatewayLog = ip.toLong(puertaEnlace);

    const ips = [];

    for (let i = start; i <= end; i++) {
      const direccion = ip.fromLong(i);

      if (i === gatewayLog) continue;
      ips.push({
        direccion,
        marcaraSubRed: subnet.subnetMask,
        puertaEnlace,
        estado: "libre",
        area,
        router: nuevoRouter._id,
      });
    }

    await Ip.insertMany(ips, { ordered: false });

    res
      .status(201)
      .json({ message: "Router creado correctamente", router: nuevoRouter });
  } catch (error) {
    console.error("Error al crear router:", error);
    res.status(500).json({ message: "Error interno al crear el router" });
  }
};

export const deleteRouter = async (req, res) => {
  const { id } = req.params;

  try {
    const router = await Router.findById(id);

    if (!router) {
      return res.status(404).json({ message: "Router no encontrado" });
    }

    await Ip.findByIdAndUpdate(router.wan, {
      estado: "libre",
      observaciones: "",
      isRouter: false,
    });

    await Router.findByIdAndDelete(id);

    res.status(200).json({ message: "Router elimando correctanemte" });
  } catch (error) {
    console.error("Error al eliminar el router: ", error.message);
    res.status(500).json({ message: "Error al eliminar el router" });
  }
};

export const updatedRouter = async (req, res) => {
  try {
    const { id } = req.params

    if(!id || id.length !== 24) {
      return res.status(400).json({ message: "ID inválido"})
    }

    const {
      nombre,
      wan,
      puertaEnlace,
      observaciones,
      area
    } = req.body

    const updateableFields = {
      ...(nombre && { nombre }),
      ...(wan && { wan }),
      ...(puertaEnlace && { puertaEnlace }),
      ...(observaciones && { observaciones }),
      ...(area && { area }),
   
    }

    if(Object.keys(camposActualizables). length === 0) {
      return res.status(400).json({
         message: "No se enviaron campos validos"
      })
    }

    const routerActualizado = await Router.findByIdAndUpdate(id, updateableFields, {
      new: true,
    })

    if(!routerActualizado){
      return res.status(404).json({ message: "Router no encontrado"})
    }

    return res.status(200).json({
      message: "Router actualizado correctamente",
      router: routerActualizado
    })

  } catch (error) {
    console.error("Error al actualizar Router: ", error)
    return res.status(500).json({ message: "Error interno del servidor", error: error.message})
  }
}