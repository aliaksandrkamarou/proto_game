var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var logger = require('morgan');
var favicon = require('serve-favicon');
var THREE = require('three');
var fs = require('fs');
var world = require('./server_app/server_world');

var serverRenderer = require('./server_app/serverRenderer');







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
app.use('/anim',express.static(__dirname+'/anim'));
app.use('/Raycaster',express.static(__dirname+'/Raycaster'));

app.use('/server_app',express.static(__dirname+'/server_app'));


app.use('/PointerLockControl',express.static(__dirname+'/PointerLockControl'));
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
    socket.broadcast.emit('addOtherPlayer', player);
 //END OF BROADCAST NEW PLAYER to OTHER CLIENTS

// REQUEST OLD PLAYERS Handler
    socket.on('requestOldPlayers', function(){
        for (var i = 0; i < world.players.length; i++){
            if (world.players[i].playerId != id)
                socket.emit('addOtherPlayer', world.players[i]);
        }
    });
//

    // remove player
    socket.on('disconnect', function(){
        console.log('user disconnected');
        io.emit('removeOtherPlayer', player); // danger !!! emit player data
        world.removePlayer( player );
    });


    //keyDown consumer
    socket.on('keydown', function(event){

        //world.onKeyDown(event, id);
        player.keyState[event] = true;
        // console.log(event);
        // console.log(socket.id);

    });

    //keyUp consumer
    socket.on('keyup', function(event){

        //world.onKeyUp(event, id);
        player.keyState[event] = false;
        //console.log(event);
        //console.log(socket.id);

    });

    socket.on('mousedown', function(event){

        //world.onMouseDown(event, id);
        player.mouseState[event] = true;
        // console.log(event);
        // console.log(socket.id);

    });

    socket.on('mouseup', function(event){

        //world.onMouseUp(event, id);
        player.mouseState[event] = false;
        // console.log(event);
        // console.log(socket.id);

    });


    socket.on('mouseMoveRay',function(data){
        console.log('mouseMoveRay ' + data.x+' '+data.y);
    });





    socket.on('mouse2D',function(data){

        console.log('mouse position!!!!!!!!!!!! :' + id);
        console.log(data);
        //console.log(data);

        player.mouse2D = data;

        //player.moveState.hitOnce = true;
        //console.log(event);
        //console.log(socket.id);

    });

    socket.on('playerHit', function(id){
       // console.log('playerHit got for' + id);
        var otherPlayer = world.playerForId(id);
        otherPlayer.moveState.hitOnce = true;

    })

    socket.on('onWindowResize', function(ratio){

    })





    socket.on('disconnect', function(){
        console.log('user disconnected');});


    socket.on('giveMeData', function (data) {
            console.log('data request');
            function foo () {

                var loader = new THREE.JSONLoader();
                var loaderO = new THREE.ObjectLoader();
                fs.readFile('c:/proto_game/client_app/droid.js', 'utf-8', function (err, content) {
                    if (err) console.log(err);
                    var jsonContent = JSON.parse(content);
                    var geometry = loader.parse(jsonContent).geometry;
                   // console.log(geometry.animations);


                    //var g = new THREE.Geometry(geometry);
                    //console.log(  g);

                    var material = new THREE.MeshPhongMaterial({
                        color: 0xffffff,
                        morphTargets: true,
                        vertexColors: THREE.FaceColors,
                        shading: THREE.FlatShading
                    });

                    //scene.add (droid);
                    var droid = new THREE.Mesh(geometry, material);
                   // droid.animations = geometry.animations

                   // console.log(geometry.animations[0])
                   // console.log(loaderO.parseAnimations);

                    droid.scale.set(.2, .2, .2);
                    var jsonDroid=droid.toJSON()
                    console.log(geometry.animations)

                    //jsonDroid.animations = geometry.animations;
                   // console.log(jsonDroid);


                  //  var mixer = new THREE.AnimationMixer(droid);
                  //  mixer.clipAction(geometry.animations[10]).play()
                   // mixer.update(.1)
                    //droid.mixer = new THREE.AnimationMixer(droid);
                   // droid.userData.actions = {};
                  //  droid.userData.actions.wave = droid.userData.mixer.clipAction(geometry.animations[10]);
                  //  droid.userData.actions.wave.play();
                  //  droid.userData.mixer.update(.1);

                    //console.log(droid);
                    socket.emit('hereIsData',[jsonDroid, geometry.animations])// droid.toJSON())// droid.toJSON());


                });
            }
            foo();


            // console.log(JSON.stringify(scene));

        }
    );





});


//setInterval(function () {
//    console.log(world.players)
//}, 1000);

var THREE = require('three');
//hacked Clock
var clock = new THREE.Clock;
var time = process.hrtime();
setInterval(function(){

    world.renderPlayers();
    var delta = clock.getDelta();


    var players = world.players;


    //console.log(world.players)
     io.emit('updateWorld', [players,delta]) /// EMIT TO ALL  // IS IT SYNC?????????
    world.resetMoveStates();

}    ,20);  // render world








