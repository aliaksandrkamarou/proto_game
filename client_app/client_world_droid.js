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

////////////////////////////////////
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




var createPlayer = function(data){

    console.log('client_world: CLIENT DATA HAS ARRIVED');
    console.log(data);


    var loader = new THREE.JSONLoader();
    //loader.load( "models/animated/flamingo.js", function( geometry )
    loader.load( "droid.js", function( geometry )
    {

        var material = new THREE.MeshPhongMaterial( {
            color: 0xffffff,
            morphTargets: true,
            vertexColors: THREE.FaceColors,
            shading: THREE.FlatShading
        } );
        var mesh = new THREE.Mesh( geometry, material );

        //mesh.rotation.y = -Math.PI / 2;
        //mesh.position.x = - 150;
        //mesh.position.y = 150;
        mesh.scale.set( .02, .02, .02 );
        mesh.position.y = .5;



        scene.add( mesh );

        var player = data ;
        console.log(player);
        //player.playerId= data.playerId;

        player.mixer = new THREE.AnimationMixer( mesh );
        //mixer.playerId = data.playerId;
        player.actions.stand = player.mixer.clipAction( geometry.animations[ 0 ]);
        player.actions.run = player.mixer.clipAction( geometry.animations[ 1 ] );
        player.actions.attack = player.mixer.clipAction( geometry.animations[ 2 ] );
        //mixer.clipAction( geometry.animations[ 0]).play();
        player.actions.stand.play();

        // actions.idle = mixer.clipAction( geometry.animations[ 0]);
        //actions.idle.loop = THREE.LoopOnce
        // actions.idle.play();
        //mixer.clipAction( geometry.animations[ 7]).play();


        players.push( player );

    } );

};


var addOtherPlayer = function(data){
    console.log('client_world: Other PLayer DATA HAS ARRIVED');
    console.log(data);



    var loader = new THREE.JSONLoader();
    //loader.load( "models/animated/flamingo.js", function( geometry )
    loader.load( "droid.js", function( geometry )
    {

        var material = new THREE.MeshPhongMaterial( {
            color: 0xffffff,
            morphTargets: true,
            vertexColors: THREE.FaceColors,
            shading: THREE.FlatShading
        } );
        var mesh = new THREE.Mesh( geometry, material );

        //mesh.rotation.y = -Math.PI / 2;
        //mesh.position.x = - 150;
        //mesh.position.y = 150;
        mesh.scale.set( .02, .02, .02 );
        mesh.position.y = .5;



        scene.add( mesh );

        var player = data ;
        console.log(player);
        //player.playerId= data.playerId;

        player.mixer = new THREE.AnimationMixer( mesh );
        //mixer.playerId = data.playerId;
        player.actions.stand = player.mixer.clipAction( geometry.animations[ 0 ]);
        player.actions.run = player.mixer.clipAction( geometry.animations[ 1 ] );
        player.actions.attack = player.mixer.clipAction( geometry.animations[ 2 ] );
        //mixer.clipAction( geometry.animations[ 0]).play();
        player.actions.stand.play();

        // actions.idle = mixer.clipAction( geometry.animations[ 0]);
        //actions.idle.loop = THREE.LoopOnce
        // actions.idle.play();
        //mixer.clipAction( geometry.animations[ 7]).play();


        players.push( player );

    } );


};


var removeOtherPlayer = function (data) {  // need to delete two objects!!!

    scene.remove(playerForId(data.playerId).mixer._root);

};





document.addEventListener('keydown', onKeyDown, false );
document.addEventListener('keyup', onKeyUp, false );

document.addEventListener('mousedown', onMouseDown, false );
document.addEventListener('mouseup', onMouseUp, false );

function onKeyDown( event ){

    //event = event || window.event;
    socket.emit('keydown',event.keyCode || event.which); // emit keyCode or which depending on browser
    console.log('keydown emitted ' + event.keyCode || event.which);
    console.log(event);
};

function onKeyUp( event ) {


    socket.emit('keyup',event.keyCode || event.which); // emit keyCode or which depending on browser
    console.log('keyup emitted ' + event.keyCode || event.which);
    console.log(event);

};


function onMouseDown( event ){
    socket.emit('mousedown', event.button)
};

function onMouseUp( event ){
    socket.emit('mouseup', event.button)
};


