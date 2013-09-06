
/*
 * GET home page.
 */

exports.index = function(req, res){
    //Initial set of cities
  var cities = [
      {name:'Campbell',state:'CA',info:'Needs to be retrieved'},
      {name:'Omaha',state:'NE',info:'Needs to be retrieved'},
      {name:'Austin',state:'TX',info:'Needs to be retrieved'},
      {name:'Timonium',state:'MD',info:'Needs to be retrieved'},
  ];

    //do a sync call to external endpoint
   async.pa

    // retrieve weather for initial set of cities



    //set cities data to render
  res.render('index', { title: 'WeatherApp', cities: cities });
};
