const data = require('../../data/cardata.json');

module.exports = (req, res) => {
    const models = data.models;

    res.status(200).json({ models });
};