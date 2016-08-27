var THREE =  require('three');


/*
var loader = new THREE.ObjectLoader();

var scene = new THREE.Scene();


var camera = new THREE.PerspectiveCamera();
var objects = []; //,  raycaster, ;

var mouse = new THREE.Vector2(.5,.5);
console.log(loader.parse(camera.toJSON()));
console.log('-----------------');
console.log(camera);
*/
/**
 * create field
 */
/*
var planeGeometry = new THREE.PlaneGeometry(1000, 1000);
var planeMaterial = new THREE.MeshLambertMaterial({
    //map: THREE.ImageUtils.loadTexture('bg.jpg'),
    color: 0xffffff
});


//planeMaterial.map.repeat.x = 300;
//planeMaterial.map.repeat.y = 300;
//planeMaterial.map.wrapS = THREE.RepeatWrapping;
//planeMaterial.map.wrapT = THREE.RepeatWrapping;
var plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.rotation.x = - Math.PI / 2; // r_75
plane.castShadow = false;
plane.receiveShadow = true;
plane.name = 'plane';
scene.add(plane);
objects.push(plane);

var meshArray = [];
var geometry = new THREE.CubeGeometry(1, 1, 1);
for (var i = 0; i < 100; i++) {
    meshArray[i] = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xffffff * Math.random()}));
    meshArray[i].position.x = i % 2 * 5 - 2.5;
    meshArray[i].position.y = .5;
    meshArray[i].position.z = -1 * i * 4;
    meshArray[i].castShadow = true;
    meshArray[i].receiveShadow = true;
    meshArray[i].name='cube';
    scene.add(meshArray[i]);
    //raycaster
    objects.push(meshArray[i]);
}

*/


// raycaster


var mouse = new THREE.Vector2(), INTERSECTED;

var raycaster = new THREE.Raycaster();
var raycaster2 = new THREE.Raycaster();
var raycaster3 = new THREE.Raycaster();

/*

document.addEventListener( 'mousemove', onDocumentMouseMoveRaycater, false );

function onDocumentMouseMoveRaycater( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    console.log('x: '+ mouse.x + ' y: '+ mouse.y)
};
*/
//&& !(intersects[0].object instanceof THREE.AxisHelper)




// CALL in RENDER Loop:
function Raycaster (objects) {
    objects.forEach(function(player){



    })

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objects);
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


}





