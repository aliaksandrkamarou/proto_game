'use strinct';
var THREE = require('three');
var fs = require('fs');

var scene = new THREE.Scene();
var players = [];
var objects = [];


var geometryTemplate;
var JSONloader = new THREE.JSONLoader();

/*
fs.readFile('c:/proto_game/client_app/droid.js', 'utf-8', function (err, content) {
    if (err) console.log(err);

    var jsonContent = JSON.parse(content);

    var loader = new THREE.JSONLoader();
    //console.log( loader.parse(jsonContent).geometry);
    geometryTemplate = loader.parse(jsonContent).geometry;

}); // может лучше тут синхронный вызов, т.к. это только один раз вроде при инициализации???
*/
var content = fs.readFileSync('c:/proto_game/client_app/droid.js', 'utf-8');
var jsonContent = JSON.parse(content);
geometryTemplate = JSONloader.parse(jsonContent).geometry;


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
    this.raycaster.linePrecision = 0;


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
//Player.prototype = Object.create(THREE.Mesh.prototype);
//Player.prototype.constructor = Player;



var addPlayer = function(id){


    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        morphTargets: true,
        vertexColors: THREE.FaceColors,
        shading: THREE.FlatShading
    });


    var playerMesh = new THREE.Mesh(geometryTemplate, material);

    var player = new Player(playerMesh, id);
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


    // console.log('AAAAALAAARMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM')
   // console.log( player.mixerTime)



    //playerMesh.name = id;
    scene.add(playerMesh);
    objects.push(playerMesh);






    //player.playerId = id



   // console.log('player '+ player.playerId +' mesh ' + playerMesh.position.y );
 //   console.log('player cam ');
 //   console.log(player.camera);

    players.push( player );   // side effect



    console.log('player.position')
    console.log(player.position);
    console.log(playerMesh.position);


    return player;

};










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





