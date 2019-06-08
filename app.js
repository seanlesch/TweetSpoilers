var Twitter = require('twitter');
var request = require('request');
var config = require('./config.js');
var querystring = require('querystring');
var bodyParser = require('body-parser');
var express = require('express');
var T = new Twitter(config);
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);;




server.listen(3000);
console.log("Server listening at: 3000");
app.get('/', function(req, res){
    res.set({'Access-Control-Allow-Origin':'*'});
    return res.redirect('public/index.html');
});

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

io.on('connection', function (socket) {
    var params = {
        q: 'iron man dies -spoiler',
        count: 25,
        result_type: 'mixed'
     
    }
    //socket.emit('welcome', { data: 'welcome'});
    T.get('search/tweets', params, function(err, data, response){
        if(!err){
            socket.emit('tweet', { data: data });
            
           /* if (data.search_metadata.next_results) {
                getTweets(data.search_metadata.next_results, socket, function () {
                    console.log('No more results');
                });
            }*/
            
        } else {
            console.log(err);
        }
    });
    
    
});

function getTweets(url, socket, callback) {
    params = querystring.parse(url);
    T.get('https://api.twitter.com/1.1/search/tweets.json'+url, params, function (err, data, response) {
        if (!err && response.statusCode === 200) {
            socket.emit('tweet', { data: data });
            if (data.search_metadata.next_results) {
                getTweets(data.search_metadata.next_results, callback);
            }
            else {
                callback();
            }
        }
        else {
            console.log(err);
        }
    })
    
}