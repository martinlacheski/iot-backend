const { response } = require("express");
const Province = require("../models/Province");
const City = require("../models/City");

const getCities = async (req, res = response) => {
  try {
    const cities = await City.find();
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

const createCity = async (req, res = response) => {
  const city = new City(req.body);
  try {
    city.province = req.body.provinceId;

    // Verificar si la provincia existe
    const provinceExists = await Province.findById(city.province);
    if (!provinceExists) {
      return res.status(404).json({
        ok: false,
        msg: "La provincia no existe.",
      });
    }

    // Verificar si la ciudad ya existe en la provincia
    let cityExists = await City.findOne({
      name: city.name,
      province: city.province,
    });

    if (cityExists) {
      return res.status(400).json({
        ok: false,
        msg: "La ciudad ya existe en la provincia.",
      });
    }

    const cityDB = await city.save();

    res.json({
      ok: true,
      msg: "Ciudad creada correctamente.",
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

const updateCity = async (req, res = response) => {
    const cityId = req.params.id;
  
    try {
      // Verificar si la ciudad existe
      let city = await City.findById(cityId);
      if (!city) {
        return res.status(404).json({
          ok: false,
          msg: "La ciudad no existe.",
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
          msg: "La ciudad ya existe en la provincia.",
        });
      }
  
      const newCity = {
        ...req.body,
        province: req.body.provinceId,
      };
  
      // Utilizar findOneAndUpdate y runValidators: true
      const cityDB = await City.findOneAndUpdate(
        { _id: cityId },
        newCity,
        { new: true, runValidators: true }
      );
  
      res.json({
        ok: true,
        msg: "Ciudad actualizada correctamente.",
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
  

const deleteCity = async (req, res = response) => {
  const cityId = req.params.id;

  try {
    // Verificar si la ciudad existe
    let cityExists = await City.findById(cityId);
    if (!cityExists) {
      return res.status(404).json({
        ok: false,
        msg: "La ciudad no existe.",
      });
    }

    await City.findByIdAndDelete(cityId);

    res.json({
      ok: true,
      msg: "Ciudad eliminada correctamente.",
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
