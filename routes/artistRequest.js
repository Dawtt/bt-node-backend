var express = require('express');
var router = express.Router();
var request = require("request");

/*
router.get('/artistRequest', function(req, res) {
    const cities = [
        {name: 'New York City', population: 8175133},
        {name: 'Los Angeles',   population: 3792621},
        {name: 'Chicago',       population: 2695598}
    ]
    res.json(cities)
*/


router.get('/artistRequest/:id', function(req, res) {
        res.get('id is set to ' + req.params.id);
    });
    // was res.get() before
// GET /p/5
// tagId is set to 5


function requestJSON(requestURL) {

    // Retrieve an array of example JSON documents from an external source
    // e.g. mockaroo.com. Returns a promise that either resolves to the results
    // from the JSON service or rejects with the received error.

    return new Promise(function (resolve, reject){

        // Mockaroo can have problems with https - this is random sample data so by
        // definition shouldn't need to be private
        let finalDocURL = requestURL.replace('https', 'http');

        request({url: finalDocURL, json: true}, function (error, response, body) {
            if (error || response.statusCode != 200) {
                console.log("Failed to fetch documents: " + error.message);
                reject(error.message);
            } else {
                resolve(body);
            }
        })
    })
}


module.exports = router;