var updatePlayerData = function(data){

    data.forEach(function(playerData){

        //console.log('playerData');
        //console.log(playerData);

        var player = playerForId(playerData.playerId);
        if (player){
            player.mixer.getRoot().position.set(playerData.position.x, playerData.position.y, playerData.position.z);
            player.mixer.getRoot().rotation.set(playerData.rotation.x, playerData.rotation.y, playerData.rotation.z);


            if ((playerData.keyState[38] || playerData.keyState[87]) && !player.actions.run.isScheduled())
                player.actions.run.play(); // run play anim
            if ((!playerData.keyState[38] && !playerData.keyState[87]) && player.actions.run.isScheduled())
                player.actions.run.stop(); //run stop anim

            if (playerData.mouseState[0] && !player.actions.attack.isScheduled())
                player.actions.attack.play(); // attack play anim
            if (!playerData.mouseState[0] && player.actions.attack.isScheduled())
                player.actions.attack.stop(); // attack stop anim


            //player.position.set(playerData.position.x, playerData.position.y, playerData.position.z);
            //player.rotation.set(playerData.rotation.x, playerData.rotation.y, playerData.rotation.z);
           // console.log('player rotation');
           // console.log(player.rotation);
          //  console.log('playerData rotation');
          //  console.log(playerData.rotation);
        }

    });
   // console.log(players);
};



