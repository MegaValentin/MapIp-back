import ip from "ip";
import Ip from "../models/ip.model.js";

export const getIps = async (req, res) => {
  try {
    const ips = await Ip.find();
    res.json(ips);
  } catch (error) {
    return res.status(500).json({
      message: "Error al buscar las IPs",
    });
  }
};

export const getIp = async (req, res) => {
  try {
    const { id } = req.params;
    const ip = await Ip.findById(id);

    if (!ip) {
      return res.status(404).json({
        message: "Ip no encontrada",
      });
    }
    res.json(ip);
  } catch (error) {
    console.error("Error al obtener la Ip: ", error);
    res.status(500).json({
      message: "Error al obtener la ip",
    });
  }
  
};

export const deleteIp = async (req, res) => {
  try {
    const { id } = req.params

    const ipEliminda = await Ip.findByIdAndDelete(id)

    if (!ipEliminda){
        return res.status(404).json({ message: "No se encontro la ip para eliminar "})
    }

    return res.json({ message: "IP eliminada correctamente ", ip:ipEliminda})
  } catch (error) {
    consolo.error('Error al eliminar la IP: ', error.message)
    return res.status(500).json({ message: "Error al eliminar la IP: ", error: error.message})
  }
};

export const uploadIp = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const {
      estado,
      hostname,
      mac,
      asignadaA,
      observaciones,
      detectada,
      ultimaDeteccion,
    } = req.body;

    const camposActualizables = {
      ...(estado && { estado }),
      ...(hostname && { hostname }),
      ...(mac && { mac }),
      ...(asignadaA && { asignadaA }),
      ...(observaciones && { observaciones }),
      ...(detectada !== undefined && { detectada }),
      ...(ultimaDeteccion && { ultimaDeteccion }),
    };

    if (Object.keys(camposActualizables).length === 0) {
      return res.status(400).json({ message: "No se enviaron campos validos" });
    }

    const ipActualizada = await Ip.findByIdAndUpdate(id, camposActualizables, {
      new: true,
    });

    if (!ipActualizada) {
      return res.status(404).json({ message: "Ip no encontrada" });
    }

    return res.status(200).json({
      message: "IP actulizada correctamente",
      ip: ipActualizada,
    });

  } catch (error) {
    console.error("Error al actulizar IP: ", error);
    return res
      .status(500)
      .json({ message: "Error interno  del servidor", error: error.message });
  }
};

export const generateIPs = async (req, res) => {
  const { puertaEnlace, redCidr } = req.body;

  if (!puertaEnlace || !redCidr) {
    return res.status(400).json({ message: "Se requiere la puerta de enlace" });
  }

  try {
    const gateway = await Ip.findOne({ puertaEnlace })

    if(gateway){
      return res.status(400).json({meesage: "Ya se generaron IPs con esta puerta de enlace"})
    }

    const subnet = ip.cidrSubnet(redCidr);
    const start = ip.toLong(subnet.firstAddress);
    const end = ip.toLong(subnet.lastAddress);
    const gatewayLog = ip.toLong(puertaEnlace);

    const ips = [];

    for (let i = start; i <= end; i++) {
      const direccion = ip.fromLong(i);
      if (i === gatewayLog) continue;

      ips.push({
        direccion,
        marcaraSubRed: subnet.subnetMask || "",
        puertaEnlace,
        estado: "libre",
        hostname: "",
        mac: "",
        asignadaA: "",
        obsevaciones: "",
        detectada: false,
        ultimaDeteccion: null,
      });
    }

    await Ip.insertMany(ips, { ordered: false });
    res.status(201).json({ message: `Se generaron ${ips.length} Ips` });
    console.log(`Se generaron ${ips.length} Ips`)
    } catch (error) {
    console.error("Error al generar IPs: ", error.message);
    res
      .status(500)
      .json({ message: "Error al generar IPs ", eror: error.message });
  }
};

export const getIpsPuertasEnlaces = async (req, res) => {
    try {
        const { puertaEnlace } = req.params

        const ips = await Ip.find( { puertaEnlace })

        res.json(ips)

    } catch (error) {
        console.error("Error al buscar IPs por puerta de enlace", error.message)
        return res.status(500).json({ message: "Error al buscar las Ips por puerta de enlace "})
    }
}

export const getIpsByStateAndGateway  = async (req, res ) => {
   try {
    const { estado = '', puertaEnlace= ''} = req.query

    const filter ={}

    if(puertaEnlace){
        filter.puertaEnlace = { $regex: new RegExp(puertaEnlace, 'i')}
    }

    if(estado){
        filter.estado = estado
    }

    const ips = await Ip.find(filter)

    if(ips.length === 0){
        return res.status(404).json({ message: "No se encontraron Ips con los parametros proporsionados"})
    }

    res.json(ips)
   } catch (error) {
    console.error("Error al obtener las IPs: ", error.message)
    return res.status(500).json({ message: 'Error al obtener las Ips'})
   }
}

export const getIpsByGatewayPaginated = async (req, res) => {
  try {
    const { puertaEnlace } = req.query

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1 ) * limit

    const filter = {}

    if(puertaEnlace){
      filter.puertaEnlace = puertaEnlace
    }

    const [total, ips] = await Promise.all([
      Ip.countDocuments(filter),
      Ip.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ direccion: 1 })
    ])

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total/limit),
      data:ips

    })

  } catch (error) {
    cosole.error('Error al obtener IPs filtradas: ', error.message)
    res.status(500).json({ message: 'Error al obtener IPs filtradas'})
  }
}

export const saludos = async (req, res) => {
  res.json({ mensaje: "Hola mundo" });
};  