import ip from "ip";
import Ip from "../models/ip.model.js";
import mongoose from "mongoose";
import ping from 'ping';
import os from "os"

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
      area,
      asignadaA,
      observaciones,
      detectada,
      ultimaDeteccion,
      equipo,
    } = req.body;

    const camposActualizables = {
      ...(estado && { estado }),
      ...(hostname && { hostname }),
      ...(mac && { mac }),
      ...(area && { area }),
      ...(asignadaA && { asignadaA }),
      ...(observaciones && { observaciones }),
      ...(detectada !== undefined && { detectada }),
      ...(ultimaDeteccion && { ultimaDeteccion }),
      ...(equipo && { equipo})
    };

    if (area && !mongoose.Types.ObjectId.isValid(area)) {
      return res.status(400).json({ message: "ID de área inválido" });
    }

    const ipActualizada = await Ip.findByIdAndUpdate(id, camposActualizables, {
      new: true,
      runValidators: true 
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

    if (error.code === 11000 && error.keyPattern?.mac) {
      return res.status(400).json({
        error: [{ campo: "mac", mensaje: "Esta dirección MAC ya está registrada" }]
      });
    }
    
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

export const deleteIPsByGateway = async (req, res) => {
  const { puertaEnlace } = req.body;

  if (!puertaEnlace) {
    return res.status(400).json({ message: "Se requiere la puerta de enlace a eliminar" });
  }

  try {
    const resultado = await Ip.deleteMany({ puertaEnlace });

    res.status(200).json({
      message: `Se eliminaron ${resultado.deletedCount} IPs con la puerta de enlace ${puertaEnlace}`,
    });
  } catch (error) {
    console.error("Error al eliminar IPs:", error.message);
    res.status(500).json({ message: "Error al eliminar IPs", error: error.message });
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
    const { puertaEnlace } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (puertaEnlace) {
      filter.puertaEnlace = puertaEnlace;
    }

    // 1. Obtener todas las IPs filtradas
    const allIps = await Ip.find(filter).populate("area", "area");

    // 2. Ordenarlas correctamente por dirección IP
    const sortIps = allIps.sort((a, b) => {
      const ipA = a.direccion.split('.').map(Number);
      const ipB = b.direccion.split('.').map(Number);
      return (
        ipA[0] - ipB[0] ||
        ipA[1] - ipB[1] ||
        ipA[2] - ipB[2] ||
        ipA[3] - ipB[3]
      );
    });

    // 3. Paginar manualmente
    const paginatedIps = sortIps.slice(skip, skip + limit);

    res.status(200).json({
      total: allIps.length,
      page,
      limit,
      totalPages: Math.ceil(allIps.length / limit),
      hasNextPage: page < Math.ceil(allIps.length / limit),
      data: paginatedIps,
    });
  } catch (error) {
    console.error('Error al obtener IPs filtradas: ', error.message);
    res.status(500).json({ message: 'Error al obtener IPs filtradas' });
  }
}

export const getUniqueGateways = async (req, res) => {
  try {
    const gateways = await Ip.distinct('puertaEnlace')
    res.status(200).json({gateways})
  } catch (error) {
    console.error('Error al obtener puertas de enlace unicas: ', error.message)
    res.status(500).json({ message: "Error al obtener puertas de enlace unicas"})
  }
}

export const ipGateways = async (req, res) => {
  const { puertaEnlace, estado} = req.query

  if(!puertaEnlace || !estado) {
    return res.status(400).json({
      error: "Faltan parametros"
    })
  }

  try {
    const freeIp = await Ip.find({
      puertaEnlace,
      estado
    })
    res.json(freeIp)
  } catch (error) {
    console.error("Error al obtener las Ips libre: ", error)
    res.status(500).json({ error: 'Error al obtener IPs libres'})
  }
}

export const getIpCountByOffice = async (req, res) => {
  try {
    const results = await Ip.aggregate([
      {
        $match: {
          estado: "ocupada",
          area: { $ne: null }
        }
      },
      {
        $lookup: {
          from: "offices", 
          localField: "area",
          foreignField: "_id",
          as: "office"
        }
      },
      {
        $unwind: "$office"
      },
      {
        $group: {
          _id: "$area",
          area: { $first: "$office.area" },
          cantidad: { $sum: 1 },
          ips: {
            $push: {
              direccion: "$direccion",
              hostname: "$hostname",
              mac: "$mac",
              observaciones: "$observaciones",
              equipo: "$equipo"
            }
          }
        }
      },
      {
        $sort: { cantidad: -1 }
      }
    ]);

    res.json(results);
  } catch (error) {
    console.error("Error al obtener Ips por área: ", error);
    res.status(500).json({ error: "Error al contar o listar IPs por área" });
  }
};

export const getIpsByOffices = async (req, res) => {
  try {
    const { officeId } = req.params

    if(!officeId || officeId.length !== 24){
      return res.status(400).json({ message: "Id de área invalido"})
    }

    const ips = await Ip.find({ area: officeId, estado:"ocupada"})

    res.json({
      cantidad: ips.length,
      ips
    })
  } catch (error) {
    console.error("Error al obtener IPs por área: ", error)
    res.status(500).json({ message: "Error interno del servidor"})
  }
}

export const scanIpByOffice = async (req, res) => {
  try {
    const { officeId } = req.params;

    const isWindows = os.platform() === 'win32'; //verifico el sistema operativo

    if (!officeId || officeId.length !== 24) {
      return res.status(400).json({ message: 'ID de oficina inválido' });
    }
    // Buscar todas las IPs asociadas al área
    const ips = await Ip.find({ area: officeId });

    const results = [];

    for (const ip of ips) {
      const result = await ping.promise.probe(ip.direccion, {
        timeout: 2,
        extra: [isWindows ? '-n' : '-c', '3'], 
      });

      console.log("Escanenando IP:", ip.direccion);
      console.log("Resultado:", result);
      const estaActiva = result.alive;

      await Ip.findByIdAndUpdate(ip._id, {
        detectada: estaActiva,
        ultimaDeteccion: new Date(),
      });

      results.push({
        direccion: ip.direccion,
        activa: estaActiva,
      });
    }

    res.json({
      message: 'Escaneo completado',
      results,
    });
  } catch (error) {
    console.error('Error al escanear IPs:', error);
    res.status(500).json({ message: 'Error al escanear IPs' });
  }
}