window.addEventListener('DOMContentLoaded', function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var clock = new THREE.Clock();

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

    document.body.appendChild(renderer.domElement);
///
 //   var dir = new THREE.Vector3( 1, 0, 0 );
 //   var origin = new THREE.Vector3( 0, 0, 0 );
 //   var length = 1;
 //   var hex = 0xffff00;

   // var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
   // scene.add( arrowHelper );
///





    animate();

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
    scene.add(plane);

    var meshArray = [];
    var geometry = new THREE.CubeGeometry(1, 1, 1);
    for (var i = 0; i < 100; i++) {
        meshArray[i] = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xffffff * Math.random()}));
        meshArray[i].position.x = i % 2 * 5 - 2.5;
        meshArray[i].position.y = .5;
        meshArray[i].position.z = -1 * i * 4;
        meshArray[i].castShadow = true;
        meshArray[i].receiveShadow = true;
        scene.add(meshArray[i]);
    }

    /**
     * load md2 model
     */
    /*
    var md2frames = {
        // first, last, fps
        stand: [0, 39, 9, {state: 'stand', action: false}],   // STAND
        run: [40, 45, 10, {state: 'stand', action: false}],   // RUN
        attack: [46, 53, 10, {state: 'stand', action: true}],   // ATTACK
        pain1: [54, 57, 7, {state: 'stand', action: true}],   // PAIN_A
        pain2: [58, 61, 7, {state: 'stand', action: true}],   // PAIN_B
        pain3: [62, 65, 7, {state: 'stand', action: true}],   // PAIN_C
        jump: [66, 71, 7, {state: 'stand', action: true}],   // JUMP
        flip: [72, 83, 7, {state: 'stand', action: true}],   // FLIP
        salute: [84, 94, 7, {state: 'stand', action: true}],   // SALUTE
        taunt: [95, 111, 10, {state: 'stand', action: true}],   // FALLBACK
        wave: [112, 122, 7, {state: 'stand', action: true}],   // WAVE
        point: [123, 134, 6, {state: 'stand', action: true}],   // POINT
        crstand: [135, 153, 10, {state: 'crstand', action: false}],   // CROUCH_STAND
        crwalk: [154, 159, 7, {state: 'crstand', action: false}],   // CROUCH_WALK
        crattack: [160, 168, 10, {state: 'crstand', action: true}],   // CROUCH_ATTACK
        crpain: [196, 172, 7, {state: 'crstand', action: true}],   // CROUCH_PAIN
        crdeath: [173, 177, 5, {state: 'freeze', action: true}],   // CROUCH_DEATH
        death1: [178, 183, 7, {state: 'freeze', action: true}],   // DEATH_FALLBACK
        death2: [184, 189, 7, {state: 'freeze', action: true}],   // DEATH_FALLFORWARD
        death3: [190, 197, 7, {state: 'freeze', action: true}],   // DEATH_FALLBACKSLOW
        //boom    : [ 198, 198,  5 ]    // BOOM
    }
    */

  /*
    function changeMotion(motion) {
        player.model.motion = motion;
        player.model.state = md2frames[motion][3].state;

        var animMin = md2frames[motion][0];
        var animMax = md2frames[motion][1];
        var animFps = md2frames[motion][2];
        md2meshBody.time = 0;
        md2meshBody.duration = 1000 * (( animMax - animMin ) / animFps);
        md2meshBody.setFrameRange(animMin, animMax);
    }

    var md2meshBody;
    var material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('1.png'),
        ambient: 0x999999,
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 25,
        morphTargets: true
    });
    var loader = new THREE.JSONLoader();
    loader.load('droid.js', function (geometry) {
        md2meshBody = new THREE.MorphAnimMesh(geometry, material);
        md2meshBody.rotation.y = -Math.PI / 2;
        md2meshBody.scale.set(.02, .02, .02);
        md2meshBody.position.y = .5;
        md2meshBody.castShadow = true;
        md2meshBody.receiveShadow = true;
        changeMotion('stand');
        player.model.objects.add(md2meshBody);
        console.log(player.model.objects)
    });
*/
    /**
     * action
     */
    /*
    document.addEventListener('keydown', function (e) {
        if (!/67/.test(e.keyCode)) {
            return
        } //c key
        if (player.model.state === 'stand') {
            changeMotion('crstand');
        } else if (player.model.state === 'crstand') {
            changeMotion('stand');
        }
    }, false);
*/
    /**
     * move
     */
        /*
    var moveState = {
        moving: false,
        front: false,
        Backwards: false,
        left: false,
        right: false,
        speed: .1,
        angle: 0
    }

    function move() {
        if (player.model.motion !== 'run' && player.model.state === 'stand') {
            changeMotion('run');
        }
        if (player.model.motion !== 'crwalk' && player.model.state === 'crstand') {
            changeMotion('crwalk');
        }
        var speed = moveState.speed;
        if (player.model.state === 'crstand') {
            speed *= .5;
        }
        if (player.model.state === 'freeze') {
            speed *= 0;
        }

        var direction = moveState.angle;
        if (moveState.front && !moveState.left && !moveState.Backwards && !moveState.right) {
            direction += 0
        }
        if (moveState.front && moveState.left && !moveState.Backwards && !moveState.right) {
            direction += 45
        }
        if (!moveState.front && moveState.left && !moveState.Backwards && !moveState.right) {
            direction += 90
        }
        if (!moveState.front && moveState.left && moveState.Backwards && !moveState.right) {
            direction += 135
        }
        if (!moveState.front && !moveState.left && moveState.Backwards && !moveState.right) {
            direction += 180
        }
        if (!moveState.front && !moveState.left && moveState.Backwards && moveState.right) {
            direction += 225
        }
        if (!moveState.front && !moveState.left && !moveState.Backwards && moveState.right) {
            direction += 270
        }
        if (moveState.front && !moveState.left && !moveState.Backwards && moveState.right) {
            direction += 315
        }

        player.model.objects.rotation.y = direction * Math.PI / 180;
        player.position.x -= Math.sin(direction * Math.PI / 180) * speed;
        player.position.z -= Math.cos(direction * Math.PI / 180) * speed;
    }

    var timer;
    document.addEventListener('keydown', function (e) {
        if (!/65|68|83|87/.test(e.keyCode)) {
            return
        }
        if (e.keyCode === 87) {
            moveState.front = true;
            moveState.Backwards = false;
        } else if (e.keyCode === 83) {
            moveState.Backwards = true;
            moveState.front = false;
        } else if (e.keyCode === 65) {
            moveState.left = true;
            moveState.right = false;
        } else if (e.keyCode === 68) {
            moveState.right = true;
            moveState.left = false;
        }
        if (!moveState.moving) {
            if (player.model.state === 'stand') {
                changeMotion('run');
            }
            if (player.model.state === 'crstand') {
                changeMotion('crwalk');
            }
            moveState.moving = true;
            move();
            timer = setInterval(function () {
                move();
            }, 1000 / 60);
        }
    }, false);

    document.addEventListener('keyup', function (e) {
        if (!/65|68|83|87/.test(e.keyCode)) {
            return
        }
        if (e.keyCode === 87) {
            moveState.front = false;
        } else if (e.keyCode === 83) {
            moveState.Backwards = false;
        } else if (e.keyCode === 65) {
            moveState.left = false;
        } else if (e.keyCode === 68) {
            moveState.right = false;
        }
        if (!moveState.front && !moveState.Backwards && !moveState.left && !moveState.right) {
            changeMotion(player.model.state);
            moveState.moving = false;
            clearInterval(timer);
        }
    }, false);


    /**
     * camera rotation
     */
    /*
    var getElementPosition = function (element) {
        var top = left = 0;
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        }
        while (element);
        return {top: top, left: left};
    }

    var pointer = {x: 0, y: 0};
    document.addEventListener('mousemove', function (e) {
        var mouseX = e.clientX - getElementPosition(renderer.domElement).left;
        var mouseY = e.clientY - getElementPosition(renderer.domElement).top;
        pointer.x = (mouseX / renderer.domElement.width) * 2 - 1;
        pointer.y = -(mouseY / renderer.domElement.height) * 2 + 1;
    }, false);

    var oldPointerX = oldPointerY = 0;
    document.addEventListener('mousedown', rotateStart, false);
    function rotateStart() {
        oldPointerX = pointer.x;
        oldPointerY = pointer.y;
        renderer.domElement.addEventListener('mousemove', rotate, false);
        renderer.domElement.addEventListener('mouseup', rotateStop, false);
    }

    function rotateStop() {
        renderer.domElement.removeEventListener('mousemove', rotate, false);
        renderer.domElement.removeEventListener('mouseup', rotateStop, false);
    }

    function rotate() {
        player.camera.x += (oldPointerX - pointer.x) * player.camera.speed;
        player.camera.y += (oldPointerY - pointer.y) * player.camera.speed;
        if (player.camera.y > 150) {
            player.camera.y = 150;
        }
        if (player.camera.y < -150) {
            player.camera.y = -150;
        }

        moveState.angle = (player.camera.x / 2) % 360;

        oldPointerX = pointer.x;
        oldPointerY = pointer.y;
    }

*/
    /**
     * render
     */
    // helper
   //   var axisHelper = new THREE.AxisHelper( 5 );
   //   scene.add( axisHelper );

    function animate() {

        requestAnimationFrame(animate);


        var delta = clock.getDelta();

        for ( var i = 0; i < players.length; i ++ ) {

            players[ i ].mixer.update( delta );

        }



        /*


        var delta = clock.getDelta();


        //if ( player && player.md2meshBody && player.md2meshBody.updateAnimation) {
            var isEndFleame = (player.md2frames[player.model.motion][1] === player.md2meshBody.currentKeyframe);
            var isAction = player.md2frames[player.model.motion][3].action;

            if (!isAction || (isAction && !isEndFleame)) {
                player.md2meshBody.updateAnimation(1000 * delta);
            } else if (/freeze/.test(player.md2frames[player.model.motion][3].state)) {
                //dead...
            } else {
                player.changeMotion(player.model.state);
            }
        }
        */

        //if ( player ){
           // checkKeyStates();
        //};


/*
        if(player) // if player object loaded then do
        {

            player.model.objects.position.x = player.position.x;
            player.model.objects.position.y = player.position.y;
            player.model.objects.position.z = player.position.z;

            // camera rotate x
            camera.position.x = player.position.x + player.camera.distance * Math.sin((player.camera.x) * Math.PI / 360);
            camera.position.z = player.position.z + player.camera.distance * Math.cos((player.camera.x) * Math.PI / 360);

            //camera rotate y
            //camera.position.x = player.position.x + player.camera.distance * Math.cos( (player.camera.y) * Math.PI / 360 );
            camera.position.y = player.position.y + player.camera.distance * Math.sin((player.camera.y) * Math.PI / 360);
            //camera.position.z = player.position.z + player.camera.distance * Math.cos( (player.camera.y) * Math.PI / 360 );

            camera.position.y += 1;
            //console.log(camera.position.z)

            var vec3 = new THREE.Vector3(player.position.x, player.position.y, player.position.z)
            camera.lookAt(vec3);

            // model animation
            var delta = clock.getDelta();
            if (md2meshBody) {
                var isEndFleame = (md2frames[player.model.motion][1] === md2meshBody.currentKeyframe);
                var isAction = md2frames[player.model.motion][3].action;

                if (!isAction || (isAction && !isEndFleame)) {
                    md2meshBody.updateAnimation(1000 * delta);
                } else if (/freeze/.test(md2frames[player.model.motion][3].state)) {
                    //dead...
                } else {
                    changeMotion(player.model.state);
                }
            }
        }  // end if


*/
        // raycaster.js
        Raycaster(camera);
        renderer.clear();
        renderer.render(scene, camera);
    }


}, false);

/*
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

};
*/
