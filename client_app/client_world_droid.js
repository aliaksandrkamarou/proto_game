'use strict';

///////////GLOBALS

var renderer, raycaster, objects = [];

var sphere;
var players = [];
//var player ={}; //playerId //, moveSpeed, turnSpeed;
var messageStack = [];

var g_Pending_input = [];
//var g_afterReconcilationState = {};
var  g_Current_state = {};
//var g_Temp_state = {keyState: {}};
//var g_Pending_server_hist = [];
var g_Ghosts = [];


var g_Player, g_PlayerObject;
var objectLoader = new THREE.ObjectLoader();
var g_timeReminder = 0;

//var g_lastTick = 0;
var serverLastUpdateTime = 0;
var serverLastSentTime = 0
var g_Current_Client_time = 0;
var g_Current_Rendiring_time = 0;



var joystick, joystick2
//var g_currentPs_sec = 0;
var g_CheckPoint;


// var mouse = new THREE.Vector2();

var geometryTemplate, multiMaterialTemplate;
////////////////////////////////////
//init
var light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(-10,10, -7)//.normalize();
light.castShadow = true;


//light.shadow.mapSize.width= 2048;
//light.shadow.mapSize.height = 2048;

light.shadow.camera.left = -20;
light.shadow.camera.right = 20;
light.shadow.camera.top = 20;
light.shadow.camera.buttom = -20;
light.shadow.mapSize.set(2048,2048)
//light.shadow.bias = 0.1
//light.shadow.radius = .5
var light2 = new THREE.AmbientLight( 0x404040 );







//var ls =  new THREE.DirectionalLightShadow()


var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( -10, 10, 10 );

spotLight.castShadow = true;
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 1000;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
//spotLight.shadow.darkness = 0.1

//spotLight.angle = .1

/*
spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;
*/
//var slshadow = new THREE.SpotLightShadow();


//var scene = new physijs.Scene( '../lib/physijs-worker.js', {gravity:{x:0, y:-9.8, z:0}} );//
//console.log( 'scene ' )
//console.log(scene.physijs.worker.onmessage)

var scene_world_bodys_meshs = initWorld() //new THREE.Scene()
var scene = scene_world_bodys_meshs.scene;
//var OIMOworld = scene_world_bodys_meshs.OIMOworld;
//var OIMObodys = (scene_world_bodys_meshs.bodys);
//var OIMOmeshs = (scene_world_bodys_meshs.meshs);

//var scene = new Physijs.Scene({fixedTimeStep: 0 });
scene.fog = new THREE.FogExp2(0x000000, 0.01);
scene.autoUpdate = false || true;



//scene.add(light2)
scene.add(light);
scene.add(spotLight);
spotLight.angle = 0.25;

spotLight.penumbra = .2;
spotLight.intensity = .5;

//var shadowHelper = new THREE.CameraHelper( light.shadow.camera );
//var shadowHelper = new THREE.CameraHelper( spotLight.shadow.camera );
var spotLightHelper = new THREE.SpotLightHelper( spotLight )
scene.add(spotLightHelper);

//scene.add(ls)
//scene.add( spotLight );
//var JSONloader = new THREE.JSONLoader();
var loader = new THREE.JSONLoader();
//loader.load("droid.js", function (geometry) {
   // geometryTemplate = geometry;
    //geometryTemplate.scale(.02,.02,.02);
   // geometryTemplate.rotateY( Math.PI );
    //geometry.updateMatrix();
    //geometryTemplate.verticesNeedUpdate = true;
//});


//var mixer;
loader.load('../models/Y_Bot/Y_Bot_v2.json',function(geometry, materials) {

    materials.forEach(function(material){
        material.skinning = true;
    })

    multiMaterialTemplate = materials;
    geometryTemplate = geometry;
    onready();
  /*
    var multiMaterial = new THREE.MultiMaterial(materials);

    var mesh = new THREE.SkinnedMesh( geometry, multiMaterial);
    mesh.name = 'model';

    mixer = new THREE.AnimationMixer( mesh );

    mixer.clipAction(mesh.geometry.animations[1]).play();
    var cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    var cubeMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    cubeMaterial.transparent = true;
    cubeMaterial.opacity = 0.5;

    //cubeMaterial.dynamic = true;
    //cubeMaterial.skinning = true;

   var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );

    //cube.updateMatrix();
    //cube.updateMatrixWorld();

    cube.position.copy(mesh.children[0].position);
    cube.updateMatrix();
    //cube.updateMatrixWorld();



    THREE.SceneUtils.attach ( cube, scene, mesh.children[0] )

    scene.add(mesh);

    //helper = new THREE.SkeletonHelper( mesh );

    //scene.add(helper);
    //scene.add(cube);
*/

});




//var geoMatTemplate =  initGeoMat();

//geometryTemplate = geoMatTemplate.geometryTemplate;
//multiMaterialTemplate = geoMatTemplate.multiMaterialTemplate;

///

/*
//Player construcor
function Player(mesh, id) {

    mesh.userData = this


    this.playerId = id; // const!!!!!
    mesh.name = mesh.playerId = this.playerId;


    this.position = mesh.position; // link
    this.position.set(0, 25, 0); // set


    this.rotation =  mesh.rotation// new THREE.Euler();     // DO NOT LINK IT TO  mesh.rotation since scene.updateMatrixWorld() uses it somehow
    this.rotation.set(0, 0, 0, 'XYZ'); // set

    this.quaternion = mesh.quaternion; //link

    this.scale = mesh.scale//link
    //this.scale.set(0.02, 0.02, 0.02); //set

    this.camera = new THREE.PerspectiveCamera(); //to be updated from player's side
    this.camera.position.set(200, 200, 350);
    this.camPos = this.camera.position
    // this.camera.aspect = 0.5;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.cameraJSON = this.camera.toJSON();
    this.playerCameraDist = {
        distance: 250,
        x:0, // angle?
        y:30,
        z:0
    };
    this.isCameraFollow = false;


//
    this.keyState = {};
    this.mouseState = {};
    this.moveSpeed = 100;
    this.turnSpeed = 1.0;

    this.moveState = {

        hitOnce: false
    };

    this.mouse2D = new THREE.Vector2();


    this.raycaster = new THREE.Raycaster();
    this.raycaster.linePrecision = 0; // do NOT try to interact with lines


    mesh.mixer = new THREE.AnimationMixer(mesh);


    mesh.actions = {
        stand: mesh.mixer.clipAction(mesh.geometry.animations[0]),
        run: mesh.mixer.clipAction(mesh.geometry.animations[1]),
        attack: mesh.mixer.clipAction(mesh.geometry.animations[2]),
        painOne: mesh.mixer.clipAction(mesh.geometry.animations[3]),
        wave: mesh.mixer.clipAction(mesh.geometry.animations[10])

    };

    mesh.actions.stand.play();


    // this.actions = {};
    this.actions = {
        standTime: mesh.actions.stand.time,
        runTime: mesh.actions.run.time,
        attackTime: mesh.actions.attack.time,
        painOneTime: mesh.actions.painOne.time,
        waveTime: mesh.actions.wave.time

    };

    this.mixerTime = undefined; // sockets BUG?


    this.intersected_scene_id = undefined;

    this.pending_inputs = [];

    this.ts_client = 0;
    this.ts_server = undefined;
    this.last_client_delta = 0;
    this.needServerUpdate = false;

    this.ts_inte = undefined;

    this.ts_render = undefined;


    //interpolation
    this.pending_server_hist = [];

    this.local_timer = undefined;

};

*/
function objectForPID(id) {

    var object;
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].playerId === id) {

            object = objects[i];
            break;


        }
    }

    return object;
};


function playerForId(id) {

    var player;
    for (var i = 0; i < players.length /*scene.children.length*/; i++) {
        if (players[i].playerId === id) {

            player = players[i];
            break;


            //if (scene.children[i].userData.playerId == id){

            //    player = scene.children[i];
            //    break;

        }
    }

    return player;
};


var removeOtherPlayer = function (data) {  // need to delete two objects!!!

    var player = playerForId(data.playerId);

    var indexP = players.indexOf(player);

    if (indexP > -1) {
        players.splice(indexP, 1);
    }


    var object = objectForPID(data.playerId);

    scene.remove(object);

    var indexOBJ = objects.indexOf(object);

    if (indexOBJ > -1) {
        objects.splice(indexOBJ, 1);
    }


    console.log('PAYERS CNT ' + players.length + ' OBJECTS CNT ' + objects.length + ' SCENE OBJ CNT ' + scene.children.length);


};



document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);


document.addEventListener('mousemove', onDocumentMouseMoveRaycater, false);

