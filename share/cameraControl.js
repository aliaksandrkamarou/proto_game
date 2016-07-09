(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['three'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.cameraControl = factory();
    }
}(this, function () {
    'use strict';



function cameraControl (player) {

    if(!player.userData.isCameraFollow) return ;
    var camera = player.userData.camera;



    camera.position.x =  player.position.x + player.userData.playerCameraDist.distance *  (Math.cos( player.rotation.y ));
    camera.position.z =  player.position.z  - player.userData.playerCameraDist.distance * Math.sin( player.rotation.y  );

   // console.log('roy y '+player.rotation.y + 'cos y ' + Math.cos( (player.rotation.y)  ) + 'sin y '+  Math.sin( player.rotation.y  ) )

    //camera rotate y
    //camera.position.x = player.position.x + player.camera.distance * Math.cos( (player.camera.y) * Math.PI / 360 );
    camera.position.y = player.position.y + player.userData.playerCameraDist.distance * Math.sin( (player.userData.playerCameraDist.y) * Math.PI / 360 );



    camera.lookAt(player.position);



};

    return cameraControl;

}));