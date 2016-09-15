(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['three'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('three'));
    } else {
        // Browser globals (root is window)
        root.Player = factory(root.THREE);
    }
}(this, function (THREE) {
    'use strict';

    function Player(mesh, id) {

        mesh.userData = this


        this.playerId = id; // const!!!!!
        mesh.name = mesh.playerId = this.playerId;


        this.position = mesh.position; // link
        this.position.set(0, 2, 0); // set


        this.rotation = mesh.rotation// new THREE.Euler();     // DO NOT LINK IT TO  mesh.rotation since scene.updateMatrixWorld() uses it somehow
        this.rotation.set(0, 0, 0, 'YZX'); // YZX set



        this.quaternion = mesh.quaternion; //link


        this.scale = mesh.scale//link
        //this.scale.set(0.02, 0.02, 0.02); //set

        this.camera = new THREE.PerspectiveCamera(); //to be updated from player's side
        //mesh.add(this.camera)
        this.camera.position.set(2, 4, 7);
        this.camPos = this.camera.position
        // this.camera.aspect = 0.5;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.cameraJSON = this.camera.toJSON();
        this.playerCameraDist = {
            distance: 3, //5
            x: 0, // angle?
            y: 0,
            z: 0,
            lastY: 0
        };
        this.isCameraFollow = false||true;


        var durationCoof = 2;

        this.keyState = []//{};
        this.keyStateHitOnce = [];
        this.mouseState = {};
        this.moveSpeed = 100;
        this.turnSpeed = 4.2*Math.PI * (1/durationCoof);

        //this.showHitBox = true;

        this.moveState = {

            hitOnce: false,
            isRunning : false
        };

        this.mouse2D = new THREE.Vector2();


        mesh.raycaster = new THREE.Raycaster();//TODO: remove from client side
        mesh.raycaster.linePrecision = 0; // do NOT try to interact with lines

        mesh.raycaster2 = new THREE.Raycaster();//TODO: remove from client side
        mesh.raycaster2.linePrecision = 0; // do NOT try to interact with lines


        mesh.mixer = new THREE.AnimationMixer(mesh);




        mesh.actions = {
            attack: mesh.mixer.clipAction(mesh.geometry.animations[0]),
            stand: mesh.mixer.clipAction(mesh.geometry.animations[1]),
            run: mesh.mixer.clipAction(mesh.geometry.animations[2]),
            back: mesh.mixer.clipAction(mesh.geometry.animations[3]),
      //    painOne: mesh.mixer.clipAction(mesh.geometry.animations[3]), // turn left
     //     wave: mesh.mixer.clipAction(mesh.geometry.animations[10]) // turn right
            turnL: mesh.mixer.clipAction(mesh.geometry.animations[4]).setDuration(durationCoof),
            turnR: mesh.mixer.clipAction(mesh.geometry.animations[5]).setDuration(durationCoof),
            action1: mesh.mixer.clipAction(mesh.geometry.animations[6]),
            action2: mesh.mixer.clipAction(mesh.geometry.animations[7])

                // jump up
            // jump loop
            // jump down
            // walk left
            // walk right
            // f_left
            // f_right
            // b_left
            // b_right
            //looking
            // charge
            // ganggam

        };

       // mesh.actions.action1.play();


        // this.actions = {};

        this.actions = {
            standTime: mesh.actions.stand.time,
            runTime: mesh.actions.run.time,
            backTime: mesh.actions.back.time,
            attackTime: mesh.actions.attack.time,
            turnLTime: mesh.actions.turnL.time,
            turnRTime: mesh.actions.turnR.time,
            action1Time: mesh.actions.action1.time,
            action2Time: mesh.actions.action2.time
       //     painOneTime: mesh.actions.painOne.time,
         //   waveTime: mesh.actions.wave.time

        };

        this.mixerTime = undefined; // sockets BUG?


        this.intersected_scene_id = undefined;
        this.intersected2_scene_id = undefined;

        this.pending_inputs = [];

        this.ts_client = 0;
        this.ts_server = -1;

        this.last_client_delta = 0;
        mesh.phyDelayReminder = 0;

        this.raySpheres = {origin :new THREE.Vector3() ,fromCamera :new THREE.Vector3(), fromOrigin: new THREE.Vector3()}


        this.serverLastSentTime = undefined;
        this.needServerUpdate = false;

      //  this.ts_interpol = 0;
        this.totalNumberSteps = 0;

        this.ts_render = undefined;
        this.ts = undefined;


        //interpolation
        this.pending_server_hist = [];

        this.local_timer = undefined;


        //physijs
        this._physijs = mesh._physijs;
      //  this.setLinearVelocity = mesh.setLinearVelocity;


        //

        this.timeReminder = 0;
        this.numberSteps = 0;





        //
        this.r =  7.3 * durationCoof;



        ///


        //this.delta_dept = 0;
/*
        this.moveXZ = function(delta, rSign, wSign, moveFunc){
        //moveFunc: 0 - circMove, 1-linMove, 2 - rotation

            if (moveFunc == 0) {


                this.originX = this.position.x + this.r  * Math.cos(this.rotation.y + rSign * ( Math.PI / 2));
                this.originZ = this.position.z + this.r  * Math.sin(this.rotation.y + rSign *( Math.PI / 2));

                var rx = this.position.x - this.originX;
                var rz = this.position.z - this.originZ;

                var c =  Math.cos(delta * this.turnSpeed * wSign);
                var s =  Math.sin(delta * this.turnSpeed * wSign);




                // var vx = rx * c - rz * s;
                // var vz = rx * s + rz * c;



                this.position.setX (this.originX + rx * c - rz * s);
                this.position.setZ (this.originZ + rx * s + rz * c);


                this.rotation.set ( this.rotation.x,  this.rotation.y + delta * this.turnSpeed * wSign,this.rotation.z)//TEST +=
                // console.log(this.rotation.y +' '+7*Math.PI/4);
                //console.log(this)
            }else if (moveFunc == 1) {
                this.position.setX(this.position.x + rSign * this.r * this.turnSpeed * delta * Math.cos ( this.rotation.y))
                this.position.setZ(this.position.z + rSign * this.r * this.turnSpeed * delta * Math.sin ( this.rotation.y))
                //console.log(this)

            }else if (moveFunc == 2){
                this.rotation.set( this.rotation.y + wSign * this.turnSpeed * delta,this.rotation.z, this.rotation.x)
                //console.log(this)

            }

        };*/

    };
/*

    Player.prototype.moveXZ = function (delta) {



        var angle = this.turnSpeed * delta;

        var point = this.rotation;

        var center = {
            x: Math.sin(this.rotation.y)*this.r+this.position.x,
            z: Math.cos(this.rotation.y)*this.r+this.position.z
        }


        //angle = (angle ) * (Math.PI/180); // Convert to radians
        var rotatedX = Math.cos(angle) * (point.x - center.x) - Math.sin(angle) * (point.z - center.z) + center.x;
        var rotatedZ = Math.sin(angle) * (point.x - center.x) + Math.cos(angle) * (point.z - center.z) + center.z;
        this.position.setX(rotatedX)
        this.position.setZ(rotatedZ)
       // console.log(delta);



        this.rotation.set(this.rotation.x,this.rotation.y+ angle,this.rotation.z);

    };


*/


    return Player


}));



