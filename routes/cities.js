var express = require('express');
var router = express.Router();
var request = require("request");



router.get('/cities', function(req, res) {
    const cities = [
        {name: 'New York City', population: 8175133},
        {name: 'Los Angeles',   population: 3792621},
        {name: 'Chicago',       population: 2695598}
    ]
    res.json(cities)
});

module.exports = router;