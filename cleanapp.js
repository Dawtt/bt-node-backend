const app = require('express')();
const routes = require('./routes');


// 'dotenv' is imported in package.json, and used for .env configuration in development.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
    console.log("dotenv is being required.")
}

//  Connect all our routes to our application
app.use('/', routes);







app.listen(8888, () => {
    console.log('cleanapp listening on port 8888');
});