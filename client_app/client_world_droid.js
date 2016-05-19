
'use strict';

///////////GLOBALS

var  renderer, raycaster, objects = [];

var sphere;
var players = [];
//var player ={}; //playerId //, moveSpeed, turnSpeed;
var messageStack =[];

var g_Pending_input =[];
var g_Current_state = [];
var g_Ghosts = [];


var g_Player, g_PlayerObject;
var objectLoader = new THREE.ObjectLoader();


var g_lastTick = 0;




// var mouse = new THREE.Vector2();

var geometryTemplate;
////////////////////////////////////
//init
var light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(1, 1, 1).normalize();
light.castShadow = true;

var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.05);
scene.autoUpdate = false || true;
scene.add(light);

var JSONloader = new THREE.JSONLoader();
var loader = new THREE.JSONLoader();
loader.load("droid.js", function (geometry){
    geometryTemplate = geometry;
});

///




//Player construcor
function Player(mesh, id) {

    mesh.userData = this


    this.playerId = id; // const!!!!!
    mesh.name = mesh.playerId = this.playerId;


    this.position = mesh.position; // link
    this.position.set(0, .5, 0); // set


    this.rotation = new THREE.Euler();     // DO NOT LINK IT TO  mesh.rotation since scene.updateMatrixWorld() uses it somehow
    this.rotation.set(0, 0, 0, 'XYZ'); // set

    this.quaternion = mesh.quaternion; //link

    this.scale = mesh.scale//link
    this.scale.set(0.02, 0.02, 0.02); //set

    this.camera = new THREE.PerspectiveCamera(); //to be updated from player's side
    this.camera.position.set(4, 4, 7);
    this.camPos = this.camera.position
    // this.camera.aspect = 0.5;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.cameraJSON = this.camera.toJSON();


//
    this.keyState = {};
    this.mouseState = {};
    this.moveSpeed = 3.0;
    this.turnSpeed = 1.5;

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

    this.ts_client = undefined;
    this.ts_server = undefined;
    this.last_client_delta = 0;
    this.needServerUpdate = false;

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




 function playerForId(id){

    var player;
    for (var i = 0; i <  players.length /*scene.children.length*/; i++){
        if (players[i].playerId === id){

            player = players[i];
            break;


        //if (scene.children[i].userData.playerId == id){

        //    player = scene.children[i];
        //    break;

        }
    }

    return player;
};



var createPlayer = function(data){


    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        morphTargets: true,
        vertexColors: THREE.FaceColors,
        shading: THREE.FlatShading
    });



    var playerMesh = new THREE.Mesh(geometryTemplate, material);

    var player = new Player(playerMesh, data.playerId); // use Server socket id //

    scene.add(playerMesh);
    objects.push(playerMesh);
    players.push( player );

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

    //console.log(JSON.stringify(player));

    return player

};


var addOtherPlayer = function(data){
 //   console.log('client_world: Other PLayer DATA HAS ARRIVED');
 //   console.log(data);


    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        morphTargets: true,
        vertexColors: THREE.FaceColors,
        shading: THREE.FlatShading
    });



    var playerMesh = new THREE.Mesh(geometryTemplate, material);

    var player = new Player(playerMesh, data.playerId); // use Server socket id //

    scene.add(playerMesh);
    objects.push(playerMesh);
    players.push( player );

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



    return player


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


    console.log ('PAYERS CNT '+ players.length+' OBJECTS CNT '+ objects.length + ' SCENE OBJ CNT '+ scene.children.length );


};





document.addEventListener('keydown', onKeyDown, false );
document.addEventListener('keyup', onKeyUp, false );

document.addEventListener('mousedown', onMouseDown, false );
document.addEventListener('mouseup', onMouseUp, false );


document.addEventListener( 'mousemove', onDocumentMouseMoveRaycater, false );


