'use strinct';
var THREE = require('three');
var fs = require('fs');
var Player = require('../share/Player');
var cameraControl = require('../share/cameraControl');
var checkRayCast = require('../share/checkRayCast');

var checkKeyStates = require('../share/checkKeyStates');

//var Worker = require('tiny-worker');
var Worker = require('pseudo-worker');

var Physijs = require('../lib/physi.js');

Physijs.scripts.worker = 'lib/physijs_worker.js';
Physijs.scripts.ammo = 'lib/ammo.js';

//var OIMO = require('../lib/oimo');


var updateOimoPhysics = require('../share/updateOimoPhysics')
var initWorld = require('../share/initWorld');
var initGeoMat = require ('../share/initGeoMat');

var addPlayer = require('../share/addPlayer');

var isServerInterpolation = false//||true;

//var sce = new physijs.
//var v = new Worker ('c:/proto_game/lib/worktest.js');
//var scene = new physijs.Scene( 'lib/physijs-worker.js', {gravity:{x:0, y:-9.8, z:0}} );



//var scene = new THREE.Scene();
//var OIMOworld = new OIMO.World(1/60, 2, 8);


//var scene = new Physijs.Scene({fixedTimeStep: 0 });
//scene.setGravity(new THREE.Vector3( 0, -5,0 ));

//console.log(scene.gravity);

/*
box = new Physijs.BoxMesh(
    new THREE.CubeGeometry( 5, 5, 5 ),
    new THREE.MeshBasicMaterial({ color: 0x888888 })
);
scene.add( box );
*/


var scene_world_bodys_meshs = initWorld() //new THREE.Scene()
var scene = scene_world_bodys_meshs.scene;
//var OIMOworld = scene_world_bodys_meshs.OIMOworld;
//var OIMObodys = (scene_world_bodys_meshs.bodys);
var OIMOmeshs = (scene_world_bodys_meshs.meshs);



var players = [];
var objects = [];
var postServerMessages = [];
var serverSentTimes = new Array(200)
serverSentTimes.fill(0);


var serverInterpolationTime = 2;

var geometryTemplate, multiMaterialTemplate;
var JSONloader = new THREE.JSONLoader();
//var geoMatTemplate =  initGeoMat();

//geometryTemplate = geoMatTemplate.geometryTemplate;
//multiMaterialTemplate = geoMatTemplate.multiMaterialTemplate;
/*
fs.readFile('c:/proto_game/client_app/droid.js', 'utf-8', function (err, content) {
    if (err) console.log(err);

    var jsonContent = JSON.parse(content);

    var loader = new THREE.JSONLoader();
    //console.log( loader.parse(jsonContent).geometry);
    geometryTemplate = loader.parse(jsonContent).geometry;

}); // может лучше тут синхронный вызов, т.к. это только один раз вроде при инициализации???
*/
//var content = fs.readFileSync('c:/proto_game/client_app/droid.js', 'utf-8');
//var jsonContent = JSON.parse(content);
//geometryTemplate = JSONloader.parse(jsonContent).geometry;


var content = fs.readFileSync('c:/proto_game/models/Y_Bot/Y_Bot_v2.json', 'utf-8');
var jsonContent = JSON.parse(content);
var templates = JSONloader.parse(jsonContent);
geometryTemplate = templates.geometry;
multiMaterialTemplate = templates.materials;
multiMaterialTemplate.forEach(function (material) {
    material.skinning = true;
});

//geometryTemplate.scale.set(.02,.02,.02);
//geometryTemplate.rotateY( Math.PI );
//geometry.updateMatrix();
//geometryTemplate.verticesNeedUpdate = true;


var innerWidth = 100;
var innerHeight = 100;