var shouldHandleKeyDown = new Array(222);
shouldHandleKeyDown.fill(true);
function onKeyDown(event) {

    if (!shouldHandleKeyDown[event.keyCode||event.which]) return;
    shouldHandleKeyDown[event.keyCode||event.which] = false;

    console.log((event.keyCode || event.which));

    if ((event.keyCode || event.which) == 220) console.log('STATUS isPrediction: ' + isPrediction + ' isServerUpdate: ' + isServerUpdate + ' isReconciliation ' + isReconciliation + ' isInterpolation ' + isInterpolation)

    if ((event.keyCode || event.which) == 219) {
        isPrediction = (!isPrediction)
        console.log('isPrediction: ' + isPrediction + ' isServerUpdate: ' + isServerUpdate)
    }
    ;
    if ((event.keyCode || event.which) == 221) {
        isServerUpdate = (!isServerUpdate)
        console.log('isPrediction: ' + isPrediction + ' isServerUpdate: ' + isServerUpdate)
    }
    ;
    if ((event.keyCode || event.which) == 80) {
        isReconciliation = (!isReconciliation)
        console.log('isReconciliation: ' + isReconciliation)
    }
    ;
    if ((event.keyCode || event.which) == 79) {
        isInterPhysAnim = (!isInterPhysAnim)
        console.log('isInterpolation: ' + isInterPhysAnim)
    }
    ;

    if ((event.keyCode || event.which) == 73) {
        g_Player.isCameraFollow = (!g_Player.isCameraFollow)
        console.log('isCameraFollow: ' + g_Player.isCameraFollow)
    }
    ;


    //event = event || window.event;
    g_Player.keyState[event.keyCode || event.which] = true;
  //  g_Temp_state.keyState[event.keyCode || event.which] = true;
    // socket.emit('keydown',event.keyCode || event.which); // emit keyCode or which depending on browser
      console.log('keydown emitted ' + event.keyCode || event.which);

    //  console.log(event);
    ///
    //  document.removeEventListener('keydown',onKeyDown, false );

    ///

};

function onKeyUp(event) {
    shouldHandleKeyDown[event.keyCode||event.which] = true;
    g_Player.keyState[event.keyCode || event.which] = false;
   // g_Temp_state.keyState[event.keyCode || event.which] = false;
    //  socket.emit('keyup',event.keyCode || event.which); // emit keyCode or which depending on browser
    //  console.log('keyup emitted ' + event.keyCode || event.which);
    //  console.log(event);
    //   document.addEventListener('keydown', onKeyDown, false );

};


function onMouseDown(event) {
    event.preventDefault();
    g_Player.mouseState[event.button] = true;
    //  socket.emit('mousedown', event.button)
};

function onMouseUp(event) {
    event.preventDefault();
    g_Player.mouseState[event.button] = false;
    // socket.emit('mouseup', event.button)
};


function onDocumentMouseMoveRaycater(event) {
    event.preventDefault();
//TODO: make same logic on client and server
    var mouse = {};// override

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    //  console.log('x: '+ mouse.x + ' y: '+ mouse.y)
    if (g_Player)  g_Player.mouse2D.set(mouse.x, mouse.y);
    // socket.emit('mouse2D',mouse );

};

//var delta ;



var updateOnePlayer = function (playerData, ts) {



    var player = objectForPID(playerData.playerId);

   // player.userData.serverLastSentTime = serverLastSentTime;

    if (player) {
     //   player.userData.serverLastSentTime = serverLastSentTime;
     //   if(player.userData.ts_server == playerData.ts_client){console.log('!!!!!SAME input??? '+JSON.stringify(player.userData.position) + ' vs '+JSON.stringify(playerData.position) + ' ts_client '+ playerData.ts_client);
     //       if(player.playerId == g_Player.playerId){g_Player.needReconcilation = false} else{};

     //       return;}


     //   console.log('dirty position ' + player.__dirtyPosition)

        player.__dirtyPosition = true; // for other players
        player.__dirtyRotation = true; // for other players
        player.setLinearVelocity({x:playerData._physijs.linearVelocity.x, y:playerData._physijs.linearVelocity.y, z:playerData._physijs.linearVelocity.z} )  // + event listener + checkKeystates
        player.setAngularVelocity({x:playerData._physijs.angularVelocity.x, y:playerData._physijs.angularVelocity.y, z:playerData._physijs.angularVelocity.z} )







        //player.userData.isCameraFollow = playerData.isCameraFollow;
     //   player.userData.ts = ts;

        player.userData.ts_server = playerData.ts_client//serverLastUpdateTime//playerData.ts_server // last ts proceeded by server;
      //  player.userData.ts_client = playerData.ts_client // last ts proceeded by server;
        player.userData.keyState = playerData.keyState;
        player.userData.mouseState = playerData.mouseState;
        player.userData.mouse2D.set(playerData.mouse2D.x, playerData.mouse2D.y);

        player.userData.last_client_delta = playerData.last_client_delta;
        player.position.set(playerData.position.x, playerData.position.y, playerData.position.z);
     //   console.log(JSON.stringify(player.position));
        //TODO: get rid of rotation it's re-linking HELL!
       // console.log('serv rot ' +JSON.stringify(playerData.rotation));
        //player.userData.rotation.set(playerData.rotation._x, playerData.rotation._y, playerData.rotation._z, playerData.rotation._order);

        player.userData.quaternion.set(playerData.quaternion._x,playerData.quaternion._y,playerData.quaternion._z,playerData.quaternion._w)
     //   console.log(JSON.stringify(player.userData.quaternion))

        player.userData.timeReminder = playerData.timeReminder;
        player.userData.numberSteps = playerData.numberSteps;




        //physijs

       //   player.setAngularVelocity(playerData._physijs.angularVelocity);
       //  player._physijs.height = playerData._physijs.height;
       //  player._physijs.id = playerData._physijs.id;
       //   player.setLinearVelocity( playerData._physijs.linearVelocity);
       //  player._physijs.mass = playerData._physijs.mass;
       // player._physijs.position = playerData._physijs.position;
       //   player._physijs.position = playerData.position ;// initial default
       //   player._physijs.rotation = playerData.quaternion;
       //  player._physijs.radius = playerData._physijs.rotation;
       //  player._physijs.touches = playerData._physijs.touches;
       //   player._physijs.type = playerData._physijs.type;

      //   console.log(player.userData.quaternion);
       // console.log (player.rotation.constructor.name);
       // player.quaternion.set(playerData.quaternion._x, playerData.quaternion._y, playerData.quaternion._z, playerData.quaternion._w);


       // player.actions.run.play();
       // player.actions.attack.play();
       // player.actions.wave.play();

        //ANIM
        //IDLE
        (player.userData.keyState.some(function(el, idx, arr){
            return el == true;
        })) ? player.actions.stand.stop():player.actions.stand.play();


        //FORFARD/BACKWARD

        if
        ((player.userData.keyState[38] || player.userData.keyState[87]) && !(player.userData.keyState[40] || player.userData.keyState[83])) {

            player.actions.run.play();
            player.actions.back.stop();

        } else if (!(player.userData.keyState[38] || player.userData.keyState[87]) && (player.userData.keyState[40] || player.userData.keyState[83]))

        // down arrow or 's' - move backward and NOT w -- forward
        {
            player.actions.run.stop();
            player.actions.back.play();
        }
        else {
            player.actions.back.stop();
            player.actions.run.stop();
        }
        ;

        if ((player.userData.keyState[37] || player.userData.keyState[65]) && !(player.userData.keyState[39] || player.userData.keyState[68])) {
            // left arrow or 'a' - rotate left NOT rigth
            if(!(player.userData.keyState[87]||player.userData.keyState[83])) {
                player.actions.turnL.play();
            } else {player.actions.turnL.stop()}
            player.actions.turnR.stop();

           //socket.emit('updatePosition', playerData);
        } //else {player.setAngularVelocity({x:0,y:0,z:0})};

        else if (!(player.userData.keyState[37] || player.userData.keyState[65]) && (player.userData.keyState[39] || player.userData.keyState[68])) {
            // right arrow or 'd' - rotate right NOT Left
            if(!(player.userData.keyState[87]||player.userData.keyState[83])) {
                player.actions.turnR.play();
            } else {player.actions.turnR.stop()}

            player.actions.turnL.stop();
       //socket.emit('updatePosition', playerData);
        } else {
            player.actions.turnL.stop();
            player.actions.turnR.stop();

        };






        if (player.userData.keyState[49]) {
            //    console.log('49!!!!!!!!!!!!')
            //   console.log(player.actions.action1.time)
            //   console.log(player.userData.actions.action1Time)
            player.actions.action1.play();

        } else {
            player.actions.action1.stop();
        };
        if (player.userData.keyState[50]) {
            player.actions.action2.play();

        } else {
            player.actions.action2.stop();
        };




        //    (playerData.keyState[38] || playerData.keyState[87]) ? player.actions.run.play() :  player.actions.run.stop();
    //    (playerData.keyState[40] || playerData.keyState[83]) ? player.actions.back.play() : player.actions.back.stop();

        (playerData.mouseState[0]) ? player.actions.attack.play() : player.actions.attack.stop();
       // (playerData.keyState[70]) ? player.actions.wave.play() : player.actions.wave.stop();
/*

        player.userData.moveState = playerData.moveState;

        if (player.userData.moveState.hitOnce) {

            player.actions.painOne.play();
            player.actions.painOne.reset();
        }
*/


        if (player.mixer.time != playerData.mixerTime) {

            player.mixer.time = playerData.mixerTime;

            //   console.log ('MIXER TIME CHANGED to'+ player.mixer.time + ' for '+ player.playerId +' at '+g_Player.playerId);

        }

        if (player.actions.stand.time != playerData.actions.standTime) {
            player.actions.stand.time = playerData.actions.standTime;
          //    console.log ('STAND TIME CHANGED');
        }

        if (player.actions.run.time != playerData.actions.runTime) {
            player.actions.run.time = playerData.actions.runTime;
       //       console.log ('RUN TIME CHANGED');
        }

        if (player.actions.attack.time != playerData.actions.attackTime) {
            //  console.log ('PRE ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
            player.actions.attack.time = playerData.actions.attackTime;
            //  console.log ('ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
        }
        if (player.actions.back.time != playerData.actions.backTime) {
            //  console.log ('PRE ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
            player.actions.back.time = playerData.actions.backTime;
            //  console.log ('ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
        }
        if (player.actions.stand.time != playerData.actions.standTime) {
            //  console.log ('PRE ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
            player.actions.stand.time = playerData.actions.standTime;
            //  console.log ('ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
        }
        if (player.actions.turnL.time != playerData.actions.turnLTime) {
            //  console.log ('PRE ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
            player.actions.turnL.time = playerData.actions.turnLTime;
            //  console.log ('ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
        }
        if (player.actions.turnR.time != playerData.actions.turnRTime) {
            //  console.log ('PRE ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
            player.actions.turnR.time = playerData.actions.turnRTime;
            //  console.log ('ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
        }
       // console.log('TA-TIME '+playerData.actions.action1Time)
        if (player.actions.action1.time != playerData.actions.action1Time) {
            //  console.log ('PRE ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
            player.actions.action1.time = playerData.actions.action1Time;
            //  console.log ('ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
        }
        if (player.actions.action2.time != playerData.actions.action2Time) {
            //  console.log ('PRE ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
            player.actions.action2.time = playerData.actions.action2Time;
            //  console.log ('ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
        }


        /*
                if (player.actions.wave.time != playerData.actions.waveTime) {
                    player.actions.wave.time = playerData.actions.waveTime;
                    //  console.log ('WAVE TIME CHANGED');
                }
        */
        if(!isInterPhysAnim || player.playerId != g_Player.playerId) {player.mixer.update(0)};


        //player.__dirtyPosition = true; //physi.js
        //player.__dirtyRotation = true;

       // player.setAngularVelocity(playerData._physijs.angularVelocity);
       // player.setLinearVelocity( playerData._physijs.linearVelocity);

        if (player.playerId == g_Player.playerId) {


            g_Player.needReconcilation = true;

            //TODO: make it simpler
            g_Player.camera.copy(objectLoader.parse(playerData.cameraJSON));
           // g_Player.camera = camera;


            //physijs

         //   player.setAngularVelocity(playerData._physijs.angularVelocity);
            // player._physijs.height = playerData._physijs.height;
            // player._physijs.id = playerData._physijs.id;
         //   player.setLinearVelocity( playerData._physijs.linearVelocity);

        //    player.setAngularVelocity({x:0,y:0,z:0});

        //    player.setLinearVelocity( {x:0,y:0,z:0});
            // player._physijs.mass = playerData._physijs.mass;
            // player._physijs.position = playerData._physijs.position;
            // player._physijs.radius = playerData._physijs.rotation;
            // player._physijs.touches = playerData._physijs.touches;
            //  player._physijs.type = playerData._physijs.type;

        } else {

         //   player.setAngularVelocity({x:0,y:0,z:0});

         //   player.setLinearVelocity( {x:0,y:0,z:0});

        }







    }

};


