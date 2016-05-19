/**
 * Created by a_komarov on 14.05.2016.
 */

'use strict';


var predictPlayer = function  (objects,delta) {


    objects.forEach(function (playerItem) {

        // console.log('CALL!!!!');


        checkKeyStates(playerItem, delta);


       // playerItem.userData.camera.updateMatrixWorld(); // TODO:  get/set


        if (isAnim) playerItem.mixer.update(delta);  // isAnim GLOBAL


      //  checkRayCast(playerItem);
        //console.log(playerItem.intersected);


        //    deltaTime = clock.getDelta();
        // socket.emit('updateWorld', players) //  надо ли переносить в checkKeyStates?? !!!!!!!!
        // !!! Или вообще на месте обрабатывать в consumer'е


      //  scene.updateMatrixWorld();

        // console.log('prediction UPD g_PLAYER rotation '+ JSON.stringify(g_Player.rotation) +'; quaternion: ' + JSON.stringify(g_Player.quaternion) +'; position: '+ JSON.stringify(g_Player.position));


    });

}

var checkKeyStates = function (player, delta) {

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
    }
    ;
    if (player.userData.keyState[37] || player.userData.keyState[65]) {
        // left arrow or 'a' - rotate left
        !(player.userData.keyState[40] || player.userData.keyState[83]) ? player.userData.rotation._y += delta * player.userData.turnSpeed : player.userData.rotation._y -= delta * player.userData.turnSpeed; // switch for backward

        player.quaternion.setFromEuler(player.userData.rotation) // this.matrixUpdate won't catch rotation. only quaternion is used
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    ;
    if ((player.userData.keyState[39] || player.userData.keyState[68])) {
        // right arrow or 'd' - rotate right
        !(player.userData.keyState[40] || player.userData.keyState[83]) ? player.userData.rotation._y -= delta * player.userData.turnSpeed : player.userData.rotation._y += delta * player.userData.turnSpeed; // switch for backward

        player.quaternion.setFromEuler(player.userData.rotation) // this.matrixUpdate won't catch rotation. only quaternion is used
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    ;
    if (player.userData.keyState[81]) {
        // 'q' - strafe left
        player.position.x += delta * player.userData.moveSpeed * Math.sin(player.userData.rotation._y);
        player.position.z += delta * player.userData.moveSpeed * Math.cos(player.userData.rotation._y);
        //player.position.x -= player.moveSpeed * Math.cos(player.rotation.y);
        //player.position.z += player.moveSpeed * Math.sin(player.rotation.y);
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    ;
    if (player.userData.keyState[69]) {
        // 'e' - strafe right
        player.position.x -= delta * player.userData.moveSpeed * Math.sin(player.userData.rotation._y);
        player.position.z -= delta * player.userData.moveSpeed * Math.cos(player.userData.rotation._y);
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









    /*
     if (intersects.length > 0) {
     if (player.intersected != intersects[0].object) {
     if (player.intersected) player.intersected.material.emissive.setHex(player.intersected.currentHex);
     player.intersected = intersects[0].object;
     player.intersected.currentHex = player.intersected.material.emissive.getHex();
     player.intersected.material.emissive.setHex(0xff0000);
     }
     } else {
     if (player.intersected) player.intersected.material.emissive.setHex(player.intersected.currentHex);
     player.intersected = null;
     }
     */

    //console.log(intersects);
    //     console.log('camera pos');
    //     console.log(camera.position);
//    console.log('camera aspect' + camera.aspect);
//    console.log('proj matrix');
//    console.log(camera.projectionMatrix);
    //  console.log('mouse  x:' + mouse.x +' y: ' + mouse.y );
    //  console.log('RAY FROM '+object.userData.playerId+ ' INTERSECTS OBJECT ' +(INTERSECTED ? INTERSECTED.userData.playerId : INTERSECTED ))
    // console.log('Rotation '+ (INTERSECTED ? ('object rotation ' + JSON.stringify(INTERSECTED.rotation) + 'userData rotation ' + JSON.stringify(INTERSECTED.userData.rotation) ) : INTERSECTED ))

    //  if(player.intersected) {console.log('RAY FROM '+player.playerId+ ' INTERSECTS object ' + player.intersected.id )} else (console.log(''));


    //console.log()


};


