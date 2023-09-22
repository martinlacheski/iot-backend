const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../../models/admin/User");
const Role = require("../../models/admin/Role");
const { generateJWT } = require("../../helpers/generateJWT");

// LOGIN
const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar que el email exista
    let usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un usuario con ese email.",
      });
    }

    // Verificar que la contraseña sea correcta
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "La contraseña es incorrecta.",
      });
    }

    // NOMBRE DEL ROL ASOCIADO
    const role = await Role.findById(usuario.role);

    // Generar el JWT
    const token = await generateJWT(usuario.id, usuario.name, role.name);

    // Devolver respuesta exitosa
    res.status(200).json({
      ok: true,
      uid: usuario._id,
      name: usuario.name,
      role: role.name,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

// REVALIDATE TOKEN
const revalidateToken = async (req, res = response) => {
  const { uid, name, role } = req;
  console.log(uid, name, role);

  // Generar el JWT
  const token = await generateJWT(uid, name, role);

  // Devolver respuesta exitosa
  res.status(200).json({
    ok: true,
    msg: "Token renovado correctamente",
    uid,
    name,
    role,
    token,
  });
};

module.exports = {
  login,
  revalidateToken,
};
