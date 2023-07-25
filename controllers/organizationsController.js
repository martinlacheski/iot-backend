const { response } = require("express");
const City = require("../models/City");
const Organization = require("../models/Organization");

const getOrganizations = async (req, res = response) => {
  try {
    const organizations = await Organization.find();
    res.json({
      ok: true,
      organizations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

const createOrganization = async (req, res = response) => {
  const organization = new Organization(req.body);
  try {
    organization.city = req.body.cityId;

    // Verificar si la ciudad existe
    const cityExists = await City.findById(organization.city);
    if (!cityExists) {
      return res.status(404).json({
        ok: false,
        msg: "La ciudad no existe.",
      });
    }

    // Verificar si la organización ya existe en la ciudad
    let organizationExists = await Organization.findOne({
      name: organization.name,
      city: organization.city,
    });
    if (organizationExists) {
      return res.status(400).json({
        ok: false,
        msg: "La organización ya existe en la ciudad.",
      });
    }

    const organizationDB = await organization.save();

    res.json({
      ok: true,
      msg: "Organización creada correctamente.",
      organization: organizationDB,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

const updateOrganization = async (req, res = response) => {
  const organizationId = req.params.id;

  try {
    // Verificar si la organización existe
    const organizationExists = await Organization.findById(organizationId);
    if (!organizationExists) {
      return res.status(404).json({
        ok: false,
        msg: "La organización no existe.",
      });
    }

    // Verificar si la ciudad existe
    const cityExists = await City.findById(req.body.cityId);
    if (!cityExists) {
      return res.status(404).json({
        ok: false,
        msg: "La ciudad no existe.",
      });
    }

    // Verificar si la organización ya existe en la ciudad
    let organization = await Organization.findOne({
      name: req.body.name,
      city: req.body.cityId,
    });
    if (organization && organization._id != organizationId) {
      return res.status(400).json({
        ok: false,
        msg: "La organización ya existe en la ciudad.",
      });
    }

    const newOrganization = {
      ...req.body,
      city: req.body.cityId,
    };

    const organizationUpdated = await Organization.findByIdAndUpdate(
      organizationId,
      newOrganization,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "Organización actualizada correctamente.",
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

const deleteOrganization = async (req, res = response) => {
  const organizationId = req.params.id;

  try {
    // Verificar si la organización existe
    const organizationExists = await Organization.findById(organizationId);
    if (!organizationExists) {
      return res.status(404).json({
        ok: false,
        msg: "La organización no existe.",
      });
    }

    await Organization.findByIdAndDelete(organizationId);

    res.json({
      ok: true,
      msg: "Organización eliminada correctamente.",
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
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