//renderer = new THREE.CanvasRenderer( )
//renderer = new THREE.WebGLRenderer();
//renderer.setClearColor( 0xf0f0f0 );
//renderer.setPixelRatio( window.devicePixelRatio );
//renderer.setSize( innerWidth, innerHeight );
//var bufferTexture = new THREE.WebGLRenderTarget( innerWidth, innerHeight);
//var buffer = new Uint8Array( innerWidth * innerHeight * 4 );


//var clock = new THREE.Clock();

/*
var addPlayer = function(data){


    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        morphTargets: true,
        vertexColors: THREE.FaceColors,
        shading: THREE.FlatShading
    });

    var pMaterial = Physijs.createMaterial(
        material,
        0.1,
        0.1

    );

  //  geometryTemplate.scale(.02,.02,.02);


    //   var playerMesh = new physijs.Convex(geometryTemplate, material, {mass:1})
//   var playerMesh = new THREE.Mesh(geometryTemplate, material);
    var playerMesh = new Physijs.CapsuleMesh(geometryTemplate, pMaterial );
   // playerMesh.__dirtyPosition = true;



    // You may also want to cancel the object's velocity
    //playerMesh.setLinearVelocity(new THREE.Vector3(0, 0, 0));
    //playerMesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));
    var player = new Player(playerMesh, data.playerId);
   // player.prototype.mixer = playerMesh.mixer;

    Object.defineProperty(player, 'mixerTime', {
        get: function () {
            return playerMesh.mixer.time;
        },
        set: function (val) {
            playerMesh.mixer.time = val;
        }
    });

    Object.defineProperties(player.actions, {
        'standTime': {
            get: function () {
                return playerMesh.actions.stand.time;
            },
            set: function (val) {
                playerMesh.actions.stand.time = val;
            }
        },
        'runTime' : {
            get: function () {
                return playerMesh.actions.run.time;
            },
            set: function (val) {
                playerMesh.actions.run.time = val;
            }

        },
        'attackTime' : {
            get: function () {
                return playerMesh.actions.attack.time;
            },
            set: function (val) {
                playerMesh.actions.attack.time = val;
            }

        },
        'waveTime' : {
            get: function () {
                return playerMesh.actions.wave.time;
            },
            set: function (val) {
                playerMesh.actions.wave.time = val;
            }

        }

    });




    scene.add(playerMesh);
 //   scene.add( bbox );

    objects.push(playerMesh);
    players.push(player);

    // scene.add (test);




    return player;

};


*/







var removePlayer = function(player){

    var index = players.indexOf(player);

    if (index > -1) {
        players.splice(index, 1);
    };
///////////// в сцене и объектах -- ожин и тот же объект

//////////

    var object = objectForPID(player.playerId);

    scene.remove(object);

    var indexOBJ = objects.indexOf(object);

    if (indexOBJ > -1) {
        objects.splice(indexOBJ, 1);
    }



    postServerMessages.some(function(el , idx, arr){
        if (el.playerId == player.playerId){
            arr.splice(idx, 1);
        }
    });



    console.log ('PAYERS CNT '+ players.length+' OBJECTS CNT '+ objects.length + ' SCENE OBJ CNT '+ scene.children.length );

};
/*
var updatePlayerData = function(data){
    var player = playerForId(data.playerId);
    player.x = data.x;
    player.y = data.y;
    player.z = data.z;
    player.r_x = data.r_x;
    player.r_y = data.r_y;
    player.r_z = data.r_z;

    return player;
};
*/
var playerForId = function(id){

    var player;
    for (var i = 0; i < players.length; i++){
        if (players[i].playerId === id){

            player = players[i];
            break;

        }
    }

    return player;
};



function objectForPID(id){

    var object;
    for (var i = 0; i <  objects.length; i++){
        if (objects[i].playerId === id){

            object = objects[i];
            break;


        }
    }

    return object;
};







