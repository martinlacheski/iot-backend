const { response } = require("express");
const Branch = require("../models/Branch");
const Organization = require("../models/Organization");
const City = require("../models/City");
const Environment = require("../models/Environment");
const { Types } = require("mongoose");

/**
 * Obtener todas las sucursales.
 * @param {*} req - Objeto de solicitud.
 * @param {*} res - Objeto de respuesta.
 * @returns {Promise<void>} - La respuesta con un array de sucursales o un mensaje de error en caso de fallo.
 */
const getBranches = async (req, res = response) => {
  try {
    const branches = await Branch.find();
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
 * Crear una nueva sucursal.
 * @param {*} req - Objeto de solicitud.
 * @param {*} res - Objeto de respuesta.
 * @returns {Promise<void>} - La respuesta con la sucursal creada o un mensaje de error en caso de fallo.
 */
const createBranch = async (req, res = response) => {
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
        msg: "La organización que se quiere asignar la sucursal no existe.",
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
        msg: "La ciudad que se quiere asignar la sucursal no existe.",
      });
    }

    // Verificar si la sucursal ya existe en la ciudad y organización
    let branchExists = await Branch.findOne({
      name,
      city: cityId,
      organization: organizationId,
    });
    if (branchExists) {
      return res.status(400).json({
        ok: false,
        msg: "La sucursal ya existe en la ciudad y organización.",
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
      msg: "Sucursal creada correctamente.",
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
 * Actualizar una sucursal.
 * @param {*} req - Objeto de solicitud.
 * @param {*} res - Objeto de respuesta.
 * @returns {Promise<void>} - La respuesta con la sucursal actualizada o un mensaje de error en caso de fallo.
 */
const updateBranch = async (req, res = response) => {
  const branchId = req.params.id;
  const { organizationId, cityId, name } = req.body;

  try {

    // Verificar si el ID de la sucursal es válido
    if (!Types.ObjectId.isValid(branchId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de sucursal inválido.",
      });
    }

    // Verificar si la sucursal existe
    let branchExists = await Branch.findById(branchId);
    if (!branchExists) {
      return res.status(404).json({
        ok: false,
        msg: "La sucursal que se quiere actualizar no existe.",
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

    // Verificar si la sucursal ya existe en la ciudad y organización
    branchExists = await Branch.findOne({
      name,
      city: cityId,
      organization: organizationId,
      _id: { $ne: branchId },
    });
    if (branchExists) {
      return res.status(400).json({
        ok: false,
        msg: "La sucursal ya existe en la ciudad y organización.",
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
      msg: "Sucursal actualizada correctamente.",
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
 * Eliminar una sucursal.
 * @param {*} req - Objeto de solicitud.
 * @param {*} res - Objeto de respuesta.
 * @returns {Promise<void>} - La respuesta con un mensaje de éxito o un mensaje de error en caso de fallo.
 */
const deleteBranch = async (req, res = response) => {
  const branchId = req.params.id;

  try {

    // Verificar si el ID de la sucursal es válido
    if (!Types.ObjectId.isValid(branchId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de sucursal inválido.",
      });
    }

    // Verificar si la sucursal existe
    const branchExists = await Branch.findById(branchId);
    if (!branchExists) {
      return res.status(404).json({
        ok: false,
        msg: "La sucursal que se quiere eliminar no existe.",
      });
    }

    // Verificar si la sucursal está siendo referenciada en la colección "Environment"
    const branchReferenced = await Environment.exists({ branch: branchId });
    if (branchReferenced) {
      return res.status(400).json({
        ok: false,
        msg: "La sucursal está siendo referenciada en algún ambiente.",
      });
    }

    await Branch.findByIdAndDelete(branchId);

    res.json({
      ok: true,
      msg: "Sucursal eliminada correctamente.",
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
