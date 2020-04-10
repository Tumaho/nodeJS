'use strict';
let allData = require('./server.js');
module.exports.trailsFun=function(res,lat,lon){
    let arr = [];
    const key = process.env.TRAIL_API_KEY;
    const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=200&key=${key}`;
    allData.superagent.get(url)
        .then(trailsData => {
            trailsData.body.trails.map(val => {
                let tr = new trailsObject(val);
                arr.push(tr);
            })
            res.send(arr);
        })
}

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