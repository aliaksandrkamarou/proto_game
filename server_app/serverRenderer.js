var THREE = require('three');
var fs = require('fs');

var scene = new THREE.Scene();

var loader = new THREE.JSONLoader();

var droid;



fs.readFile('c:/proto_game/client_app/droid.js', 'utf-8', function (err, content) {
    if (err) console.log(err);


    var jsonContent = JSON.parse(content);

    //console.log( loader.parse(jsonContent).geometry);
    var geometry = loader.parse(jsonContent).geometry;

    //var g = new THREE.Geometry(geometry);
    //console.log(  g);

    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        morphTargets: true,
        vertexColors: THREE.FaceColors,
        shading: THREE.FlatShading
    });

    //scene.add (droid);
    droid = new THREE.Mesh(geometry, material);

    droid.scale.set(.2, .2, .2);

    console.log(droid);


});






//loader.load( "models/animated/flamingo.js", function( geometry )
/*loader.load("../client_app/droid.js", function (geometry) {

    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        morphTargets: true,
        vertexColors: THREE.FaceColors,
        shading: THREE.FlatShading
    });

    //var material = new THREE.MeshBasicMaterial();
    var mesh = new THREE.Mesh(geometry, material);

    //mesh.rotation.y = -Math.PI / 2;
    //mesh.position.x = - 150;
    //mesh.position.y = 150;
    mesh.scale.set(.02, .02, .02);
    mesh.position.y = .5;

    mesh.name = 'myPlayer';
    mesh.userData.playerId = data.playerId;


    mesh.userData.mixer = new THREE.AnimationMixer(mesh);
    mesh.userData.actions = {};
    mesh.userData.actions.stand = mesh.userData.mixer.clipAction(geometry.animations[0]);
    mesh.userData.actions.run = mesh.userData.mixer.clipAction(geometry.animations[1]);
    mesh.userData.actions.attack = mesh.userData.mixer.clipAction(geometry.animations[2]);

    mesh.userData.actions.painOne = mesh.userData.mixer.clipAction(geometry.animations[3]);

    mesh.userData.actions.painOne.setLoop(THREE.LoopOnce, 0);

    mesh.userData.mouseState = {};
    mesh.userData.keyState = {};
    mesh.userData.moveState = {};

    scene.add(mesh);

});

*/





/*
var geometry = new THREE.BoxGeometry(3, 3, 3);
//var material = new THREE.MeshBasicMaterial({color: 0x00fff0});

var material = new THREE.MeshPhongMaterial({
    color: 0x000fff,
    morphTargets: true,
    vertexColors: THREE.FaceColors,
    shading: THREE.FlatShading,
    transparent: true,
    opacity: 0.2

});

var cube = new THREE.Mesh(geometry, material);

scene.add(cube);

*/






//console.log(droid)
/*

var json;
var ObjectLoader =new THREE.ObjectLoader()

setInterval(function(){
    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;
    cube.position.y += 0.1;

    //console.log(scene.children[0].rotation)
    //scene.update();
    json = droid.toJSON();
    var res = ObjectLoader.parse(json);
    console.log(res.children[0].position);
 //   console.log(scene.children[0].toJSON());       //forEach(function(child){console.log(child.toJSON())});
    //console.log(json);
//    console.log('loop');
}    ,1000);
*/
/*
var render = function () {
    requestAnimationFrame( render );

    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;

    renderer.render(scene, camera);
};
*/





//module.exports.json = json;