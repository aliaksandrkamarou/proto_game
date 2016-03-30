var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var logger = require('morgan');
var favicon = require('serve-favicon');


var world = require('./server_app/server_world');

app.use(logger('dev'));


server.listen(3000, function(){
    console.log('Server is running...')
});


//app.use('/',function(req,res){
//    console.log('request is '+req.url+ ' method is '+req.method)
//    res.sendFile(__dirname+'/index.html');
//})

app.use(favicon('favicon.ico'));
app.use('/tps',express.static(__dirname+'/tps'));
app.use('/lib',express.static(__dirname+'/lib'));
app.use('/client_app',express.static(__dirname+'/client_app'));
//app.route(function(req,rea,next){
//    console.log(__dirname +  req.url);
//    res.sendFile(__dirname +  req.url);
//    next();
//})



io.on('connection', function(socket){
    console.log('Client connected: '+ socket.id);

  // CREATE NEW PLAYER on CLIENT
    var id = socket.id;  // assign player id as socket.id
    var player = world.addPlayer(id);   // returns player + side effect(!) add player to players, so it can be retrived by world.playerForId
    //var player = world.playerForId(id); // get player's data by id
    console.log(player);
    socket.emit('createPlayer', player);  // emit 'createPlayer' with player's data to client
    console.log('create player emitted');
 //END OF CREATE NEW PLAYER on CLIENT

 //BROADCAST NEW PLAYER to OTHER CLIENTS
   // socket.broadcast.emit('addOtherPlayer', player);
 //END OF BROADCAST NEW PLAYER to OTHER CLIENTS

    //keyDown consumer
    socket.on('keydown', function(event){

        world.onKeyDown(event, id);

        console.log(event);
        console.log(socket.id);

    });

    //keyUp consumer
    socket.on('keyup', function(event){

        world.onKeyUp(event, id);

        console.log(event);
        console.log(socket.id);

    });






    socket.on('disconnect', function(){
        console.log('user disconnected');});




});


//setInterval(function () {
//    console.log(world.players)
//}, 1000);
setInterval(function(){
    world.renderPlayers();

    console.log(world.players)
     io.emit('updateWorld', world.players) /// EMIT TO ALL  // IS IT SYNC?????????
}    ,10);  // render world








