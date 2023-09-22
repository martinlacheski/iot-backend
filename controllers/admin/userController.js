const { response } = require("express");
const User = require("../../models/admin/User");
const Role = require("../../models/admin/Role");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../../helpers/generateJWT");
const { Types } = require("mongoose");

/**
 * Obtiene todos los usuarios de la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de búsqueda es completada.
 */
const getUsers = async (req, res = response) => {
    try {
        const users = await User.find().populate("role");
        res.json({
            ok: true,
            users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor.",
        });
    }
};

/**
 * Crea un nuevo usuario.
 * @param {*} req - La solicitud HTTP entrante.
 * @param {*} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de creación es completada.
 */
const createUser = async (req, res = response) => {
    const { name, email, password, roleId } = req.body;

    try {
        // Verificar que el email no exista
        let usuario = await User.findOne({ email });
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: "Ya existe un usuario con ese email.",
            });
        }

        // Verificar si el ID del rol es válido
        if (!Types.ObjectId.isValid(roleId)) {
            return res.status(400).json({
                ok: false,
                msg: "ID de rol inválido.",
            });
        }

        // Buscar rol ADMIN en la base de datos
        const role = await Role.findOne({ _id: roleId });
        if (!role) {
            return res.status(400).json({
                ok: false,
                msg: "El rol no existe.",
            });
        }

        // Crear usuario con el modelo
        usuario = new User({
            name,
            email,
            password,
            role: role._id,
        });

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar usuario en la base de datos
        const usuarioDB = await usuario.save();

        // NOMBRE DEL ROL ASOCIADO
        const roleDB = await Role.findById(usuarioDB.role);

        // Devolver respuesta exitosa
        return res.status(201).json({
            ok: true,
            msg: "Usuario creado correctamente.",
            uid: usuario._id,
            name: usuario.name,
            email: usuario.email,
            role: roleDB.name,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error interno del servidor.",
        });
    }
};

/**
 *  Actualiza un usuario.
 * @param {*} req - La solicitud HTTP entrante.
 * @param {*} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de actualización es completada.
 */
const updateUser = async (req, res = response) => {
    const { id } = req.params;
    const { name, email, roleId } = req.body;

    try {
        // Verificar si el ID del usuario es válido
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                ok: false,
                msg: "ID de usuario inválido.",
            });
        }
        // Verificar que el usuario exista
        const userExists = await User.exists({ _id: id });
        if (!userExists) {
            return res.status(400).json({
                ok: false,
                msg: "El usuario no existe.",
            });
        }

        // Verificar si el ID del rol es válido
        if (!Types.ObjectId.isValid(roleId)) {
            return res.status(400).json({
                ok: false,
                msg: "ID de rol inválido.",
            });
        }
        // Verificar que el rol exista
        const roleExists = await Role.exists({ _id: roleId });
        if (!roleExists) {
            return res.status(400).json({
                ok: false,
                msg: "El rol no existe.",
            });
        }

        // Verificar si el email ya existe
        const emailExists = await User.findOne({ email });
        if (emailExists && emailExists._id.toString() !== id) {
            return res.status(400).json({
                ok: false,
                msg: "Ya existe un usuario con ese email.",
            });
        }

        // Actualizar usuario
        const user = await User.findByIdAndUpdate(
            id,
            {
                name,
                email,
                role: roleId,
            },
            { new: true }
        );

        // Devolver respuesta exitosa
        return res.status(200).json({
            ok: true,
            msg: "Usuario actualizado correctamente.",
            user,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error interno del servidor.",
        });
    }
};

/**
 * Eliminar un usuario.
 * @param {*} req - La solicitud HTTP entrante.
 * @param {*} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de eliminación es completada.
 */
const deleteUser = async (req, res = response) => {
    const { id } = req.params;

    try {
        // Verificar si el ID del usuario es válido
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                ok: false,
                msg: "ID de usuario inválido.",
            });
        }

        // Verificar que el usuario exista
        const userExists = await User.exists({ _id: id });
        if (!userExists) {
            return res.status(400).json({
                ok: false,
                msg: "El usuario no existe.",
            });
        }

        // Eliminar usuario
        await User.updateOne({ _id: id }, { isDeleted: true });

        // Devolver respuesta exitosa
        return res.status(200).json({
            ok: true,
            msg: "Usuario eliminado correctamente.",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error interno del servidor.",
        });
    }
};

/**
 * Actualiza la contraseña de un usuario.
 * @param {*} req - La solicitud HTTP entrante.
 * @param {*} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de actualización es completada.
 */
const updatePassword = async (req, res = response) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        // Verificar si el ID del usuario es válido
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                ok: false,
                msg: "ID de usuario inválido.",
            });
        }

        // Verificar que el usuario exista
        const userExists = await User.exists({ _id: id });
        if (!userExists) {
            return res.status(400).json({
                ok: false,
                msg: "El usuario no existe.",
            });
        }

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        const newPassword = bcrypt.hashSync(password, salt);

        // Actualizar contraseña
        await User.updateOne({ _id: id }, { password: newPassword });

        // Devolver respuesta exitosa
        return res.status(200).json({
            ok: true,
            msg: "Contraseña actualizada correctamente.",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error interno del servidor.",
        });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    updatePassword,
};
