'use strict';

///////////GLOBALS

var renderer, raycaster, objects = [];

var sphere;
var players = [];
//var player ={}; //playerId //, moveSpeed, turnSpeed;
var messageStack = [];

var g_Pending_input = [];
var g_Current_state = [];
var g_Pending_server_hist = [];
var g_Ghosts = [];


var g_Player, g_PlayerObject;
var objectLoader = new THREE.ObjectLoader();


var g_lastTick = 0;
var g_Current_Client_time = 0;
var g_Current_Rendiring_time = 0;

var g_lastPs_sec = 0;

var joystick, joystick2
//var g_currentPs_sec = 0;
var g_CheckPoint;


// var mouse = new THREE.Vector2();

var geometryTemplate;
////////////////////////////////////
//init
var light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(1, 1, 1).normalize();
light.castShadow = true;


//var scene = new physijs.Scene( '../lib/physijs-worker.js', {gravity:{x:0, y:-9.8, z:0}} );//
//console.log( 'scene ' )
//console.log(scene.physijs.worker.onmessage)

var scene_world_bodys_meshs = initWorld() //new THREE.Scene()
var scene = scene_world_bodys_meshs.scene;
//var OIMOworld = scene_world_bodys_meshs.OIMOworld;
//var OIMObodys = (scene_world_bodys_meshs.bodys);
var OIMOmeshs = (scene_world_bodys_meshs.meshs);

//var scene = new Physijs.Scene({fixedTimeStep: 0 });
scene.fog = new THREE.FogExp2(0x000000, 0.001);
scene.autoUpdate = false || true;




scene.add(light);

var JSONloader = new THREE.JSONLoader();
var loader = new THREE.JSONLoader();
loader.load("droid.js", function (geometry) {
    geometryTemplate = geometry;
    //geometryTemplate.scale(.02,.02,.02);
});

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

    this.ts_interpol = undefined;

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


var createPlayer = function (data) {


    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        morphTargets: true,
        vertexColors: THREE.FaceColors,
        shading: THREE.FlatShading
    });


   // geometryTemplate.scale(2,2,2);
   // geometryTemplate.verticesNeedUpdate = true;

  //  geometryTemplate.scale(.02,.02,.02);


 //   var playerMesh =   new THREE.Mesh(geometryTemplate, material);//new physijs.Convex(geometryTemplate, material) //  ;//  //
    var playerMesh = new Physijs.BoxMesh(geometryTemplate, material , 1);


  //  playerMesh.scale.set(.02,.02,.02)




    var player = new Player(playerMesh, data.playerId); // use Server socket id //








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
        'runTime': {
            get: function () {
                return playerMesh.actions.run.time;
            },
            set: function (val) {
                playerMesh.actions.run.time = val;
            }

        },
        'attackTime': {
            get: function () {
                return playerMesh.actions.attack.time;
            },
            set: function (val) {
                playerMesh.actions.attack.time = val;
            }

        },
        'waveTime': {
            get: function () {
                return playerMesh.actions.wave.time;
            },
            set: function (val) {
                playerMesh.actions.wave.time = val;
            }

        }

    });


/*

   // playerMesh.geometry.center();
    console.log('bbox');
    console.log(playerMesh.geometry.boundingBox);

    var hex  = 0xff0000;
    var bbox = new THREE.BoundingBoxHelper( playerMesh, hex );
    //bbox.box = playerMesh.geometry.boundingBox
    // bbox.box.setFromObject( test );
    //  bbox.updateMatrix();
    bbox.update();

    var diff_mesh_bbox = playerMesh.position.clone().sub(bbox.position);
    playerMesh.translateX( -diff_mesh_bbox.x  );
    playerMesh.translateY( -diff_mesh_bbox.y  );
    playerMesh.translateZ( -diff_mesh_bbox.z  );

    //playerMesh.geometry.translate(diff_mesh_bbox.x,diff_mesh_bbox.y,diff_mesh_bbox.z)
   // bbox.geometry.translate(-diff_mesh_bbox.x,-diff_mesh_bbox.y,-diff_mesh_bbox.z)
   // playerMesh.updateMatrix();
   // bbox.update();

    //playerMesh.position.copy(bbox.position);

    console.log('PM position '+JSON.stringify(playerMesh.position))
    console.log('bbox position '+JSON.stringify(bbox.position))
    console.log('bbox center '+JSON.stringify(bbox.box));
 //   console.log(JSON.stringify(playerMesh.userData.diff_mesh_bbox))

    bbox.name='bbox';

    var axisHelper = new THREE.AxisHelper( 5 );
    bbox.add( axisHelper );


  //  console.log(bbox);

*/
    scene.add(playerMesh);
    objects.push(playerMesh);
    players.push(player);
 //   scene.add( bbox );





