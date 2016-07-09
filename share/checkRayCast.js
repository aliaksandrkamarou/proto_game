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
        root.checkRayCast = factory();
    }
}(this, function () {
    'use strict';


    var checkRayCast = function (object, scene) {


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

    return checkRayCast;

}));