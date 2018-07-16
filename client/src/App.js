/*some function descriptions from https://medium.com/@jonnykalambay/now-playing-using-spotifys-awesome-api-with-react-7db8173a7b13*/

import React, { Component, Fragment } from 'react';
import './App.css';
import { Header, Footer, Exercises, Dave} from './Components/Layouts/index.js';
import CssBaseline from '@material-ui/core/CssBaseline';
import SpotifyWebApi from 'spotify-web-api-js';
import 'typeface-roboto';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import secrets from 'secretsconfigclient';

//import logo from './logo.svg';
//import Papp from './Components/PApp.js';
//import GoogleLogin from 'react-google-login';
//import spotifyMethods from './spotifyMethods';




const spotifyApi = new SpotifyWebApi();
var playlistJsonTemplate = {employees: [], attributes: [], pageSize: 2, links: {}};


class App extends Component {
    constructor(){
        super();
        const params = this.getHashParams();
        const token = params.access_token;
        if (token) {
            /*Instead of manually coding our API requests, we’re going to use a library, which was created by José M. Pérez, a Spotify engineer, that abstracts pretty much every API call we could need.*/
            spotifyApi.setAccessToken(token);
        }
        this.state = {
            loggedIn: token ? true : false,
            nowPlaying: {name: '', albumArt: ''},
            currentuser: {id: '', name: '',},
            //additions
            cities: {cities: []}
        }


    }

    /*Now we just need to pull the token from the query sting into our react app and we can use it. There are many ways to do this, but I’m lazy so I copied the function getHashParams from the example code that we cloned (found in auth-server/authorization_code/public/index.html), and made a slight change just to silence create-react-app’s picky linter. The function returns an object with the parameters as properties.*/
    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        e = r.exec(q);
        while (e) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
            e = r.exec(q);
        }
        return hashParams;
    }
    /*Write a function called getNowPlaying inside of the App Class to make the API request. This function will use the one of the many spotify Api methods to make a request and creates a promise. We then use the response data to set state. The code below is already structured access the right data in the response, but I highly suggest you experiment by looking at the entire response object, either by logging it to the console or by checking the network tab in your dev tools*/
    getNowPlaying(){
        spotifyApi.getMyCurrentPlaybackState()
            .then((response) => {
                this.setState({
                    nowPlaying: {
                        name: response.item.name,
                        albumArt: response.item.album.images[0].url
                    }
                });
            });
        this.storeUserNameAndId();
    }

    storeUserNameAndId() {
        spotifyApi.getMe()
            .then((response) => {
                this.setState({
                    currentuser: {
                        id: response.id,
                        name: response.display_name
                    }
                });
            });
    }

    createJsonPlaylistParameter() {
        const plJSON = {
            "name": prompt('Enter Playlist Name:')
        }
        var MyJSON = JSON.stringify(plJSON);
        alert(plJSON);
        return MyJSON;
    }
    componentDidMount(){
        this.storeUserNameAndId();
    }

    doathing(){
        spotifyApi.createPlaylist(this.state.currentuser.id, this.createJsonPlaylistParameter())
    }

    render() {
        return (
            <Fragment>
                <CssBaseline />
                {/*<GoogleLogin onSuccess={} onFailure={} clientId={}/>*/}
                <Header
                    username={this.state.currentuser.name}
                />
                    <Button
                        onClick={() =>
                        this.getNowPlaying() &&
                        this.storeUserNameAndId()
                        }>
                    </Button>
                <div
                    className='App' >
                    <a href='http://localhost:8888'> Login to Spotify </a>
                </div>
                { this.state.loggedIn &&
                <Button onClick={() =>
                    this.getNowPlaying() &&
                    this.storeUserNameAndId()
                    }>
                    <Typography>
                        <div>
                            <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
                        </div>
                        <p>Now Playing: { this.state.nowPlaying.name }</p>
                        <p>Current User: { this.state.currentuser.name}</p>
                        <p>User ID: { this.state.currentuser.id}</p>

                    </Typography>
                </Button>}
                { this.state.loggedIn &&
                    <Button
                        onClick={() =>
                            this.getNowPlaying()}>
                    Check Now Playing
                    </Button>
                }
            </Fragment>
    )
    }
}

export default App;
