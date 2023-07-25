const { response } = require("express");
const Branch = require("../models/Branch");
const Organization = require("../models/Organization");
const City = require("../models/City");

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

const createBranch = async (req, res = response) => {
  const branch = new Branch(req.body);
  try {
    branch.organization = req.body.organizationId;
    branch.city = req.body.cityId;

    // Verificar si la organización existe
    const organizationExists = await Organization.findById(branch.organization);
    if (!organizationExists) {
      return res.status(404).json({
        ok: false,
        msg: "La organización no existe.",
      });
    }

    // Verificar si la ciudad existe
    const cityExists = await City.findById(branch.city);
    if (!cityExists) {
      return res.status(404).json({
        ok: false,
        msg: "La ciudad no existe.",
      });
    }

    // Verificar si la sucursal ya existe en la ciudad
    let branchExists = await Branch.findOne({
      name: branch.name,
      city: branch.city,
    });
    if (branchExists) {
      return res.status(400).json({
        ok: false,
        msg: "La sucursal ya existe en la ciudad.",
      });
    }

    // Verificar si la sucursal ya existe en la organización
    branchExists = await Branch.findOne({
      name: branch.name,
      organization: branch.organization,
    });
    if (branchExists) {
      return res.status(400).json({
        ok: false,
        msg: "La sucursal ya existe en la organización.",
      });
    }

    const branchDB = await branch.save();

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

const updateBranch = async (req, res = response) => {
  const branchId = req.params.id;

  try {
    // Verificar si la sucursal existe
    let branchExists = await Branch.findById(branchId);
    if (!branchExists) {
      return res.status(404).json({
        ok: false,
        msg: "La sucursal no existe.",
      });
    }

    // Verificar si la organización existe
    const organizationExists = await Organization.findById(
      req.body.organizationId
    );
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

    // Verificar si la sucursal ya existe en la ciudad
    branchExists = await Branch.findOne({
      name: req.body.name,
      city: req.body.cityId,
    });
    if (branchExists && branchExists.id !== branchId) {
      return res.status(400).json({
        ok: false,
        msg: "La sucursal ya existe en la ciudad.",
      });
    }

    // Verificar si la sucursal ya existe en la organización
    branchExists = await Organization.findOne({
      name: req.body.name,
      organization: req.body.organizationId,
    });
    if (branchExists && branchExists.id !== branchId) {
      return res.status(400).json({
        ok: false,
        msg: "La sucursal ya existe en la organización.",
      });
    }

    const newBranch = {
      ...req.body,
      organization: req.body.organizationId,
      city: req.body.cityId,
    };

    const branchDB = await Branch.findByIdAndUpdate(branchId, newBranch, {
      new: true,
    });

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

const deleteBranch = async (req, res = response) => {
  const branchId = req.params.id;

  try {
    // Verificar si la sucursal existe
    const branchExists = await Branch.findById(branchId);
    if (!branchExists) {
      return res.status(404).json({
        ok: false,
        msg: "La sucursal no existe.",
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
