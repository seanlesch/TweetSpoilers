var Twitter = require('twitter');
var config = require('./config.js');
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
var endgame = {
    q: 'iron man dies -spoiler',
    count: 100,
    result_type: 'mixed'
 
}
var GoT = {
    q: 'jon kills daenerys -spoiler',
    count: 100, 
    result_type: 'mixed'
}

var titanic = {
    q: 'titanic jack dies -spoiler',
    count: 100,
    result_type: 'mixed'
}

io.on('connection', function (socket) {
   //Default parameters. Max 10 keywords/operators
    
    socket.on('getresults', function(objectData){
        
        if(objectData === 'Avengers: Endgame'){
            params = endgame;
            
        }else if(objectData === 'Game of Thrones Season 8'){
            params = GoT;
        }else if(objectData === 'Titanic'){
            params = titanic;
        }else{
            params = {
                q: objectData,
                count: 100, 
                result_type: 'mixed'
            }
        }
        T.get('search/tweets', params, function(err, data, response){
            if(!err && response.statusCode === 200){
                
                socket.emit('tweet', { data: data });
            } else {
                
            }
        });

    });
});