/*
    var hex  = 0xff0000;
    var bbox = new THREE.BoundingBoxHelper( playerMesh, hex );
    // bbox.box.setFromObject( test );
    //  bbox.updateMatrix();
    bbox.update();



    var diff_mesh_bbox = playerMesh.position.clone().sub(bbox.position);
    playerMesh.geometry.translate(diff_mesh_bbox.x,diff_mesh_bbox.y,diff_mesh_bbox.z)


  //  console.log(JSON.stringify(test.position))
  //  console.log(JSON.stringify(bbox.position))
  //  console.log(JSON.stringify(bbox.box.center()));
  //  console.log(JSON.stringify(test.diff_mesh_bbox))

    bbox.name='bbox';







    var axisHelper = new THREE.AxisHelper( 50 );
    bbox.add( axisHelper );


    console.log(bbox);
  //  scene.add(test);
    scene.add( bbox );
    // scene.add (test);



    var bbox_body = OIMOworld.add({type:'box', size:[bbox.scale.x,bbox.scale.y,bbox.scale.z], pos:[bbox.position.x,bbox.position.y,bbox.position.z], move:true, noSleep:true, world:OIMOworld});

    bbox_body.name = 'bbox_body';
    bbox_body.allowSleep = false;



    // scene.add (test);







 //   var bbox_body = OIMOworld.add({type:'box', size:[bbox.scale.x,bbox.scale.y,bbox.scale.z], pos:[bbox.position.x,bbox.position.y,bbox.position.z], move:true, world:OIMOworld, name: 'bbox_body'});

  //  OIMObodys.push(bbox_body);
   // OIMOmeshs.push(bbox);

    //bbox.add(playerMesh);


/*
    var playerMesh_body = OIMOworld.add({type:'box', size:[bbox.scale.x,bbox.scale.y,bbox.scale.z], pos:[bbox.position.x,bbox.position.y,bbox.position.z], move:true, world:OIMOworld,name: 'playerMesh_body',density: 5 });

    OIMObodys.push(playerMesh_body);
    OIMOmeshs.push(playerMesh);
*/




    //console.log(JSON.stringify(player));

    return player

};


var addOtherPlayer = function (data) {
    //   console.log('client_world: Other PLayer DATA HAS ARRIVED');
    //   console.log(data);


    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        morphTargets: true,
        vertexColors: THREE.FaceColors,
        shading: THREE.FlatShading
    });

 //   geometryTemplate.scale(.02,.02,.02);

    var playerMesh = new THREE.Mesh(geometryTemplate, material);
   // var playerMesh = new Physijs.BoxMesh(geometryTemplate, material , 1);
    //playerMesh.scale.set(.02,.02,.02);

    var player = new Player(playerMesh, data.playerId); // use Server socket id //




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
        'runTime': {
            get: function () {
                return playerMesh.actions.run.time;
            },
            set: function (val) {
                playerMesh.actions.run.time = val;
            }

        },
        'attackTime': {
            get: function () {
                return playerMesh.actions.attack.time;
            },
            set: function (val) {
                playerMesh.actions.attack.time = val;
            }

        },
        'waveTime': {
            get: function () {
                return playerMesh.actions.wave.time;
            },
            set: function (val) {
                playerMesh.actions.wave.time = val;
            }

        }

    });



     console.log('!!!!!!!!!!!!!!!!!!data.ts_client!!!!!!   '+ data.ts_client)


    scene.add(playerMesh);
    objects.push(playerMesh);
    players.push(player);




   // alert('!!!!!!!!!!!!!!!!!!data.ts_client!!!!!!   '+ data.ts_client )
    player.local_timer = data.ts_client;
    player.ts_client = data.ts_client;



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


    console.log('PAYERS CNT ' + players.length + ' OBJECTS CNT ' + objects.length + ' SCENE OBJ CNT ' + scene.children.length);


};



document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);


document.addEventListener('mousemove', onDocumentMouseMoveRaycater, false);