var renderPlayers = function(objects, delta, elapsedTimeAfterGetDelta) {



    var ptime =  process.hrtime(); // hack
    var currentTime = (ptime[0]+  1e-9 * ptime[1])
 //   console.log(currentTime +' vs '+serverSentTimes[0])


   // updateOimoPhysics(OIMOworld, OIMObodys, OIMOmeshs);
    objects.forEach(function (playerItem) {
      //  console.log('hello!!!!!!!!!!')

        var innerDelta = delta;

        playerItem.__dirtyPosition = true; //physi.js
        playerItem.__dirtyRotation = true;

       // if (playerItem.states.length > 1) {throw (err)}

     //   if (isServerInterpolation ) {

            if (isServerInterpolation && !playerItem.isTimeDelayBufferReady) {

                while (playerItem.inputStates.length > 0/*true*/) {



                    var serverLastSentTime = playerItem.inputStates[0][9]
                    console.log(serverLastSentTime + ' VS ' + serverSentTimes[0])

                    if (serverLastSentTime < serverSentTimes[0]) {

                        playerItem.inputStates.shift(); // next iterator
                        console.log('old')

                    } else if (serverLastSentTime == serverSentTimes[0]) {
                        console.log('exact');
                        /*
                         playerItem.userData.ts_client = state[0];
                         playerItem.userData.keyState = state[1];
                         playerItem.userData.mouseState = state[2];
                         playerItem.userData.mouse2D = state[3];
                         playerItem.userData.ts_server = state[4];    // serverLastUpdate
                         playerItem.userData.last_client_delta = state[5];
                         //DO NOT UNCOMMENT -- update DUPLICATION player.position.set(state[6].x,state[6].y,state[6].z)
                         //DO NOT UNCOMMENT -- player.rotation.set(state[7].x,state[7].y,state[7].z)
                         playerItem.userData.isCameraFollow = state[8];
                         //playerItem.deltaBuffer =
                         */

                        playerItem.isTimeDelayBufferReady = true;

                        playerItem.userData.needServerUpdate = true;

                        //arr.splice(i, 1);

                        break; // exit loop


                    } else { // too young input. need to wait
                        console.log('wait');
                        break; // exit loop;
                    }

                }
            }
     /*
                playerItem.inputStates.some(function (state, i, arr) {

                    console.log(state[9] + ' VS ' + serverSentTimes[0])

                    if (state[9] < serverSentTimes[0]) { //too old input
                        console.log('old');
                        arr.splice(i, 1)
                    } else if (state[9] == serverSentTimes[0]) {  // exact what we need
                        console.log('exact');
       */                /*
                        playerItem.userData.ts_client = state[0];
                        playerItem.userData.keyState = state[1];
                        playerItem.userData.mouseState = state[2];
                        playerItem.userData.mouse2D = state[3];
                        playerItem.userData.ts_server = state[4];    // serverLastUpdate
                        playerItem.userData.last_client_delta = state[5];
                        //DO NOT UNCOMMENT -- update DUPLICATION player.position.set(state[6].x,state[6].y,state[6].z)
                        //DO NOT UNCOMMENT -- player.rotation.set(state[7].x,state[7].y,state[7].z)
                        playerItem.userData.isCameraFollow = state[8];
                        //playerItem.deltaBuffer =
                        */
/*
                        playerItem.isTimeDelayBufferReady = true;

                        playerItem.userData.needServerUpdate = true;

                        //arr.splice(i, 1);

                        return true; // exit loop


                    } else { // too young input. need to wait
                        console.log('wait');
                        return true; // exit loop;
                    }




                });
            };
            console.log(playerItem.isTimeDelayBufferReady)
*/
            if (playerItem.isTimeDelayBufferReady || !isServerInterpolation) {

                console.log('playerItem.inputStates.length' + playerItem.inputStates.length);


                while (playerItem.inputStates.length > 0){
                    var state = playerItem.inputStates[0]
               //     console.log('!!!pre State '+ state[0] + ' keyState '+ JSON.stringify(state[1]) + ' ratation '+ JSON.stringify(playerItem.userData.rotation))
                 //   if (state[1][68]){ console.log ('debug')};

                    playerItem.userData.ts_client = state[0];
                    playerItem.userData.keyState = state[1];
                    playerItem.userData.mouseState = state[2];
                    playerItem.userData.mouse2D = state[3];
                    playerItem.userData.ts_server = state[4];    // serverLastUpdate
                    playerItem.userData.last_client_delta = state[5];
                    //DO NOT UNCOMMENT -- update DUPLICATION player.position.set(state[6].x,state[6].y,state[6].z)
                    //DO NOT UNCOMMENT -- player.rotation.set(state[7].x,state[7].y,state[7].z)
                    playerItem.userData.isCameraFollow = state[8];

                    playerItem.userData.numberSteps = state[11];
                    playerItem.userData.timeReminder = state[12];

                    console.log('numberSteps ' + state[11] + ' vs delta ' + state[5] )


                   // if

                    if (state[11] == 0/*playerItem.userData.last_client_delta < innerDelta*/){
                    //    console.log('playerItem.userData.last_client_delta < innerDelta')

                        //innerDelta -= playerItem.userData.last_client_delta;

                        checkKeyStates(playerItem,playerItem.userData.last_client_delta )
                        cameraControl(playerItem);
                        //playerItem.userData.camera.updateProjectionMatrix(); //already done onResize and on connect
                        playerItem.userData.camera.updateMatrixWorld(); // update camera since it's not a child of scene //
                        playerItem.userData.cameraJSON = playerItem.userData.camera.toJSON();

                        console.log('ts_client '+ playerItem.userData.ts_client + ' rotation '+ JSON.stringify(playerItem.userData.rotation) + ' position '+ JSON.stringify(playerItem.userData.position)+ ' innerDelta '+ innerDelta +' keyState '+ JSON.stringify(playerItem.userData.keyState))

                        postServerMessages.some(function (elem, idx, arr) {

                            if (elem.playerId == playerItem.userData.playerId) {
                                arr[idx] = JSON.parse(JSON.stringify(playerItem.userData));

                                //el.test = 'test ok';
                                // console.log(arr.length)
                                return true;
                            }

                        });


                        //arr.splice(idx,1);
                        playerItem.inputStates.shift();
                    } else if (state[11] > 0){




                        console.log(' steps to go '+ state[11])
                        state[11] -= 1 ; //decrease remained physics update count

                        var d = Math.min(state[5],delta) //delta is a step here
                        state[5] -= d; // decrease remained animation update time
                            //  playerItem.userData.last_client_delta -= innerDelta;
                            //state[5] -= innerDelta;



                            checkKeyStates(playerItem, d);

                            break; // exit loop

                    }

                }


/*
                playerItem.inputStates.some(function (state, idx, arr) {
                   // console.log('ts_client ' + state[0]);

                    console.log('!!!pre State '+ state[0] + ' keyState '+ JSON.stringify(state[1]) + ' ratation '+ JSON.stringify(playerItem.userData.rotation))
                    if (state[1][68]){
                        console.log ('debug')};

                    playerItem.userData.ts_client = state[0];
                    playerItem.userData.keyState = state[1];
                    playerItem.userData.mouseState = state[2];
                    playerItem.userData.mouse2D = state[3];
                    playerItem.userData.ts_server = state[4];    // serverLastUpdate
                    playerItem.userData.last_client_delta = state[5];
                    //DO NOT UNCOMMENT -- update DUPLICATION player.position.set(state[6].x,state[6].y,state[6].z)
                    //DO NOT UNCOMMENT -- player.rotation.set(state[7].x,state[7].y,state[7].z)
                    playerItem.userData.isCameraFollow = state[8];

                 //   playerItem.phyDelayReminder += last_client_delta; // add to time to be processed

                    if (playerItem.userData.last_client_delta < innerDelta){
                        console.log('playerItem.userData.last_client_delta < innerDelta')

                        innerDelta -= playerItem.userData.last_client_delta;

                        checkKeyStates(playerItem,playerItem.userData.last_client_delta )
                        cameraControl(playerItem);
                        //playerItem.userData.camera.updateProjectionMatrix(); //already done onResize and on connect
                        playerItem.userData.camera.updateMatrixWorld(); // update camera since it's not a child of scene //
                        playerItem.userData.cameraJSON = playerItem.userData.camera.toJSON();

                       console.log('ts_client '+ playerItem.userData.ts_client + ' rotation '+ JSON.stringify(playerItem.userData.rotation) + ' innerDelta '+ innerDelta +' keyState '+ JSON.stringify(playerItem.userData.keyState))

                        postServerMessages.some(function (elem, idx, arr) {

                            if (elem.playerId == playerItem.userData.playerId) {
                                arr[idx] = JSON.parse(JSON.stringify(playerItem.userData));

                                //el.test = 'test ok';
                                // console.log(arr.length)
                                return true;
                            }

                        })


                        arr.splice(idx,1);
                    } else {

                        console.log('ELSE')
                      //  playerItem.userData.last_client_delta -= innerDelta;
                        arr[idx][5] -= innerDelta;

                        checkKeyStates(playerItem, innerDelta);

                        return true // exit loop
                    }





                })

*/
            }
            //   checkKeyStates(playerItem, playerItem.userData.last_client_delta); //









          //  playerItem.timeDelayReminder =

            //playerItem.userData.last_client_delta

//       }
      //  playerItem.states.forEach(function(player, i arr) {})

/*
            player.ts_client = state[0];
            player.keyState = state[1];
            player.mouseState = state[2];
            player.mouse2D = state[3];
            player.ts_server = state[4];
            player.last_client_delta = state[5]; // never used. saved on client side for client reconciliation
            //DO NOT UNCOMMENT -- update DUPLICATION player.position.set(state[6].x,state[6].y,state[6].z)
            //DO NOT UNCOMMENT -- player.rotation.set(state[7].x,state[7].y,state[7].z)
            player.isCameraFollow = state[8]

  */ //         player.needServerUpdate = true;
       // });


       // console.log(playerItem.userData.needServerUpdate)
       // console.log('sync upd')
     //   scene.setFixedTimeStep(0.05);
      //  playerItem.setLinearVelocity({x:1,y:0,z:1});
       // scene.simulate(0.15, 3);
        //scene.simulate(0.6/20, 10);
       // scene.simulate(0.05, 3);



        //console.log(playerItem.position)
       // console.log((0.3/20)%(1/20)+(0.6/20)%(1/20)+(0.1000001/20)%(1/20))
       // console.log(1/20)

       // throw(err)


       // playerItem.setAngularFactor(new THREE.Vector3(0,0,0));
        //playerItem.setAngularVelocity(new THREE.Vector3(0,0,0));
      //  playerItem.setLinearFactor(new THREE.Vector3(.01,1,.01));


      //  if(playerItem.userData.needServerUpdate) {





            // console.log(playerItem.userData.states.length)

            /*
             while (playerItem.userData.states[0]) {

             // console.log(playerItem.userData.states.length)


             var state = playerItem.userData.states[0];
             var player = playerItem.userData;
             player.ts_client = state[0];
             player.keyState = state[1];
             player.mouseState = state[2];
             player.mouse2D = state[3];
             player.ts_server = state[4];
             player.last_client_delta = state[5];
             player.isCameraFollow = state[8]
             //   player.needServerUpdate = true;



             // var ddelta = playerItem.userData.last_client_delta - delta //- playerItem.userData.delta_dept

             if ((state[5] - delta)>0) {




             checkKeyStates(playerItem, delta);
             console.log('true cldelta' + state[5] + ' delta '+ delta)
             state[5] -= delta;  // decrease delta to be processed
             //  playerItem.userData.delta_dept = 0;


             break;


             } else if ((state[5] - delta)<=0) {

             console.log('FALSE cldelta' + state[5] + ' delta '+ delta)

             checkKeyStates(playerItem, state[5]);
             playerItem.userData.states.shift();
             delta -= playerItem.userData.last_client_delta
             //  playerItem.userData.delta_dept = (- ddelta);  // dept for non-processed client delta ;
             //  console.log(delta_dept);

             //  console.log('false')


             }

             }


             */


            // console.log(playerItem.userData.ts_client +' ' + JSON.stringify(playerItem.userData));
            /**/
            //console.log('test');
            //  console.log(playerItem.userData.ts_client +' pre '+ JSON.stringify(playerItem.rotation) + ' delta '+ playerItem.userData.last_client_delta + ' ts '+ playerItem.userData.ts)

            //checkKeyStates(playerItem, playerItem.userData.last_client_delta);

            //   console.log(playerItem.userData.ts_client +' after '+ JSON.stringify(playerItem.rotation) + ' delta '+ playerItem.userData.last_client_delta )


            ///



           // playerItem.



            // playerItem.updateMatrix();  //// WRONG??? should be after checkKeyStates

            //    console.log( 'update cameraJSON');
            //    console.log(playerItem.userData.cameraJSON);
            //    console.log( 'convert BACK to object cameraJSON');

            // var loader = new THREE.ObjectLoader();
            //    console.log(loader.parse(playerItem.userData.cameraJSON));

            //    console.log( playerItem.userData.cameraJSON === playerForId(playerItem.name).cameraJSON);


            // playerItem.mixer.update(playerItem.userData.last_client_delta);

            // console.log('mixAfter '+playerItem.mixer.time + ' delta ' + delta + ' time after ' + goalTime + ' for '+ playerItem.playerId )
            //  console.log('player '+ playerItem.name +' mixer time '+ playerItem.mixer.time);

            //  playerItem.userData.mixerTime = playerItem.mixer.time;
            //  playerItem.userData.actions.standTime = playerItem.actions.stand.time;
            // playerItem.userData.actions.standTime = playerItem.actions.stand.time


            // checkRayCast(playerItem, scene);
            //console.log(playerItem.intersected);

            // console.log('ts_clien: '+playerItem.ts_client+' ')




            //   console.log('AFTER '+playerItem.userData.ts_client +' ' + JSON.stringify(playerItem.userData));
/*
        if (!isServerInterpolation) {
            checkKeyStates(playerItem, innerDelta);


            cameraControl(playerItem);
            //playerItem.userData.camera.updateProjectionMatrix(); //already done onResize and on connect
            playerItem.userData.camera.updateMatrixWorld(); // update camera since it's not a child of scene //

            playerItem.userData.cameraJSON = playerItem.userData.camera.toJSON();

            playerItem.userData.needServerUpdate = false;

          //  console.log(JSON.stringify(playerItem.position))


            postServerMessages.some(function (elem, idx, arr) {

                if (elem.playerId == playerItem.userData.playerId) {
                    arr[idx] = JSON.parse(JSON.stringify(playerItem.userData));

                    //el.test = 'test ok';
                    // console.log(arr.length)
                    return true;
                }

            })
            // }
        }
*/
    });
 //   scene.simulate();
    scene.updateMatrixWorld(); // updateMeshes RAYCASTER needs

   // serverSentTimes.shift(); // length filled during initialization

   // console.log(serverSentTimes.length);
//    deltaTime = clock.getDelta();
       // socket.emit('updateWorld', players) //  надо ли переносить в checkKeyStates?? !!!!!!!!!!! Или вообще на месте обрабатывать в consumer'е

}