var width = window.innerWidth;
var height = window.innerHeight;


//scene.add(player.model.objects);
/*
   var camera = new THREE.PerspectiveCamera();
console.log('cam 1st init')
   console.log(camera)//width / height //40, 1, 1, 1000
   camera.position.y = 350;
   camera.position.z = 200;
   camera.position.x = 200;
   camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
   camera.updateMatrixWorld();

 scene.add(camera);
*/

//	var light = new THREE.SpotLight( 0xffffff, 2 );
//	light.position.set( 10, 10, 10 );
//	light.target.position.set( 0, 0, 0 );
//	light.castShadow = true;
//	light.shadowCameraNear = camera.near;
//	light.shadowCameraFar = camera.far;
//	light.shadowCameraFov = camera.fov;
//	light.shadowBias = 0.0001;
//	light.shadowDarkness = 0.3;
//	light.shadowMapWidth  = 1000;
//	light.shadowMapHeight = 1000;


//	var light2 = new THREE.DirectionalLight( 0xffffff );
//	light2.position.set( 1, 1, 1 ).normalize();
//	scene.add( light2 );

renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

//renderer.gammaInput = true;
//renderer.gammaOutput = true;
renderer.shadowMap.enabled = true;
//renderer.shadowMap.renderReverseSided = false;
//renderer.shadowMapEnabled = true;
//renderer.shadowMap.Soft = true;
//renderer.shadowMap.Type = THREE.PCFShadowMap;
//renderer.shadowCameraFov = 90;
//renderer.shadowMapSoft = true;

//renderer.shadowMapBias = 0.0039;
//renderer.shadowMap.darkness = 0.1;

//	renderer.shadowCameraNear = 10;
//	renderer.shadowCameraFar = camera.far;
//	renderer.shadowCameraFov = 50;
//	renderer.shadowMapBias = 0.0039;
//	renderer.shadowMapDarkness = 0.5;
//	renderer.shadowMapWidth = 500;
//	renderer.shadowMapHeight = 500;
//renderer.shadowMapEnabled = true;
//	renderer.shadowMapSoft = true;


///
//   var dir = new THREE.Vector3( 1, 0, 0 );
//   var origin = new THREE.Vector3( 0, 0, 0 );
//   var length = 1;
//   var hex = 0xffff00;

// var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
// scene.add( arrowHelper );
///
// controls

var controls;
/*
 controls = new THREE.OrbitControls( camera, renderer.domElement );
//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
*/
//   controls = new THREE.PointerLockControls( camera );

//   scene.add( controls.getObject() );

// controls = new THREE.PointerLockControls(camera);
// scene.add( controls.getObject() )
// helper
   var axisHelper = new THREE.AxisHelper( 50 );
//   scene.add( axisHelper );
var dir = new THREE.Vector3(2, 2, 2).normalize();
var origin = new THREE.Vector3(1, 1, 1);
var length = 1;
var hex = 0xffff00;

var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
arrowHelper.name = 'arrowHelper';
scene.add(arrowHelper);


var geometry1 = new THREE.SphereGeometry(5, 8, 8);
var material1 = new THREE.MeshLambertMaterial({color: 0xffff00});
var sphere1 = new THREE.Mesh(geometry1, material1);
sphere1.scale.set(.01, .01, .01);
sphere1.name = 'sphere1';
sphere1.castShadow = true;
scene.add(sphere1);


var geometry2 = new THREE.SphereGeometry(6, 4, 4);
var material2 = new THREE.MeshLambertMaterial({color: 0xffffff});
var sphere2 = new THREE.Mesh(geometry2, material2);
sphere2.scale.set(.01, .01, .01);
sphere2.name = 'sphere2';
sphere2.castShadow = true;
scene.add(sphere2);

//LINE
/*
var lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
var lineGeometry = new THREE.Geometry();
//lineGeometry.verticesNeedUpdate = true;
lineGeometry.vertices.push(new THREE.Vector3(-10, 0, 0), new THREE.Vector3(0, 10, 0));
var line = new THREE.Line(lineGeometry, lineMaterial);
line.name = 'line';


scene.add(line);
*/

/**
 * create field
 */



/*
var planeGeometry = new THREE.PlaneGeometry(1000/0.02, 1000/0.02);
var planeMaterial = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('bg.jpg'),
    color: 0xffffff
});


planeMaterial.map.repeat.x = 300;
planeMaterial.map.repeat.y = 300;
planeMaterial.map.wrapS = THREE.RepeatWrapping;
planeMaterial.map.wrapT = THREE.RepeatWrapping;
var plane =new THREE.Mesh(planeGeometry, planeMaterial); // new physijs.Plane(planeGeometry, planeMaterial);  //

plane.rotation.x = -Math.PI / 2; // r_76
plane.castShadow = false;
plane.receiveShadow = true;
plane.name = 'plane';
scene.add(plane);
//  objects.push(plane);

var meshArray = [];
var geometry = new THREE.CubeGeometry(50, 50, 50);
//geometry.scale(2,2,2);
for (var i = 0; i < 100; i++) {
    meshArray[i] = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xffffff * Math.random()})); // new physijs.Box(geometry, new THREE.MeshLambertMaterial({color: 0xffffff * Math.random()}),{mass:1});//
    meshArray[i].position.x = i % 2 * 5 *50- 2.5*50;
    meshArray[i].position.y = 25//5.5 *50;
    meshArray[i].position.z = -1 * i * 4*50;
    meshArray[i].castShadow = true;
    meshArray[i].receiveShadow = true;
    meshArray[i].name = 'cube';
    scene.add(meshArray[i]);
    //raycaster
    //  objects.push(meshArray[i]);
}

*/


//var isPhysics = false||true;
var isPrediction = false //|| true;
var isServerUpdate = false || true;
//var isAnim = false ||true;
var isReconciliation = false// ||true;
var isInterpolation = false //|| true;
var isInterPhysAnim = false// || true;

var g_InterpolationMs = 1000;




function checkPointPlayerForId(id) {

    var player;
    for (var i = 0; i < g_CheckPoint.players.length /*scene.children.length*/; i++) {
        if (g_CheckPoint.players[i].playerId === id) {

            player = g_CheckPoint.players[i];
            break;
        }
    }

    return player;
};



function smthForPID(id, smth) {

    var player;
    for (var i = 0; i < smth.length /*scene.children.length*/; i++) {
        if (smth[i].playerId === id) {

            player = smth[i];
            break;
        }
    }

    return player;
};




function prepareInterpolation(){





}


