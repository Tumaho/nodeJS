'use strict';
const allData = require('./server.js');

allData.server.get('/location', (req, res) => {
    const place = req.query.city;
    let SQL = `SELECT * FROM locations WHERE search_query ='${place}'`;
    allData.client.query(SQL)
        .then(data => {
            if (data.rows.length > 0) {
                res.send(data.rows[0]);
            }
            else {
                const key = process.env.GEOCODE_API_KEY;
                const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${place}&format=json`;
                allData.superagent.get(url)
                    .then(geoD => {
                        const myData = new locationCons(place, geoD.body);
                        res.send(myData); 
                        let SQL = `INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4)`;
                        let safe = [myData.search_query,myData.formatted_query,myData.latitude,myData.longitude];
                        allData.client.query(SQL,safe)
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