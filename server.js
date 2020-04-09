'use strict';

const exp = require('express');

const cors = require('cors');

const pg = require('pg');

const superagent = require('superagent');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const client = new pg.Client(process.env.DATABASE_URL);
const server = exp();

server.use(cors());

// const key=process.env.GEOCODE_API_KEY;
//     const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${place}&format=json`;
//     superagent.get(url)
//     .then(geoD =>{
//         const myData = new locationCons(place, geoD.body);
//         res.send(myData);
//     })

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
    let arr = [];
    const key = process.env.WEATHER_KEY;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${place}&key=${key}`;
    superagent.get(url)
        .then(weatherFile => {
            weatherFile.body.data.map((val, i) => {
                let description = val.weather.description;
                let date = val.valid_date;
                let m = new weatherData(description, date);
                arr.push(m);
            })
            res.send(arr);
        })



})

function weatherData(description, date) {

    this.forecast = description;
    this.time = date;

}


server.get('/trails', (req, res) => {

    let arr = [];
    const key = process.env.TRAIL_API_KEY;
    const lat = req.query.latitude;
    console.log('hhhhhhhhhhhhhhhhhhhhhhhhh', lat);
    const lon = req.query.longitude;
    const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=200&key=${key}`;
    superagent.get(url)
        .then(trailsData => {
            trailsData.body.trails.map(val => {
                let tr = new trailsObject(val);
                arr.push(tr);
            })
            res.send(arr);
        })

});

function trailsObject(val) {
    this.name = val.name;
    this.location = val.location;
    this.length = val.length;
    this.stars = val.stars;
    this.starVotes = val.starVotes;
    this.summary = val.summary;
    this.trail_url = val.url;
    this.conditions = val.conditionDetails;
    this.condition_date = val.conditionDate.substring(0, 11);
    this.condition_time = val.conditionDate.substring(11);
}


server.get('/movies', (req, res) => {

    let arr = [];
    const key = process.env.MOVIE_API_KEY;
    const movie = req.query.search_query;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${movie}`;
    superagent.get(url)
        .then(moviesData => {
            
            moviesData.body.results.map(val => {
                
                let x = new moviesObject(val);
                arr.push(x);
            })
            res.send(arr);
        })

});

function moviesObject(val) {
    this.title = val.title;
    
    this.overview = val.overview;
    this.average_votes = val.vote_average;
    this.total_votes = val.vote_count;
    this.image_url = val.poster_path;
    this.popularity = val.popularity;
    this.released_on = val.release_date;
    
}

server.get('/yelp', (req, res) => {

    let arr = [];
    const city = req.query.search_query;
    const url = `https://api.yelp.com/v3/businesses/search?location=${city}`;
    superagent.get(url)
        .set({ 'Authorization':`Bearer ${process.env.YELP_API_KEY}`})
        .then(yelpData => {
            
            yelpData.body.businesses.map(val => {
                
                let x = new yelpObject(val);
                arr.push(x);
            })
            res.send(arr);
        })

});

function yelpObject(val) {
    this.title = val.name;
    this.image_url = val.image_url;
    this.price = val.price;
    this.rating = val.rating;
    this.url = val.url;
    
}






client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(PORT);
        });
    });



server.use((req, res) => {
    res.status(500).send('Sorry, something went wrong')
});
