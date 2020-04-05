'use strict';

const exp = require('express');

const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = exp();

server.use(cors());


server.get('/location', (req, res) => {
    const geoD = require('./data/geo.json');
    const place = req.query.city;
    const myData = new locationCons(place, geoD);
    res.send(myData);

})

function locationCons(city, geoD) {
    this.search_query = city;
    this.formatted_query = geoD[0].display_name;
    this.latitude = geoD[0].lat;
    this.longitude = geoD[0].lon;
}


server.get('/weather', (req, res) => {
    const weatherFile = require('./data/weather.json');
    let arr=[];
    weatherFile.data.forEach((val, i) => {
        let description = val.weather.description;
        let date = val.valid_date;
        let m = new weatherData(description, date);
        arr.push(m);
        handling();

    })
    res.send(arr);
    

})

function weatherData(description, date) {
    this.forecast = description;
    this.time=date;

}
server.listen(PORT, () => {
    console.log(PORT);
});

function handling(){
server.use((req,res)=>{
    res.status(500).send('Sorry, something went wrong')
});
}