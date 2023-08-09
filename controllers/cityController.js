const { response } = require("express");
const Province = require("../models/Province");
const City = require("../models/City");
const Organization = require("../models/Organization");
const Branch = require("../models/Branch");
const { Types } = require("mongoose");

/**
 * Obtener todas las ciudades.
 * @param {*} req - Objeto de solicitud.
 * @param {*} res - Objeto de respuesta.
 * @returns {Promise<void>} - La respuesta con un array de ciudades o un mensaje de error en caso de fallo.
 */
const getCities = async (req, res = response) => {
  try {
    const cities = await City.find().populate("province");
    res.json({
      ok: true,
      cities,
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
 * Crear una nueva ciudad.
 * @param {*} req - Objeto de solicitud.
 * @param {*} res - Objeto de respuesta.
 * @returns {Promise<void>} - La respuesta con la ciudad creada o un mensaje de error en caso de fallo.
 */
const createCity = async (req, res = response) => {
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }
  const { provinceId, name } = req.body;
  try {
    // Verificar si el ID de la provincia es válido
    if (!Types.ObjectId.isValid(provinceId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de provincia inválido.",
      });
    }

    // Verificar si la provincia a la que se le quiere asignar la ciudad existe
    const provinceExists = await Province.exists({ _id: provinceId });
    if (!provinceExists) {
      return res.status(404).json({
        ok: false,
        msg: "La provincia no existe.",
      });
    }

    // Verificar si la ciudad ya existe en la provincia
    const cityExists = await City.exists({ name, province: provinceId });
    if (cityExists) {
      return res.status(400).json({
        ok: false,
        msg: "¡La ciudad ya existe en la provincia!",
      });
    }

    const city = new City({
      ...req.body,
      province: provinceId,
    });

    // Guardar ciudad en la BD
    const cityDB = await city.save();

    res.json({
      ok: true,
      msg: "¡Ciudad creada correctamente!",
      city: cityDB,
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
 * Actualizar una ciudad existente.
 * @param {*} req - Objeto de solicitud.
 * @param {*} res - Objeto de respuesta.
 * @returns {Promise<void>} - La respuesta con la ciudad actualizada o un mensaje de error en caso de fallo.
 */
const updateCity = async (req, res = response) => {
  const cityId = req.params.id;
  const { provinceId } = req.body;

  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }

  try {
    // Verificar si el ID de la ciudad es válido
    if (!Types.ObjectId.isValid(cityId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de ciudad inválido.",
      });
    }

    // Verificar si la ciudad existe
    let city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({
        ok: false,
        msg: "La ciudad no existe.",
      });
    }

    // Verificar si el ID de la provincia es válido
    if (!Types.ObjectId.isValid(provinceId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de provincia inválido.",
      });
    }

    // Verificar si la provincia existe
    let provinceExists = await Province.findById(provinceId);
    if (!provinceExists) {
      return res.status(404).json({
        ok: false,
        msg: "La provincia no existe.",
      });
    }

    // Verificar si el nombre de la ciudad ya existe en la provincia
    const cityWithSameName = await City.findOne({
      name: req.body.name,
      province: req.body.provinceId,
    });

    if (cityWithSameName && cityWithSameName._id.toString() !== cityId) {
      return res.status(400).json({
        ok: false,
        msg: "¡La ciudad ya existe en la provincia!",
      });
    }

    const newCity = {
      ...req.body,
      province: req.body.provinceId,
    };

    // Utilizar findOneAndUpdate y runValidators: true
    const cityDB = await City.findOneAndUpdate({ _id: cityId }, newCity, {
      new: true,
      runValidators: true,
    });

    res.json({
      ok: true,
      msg: "¡Ciudad actualizada correctamente!",
      city: cityDB,
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
 * Eliminar una ciudad existente.
 * @param {*} req - Objeto de solicitud.
 * @param {*} res - Objeto de respuesta.
 * @returns {Promise<void>} - La respuesta con un mensaje de éxito o un mensaje de error en caso de fallo.
 */
const deleteCity = async (req, res = response) => {
  const cityId = req.params.id;

  try {
    // Verificar si el ID de la ciudad es válido
    if (!Types.ObjectId.isValid(cityId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de ciudad inválido.",
      });
    }

    // Verificar si la ciudad existe
    const cityExists = await City.findById(cityId);
    if (!cityExists) {
      return res.status(404).json({
        ok: false,
        msg: "La ciudad no existe.",
      });
    }

    // Verificar si la ciudad está siendo referenciada en la colección "Organization"
    const organizationRef = await Organization.findOne({ city: cityId });
    if (organizationRef) {
      return res.status(400).json({
        ok: false,
        msg: "¡No es posible eliminar la ciudad porque está siendo referenciada en una organización!",
      });
    }

    // Verificar si la ciudad está siendo referenciada en la colección "Branch"
    const branchRef = await Branch.findOne({ city: cityId });
    if (branchRef) {
      return res.status(400).json({
        ok: false,
        msg: "¡No es posible eliminar la ciudad porque está siendo referenciada en una sede!",
      });
    }

    // Eliminar la ciudad
    await City.updateOne({ _id: cityId }, { isDeleted: true });

    res.json({
      ok: true,
      msg: "¡Ciudad eliminada correctamente!",
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
  getCities,
  createCity,
  updateCity,
  deleteCity,
};
