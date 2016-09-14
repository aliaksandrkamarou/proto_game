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
        root.cameraControl = factory(root.THREE);
    }
}(this, function (THREE) {
    'use strict';



function cameraControl (player) {
    if(!player.userData.isCameraFollow) return ;
/*
    if(!player.userData.isCameraFollow) return ;


    var camera = player.userData.camera;


    var angle = new THREE.Euler().setFromQuaternion(player.userData.quaternion, 'YZX', false );



    camera.position.x =  player.position.x + player.userData.playerCameraDist.distance *  (Math.sin( angle.y + Math.PI/1.2  ));
    camera.position.z =  player.position.z  + player.userData.playerCameraDist.distance * Math.cos(angle.y   + Math.PI/1.2 );

   // console.log('roy y '+player.rotation.y + 'cos y ' + Math.cos( (player.rotation.y)  ) + 'sin y '+  Math.sin( player.rotation.y  ) )

    //camera rotate y
    //camera.position.x = player.position.x + player.camera.distance * Math.cos( (player.camera.y) * Math.PI / 360 );
    camera.position.y = player.position.y + player.userData.playerCameraDist.distance * Math.sin( (player.userData.playerCameraDist.y) * Math.PI / 360 ) + 0.5;

    var lookVec = player.position.clone()

    //var vec = player.position.clone().sub(camera.position);
 //   lookVec.applyAxisAngle(new THREE.Vector3( 0, 1, 0 ), -Math.PI/2 )
   // vec.applyAxisAngle(new THREE.Vector3( 0, 1, 0 ), -Math.PI/2 )
   // lookVec.y = camera.position.y
  //  lookVec.x += (Math.sin( angle.y + Math.PI  ))
  //  lookVec.z += Math.cos(angle.y + Math.PI);
    camera.lookAt(lookVec)
   // camera.lookAt(vec)

    //camera.lookAt(new THREE.Vector3(0, 0, -1 ).applyQuaternion( camera.quaternion ).add( camera.position ));
    //camera.quaternion.copy(player.quaternion)
 player
*/
    //    var relativeCameraOffset = new THREE.Vector3(.3,1.1,-1.9);
    //var targetCameraOffset = new THREE.Vector3(.3,.7,0);

    player.updateMatrixWorld();
    var relativeCameraOffset = new THREE.Vector3(.3,1.,-1.9);
    var targetCameraOffset = new THREE.Vector3(.3,.6,0);
    var cameraOffset = relativeCameraOffset.applyMatrix4( player.matrixWorld );
    var targetOffset =targetCameraOffset.applyMatrix4( player.matrixWorld );

    player.userData.camera.position.x = cameraOffset.x;
    player.userData.camera.position.y = cameraOffset.y;
    player.userData.camera.position.z = cameraOffset.z;


  //  cameraOffset.distanceTo(player.position)*Math.cos(Math.Pi/4);







   // var lookVec = player.position.clone()
   //  lookVec.y = cameraOffset.y
   //  lookVec.setX(1)// += Math.sin(Math.PI/2)// cameraOffset.x
   // lookVec.z -= Math.cos(Math.PI/2)//cameraOffset.z
    player.userData.camera.lookAt( targetOffset );



};

    return cameraControl;

}));