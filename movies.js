'use strict';
let allData = require('./server.js')
module.exports.moviesFun = function(res,movie){
    let arr = [];
    const key = process.env.MOVIE_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${movie}`;
    allData.superagent.get(url)
        .then(moviesData => {
            
            moviesData.body.results.map(val => {
                
                let x = new moviesObject(val);
                arr.push(x);
            })
            res.send(arr);
        })
}

function moviesObject(val) {
    this.title = val.title;
    
    this.overview = val.overview;
    this.average_votes = val.vote_average;
    this.total_votes = val.vote_count;
    this.image_url = val.poster_path;
    this.popularity = val.popularity;
    this.released_on = val.release_date;
    
}