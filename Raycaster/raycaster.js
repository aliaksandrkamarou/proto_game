// raycaster
'use strict';

//var mouse = new THREE.Vector2(),
var INTERSECTED;

var raycaster = new THREE.Raycaster();
var raycaster2 = new THREE.Raycaster();
var raycaster3 = new THREE.Raycaster();

/*
var origin = new THREE.Vector3(0,0.6,0);

//12
var geometry1 = new THREE.SphereGeometry( 5, 8, 8 );
var material1 = new THREE.MeshLambertMaterial( {color: 0xffff00} );
var sphere1 = new THREE.Mesh( geometry1, material1 );
sphere1.scale.set( .02, .02, .02 );
sphere1.name = 'sphere1';
sphere1.castShadow = true;

var geometry2 = new THREE.SphereGeometry( 5, 8, 8 );
var material2 = new THREE.MeshLambertMaterial( {color: 0xffffff} );
var sphere2 = new THREE.Mesh( geometry2, material2 );
sphere2.scale.set( .02, .02, .02 );
sphere2.name ='sphere2';
sphere2.castShadow = true;



var arrowHelper = new THREE.ArrowHelper();
arrowHelper.name('rayCasterArrowHelper');
*/
/*
document.addEventListener( 'mousemove', onDocumentMouseMoveRaycater, false );

function onDocumentMouseMoveRaycater( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  //  console.log('x: '+ mouse.x + ' y: '+ mouse.y)
};
*/
//&& !(intersects[0].object instanceof THREE.AxisHelper)

// CALL in RENDER Loop:
function Raycaster (camera) {


    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object  ) {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
    }


    //if(!scene.getObjectByName('sphere1')) scene.add( sphere1 );
    //sphere1.position.set(origin.x,origin.y,origin.z);

}








function Raycaster2 (camera) {

  //  console.log(JSON.stringify(camera.matrix));

  //  var mouse = new THREE.Vector2(0,0); // overrides!!!!
  //  console.log('Raycaster2 mouse');
 //   console.log(mouse);

  //  console.log('Raycaster2 camera');
  //  console.log(camera.toJSON());

    raycaster2.setFromCamera(mouse, camera);
    var intersects = raycaster2.intersectObjects(objects);  //objects is global
    if (intersects.length > 0 ) {
        if (INTERSECTED != intersects[0].object  ) {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
    }


 //   console.log('Rotation '+ (INTERSECTED ? ('object rotation ' + JSON.stringify(INTERSECTED.rotation) )  : INTERSECTED ))

    if (intersects.length > 0){
        var mouse3D = intersects[0].point;

        //console.log('intersects[0]')
       // console.log(intersects[0])
    //    console.log('mouse3D')
    //    console.log(mouse3D)
        Raycaster3(mouse3D);
        rayPlayerToMouse(mouse3D);

    }

   // if (intersects.length > 0){
   //     camera.lookAt(intersects[0].point)
   // }




}

function Raycaster3 (direction) {

    //var dirClone = direction.clone();


    var arrowHelper = scene.getObjectByName('arrowHelper');

    if(arrowHelper) {
        arrowHelper.setDirection( direction.clone().sub(new THREE.Vector3(1,1,1)).normalize()); // origin global
        arrowHelper.setLength(direction.clone().sub(new THREE.Vector3(1,1,1)).length());
    }

    var sphere1 = scene.getObjectByName('sphere1');
    if(sphere1) sphere1.position.set(direction.x, direction.y, direction.z);

 //   console.log('sphere1 position')
  //  console.log(sphere1.position)

   // raycaster3.set(THREE.Vector3(0,0,0), direction);
   // var intersects3 = raycaster3.intersectObjects(scene.children);
   // if (intersects2.length > 0) {
   //     arrowHelper.po



};



function rayPlayerToMouse(mouse3D){

    var myPlayer = g_Player;
    var line  = scene.getObjectByName('line');

    if (myPlayer && line) {
        //raycaster
        var origin = myPlayer.position;
        var direction = mouse3D.clone().sub(myPlayer.position).normalize();
        raycaster3.set(origin, direction);

        var intersects = raycaster3.intersectObjects(objects);  //objects is global
        if (intersects.length > 0 ) {
            var firstInt3D = intersects[0].point;


            var sphere2 = scene.getObjectByName('sphere2');
            if(sphere2) sphere2.position.set(firstInt3D.x, firstInt3D.y, firstInt3D.z);

            //line
            line.geometry.verticesNeedUpdate = true;
            line.geometry.vertices[0] = origin;
            line.geometry.vertices[1] = firstInt3D;


            //pain
            //console.log(intersects[0].object.name);
            if(intersects[0].object.name === 'otherPlayer' && myPlayer.userData.mouseState[0] ) {

                socket.emit('playerHit', intersects[0].object.userData.playerId)
              //  console.log('playerHit emitted for '+ intersects[0].object.userData.playerId)
               // intersects[0].object.userData.moveState.hitOnce = true; // server should update to false

                //intersects[0].object.userData.actions.painOne.play();
                //intersects[0].object.userData.actions.painOne.reset();
            };

        }




    }



}

