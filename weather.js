'use strict';
let allData = require('./server.js');
module.exports.weatherFun=function(req,res,place){
    let arr = [];
    const key = process.env.WEATHER_KEY;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${place}&key=${key}`;
    let x= allData.superagent.get(url)
        .then(weatherFile => {

            weatherFile.body.data.map((val, i) => {
                let description = val.weather.description;
                let date = val.valid_date;
                let m = new weatherData(description, date);
                arr.push(m);
            })
            res.send(arr);
            
        })
    
    }

function weatherData(description, date) {

        this.forecast = description;
        this.time = date;
    
}