/*
function inter(delta) {

    var interDelta = delta;

    var start;

    for (var i = 0; i <= g_Pending_server_hist.length; i++ ){



        if (g_Pending_server_hist[i].ps + g_InterpolationTimeMs/1000 <= g_lastPs_sec ){

            start = g_Pending_server_hist[i];
           // g_Pending_server_hist.splice(i,1);



        }
        else {

            g_Pending_server_hist.splice(0,i)


        }




    }




        var diff = g_Pending_server_hist[i].ps - g_CheckPoint.ps


        if (diff <= interDelta){


            g_CheckPoint = data;
            interDelta = interDelta - diff;
            g_Pending_server_hist.splice(i,1);

        }


        else {
            var t = delta/diff;

            var interPs = (1-t)*g_CheckPoint.ps + t * data.ps;
            var interLastTick = (1-t)*g_CheckPoint.lastTick + t * data.lastTick;


            g_Pending_server_hist[i].players.forEach(function(pendingPlayer, i , arr){

                var ckPlayer = checkPointPlayerForId(pendingPlayer.playerId);


                if(ckPlayer){

                    var interPlayer = interpolate(ckPlayer,pendingPlayer ,t );

                    ckPlayer.position = interPlayer.position;
                    //ckPlayer.rotation = interPlayer.rotation;
                    //ckPlayer.quaternion = interPlayer.quaternion;

                }

            });












        }

    g_Pending_server_hist.forEach(function (data, i, arr){

        var diff = data.ps - g_CheckPoint.ps

        if (diff <= interDelta){


            g_CheckPoint = data;
            interDelta = interDelta - diff;
            arr.splice(i,1);

        } else {
            var t = delta/diff;


            var interPs = (1-t)*g_CheckPoint.ps + t * data.ps;
            var interLastTick = (1-t)*g_CheckPoint.lastTick + t * data.lastTick;






             data.players.forEach(function(pendingPlayer, i , arr){

                 var ckPlayer = checkPointPlayerForId(pendingPlayer.playerId);


                 if(ckPlayer){

                     var interPlayer = interpolate(ckPlayer,pendingPlayer ,t );

                     ckPlayer.position = interPlayer.position;
                     //ckPlayer.rotation = interPlayer.rotation;
                     //ckPlayer.quaternion = interPlayer.quaternion;





                 }






             })

            var newCheckPoint = {
                players: undefined,
                lastTick: undefined,
                ps: undefined
            };


            g_CheckPoint.ps = interPs;
            g_CheckPoint.lastTick = interLastTick;




            g_CheckPoint.players.forEach(function(player, i ,arr){
                updateOnePlayer(player);


            });





           //UPDATE CHECKPOINT!!!
            //RETURN




        }

    });


}
*/

// physics
/*
var physics_framerate = 1000 / 60;
function onStep() {
    //box.rotation.z

    setTimeout( scene.step.bind( scene, physics_framerate / 1000, undefined, onStep ), physics_framerate );
}
scene.step( physics_framerate / 1000, undefined, onStep );
*/
//

var clock = new THREE.Clock();