var resetMoveStates = function(){
    players.forEach(function (playerItem) {


        playerItem.moveState = {


            hitOnce: false
        };
    });
}

//setInterval(renderPlayers,300)
/*
var checkKeyStates = function(player , delta){
    //console.log(' pre playerItem.quaternion: '+JSON.stringify(player.quaternion)+ 'playerItem._physijs.rotation: '+JSON.stringify(player._physijs.rotation))


   // player.userData.rotation.y-= delta * player.userData.turnSpeed
    //player.rotation.y -= delta * player.userData.turnSpeed

    //console.log(' new playerItem.quaternion: '+JSON.stringify(player.quaternion)+ 'playerItem._physijs.rotation: '+JSON.stringify(player._physijs.rotation))


    // console.log(player.mixer.time + '  VS  ' + player.userData.mixerTime);
// ROTATION !!!!!!!!! PLAYER.ROTATION IS NOT LINKED TO PLAYER.USERDATA.ROTATION -- kinda HACK
  //  console.log(player.userData.rotation.y + ' VS '+ player.rotation.y + '  -----   '+ player.userData.quaternion.y+ ' VS '+ player.quaternion.y)

    if (player.userData.keyState[38] || player.userData.keyState[87]) {
        // up arrow or 'w' - move forward
        player.actions.run.play()
        player.position.x -= delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);  //DO NOT USE PLAYER.ROTATION ITS NOT LINKED!!!
        player.position.z += delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);

    } else {
        player.actions.run.stop()
    };

  //  if (!player.keyState[38] && !player.keyState[87])  player.userData.actions.run.stop(); //run stop anim



    if (player.userData.keyState[40] || player.userData.keyState[83]) {
        // down arrow or 's' - move backward
        player.position.x += delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);
        player.position.z -= delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);
        //player.position.x += player.moveSpeed * Math.sin(player.rotation.y);
        //player.position.z += player.moveSpeed * Math.cos(player.rotation.y);

        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    };
    if (player.userData.keyState[37] || player.userData.keyState[65]) {
        // left arrow or 'a' - rotate left

        //ver1
        player.userData.rotation.y+= delta * player.userData.turnSpeed
      //  console.log('rot '+ player.userData.rotation._y +' vs '+ player.userData.rotation.y)
        //console.log( player.rotation.__proto__)

        //ver 2
        //!(player.userData.keyState[40] || player.userData.keyState[83]) ? player.userData.rotation.y += delta * player.userData.turnSpeed : player.userData.rotation.y -= delta * player.userData.turnSpeed ; // switch for backward

      // player.quaternion.setFromEuler(player.userData.rotation) // this.matrixUpdate won't catch rotation. only quaternion is used
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    };
    if ((player.userData.keyState[39] || player.userData.keyState[68])) {
        // right arrow or 'd' - rotate right

        //ver1
        player.userData.rotation.y-= delta * player.userData.turnSpeed
        //ver 2
        //!(player.userData.keyState[40] || player.userData.keyState[83]) ? player.userData.rotation.y -= delta * player.userData.turnSpeed : player.userData.rotation.y += delta * player.userData.turnSpeed ; // switch for backward

     //   player.quaternion.setFromEuler(player.userData.rotation) // this.matrixUpdate won't catch rotation. only quaternion is used
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    };
    if (player.userData.keyState[81]) {
        // 'q' - strafe left
        player.position.x += delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);
        player.position.z += delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);
        //player.position.x -= player.moveSpeed * Math.cos(player.rotation.y);
        //player.position.z += player.moveSpeed * Math.sin(player.rotation.y);
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    };
    if (player.userData.keyState[69]) {
        // 'e' - strafe right
        player.position.x -= delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);
        player.position.z -= delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);
        //player.position.x += player.moveSpeed * Math.cos(player.rotation.y);
        //player.position.z -= player.moveSpeed * Math.sin(player.rotation.y);
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    };

    (player.userData.mouseState[0]) ? player.actions.attack.play() :  player.actions.attack.stop();
    (player.userData.keyState[70]) ? player.actions.wave.play() :  player.actions.wave.stop();




   // console.log(JSON.stringify(player.userData.rotation) +'  vs  '+JSON.stringify(player.rotation)  )


    player.mixer.update(delta);

    //console.log(player.userData.mouseState[0] + '  '+ player.actions.attack.time + ' '+ player.userData.actions.attackTime);
 //   console.log(JSON.stringify(player.userData.keyState) + '  '+ player.actions.wave.time + ' '+ player.userData.actions.waveTime);

};


*/
/*
var checkRayCast = function(object){
    var player = object.userData;
    var mouse = object.userData.mouse2D;
    var camera = object.userData.camera;
    var raycaster = object.userData.raycaster;
    var INTERSECTED = scene.getObjectById(player.intersected_scene_id); //TODO: exclude light from intersection//object.userData.intersected;


    raycaster.setFromCamera(player.mouse2D, player.camera) //(mouse,camera);

    //console.log(INTERSECTED);
    //console.log(mouse);
   // console.log(camera);
   // console.log(scene.children)



    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object  ) {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);

            player.intersected_scene_id = INTERSECTED.id; // got new id back
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
    }




    //console.log(intersects);
 //     console.log('camera pos');
 //     console.log(camera.position);
//    console.log('camera aspect' + camera.aspect);
//    console.log('proj matrix');
//    console.log(camera.projectionMatrix);
  //  console.log('mouse  x:' + mouse.x +' y: ' + mouse.y );
   //   console.log('RAY FROM '+object.userData.playerId+ ' INTERSECTS OBJECT ' +(INTERSECTED ? INTERSECTED.userData.playerId : INTERSECTED ))
   // console.log('Rotation '+ (INTERSECTED ? ('object rotation ' + JSON.stringify(INTERSECTED.rotation) + 'userData rotation ' + JSON.stringify(INTERSECTED.userData.rotation) ) : INTERSECTED ))

   // if(INTERSECTED) {console.log('RAY FROM '+object.userData.playerId+ ' INTERSECTS OBJECT ' + INTERSECTED.userData.playerId )} else (console.log(''));


    //console.log()


};
*/
/*
function cameraControl (player) {

   if(!player.userData.isCameraFollow) return ;
    var camera = player.userData.camera;



    camera.position.x =  player.position.x + player.userData.playerCameraDist.distance *  (Math.cos( player.rotation.y ));
    camera.position.z =  player.position.z  - player.userData.playerCameraDist.distance * Math.sin( player.rotation.y  );

  //  console.log('roy y '+player.rotation.y + 'cos y ' + Math.cos( (player.rotation.y)  ) + 'sin y '+  Math.sin( player.rotation.y  ) )

    //camera rotate y
    //camera.position.x = player.position.x + player.camera.distance * Math.cos( (player.camera.y) * Math.PI / 360 );
    camera.position.y = player.position.y + player.userData.playerCameraDist.distance * Math.sin( (player.userData.playerCameraDist.y) * Math.PI / 360 );



    camera.lookAt(player.position);



};
*/



//


module.exports.players = players;
module.exports.postServerMessages = postServerMessages;


module.exports.addPlayer = addPlayer;
module.exports.removePlayer = removePlayer;
//module.exports.updatePlayerData = updatePlayerData;
module.exports.playerForId = playerForId;
module.exports.objectForPID = objectForPID;

//module.exports.onKeyDown = onKeyDown;
//module.exports.onKeyUp = onKeyUp;
//module.exports.onMouseDown = onMouseDown;
//module.exports.onMouseUp = onMouseUp;

module.exports.renderPlayers = renderPlayers;

module.exports.resetMoveStates = resetMoveStates;

module.exports.jsonContent = jsonContent;

module.exports.objects = objects;

module.exports.scene = scene;

module.exports.geometryTemplate = geometryTemplate;
module.exports.multiMaterialTemplate = multiMaterialTemplate;



module.exports.serverSentTimes = serverSentTimes

module.exports.isServerInterpolation = isServerInterpolation;