'use strict';
let allData = require('./server.js');
module.exports.yelpFun = function(res,city){
    let arr = [];
    const url = `https://api.yelp.com/v3/businesses/search?location=${city}`;
    allData.superagent.get(url)
        .set({ 'Authorization':`Bearer ${process.env.YELP_API_KEY}`})
        .then(yelpData => {
            
            yelpData.body.businesses.map(val => {
                
                let x = new yelpObject(val);
                arr.push(x);
            })
            res.send(arr);
        })
}
function yelpObject(val) {
    this.title = val.name;
    this.image_url = val.image_url;
    this.price = val.price;
    this.rating = val.rating;
    this.url = val.url;
    
}