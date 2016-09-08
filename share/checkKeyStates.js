(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('three'));
    } else {
        // Browser globals (root is window)
        root.checkKeyStates = factory(root.THREE)
    }
}(this, function (THREE) {
    'use strict';



    function moveCirc(player, angle , forwardSign, delta) {

        var angle = angle * delta;


        var point = player.position;

        var center = {
            x: - Math.sign(forwardSign)*Math.sin(player.rotation.y)*60+player.position.x,
            z: - Math.sign(forwardSign)*Math.cos(player.rotation.y)*60+player.position.z
        }


        //angle = (angle ) * (Math.PI/180); // Convert to radians
        var rotatedX = Math.cos(angle) * (point.x - center.x) - Math.sin(angle) * (point.z - center.z) + center.x;
        var rotatedZ = Math.sin(angle) * (point.x - center.x) + Math.cos(angle) * (point.z - center.z) + center.z;


        player.position.setX(rotatedX)
        player.position.setZ(rotatedZ)



        player.rotation.set(player.rotation.x, player.rotation.y  -  /*Math.sign(turnSign) * */angle, player.rotation.z);
       // player.setAngularVelocity({x:player._physijs.angularVelocity.x,y: -angle/delta ,z: player._physijs.angularVelocity.z})

    }


    var checkKeyStates = function (player, delta) {


     //   console.log(player.actions.stand.time)



        //physi.js

        player.__dirtyPosition = true;
        player.__dirtyRotation = true;

       // player.setLinearVelocity({x: 0, y:player._physijs.linearVelocity.y, z: 0} )  //event listener  + updateOnePlayer
      //  player.setAngularVelocity({x: 0, y:0, z: 0} )


        //player.setLinearVelocity({x:0,y: player.getLinearVelocity().y,z:0});


        //circular movement
 //       if (((player.userData.keyState[38] || player.userData.keyState[87])^(player.userData.keyState[40] || player.userData.keyState[83])) && ((player.userData.keyState[37] || player.userData.keyState[65])^(player.userData.keyState[39] || player.userData.keyState[68])))
  //      {

    //        var forwardSign, turnSign;


      //       if (player.userData.keyState[38] || player.userData.keyState[87]) {forwardSign = 1; player.actions.run.play()} else { forwardSign = -1;  player.actions.run.stop()};
        //     if (player.userData.keyState[39] || player.userData.keyState[68]) {turnSign = 1;} else { turnSign = -1;} ;
          //   player.mixer.update(delta);


            /*
            function foo(delta)
            {



                var originX = player.position.x + player.userData.r * Math.cos(player.rotation.y + ( Math.PI / 2));
                var originZ = player.position.z + player.userData.r * Math.sin(player.rotation.y + ( Math.PI / 2));

                var rx = player.position.x - originX;
                var rz = player.position.z - originZ;

                var c = Math.cos(delta * player.userData.turnSpeed);
                var s = Math.sin(delta * player.userData.turnSpeed);


                player.position.setX(originX + rx * c - rz * s);
                player.position.setZ(originZ + rx * s + rz * c);

                player.rotation.y =  player.rotation.y + delta * player.userData.turnSpeed //TEST +=
                console.log(player.position.x +' '+player.position.z+ ' oriX '+originX +' vs oriZ '+ originZ +' c '+ c+ ' s '+ s + ' setX '+ (originX + rx * c - rz * s) + ' setZ '+(originZ + rx * s + rz * c));

            };
           // foo(0.125)
           */



           // if ()


//            moveCirc(player/*{x:10, z:50}*/,player.userData.turnSpeed  * turnSign  /*angle*/, forwardSign* turnSign ,delta)

  //          return;


    //    }

     //   var isActive = player.userData.keyState.some(function (el, idx, arr) {
      //      return el == true;
     //   });

     //   console.log('getAngularVelocity ');
     //   console.log(player.getAngularVelocity());


      //  (isActive) ? player.actions.stand.stop() : player.actions.stand.play();
      //  player.actions.stand.play()

        (player.userData.keyState.some(function(el, idx, arr){
            return el == true;
        })) ? player.actions.stand.stop():player.actions.stand.play();


       // if (player.userData.keyState[32]) player.applyCentralImpulse({x:0,y:3,z:0});
/////////////////////////// FORWARD/BACKWARD
      if
        ((player.userData.keyState[38] || player.userData.keyState[87]) && !(player.userData.keyState[40] || player.userData.keyState[83])) {

        // up arrow or 'w' - move forward and NOT s -- backward
         // if (!player.userData.moveState.isRunning) {
              player.actions.run.play();
              player.actions.back.stop();
              //     player.position.x += delta * player.userData.turnSpeed * player.userData.r * Math.sin(player.userData.rotation.y);  //DO NOT USE PLAYER.ROTATION ITS NOT LINKED!!!
              //     player.position.z += delta *  player.userData.turnSpeed * player.userData.r  * Math.cos(player.userData.rotation.y);

              var angle = new THREE.Euler().setFromQuaternion(player.userData.quaternion, 'YZX', false);
              //player.userData.rotation.y

              //FOR CORRECT Collision CALLBACK
              var linearVelocity = player.getLinearVelocity();

              player.setLinearVelocity({
                  x: player.userData.turnSpeed * player.userData.r * Math.sin(angle.y),
                  y: /*player._physijs.*/linearVelocity.y,
                  z: player.userData.turnSpeed * player.userData.r * Math.cos(angle.y)
              });

           //   player.userData.moveState.isRunning = true;

       //   }

      /*  if (!player.isMoving){
            player.applyCentralForce({x: player.userData.turnSpeed * player.userData.r * Math.sin(angle.y)* player._physijs.mass, y:0, z: player.userData.turnSpeed * player.userData.r  * Math.cos(angle.y)* player._physijs.mass} )
            player.isMoving = true;

        }
*/


        } else if (!(player.userData.keyState[38] || player.userData.keyState[87]) && (player.userData.keyState[40] || player.userData.keyState[83]))

        // down arrow or 's' - move backward and NOT w -- forward
        {
            player.actions.run.stop();
            player.actions.back.play();

            var angle = new THREE.Euler().setFromQuaternion(player.userData.quaternion, 'YZX', false );

            var linearVelocity = player.getLinearVelocity();

            player.setLinearVelocity({x: -player.userData.turnSpeed * player.userData.r * Math.sin(angle.y), y:/*player._physijs.*/linearVelocity.y, z: -player.userData.turnSpeed * player.userData.r  * Math.cos(angle.y)} )



        }
        else {

/*
          if(player.userData.isMoving){
              var angle = new THREE.Euler().setFromQuaternion(player.userData.quaternion, 'YZX', false );

              player.applyCentralForce({x: -player.userData.turnSpeed * player.userData.r * Math.sin(angle.y)* player._physijs.mass, y:0, z: -player.userData.turnSpeed * player.userData.r  * Math.cos(angle.y)* player._physijs.mass} );
              player.userData.isMoving = false;

          }
          */


      //    if (player.userData.moveState.isRunning) {
              player.actions.back.stop();
              player.actions.run.stop();
              // player.applyCentralForce({x:0, y:0, z: 0} )
              // player.applyCentralForce({x: -player.userData.turnSpeed * player.userData.r * Math.sin(angle.y)* player._physijs.mass, y:0, z: -player.userData.turnSpeed * player.userData.r  * Math.cos(angle.y)* player._physijs.mass} )

              var linearVelocity = player.getLinearVelocity();

              player.setLinearVelocity({x: 0, y: /*player._physijs.*/linearVelocity.y, z: 0});
              //console.log('linear velocity');
              //console.log(player.getLinearVelocity());
              //player.clearForces()
           //   player.userData.moveState.isRunning = false;
         // }
        }
        ;
       // console.log('VELOCITY')/
       // console.log(player.getLinearVelocity())


        if (player.userData.keyState[37] || player.userData.keyState[65]) {
            // left arrow or 'a' - rotate left

            //ver1
         //   player.userData.rotation.y += delta * player.userData.turnSpeed

            //player.setAngularVelocity({x: player._physijs.angularVelocity.x, y: player.userData.turnSpeed, z: player._physijs.angularVelocity.z} )

            //  console.log('rot '+ player.userData.rotation._y +' vs '+ player.userData.rotation.y)
            //console.log( player.rotation.__proto__)

            //ver 2
            //!(player.userData.keyState[40] || player.userData.keyState[83]) ? player.userData.rotation.y += delta * player.userData.turnSpeed : player.userData.rotation.y -= delta * player.userData.turnSpeed ; // switch for backward

            // player.quaternion.setFromEuler(player.userData.rotation) // this.matrixUpdate won't catch rotation. only quaternion is used
            //updatePlayerData();
            //socket.emit('updatePosition', playerData);
        } //else {player.setAngularVelocity({x:0,y:0,z:0})};
        ;
        if ((player.userData.keyState[39] || player.userData.keyState[68])) {
            // right arrow or 'd' - rotate right

            //ver1
            var angularVelocity = player.getAngularVelocity();
         //   player.userData.rotation.y -= delta * player.userData.turnSpeed;
            player.setAngularVelocity({x: /*player._physijs.*/angularVelocity.x, y: -player.userData.turnSpeed, z: /*player._physijs.*/angularVelocity.z} )
            //ver 2
            //!(player.userData.keyState[40] || player.userData.keyState[83]) ? player.userData.rotation.y -= delta * player.userData.turnSpeed : player.userData.rotation.y += delta * player.userData.turnSpeed ; // switch for backward

            //   player.quaternion.setFromEuler(player.userData.rotation) // this.matrixUpdate won't catch rotation. only quaternion is used
            //updatePlayerData();
            //socket.emit('updatePosition', playerData);
        } else {

            var angularVelocity = player.getAngularVelocity();
            player.setAngularVelocity({x: angularVelocity.x,y:0,z: angularVelocity.z})

        };
        ;
        if (player.userData.keyState[81]) {
            // 'q' - strafe left
         //   player.position.x += delta *  player.userData.turnSpeed * player.userData.r  * Math.sin(player.userData.rotation.y);
         //   player.position.z += delta * player.userData.turnSpeed * player.userData.r  * Math.cos(player.userData.rotation.y);
            //player.position.x -= player.moveSpeed * Math.cos(player.rotation.y);
            //player.position.z += player.moveSpeed * Math.sin(player.rotation.y);
            //updatePlayerData();
            //socket.emit('updatePosition', playerData);
        }
        ;
        if (player.userData.keyState[69]) {
            // 'e' - strafe right
         //   player.position.x -= delta * player.userData.turnSpeed * player.userData.r  * Math.sin(player.userData.rotation.y);
         //   player.position.z -= delta * player.userData.turnSpeed * player.userData.r  * Math.cos(player.userData.rotation.y);
            //player.position.x += player.moveSpeed * Math.cos(player.rotation.y);
            //player.position.z -= player.moveSpeed * Math.sin(player.rotation.y);
            //updatePlayerData();
            //socket.emit('updatePosition', playerData);
        }
        ;
        //console.log('some force '+ JSON.stringify(player.getTotalForce()));

       (player.userData.mouseState[0]) ? player.actions.attack.play() : player.actions.attack.stop();
      //  (player.userData.keyState[70]) ? player.actions.wave.play() : player.actions.wave.stop();
        if (player.userData.keyState[32]) {
            console.log('pre impulse '+ JSON.stringify(player.getLinearVelocity()));
            player.applyCentralImpulse({x:0,y:3,z:0});
            console.log('post impulse '+ JSON.stringify(player.getLinearVelocity()));
         //   console.log('pre force '+ JSON.stringify(player.getTotalForce()));
         //   player.applyCentralForce({x:0,y:30,z:0});
         //   console.log('post force '+ JSON.stringify(player.getTotalForce()));
        };



  //      player.mixer.update(delta);
/*
        var moveFunc, rSign, wSign, rotSign;

        if ((player.userData.keyState[38] || player.userData.keyState[87])^(player.userData.keyState[40] || player.userData.keyState[83]) && (player.userData.keyState[37] || player.userData.keyState[65])^(player.userData.keyState[39] || player.userData.keyState[68]) )
        {
            // up arrow or 'w' - move forward  XOR // down arrow or 's' - move backward
            moveFunc = 0; //circMove
            if (player.userData.keyState[38] || player.userData.keyState[87]) {
                player.actions.run.play();
                rSign = 1;
            } else {
                player.actions.run.stop();
                rSign = -1;
            }
        } else if ((player.userData.keyState[38] || player.userData.keyState[87])^(player.userData.keyState[40] || player.userData.keyState[83]) ){
            moveFunc = 1; // linear move
            if ((player.userData.keyState[38] || player.userData.keyState[87])){
                rSign = 1;
                player.actions.run.play();
                player.userData.moveXZ(delta,rSign,wSign,moveFunc)


            } else {
                rSign = -1;
                player.actions.run.stop();
                player.userData.moveXZ(delta,rSign,wSign,moveFunc)
            }
        } else if ((player.userData.keyState[37] || player.userData.keyState[65])^(player.userData.keyState[39] || player.userData.keyState[68])){
            moveFunc = 2; // simple rotation

            if (player.userData.keyState[37] || player.userData.keyState[65]){
                wSign = 1;
                player.userData.moveXZ(delta,rSign,wSign,moveFunc);

            } else {
                wSign = -1;
                player.userData.moveXZ(delta,rSign,wSign,moveFunc);

            }

        }
        */
/*
        if ((player.userData.keyState[37] || player.userData.keyState[65])^(player.userData.keyState[39] || player.userData.keyState[68])){
            isRot = true;
            if (player.userData.keyState[37] || player.userData.keyState[65]){
                rotSign = 1;
            } else rotSign = -1;
        };
        */
/*
            player.actions.run.play();

            var moveSign = 1;
            var isRot =
*
/*
            var delta = 0.1
            player.userData.rotation.y += delta * player.userData.turnSpeed;
            player.position.x -= delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);
            player.position.z += delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);
            console.log(player.position.x + ' '+ delta)

            player.userData.rotation.y += delta * player.userData.turnSpeed;
            player.position.x -= delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);
            player.position.z += delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);
            console.log(player.position.x + ' '+ delta)

            player.userData.rotation.y += delta * player.userData.turnSpeed;
            player.position.x -= delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);
            player.position.z += delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);
            console.log(player.position.x + ' '+ delta)
            throw(err);
*/


//            player.userData.moveXZ(delta, 1, 1, true);

          //  player.applyCentralForce({x:0,y:10000,z:0});
            //var dx = - delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y)
            //var dz =   delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y)
            //var scaler = 10000;
           // player.applyCentralForce({x:dx*scaler,y:0,z:dz*scaler});
           // player.setLinearVelocity({x: - player.userData.moveSpeed * Math.cos(player.userData.rotation.y),y:player._physijs.linearVelocity.y, z: player.userData.moveSpeed * Math.sin(player.userData.rotation.y)})
           // player.applyCentralImpulse({x:dx*scaler,y:0,z:dz*scaler});

           /*
            var delta = 0.1

            player.position.x -=   player.userData.moveSpeed * Math.cos(player.rotation.y + delta * player.userData.turnSpeed);  //DO NOT USE PLAYER.ROTATION ITS NOT LINKED!!!
            player.position.z +=  player.userData.moveSpeed * Math.sin(player.rotation.y + delta * player.userData.turnSpeed);
            player.userData.rotation.y += delta * player.userData.turnSpeed

            player.position.x -=   player.userData.moveSpeed * Math.cos(player.rotation.y + delta * player.userData.turnSpeed);  //DO NOT USE PLAYER.ROTATION ITS NOT LINKED!!!
            player.position.z +=  player.userData.moveSpeed * Math.sin(player.rotation.y + delta * player.userData.turnSpeed);
            player.userData.rotation.y += delta * player.userData.turnSpeed


            player.position.x -=   player.userData.moveSpeed * Math.cos(player.rotation.y + delta * player.userData.turnSpeed);  //DO NOT USE PLAYER.ROTATION ITS NOT LINKED!!!
            player.position.z +=  player.userData.moveSpeed * Math.sin(player.rotation.y + delta * player.userData.turnSpeed);
            player.userData.rotation.y += delta * player.userData.turnSpeed

*/
/*
            player.userData.rotation.y += delta * player.userData.turnSpeed
            player.position.x -= delta * player.userData.moveSpeed * Math.cos(player.userData.rotation.y);  //DO NOT USE PLAYER.ROTATION ITS NOT LINKED!!!
            player.position.z += delta * player.userData.moveSpeed * Math.sin(player.userData.rotation.y);
*/
         //   console.log(' player.position.x ' + player.position.x + ' player.position.z ' + player.position.z)
          //  throw ('err');


   //     } else {
   //         player.actions.run.stop()
   //         player.setLinearVelocity({x:0,y:player._physijs.linearVelocity.y,z:0});
   //     }
   //     ;

/*
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
        //    player.setAngularVelocity({x:0,y: -player.userData.turnSpeed,z:0});


        //    player.setLinearVelocity({x: - player.userData.moveSpeed * Math.cos(player.getAngularVelocity().y*delta),y:player._physijs.linearVelocity.y, z: player.userData.moveSpeed * Math.sin(player.getAngularVelocity().y*delta)})

            //console.log('player.rotation.y '+ player.rotation.y+ ' player.getAngularVelociry().y '+player.getAngularVelocity().y + ' player.position.x '+player.position.x + ' player.getLinearVelocity().x ' + player.getLinearVelocity().x );
        //    player.parent.setFixedTimeStep(0.01);
        //    player.parent.simulate(0.01);

        //    console.log('player.rotation.y '+ player.rotation.y+ ' player.getAngularVelociry().y '+player.getAngularVelocity().y + ' player.position.x '+player.position.x + ' player.getLinearVelocity().x ' + player.getLinearVelocity().x );

         //   player.setLinearVelocity({x: - player.userData.moveSpeed * Math.cos(player.getAngularVelocity().y*delta),y:player._physijs.linearVelocity.y, z: player.userData.moveSpeed * Math.sin(player.getAngularVelocity().y*delta)})
         //   player.parent.setFixedTimeStep(0.01);
         //   player.parent.simulate(0.01);
         //   console.log('player.rotation.y '+ player.rotation.y+ ' player.getAngularVelociry().y '+player.getAngularVelocity().y + ' player.position.x '+player.position.x + ' player.getLinearVelocity().x ' + player.getLinearVelocity().x );
         //   player.setLinearVelocity({x: - player.userData.moveSpeed * Math.cos(player.getAngularVelocity().y*delta),y:player._physijs.linearVelocity.y, z: player.userData.moveSpeed * Math.sin(player.getAngularVelocity().y*delta)})
         //   player.parent.setFixedTimeStep(0.01);
         //   player.parent.simulate(0.01);
         //   console.log('player.rotation.y '+ player.rotation.y+ ' player.getAngularVelociry().y '+player.getAngularVelocity().y + ' player.position.x '+player.position.x + ' player.getLinearVelocity().x ' + player.getLinearVelocity().x );

           // throw ('err');
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


*/
        /*
        player.userData.moveXZ(1 , 1, 1, 1);
        console.log(player.position)
        player.userData.moveXZ(1 , 1, 1, 1);
        console.log(player.position)
        player.userData.moveXZ(1 , 1, 1, 1);
        console.log(player.position)
        player.userData.moveXZ(1 , 1, 1, 1);
        throw (err);
*/
        player.mixer.update(delta);


    };

    return checkKeyStates;


}));