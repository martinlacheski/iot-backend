const { response } = require("express");
const Country = require("../models/Country");
const Province = require("../models/Province");

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

const createCountry = async (req, res = response) => {
  const country = new Country(req.body);
  try {
    // Verificar si el país ya existe
    const countryExists = await Country.findOne({ name: country.name });
    if (countryExists) {
      return res.status(400).json({
        ok: false,
        msg: "El país ya existe.",
      });
    }

    const countryDB = await country.save();
    res.json({
      ok: true,
      country: countryDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor.",
    });
  }
};

const updateCountry = async (req, res = response) => {
  const countryId = req.params.id;

  try {
    // Verificar si el país existe
    let countryExists = await Country.findById(countryId);
    if (!countryExists) {
      return res.status(404).json({
        ok: false,
        msg: "El país no existe.",
      });
    }

    // Verificar si el nombre del país ya existe
    countryExists = await Country.findOne({ name: req.body.name });
    if (countryExists) {
      return res.status(400).json({
        ok: false,
        msg: "El nombre del país ya existe.",
      });
    }

    // Obtenemos los datos a actualizar
    const newCountry = {
      ...req.body,
    };

    // Actualizamos el país
    const updatedCountry = await Country.findByIdAndUpdate(
      countryId,
      newCountry,
      { new: true }
    );

    // Devolvemos la respuesta
    res.json({
      ok: true,
      msg: "País actualizado.",
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

const deleteCountry = async (req, res = response) => {
  const countryId = req.params.id;
  try {
    // Verificar si el país existe
    let countryExists = await Country.findById(countryId);
    if (!countryExists) {
      return res.status(404).json({
        ok: false,
        msg: "El país no existe.",
      });
    }

    // Verificar si el país tiene provincias
    const provinces = await Province.find({ country: countryId });
    if (provinces.length > 0) {
        return res.status(400).json({
            ok: false,
            msg: "El país tiene provincias asociadas.",
        });
    }

    // Eliminamos el país
    await Country.findByIdAndDelete(countryId);

    // Devolvemos la respuesta
    res.json({
      ok: true,
      msg: "País eliminado.",
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
