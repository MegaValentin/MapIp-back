import ip from "ip"
import Ip from "../models/ip.model.js"

export const getIps = async (req, res) => {
    try {
        const ips = await Ip.find();

        const completadas = ips.map(ip => ({
            direccion: ip.direccion || "",
            marcaraSubRed: ip.marcaraSubRed || "",
            puertaEnlace: ip.puertaEnlace || "",
            estado: ip.estado || "libre",
            hostname: ip.hostname || "",
            mac: ip.mac || "",
            asignadaA: ip.asignadaA || "",
            obsevaciones: ip.obsevaciones || "",
            detectada: ip.detectada ?? false,
            ultimaDeteccion: ip.ultimaDeteccion || null,
            createdAt: ip.createdAt || null,
            updatedAt: ip.updatedAt || null,
            _id: ip._id
        }));

        res.json(completadas);

    } catch (error) {
        return res.status(500).json({
            message: "Error al buscar las IPs"
        });
    }

}

export const getIp = async (req, res) => {
    try {
        const {id} = req.params
        const ip = await Ip.findById(id)

        if(!ip) {
            return res.status(404).json({
                message: "Ip no encontrada"
            })
        }
        res.json(ip)

    } catch (error) {
        console.error('Error al obtener la Ip: ', error)
        res.status(500).json({
            message: "Error al obtener la ip"
        })
    }
    res.send('Ruta funcionando')
}

export const deleteIp = async (req, res) => {
    res.send('Ruta funcionando')
}

export const uploadIp = async (req, res) => {
    const { id } = req.params
    
    const {
        estado,
        hostname,
        mac,
        asignadaA,
        detectada,
        observaciones,
        ultimaDeteccion
    } = req.body

    try {
        const ipToUpdate = await Ip.findById(id)
        if(!ipToUpdate){
            return res.status(404).json({ message: "IP no encontrada"})
        }

        ipToUpdate.estado = estado ?? ipToUpdate.estado
        ipToUpdate.hostname = hostname ?? ipToUpdate.hostname
        ipToUpdate.mac = mac ?? ipToUpdate.mac
        ipToUpdate.asignadaA = asignadaA ?? ipToUpdate.asignadaA
        ipToUpdate.observaciones = observaciones ?? ipToUpdate.observaciones
        ipToUpdate.detectada = detectada ?? ipToUpdate.detectada
        ipToUpdate.ultimaDeteccion = ultimaDeteccion ?? ipToUpdate.ultimaDeteccion
    
        await ipToUpdate.save()

        res.json({message: "IP actualizada correctamente", ip: ipToUpdate})

    } catch (error) {
        console.error("Error al actualizar la IP: ", error.message)
        res.status(500).json({ message: "Error al actualizar la IP", error: error})
    }
}
export const addIp = async (req, res) => {
    res.send('Ruta funcionando')
}

export const generateIPs   = async(req, res) => {
    const { puertaEnlace, redCidr } = req.body

    if(!puertaEnlace || !redCidr) {
        return res.status(400).json({ message: 'Se requiere la puerta de enlace'})

    }

    try {
        const subnet = ip.cidrSubnet(redCidr)
        const start = ip.toLong(subnet.firstAddress)
        const end = ip.toLong(subnet.lastAddress)
        const gatewayLog = ip.toLong(puertaEnlace)

        const ips = []

        for (let i = start; i <= end; i++){
            const direccion = ip.fromLong(i)
            if(i === gatewayLog) continue

            ips.push({
                direccion,
                marcaraSubRed: subnet.subnetMask || "",
                puertaEnlace,
                estado: 'libre',
                hostname: "",
                mac: "",
                asignadaA: "",
                obsevaciones: "",
                detectada: false,
                ultimaDeteccion: null
            });
        }

        await Ip.insertMany(ips, {ordered: false})
        res.status(201).json({message: `Se generaron ${ips.length} Ips`})

    } catch (error) {
        console.error('Error al generar IPs: ', error.message)
        res.status(500).json({message: 'Error al generar IPs ', eror: error.message})
    }
}