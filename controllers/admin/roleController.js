const { response } = require("express");
const Role = require("../../models/admin/Role");
const { Types } = require("mongoose");
const User = require("../../models/admin/User");

/**
 * Obtiene todos los roles de la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de búsqueda es completada.
 */
const getRoles = async (req, res = response) => {
    try {
        const roles = await Role.find();
        res.json({
            ok: true,
            roles,
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
 * Crea un nuevo rol y lo guarda en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de creación es completada.
 */
const createRole = async (req, res = response) => {
    for (const key in req.body) {
        if (typeof req.body[key] === "string") {
            req.body[key] = req.body[key].trim().toUpperCase();
        }
    }
    try {
        const roleDB = await new Role(req.body).save();
        res.json({
            ok: true,
            msg: "¡Rol creado exitosamente!",
            role: roleDB,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                msg: "El rol que intenta crear ya existe.",
            });
        }
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor.",
        });
    }
};

/**
 *  Actualiza un rol existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de actualización es completada.
 */
const updateRole = async (req, res = response) => {
    const roleId = req.params.id;
    for (const key in req.body) {
        if (typeof req.body[key] === "string") {
            req.body[key] = req.body[key].trim().toUpperCase();
        }
    }
    try {
        if (!Types.ObjectId.isValid(roleId)) {
            return res.status(400).json({
                ok: false,
                msg: "ID de rol inválido.",
            });
        }

        // Verificar si el rol existe por ID
        let role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({
                ok: false,
                msg: "El rol que intenta actualizar no existe.",
            });
        }

        // Verificar si el nombre del role ya existe (si se está actualizando)
        if (req.body.name !== role.name) {
            const roleExists = await Role.findOne({ name: req.body.name });
            if (roleExists) {
                return res.status(400).json({
                    ok: false,
                    msg: "¡El nombre del rol al que intenta actualizar ya existe!",
                });
            }
        }

        // Solo actualizamos los campos necesarios (en este caso, todos los campos)
        const updatedRole = await Role.findByIdAndUpdate(
            roleId,
            req.body,
            { new: true }
        );

        // Devolvemos la respuesta
        res.json({
            ok: true,
            msg: "¡País actualizado correctamente!",
            role: updatedRole,
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
 * Elimina un rol existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de eliminación es completada.
 */
const deleteRole = async (req, res = response) => {
    const roleId = req.params.id;

    try {
        // Verificar si el ID del rol es válido
        if (!Types.ObjectId.isValid(roleId)) {
            return res.status(400).json({
                ok: false,
                msg: "ID de rol inválido.",
            });
        }

        // Verificar si el rol existe (Middleware sugerido)
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({
                ok: false,
                msg: "El rol que intenta eliminar no existe.",
            });
        }

        // Verificar si el rol tiene usuarios asociados (Middleware sugerido)
        const isReferencedInUser = await User.exists({
            role: roleId,
        });
        if (isReferencedInUser) {
            return res.status(400).json({
                ok: false,
                msg: "¡El rol que intenta eliminar tiene usuarios asociados!",
            });
        }

        // Eliminamos el rol
        await Role.updateOne({ _id: roleId }, { isDeleted: true });

        // Devolvemos la respuesta con el rol eliminado (opcional)
        res.json({
            ok: true,
            msg: "Rol eliminado correctamente!",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor.",
        });
    }
};

module.exports = {
    getRoles,
    createRole,
    updateRole,
    deleteRole
};
