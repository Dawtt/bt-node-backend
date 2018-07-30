const data = require('../../data/cardata.json');

module.exports = (req, res) => {
    const cars = data.cars;

    res.status(200).json({ cars });
};