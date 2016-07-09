(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.checkKeyStates = factory()
    }
}(this, function () {
    'use strict';

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

    return checkKeyStates;


}));