/**
 * CODE BASED ON SPOTIFY OFFICIAL AUTHENTICATION EXAMPLE
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow & https://github.com/spotify/web-api-auth-examples
 */

// 'dotenv' is imported in package.json, and used for .env configuration in development.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
    console.log("dotenv is being required.")
}


//    # DIFFERENT VALUES IN DEV & PRODUCTION
const port = process.env.DV_PORT || 4198; // checks local environment for port assignment, if none than use the assigned.
var redirect_uri = process.env.DV_SPOTIFY_REDIRECT_URI; // Your redirect uri
var ui_server = process.env.DV_UI_SERVER;

//    # SAME VALUES IN DEV & PRODUCTION
var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret



var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');



//  tag:  [additions]
var cities = require('./routes/cities');

/* mongodb calls
var pop = require('./routes/pop');
*/
//  tag:  end additions



/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

 var spotifyapp = express();

spotifyapp.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser())
    // additions
   //.use(logger('dev'))
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: true }))
   .use(express.static(path.join(__dirname, 'public')))
   .use('/cities', cities);

/*  mongodb
   .use('/pop', pop)
*/
// additions
spotifyapp.get('/cities', cities);


spotifyapp.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope =
      'user-read-private user-read-playback-state user-read-email playlist-modify-private playlist-read-private playlist-read-collaborative playlist-modify-public'
      ;

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

spotifyapp.get('/logout', function(req, res){

    /*
        AuthenticationClient.clearCookies(getApplication());
    */
    res.clearCookie(stateKey);
    res.redirect(ui_server); //redirect to original user - the UI server
});

spotifyapp.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(ui_server +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

spotifyapp.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});


//console.log('Listening on '+ secrets.port_listen);

spotifyapp.listen(port);
console.log(`Server is probably listening on port ${port},
    with redirect: ${redirect_uri},
`);

