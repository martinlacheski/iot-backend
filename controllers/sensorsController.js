const { response } = require("express");
const Sensor = require("../models/Sensor");
const TypeOfSensor = require("../models/TypeOfSensor");
const Board = require("../models/Board");

const getSensors = async (req, res = response) => {
    try {
        const sensors = await Sensor.find();
        res.json({
            ok: true,
            sensors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor.",
        });
    }
};

const createSensor = async (req, res = response) => {
    const sensor = new Sensor(req.body);

    try {
        sensor.typeOfSensor = req.body.typeOfSensorId;
        sensor.board = req.body.boardId;

        // Verificar si el tipo de sensor existe
        const typeOfSensorExists = await TypeOfSensor.findById(sensor.typeOfSensor);
        if (!typeOfSensorExists) {
            return res.status(404).json({
                ok: false,
                msg: "El tipo de sensor no existe.",
            });
        }

        // Verificar si la placa existe
        const boardExists = await Board.findById(sensor.board);
        if (!boardExists) {
            return res.status(404).json({
                ok: false,
                msg: "La placa no existe.",
            });
        }

        // Verificar si el sensor ya existe
        let sensorExists = await Sensor.findOne({
            name: sensor.name,
            board: sensor.board,
        });

        if (sensorExists) {
            return res.status(400).json({
                ok: false,
                msg: "El sensor ya existe en la placa.",
            });
        }

        // Guardar sensor
        await sensor.save();
        res.json({
            ok: true,
            msg: "Sensor creado correctamente.",
            sensor,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor.",
        });
    }
};

const updateSensor = async (req, res = response) => {
    const sensorId = req.params.id;

    try {
        // Verificar si el sensor existe
        let sensorExists = await Sensor.findById(sensorId);
        if (!sensorExists) {
            return res.status(404).json({
                ok: false,
                msg: "El sensor no existe.",
            });
        }

        // Verificar si el tipo de sensor existe
        let typeOfSensorExists = TypeOfSensor.findById(req.body.typeOfSensorId);
        if (!typeOfSensorExists) {
            return res.status(404).json({
                ok: false,
                msg: "El tipo de sensor no existe.",
            });
        }

        // Verificar si la placa existe
        let board = Board.findById(req.body.boardId);
        if (!board) {
            return res.status(404).json({
                ok: false, 
                msg: "La placa no existe.",
            });
        }

        // Verificar si el sensor ya existe en la placa
        let sensorExistsInBoard = await Sensor.findOne({
            name: req.body.name,
            board: req.body.boardId,
        });
        if (sensorExistsInBoard && sensorExistsInBoard.id !== sensorId) {
            return res.status(400).json({
                ok: false,
                msg: "El sensor ya existe en la placa.",
            });
        }

        // Actualizar sensor
        const newSensor = {
            ...req.body,
            typeOfSensor: req.body.typeOfSensorId,
            board: req.body.boardId,
        };

        const sensorDB = await Sensor.findByIdAndUpdate(sensorId, newSensor, { new: true });

        res.json({
            ok: true,
            msg: "Sensor actualizado correctamente.",
            sensor: sensorDB,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor.",
        });
    }
};

const deleteSensor = async (req, res = response) => {
    const sensorId = req.params.id;

    try {
        // Verificar si el sensor existe
        const sensorExists = await Sensor.findById(sensorId);
        if (!sensorExists) {
            return res.status(404).json({
                ok: false,
                msg: "El sensor no existe.",
            });
        }

        // Eliminar sensor
        await Sensor.findByIdAndDelete(sensorId);

        res.json({
            ok: true,
            msg: "Sensor eliminado correctamente.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor.",
        });
    }
}

module.exports = {
    getSensors,
    createSensor,
    updateSensor,
    deleteSensor,
};