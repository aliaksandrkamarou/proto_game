

///////////GLOBALS
var  scene, camera, renderer, raycaster, objects = [];
var keyState = {};
var sphere;
var players = [];
var player ={}; //playerId //, moveSpeed, turnSpeed;

var moveSpeed = 0.1;
var turnSpeed = 0.03;
var playerData;


var otherPlayers = [], otherPlayersId = [];

var mixers =[];

var mouse = new THREE.Vector2();
////////////////////////////////////
 function playerForId(id){

    var player;
    for (var i = 0; i < scene.children.length; i++){
        if (scene.children[i].userData.playerId === id){

            player = scene.children[i];
            break;

        }
    }

    return player;
};




var createPlayer = function(data){

   // console.log('client_world: CLIENT DATA HAS ARRIVED');
   // console.log(data);


    var loader = new THREE.JSONLoader();
    //loader.load( "models/animated/flamingo.js", function( geometry )
    loader.load("droid.js", function (geometry) {
     //   console.log('loader!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    //    console.log(geometry);

        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            morphTargets: true,
            vertexColors: THREE.FaceColors,
            shading: THREE.FlatShading
        });

        //var material = new THREE.MeshBasicMaterial();
        var mesh = new THREE.Mesh(geometry, material);

        //mesh.rotation.y = -Math.PI / 2;
        //mesh.position.x = - 150;
        //mesh.position.y = 150;
        mesh.scale.set(.02, .02, .02);
        mesh.position.y = .5;

        mesh.name = 'myPlayer';
        mesh.userData.playerId = data.playerId;


        //var player = data ;
        //console.log(player);
        //player.playerId= data.playerId;


        //mixer.playerId = data.playerId;

        //player.mixer = new THREE.AnimationMixer( mesh );
        //player.actions.stand = player.mixer.clipAction( geometry.animations[ 0 ]);
        //player.actions.run = player.mixer.clipAction( geometry.animations[ 1 ] );
        //player.actions.attack = player.mixer.clipAction( geometry.animations[ 2 ] );

        //mixer.clipAction( geometry.animations[ 0]).play();
        //player.actions.stand.play();

        mesh.userData.mixer = new THREE.AnimationMixer(mesh);
        mesh.userData.actions = {};
        mesh.userData.actions.stand = mesh.userData.mixer.clipAction(geometry.animations[0]);
        mesh.userData.actions.run = mesh.userData.mixer.clipAction(geometry.animations[1]);
        mesh.userData.actions.attack = mesh.userData.mixer.clipAction(geometry.animations[2]);

        mesh.userData.actions.painOne = mesh.userData.mixer.clipAction(geometry.animations[3]);

        mesh.userData.actions.wave = mesh.userData.mixer.clipAction(geometry.animations[10]);

        mesh.userData.actions.painOne.setLoop( THREE.LoopOnce, 0 );
     //   mesh.userData.actions.painOne.loop = THREE.LoopOnce
        //mesh.userData.actions.painOne.clampWhenFinished = true;

        mesh.userData.actions.stand.play();
   //     mesh.userData.mixer.update(.1);


       // mesh.userData.actions.run.play();
       // var clipJSON = mesh.userData.actions.stand.toJSON();

        mesh.userData.mouseState={};
        mesh.userData.keyState={};
        mesh.userData.moveState = {};

        scene.add(mesh);
        objects.push(mesh); // raycater / objects is global

        // actions.idle = mixer.clipAction( geometry.animations[ 0]);
        //actions.idle.loop = THREE.LoopOnce
        // actions.idle.play();
        //mixer.clipAction( geometry.animations[ 7]).play();


        // players.push( player );


    });

    socket.emit('onWindowResize',camera.aspect);
  //  console.log('create player camera.aspect '+ camera.aspect);
    if (!camera.aspect) alert('camera aspect is empty'); // try-catch

};


var addOtherPlayer = function(data){
 //   console.log('client_world: Other PLayer DATA HAS ARRIVED');
 //   console.log(data);



    var loader = new THREE.JSONLoader();
    //loader.load( "models/animated/flamingo.js", function( geometry )
    loader.load("droid.js", function (geometry) {


        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            morphTargets: true,
            vertexColors: THREE.FaceColors,
            shading: THREE.FlatShading
        });
        var mesh = new THREE.Mesh(geometry, material);




        //exp
       // var bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
        //

        //mesh.rotation.y = -Math.PI / 2;
        //mesh.position.x = - 150;
        //mesh.position.y = 150;
        mesh.scale.set(.02, .02, .02);
        mesh.position.y = .5;

        mesh.name = 'otherPlayer';
        mesh.userData.playerId = data.playerId;


        mesh.userData.mixer = new THREE.AnimationMixer(mesh);
        mesh.userData.actions = {};
        mesh.userData.actions.stand = mesh.userData.mixer.clipAction(geometry.animations[0]);
        mesh.userData.actions.run = mesh.userData.mixer.clipAction(geometry.animations[1]);
        mesh.userData.actions.attack = mesh.userData.mixer.clipAction(geometry.animations[2]);

        mesh.userData.actions.painOne = mesh.userData.mixer.clipAction(geometry.animations[3]);
       // mesh.userData.actions.painOne.loop = THREE.LoopOnce

        mesh.userData.actions.painOne.setLoop( THREE.LoopOnce, 0 );
        //mesh.userData.actions.painOne.setDuration(1);
       // mesh.userData.actions.painOne.clampWhenFinished = true;

       // mesh.userData.actions.stand.play();
        //var player = scene.getObjectByName('myPlayer')
        mesh.userData.actions.stand.play();



        mesh.userData.mouseState={};
        mesh.userData.keyState={};
        mesh.userData.moveState = {};



        scene.add(mesh);
        objects.push(mesh); // raycater / objects is global

    });


};


