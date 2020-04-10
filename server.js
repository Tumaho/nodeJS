'use strict';
var weather = require('./weather');
var trails = require('./trails.js');
var movies = require('./movies.js');
var yelp = require('./yelp.js');

const exp = require('express');

const cors = require('cors');

const pg = require('pg');

const superagent = require('superagent');
exports.superagent = superagent;
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const client = new pg.Client(process.env.DATABASE_URL);
const server = exp();

server.use(cors());


server.get('/location', (req, res) => {
    const place = req.query.city;
    let SQL = `SELECT * FROM locations WHERE search_query ='${place}'`;
    client.query(SQL)
        .then(data => {
            if (data.rows.length > 0) {
                res.send(data.rows[0]);
            }
            else {
                const key = process.env.GEOCODE_API_KEY;
                const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${place}&format=json`;
                superagent.get(url)
                    .then(geoD => {
                        const myData = new locationCons(place, geoD.body);
                        res.send(myData);
                        let SQL = `INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4)`;
                        let safe = [myData.search_query,myData.formatted_query,myData.latitude,myData.longitude];
                        client.query(SQL,safe)
                        .then(data =>{
                            console.log(data.rows[0]);
                            
                        })
                    })
            }
        })



})

function locationCons(city, geoD) {
    this.search_query = city;
    this.formatted_query = geoD[0].display_name;
    this.latitude = geoD[0].lat;
    this.longitude = geoD[0].lon;
}


server.get('/weather', (req, res) => {
    const place = req.query.search_query;
    weather.weatherFun(req,res,place);



})




server.get('/trails', (req, res) => {

    
    const lat = req.query.latitude;
    const lon = req.query.longitude;
    trails.trailsFun(res,lat,lon);
    

});




server.get('/movies', (req, res) => {

    const movie = req.query.search_query;
    movies.moviesFun(res,movie);

});



server.get('/yelp', (req, res) => {
    const city = req.query.search_query;
    yelp.yelpFun(res,city);
    

});








client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(PORT);
        });
    });



server.use((req, res) => {
    res.status(500).send('Sorry, something went wrong')
});
