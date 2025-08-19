import RouterModel from "../models/router.model.js";
import Ip from "../models/ip.model.js";

export const getRouters = async (req, res) => {
  try {
    const routers = await RouterModel.find();
    res.json(routers);
  } catch (error) {
    return res.status(500).json({
      message: "Error al buscar los routers",
    });
  }
};

export const createRouter = async (req, res) => {
  try {
    const {
      nombre,
      wan,
      lan,
      userAdmin,
      passAdmin,
      observaciones,
      ssid,
      passSsid,
      area
    } = req.body;

    if (!wan) {
      return res.status(400).json({ message: "La dirección WAN es obligatoria" });
    }

    let wanId = null;

    // Buscar si la WAN corresponde a una IP registrada en nuestra BD
    const ipFound = await Ip.findOne({ direccion: wan });

    if (ipFound) {
      // Verificar que no exista otro router usando esa misma IP interna
      const existingRouter = await RouterModel.findOne({ wanId: ipFound._id });
      if (existingRouter) {
        return res.status(400).json({ message: "Ya existe un equipo con esa IP WAN interna" });
      }

      
      if (ipFound.estado === "libre") {
        ipFound.estado = "ocupada";
        await ipFound.save();
      }

      wanId = ipFound._id;
    }

    const newRouter = await RouterModel.create({
      nombre: nombre || `Router - ${area || wan}`,
      wanId,             
      wan,                
      lan: lan || "",
      userAdmin: userAdmin || "",
      passAdmin: passAdmin || "",
      ssid: ssid || "",
      passSsid: passSsid || "",
      observaciones: observaciones || "",
      area: area || null
    });

    return res.status(201).json({
      message: "Router creado correctamente",
      router: newRouter
    });

  } catch (error) {
    console.error("Error al crear router:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

export const deleteRouter = async (req, res) => {
  try {
    const { id } = req.params;

    const routerFound = await RouterModel.findById(id).populate("wan");

    if (!routerFound) {
      return res
        .status(404)
        .json({ message: "No se encontró el router para eliminar" });
    }
    const associatedIP = routerFound.wan;

    const routerDelete = await RouterModel.findByIdAndDelete(id);

    if (associatedIP) {
      const ipUpdate = {
        estado: "libre",
        marcaraSubRed: "",
        puertaEnlace: "",
        hostname: null,
        mac: null,
        area: null,
        observaciones: "",
        detectada: false,
        ultimaDeteccion: null,
        equipo: null,
      };

      await Ip.findByIdAndUpdate(associatedIP._id, ipUpdate, { new: true });
    }

    if (!routerDelete) {
      return res
        .status(404)
        .json({ message: "No se encontro el router para eliminar" });
    }

    return res.json({
      message: "Router eliminado correctamente",
      router: routerDelete,
    });
  } catch (error) {
    console.error("Error al eliminar el router: ", error.message);
    return res.status(500).json({
      message: "Error al eliminar el router: ",
      error: error,
    });
  }
};
