import User from "../models/user.model.js";
import { createAccessToken } from "../libs/jwt.js";

import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs';
import dotenv from "dotenv"

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
                
export const registerUser = async (req, res) => {
    const { username, legajo, password } = req.body

    try {
        const userFound = await User.findOne({ $or: [{ legajo }, { username }] })
        if(userFound) return res.status(400).json([ 'The username is already in use'])

        const hashedPassword = await bcrypt .hash(password, 10)
        const newUser = new User({username,
            legajo,
            password: hashedPassword,
            authorized: false})

        const userSaved = await newUser.save()

        res.status(201).json({
            id: userSaved._id,
            username: userSaved.username,
            legajo: userSaved.legajo,
            role: userSaved.role,
            authorized: userSaved.authorized
        })

    } catch (error) {
        res.status(400).json({ error: error.message})
    }
}

export const loginUser = async (req, res) => {
    const { legajo, password } = req.body
    console.log("Body recibido en loginUser:", req.body);

    try {
        const userFound = await User.findOne({ legajo })
        if(!userFound) return res.status(400).json(["User not found"])

        if (!userFound.authorized) {
            return res.status(403).json(["User is not authorized to log in yet"]);
        }

        const isMatch = await bcrypt.compare(password, userFound.password)
        if(!isMatch) return res.status(400).json(["Incorrect password"])
        
        const token = await createAccessToken({id: userFound._id})

        res.cookie("token", token)              
        res.json({
            id: userFound._id,
            username: userFound.username,
            role: userFound.role
        })

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

export const logout = (req, res) => {
    res.cookie('token', "" , {
        expires: new Date(0),
    })
    return res.sendStatus(200)
}

export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id)

    if(!userFound) return res.status(400).json({
        message: "User don found"
    })

    return res.json({
        id: userFound._id,
        username: userFound.username,
        legajo: userFound.legajo,
        role: userFound.role
    })
}

export const getUser = async (req, res) => {
    try {
        const user = await User.find()
        res.json(user)
    } catch (error) {
        return res.status(500).json({ message: "Error al buscar los usuarios"})
    }
}

export const deleteUser = async (req, res) => {
    try {

        const deleteUser = await User.findByIdAndDelete(req.params.id)
        if (!deleteUser) return res.status(404).json({
            message: "Usuario no encontrado"
        })
        res.json({
            message: "Usuario eleminado exitosamente",
            deleteUser
        })

    } catch (error) {
        console.error('Error al eliminar usurio:', error)
        res.status(500).json({
            message: "Error al eliminar usuario"
        })
    }
}

export const verifyToken = async (req, res ) => {
    const {token} = req.cookies

    if(!token) return res.status(401).json({ message: "Unauthorized"})
    
    jwt.verify(token, jwtSecret, async (err, user) => {
        if(err) return res.status(401).json({ message: "Unauthorized"})
        
        const userFound = await User.findById(user.id)
        if(!userFound) return res.status(401).json({ message: "Unauthorized"})
    
        return res.json({
            id: userFound._id,
            username: userFound.username,
            legajo: userFound.legajo,
            role: userFound.role
        })
    })
}

export const authorizeUser = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findById(id)
        if(!user) return res.status(404).json({message: "Usuario no encontrado"})

        user.authorized = true
        await user.save()
        res.json({ message: "Usuario autorizado correctamente", user})

    } catch (error) {
        console.error("Error la autorizar usuario: ", error)
        res.status(500).json({ message: "Error al autorizar usuario"})
    }
}

export const updatedRole = async (req, res) => {
    const { id } = req.params
    const { role } = req.body

    const allwedRoles = ["admin", "user"]
    if(!allwedRoles.icludes(role)){
        return res.status(400).json({ message: "Invalid role. Allowed roles are 'admin' or 'user' "})

    }

    try {
        const user = await User.findById(id)
        if(!user) return res.status(404).json({ message: "User not found"})

        user.role = role
        await user.seve()

        res.json({
            message: "User role updated successfully",
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}
    