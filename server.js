var express  = require('express');
var request  = require('request');
var app      = express();
var port     = process.env.PORT || 2211;
var morgan   = require('morgan');

app.use(morgan('dev'));

function countUsers(callback){
  var url = 'https://discordapp.com/api/guilds/303217943234215948/widget.json';
  var count = 0
  request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
      return(callback(null, err))
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
      return(callback(null, res.statusCode));
    } else {
      data.members.forEach(function(e){
        count++
      })
      return(callback(count, false))
    }
  });
}

app.get('/api/discord', function(req, res) {
  countUsers(function (data, err) {
    if (err) return res.send(err.toString())
    var result = new Object()
    result["count"] = data;
    res.json(result)
  })
})

app.listen(port)