var renderPlayers = function(objects, delta) {



    objects.forEach(function (playerItem) {
       // console.log(playerItem.userData.needServerUpdate)

        if(playerItem.userData.needServerUpdate) {
           // console.log(playerItem.userData.ts_client +' ' + JSON.stringify(playerItem.userData));
            /**/



            checkKeyStates(playerItem, playerItem.userData.last_client_delta);


            //playerItem.userData.camera.updateProjectionMatrix(); // onResize and on connect
            //playerItem.userData.camera.updateMatrixWorld(); // update camera since it's not a child of scene //
            playerItem.userData.camera.updateMatrixWorld();


             playerItem.userData.cameraJSON = playerItem.userData.camera.toJSON();

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


            checkRayCast(playerItem);
            //console.log(playerItem.intersected);

           // console.log('ts_clien: '+playerItem.ts_client+' ')



            playerItem.userData.needServerUpdate = false;

         //   console.log('AFTER '+playerItem.userData.ts_client +' ' + JSON.stringify(playerItem.userData));

        }


    });
    scene.updateMatrixWorld(); // updateMeshes
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

var checkKeyStates = function(player , delta){

   // console.log(player.mixer.time + '  VS  ' + player.userData.mixerTime);
// ROTATION !!!!!!!!! PLAYER.ROTATION IS NOT LINKED TO PLAYER.USERDATA.ROTATION -- kinda HACK

    if (player.userData.keyState[38] || player.userData.keyState[87]) {
        // up arrow or 'w' - move forward
        player.actions.run.play()
        player.position.x -= delta * player.userData.moveSpeed * Math.cos(player.userData.rotation._y);  //DO NOT USE PLAYER.ROTATION ITS NOT LINKED!!!
        player.position.z += delta * player.userData.moveSpeed * Math.sin(player.userData.rotation._y);

    } else {
        player.actions.run.stop()
    };

  //  if (!player.keyState[38] && !player.keyState[87])  player.userData.actions.run.stop(); //run stop anim



    if (player.userData.keyState[40] || player.userData.keyState[83]) {
        // down arrow or 's' - move backward
        player.position.x += delta * player.userData.moveSpeed * Math.cos(player.userData.rotation._y);
        player.position.z -= delta * player.userData.moveSpeed * Math.sin(player.userData.rotation._y);
        //player.position.x += player.moveSpeed * Math.sin(player.rotation.y);
        //player.position.z += player.moveSpeed * Math.cos(player.rotation.y);

        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    };
    if (player.userData.keyState[37] || player.userData.keyState[65]) {
        // left arrow or 'a' - rotate left
        !(player.userData.keyState[40] || player.userData.keyState[83]) ? player.userData.rotation._y += delta * player.userData.turnSpeed : player.userData.rotation._y -= delta * player.userData.turnSpeed ; // switch for backward

       player.quaternion.setFromEuler(player.userData.rotation) // this.matrixUpdate won't catch rotation. only quaternion is used
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    };
    if ((player.userData.keyState[39] || player.userData.keyState[68])) {
        // right arrow or 'd' - rotate right
        !(player.userData.keyState[40] || player.userData.keyState[83]) ? player.userData.rotation._y -= delta * player.userData.turnSpeed : player.userData.rotation._y += delta * player.userData.turnSpeed ; // switch for backward

        player.quaternion.setFromEuler(player.userData.rotation) // this.matrixUpdate won't catch rotation. only quaternion is used
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    };
    if (player.userData.keyState[81]) {
        // 'q' - strafe left
        player.position.x += delta * player.userData.moveSpeed * Math.sin(player.userData.rotation._y);
        player.position.z += delta * player.userData.moveSpeed * Math.cos(player.userData.rotation._y);
        //player.position.x -= player.moveSpeed * Math.cos(player.rotation.y);
        //player.position.z += player.moveSpeed * Math.sin(player.rotation.y);
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    };
    if (player.userData.keyState[69]) {
        // 'e' - strafe right
        player.position.x -= delta * player.userData.moveSpeed * Math.sin(player.userData.rotation._y);
        player.position.z -= delta * player.userData.moveSpeed * Math.cos(player.userData.rotation._y);
        //player.position.x += player.moveSpeed * Math.cos(player.rotation.y);
        //player.position.z -= player.moveSpeed * Math.sin(player.rotation.y);
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    };

    (player.userData.mouseState[0]) ? player.actions.attack.play() :  player.actions.attack.stop();
    (player.userData.keyState[70]) ? player.actions.wave.play() :  player.actions.wave.stop();


    player.mixer.update(delta);

    //console.log(player.userData.mouseState[0] + '  '+ player.actions.attack.time + ' '+ player.userData.actions.attackTime);
 //   console.log(JSON.stringify(player.userData.keyState) + '  '+ player.actions.wave.time + ' '+ player.userData.actions.waveTime);

};




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
    //  console.log('RAY FROM '+object.userData.playerId+ ' INTERSECTS OBJECT ' +(INTERSECTED ? INTERSECTED.userData.playerId : INTERSECTED ))
   // console.log('Rotation '+ (INTERSECTED ? ('object rotation ' + JSON.stringify(INTERSECTED.rotation) + 'userData rotation ' + JSON.stringify(INTERSECTED.userData.rotation) ) : INTERSECTED ))

   // if(INTERSECTED) {console.log('RAY FROM '+object.userData.playerId+ ' INTERSECTS OBJECT ' + INTERSECTED.userData.playerId )} else (console.log(''));


    //console.log()


}





//


module.exports.players = players;
module.exports.addPlayer = addPlayer;
module.exports.removePlayer = removePlayer;
//module.exports.updatePlayerData = updatePlayerData;
module.exports.playerForId = playerForId;

//module.exports.onKeyDown = onKeyDown;
//module.exports.onKeyUp = onKeyUp;
//module.exports.onMouseDown = onMouseDown;
//module.exports.onMouseUp = onMouseUp;

module.exports.renderPlayers = renderPlayers;

module.exports.resetMoveStates = resetMoveStates;

module.exports.jsonContent = jsonContent;

module.exports.objects = objects;