function animate(ts) {


    //scene.updateMatrix();





    console.timeStamp('animate Fired ' + ts);


    requestAnimationFrame(animate);
   // slshadow.update(spotLight);

    ///console.log(scene.getObjectByName('greenCube').position);








    if (g_Player) {
      //  controls.update();

        //g_Player.camera.position.x += 1;

        // interpolation may change g_Player that will be saved in the pending_state, so we need to update to last pending state it.
        if(isInterPhysAnim && g_Pending_input.length > 0){
            // re-assign position and quat as it may be changed by interpolation
            var lastPendind = g_Pending_input[0]
            g_Player.position.copy(lastPendind[16]);
            g_Player.quaternion.copy(lastPendind[15]);


            // iterate over animations time
            for (var prop in g_Player.actions) {
                if( g_Player.actions.hasOwnProperty( prop ) ) {

                    g_Player.actions[prop] = lastPendind[14][prop];

                //    console.log("obj." + prop + " = " + g_Player.actions[prop]+ 'will be assigned ' + lastPendind[14][prop]);;
                }
            }
            //g_PlayerObject.mixer.update(0)





          //  g_PlayerObject.actions.run.time = lastPendind[14].runTime;
        }



        //console.log(JSON.stringify(g_Player.scale))

        // save current controller state as it will be changed by reconcilation
        g_Current_state = JSON.parse(JSON.stringify({
            keyState: g_Player.keyState,
            mouseState: g_Player.mouseState,
            mouse2D: g_Player.mouse2D,
            moveState: g_Player.moveState,
            isCameraFollow: g_Player.isCameraFollow
            //position: g_Player.position,
            //quaternion: g_Player.quaternion
        }))


    }






    if (isServerUpdate && messageStack.length > 0) {


        var v_serverData = messageStack.shift();



        v_serverData.players.forEach(function(player, i , arr){

            updateOnePlayer(player);
            //console.log('upd one plr done')

        });

      //  g_lastTick = v_serverData.lastTick;
      //  g_Current_Client_time = g_lastTick;


       // console.log('server time upd' + g_Current_Client_time);


/*
        if (isInterpolation){ //TODO: switch on/off BUG?/  forEACH loop replace to While and Break / reconilation dependency

            ///handle my player
            v_serverData.players.forEach(function(player, i , arr){
                if (player.playerId == g_Player.playerId) {
                    updateOnePlayer(player)

                  //  arr.splice(i,1);  // remove MyPlaer from v_serverData;

                }   // update my player as always amd remove it from further updates;


            });


            ///handle other players
           // g_Pending_server_hist.push(v_serverData); // push server data into stack

*/

/*
            //GET CHECKPOINT

            g_Pending_server_hist.forEach(function(data, i, arr){   // check stack for place to start

                if (data.ps + (g_InterpolationTimeMs/1000) <= g_lastPs_sec){

                   //data.players.forEach(function(player, i ,arr)) // TODO: opimize to call only once !!!!!!!!
                   // inter_start = data;
                    g_CheckPoint = data;
                    arr.splice(i,1); // remove from g_Pending_server_hist

                };


            })

            if (g_CheckPoint) g_CheckPoint.players.forEach(function(player, i ,arr){
                updateOnePlayer(player); // TODO: is it really needed ???


            });

*/
/*
        } else {
  */
    /*        v_serverData.players.forEach(function(player, i , arr){



                updateOnePlayer(player,ts);
                //console.log('upd one plr done')



            });
    //             g_Pending_server_hist = [];
    //    }
*/















        // console.log('SERV');
        // console.timeStamp('PRED '+ ts )
        //console.log(messageStack.length)
        // console.log('BEFORE TS_SERV '+g_Player.ts_server + ' TS_CLI :'+ g_Player.ts_client)


        //  console.log('AFTER TS_SERV '+g_Player.ts_server + ' TS_CLI :'+ g_Player.ts_client)
        //  console.log(messageStack.length);

        //    console.log('HEEEEYYY')

        // stats.update();

        //  renderer.clear();
        //  renderer.render(scene, camera);

        /*
         if (server_reconciliation) {
         // Server Reconciliation. Re-apply all the inputs not yet processed by
         // the server.
         var j = 0;
         while (j < this.pending_inputs.length) {
         var input = this.pending_inputs[j];
         if (input.input_sequence_number <= state.last_processed_input) {
         // Already processed. Its effect is already taken into account
         // into the world update we just got, so we can drop it.
         this.pending_inputs.splice(j, 1);
         } else {
         // Not processed by the server yet. Re-apply it.
         this.entity.applyInput(input);
         j++;
         }
         }
         } else {
         // Reconciliation is disabled, so drop all the saved inputs.
         this.pending_inputs = [];
         }

         */








        if (isReconciliation && g_Player.needReconcilation) {

            g_Player.needReconcilation = false; // not enter until flag set to true by updateOnePlayer;
            //  g_Current_state = JSON.parse(JSON.stringify([g_Player.ts_client, g_Player.keyState, g_Player.mouseState, g_Player.mouse2D, g_Player.ts_server, g_Player.last_client_delta, g_Player.position,g_Player.rotation,g_Player.quaternion])); // mask out
            if (g_Pending_input.length == 0) console.warn('g_Pending_input.length == 0')
            var i;
            for (i = g_Pending_input.length - 1; i>=0; i-- )
            {
                var state = g_Pending_input[i];

                if (state[0] < g_Player.ts_server){

                    g_Pending_input.pop();
                   // console.log('pop '+ state[0])

                } else if (state[0] == g_Player.ts_server){


                    g_PlayerObject.getLinearVelocity(); // update _physijs.linearVelocity

                   // console.log ('server delta pre: '+state[5] );
                    console.log('reconcilation: keyState  client:  '+ JSON.stringify(g_Player.keyState) + ' Server '+ JSON.stringify(state[1]) + ' state[0] '+ state[0]) ;
                    (g_Player.position.x != state[6].x || g_Player.position.y != state[6].y || g_Player.position.z != state[6].z) ?  console.warn('reconcilation: position  does not match. Server: ' + JSON.stringify(g_Player.position) +'   Client:'+  JSON.stringify(state[6]) + ' ts_server ' +  g_Player.ts_server + ' state[0] '+ state[0] ) : console.log('!!!!!!!!!!!!position okay!!!!!!!!!!!! g_Player.position' + JSON.stringify(g_Player.position) + ' state[6] '+ JSON.stringify(state[6])) ;
                    if(g_Player.rotation.x != state[7]._x || g_Player.rotation.y != state[7]._y ||g_Player.rotation.z != state[7]._z || g_Player.rotation.order != state[7]._order) {
                        console.warn('reconcilation: rotation  does not match. Server: ' + JSON.stringify(g_Player.rotation) +'   Client:'+  JSON.stringify(state[7])  + ' ts_server ' +  g_Player.ts_server + ' state[0] '+ state[0]  )}
                    else {console.log('!!!!!!!!!!!!rotation okay!!!!!!!!!!!! g_Player.rotation' + JSON.stringify(g_Player.rotation) + ' state[7] '+ JSON.stringify(state[7]))} ;

                    if(g_Player.quaternion.x != state[15].x || g_Player.quaternion.y != state[15].y ||g_Player.quaternion.z != state[15].z || g_Player.quaternion.w != state[15].w) {
                        console.warn('reconcilation: Quaternion  does not match. Server: ' + JSON.stringify(g_Player.quaternion) +'   Client:'+  JSON.stringify(state[15])  + ' ts_server ' +  g_Player.ts_server + ' state[0] '+ state[0]  )}
                    else {console.log('!!!!!!!!!!!!quaternion okay!!!!!!!!!!!! g_Player.rotation' + JSON.stringify(g_Player.quaternion) + ' state[7] '+ JSON.stringify(state[15]))} ;

                   // console.log(g_PlayerObject._physijs.linearVelocity)
                   // console.log(state);

                    if(g_PlayerObject._physijs.linearVelocity.x != state[18].x || g_PlayerObject._physijs.linearVelocity.y != state[18].y ||g_PlayerObject._physijs.linearVelocity.z != state[18].z) {
                        console.warn('reconcilation: ._physijs.linearVelocity  does not match. Server: ' + JSON.stringify(g_Player._physijs.linearVelocity) +'   Client:'+  JSON.stringify(state[18])  + ' ts_server ' +  g_Player.ts_server + ' state[0] '+ state[0]  )}
                    else {console.log('!!!!!!!!!!!!._physijs.linearVelocity okay!!!!!!!!!!!! g_PlayerObject._physijs.linearVelocity' + JSON.stringify(g_PlayerObject._physijs.linearVelocity) + ' state[18] '+ JSON.stringify(state[18]))} ;



                } else {
                    //   (g_Player.keyState != state[1]) ? console.log('reconcilation: keyState does not match. client:  '+ JSON.stringify(g_Player.keyState) + ' Server '+ JSON.stringify(state[1])) : null ;
                    g_Player.keyState = state[1];
                    g_Player.mouseState = state[2];
                    g_Player.mouse2D.set(state[3].x, state[3].y);
                    //   g_Player.ts_server = state[4];
                    // (g_Player.last_client_delta != state[5]) ? console.log('reconcilation: last_client_delta  does not match. Client: '+ g_Player.last_client_delta +'   Server: ' + state[5] ) : null ;
                    g_Player.last_client_delta = state[5];
                    // (g_Player.position.x != state[6].x || g_Player.position.y != state[6].y || g_Player.position.z != state[6].z) ? console.log('reconcilation: position  does not match. Client: ' + JSON.stringify(g_Player.position) +'   Server:'+  JSON.stringify(state[6])  ) : console.log('!!!!!!!!!!!!position okay!!!!!!!!!!!!') ;
                    // g_Player.position.set(state[6].x, state[6].y, state[6].z);
                    // (g_Player.rotation.x != state[7]._x || g_Player.rotation.y != state[7]._y ||g_Player.rotation.z != state[7]._z || g_Player.rotation.order != state[7]._order) ? console.log('reconcilation: rotation  does not match. Client: ' + JSON.stringify(g_Player.rotation) +'   Server:'+  JSON.stringify(state[7])  ) : console.log('!!!!!!!!!!!!rotation okay!!!!!!!!!!!!') ;
                    // g_Player.rotation.set(state[7]._x, state[7]._y, state[7]._z, state[7]._order)
                     g_Player.isCameraFollow = state[8];
////////////////////////////////


                    var step = 1/10;
                    var reconcilationNumberSteps = state[11];
                    scene.setFixedTimeStep(step);
                    var s = 0
                    for (s; s < reconcilationNumberSteps; s++ ){
             //           console.log('!!!!!!!!!!!!!!!!RECONCILE PHYSICSSSSSSSSSSS!!!!!!!!!!!!!!!!!!')
                        predictPlayer([g_PlayerObject], step)

               //         console.log('step = '+ (s+1));
               //         console.log('BEFORE rot '+JSON.stringify(g_Player.quaternion) + ' pos ' +JSON.stringify(g_Player.position)+ 'keyState '+ JSON.stringify(g_Player.keyState) + ' ts_client '+  g_Player.ts_client)
                        scene.simulate(step,1);
               //         console.log('AFTER rot '+JSON.stringify(g_Player.quaternion) + ' pos ' +JSON.stringify(g_Player.position)+ 'keyState '+ JSON.stringify(g_Player.keyState) + ' ts_client '+  g_Player.ts_client)
                    }
/////////////////////////
/*
                    predictPlayer([g_PlayerObject], g_Player.last_client_delta);
                    //physis


                    var step = 1/10;
                    //  var numberSteps = Math.floor(g_timeReminder/step) // number of steps
                    var numberSteps = state[11];
                    scene.setFixedTimeStep(step);
                    var s = 0
                    for (s; s < numberSteps; s++ ){

                        console.log('reconcile step = '+ (s+1) + ' ts: ' + state[0] )
                        console.log(JSON.stringify(g_Player.rotation) + ' ' +JSON.stringify(g_Player.position) )
                        scene.simulate(step,1);
                    }
*/
//////////////////////////////////////////////////////////
                    /*
                    var delta = state[5];
                    var step = 1/10;
                    scene.setFixedTimeStep(step);
                    var numberSteps = state[11] // number of steps
                    var tempNumberSteps = numberSteps;
                    while (true) {
                        if (tempNumberSteps == 0) {
                            predictPlayer([g_PlayerObject], delta)
                            break;

                        } else if (tempNumberSteps > 0) {
                            tempNumberSteps -= 1; //decrease remained physics update count
                            var d = Math.min(delta, step);
                            delta -= d;
                            predictPlayer([g_PlayerObject], d)

                            if (delta== 0) break;




                        }
                    }
*/

////////////////////////////////////////////////////////
/*
                    var step = 1/10;
                    scene.setFixedTimeStep(step);
                    var numberStepsRec = state[11];

                    do {
                        var iDelta = Math.min( state[5], step)

                        predictPlayer([g_PlayerObject],  state[5]); // state[5] -- last client delta
                        state[5] -= iDelta;

                        if ( 0 < numberStepsRec){
                            console.log('reconcilation steps to go = '+ (numberStepsRec));
                            console.log(JSON.stringify(g_Player.rotation) + ' ' +JSON.stringify(g_Player.position) )
                            scene.simulate(step,1);

                            numberStepsRec -= 1

                        } else {console.log('reconsilation -- no simulation')}
                        //  console.log('ts_client ' +g_PlayerObject.userData.ts_client +' after '+ JSON.stringify(g_PlayerObject.rotation )+ ' last c delta ' + g_Player.last_client_delta+  ' ts_server '+ g_PlayerObject.userData.ts_server)
                        // physijs
                        // console.log(delta*60)

                    }while ( 0 < numberStepsRec);
*/
                    ////////////////////////////////////////////////////////////////////////////////
                   // break;
                }

            }



          //  g_afterReconcilationState = JSON.parse(JSON.stringify({
          //      position: g_Player.position,
           //     quaternion: g_Player.quaternion

           // }));





/*
            g_Pending_input.forEach(function (state, i, arr) {
                if (state[0] < g_Player.ts_server) {


                    arr.splice(i, 1);
                } else if (state[0] == g_Player.ts_server){
                    console.log ('server delta pre: '+state[5] );
                    console.log('reconcilation: keyState  client:  '+ JSON.stringify(g_Player.keyState) + ' Server '+ JSON.stringify(state[1])) ;
                    (g_Player.position.x != state[6].x || g_Player.position.y != state[6].y || g_Player.position.z != state[6].z) ?
                        console.warn('reconcilation: position  does not match. Client: ' + JSON.stringify(g_Player.position) +'   Server:'+  JSON.stringify(state[6]) + ' ts_server ' +  g_Player.ts_server + ' state[0] '+ state[0] ) : console.log('!!!!!!!!!!!!position okay!!!!!!!!!!!!') ;
                    if(g_Player.rotation.x != state[7]._x || g_Player.rotation.y != state[7]._y ||g_Player.rotation.z != state[7]._z || g_Player.rotation.order != state[7]._order) {
                        console.warn('reconcilation: rotation  does not match. Client: ' + JSON.stringify(g_Player.rotation) +'   Server:'+  JSON.stringify(state[7]) +'   Server:'+  JSON.stringify(state[6]) + ' ts_server ' +  g_Player.ts_server + ' state[0] '+ state[0]  )}
                    else {console.log('!!!!!!!!!!!!rotation okay!!!!!!!!!!!!')} ;



                   // arr.splice(i, 1);

                } else {

               //     console.log(JSON.stringify(state[7]));
                    // console.log('got it!');
                    // console.log(JSON.stringify( state));


                    //  console.log('recon inputs left '+ arr.length )

                    //process input.
                    // masking
                   // g_Player.ts_client = state[0];
                 //   (g_Player.keyState != state[1]) ? console.log('reconcilation: keyState does not match. client:  '+ JSON.stringify(g_Player.keyState) + ' Server '+ JSON.stringify(state[1])) : null ;
                      g_Player.keyState = state[1];
                      g_Player.mouseState = state[2];
                      g_Player.mouse2D.set(state[3].x, state[3].y);
                 //   g_Player.ts_server = state[4];
                   // (g_Player.last_client_delta != state[5]) ? console.log('reconcilation: last_client_delta  does not match. Client: '+ g_Player.last_client_delta +'   Server: ' + state[5] ) : null ;
                      g_Player.last_client_delta = state[5];
                   // (g_Player.position.x != state[6].x || g_Player.position.y != state[6].y || g_Player.position.z != state[6].z) ? console.log('reconcilation: position  does not match. Client: ' + JSON.stringify(g_Player.position) +'   Server:'+  JSON.stringify(state[6])  ) : console.log('!!!!!!!!!!!!position okay!!!!!!!!!!!!') ;
                   // g_Player.position.set(state[6].x, state[6].y, state[6].z);
                   // (g_Player.rotation.x != state[7]._x || g_Player.rotation.y != state[7]._y ||g_Player.rotation.z != state[7]._z || g_Player.rotation.order != state[7]._order) ? console.log('reconcilation: rotation  does not match. Client: ' + JSON.stringify(g_Player.rotation) +'   Server:'+  JSON.stringify(state[7])  ) : console.log('!!!!!!!!!!!!rotation okay!!!!!!!!!!!!') ;
                   // g_Player.rotation.set(state[7]._x, state[7]._y, state[7]._z, state[7]._order)
                   // g_Player.isCameraFollow = state[8];

                    predictPlayer([g_PlayerObject], g_Player.last_client_delta);



                    //physis
                    var step = 1/60;
                    //  var numberSteps = Math.floor(g_timeReminder/step) // number of steps
                    var numberSteps = state[11];
                    scene.setFixedTimeStep(step);
                    var s = 0
                    for (s; s < numberSteps; s++ ){

                        console.log('reconcile step = '+ (s+1))
                        scene.simulate(step,1);
                    }
                   // scene.setFixedTimeStep(1/60);
                    //scene.simulate(g_Player.last_client_delta, 5);


                }
            });

*/



            // g_Player.ts_client = g_Current_state[0];
            // g_Player.keyState = g_Current_state[1];
            // g_Player.mouseState = g_Current_state[2];
            // g_Player.mouse2D.set(g_Current_state[3].x,g_Current_state[3].y);
            // g_Player.ts_server =g_Current_state[4];
            // g_Player.last_client_delta = g_Current_state[5];
            // g_Player.position.set(g_Current_state[6].x, g_Current_state[6].y, g_Current_state[6].z );
            // g_Player.rotation.set(g_Current_state[7]._x, g_Current_state[7]._y, g_Current_state[7]._z,g_Current_state[7]._order);
            // g_Player.quaternion.set()


        } else {
         //   g_Pending_input = [];
        }
        ;

        //  console.log( g_Pending_input.length+' pending inputs')


        //g_Pending_input =[];



      //  stats2.update();

    }


    //TODO:  ALL player OBJ should be the same at client/server/pending/compensation
    if (g_Player) {

        var delta = clock.getDelta();

        g_timeReminder += delta; // add phy delta
        var step = 1/10;
      //  var numberSteps = Math.min(Math.floor(g_timeReminder/step),5) // number of steps ; up to 5
        var numberSteps = Math.floor(g_timeReminder/step)



      //  var numberSteps = Math.ceil(g_timeReminder/step)

       // if (numberSteps > 0){g_PlayerObject.userData.keyState = JSON.parse(JSON.stringify(g_Temp_state.keyState))}

       // if (delta < 1/60) console.warn('delta '+ delta);

       // scene.children[106].rotation.x += delta * 2;
       // scene.children[106].rotation.y = 1.5;

       // console.log(scene.children[2].rotation._x);

        g_Current_Client_time = g_Current_Client_time + delta;

       //console.log('client time upd' + g_Current_Client_time)


        //console.log('delta: '+delta);
        //console.log('ts delta: '+ (ts - g_Player.ts_client)) // we drop packets don't use it!!



        g_Player.ts_client += delta//ts;
        g_Player.last_client_delta = delta;
        g_Player.totalNumberSteps += numberSteps;
        g_Player.keyState =  g_Current_state.keyState;
        g_Player.mouseState = g_Current_state.mouseState;
        g_Player.mouse2D.set(g_Current_state.mouse2D.x, g_Current_state.mouse2D.y);
        g_Player.moveState = g_Current_state.moveState;
        g_Player.isCameraFollow = g_Current_state.isCameraFollow


      //  console.log(g_Player.ts_client)


        // send input to the serverawawawawawaw
        //COPY OBJECT
      if(numberSteps>0) {

          var sendState = JSON.parse(JSON.stringify([g_Player.ts_client, g_Player.keyState, g_Player.mouseState, g_Player.mouse2D, g_Player.ts_server, g_Player.last_client_delta, g_Player.position, /*g_Player.rotation*/, g_Player.isCameraFollow, /*g_Player.serverLastSentTime*/serverLastSentTime, g_Player.mixerTime, numberSteps, g_timeReminder,g_Player.totalNumberSteps]));
       //   sendState[19] = JSON.parse(JSON.stringify(g_PlayerObject.moveState));
          //  var state = [g_Player.ts_client, g_Player.keyState, g_Player.mouseState, g_Player.mouse2D, g_Player.ts_server, g_Player.last_client_delta, g_Player.position, g_Player.rotation, g_Player.isCameraFollow, g_Player.serverLastSentTime,g_Player.mixerTime];
     //     console.log('key state ' + JSON.stringify(sendState[1]) + 'number of teps '+numberSteps)
          //TODO: send one object instead of Array of objects;
       //   console.log('sending ' + sendState[9])
          socket.emit('playerState', sendState);
      }


/*
        if (isInterpolation ){

            var hist = g_Pending_server_hist.shift();

            objects.forEach(function(player, i , arr){


                if(player.playerId == g_Player.playerId) return;


                player.userData.local_timer = player.userData.local_timer + delta*1000;
                player.userData.ts_render = player.userData.local_timer - g_InterpolationMs;


                if (hist) {
                    var frame = smthForPID(player.playerId, hist.players)
                  //  console.log(frame);
                    if (frame) {
                        player.userData.pending_server_hist.push(frame);
                        //player.userData.ts_static = frame.ts_client
                        //player.userData.ts_inte = player.userData.ts_static;
                        // player.userData.ts_client = frame.ts_client;
                        //player.userData.ts_render = ts_client - g_InterpolationMs
                    }




                }



              //  player.userData.ts_inte = player.userData.ts_inte + (delta*1000);
              //  player.userData.ts_render = player.userData.ts_inte - g_InterpolationMs;


           //     console.log( 'player.userData.local_timer '+ player.userData.local_timer  +' player.userData.ts_client ' + player.userData.ts_client +   ' player.userData.ts_render ' + player.userData.ts_render + ' delta ' + delta)



                var psh = player.userData.pending_server_hist;



                for (var i = psh.length; i-- > 0;) { // backward loop over player's history

                   // console.log( 'psh[i].ts_client '+ +psh[i].ts_client + ' g_Current_Rrendiring_time ' + player.userData.ts_render +  'interpol_time  ' + player.userData.ts_interpol + ' g_lastTick/ts_client ' + player.userData.ts_client + ' DELTA ' + delta)


                    if (psh[i].ts_client <= player.userData.ts_render) {

                      //  if(psh[i-2]) psh.splice(0,i-2);

                      //  (console.log(i+ ' psh true'+ ' --- psh length '+ psh.length))

                        if (!psh[i + 1]){  updateOnePlayer(psh[i]); console.log('dead end'); psh.splice(0,i);  break;}


                     //   console.log(i+ ' start ' + psh[i].ts_client + ' renderTime ' +player.userData.ts_render + 'n '+(i+1)+' end ' + psh[i + 1].ts_client);


                        var t = (player.userData.ts_render - psh[i].ts_client )/1000;

                       // console.log('t: '+ t);

                        psh[i].keyState = psh[i+1].keyState;

                       // console.log('psh.ts_client '+psh[i].ts_client+  '     player.ts_client: '+ player.userData.ts_client);

                        if(psh[i].ts_client != player.userData.ts_client) {
                            updateOnePlayer(psh[i]);
                            predictPlayer([player], t);
                          //  console.log('update!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                          //  console.log('mTIME before predictP ' + player.mixer.time + ' rot: ' + JSON.stringify(player.rotation) + ' pos: ' + JSON.stringify(player.position))
                        } else {

                            //TODO: hndle Dalta tear when shift to another psh[i]

                            predictPlayer([player], delta);




                            console.log('skip!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')}//console.log(player.)









                   //     console.log('mTIME after predictP '+ player.mixer.time + ' rot: '+ JSON.stringify(player.rotation) + ' pos: '+ JSON.stringify(player.position))


                      //  if(psh[i-1]) psh.splice(0,i-1);
                        //var v = lerp(hist[i].ps, hist[i + 1].ps, 0.5); console.log(v)

                        //console.log(v);

                        if(psh[i-1]) psh.splice(0,i);

                        break;


                    }
                   // else  (console.log(i+ ' psh false'+ ' --- psh length '+ psh.length))

                }




            })





        }
*/





        if (isPrediction) {  //  g_PlayerObject GLOBAL

            //    console.log('SERVER/PREDICT/RECONCILE '+isServerUpdate+' '+isPrediction+' '+isReconciliation+ ' '+ g_Player.ts_client +' ' + JSON.stringify(g_Player));

            //updateOimoPhysics(OIMOworld, OIMObodys, OIMOmeshs);


                //  console.log('ts_client ' + g_PlayerObject.userData.ts_client +' pre '+ JSON.stringify(g_PlayerObject.rotation) + ' delta '+ delta  + ' ts_server '+ g_PlayerObject.userData.ts_server)
/*
            var step = 1/10;
            var numberSteps = Math.floor(g_timeReminder/step)
            var stepsIterator = numberSteps;
            scene.setFixedTimeStep(step);



            do {
                var iDelta = Math.min(delta, step)
                predictPlayer([g_PlayerObject], iDelta);
                delta -= iDelta;

                if ( 0 < stepsIterator){
                    console.log('prediction steps to go = '+ stepsIterator);
                    console.log(JSON.stringify(g_Player.rotation) + ' ' +JSON.stringify(g_Player.position) )
                    scene.simulate(step,1);

                    stepsIterator -= 1

                } {console.log('prediction -- no simulation')}
                //  console.log('ts_client ' +g_PlayerObject.userData.ts_client +' after '+ JSON.stringify(g_PlayerObject.rotation )+ ' last c delta ' + g_Player.last_client_delta+  ' ts_server '+ g_PlayerObject.userData.ts_server)
                // physijs
                // console.log(delta*60)

            }while ( 0 < stepsIterator);
*/
         //   g_timeReminder += delta; // add phy delta

////////////////////////
            /*

            console.log('!!!!!!!!!!!!!!!!PREDICT ANIM!!!!!!!!!!!!!!!!!!')
            predictPlayer([g_PlayerObject], delta)
            var step = 1/10;

            var numberSteps = Math.floor(g_timeReminder/step) // number of steps
            scene.setFixedTimeStep(step);
            var s = 0
            for (s; s < numberSteps; s++ ){
                console.log('!!!!!!!!!!!!!!!!PREDICT PHYSICSSSSSSSSSSS!!!!!!!!!!!!!!!!!!')

                console.log('step = '+ (s+1));
                console.log(JSON.stringify(g_Player.rotation) + ' ' +JSON.stringify(g_Player.position) )
                scene.simulate(step,1);
            }
            //g_PlayerObject.updateMatrix();



*/
//////////////////////////////////
           // console.log('!!!!!!!!!!!!!!!!PREDICT ANIM!!!!!!!!!!!!!!!!!!')
          //  var numberSteps = Math.floor(g_timeReminder/step) // number of steps
          //  predictPlayer([g_PlayerObject], delta)
           // predictPlayer([g_PlayerObject], delta)
         /*   if
            (g_PlayerObject.userData.keyState[38] || g_PlayerObject.userData.keyState[87]) {
                // up arrow or 'w' - move forward
                g_PlayerObject.actions.run.play()
                g_PlayerObject.position.x += delta * g_PlayerObject.userData.turnSpeed * g_PlayerObject.userData.r * Math.sin(g_PlayerObject.userData.rotation.y);  //DO NOT USE PLAYER.ROTATION ITS NOT LINKED!!!
                g_PlayerObject.position.z += delta *  g_PlayerObject.userData.turnSpeed * g_PlayerObject.userData.r  * Math.cos(g_PlayerObject.userData.rotation.y);

                //FOR CORRECT Collision CALLBACK
                //player.setLinearVelocity({x: player.userData.turnSpeed * player.userData.r * Math.sin(player.userData.rotation.y), y:player._physijs.linearVelocity.y, z: player.userData.turnSpeed * player.userData.r  * Math.cos(player.userData.rotation.y)} )
                //player.applyCentralForce({x: - player.userData.turnSpeed * player.userData.r * Math.cos(player.userData.rotation.y)* player._physijs.mass, y:0, z: player.userData.turnSpeed * player.userData.r  * Math.sin(player.userData.rotation.y)* player._physijs.mass} )

                g_PlayerObject.mixer.update(delta);



            }

*/
            /*
            predictPlayer([g_PlayerObject], delta)
            scene.setFixedTimeStep(step);
            scene.simulate(delta, 5)
            */
            if (numberSteps > 0) {

            //    var recPos =  g_afterReconcilationState.position ;// || g_Player.position
            //    var recQuat =  g_afterReconcilationState.quaternion;
            //    console.log('recPos ' + JSON.stringify(recPos));
            //    console.log('recQuat ' + JSON.stringify(recQuat));


            //    g_Player.position.set (recPos._x,recPos._y,recPos._z);
            //    g_Player.quaternion.set(recQuat._x,recQuat._y,recQuat._z,recQuat._w)
            }




            scene.setFixedTimeStep(step);
            var s = 0
            for (s; s < numberSteps; s++ ){
            //    console.log('!!!!!!!!!!!!!!!!PREDICT PHYSICSSSSSSSSSSS!!!!!!!!!!!!!!!!!!')


              //  g_Player.position.set(g_Current_state.position._x,g_Current_state.position._y,g_Current_state.position._z)

                predictPlayer([g_PlayerObject], step)

               // g_PlayerObject.__dirtyPosition = false;
               // g_PlayerObject.__dirtyRotation = false;


            //    console.log('step = '+ (s+1));
            //    console.log('BEFORE PRED '+ JSON.stringify(g_Player.quaternion) + ' ' +JSON.stringify(g_Player.position) )
                scene.simulate(step,1);
             //   console.log('AFTER PRED ' +JSON.stringify(g_Player.quaternion) + ' ' +JSON.stringify(g_Player.position) )
            }













               // var step = 1//10;
/*
            if (numberSteps> 0) {
                //  console.log(JSON.stringify(g_PlayerObject.userData.keyState))
                predictPlayer([g_PlayerObject], (g_timeReminder - step * numberSteps));
                scene.simulate(delta, 0);
                g_timeReminder = 0;
            }
            */
/*
            var numberSteps = Math.floor(g_timeReminder/step) // number of steps
            scene.setFixedTimeStep(step);
            var s = 0
            for (s; s < numberSteps; s++ ){
                console.log('!!!!!!!!!!!!!!!!PREDICT PHYSICSSSSSSSSSSS!!!!!!!!!!!!!!!!!!')
                predictPlayer([g_PlayerObject], step)

                console.log('step = '+ (s+1));
                console.log(JSON.stringify(g_Player.rotation) + ' ' +JSON.stringify(g_Player.position) )
                scene.simulate(step,1);
            }
*/


/////////////////////////
            /*
        //    var isPredRun = true;
            var step = 1/10;
            scene.setFixedTimeStep(step);
            var numberSteps = Math.floor(g_timeReminder/step) // number of steps
            var tempNumberSteps = numberSteps;
            while (true) {
                if (tempNumberSteps == 0) {
                    predictPlayer([g_PlayerObject], delta)
                    break;

                } else if (tempNumberSteps > 0) {
                    tempNumberSteps -= 1; //decrease remained physics update count
                    var d = Math.min(delta, step);
                    delta -= d;
                    predictPlayer([g_PlayerObject], d)




                }
            }
            */
/*
            scene.setFixedTimeStep(step);
            var s = 0
            for (s; s < numberSteps; s++ ){

                console.log('step = '+ (s+1));
                console.log(JSON.stringify(g_Player.rotation) + ' ' +JSON.stringify(g_Player.position) )
                scene.simulate(step,1);
            }
            */
            /////////////////////////////
       //     g_timeReminder -= step * numberSteps;

 //        /   var step = 1/60;
         //   scene.setFixedTimeStep(step);
         //   scene.simulate(delta,5);




            //console.log(g_Player.position)
           // console.log(g_Player.rotation)
            //state is updated after prediction
            if (numberSteps > 0) {
                //TODO: refactor this super long array

                var angularVelocity = g_PlayerObject.getAngularVelocity();
                var linearVelocity = g_PlayerObject.getLinearVelocity();


                var predictedState = JSON.parse(JSON.stringify([g_Player.ts_client, g_Player.keyState, g_Player.mouseState, g_Player.mouse2D, g_Player.ts_server, g_Player.last_client_delta, g_Player.position, g_Player.rotation, g_Player.isCameraFollow, g_Player.serverLastSentTime, g_Player.mixerTime, numberSteps, g_timeReminder,g_Player.totalNumberSteps, g_Player.actions/*[14]*//*,g_Player.quaternion*//*15*/]));
                predictedState.push(g_Player.quaternion.clone()/* el 15*/,g_Player.position.clone()/* el 16*/)
                predictedState = predictedState.concat(JSON.parse(JSON.stringify([angularVelocity/*el 17*/, linearVelocity/* el 18*/,g_PlayerObject.userData.moveState/* el 19*/])));


                //      console.log('ts_client ' + predictedState[0] + ' rotation ' + JSON.stringify(predictedState[7]) + ' position ' + JSON.stringify(predictedState[6]) + ' keyState' + JSON.stringify(predictedState[1]));
                g_Pending_input.unshift(predictedState);


            }



            if (isInterPhysAnim && g_Pending_input.length > 0){


                var state0 = g_Pending_input[1]||[/*g_Player.ts_client*/0, /*g_Player.keyState*/{}, /*g_Player.mouseState*/{}, /*g_Player.mouse2D*/new THREE.Vector2(), /*g_Player.ts_server*/ undefined, /*g_Player.last_client_delta*/0,/* g_Player.position*/new THREE.Vector3(0,3,0), /*g_Player.rotation*/new THREE.Euler(0, 0, 0, 'YZX'), /*g_Player.isCameraFollow*/ false, /*g_Player.serverLastSentTime*/ undefined, /*g_Player.mixerTime*/ 0, /*numberSteps*/undefined, /*g_timeReminder*/undefined, 0, g_Player.actions/*[14]*//*,g_Player.quaternion*//*15*/,{x:0,y:0,z:0,w:0},{x:0,y:0,z:0}];
                var state1 = g_Pending_input[0];


                var end = state1[13]*step;
                var start =  state0[13]*step;


                var renderTime = g_Player.ts_client - step;

                var alpha = (renderTime - start)/(end-start)

               // console.log('InterPhysAnim');
               // console.log(['start ',start, ' renderTime ',renderTime,' end ',end]);


               // var alpha = delta/diff
                // TODO: What about reconcilation whith the same ts_server and message drops

              //  var t0 = state0[16].clone();
              //  var t1 = state1[16].clone();



                //position lerp
          //      console.log('InterPhysAnim');
                g_Player.position.lerpVectors(/*{x:0, y:0,z:0,_x:0,_y:0,_z:0}*/state0[16]/*t0*/,/*t1*//*{x:0, y:0,z:0,_x:0,_y:0,_z:0}*/state1[16], alpha )
                THREE.Quaternion.slerp( state0[15], state1[15], g_PlayerObject.quaternion, alpha );





          //      console.log(state0.length)
          //      console.log (['state0[15] instanceof THREE.Quaternion ', state0[15] instanceof THREE.Quaternion, JSON.stringify(state0[15]), JSON.stringify(state1[15]), JSON.stringify(g_PlayerObject.quaternion), alpha])

                // animation time lerp;

                /*
                for (var property in g_PlayerObject.actions) {
                    if (g_PlayerObject.actions.hasOwnProperty(property)) {

                        // do stuff


                    }
                }
                */
              //  var duration =  g_PlayerObject.actions.run._clip.duration

                //g_PlayerObject.actions.run.time = state0[14].runTime //= (1-alpha) * state0[14].runTime + alpha* state1[14].runTime;
               // g_Player.actions.runTime = state0[14].runTime



                //iterate over animations time

                for (var prop in g_Player.actions) {
                    if( g_Player.actions.hasOwnProperty( prop ) ) {

                        g_Player.actions[prop] = state0[14][prop];

                   //     console.log("obj." + prop + " = " + g_Player.actions[prop]+ 'will be assigned ' + state0[14][prop]);;
                    }
                }

                g_PlayerObject.mixer.update(renderTime - start);



          //      console.log(['start pos ',JSON.stringify(state0[6]),  ' renderPos ',JSON.stringify(g_Player.position),' end ',state1[6]]);

                cameraControl(g_PlayerObject);

               // g_Player.rotation.lerpVectors(state0[7],state1[7], alpha)










               // g_Player.ts_interpol += delta;


                // ?  Number.MAX_VALUE


                //  [g_Player.ts_client, g_Player.keyState, g_Player.mouseState, g_Player.mouse2D, g_Player.ts_server, g_Player.last_client_delta, g_Player.position, g_Player.rotation, g_Player.isCameraFollow, g_Player.serverLastSentTime, g_Player.mixerTime, numberSteps, g_timeReminder];

                //g_Player.keyState = state0[1];
                //g_Player.mouseState = state0[2];
                //g_Player.mouse2D.set(state0[3].x, state0[3].y);
                //   g_Player.ts_server = state[4];
                // (g_Player.last_client_delta != state[5]) ? console.log('reconcilation: last_client_delta  does not match. Client: '+ g_Player.last_client_delta +'   Server: ' + state[5] ) : null ;
                //g_Player.last_client_delta = state0[5];

               // g_Player.position.lerp(state)

               // (1-t)*state0[] + t * state1;



            }




/*

            if (numberSteps >0 ) {
                var d = g_timeReminder - step * numberSteps

                if
                (g_PlayerObject.userData.keyState[38] || g_PlayerObject.userData.keyState[87]) {
                    // up arrow or 'w' - move forward
                    g_PlayerObject.actions.run.play()
                    g_PlayerObject.position.x += d * g_PlayerObject.userData.turnSpeed * g_PlayerObject.userData.r * Math.sin(g_PlayerObject.userData.rotation.y);  //DO NOT USE PLAYER.ROTATION ITS NOT LINKED!!!
                    g_PlayerObject.position.z += d * g_PlayerObject.userData.turnSpeed * g_PlayerObject.userData.r * Math.cos(g_PlayerObject.userData.rotation.y);

                    //FOR CORRECT Collision CALLBACK
                    // player.setLinearVelocity({x: player.userData.turnSpeed * player.userData.r * Math.sin(player.userData.rotation.y), y:player._physijs.linearVelocity.y, z: player.userData.turnSpeed * player.userData.r  * Math.cos(player.userData.rotation.y)} )
                    //player.applyCentralForce({x: - player.userData.turnSpeed * player.userData.r * Math.cos(player.userData.rotation.y)* player._physijs.mass, y:0, z: player.userData.turnSpeed * player.userData.r  * Math.sin(player.userData.rotation.y)* player._physijs.mass} )


                }
            }
*/



          //  if (delta >= )


//refine
           // predictPlayer([g_PlayerObject], (delta-step * numberSteps))
         //   scene.simulate(Math.abs(delta-step * numberSteps) , 0)
//end refine

        //    var refiner = ( step * numberSteps - delta);

        //    if (refiner > 0 )scene.simulate(refiner,0);

            //  console.log('AFTER SERVER/PREDICT/RECONCILE '+isServerUpdate+' '+isPrediction+' '+isReconciliation+ ' '+ g_Player.ts_client +' ' + JSON.stringify(g_Player));
        };
        g_timeReminder -= step * numberSteps;


   //      scene.simulate(Math.max(-g_timeReminder+delta),0)





        // console.log('g_Player: '+g_Player.ts_client + ' ')
        //save input for further reconcilation

        //if (g_Pending_input.length > 20) g_Pending_input.shift();

        // console.log(g_Pending_input.length);

    }
    // g_Player.pending_input = (JSON.parse(JSON.stringify(g_Player)))


   // stats.update();


    //console.log(camera.aspect)


    /*

     //    socket.emit('UPD_world_CLI', ts, updatePlayerData);
     console.timeStamp('UPD_world_CLI emitted '+ performance.now() + 'for ts '+ts)

     console.log('HEEEEYYY')

     //  socket.emit('test', Date.now(), function cb (ps){
     //      var lat = Date.now() - ps;
     //      console.log(lat);
     //  });

     stats.update();





     */


    /*
     delta = clock.getDelta();


     for (var i = 0; i < scene.children.length; i ++ ){   // all objects is too many

     if(scene.children[i].userData.mixer) scene.children[i].userData.mixer.update(delta);

     }

     console.log('!!!!!!!!delta '+ delta);
     */
    //controls.update();


    // raycaster.js
    //console.log('camera to ray renderer');
    //console.log(camera.toJSON());

    //Raycaster2(camera);//TODO: NEED init() function!!!


   // scene.updateMatrixWorld();


    // scene.updateMatrixWorld();
    if (g_Player) g_Player.camera.updateMatrixWorld();
    if (g_Player) {
     //   console.log('render');
        renderer.clear();
        renderer.render(scene, g_Player.camera);
    }

    //console.log('camera after RENDERER');
    //console.log(camera.toJSON());


}


