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
        this.position.set(0, 100, 0); // set


        this.rotation = mesh.rotation// new THREE.Euler();     // DO NOT LINK IT TO  mesh.rotation since scene.updateMatrixWorld() uses it somehow
        this.rotation.set(0, 0, 0, 'YZX'); // set

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
            distance: 200, //5
            x: 0, // angle?
            y: 30,
            z: 0
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

    return Player


}));