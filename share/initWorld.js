/**
 * Created by a_komarov on 18.06.2016.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define( factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('three'),require('../lib/physi.js'),require('../lib/oimo'));
    } else {
        // Browser globals (root is window)
        root.initWorld = factory(root.THREE, root.Physijs, root.OIMO)
    }
}(this, function (THREE, Physijs, OIMO) {
    'use strict';



function initWorld () {
    var scene = new Physijs.Scene({fixedTimeStep: 0.001 });
  //  scene.setGravity(0,50,0);
  //  var scene = new THREE.Scene();

 /*
    var OIMOworld = new OIMO.World(1/180, 2, 8);

    var geos = {};
    //geos
    geos['sphere'] = new THREE.BufferGeometry().fromGeometry( new THREE.SphereGeometry(1,16,10));
    geos['box'] = new THREE.BufferGeometry().fromGeometry( new THREE.BoxGeometry(1,1,1));
    geos['cylinder'] = new THREE.BufferGeometry().fromGeometry(new THREE.CylinderGeometry(1,1,1));

    var mats = {};
    // materials
    var materialType = 'MeshLambertMaterial';
    mats['sph']    = new THREE[materialType]( {name:'sph' } );
    mats['box']    = new THREE[materialType]( { name:'box' } );
    mats['cyl']    = new THREE[materialType]( { name:'cyl' } );
    mats['ssph']   = new THREE[materialType]( { name:'ssph' } );
    mats['sbox']   = new THREE[materialType]( { name:'sbox' } );
    mats['scyl']   = new THREE[materialType]( { name:'scyl' } );
    mats['ground'] = new THREE[materialType]( {color:0x3D4143, transparent:true, opacity:0.5 } );

    var grounds = [];
    //add ground
 //   var ground0 = world.add({size:[40, 40, 390], pos:[-180,20,0], world:world});
  //  var ground1 = world.add({size:[40, 40, 390], pos:[180,20,0], world:world});
    var ground2 = OIMOworld.add({size:[400, 1, 400], pos:[0,0,0], world:OIMOworld});

    addStaticBox([400, 1, 400], [0,0,0], [0,0,0]);


    function addStaticBox(size, position, rotation) {
        var mesh = new THREE.Mesh( geos.box, mats.ground );
        mesh.scale.set( size[0], size[1], size[2] );
        mesh.position.set( position[0], position[1], position[2] );
        mesh.rotation.set( rotation[0], rotation[1], rotation[2] );
        scene.add( mesh );
        grounds.push(mesh);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
    }
    */

    var planeGeometry = new THREE.PlaneGeometry(1000 / 0.02, 1000 / 0.02);
    planeGeometry.rotateX ( -Math.PI / 2 );
    var planeMaterial = new THREE.MeshLambertMaterial({
     //   map: THREE.ImageUtils.loadTexture('bg.jpg'),
        color: 0xffffff

    });

    var pMaterial = Physijs.createMaterial(planeMaterial, 0.1,0.1)


 //   planeMaterial.map.repeat.x = 300;
 //   planeMaterial.map.repeat.y = 300;
 //   planeMaterial.map.wrapS = THREE.RepeatWrapping;
 //   planeMaterial.map.wrapT = THREE.RepeatWrapping;
//   var plane = new THREE.Mesh(planeGeometry, planeMaterial); // new physijs.Plane(planeGeometry, planeMaterial);  //

  var plane =  new Physijs.BoxMesh(
        new THREE.BoxGeometry(1000 / 0.02, 1, 1000 / 0.02),
        planeMaterial,
        0 )// mass

   // plane.rotation.set(  -Math.PI / 2,0, 0 );// = -Math.PI / 2; // r_76
   // plane.updateMatrix();
  //  plane.__dirtyRotation = true;
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.name = 'plane';
    scene.add(plane);
//  objects.push(plane);







    var meshArray = [];
//    var bodys =[];
   var geometry = new THREE.CubeGeometry(50, 50, 50);
//geometry.scale(2,2,2);
    var w, h, d;
    var x, y, z;
    w=1; h= 1; d=1

    //bodys[i] = world.add({type:'box', size:[w,h,d], pos:[x,y,z], move:true, world:world});
    //meshs[i] = new THREE.Mesh( geos.box, mats.box );
    //meshs[i].scale.set( w, h, d );


    for (var i = 0; i < 10; i++) {
    //    meshArray[i] = new Physijs.BoxMesh(geometry, new THREE.MeshLambertMaterial({color: 0xffffff * Math.random()}), 1);
        meshArray[i] = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xffffff * Math.random()})); // new physijs.Box(geometry, new THREE.MeshLambertMaterial({color: 0xffffff * Math.random()}),{mass:1});//

        x = i % 2 * 5 * 50 - 2.5 * 50;
        y = 0;//5.5 *50;
        z = -1 * i * 4 * 50;
        meshArray[i].position.set(x,y,z);
        meshArray[i].scale.set( w, h, d );
      //  bodys[i] = OIMOworld.add({type:'box', size:[w,h,d], pos:[x,y,z], move:true,noSleep:true, world:OIMOworld});

        meshArray[i].castShadow = true;
        meshArray[i].receiveShadow = true;
        meshArray[i].name = 'cube';
        scene.add(meshArray[i]);
        //raycaster
        //objects.push(meshArray[i]);
    }





    return {scene: scene /*, OIMOworld: OIMOworld, bodys: bodys*/, meshs: meshArray}
}


    return initWorld;



}));