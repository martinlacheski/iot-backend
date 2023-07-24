const { response } = require("express");
const Province = require("../models/Province");
const Country = require("../models/Country");

const getProvinces = async (req, res = response) => {
  try {
    const provinces = await Province.find();
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

const createProvince = async (req, res = response) => {
    const province = new Province(req.body);
    try {
        province.country = req.body.countryId;

        // Verificar si el país existe
        const countryExists = await Country.findById(province.country);
        if (!countryExists) {
            return res.status(404).json({
                ok: false,
                msg: "El país no existe.",
            });
        }

        // Verificar si la provincia ya existe en el país
        let provinceExists = await Province.findOne({ name: province.name, country: province.country });
        if (provinceExists) {
            return res.status(400).json({
                ok: false,
                msg: "La provincia ya existe en el país.",
            });
        }

        const provinceDB = await province.save();

        res.json({
            ok: true,
            msg: "Provincia creada correctamente.",
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

const updateProvince = async (req, res = response) => {
    const provinceId = req.params.id;

    try {
        // Verificar si la provincia existe
        let provinceExists = await Province.findById(provinceId);
        if (!provinceExists) {
            return res.status(404).json({
                ok: false,
                msg: "La provincia no existe.",
            });
        }

        // Verificar si el nombre de la provincia ya existe en el país
        provinceExists = await Province.findOne({ name: req.body.name, country: req.body.countryId });

        if (provinceExists) {
            return res.status(400).json({
                ok: false,
                msg: "La provincia ya existe en el país.",
            });
        }

        const newProvince = {
            ...req.body,
            country: req.body.countryId
        };

        const provinceDB = await Province.findByIdAndUpdate(provinceId, newProvince, { new: true });

        res.json({
            ok: true,
            msg: "Provincia actualizada correctamente.",
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

const deleteProvince = async (req, res = response) => {
    const provinceId = req.params.id;

    try {
        // Verificar si la provincia existe
        let provinceExists = await Province.findById(provinceId);
        if (!provinceExists) {
            return res.status(404).json({
                ok: false,
                msg: "La provincia no existe.",
            });
        }

        await Province.findByIdAndDelete(provinceId);

        res.json({
            ok: true,
            msg: "Provincia eliminada correctamente.",
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
    deleteProvince
};
