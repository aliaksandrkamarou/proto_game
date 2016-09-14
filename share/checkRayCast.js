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
        root.checkRayCast = factory(root.THREE);
    }
}(this, function (THREE) {
    'use strict';


    var checkRayCast = function (caster, scene) {


    var player = caster.userData;
    var mouse = caster.userData.mouse2D;
    var camera = caster.userData.camera;
    var raycaster = caster.raycaster;
    var raycaster2 = caster.raycaster2;
    var INTERSECTED = scene.getObjectById(player.intersected_scene_id); //TODO: exclude light from intersection
    var origin = new THREE.Vector3().setFromMatrixPosition(caster.children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].children[0].matrixWorld)//.clone().add(new THREE.Vector3(0,1.5,0)) ;


    raycaster.setFromCamera({x:0,y:0.4}/*player.mouse2D*/, player.camera);

       // console.log(player.mouse2D)

    //console.log(INTERSECTED);
    //console.log(mouse);
    // console.log(camera);
    // console.log(scene.children)

       var  fromCamera =player.raySpheres.fromCamera
       var  fromOrigin = player.raySpheres.fromOrigin




        var intersects = raycaster.intersectObjects(scene.children); // TODO: SERVER/CLIENT logic should e the same server: intersectObjects(scene.children)

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
         //   if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
         //   INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex(); // TODO: get rid of currentHex it -- it looks artificial
         //   INTERSECTED.material.emissive.setHex(0xff0000);

            player.intersected_scene_id = INTERSECTED.id; // got new id back
            console.log('cast on '+INTERSECTED.name );
            fromCamera = intersects[0].point

        }

    //   console.log( intersects[0].point)


  //    intersects[0].point

        ////if we have ray from camera we can do second raycast
        var dirFromOrigin = intersects[0].point.clone().sub(origin).normalize();

        raycaster2.set(origin,dirFromOrigin,0.1);

        var intersects2 = raycaster2.intersectObjects(scene.children)

        if (intersects2.length > 0) {

            fromOrigin = intersects2[0].point

         //   player.raySpheres = {origin :origin ,fromCamera :intersects[0].point, fromOrigin: intersects2[0].point}

        }







    } else {
      //  if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
    }

        player.raySpheres = {origin :origin ,fromCamera :fromCamera, fromOrigin: fromOrigin}


//////////////////////// 2


       // this.ray.direction.set( coords.x, coords.y, 0.5 ).unproject( camera ).sub( this.ray.origin ).normalize();

      //  var dist = new THREE.Vector3(mouse.x, mouse.y, 0.5 ).unproject( camera ).sub(origin).normalize();
//      console.log(new THREE.Vector3(mouse.x, mouse.y, 0.5 ))
//       console.log (new THREE.Vector3(mouse.x, mouse.y, 0.5 ).unproject( camera ))//.sub(origin));
//        player.rayLine = {start :origin ,end :new THREE.Vector3(mouse.x, mouse.y, 0.5 ).unproject( camera ).sub(origin)/*intersects[0].point*/}
       // raycaster.set(origin, dist);
      /*
        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            if (INTERSECTED != intersects[0].object)
            {

                INTERSECTED = intersects[0].object;
                console.log('intersect ' + INTERSECTED.name +  ' '+ JSON.stringify(intersects[0].point) )


                //INTERSECTED.currentColor = INTERSECTED.material.color.getHex() // = new THREE.Color( 0xffffff)
               // INTERSECTED.material.color.setHex( 0xff0000)
            }
         //   player.rayLine = {start :origin ,end :new THREE.Vector3(mouse.x, mouse.y, 0.5 ).unproject( camera )}
        } else {
            //if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentColor);
            INTERSECTED = null;
        }

*/

       // if(!scene.getObjectByName('sphere1')) scene.add( sphere1 );
       // sphere1.position.set(origin.x,origin.y,origin.z);


        //if(!scene.getObjectByName('sphere2')) scene.add( sphere2 );
        //sphere2.position.set(dist.x,dist.y,dist.z);












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