/**
 * Created by a_komarov on 26.06.2016.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define( factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.updateOimoPhysics = factory();
    }
}(this, function ()
{
'use strict';

function updateOimoPhysics(OIMOworld, bodys, meshs) {
    if (OIMOworld == null) return;

    var n = bodys.length;
/*
    while(   n--){
        body = bodys[n];
        mesh = meshs[n];
      //  body.setPosition(mesh.position);
        body.setRotation(mesh.rotation);

    }
*/
    OIMOworld.step();



    var bound = OIMOworld.getByName('bbox_body');
    var bbox = scene.getObjectByName('bbox');
    var test = scene.getObjectByName(g_Player.playerId);

    // console.log(bound.getSleep());

    console.log(test);


    if(bound && bbox && test ) {
        /*
         bbox.position.copy(bound.getPosition());
         bbox.rotation.copy(bound.getRotation());
         bbox.updateMatrixWorld();
         test.position.copy(bound.getPosition()); //.add(test.diff_mesh_bbox);
         test.rotation.copy(bound.getRotation());
         */
        bound.setPosition(test.position); //.add(test.diff_mesh_bbox);
        bound.setQuaternion(test.quaternion);
        bbox.position.copy(bound.getPosition());
        bbox.rotation.copy(bound.getRotation());
        bbox.updateMatrixWorld();
        bound.allowSleep = false;
        //bbox.update();


    }



    // apply new position on last rigidbody
 //   bodys[bodys.length-1].setPosition(meshs[meshs.length-1].position);

    //paddel.lookAt(new THREE.Vector3(100,paddel.position.y, 0));
   // paddel.rotation.y += 90*ToRad;

    // apply new rotation on last rigidbody
   // bodys[bodys.length-1].setQuaternion(meshs[meshs.length-1].quaternion);

/*


    var bound = world.getByName('bbox_body');
    var bbox = scene.getObjectByName('bbox');
    var test = scene.getObjectByName('test');
    if (bound && bbox && test) {
        bbox.position.copy(bound.getPosition());
        bbox.rotation.copy(bound.getRotation());
        bbox.updateMatrixWorld();
        test.position.copy(bound.getPosition()); //.add(test.userData.diff_mesh_bbox);
        test.rotation.copy(bound.getRotation());

    }
*/

    var x, y, z, mesh, body, i = bodys.length ;

    while (i--) {
        body = bodys[i];
        mesh = meshs[i];

        if (!body.sleeping) {

            mesh.position.copy(body.getPosition());
            //mesh.quaternion.copy(body.getQuaternion());
            mesh.rotation.copy(body.getRotation());

            // change material
            //if (mesh.material.name === 'sbox') mesh.material = mats.box;
            //if (mesh.material.name === 'ssph') mesh.material = mats.sph;
            //if (mesh.material.name === 'scyl') mesh.material = mats.cyl;

            // reset position
            if (mesh.position.y < -100) {
                x = -100 + Math.random() * 200;
                z = -100 + Math.random() * 200;
                y = 100 + Math.random() * 1000;
                body.resetPosition(x, y, z);
            }
        } else {
            //if (mesh.material.name === 'box') mesh.material = mats.sbox;
            //if (mesh.material.name === 'sph') mesh.material = mats.ssph;
            //if (mesh.material.name === 'cyl') mesh.material = mats.scyl;
        }
    }

}

    return updateOimoPhysics;

}));