function onKeyDown( event ){

    //console.log((event.keyCode || event.which));

    if ((event.keyCode || event.which) == 220) console.log('STATUS isPrediction: '+ isPrediction + ' isServerUpdate: '+ isServerUpdate + ' isReconciliation '+isReconciliation )

    if ((event.keyCode || event.which) == 219) {
        isPrediction = (!isPrediction)
        console.log('isPrediction: '+ isPrediction + ' isServerUpdate: '+ isServerUpdate )
    };
    if ((event.keyCode || event.which) == 221) {
        isServerUpdate = (!isServerUpdate)
        console.log('isPrediction: '+ isPrediction + ' isServerUpdate: '+ isServerUpdate )
    };
    if ((event.keyCode || event.which) == 80) {
        isReconciliation = (!isReconciliation)
        console.log('isReconciliation: '+ isReconciliation  )
    };




    //event = event || window.event;
    g_Player.keyState[event.keyCode || event.which] = true;
   // socket.emit('keydown',event.keyCode || event.which); // emit keyCode or which depending on browser
  //  console.log('keydown emitted ' + event.keyCode || event.which);
  //  console.log(event);
    ///
  //  document.removeEventListener('keydown',onKeyDown, false );

    ///

};

function onKeyUp( event ) {
    g_Player.keyState[event.keyCode || event.which] = false;
  //  socket.emit('keyup',event.keyCode || event.which); // emit keyCode or which depending on browser
  //  console.log('keyup emitted ' + event.keyCode || event.which);
  //  console.log(event);
 //   document.addEventListener('keydown', onKeyDown, false );

};


function onMouseDown( event ){
    event.preventDefault();
    g_Player.mouseState[event.button] = true;
  //  socket.emit('mousedown', event.button)
};

function onMouseUp( event ){
    event.preventDefault();
    g_Player.mouseState[event.button] = false;
   // socket.emit('mouseup', event.button)
};


function onDocumentMouseMoveRaycater( event ) {
    event.preventDefault();
//TODO: make same logic on client and server
    var mouse ={};// override

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  //  console.log('x: '+ mouse.x + ' y: '+ mouse.y)
  if(g_Player)  g_Player.mouse2D.set(mouse.x,mouse.y);
   // socket.emit('mouse2D',mouse );

};

//var delta ;


