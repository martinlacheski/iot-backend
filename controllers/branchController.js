const { response } = require("express");
const Branch = require("../models/Branch");
const Organization = require("../models/Organization");
const City = require("../models/City");
const Environment = require("../models/Environment");
const { Types } = require("mongoose");

/**
 * Obtener todas las sedees.
 * @param {*} req - Objeto de solicitud.
 * @param {*} res - Objeto de respuesta.
 * @returns {Promise<void>} - La respuesta con un array de sedees o un mensaje de error en caso de fallo.
 */
const getBranches = async (req, res = response) => {
  try {
    const branches = await Branch.find().populate("organization", "name").populate("city", "name");
    res.json({
      ok: true,
      branches,
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
 * Crear una nueva sede.
 * @param {*} req - Objeto de solicitud.
 * @param {*} res - Objeto de respuesta.
 * @returns {Promise<void>} - La respuesta con la sede creada o un mensaje de error en caso de fallo.
 */
const createBranch = async (req, res = response) => {
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }

  const { name, organizationId, cityId } = req.body;
  try {
    // Verificar si el ID de la organización es válido
    if (!Types.ObjectId.isValid(organizationId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de organización inválido.",
      });
    }

    // Verificar si la organización existe
    const organizationExists = await Organization.findById(organizationId);
    if (!organizationExists) {
      return res.status(404).json({
        ok: false,
        msg: "La organización que se quiere asignar la sede no existe.",
      });
    }

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
        msg: "La ciudad que se quiere asignar la sede no existe.",
      });
    }

    // Verificar si la sede ya existe en la ciudad y organización
    let branchExists = await Branch.findOne({
      name,
      city: cityId,
      organization: organizationId,
    });
    if (branchExists) {
      return res.status(400).json({
        ok: false,
        msg: "¡La sede ya existe en la ciudad y organización!",
      });
    }

    const newBranch = new Branch({
      ...req.body,
      organization: organizationId,
      city: cityId,
    });

    const branchDB = await newBranch.save();

    res.json({
      ok: true,
      msg: "¡Sede creada correctamente!",
      branch: branchDB,
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
 * Actualizar una sede.
 * @param {*} req - Objeto de solicitud.
 * @param {*} res - Objeto de respuesta.
 * @returns {Promise<void>} - La respuesta con la sede actualizada o un mensaje de error en caso de fallo.
 */
const updateBranch = async (req, res = response) => {
  const branchId = req.params.id;
  const { organizationId, cityId, name } = req.body;
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }

  try {

    // Verificar si el ID de la sede es válido
    if (!Types.ObjectId.isValid(branchId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de sede inválido.",
      });
    }

    // Verificar si la sede existe
    let branchExists = await Branch.findById(branchId);
    if (!branchExists) {
      return res.status(404).json({
        ok: false,
        msg: "La sede que se quiere actualizar no existe.",
      });
    }

    // Verificar si el ID de la organización es válido
    if (!Types.ObjectId.isValid(organizationId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de organización inválido.",
      });
    }

    // Verificar si la organización existe
    const organizationExists = await Organization.findById(organizationId);
    if (!organizationExists) {
      return res.status(404).json({
        ok: false,
        msg: "La organización no existe.",
      });
    }

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

    // Verificar si la sede ya existe en la ciudad y organización
    branchExists = await Branch.findOne({
      name,
      city: cityId,
      organization: organizationId,
      _id: { $ne: branchId },
    });
    if (branchExists) {
      return res.status(400).json({
        ok: false,
        msg: "¡La sede ya existe en la ciudad y organización!",
      });
    }

    const newBranch = {
      ...req.body,
      organization: organizationId,
      city: cityId,
    };

    const branchDB = await Branch.findOneAndUpdate(
      { _id: branchId },
      newBranch,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "¡Sede actualizada correctamente!",
      branch: branchDB,
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
 * Eliminar una sede.
 * @param {*} req - Objeto de solicitud.
 * @param {*} res - Objeto de respuesta.
 * @returns {Promise<void>} - La respuesta con un mensaje de éxito o un mensaje de error en caso de fallo.
 */
const deleteBranch = async (req, res = response) => {
  const branchId = req.params.id;

  try {

    // Verificar si el ID de la sede es válido
    if (!Types.ObjectId.isValid(branchId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de sede inválido.",
      });
    }

    // Verificar si la sede existe
    const branchExists = await Branch.findById(branchId);
    if (!branchExists) {
      return res.status(404).json({
        ok: false,
        msg: "La sede que se quiere eliminar no existe.",
      });
    }

    // Verificar si la sede está siendo referenciada en la colección "Environment"
    const branchReferenced = await Environment.exists({ branch: branchId });
    if (branchReferenced) {
      return res.status(400).json({
        ok: false,
        msg: "¡La sede está siendo referenciada en algún ambiente!",
      });
    }

    await Branch.updateOne({ _id: branchId }, { isDeleted: true });

    res.json({
      ok: true,
      msg: "¡Sede eliminada correctamente!",
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
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
};