function onKeyDown(event) {

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
        isInterpolation = (!isInterpolation)
        console.log('isInterpolation: ' + isInterpolation)
    }
    ;

    if ((event.keyCode || event.which) == 73) {
        g_Player.isCameraFollow = (!g_Player.isCameraFollow)
        console.log('isCameraFollow: ' + g_Player.isCameraFollow)
    }
    ;


    //event = event || window.event;
    g_Player.keyState[event.keyCode || event.which] = true;
    // socket.emit('keydown',event.keyCode || event.which); // emit keyCode or which depending on browser
    //  console.log('keydown emitted ' + event.keyCode || event.which);
    //  console.log(event);
    ///
    //  document.removeEventListener('keydown',onKeyDown, false );

    ///

};

function onKeyUp(event) {
    g_Player.keyState[event.keyCode || event.which] = false;
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



var updateOnePlayer = function (playerData) {



    var player = objectForPID(playerData.playerId);
    if (player) {




     //   player.userData.isCameraFollow = playerData.isCameraFollow;
        player.userData.ts_server = playerData.ts_server // last ts proceeded by server;
        player.userData.ts_client = playerData.ts_client // last ts proceeded by server;
        player.userData.keyState = playerData.keyState;
        player.userData.mouseState = playerData.mouseState;
        player.userData.mouse2D.set(playerData.mouse2D.x, playerData.mouse2D.y);

        player.userData.last_client_delta = playerData.last_client_delta;
        player.position.set(playerData.position.x, playerData.position.y, playerData.position.z);
        //TODO: get rid of rotation it's re-linking HELL!
       // console.log('serv rot ' +JSON.stringify(playerData.rotation));
        player.userData.rotation.set(playerData.rotation._x, playerData.rotation._y, playerData.rotation._z, playerData.rotation._order);

      //   console.log(player.userData.quaternion);
       // console.log (player.rotation.constructor.name);
       // player.quaternion.set(playerData.quaternion._x, playerData.quaternion._y, playerData.quaternion._z, playerData.quaternion._w);


       // player.actions.run.play();
       // player.actions.attack.play();
       // player.actions.wave.play();


        (playerData.keyState[38] || playerData.keyState[87]) ? player.actions.run.play() : player.actions.run.stop();
        (playerData.mouseState[0]) ? player.actions.attack.play() : player.actions.attack.stop();
        (playerData.keyState[70]) ? player.actions.wave.play() : player.actions.wave.stop();


        player.userData.moveState = playerData.moveState;

        if (player.userData.moveState.hitOnce) {

            player.actions.painOne.play();
            player.actions.painOne.reset();
        }


        if (player.mixer.time != playerData.mixerTime) {

            player.mixer.time = playerData.mixerTime;

            //   console.log ('MIXER TIME CHANGED to'+ player.mixer.time + ' for '+ player.playerId +' at '+g_Player.playerId);

        }
        if (player.actions.stand.time != playerData.actions.standTime) {
            player.actions.stand.time = playerData.actions.standTime;
            //  console.log ('STAND TIME CHANGED');
        }
        if (player.actions.run.time != playerData.actions.runTime) {
            player.actions.run.time = playerData.actions.runTime;
            //  console.log ('RUN TIME CHANGED');
        }

        if (player.actions.attack.time != playerData.actions.attackTime) {
            //  console.log ('PRE ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
            player.actions.attack.time = playerData.actions.attackTime;
            //  console.log ('ATTACK TIME CHANGED'+ player.actions.attack.time +' ' + playerData.actions.attackTime);
        }

        if (player.actions.wave.time != playerData.actions.waveTime) {
            player.actions.wave.time = playerData.actions.waveTime;
            //  console.log ('WAVE TIME CHANGED');
        }

        player.mixer.update(0);

        if (player.playerId == g_Player.playerId) {

            //TODO: make it simpler
            g_Player.camera = objectLoader.parse(playerData.cameraJSON);
           // g_Player.camera = camera;

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


var lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
var lineGeometry = new THREE.Geometry();
//lineGeometry.verticesNeedUpdate = true;
lineGeometry.vertices.push(new THREE.Vector3(-10, 0, 0), new THREE.Vector3(0, 10, 0));
var line = new THREE.Line(lineGeometry, lineMaterial);
line.name = 'line';


scene.add(line);


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



var isPrediction = false //|| true;
var isServerUpdate = false || true;
//var isAnim = false ||true;
var isReconciliation = false// ||true;
var isInterpolation = false //|| true;

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

   // console.log(g_Player.position);







    if (g_Player) {

        //console.log(JSON.stringify(g_Player.scale))
        g_Current_state = JSON.parse(JSON.stringify({
            keyState: g_Player.keyState,
            mouseState: g_Player.mouseState,
            mouse2D: g_Player.mouse2D
        }))
    }
    //console.log(JSON.stringify(g_Current_state.keyState));





    if (isServerUpdate && messageStack.length > 0) {


        var v_serverData = messageStack.shift();

      //  g_lastTick = v_serverData.lastTick;
      //  g_Current_Client_time = g_lastTick;


       // console.log('server time upd' + g_Current_Client_time);



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

        } else {
            v_serverData.players.forEach(function(player, i , arr){



                updateOnePlayer(player);

                g_Pending_server_hist = [];

            });
        }
















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








        if (isReconciliation) {
            //  g_Current_state = JSON.parse(JSON.stringify([g_Player.ts_client, g_Player.keyState, g_Player.mouseState, g_Player.mouse2D, g_Player.ts_server, g_Player.last_client_delta, g_Player.position,g_Player.rotation,g_Player.quaternion])); // mask out


            g_Pending_input.forEach(function (state, i, arr) {
                if (state[0] <= g_Player.ts_client) {

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

                    arr.splice(i, 1);
                } else {

               //     console.log(JSON.stringify(state[7]));
                    // console.log('got it!');
                    // console.log(JSON.stringify( state));


                    //  console.log('recon inputs left '+ arr.length )

                    //process input.
                    // masking
                    g_Player.ts_client = state[0];
                    g_Player.keyState = state[1];
                    g_Player.mouseState = state[2];
                    g_Player.mouse2D.set(state[3].x, state[3].y);
                    g_Player.ts_server = state[4];
                    g_Player.last_client_delta = state[5]
                    g_Player.position.set(state[6].x, state[6].y, state[6].z)
                    g_Player.rotation.set(state[7]._x, state[7]._y, state[7]._z, state[7]._order)
                    g_Player.isCameraFollow = state[8];
                    predictPlayer([g_PlayerObject], g_Player.last_client_delta)


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
            g_Pending_input = [];
        }
        ;

        //  console.log( g_Pending_input.length+' pending inputs')


        //g_Pending_input =[];



        stats2.update();

    }


    //TODO:  ALL player OBJ should be the same at client/server/pending/compensation
    if (g_Player) {

        var delta = clock.getDelta();

       // scene.children[106].rotation.x += delta * 2;
       // scene.children[106].rotation.y = 1.5;

       // console.log(scene.children[2].rotation._x);

        g_Current_Client_time = g_Current_Client_time + delta;

       //console.log('client time upd' + g_Current_Client_time)


        //console.log('delta: '+delta);
        //console.log('ts delta: '+ (ts - g_Player.ts_client)) // we drop packets don't use it!!

        g_Player.ts_client = ts;
        g_Player.last_client_delta = delta;
        g_Player.keyState = g_Current_state.keyState;
        g_Player.mouseState = g_Current_state.mouseState;
        g_Player.mouse2D.set(g_Current_state.mouse2D.x, g_Current_state.mouse2D.y);


        // send input to the serverawawawawawaw
        //COPY OBJECT
        var state = JSON.parse(JSON.stringify([g_Player.ts_client, g_Player.keyState, g_Player.mouseState, g_Player.mouse2D, g_Player.ts_server, g_Player.last_client_delta, g_Player.position, g_Player.rotation, g_Player.isCameraFollow]));
        //TODO: send one object instead of Array of objects;
        socket.emit('playerState', state);




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
                        //player.userData.ts_interpol = player.userData.ts_static;
                        // player.userData.ts_client = frame.ts_client;
                        //player.userData.ts_render = ts_client - g_InterpolationMs
                    }




                }



              //  player.userData.ts_interpol = player.userData.ts_interpol + (delta*1000);
              //  player.userData.ts_render = player.userData.ts_interpol - g_InterpolationMs;


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






        if (isPrediction) {  //  g_PlayerObject GLOBAL

            //    console.log('SERVER/PREDICT/RECONCILE '+isServerUpdate+' '+isPrediction+' '+isReconciliation+ ' '+ g_Player.ts_client +' ' + JSON.stringify(g_Player));

            //updateOimoPhysics(OIMOworld, OIMObodys, OIMOmeshs);
            scene.setFixedTimeStep(delta);
            scene.simulate(delta);
            predictPlayer([g_PlayerObject], delta);




            //console.log(g_Player.position)
           // console.log(g_Player.rotation)

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

