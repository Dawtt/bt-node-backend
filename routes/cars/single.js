const data = require('../../data/cardata.json');

module.exports = (req, res) => {
    const carId = req.params.carId * 1;
    const car = data.cars.find(c => c.id === carId);

    res.status(200).json({ car });
};