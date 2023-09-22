const { response } = require("express");

const isAdministrativo = (req, res = response, next) => {
    const role = req.role;
    if (role !== 'ADMINISTRATIVO' && role !== 'SUDO') {
        return res.status(403).json({
            ok: false,
            msg: 'Solo un usuario con rol de ADMINISTRATIVO puede realizar esta acción'
        })
    }
    next();
}

module.exports = {
    isAdministrativo
}