var request = require('request');
var async = require('async');

/*
 * GET details.
 */

exports.list = function(req, res){

    //Setup key and URLs
    base_url_for_conditions = 'http://api.wunderground.com/api/key/conditions/q/state/city.json';
	//TODO: UPDATE API_KEY 
    var wu_apikey ='API_KEY';

    var city = req.query.newcity ;
    var state = req.query.newstate ;

    validateinput(city,state,function(err){
        if(err){
            console.log('Invalid Input');
            res.render('detail', { title: 'WeatherApp', observation : null });
            return;
        }else{
            var location={
                'city' : city,
                'state' : state
            };

            //Make Async calls to weather API
            getWeatherConditionsASYNC(location, wu_apikey, function(err, observation){
                console.log('Inside async callback function after getting weather info ');//,JSON.stringify(observation));
                if(!err){
                    console.log('Render results',JSON.stringify(observation));
                    res.render('detail', { 'title': 'WeatherApp', 'observation' : observation });
                }
            });
        }
    });
};

function validateinput(city,state,callback){
    if(!city || !state ){
        console.log('city/state are invalid',city,',',state );
        callback(true); return;
    }
    console.log('city & state are Valid' );
    callback(false);
    return;
}

/**
 * Get Weather conditions Async which is the correct way
 *
 * @param cities
 * @param wu_apikey
 * @param callback
 */
function getWeatherConditionsASYNC(location, wu_apikey, callback){
    console.log('Async Call to wUnderground for ',location.city,', ',location.state);
    var temp_url = base_url_for_conditions.replace('key',wu_apikey);
    var observation = {}; // weather data


    var url = (temp_url.replace('state',location.state)).replace('city',location.city);
    console.log('Request URL: ',url.replace(wu_apikey,'apikey_hidden') );


    async.parallel([
        function(callback) {
            request(url, function(err, response, body) {
                //if error return back
                if(err || (response.statusCode != 200)){console.log(err);callback(true);return;}
                var conditions=JSON.parse(body);
                console.log('retrieved conditions for ',
                    conditions.current_observation.display_location.city,',',
                    conditions.current_observation.display_location.state,'successfully. Now calling CallBack');
                callback(false,conditions);
            });
        }],
        /*
         * Collate results
         */
        function(err, observations) {
            //console.log(JSON.stringify(observations));
            console.log('Inside callback function after getting weather');
            if(!err){
               observation = observations[0];
            }
            callback(false,observation);
        }
    );

}
