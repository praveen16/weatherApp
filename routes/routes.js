var request = require('request');
var async = require('async');
/*
 * GET home page.
 */

exports.index = function(req, res){
    //Initial set of cities
    var cities = [
      {'name':'Campbell','state':'CA','info':''},
      {'name':'Omaha','state':'NE','info':''},
      {'name':'Austin','state':'TX','info':''},
      {'name':'Timonium','state':'MD','info':''}
    ];
    //Setup key and URLs
    base_url_for_conditions = 'http://api.wunderground.com/api/key/conditions/q/state/city.json';
    var wu_apikey ='ab23249d1aca89e1';

    //Synchronous process - This is so lame, never do this.
    //Get weather data for all the cities
/*   for(i=0;i<1;i++){
       getWeatherConditions(cities[i].name,cities[i].state,wu_apikey, function(err, conditions){
            console.log('Inside callback function after getting weather for ',
                conditions.current_observation.display_location.full);
           if(!err){
               var weather = (conditions.current_observation.weather)+ ', ' +
                   (conditions.current_observation.temperature_string);
               console.log(weather);
               cities[i].info = weather;
               res.render('index', { cities: cities });
            }
        });
    }*/

    //Make Async calls to weather API
    getWeatherConditionsASYNC(cities, wu_apikey, function(err, observed_cities){
        console.log('Inside asyn callback function after getting weather info ');//JSON.stringify(observed_cities));
        if(!err){
            console.log('Render results');
            res.render('index', { title: 'WeatherApp', cities: observed_cities });
        }
    });
};

/**
 * get weatherconditions in a sync process; get things working first
 * @param city
 * @param state
 * @param wukey
 * @param callback
 */
function getWeatherConditions(city,state, wu_apikey, callback){
    console.log('Calling wUnderground for conditions in ',city,',',state);
    //get base url and replace with city and state that was passed in
    var url = ((base_url_for_conditions.replace('state',state)).replace('city',city)).replace('key',wu_apikey);
    console.log('Request URL: ',url.replace(wu_apikey,'apikey_hidden') );
    request(url,function(err,response, body){
        //if error return back
        if(err || (response.statusCode != 200)){console.log(err);callback(true);return;}
        var conditions=JSON.parse(body);
        console.log('retrieved conditions for ',city,',',state,'successfully. Now calling CallBack');
        callback(false,conditions);
        return;
    });
}


/**
 * Get Weather conditions Async which is the correct way
 *
 * @param cities
 * @param wukey
 * @param callback
 */
function getWeatherConditionsASYNC(cities, wu_apikey, callback){
    console.log('Async Call to wUnderground for all cities;');
    var temp_url = base_url_for_conditions.replace('key',wu_apikey);
    var urls = [];
    var observed_cities = []; // cities for which weather data is available

    for(var i =0; i<cities.length; i++){
      urls[i] = (temp_url.replace('state',cities[i].state)).replace('city',cities[i].name);
      console.log('Request URL: ',urls[i].replace(wu_apikey,'apikey_hidden') );
    }

    async.parallel([
        function(callback) {
            request(urls[0], function(err, response, body) {
                //if error return back
                if(err || (response.statusCode != 200)){console.log(err);callback(true);return;}
                var conditions=JSON.parse(body);
                console.log('retrieved conditions for ',
                    conditions.current_observation.display_location.city,',',
                    conditions.current_observation.display_location.state,'successfully. Now calling CallBack');
                callback(false,conditions);
            });
        },
        function(callback) {
            request(urls[1], function(err, response, body) {
                //if error return back
                if(err || (response.statusCode != 200)){console.log(err);callback(true);return;}
                var conditions=JSON.parse(body);
                console.log('retrieved conditions for ',
                    conditions.current_observation.display_location.city,',',
                    conditions.current_observation.display_location.state,'successfully. Now calling CallBack');
                callback(false,conditions);
            });
        },
        function(callback) {
            request(urls[2], function(err, response, body) {
                //if error return back
                if(err || (response.statusCode != 200)){console.log(err);callback(true);return;}
                var conditions=JSON.parse(body);
                console.log('retrieved conditions for ',
                    conditions.current_observation.display_location.city,',',
                    conditions.current_observation.display_location.state,'successfully. Now calling CallBack');
                callback(false,conditions);
            });
        },
        function(callback) {
            request(urls[3], function(err, response, body) {
                //if error return back
                if(err || (response.statusCode != 200)){console.log(err);callback(true);return;}
                var conditions=JSON.parse(body);
                console.log('retrieved conditions for ',
                    conditions.current_observation.display_location.city,',',
                    conditions.current_observation.display_location.state,'successfully. Now calling CallBack');
                callback(false,conditions);
            });
        }
    ],
        /*
         * Collate results
         */
        function(err, observations) {
            //console.log(JSON.stringify(observations));
            console.log('Inside callback function after getting weather for all cities');
            if(!err){
                for(var i=0; i<observations.length; i++){
                    var conditions = {};
                    conditions.name = observations[i].current_observation.display_location.city;
                    conditions.state = observations[i].current_observation.display_location.state;
                    conditions.info = (observations[i].current_observation.weather)+ ', ' +
                        (observations[i].current_observation.temperature_string);
                    console.log('In callback of async.parallel for ',JSON.stringify(conditions));
                    observed_cities.push(conditions);
                }
            }
            console.log('All done, so now return');
            callback(false,observed_cities);
        }
    );

}