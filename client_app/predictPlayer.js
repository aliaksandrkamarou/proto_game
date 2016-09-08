/**
 * Created by a_komarov on 14.05.2016.
 */

'use strict';


var predictPlayer = function  (objects,delta) {


    objects.forEach(function predictForEach (playerItem) {

        // console.log('CALL!!!!');




      //  playerItem.__dirtyPosition = true; //physi.js
      //  playerItem.__dirtyRotation = true;
/*
        if
        (playerItem.userData.keyState[38] || playerItem.userData.keyState[87]) {
            playerItem.position.x += delta * playerItem.userData.turnSpeed * playerItem.userData.r * Math.sin(playerItem.userData.rotation.y);  //DO NOT USE PLAYER.ROTATION ITS NOT LINKED!!!
            playerItem.position.z += delta *  playerItem.userData.turnSpeed * playerItem.userData.r  * Math.cos(playerItem.userData.rotation.y);
        }
*/

        checkKeyStates(playerItem, delta);
        cameraControl(playerItem);

         // playerItem.__dirtyPosition = false; //physi.js
         // playerItem.__dirtyRotation = false;


       // playerItem.userData.camera.updateMatrixWorld(); // TODO:  get/set

      //  console.log(JSON.stringify(playerItem.userData.rotation) +'  vs  '+JSON.stringify(playerItem.rotation)  )


        //if (isAnim) // isAnim GLOBAL
      //   playerItem.mixer.update(delta);


        //checkRayCast(playerItem, scene);
        //console.log(playerItem.intersected);


        //    deltaTime = clock.getDelta();
        // socket.emit('updateWorld', players) //  надо ли переносить в checkKeyStates?? !!!!!!!!
        // !!! Или вообще на месте обрабатывать в consumer'е


      //  scene.updateMatrixWorld();

        // console.log('prediction UPD g_PLAYER rotation '+ JSON.stringify(g_Player.rotation) +'; quaternion: ' + JSON.stringify(g_Player.quaternion) +'; position: '+ JSON.stringify(g_Player.position));


    });

}
/*
var checkKeyStates = function (player, delta) {

    if (player.userData.keyState[38] || player.userData.keyState[87]) {
        // up arrow or 'w' - move forward
        player.actions.run.play()
        player.position.x -= delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);  //DO NOT USE PLAYER.ROTATION ITS NOT LINKED!!!
        player.position.z += delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);

    } else {
        player.actions.run.stop()
    }
    ;


    if (player.userData.keyState[40] || player.userData.keyState[83]) {
        // down arrow or 's' - move backward
        player.position.x += delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);
        player.position.z -= delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);

    }
    ;
    if (player.userData.keyState[37] || player.userData.keyState[65]) {
        // left arrow or 'a' - rotate left

        //ver1
        player.userData.rotation.y += delta * player.userData.turnSpeed
        //  console.log('rot '+ player.userData.rotation._y +' vs '+ player.userData.rotation.y)
        //console.log( player.rotation.__proto__)

        //ver 2
        //!(player.userData.keyState[40] || player.userData.keyState[83]) ? player.userData.rotation.y += delta * player.userData.turnSpeed : player.userData.rotation.y -= delta * player.userData.turnSpeed ; // switch for backward

        // player.quaternion.setFromEuler(player.userData.rotation) // this.matrixUpdate won't catch rotation. only quaternion is used
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    ;
    if ((player.userData.keyState[39] || player.userData.keyState[68])) {
        // right arrow or 'd' - rotate right

        //ver1
        player.userData.rotation.y -= delta * player.userData.turnSpeed
        //ver 2
        //!(player.userData.keyState[40] || player.userData.keyState[83]) ? player.userData.rotation.y -= delta * player.userData.turnSpeed : player.userData.rotation.y += delta * player.userData.turnSpeed ; // switch for backward

        //   player.quaternion.setFromEuler(player.userData.rotation) // this.matrixUpdate won't catch rotation. only quaternion is used
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    ;
    if (player.userData.keyState[81]) {
        // 'q' - strafe left
        player.position.x += delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);
        player.position.z += delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);
        //player.position.x -= player.moveSpeed * Math.cos(player.rotation.y);
        //player.position.z += player.moveSpeed * Math.sin(player.rotation.y);
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    ;
    if (player.userData.keyState[69]) {
        // 'e' - strafe right
        player.position.x -= delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);
        player.position.z -= delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);
        //player.position.x += player.moveSpeed * Math.cos(player.rotation.y);
        //player.position.z -= player.moveSpeed * Math.sin(player.rotation.y);
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    ;

    (player.userData.mouseState[0]) ? player.actions.attack.play() : player.actions.attack.stop();
    (player.userData.keyState[70]) ? player.actions.wave.play() : player.actions.wave.stop();


    player.mixer.update(delta);


};
*/
/*
var checkKeyStates = function (player, delta) {

    // console.log(player.mixer.time + '  VS  ' + player.userData.mixerTime);
// ROTATION !!!!!!!!! PLAYER.ROTATION IS NOT LINKED TO PLAYER.USERDATA.ROTATION -- kinda HACK

    if (player.userData.keyState[38] || player.userData.keyState[87]) {
        // up arrow or 'w' - move forward
        player.actions.run.play()
        //player.position.x -= delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);  //DO NOT USE PLAYER.ROTATION ITS NOT LINKED!!!
        //player.position.z += delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);


        var dX = -delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);
        var dZ =  delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);

        player.position.add(new THREE.Vector3(dX,0 ,dZ));






    } else {
        player.actions.run.stop()
    };

    //  if (!player.keyState[38] && !player.keyState[87])  player.userData.actions.run.stop(); //run stop anim


    if (player.userData.keyState[40] || player.userData.keyState[83]) {
        // down arrow or 's' - move backward


   //     player.position.x += delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);
   //     player.position.z -= delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);

        var dX = delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);
        var dZ = - delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);

        player.position.add(new THREE.Vector3(dX,0 ,dZ));




        //player.position.x += player.moveSpeed * Math.sin(player.rotation.y);
        //player.position.z += player.moveSpeed * Math.cos(player.rotation.y);

        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    ;
    if (player.userData.keyState[37] || player.userData.keyState[65]) {
        // left arrow or 'a' - rotate left

        //ver1
        player.userData.rotation.y+= delta * player.userData.turnSpeed

        //ver 2
        //!(player.userData.keyState[40] || player.userData.keyState[83]) ? player.userData.rotation.y+= delta * player.userData.turnSpeed : player.userData.rotation.y -= delta * player.userData.turnSpeed; // switch for backward

      //  player.quaternion.setFromEuler(player.userData.rotation) // this.matrixUpdate won't catch rotation. only quaternion is used
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
       // player.updateMatrixWorld()
    }
    ;
    if ((player.userData.keyState[39] || player.userData.keyState[68])) {
        // right arrow or 'd' - rotate right
        player.userData.rotation.y-= delta * player.userData.turnSpeed

        //ver2
        //!(player.userData.keyState[40] || player.userData.keyState[83]) ? player.userData.rotation.y  -= delta * player.userData.turnSpeed : player.userData.rotation.y += delta * player.userData.turnSpeed; // switch for backward

      //  player.quaternion.setFromEuler(player.userData.rotation) // this.matrixUpdate won't catch rotation. only quaternion is used
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    ;
    if (player.userData.keyState[81]) {
        // 'q' - strafe left
        var dX =  delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);
        var dZ  =  delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);

        player.position.add(new THREE.Vector3(dX,0 ,dZ));


        //player.position.x += delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);
        //player.position.z += delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);


        //player.position.x -= player.moveSpeed * Math.cos(player.rotation.y);
        //player.position.z += player.moveSpeed * Math.sin(player.rotation.y);
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    ;
    if (player.userData.keyState[69]) {
        // 'e' - strafe right
        var dX = - delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);
        var dZ  = - delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);

        player.position.add(new THREE.Vector3(dX,0 ,dZ));
       // player.position.x -= delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);
       // player.position.z -= delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);


        //player.position.x += player.moveSpeed * Math.cos(player.rotation.y);
        //player.position.z -= player.moveSpeed * Math.sin(player.rotation.y);
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }


    //  console.log(player.userData.mouseState[0]);
    (player.userData.mouseState[0]) ? player.actions.attack.play() : player.actions.attack.stop();
    (player.userData.keyState[70]) ? player.actions.wave.play() : player.actions.wave.stop();

    //console.log(player.userData.mouseState[0] + '  '+ player.actions.attack.time + ' '+ player.userData.actions.attackTime);
    //   console.log(JSON.stringify(player.userData.keyState) + '  '+ player.actions.wave.time + ' '+ player.userData.actions.waveTime);

};

*/
function checkKeyStates_test(player, delta) {

    //console.log(delta);

    // console.log(player.mixer.time + '  VS  ' + player.mixerTime);
// ROTATION !!!!!!!!! PLAYER.ROTATION IS NOT LINKED TO PLAYER.ROTATION -- kinda HACK

    if (player.userData.keyState[38] || player.userData.keyState[87]) {
        // up arrow or 'w' - move forward
        //  player.actions.run.play()
        //player.position.x -= delta * player.moveSpeed * Math.cos(player.rotation.y);  //DO NOT USE PLAYER.ROTATION ITS NOT LINKED!!!
        //player.position.z += delta * player.moveSpeed * Math.sin(player.rotation.y);


        var dX = -delta * player.userData.moveSpeed * Math.cos(player.rotation.y);
        var dZ =  delta * player.userData.moveSpeed  * Math.sin(player.rotation.y);

        player.position.add(new THREE.Vector3(dX,0 ,dZ));






    } else {
        //  player.actions.run.stop()
    };

    //  if (!player.keyState[38] && !player.keyState[87])  player.actions.run.stop(); //run stop anim


    if (player.userData.keyState[40] || player.userData.keyState[83]) {
        // down arrow or 's' - move backward


        //     player.position.x += delta * player.moveSpeed * Math.cos(player.rotation.y);
        //     player.position.z -= delta * player.moveSpeed * Math.sin(player.rotation.y);

        var dX = delta * player.userData.moveSpeed* Math.cos(player.rotation.y);
        var dZ = - delta * player.userData.moveSpeed * Math.sin(player.rotation.y);

        player.position.add(new THREE.Vector3(dX,0 ,dZ));




        //player.position.x += player.moveSpeed * Math.sin(player.rotation.y);
        //player.position.z += player.moveSpeed * Math.cos(player.rotation.y);

        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    ;
    if (player.userData.keyState[37] || player.userData.keyState[65]) {
        // left arrow or 'a' - rotate left

        //ver1
        player.rotation.y+= delta * player.userData.turnSpeed//player.turnSpeed

        //ver 2
        //!(player.keyState[40] || player.keyState[83]) ? player.rotation.y+= delta * player.turnSpeed : player.rotation.y -= delta * player.turnSpeed; // switch for backward

        //  player.quaternion.setFromEuler(player.rotation) // this.matrixUpdate won't catch rotation. only quaternion is used
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
        // player.updateMatrixWorld()
    }
    ;
    if ((player.userData.keyState[39] || player.userData.keyState[68])) {
        // right arrow or 'd' - rotate right
        player.rotation.y-= delta * player.userData.turnSpeed//player.turnSpeed

        //ver2
        //!(player.keyState[40] || player.keyState[83]) ? player.rotation.y  -= delta * player.turnSpeed : player.rotation.y += delta * player.turnSpeed; // switch for backward

        //  player.quaternion.setFromEuler(player.rotation) // this.matrixUpdate won't catch rotation. only quaternion is used
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    ;
    if (player.userData.keyState[81]) {
        // 'q' - strafe left
        var dX =  delta * player.userData.moveSpeed * Math.sin(player.rotation.y);
        var dZ  =  delta * player.userData.moveSpeed * Math.cos(player.rotation.y);

        player.position.add(new THREE.Vector3(dX,0 ,dZ));


        //player.position.x += delta * player.moveSpeed * Math.sin(player.rotation.y);
        //player.position.z += delta * player.moveSpeed * Math.cos(player.rotation.y);


        //player.position.x -= player.moveSpeed * Math.cos(player.rotation.y);
        //player.position.z += player.moveSpeed * Math.sin(player.rotation.y);
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    ;
    if (player.userData.keyState[69]) {
        // 'e' - strafe right
        var dX = - delta * player.userData.moveSpeed * Math.sin(player.rotation.y);
        var dZ  = - delta * player.userData.moveSpeed * Math.cos(player.rotation.y);

        player.position.add(new THREE.Vector3(dX,0 ,dZ));
        // player.position.x -= delta * player.moveSpeed * Math.sin(player.rotation.y);
        // player.position.z -= delta * player.moveSpeed * Math.cos(player.rotation.y);


        //player.position.x += player.moveSpeed * Math.cos(player.rotation.y);
        //player.position.z -= player.moveSpeed * Math.sin(player.rotation.y);
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }


    //  console.log(player.mouseState[0]);
    // (player.mouseState[0]) ? player.actions.attack.play() : player.actions.attack.stop();
    // (player.keyState[70]) ? player.actions.wave.play() : player.actions.wave.stop();


};

/*

var checkRayCast = function (object) {


    var player = object.userData;
    var mouse = object.userData.mouse2D;
    var camera = object.userData.camera;
    var raycaster = object.userData.raycaster;
    var INTERSECTED = scene.getObjectById(player.intersected_scene_id); //TODO: exclude light from intersection


    raycaster.setFromCamera(player.mouse2D, player.camera);

    //console.log(INTERSECTED);
    //console.log(mouse);
    // console.log(camera);
    // console.log(scene.children)



    var intersects = raycaster.intersectObjects(scene.children); // TODO: SERVER/CLIENT logic should e the same server: intersectObjects(scene.children)

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex(); // TODO: get rid of currentHex it -- it looks artificial
            INTERSECTED.material.emissive.setHex(0xff0000);

            player.intersected_scene_id = INTERSECTED.id; // got new id back
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
    }









};


*/