const { response } = require("express");
const TypeOfEnvironment = require("../models/TypeOfEnvironment");
const { Types } = require("mongoose");

/**
 * Obtiene todos los tipos de ambientes de la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de búsqueda es completada.
 */
const getTypesOfEnvironments = async (req, res = response) => {
  try {
    const typeOfEnvironments = await TypeOfEnvironment.find();
    res.json({
      ok: true,
      typeOfEnvironments,
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
 *  Crea un nuevo tipo de ambiente y lo guarda en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns  {Promise<void>} Una promesa que se resuelve cuando la operación de creación es completada.
 */
const createTypeOfEnvironment = async (req, res = response) => {
  const typeOfEnvironment = new TypeOfEnvironment(req.body);
  try {
    const typeOfEnvironmentDB = await typeOfEnvironment.save();
    res.json({
      ok: true,
      msg: "Tipo de ambiente creado correctamente.",
      typeOfEnvironment: typeOfEnvironmentDB,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        ok: false,
        msg: "El tipo de ambiente que intenta crear ya existe.",
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
 * Actualiza un tipo de ambiente existente en la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de actualización es completada.
 */
const updateTypeOfEnvironment = async (req, res = response) => {
  const typeOfEnvironmentId = req.params.id;
  try {
    // Verificar si el ID es válido
    if (!Types.ObjectId.isValid(typeOfEnvironmentId)) {
        return res.status(404).json({
            ok: false,
            msg: 'ID del tipo de ambiente inválido.',
        });
    }

    // Verificar si el tipo de ambiente existe
    const typeOfEnvironment = await TypeOfEnvironment.findById(
      typeOfEnvironmentId
    );
    if (!typeOfEnvironment) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de ambiente no existe.",
      });
    }

    // Verificar si el tipo de ambiente ya existe
    if (req.body.name !== typeOfEnvironment.name) {
      let typeOfEnvironmentExists = await TypeOfEnvironment.findOne({
        name: req.body.name,
      });
      if (typeOfEnvironmentExists) {
        return res.status(400).json({
          ok: false,
          msg: "El tipo de ambiente que intenta actualizar ya existe.",
        });
      }
    }

    const typeOfEnvironmentUpdated = await TypeOfEnvironment.findByIdAndUpdate(
        typeOfEnvironmentId,
        req.body,
        {new: true}
    );

    res.json({
      ok: true,
      msg: "Tipo de ambiente actualizado correctamente.",
      typeOfEnvironment: typeOfEnvironmentUpdated,
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
 * Elimina un tipo de ambiente de la base de datos.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de eliminación es completada.
 */
const deleteTypeOfEnvironment = async (req, res = response) => {
  const typeOfEnvironmentId = req.params.id;

  try {
    // Verificar si el ID es válido
    if (!Types.ObjectId.isValid(typeOfEnvironmentId)) {
        return res.status(404).json({
            ok: false,
            msg: 'ID del tipo de ambiente inválido.',
        });
    }

    // Verificar si el tipo de ambiente existe
    const typeOfEnvironment = await TypeOfEnvironment.findById(typeOfEnvironmentId);
    if (!typeOfEnvironment) {
      return res.status(404).json({
        ok: false,
        msg: "El tipo de ambiente no existe.",
      });
    }

    await TypeOfEnvironment.findByIdAndDelete(typeOfEnvironmentId);

    res.json({
      ok: true,
      msg: "Tipo de ambiente eliminado correctamente.",
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
  getTypesOfEnvironments,
  createTypeOfEnvironment,
  updateTypeOfEnvironment,
  deleteTypeOfEnvironment,
};
