const { response } = require("express");

const isSudo = (req, res = response, next) => {
    const role = req.role;
    if (role !== 'SUDO') {
        return res.status(403).json({
            ok: false,
            msg: 'Solo un usuario con rol de SUDO puede realizar esta acción'
        })
    }
    next();
}

module.exports = {
    isSudo
}