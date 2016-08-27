

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define( factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('three'));
    } else {
        // Browser globals (root is window)
        root.initWorld = factory(root.THREE)
    }
}(this, function (THREE) {
    'use strict';

    var jsonLoader = new THREE.JSONLoader();

    function initGeoMat () {


        jsonLoader.load('../models/animated/monster/untitled_io.json',function(geometry, materials){

            materials.forEach(function(material){
                material.skinning = true;
            })

            return {geometryTemplate: geometry,
            multiMaterialTemplate: materals} ;

          //  var multiMaterial = new THREE.MultiMaterial(materials);


            /*
            var mesh = new THREE.SkinnedMesh( geometry, multiMaterial);

            mixer = new THREE.AnimationMixer( mesh );

            mixer.clipAction(mesh.geometry.animations[1]).play();
            var cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
            var cubeMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            cubeMaterial.transparent = true;
            cubeMaterial.opacity = 0.5;

            //cubeMaterial.dynamic = true;
            //cubeMaterial.skinning = true;

            cube = new THREE.Mesh( cubeGeometry, cubeMaterial );

            //cube.updateMatrix();
            //cube.updateMatrixWorld();

            cube.position.copy(mesh.children[0].position);
            cube.updateMatrix();
            //cube.updateMatrixWorld();



            THREE.SceneUtils.attach ( cube, scene, mesh.children[0] )

            scene.add(mesh);

            //helper = new THREE.SkeletonHelper( mesh );

            //scene.add(helper);




            //scene.add(cube);



*/



        })



    }


   return initGeoMat;



}));