var stats = new Stats();
stats.update();

var stats2 = new Stats();
stats2.update();

var statsRTT = new Stats(2);
statsRTT.showPanel(1)

window.addEventListener('DOMContentLoaded', function () {
        document.body.appendChild(renderer.domElement);
        //var div = document.createElement('div');
        document.body.appendChild(stats.dom).setAttribute("style", "background-color:red; font-size:2em; top: 140px; position: absolute");
        document.body.appendChild(stats2.dom).setAttribute("style", "background-color:red; font-size:2em; top: 190px; position: absolute");
        document.body.appendChild(statsRTT.dom).setAttribute("style", "background-color:red; font-size:2em; top: 240px; position: absolute");




        console.log("touchscreen is", VirtualJoystick.touchScreenAvailable() ? "available" : "not available");
       // intitControll();

        joystick = new VirtualJoystick({
          //  mouseSupport	: true,
            limitStickTravel: true,
            stickRadius	: 50
        });

        joystick.controllerType = 'movement';

        joystick.addEventListener('touchStartValidation', function(event){
            var touch	= event.changedTouches[0];
            if( touch.pageX >= window.innerWidth/2 )	return false;
            return true
        });

        joystick.addEventListener('touchStart', function(){
            console.log('down')
        })
        joystick.addEventListener('touchEnd', function(){
            console.log('up')
        })



        joystick2	= new VirtualJoystick({
            container	: document.body,
            strokeStyle	: 'orange',
            limitStickTravel: true,
            stickRadius	: 50
        });

        joystick2.controllerType = 'camera'


        joystick2.addEventListener('touchStartValidation', function(event){
            var touch	= event.changedTouches[0];
            if( touch.pageX < window.innerWidth/2 )	return false;
            return true
        });
        joystick2.addEventListener('touchStart', function(){
            console.log('fire')
        })




        animate();

    }

    , false);

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    var camera = g_Player.camera;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    socket.emit('onWindowResize', camera.aspect);

};