var updatePlayerData = function(data) {

    var cb_fired = performance.now();
    console.timeStamp('updatePlayerData fired '+ cb_fired+' for ts '+ data[2])
    var ps_cb_fired = cb_fired-data[2] // ~latency


    var delta = data[1] - g_lastTick;
    g_lastTick = data[1];




  //  console.log(delta);

    //console.log('TIME!!!!!!!!!!!!!!!!!!!!!!!!!!!'+delta)
    data[0].forEach(function(playerData){

        //console.log('playerData');
        //console.log(playerData);

        var player = objectForPID(playerData.playerId);
        if (player){


             player.userData.ts_server =  playerData.ts_server // last ts proceeded by server;
             player.userData.ts_client =  playerData.ts_client // last ts proceeded by server;
             player.userData.keyState = playerData.keyState;
             player.userData.mouseState = playerData.mouseState;
             player.userData.mouse2D.set(playerData.mouse2D.x,playerData.mouse2D.y);
             player.userData.ts_server =  playerData.ts_server
             player.userData.last_client_delta =  playerData.last_client_delta;
             player.position.set(playerData.position.x, playerData.position.y, playerData.position.z);
             //TODO: get rid of rotation it's re-linking HELL!
             player.userData.rotation.set(playerData.rotation._x, playerData.rotation._y, playerData.rotation._z, playerData.rotation._order );
             player.quaternion.set ( playerData.quaternion._x,playerData.quaternion._y, playerData.quaternion._z, playerData.quaternion._w );

            // g_Player.position.set(g_Current_state[6].x, g_Current_state[6].y, g_Current_state[6].z );
            // g_Player.rotation.set(g_Current_state[7]._x, g_Current_state[7]._y, g_Current_state[7]._z,g_Current_state[7]._order);
            // g_Player.quaternion.set()

            //playerData.keyState


            (playerData.keyState[38] || playerData.keyState[87]) ? player.actions.run.play() : player.actions.run.stop();
            (playerData.mouseState[0]) ? player.actions.attack.play() : player.actions.attack.stop();
            (playerData.keyState[70]) ? player.actions.wave.play() : player.actions.wave.stop();


/*
OPTIMIZED VERSION not  CALL STOP() when anim is not SCHEDULED
            if (playerData.mouseState[0] && !player.actions.attack.isScheduled())
                player.actions.attack.play(); // attack play anim
            if (!playerData.mouseState[0] && player.actions.attack.isScheduled())
                player.actions.attack.stop(); // attack stop anim
*/
            player.userData.moveState = playerData.moveState;

            if (player.userData.moveState.hitOnce) {
               // console.log('player HIT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                player.actions.painOne.play();
                player.actions.painOne.reset();
            }



            //RECONCILE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
         //   player.userData.mouseState=playerData.mouseState;
         //   player.userData.keyState = playerData.keyState;


          //  player.userData.moveState = playerData.moveState; // update to false
         //   player.userData.mixer.update(worldTimeDelta);

            //player.userData.actionas.stand.time = playerData.actions.standTime;


            // PRE update TEST
            /*
            if(player.mixer.time !=  playerData.mixerTime - delta) {
                player.mixer.time = playerData.mixerTime - delta;
                console.log('PRE MIXER TIME CHANGED');
            }
            if(player.actions.stand.time !=  playerData.actions.standTime - delta) {
                player.actions.stand.time =  playerData.actions.standTime -delta ;
                console.log ('PRE STAND TIME CHANGED');
            }
            */


           // console.log('BEFORE UPDATE '+ player.playerId + ' MIXER TIME '+ player.mixer.time );
            /////////////////////////////////////////////////////////////////

           // if (isAnim) player.mixer.update(delta);// MAY be Dangerous WRONG!!!! SINCE we Manually DROP packages
            //////////////////////////////////////////////////////////////////
           // console.log('AFTER UPDATE '+ player.playerId + ' MIXER TIME '+ player.mixer.time );




            //POST update TEST
           // console.log('client mixer time '+ player.userData.mixer.time +
           // ' VS '+ playerData.mixerTime + 'As server mixer time' + 'delta '+ delta + 'diff serv - client'
           // +  (playerData.mixerTime- player.userData.mixer.time)  )


         //ANIM SYNC:
         // console.log('mixer time '+ playerData.mixerTime);
         //   console.log ('LOCAL mixer '+ player.mixer.time +' VS global mixer'+  playerData.mixerTime + ' GLOBAL TICK '+ data[1] + ' for '+ player.playerId)





            if(player.mixer.time !=  playerData.mixerTime) {

               // console.log ('LOCAL mixer '+ player.mixer.time +' VS global mixer'+  playerData.mixerTime + ' GLOBAL TICK '+ data[1] + ' for '+ player.playerId)
                player.mixer.time =  playerData.mixerTime ;


             //   console.log ('MIXER TIME CHANGED to'+ player.mixer.time + ' for '+ player.playerId +' at '+g_Player.playerId);
               // console.log( g_Player.playerId)
            }
            if(player.actions.stand.time !=  playerData.actions.standTime) {
                player.actions.stand.time =  playerData.actions.standTime ;
              //  console.log ('STAND TIME CHANGED');
            }
            if(player.actions.run.time !=  playerData.actions.runTime) {
                player.actions.run.time =  playerData.actions.runTime ;
              //  console.log ('RUN TIME CHANGED');
            }

            if(player.actions.attack.time !=  playerData.actions.attackTime) {
              //  console.log ('PRE ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
                player.actions.attack.time =  playerData.actions.attackTime ;
              //  console.log ('ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
            }

            if(player.actions.wave.time !=  playerData.actions.waveTime) {
                player.actions.wave.time =  playerData.actions.waveTime ;
              //  console.log ('WAVE TIME CHANGED');
            }



            if (isAnim) player.mixer.update(0);


            // PLAYER vs OBJECT time may be ASYNC !!!!!!!!!!!!!!!!!!!!!!!!!!!!!



       //     console.log('stand time');
       //     console.log(player.userData.actions.stand.time);






        //    player.userData.camera = playerData.camera;

            if(player.playerId == g_Player.playerId) {


                //TODO: make it simpler



                g_Player.camera = objectLoader.parse(playerData.cameraJSON);
              //  g_Player.camera.updateMatrixWorld();

/*
                var ghost = g_PlayerObject.clone();
                ghost.material.emissive.setHex(0xff0000)
                ghost.matrixAutoUpdate = false;


                g_Ghosts.push(ghost);
                scene.add (ghost);
                if(g_Ghosts.length > 5) {
                    scene.remove(g_Ghosts.shift());
                }
*/
                //updateProjectionMatrix(); // onResize and on connect



            }



        }


    });
   // console.log(players);

    //  scene.autoUpdate = false;  -- DUMB TERMITAL
   // scene.updateMatrixWorld(); // update Meshes FOR DUMB TERMINAL
    //scene.updateMatrixWorld();
    //Raycaster2(camera);
   // checkRayCast(g_PlayerObject);


   // animate();
    var cb_ended = performance.now();
    var cb_time = cb_ended - cb_fired

    var ps_fired_cb_ended = cb_ended - data[2];

   // console.timeStamp('updatePlayerData END '+ cb_ended+' for ts '+ data[2] + ' cb_time '+cb_time)

 //   console.log('ps '+data[2]+' cb '+ cb_fired + ' ps_cb_fired ' + ps_cb_fired + ' cb_time '+ cb_time + ' ps_fired_cb_ended '+ ps_fired_cb_ended);
   // console.timeStamp('socket UPD World finished');
  //  console.log('server UPD g_PLAYER rotation '+ JSON.stringify(g_Player.rotation) +'; quaternion: ' + JSON.stringify(g_Player.quaternion) +'; position: '+ JSON.stringify(g_Player.position));




};









