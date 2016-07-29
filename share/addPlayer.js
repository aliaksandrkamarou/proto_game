/**
 * Created by a_komarov on 09.07.2016.
 */
(function (root, factory) {

  if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
      module.exports = factory(require('three'),require('../lib/physi'),require('./Player'));
    } else {
        // Browser globals (root is window)
        root.addPlayer = factory(root.THREE, root.Physijs, root.Player);
    }
}(this, function (THREE, Physijs, Player)

{
    'use strict';



function addPlayer (data, geometryTemplate, materialTemplate, scene, objects, players, isPhysics) {


    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        morphTargets: true,
        vertexColors: THREE.FaceColors,
        shading: THREE.FlatShading
    });

 //   var material = new THREE.MultiMaterial( materialTemplate);


   // var pMaterial = new Physijs.


    // geometryTemplate.scale(2,2,2);
    // geometryTemplate.verticesNeedUpdate = true;

    //  geometryTemplate.scale(.02,.02,.02);
   var pMaterial  = Physijs.createMaterial(material, 0.01,0.01);


    //   var playerMesh =   new THREE.Mesh(geometryTemplate, material);//new physijs.Convex(geometryTemplate, material) //  ;//  //
    var playerMesh = isPhysics ? new Physijs.CapsuleMesh(geometryTemplate, pMaterial/* , 1*/): new THREE.Mesh(geometryTemplate, material);



    playerMesh.addEventListener( 'collision', function( other_object, linear_velocity, angular_velocity ) {

        console.log('COLLISION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

        this.setLinearVelocity({x:0,y:0,z:0});  // checkkeystates + updateone player
      //  other_object.setLinearVelocity({x:0,y:0,z:0});
        console.log(this.playerId);


        // `this` is the mesh with the event listener
        // other_object is the object `this` collided with
        // linear_velocity and angular_velocity are Vector3 objects which represent the velocity of the collision
    });


    //  playerMesh.scale.set(.02,.02,.02)

    var player = new Player(playerMesh, data.playerId); // use Server socket id //


    Object.defineProperty(player, 'mixerTime', {
        get: function () {
            return playerMesh.mixer.time;
        },
        set: function (val) {
            playerMesh.mixer.time = val;
        }
    });

    Object.defineProperties(player.actions, {
        'standTime': {
            get: function () {
                return playerMesh.actions.stand.time;
            },
            set: function (val) {
                playerMesh.actions.stand.time = val;
            }
        },
        'runTime': {
            get: function () {
                return playerMesh.actions.run.time;
            },
            set: function (val) {
                playerMesh.actions.run.time = val;
            }

        },
        'attackTime': {
            get: function () {
                return playerMesh.actions.attack.time;
            },
            set: function (val) {
                playerMesh.actions.attack.time = val;
            }

        },
        'waveTime': {
            get: function () {
                return playerMesh.actions.wave.time;
            },
            set: function (val) {
                playerMesh.actions.wave.time = val;
            }

        }

    });




  //  constraint.enableAngularMotor( target_velocity, acceration_force );
  //  constraint.disableMotor();
    //physijs
    /*
    Object.defineProperty(player, '_physijs', {
        get: function () {
            return playerMesh._physijs;
        },
        set: function (val) {
            playerMesh._physijs = val;
        }
    });
*/

    /*

     // playerMesh.geometry.center();
     console.log('bbox');
     console.log(playerMesh.geometry.boundingBox);

     var hex  = 0xff0000;
     var bbox = new THREE.BoundingBoxHelper( playerMesh, hex );
     //bbox.box = playerMesh.geometry.boundingBox
     // bbox.box.setFromObject( test );
     //  bbox.updateMatrix();
     bbox.update();

     var diff_mesh_bbox = playerMesh.position.clone().sub(bbox.position);
     playerMesh.translateX( -diff_mesh_bbox.x  );
     playerMesh.translateY( -diff_mesh_bbox.y  );
     playerMesh.translateZ( -diff_mesh_bbox.z  );

     //playerMesh.geometry.translate(diff_mesh_bbox.x,diff_mesh_bbox.y,diff_mesh_bbox.z)
     // bbox.geometry.translate(-diff_mesh_bbox.x,-diff_mesh_bbox.y,-diff_mesh_bbox.z)
     // playerMesh.updateMatrix();
     // bbox.update();

     //playerMesh.position.copy(bbox.position);

     console.log('PM position '+JSON.stringify(playerMesh.position))
     console.log('bbox position '+JSON.stringify(bbox.position))
     console.log('bbox center '+JSON.stringify(bbox.box));
     //   console.log(JSON.stringify(playerMesh.userData.diff_mesh_bbox))

     bbox.name='bbox';

     var axisHelper = new THREE.AxisHelper( 5 );
     bbox.add( axisHelper );


     //  console.log(bbox);

     */

    var axisHelper = new THREE.AxisHelper( 50 );
   // playerMesh.add(axisHelper);
    scene.add(playerMesh);
    objects.push(playerMesh);
    players.push(player);
    playerMesh.setLinearFactor(new THREE.Vector3(1,1,1));
    playerMesh.setAngularFactor(new THREE.Vector3(0,0,0));
    //   scene.add( bbox );
   // playerMesh.rotation.y = Math.atan2(10,50);
    //console.log('rotation !!!!!!!!!!!!!!!!!!!!!!!'+playerMesh.rotation.y);








    /*
     var hex  = 0xff0000;
     var bbox = new THREE.BoundingBoxHelper( playerMesh, hex );
     // bbox.box.setFromObject( test );
     //  bbox.updateMatrix();
     bbox.update();



     var diff_mesh_bbox = playerMesh.position.clone().sub(bbox.position);
     playerMesh.geometry.translate(diff_mesh_bbox.x,diff_mesh_bbox.y,diff_mesh_bbox.z)


     //  console.log(JSON.stringify(test.position))
     //  console.log(JSON.stringify(bbox.position))
     //  console.log(JSON.stringify(bbox.box.center()));
     //  console.log(JSON.stringify(test.diff_mesh_bbox))

     bbox.name='bbox';







     var axisHelper = new THREE.AxisHelper( 50 );
     bbox.add( axisHelper );


     console.log(bbox);
     //  scene.add(test);
     scene.add( bbox );
     // scene.add (test);



     var bbox_body = OIMOworld.add({type:'box', size:[bbox.scale.x,bbox.scale.y,bbox.scale.z], pos:[bbox.position.x,bbox.position.y,bbox.position.z], move:true, noSleep:true, world:OIMOworld});

     bbox_body.name = 'bbox_body';
     bbox_body.allowSleep = false;



     // scene.add (test);







     //   var bbox_body = OIMOworld.add({type:'box', size:[bbox.scale.x,bbox.scale.y,bbox.scale.z], pos:[bbox.position.x,bbox.position.y,bbox.position.z], move:true, world:OIMOworld, name: 'bbox_body'});

     //  OIMObodys.push(bbox_body);
     // OIMOmeshs.push(bbox);

     //bbox.add(playerMesh);


     /*
     var playerMesh_body = OIMOworld.add({type:'box', size:[bbox.scale.x,bbox.scale.y,bbox.scale.z], pos:[bbox.position.x,bbox.position.y,bbox.position.z], move:true, world:OIMOworld,name: 'playerMesh_body',density: 5 });

     OIMObodys.push(playerMesh_body);
     OIMOmeshs.push(playerMesh);
     */




    //console.log(JSON.stringify(player));

    return player

};



    return addPlayer;
}));