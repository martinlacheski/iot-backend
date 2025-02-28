const { response } = require("express");
const City = require("../../models/admin/City");
const Organization = require("../../models/admin/Organization");
const { Types } = require("mongoose");

/**
 * OBTENER LA PRIMERA ORGANIZACIÓN
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Response} - La respuesta con un array de organizaciones o un mensaje de error en caso de fallo.
 */
const getOrganization = async (req, res = response) => {
  try {
    const organization = await Organization.findOne().populate({
      path: "city",
      select: "name",
    });
    res.json({
      ok: true,
      organization,
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
 * Actualizar una organización.
 * @param {Request} req - La solicitud HTTP entrante.
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} - La respuesta con la organización actualizada o un mensaje de error en caso de fallo.
 */
const updateOrganization = async (req, res = response) => {
  const organizationId = req.params.id;
  const { cityId } = req.body;

  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().toUpperCase();
    }
  }

  try {
    // Verificar si el ID de la organización es válido
    if (!Types.ObjectId.isValid(organizationId)) {
      return res.status(400).json({
        ok: false,
        msg: "ID de organización inválido.",
      });
    }

    // Verificar si la organización existe
    let organization = await Organization.exists({ _id: organizationId });
    if (!organization) {
      return res.status(404).json({
        ok: false,
        msg: "La organización que desea actualizar no existe.",
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
    const cityExists = await City.exists({ _id: cityId });
    if (!cityExists) {
      return res.status(404).json({
        ok: false,
        msg: "La ciudad a la que desea asignar la organización no existe.",
      });
    }

    // Verificar si la organización ya existe en la ciudad
    organization = await Organization.findOne({
      name: req.body.name,
      city: cityId,
      _id: { $ne: organizationId },
    });
    if (organization) {
      return res.status(400).json({
        ok: false,
        msg: "La organización ya existe en la ciudad.",
      });
    }

    const newOrganization = {
      ...req.body,
      city: cityId,
    };

    const organizationUpdated = await Organization.findByIdAndUpdate(
      organizationId,
      newOrganization,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "¡Organización actualizada correctamente!",
      organization: organizationUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

const uploadLogoOrganization = async (req, res = response) => {
  return res.json({
    ok: true,
    msg: "¡Logo subido correctamente!",
    fileName: req.file.filename,
    file: req.file,
  });
};

module.exports = {
  getOrganization,
  updateOrganization,
  uploadLogoOrganization,
};