var width = window.innerWidth;
    var height = window.innerHeight;





    //scene.add(player.model.objects);

 //   var camera = new THREE.PerspectiveCamera();
    console.log('cam 1st init')
 //   console.log(camera)//width / height //40, 1, 1, 1000
 //   camera.position.y = 7;
 //   camera.position.z = 4;
 //   camera.position.x = 4;
 //   camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
   // camera.updateMatrixWorld();

    //scene.add(camera);





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
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;

//	renderer.shadowCameraNear = camera.near;
//	renderer.shadowCameraFar = camera.far;
//	renderer.shadowCameraFov = 50;
//	renderer.shadowMapBias = 0.0039;
//	renderer.shadowMapDarkness = 0.5;
//	renderer.shadowMapWidth = 500;
//	renderer.shadowMapHeight = 500;
    renderer.shadowMapEnabled = true;
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

   // controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
  //  controls.enableDamping = true;
  //  controls.dampingFactor = 0.25;
  //  controls.enableZoom = true;

 //   controls = new THREE.PointerLockControls( camera );

 //   scene.add( controls.getObject() );

   // controls = new THREE.PointerLockControls(camera);
   // scene.add( controls.getObject() )
    // helper
    //   var axisHelper = new THREE.AxisHelper( 5 );
    //   scene.add( axisHelper );
    var dir = new THREE.Vector3( 2, 2, 2).normalize();
    var origin = new THREE.Vector3( 1, 1, 1 );
    var length = 1;
    var hex = 0xffff00;

    var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
    arrowHelper.name = 'arrowHelper';
    scene.add( arrowHelper );



    var geometry1 = new THREE.SphereGeometry( 5, 8, 8 );
    var material1 = new THREE.MeshLambertMaterial( {color: 0xffff00} );
    var sphere1 = new THREE.Mesh( geometry1, material1 );
    sphere1.scale.set( .01, .01, .01 );
    sphere1.name = 'sphere1';
    sphere1.castShadow = true;
    scene.add(sphere1);


    var geometry2 = new THREE.SphereGeometry( 6, 4, 4 );
    var material2 = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    var sphere2 = new THREE.Mesh( geometry2, material2 );
    sphere2.scale.set( .01, .01, .01 );
    sphere2.name = 'sphere2';
    sphere2.castShadow = true;
    scene.add(sphere2);




    var lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    var lineGeometry = new THREE.Geometry();
    //lineGeometry.verticesNeedUpdate = true;
    lineGeometry.vertices.push( new THREE.Vector3( -10, 0, 0 ), new THREE.Vector3( 0, 10, 0 ) );
    var line = new THREE.Line( lineGeometry, lineMaterial );
    line.name = 'line';


    scene.add( line );






    /**
     * create field
     */

    var planeGeometry = new THREE.PlaneGeometry(1000, 1000);
    var planeMaterial = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('bg.jpg'),
        color: 0xffffff
    });


    planeMaterial.map.repeat.x = 300;
    planeMaterial.map.repeat.y = 300;
    planeMaterial.map.wrapS = THREE.RepeatWrapping;
    planeMaterial.map.wrapT = THREE.RepeatWrapping;
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = - Math.PI / 2; // r_76
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.name = 'plane';
    scene.add(plane);
  //  objects.push(plane);

    var meshArray = [];
    var geometry = new THREE.CubeGeometry(1, 1, 1);
    for (var i = 0; i < 100; i++) {
        meshArray[i] = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xffffff * Math.random()}));
        meshArray[i].position.x = i % 2 * 5 - 2.5;
        meshArray[i].position.y = .5;
        meshArray[i].position.z = -1 * i * 4;
        meshArray[i].castShadow = true;
        meshArray[i].receiveShadow = true;
        meshArray[i].name='cube';
        scene.add(meshArray[i]);
        //raycaster
      //  objects.push(meshArray[i]);
    }













    var isPrediction =  false //|| true;
    var isServerUpdate = false|| true;
    var isAnim = false ||true;
    var isReconciliation = false// ||true;


    var clock = new THREE.Clock();


    function animate(ts) {
        console.timeStamp('animate Fired '+ ts);






        //setTimeout(animate,14);
        requestAnimationFrame(animate);


        if(g_Player){
        g_Current_state = JSON.parse(JSON.stringify( {
            keyState: g_Player.keyState,
            mouseState: g_Player.mouseState,
            mouse2D: g_Player.mouse2D
        }))
        }
        //console.log(JSON.stringify(g_Current_state.keyState));








        if ( isServerUpdate && messageStack.length > 0 ){

           // console.log('SERV');
           // console.timeStamp('PRED '+ ts )
            //console.log(messageStack.length)
           // console.log('BEFORE TS_SERV '+g_Player.ts_server + ' TS_CLI :'+ g_Player.ts_client)
            updatePlayerData(messageStack.shift());
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

            if (isReconciliation){
              //  g_Current_state = JSON.parse(JSON.stringify([g_Player.ts_client, g_Player.keyState, g_Player.mouseState, g_Player.mouse2D, g_Player.ts_server, g_Player.last_client_delta, g_Player.position,g_Player.rotation,g_Player.quaternion])); // mask out


                g_Pending_input.forEach(function(state, i, arr){
                    if(state[0] <= g_Player.ts_client){

                        /*

                        if (state[0] == g_Player.ts_client){
                            console.log('got it!');
                            console.log(state[0] + ' vs '+ g_Player.ts_client);
                            console.log('pending state '+JSON.stringify(state[6])+' VS '+ JSON.stringify(g_Player.position) +' curent server upd. State mouse2D '+JSON.stringify(state[3]) +' VS g_P mouse2D '+ JSON.stringify(g_Player.mouse2D))

                        } else (console.log('miss!'));


                        //state already processed. remove it
                        arr.splice(i,1);
                       // console.log(g_Pending_input.length)
                        //return
                        */
                        //console.log('miss!');

                        arr.splice(i,1);
                    } else {
                       // console.log('got it!');
                       // console.log(JSON.stringify( state));





                      //  console.log('recon inputs left '+ arr.length )

                        //process input.
                        // masking
                        g_Player.ts_client = state[0];
                        g_Player.keyState = state[1];
                        g_Player.mouseState = state[2];
                        g_Player.mouse2D.set(state[3].x,state[3].y);
                        g_Player.ts_server =state[4];
                        g_Player.last_client_delta = state[5]
                        g_Player.position.set(state[6].x, state[6].y, state[6].z)
                        g_Player.rotation.set(state[7]._x, state[7]._y, state[7]._z, state[7]._order)
                        g_Player.quaternion.set(state[8]._x, state[8]._y, state[8]._z, state[8]._w)
                        predictPlayer([g_PlayerObject] , g_Player.last_client_delta  )


                    }
                });


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
                g_Pending_input =[];
            };

          //  console.log( g_Pending_input.length+' pending inputs')


            //g_Pending_input =[];









            stats2.update();

        }














        //TODO:  ALL player OBJ should be the same at client/server/pending/compensation
        if (g_Player) {

            var delta = clock.getDelta();
            //console.log('delta: '+delta);
            //console.log('ts delta: '+ (ts - g_Player.ts_client)) // we drop packets don't use it!!

            g_Player.ts_client = ts;
            g_Player.last_client_delta = delta;
            g_Player.keyState = g_Current_state.keyState;
            g_Player.mouseState = g_Current_state.mouseState;
            g_Player.mouse2D.set(g_Current_state.mouse2D.x,g_Current_state.mouse2D.y) ;



            // send input to the serverawawawawawaw
            //COPY OBJECT
            var state = JSON.parse(JSON.stringify([g_Player.ts_client, g_Player.keyState, g_Player.mouseState, g_Player.mouse2D, g_Player.ts_server, g_Player.last_client_delta, g_Player.position,g_Player.rotation,g_Player.quaternion]));
            //TODO: send one object instead of Array of objects;
            socket.emit('playerState', state);

            if (isPrediction)  {  //  g_PlayerObject GLOBAL

            //    console.log('SERVER/PREDICT/RECONCILE '+isServerUpdate+' '+isPrediction+' '+isReconciliation+ ' '+ g_Player.ts_client +' ' + JSON.stringify(g_Player));


                predictPlayer([g_PlayerObject] , delta  );
              //  console.log('AFTER SERVER/PREDICT/RECONCILE '+isServerUpdate+' '+isPrediction+' '+isReconciliation+ ' '+ g_Player.ts_client +' ' + JSON.stringify(g_Player));
            }

           // console.log('g_Player: '+g_Player.ts_client + ' ')
            //save input for further reconcilation
            g_Pending_input.push(state);
            //if (g_Pending_input.length > 20) g_Pending_input.shift();

           // console.log(g_Pending_input.length);

        }
       // g_Player.pending_input = (JSON.parse(JSON.stringify(g_Player)))





        stats.update();





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
        if(g_Player) g_Player.camera.updateMatrixWorld();
        if (g_Player) {
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
statsRTT.showPanel( 1 )

window.addEventListener('DOMContentLoaded', function () {
        document.body.appendChild(renderer.domElement);
        //var div = document.createElement('div');
        document.body.appendChild( stats.dom).setAttribute("style", "background-color:red; font-size:2em; top: 140px; position: absolute");
        document.body.appendChild( stats2.dom ).setAttribute("style", "background-color:red; font-size:2em; top: 190px; position: absolute");
        document.body.appendChild( statsRTT.dom ).setAttribute("style", "background-color:red; font-size:2em; top: 240px; position: absolute");




        animate();

    }

    , false);

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    var camera = g_Player.camera;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    socket.emit('onWindowResize', camera.aspect);

};

