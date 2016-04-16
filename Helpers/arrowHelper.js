
var dir = new THREE.Vector3( 2, 2, 2).normalize();
var origin = new THREE.Vector3( 1, 1, 1 );
var length = 1;
var hex = 0xffff00;

var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
scene.add( arrowHelper );