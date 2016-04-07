// raycaster


var mouse = new THREE.Vector2(), INTERSECTED;
var raycaster = new THREE.Raycaster();
/*
var origin = new THREE.Vector3(0,0.6,0);


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

document.addEventListener( 'mousemove', onDocumentMouseMoveRaycater, false );

function onDocumentMouseMoveRaycater( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    console.log('x: '+ mouse.x + ' y: '+ mouse.y)
};



// CALL in RENDER Loop:
function Raycaster (camera) {


    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object  && !(intersects[0].object instanceof THREE.AxisHelper)) {
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

    var dist = new THREE.Vector3(mouse.x, mouse.y, 0.5 ).unproject( camera ).sub(origin);//.normalize();

    console.log (new THREE.Vector3(mouse.x, mouse.y, 0.5 ).unproject( camera )).sub(origin);
    raycaster.set(origin, dist);
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object
            && !(intersects[0].object instanceof THREE.AxisHelper)
            && !(intersects[0].object instanceof THREE.ArrowHelper))  {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
    }



    if(!scene.getObjectByName('sphere1')) scene.add( sphere1 );
    sphere1.position.set(origin.x,origin.y,origin.z);


    if(!scene.getObjectByName('sphere2')) scene.add( sphere2 );
    sphere2.position.set(dist.x,dist.y,dist.z);


};