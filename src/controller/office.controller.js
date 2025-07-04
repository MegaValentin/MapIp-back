import Office from "../models/office.model.js"
import xlsx from 'xlsx';
import fs from 'fs';

export const getOffices = async (req, res) => {
    try {
        const offices = await Office.find()
        res.json(offices)
    } catch (error) {
        return res.status(500).json({message: "Error al buscar las Areas"})
    }
}

export const getOffice = async (req, res) => {
    try {
        const { id } = req.params
        const office = await Office.find(id)

        if(!office){
            return res.status(404).json({
                message: "Area no encontrada"
            })
        }

        res.json(office)
    } catch (error) {
        console.error('Error al obtener el area: ', error)
        return res.status(500).json({ message: "Error al buscar el area"})
    }
}

export const deleteOffice = async (req, res ) => {
    try {
        const office = await Office.findByIdAndDelete(req.params.id)

        if(!office) return res.status(404).json({
            message: "Area no encontrada"
        })

        res.json({
            message:"Area eliminada correctamente"
        })

    } catch (error) {
        console.error('Error al eliminar el area', error)
        res.status(500).json({
            message:"Error al eliminar el area"
        })
    }
}

export const updatedOffice = async (req, res) => {
    try {
        const { area } = req.body

        if(!area){
            return res.status(400).json({
                message: "El campo 'Area' es requerido"
            })
        }

        const office = await Office.findByIdAndUpdate(req.paramas.id, { area }, {
            new: true
        })

        if(!office){
            return res.status(404).json({
                message: "Area no encontrada"
            })
        }

        res.json(office)

    } catch (error) {
        console.error('Error al actualizar el area: ', error)
        res.status(500).json({
            message:"Error al actualizar el area"
        })
    }
}

export const addOffice = async (req, res) => {
    try {
        const { area } = req.body

        if(area === undefined || area.trim() === ''){
            return res.status(400).json({meesage: "El nombre del area es requerido"})
        }

        const normalizedOffice = area.trim().toLowerCase()
        const existingOffice = await Office.findOne({ area: { $regex: `^${normalizedOffice}$`, $options: 'i' } });
    
        if(existingOffice){
            return res.status(400).json({ message: "Ya existe esta área"})
        }else{
            const newOffice = new Office({ area:normalizedOffice })
            const savedOffice = await newOffice.save()
            
            return res.status(201).json(savedOffice)

        }

    } catch (error) {
        console.error('Error al agregar el área', error)
        return res.status(500).json({ message: 'Error al agregar el área.'})
    }
}

export const addAllOffice = async (req, res) => {
    const file = req.file

    console.log(file)

    if(!file){
        return res.status(400).json({error: "No file upload"})
    }

    try {

        const officebook = xlsx.readFile(file.path)
        const sheetName = officebook.SheetNames[0]
        const worksheet = officebook.Sheets[sheetName]
        const data = xlsx.utils.sheet_to_json(worksheet)

        const newOffice = data.map((row) => ({
            area:row.area,
        }))

        await Office.insertMany(newOffice)
        fs.unlinkSync(file.path)

        res.status(200).json({message: 'Arear agregadas correctamente'})
    } catch (error) {
        console.error("Error al procesar el archivo excel: ", error)
        res.status(500).json({error:error.message})
    }
}

export const getPaginatedOffices = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const skip = (page - 1) * limit

    try {
        const [ offices, total ] = await Promise.all([
            Office.find().sort({area: 1}).skip(skip).limit(limit),
            Office.countDocuments()
        ])

        const totalPages = Math.ceil(total / limit )

        res.json({
            data:offices,
            currentPage: page,
            totalPages,
            totalItems: total
        })

    } catch (error) {
        console.error("Error al obtener areas paginadas", error)
        res.status(500).json({ message: "Error en el servidor"})
    }
}