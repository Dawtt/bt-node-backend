const routes = require('express').Router();

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' });
});



const cities = require('./cities');
routes.get('/cities', cities);
//const artistRequest = require('.artistRequest');


const models = require('./models');
routes.use('/models', models);

const cars = require('./cars');
routes.use('/cars', cars);


const spotify = require('./spotify');
routes.use('/spotify', spotify);



module.exports = routes;