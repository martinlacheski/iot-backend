const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../../models/admin/User");
const { generateJWT } = require("../../helpers/generateJWT");

const register = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar que el email no exista
    let usuario = await User.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un usuario con ese email.",
      });
    }

    // Crear usuario con el modelo
    usuario = new User(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Guardar usuario en la base de datos
    await usuario.save();

    // Generar el JWT
    const token = await generateJWT(usuario.id, usuario.name);

    // Devolver respuesta exitosa
    res.status(201).json({
      ok: true,
      uid: usuario._id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

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

    // Generar el JWT
    const token = await generateJWT(usuario.id, usuario.name);

    // Devolver respuesta exitosa
    res.status(200).json({
      ok: true,
      uid: usuario._id,
      name: usuario.name,
      token,
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
  const { uid, name } = req;

  // Generar el JWT
  const token = await generateJWT(uid, name);

  // Devolver respuesta exitosa
  res.status(200).json({
    ok: true,
    msg: "Token renovado.",
    uid,
    name,
    token,
  });
};

module.exports = {
  register,
  login,
  revalidateToken,
};
