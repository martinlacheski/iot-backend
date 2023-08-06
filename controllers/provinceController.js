const { response } = require("express");
const Province = require("../models/Province");
const Country = require("../models/Country");
const City = require("../models/City");
const { Types } = require("mongoose");

/**
 * Obtiene todas las provincias.
 *
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP.
 * @returns {Response} - La respuesta con un array de provincias o un mensaje de error en caso de fallo.
 */
const getProvinces = async (req, res = response) => {
  try {
    const provinces = await Province.find().populate('country');
    res.json({
      ok: true,
      provinces,
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
 * Crea una nueva provincia.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Response} - La respuesta con la provincia creada o un mensaje de error en caso de fallo.
 */
const createProvince = async (req, res = response) => {
  try {
    const { countryId, name } = req.body;

    // Verificar si el ID del país es válido
    if (!Types.ObjectId.isValid(countryId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de país inválido.",
      });
    }

    // Verificar si el país al que se le quiere asignar la provincia existe
    const countryExists = await Country.exists({ _id: countryId });
    if (!countryExists) {
      return res.status(404).json({
        ok: false,
        msg: "El país no existe.",
      });
    }

    // Verificar si la provincia ya existe en el país
    const provinceExists = await Province.exists({ name, country: countryId });
    if (provinceExists) {
      return res.status(400).json({
        ok: false,
        msg: "¡La provincia ya existe en el país!",
      });
    }

    // Crear una nueva instancia del modelo Province
    const province = new Province({
      name,
      country: countryId,
    });

    // Guardar la nueva provincia en la base de datos
    const provinceDB = await province.save();

    res.json({
      ok: true,
      msg: "¡Provincia creada correctamente!",
      province: provinceDB,
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
 * Actualiza una provincia existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Response} - La respuesta con la provincia actualizada o un mensaje de error en caso de fallo.
 */
const updateProvince = async (req, res = response) => {
  const provinceId = req.params.id;

  try {
    // Verificar si el ID de la provincia es válido
    if (!Types.ObjectId.isValid(provinceId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de provincia inválido.",
      });
    }

    // Verificar si la provincia existe
    const provinceExists = await Province.exists({ _id: provinceId });
    if (!provinceExists) {
      return res.status(404).json({
        ok: false,
        msg: "La provincia no existe.",
      });
    }

    // Verificar si el país existe
    const countryId = req.body.countryId;
    if (!Types.ObjectId.isValid(countryId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de país inválido.",
      });
    }

    const countryExists = await Country.exists({ _id: countryId });
    if (!countryExists) {
      return res.status(404).json({
        ok: false,
        msg: "El país no existe.",
      });
    }

    // Verificar si el nombre de la provincia ya existe en el país
    const provinceWithSameName = await Province.exists({
      name: req.body.name,
      country: countryId,
      _id: { $ne: provinceId }, // Excluir la provincia actual de la búsqueda
    });
    if (provinceWithSameName) {
      return res.status(400).json({
        ok: false,
        msg: "¡La provincia ya existe en el país!",
      });
    }

    // Actualizar la provincia
    const newProvince = {
      ...req.body,
      country: countryId,
    };
    const provinceDB = await Province.findByIdAndUpdate(
      provinceId,
      newProvince,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "¡Provincia actualizada correctamente!",
      province: provinceDB,
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
 * Elimina una provincia existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Response} - La respuesta con un mensaje de éxito o un mensaje de error en caso de fallo.
 */
const deleteProvince = async (req, res = response) => {
  const provinceId = req.params.id;

  try {
    // Verificar si el ID de la provincia es válido
    if (!Types.ObjectId.isValid(provinceId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de provincia inválido.",
      });
    }

    // Verificar si la provincia existe
    const provinceExists = await Province.exists({ _id: provinceId });
    if (!provinceExists) {
      return res.status(404).json({
        ok: false,
        msg: "La provincia no existe.",
      });
    }

    // Verificar si la provincia está siendo referenciada en alguna ciudad
    const isReferencedInCity = await City.exists({ province: provinceId });
    if (isReferencedInCity) {
      return res.status(400).json({
        ok: false,
        msg: "¡La provincia está siendo referenciada en alguna ciudad!",
      });
    }

    // Eliminar la provincia
    await Province.findByIdAndDelete(provinceId);

    res.json({
      ok: true,
      msg: "¡Provincia eliminada correctamente!",
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
  getProvinces,
  createProvince,
  updateProvince,
  deleteProvince,
};
