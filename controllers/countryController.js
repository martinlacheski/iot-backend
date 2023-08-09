const { response } = require("express");
const Country = require("../models/Country");
const Province = require("../models/Province");
const { Types } = require("mongoose");

/**
 * Obtiene todos los países de la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de búsqueda es completada.
 */
const getCountries = async (req, res = response) => {
  try {
    const countries = await Country.find();
    res.json({
      ok: true,
      countries,
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
 * Crea un nuevo país y lo guarda en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de creación es completada.
 */
const createCountry = async (req, res = response) => {
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }
  try {
    const countryDB = await new Country(req.body).save();
    res.json({
      ok: true,
      msg: "¡País creado exitosamente!",
      country: countryDB,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        ok: false,
        msg: "El país que intenta crear ya existe.",
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
 *  Actualiza un país existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de actualización es completada.
 */
const updateCountry = async (req, res = response) => {
  const countryId = req.params.id;
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }
  try {
    if (!Types.ObjectId.isValid(countryId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de país inválido.",
      });
    }

    // Verificar si el país existe por ID
    let country = await Country.findById(countryId);
    if (!country) {
      return res.status(404).json({
        ok: false,
        msg: "El país que intenta actualizar no existe.",
      });
    }

    // Verificar si el nombre del país ya existe (si se está actualizando)
    if (req.body.name !== country.name) {
      const countryExists = await Country.findOne({ name: req.body.name });
      if (countryExists) {
        return res.status(400).json({
          ok: false,
          msg: "¡El nombre del país al que intenta actualizar ya existe!",
        });
      }
    }

    // Solo actualizamos los campos necesarios (en este caso, todos los campos)
    const updatedCountry = await Country.findByIdAndUpdate(
      countryId,
      req.body,
      { new: true }
    );

    // Devolvemos la respuesta
    res.json({
      ok: true,
      msg: "¡País actualizado correctamente!",
      country: updatedCountry,
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
 * Elimina un país existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de eliminación es completada.
 */
const deleteCountry = async (req, res = response) => {
  const countryId = req.params.id;

  try {
    // Verificar si el ID del país es válido
    if (!Types.ObjectId.isValid(countryId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de país inválido.",
      });
    }

    // Verificar si el país existe (Middleware sugerido)
    const country = await Country.findById(countryId);
    if (!country) {
      return res.status(404).json({
        ok: false,
        msg: "El país que intenta eliminar no existe.",
      });
    }

    // Verificar si el país tiene provincias asociadas (Middleware sugerido)
    const isReferencedInProvince = await Province.exists({
      country: countryId,
    });
    if (isReferencedInProvince) {
      return res.status(400).json({
        ok: false,
        msg: "¡El país que intenta eliminar tiene provincias asociadas!",
      });
    }

    // Eliminamos el país
    await Country.updateOne({ _id: countryId }, { isDeleted: true });

    // Devolvemos la respuesta con el país eliminado (opcional)
    res.json({
      ok: true,
      msg: "¡País eliminado correctamente!",
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
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
};
