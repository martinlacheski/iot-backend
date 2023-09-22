const { response } = require("express");

const isBedelia =  (req, res = response, next) => {
    const role = req.role;
    if(role !== 'BEDELIA' && role !== 'SUDO' && role !== 'ADMINISTRATIVO'){
        return res.status(403).json({
            ok: false,
            msg: 'Solo un usuario con rol de BEDELIA puede realizar esta acción'
        })
    }
    next();
}

module.exports = {
    isBedelia
}