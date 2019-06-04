var Twitter = require('twitter');
var request = require('request');
var config = require('./config.js');
var bodyParser = require('body-parser');
var express = require('express');
var T = new Twitter(config);
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);;

var tweets = {

}

var params = {
    q: 'iron man dies -spoiler',
    count: 1,
 
}

server.listen(3000);
console.log("Server listening at: 3000");
app.get('/', function(req, res){
    res.set({'Access-Control-Allow-Origin':'*'});
    return res.redirect('public/index.html');
});

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

io.on('connection', function(socket){
    //socket.emit('welcome', { data: 'welcome'});
    T.get('search/tweets', params, function(err, data, response){
        if(!err){
            var results = []
            /*for(let i = 0; i < data.results.length; i++){
                results.push({
                    name: data.results[i].user.screen_name,
                    text: data.results[i].text,
                    id: data.results[i].id_str});
                
                console.log(data.results[i].created_at)
                console.log(data.results[i].user.screen_name)
                console.log(data.results[i].text)
    
            }*/
            socket.emit('tweet', {data: data});
            //console.log(results);
        } else {
            console.log(err);
        }
    });
    
});

