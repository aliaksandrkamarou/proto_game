//var log = require('why-is-node-running') // should be your first require
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server/*, {'pingTimeout' : 120000 }*/);
var logger = require('morgan');
var favicon = require('serve-favicon');
var THREE = require('three');
var fs = require('fs');

//console.log(io)

var world = require('./server_app/server_world');
//var async = require('async');
var serverRenderer = require('./server_app/serverRenderer');
//var Worker = require("tiny-worker");
//var Worker = require('pseudo-worker');
//var activeHandles = require('active-handles');

//console.log(process.env);
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
app.use('/Helpers',express.static(__dirname+'/Helpers'));

app.use('/server_app',express.static(__dirname+'/server_app'));
app.use('/share',express.static(__dirname+'/share'));
app.use('/models',express.static(__dirname+'/models'));

app.use('/PointerLockControl',express.static(__dirname+'/PointerLockControl'));
//app.route(function(req,rea,next){
//    console.log(__dirname +  req.url);
//    res.sendFile(__dirname +  req.url);
//    next();
//})

var counter = 0;

io.on('connection', function(socket){
    console.log('Client connected: '+ socket.id);

  // CREATE NEW PLAYER on CLIENT
    var id = socket.id;  // assign player id as socket.id
    socket.playerId = id;  // костыль для addPlayer
    var player = world.addPlayer(socket, world.geometryTemplate,world.multiMaterialTemplate, world.scene, world.objects, world.players, true);   // returns player + side effect(!) add player to players, so it can be retrived by world.playerForId

   // world.postServerMessages.push (JSON.parse(JSON.stringify(player)));
   // world.postServerMessages.push (player);
   // world.postServerMessages.push (JSON.parse(JSON.stringify(player)));

    //socket.emit('droid', world.jsonContent);

    //var player = world.playerForId(id); // get player's data by id

    socket.emit('createPlayer', JSON.parse(JSON.stringify(player)));  // emit 'createPlayer' with player's data to client
    console.log('create player emitted');
    console.log(player);

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


    socket.on('rtt test',function (startTime, cb) {
      //  console.log(cb.toString())
        cb(startTime);
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




    socket.on('mouse2D',function(data){

       // console.log('mouse position!!!!!!!!!!!! :' + id);
       // console.log(data);
        //console.log(data);

        player.mouse2D.set(data.x,data.y); // danger try/catch
       // console.log(player.mouse2D);

        //player.moveState.hitOnce = true;
        //console.log(event);
        //console.log(socket.id);

    });




    socket.on('playerState', function (state){



        counter += 1;


   //     if(/*world.isServerInterpolation*/ true) {

            var playerMesh = world.objectForPID(socket.id)
            playerMesh.inputStates.push(state);
      //  console.log(state[9])

     //   } else {



            //   console.log('PLAYER STATE FIRED '+ JSON.stringify(process.hrtime()) +' counter '+ counter+ ' socket '+ socket.id + ' ts_client '+state[0])
            //  if(counter > 4) throw /*new Error*/console.log( 'counter > 4  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')


       /*     player.ts_client = state[0];
            player.keyState = state[1];
            player.mouseState = state[2];
            player.mouse2D = state[3];
            player.ts_server = state[4];
            player.last_client_delta = state[5]; // never used. saved on client side for client reconciliation
            //DO NOT UNCOMMENT -- update DUPLICATION player.position.set(state[6].x,state[6].y,state[6].z)
            //DO NOT UNCOMMENT -- player.rotation.set(state[7].x,state[7].y,state[7].z)
            player.isCameraFollow = state[8]
            player.needServerUpdate = true;
            */
     //   }

      //  player.states.push(state);  //states from client

    })

    socket.on('playerHit', function(id){
     //   console.log('playerHit got for' + id);
        var otherPlayer = world.playerForId(id);
     //   console.log(otherPlayer)
        if(otherPlayer) otherPlayer.moveState.hitOnce = true; // danger -- remove player from raycast objects

    })

    socket.on('onWindowResize', function(aspect){
        console.log('input apect '+ aspect)
    //    console.log(player.keyState);
        player.camera.aspect = aspect;
        player.camera.updateProjectionMatrix();
        player.cameraJSON = player.camera.toJSON();
        console.log(player === world.playerForId(id));

     //   var loader = new THREE.ObjectLoader();
    //    console.log(player.cameraJSON);
    //    console.log(loader.parse(player.cameraJSON));

        console.log('acpect :'+ player.camera.aspect+ 'for player id'+ id)

    });

/*
    socket.on('rAF update from Client', function(){
        socket.emit('rAF update from Server', [players,delta]) /// EMIT TO ALL  // IS IT SYNC?????????
    })
*/
/*
    socket.on('test', function(data, cb){


        cb(data);

    } );
*/

    socket.on('disconnect', function(){
        console.log('user disconnected '+ id);});

/*
    socket.on('UPD_world_CLI', function(ps,cb){

        console.log('rAF fired ' + ps)


        cb([world.players,g_lastTick,ps])
    } )
*/


/*

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
                   // console.log(geometry.animations)

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

*/







});


//setInterval(function () {
//    console.log(world.players)
//}, 1000);

//var THREE = require('three');
//hacked Clock
var clock = new THREE.Clock;
var g_delta;
var g_lastTick;
var serverLastUpdateTime

//clock.start();
//var time = clock.getElapsedTime ()//process.hrtime();
var it = 0





function blocker(time) {
    var now = new Date().getTime()

    while (new Date().getTime() < now + time) {
//  console.log('blocking')
    }
}
/*
function foo(){
    world.objects.forEach(function (playerItem){

        playerItem.__dirtyPosition = true;
        playerItem.__dirtyRotation = true;
        playerItem.rotation.y += 0.1
        console.log('rot ' +playerItem.rotation.y)
    })


    setTimeout(foo,100)



}
*/
//foo()

/*

world.scene.addEventListener('update', function(){
    console.log('worker update')
  //  blocker(100)
    looper();
 //   setTimeout(function(){world.scene.simulate()},0);
 //   setImmediate(function(){world.scene.simulate()})

   // world.scene.simulate()
})
world.scene.simulate()
*/
//var agg_delta = 0 ;
//world.scene.addEventListener('update', function(){
   // setTimeout(function(){world.scene.simulate()},100)

  //   function inloop () {
        //console.log('call');
    //    counter = 0;
        // console.log('LOOPER STATE FIRED '+ JSON.stringify(process.hrtime()) +' counter '+ counter)

      //  var delta = clock.getDelta(); //call order is important here 1.// side-effect update clock.elapsedTime
        //  console.log(delta);
        // call after getDelta() is important.
        //console.log('11111     '+clock.elapsedTime)


        // foo();
        // agg_delta += delta


     //   console.log('call ' + delta + ' agg_delta '+ agg_delta);




        // if(world.players[0]) console.log( JSON.stringify(world.playerForId(world.players[0].playerId).quaternion))


        //console.log('playerItem.quaternion: '+JSON.stringify(playerItem.quaternion)+ 'playerItem._physijs.rotation: '+JSON.stringify(playerItem._physijs.rotation))


//        var is_done = world.renderPlayers(world.objects, 'delta?'); // call order is important is here 2.


       // console.log(is_done)

        //console.log('back')


        //  if(world.players[0]) console.log( JSON.stringify(world.playerForId(world.players[0].playerId).quaternion))
  //     var ret = world.scene.simulate(agg_delta/*delta*/);
      //   console.log(ret);
       //  if (ret) agg_delta =0
     //   //   console.log('g_delta   '+g_delta+'  delta '+delta+ ' g_lasttick  '+g_lastTick+ '22222     '+clock.elapsedTime)
    //    g_delta = delta;
   //     g_lastTick = clock.elapsedTime;// copy primitive //call order is important here 3. // call after getDelta() is important. + call after render is important
  //      setImmediate(inloop);
 //        //process.nextTick(inloop);
//    }

//inloop()
    //   console.log('delta ' + delta + ' lastTick '
//})

//world.scene.simulate(0);

//console.log( 'scene ' )
//world.scene.physijs.worker.onmessage= null;
//console.log(world.scene.physijs.worker.onmessage)
/*
setInterval(function(){
    counter = 0;
  //  blocker(100);
   // activeHandles.print();
   // console.log(process._getActiveHandles());
    log()
    console.log('inteval!!')
}, 0)
*/
/*
var physics_framerate = 1000 / 60;
function onStep() {
    //box.rotation.z

     setTimeout( world.scene.step.bind( scene, physics_framerate / 1000, undefined, onStep ), physics_framerate );
}
world.scene.step( physics_framerate / 1000, undefined, onStep );
*/

/*
var isBrowser=new Function("try {return this===window;}catch(e){ return false;}");
if(isBrowser()) {console.log("running under browser")} else{
    (console.log("NOT running under browser"));
}

*/
/*
setInterval(function anon(){
    console.log('call')
    world.scene.simulate()},100);
*/
var g_timeReminder = 0;
var simulateDeltaTime = 1/10;
function looper () {
 //   console.time('up')







    //console.log('00000     '+clock.elapsedTime)
    counter = 0;
   // console.log('LOOPER STATE FIRED '+ JSON.stringify(process.hrtime()) +' counter '+ counter)

    var delta = clock.getDelta(); //call order is important here 1.// side-effect update clock.elapsedTime
  //  console.log(delta);
   // if(delta > simulateDeltaTime) throw new Error('error: delta > simulateDeltaTime :  '+delta +' > '+ simulateDeltaTime );
    g_timeReminder += delta;


  //  console.log(delta);
    // call after getDelta() is important.
    //console.log('11111     '+clock.elapsedTime)

    //console.log(delta);




   // world.scene.updateMatrixWorld();
  //  console.log(delta);

//  console.log('looper' + g_timeReminder +'vs'+ simulateDeltaTime);

    //world.renderPlayers(world.objects, delta, clock.elapsedTime); // call order is important is here 2.

    if (g_timeReminder >= simulateDeltaTime) {
     //   console.log('g_timeReminder ' + g_timeReminder)
        //console.log('simulate')
        world.renderPlayers(world.objects, simulateDeltaTime, clock.elapsedTime);
        world.scene.setFixedTimeStep(simulateDeltaTime );
        world.scene.simulate(simulateDeltaTime , 1);
        g_timeReminder -= simulateDeltaTime;
    }
 //   console.log('g_delta   '+g_delta+'  delta '+delta+ ' g_lasttick  '+g_lastTick+ '22222     '+clock.elapsedTime)
    g_delta = delta;
   // console.log(g_delta)
 //   g_serverLastUpdateTime = clock.elapsedTime;
    serverLastUpdateTime = clock.elapsedTime;// copy primitive //call order is important here 3. // call after getDelta() is important. + call after render is important
    //console.log(serverLastUpdateTime)
//    activeHandles.print();
 //   console.log('delta ' + delta + ' lastTick ' + lastTick);
   // blocker(10);
 //  if (world.scene.getObjectByName('greenCube'))  console.log(world.scene.getObjectByName('greenCube').position);
 //   var players = world.players;
 //   log()
  //     io.emit('updateWorld', [players,delta]) /// EMIT TO ALL  // IS IT SYNC?????????
  //   world.resetMoveStates();
    setImmediate(looper);
  //  process.nextTick(function(){looper()})
     // setTimeout(looper,0);
    //setTimeout(looper,0);

};  // render world


looper();

/*

var phyClock = new THREE.Clock();

world.scene.addEventListener( 'update', function() {

    function phys() {
        var phyDelta = phyClock.getDelta();
        console.log('call delta ' + phyDelta);
        world.scene.simulate()
        // the scene's physics have finished updating
    }
    setTimeout(phys, 25)

});

world.scene.simulate(0);
*/


/*
function phy() {

    console.log('call '+(1 / 60000))
    world.scene.simulate()
    setTimeout(phy,0)
}

phy();
*/


var clockEmitter = new THREE.Clock();
setInterval(function sendUpdateToClient(){

    var ptime =  process.hrtime(); // hack
    var serverLastSentTime = (ptime[0]+  1e-9 * ptime[1])

    world.serverSentTimes.shift(); // length filled during initialization
    world.serverSentTimes.push(serverLastSentTime);
 //   console.log(world.serverSentTimes.length);

    //console.log(serverLastSentTime);







   /*     ;(function (p, g_t, ptime)
         {
                setTimeout(function () {
                    io.emit('outer_UPD_world_CLI', [p, g_t, ptime ])
                    }, 100);
             }) (world.players, g_lastTick, ps); // IIFE
  */
  /*
   world.players.forEach(function(p, i){
       console.log('P'+i+ ' mixerTime '+  p.mixerTime)
   });
   */
   // console.log(g_lastTick+" vs "+ ps)
   // if(world.players[0]) console.log(JSON.stringify(world.players[0]))

 //   var i ='hello';
   if (world.postServerMessages.length > 0) {
       //console.log(world.postServerMessages[0].actions);
       //   console.log('rotation!!!!')
       //    var postServerMessagesCOPY = JSON.parse(JSON.stringify(world.postServerMessages))
       // if (world.players[0]) console.log(world.players[0]._physijs)
       //   if (world.postServerMessages[0]) { console.log( 'sending ' + JSON.stringify(world.postServerMessages[0].rotation) + ' for client_ts ' + world.postServerMessages[0].ts_client)};
       io.emit('outer_UPD_world_CLI', {
           players: world.postServerMessages,
           serverLastUpdateTime: serverLastUpdateTime,
           serverLastSentTime: serverLastSentTime
       })
       //    console.log('emit!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!;')

       world.postServerMessages.length = 0; // clear existing array;
   }
 //   console.log('world.postServerMessages '+ world.postServerMessages.length)
  // } else {console.log('!!!!!!!!!!NOT EMIT!')}
},10)