var removeOtherPlayer = function (data) {  // need to delete two objects!!!

    scene.remove(playerForId(data.playerId));

};





document.addEventListener('keydown', onKeyDown, false );
document.addEventListener('keyup', onKeyUp, false );

document.addEventListener('mousedown', onMouseDown, false );
document.addEventListener('mouseup', onMouseUp, false );


//document.addEventListener( 'mousemove', onDocumentMouseMoveRaycater, false );

//document.addEventListener( 'mousemove', onDocumentMouseMoveRaycater, false );

function onKeyDown( event ){

    //event = event || window.event;
    socket.emit('keydown',event.keyCode || event.which); // emit keyCode or which depending on browser
  //  console.log('keydown emitted ' + event.keyCode || event.which);
  //  console.log(event);
};

function onKeyUp( event ) {


    socket.emit('keyup',event.keyCode || event.which); // emit keyCode or which depending on browser
  //  console.log('keyup emitted ' + event.keyCode || event.which);
  //  console.log(event);

};


function onMouseDown( event ){
    socket.emit('mousedown', event.button)
};

function onMouseUp( event ){
    socket.emit('mouseup', event.button)
};

/*
function onDocumentMouseMoveRaycater( event ) {
    event.preventDefault();

    var mouse ={};// override
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    console.log('x: '+ mouse.x + ' y: '+ mouse.y)
    socket.emit('mouse2D+',mouse );

};
*/
var delta ;
var clock = new THREE.Clock();

var updatePlayerData = function(data){

    delta = data[1];
 //   console.log('TIME!!!!!!!!!!!!!!!!!!!!!!!!!!!'+delta)
    data[0].forEach(function(playerData){

        //console.log('playerData');
        //console.log(playerData);

        var player = playerForId(playerData.playerId);
        if (player){
            player.position.set(playerData.position.x, playerData.position.y, playerData.position.z);
            player.rotation.set(playerData.rotation.x, playerData.rotation.y, playerData.rotation.z);


            if ((playerData.keyState[38] || playerData.keyState[87]) && !player.userData.actions.run.isScheduled())
                player.userData.actions.run.play(); // run play anim
            if ((!playerData.keyState[38] && !playerData.keyState[87]) && player.userData.actions.run.isScheduled())
                player.userData.actions.run.stop(); //run stop anim

            if (playerData.mouseState[0] && !player.userData.actions.attack.isScheduled())
                player.userData.actions.attack.play(); // attack play anim
            if (!playerData.mouseState[0] && player.userData.actions.attack.isScheduled())
                player.userData.actions.attack.stop(); // attack stop anim

            player.userData.moveState = playerData.moveState;

            if (player.userData.moveState.hitOnce) {
               // console.log('player HIT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                player.userData.actions.painOne.play();
                player.userData.actions.painOne.reset();
            }

            player.userData.mouseState=playerData.mouseState;
            player.userData.keyState = playerData.keyState;
          //  player.userData.moveState = playerData.moveState; // update to false
         //   player.userData.mixer.update(worldTimeDelta);

            player.userData.mixer.update(delta);








        //    var intersects =[];
        //    player.mixer.getRoot().raycast(raycaster3,intersects);

            //player.position.set(playerData.position.x, playerData.position.y, playerData.position.z);
            //player.rotation.set(playerData.rotation.x, playerData.rotation.y, playerData.rotation.z);
           // console.log('player rotation');
           // console.log(player.rotation);
          //  console.log('playerData rotation');
          //  console.log(playerData.rotation);
        }

    });
   // console.log(players);



   // animate();
};



    var width = window.innerWidth;
    var height = window.innerHeight;


    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.05);


    //scene.add(player.model.objects);

    var camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
    camera.position.y = 7;
    camera.position.z = 4;
    camera.position.x = 4;
    camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
    scene.add(camera);



    var light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(1, 1, 1).normalize();
    light.castShadow = true;

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
    scene.add(light);

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

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

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

    plane.rotation.x = - Math.PI / 2; // r_75
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.name = 'plane';
    scene.add(plane);
    objects.push(plane);

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
        objects.push(meshArray[i]);
    }





    function animate() {

        //setTimeout(animate,14);
        requestAnimationFrame(animate);




        //var delta = clock.getDelta();

    //    for ( var i = 0; i < players.length; i ++ ) {

    //        players[ i ].mixer.update( delta );

    //    }
/*
       for (var i = 0; i < scene.children.length; i ++ ){   // all objects is too many

            if(scene.children[i].userData.mixer) scene.children[i].userData.mixer.update(delta);

        }
   */
    //   console.log('clock:'+ clock.getDelta() +' server: '+ delta)
       //controls.update();


        // raycaster.js
        Raycaster2(camera);
        renderer.clear();
        renderer.render(scene, camera);


    }






window.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(renderer.domElement);
    animate();

    }

    , false);

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    socket.emit('onWindowResize', camera.aspect)

};

