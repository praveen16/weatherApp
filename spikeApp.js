var Express = require("express");
var app = Express();
app.get('/', function(req, res) {
  res.send("Hello This is Today's Weather");
});

app.listen(9000);
