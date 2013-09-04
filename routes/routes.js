
/*
 * GET home page.
 */

exports.index = function(req, res){
  var cities = [
      {name:'Campbell',state:'CA',info:'Needs to be retrieved'},
      {name:'Omaha',state:'NE',info:'Needs to be retrieved'},
      {name:'Austin',state:'TX',info:'Needs to be retrieved'},
      {name:'Timonium',state:'MD',info:'Needs to be retrieved'},
  ];

  res.render('index', { title: 'WeatherApp', cities: cities });
};
