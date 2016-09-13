
(function (root, factory) {

	if (typeof module === 'object' && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory(require('three'));
	} else {
		// Browser globals (root is window)
		root.attachHitBox = factory(root.THREE);
	}
}(this, function (THREE)

{
	'use strict';


	/// init shared data


	// material
	var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
	material.transparent = true;
	material.opacity = 0.5;
// geometry
  // head
	var headBoxGeo = new THREE.BoxGeometry( .15, .2, .22 );
		headBoxGeo.translate ( 0, .09, -0.015 );
		headBoxGeo.rotateX ( 0.35 );

	// hip
	var hipBoxGeo = new THREE.BoxGeometry( .32, .25, .26 );

	// leg high/low right/left
	var legBoxGeo = new THREE.BoxGeometry( .17, .5, .17 );
	legBoxGeo.translate ( 0, -0.24, 0 );

	// torso
	var torsoBoxGeo = new THREE.BoxGeometry( .3, .45, .2 );
	torsoBoxGeo.translate ( 0.0, 0.10, 0.03 );

	// arm low/hight left
	var armLowHighLeftGeo = new THREE.BoxGeometry( .4, .1, .1 );
	armLowHighLeftGeo.translate ( 0.15, 0.0, 0.0 );

	// arm low/hight right
	var armLowHighRightGeo = new THREE.BoxGeometry( .4, .1, .1 );
	armLowHighRightGeo.translate ( -0.15, 0.0, 0.0 );







	function attachHitBox (playerMesh, scene, visibleFlag) {

		//var isVisible = visibleFlag ||

		//visibleFlag = false;

		playerMesh.updateMatrixWorld(); // for scene.utils

		var _tempVec3 = new THREE.Vector3();


        //head
		var headBoxMesh = new THREE.Mesh( headBoxGeo, material );
		headBoxMesh.userData.isHitBox = true;
		headBoxMesh.userData.hitBoxType = 'head';
		headBoxMesh.visible = visibleFlag;
		headBoxMesh.userData.hitBoxPlayerMesh = playerMesh;

		_tempVec3.setFromMatrixPosition( playerMesh.children[0].children[0].children[0].children[0].children[0].children[0].matrixWorld  );

		headBoxMesh.position.copy(_tempVec3);
		headBoxMesh.updateMatrix();

		THREE.SceneUtils.attach ( headBoxMesh, scene, playerMesh.children[0].children[0].children[0].children[0].children[0].children[0])


		//hips
		var hipBoxMesh = new THREE.Mesh( hipBoxGeo, material );
		hipBoxMesh.userData.isHitBox = true;
		hipBoxMesh.userData.hitBoxType = 'hip';
		hipBoxMesh.visible = visibleFlag;
		hipBoxMesh.userData.hitBoxPlayerMesh = playerMesh;

		_tempVec3.setFromMatrixPosition( playerMesh.children[0].matrixWorld  );

		hipBoxMesh.position.copy(_tempVec3);
		hipBoxMesh.updateMatrix();

		THREE.SceneUtils.attach ( hipBoxMesh, scene, playerMesh.children[0]);


		// leg high right
		var legHighRBoxMesh = new THREE.Mesh( legBoxGeo, material);
		legHighRBoxMesh.userData.isHitBox = true;
		legHighRBoxMesh.userData.hitBoxType = 'leg';
		legHighRBoxMesh.visible = visibleFlag;
		legHighRBoxMesh.userData.hitBoxPlayerMesh = playerMesh;

		_tempVec3.setFromMatrixPosition( playerMesh.children[0].children[1].matrixWorld  );

		legHighRBoxMesh.position.copy(_tempVec3);
		legHighRBoxMesh.updateMatrix();

		THREE.SceneUtils.attach ( legHighRBoxMesh, scene, playerMesh.children[0].children[1])

		// leg high left
		var legHighLBoxMesh = new THREE.Mesh( legBoxGeo, material);
		legHighLBoxMesh.userData.isHitBox = true;
		legHighLBoxMesh.userData.hitBoxType = 'leg';
		legHighLBoxMesh.visible = visibleFlag;
		legHighLBoxMesh.userData.hitBoxPlayerMesh = playerMesh;

		_tempVec3.setFromMatrixPosition( playerMesh.children[0].children[2].matrixWorld  );

		legHighLBoxMesh.position.copy(_tempVec3);
		legHighLBoxMesh.updateMatrix();

		THREE.SceneUtils.attach ( legHighLBoxMesh, scene, playerMesh.children[0].children[2])

		// leg low right
		var legLowRBoxMesh = new THREE.Mesh( legBoxGeo, material);
		legLowRBoxMesh.userData.isHitBox = true;
		legLowRBoxMesh.userData.hitBoxType = 'leg';
		legLowRBoxMesh.visible = visibleFlag;
		legLowRBoxMesh.userData.hitBoxPlayerMesh = playerMesh;

		_tempVec3.setFromMatrixPosition( playerMesh.children[0].children[1].children[0].matrixWorld  );

		legLowRBoxMesh.position.copy(_tempVec3);
		legLowRBoxMesh.updateMatrix();

		THREE.SceneUtils.attach ( legLowRBoxMesh, scene, playerMesh.children[0].children[1].children[0])

		// leg low left
		var legLowLBoxMesh = new THREE.Mesh( legBoxGeo, material);
		legLowLBoxMesh.userData.isHitBox = true;
		legLowLBoxMesh.userData.hitBoxType = 'leg';
		legLowLBoxMesh.visible = visibleFlag;
		legLowLBoxMesh.userData.hitBoxPlayerMesh = playerMesh;

		_tempVec3.setFromMatrixPosition( playerMesh.children[0].children[2].children[0].matrixWorld  );

		legLowLBoxMesh.position.copy(_tempVec3);
		legLowLBoxMesh.updateMatrix();

		THREE.SceneUtils.attach ( legLowLBoxMesh, scene, playerMesh.children[0].children[2].children[0]);

		//torso
		var torsoBoxMesh = new THREE.Mesh( torsoBoxGeo, material);
		torsoBoxMesh.userData.isHitBox = true;
		torsoBoxMesh.userData.hitBoxType = 'torso';
		torsoBoxMesh.visible = visibleFlag;
		torsoBoxMesh.userData.hitBoxPlayerMesh = playerMesh;

		_tempVec3.setFromMatrixPosition( playerMesh.children[0].children[0].children[0].matrixWorld );
		torsoBoxMesh.position.copy(_tempVec3);
		torsoBoxMesh.updateMatrix();

		THREE.SceneUtils.attach ( torsoBoxMesh, scene, playerMesh.children[0].children[0].children[0]);

		//
		// arm low/hight left -- hight
		var armHighLMesh = new THREE.Mesh( armLowHighLeftGeo, material );
		armHighLMesh.userData.isHitBox = true;
		armHighLMesh.userData.hitBoxType = 'arm';
		armHighLMesh.visible = visibleFlag;
		armHighLMesh.userData.hitBoxPlayerMesh = playerMesh;

		_tempVec3.setFromMatrixPosition( playerMesh.children[0].children[0].children[0].children[0].children[1].children[0].matrixWorld );
		armHighLMesh.position.copy(_tempVec3);
		armHighLMesh.updateMatrix();

		THREE.SceneUtils.attach ( armHighLMesh, scene, playerMesh.children[0].children[0].children[0].children[0].children[1].children[0]);


		// arm low/hight left -- low
		var armLowLMesh = new THREE.Mesh( armLowHighLeftGeo, material );
		armLowLMesh.userData.isHitBox = true;
		armLowLMesh.userData.hitBoxType = 'arm';
		armLowLMesh.visible = visibleFlag;
		armLowLMesh.userData.hitBoxPlayerMesh = playerMesh;

		_tempVec3.setFromMatrixPosition( playerMesh.children[0].children[0].children[0].children[0].children[1].children[0].children[0].matrixWorld );
		armLowLMesh.position.copy(_tempVec3);
		armLowLMesh.updateMatrix();

		THREE.SceneUtils.attach ( armLowLMesh, scene, playerMesh.children[0].children[0].children[0].children[0].children[1].children[0].children[0]);


		// arm low/hight right -- hight
		var armHighRMesh = new THREE.Mesh( armLowHighRightGeo, material );
		armHighRMesh.userData.isHitBox = true;
		armHighRMesh.userData.hitBoxType = 'arm';
		armHighRMesh.visible = visibleFlag;
		armHighRMesh.userData.hitBoxPlayerMesh = playerMesh;

		_tempVec3.setFromMatrixPosition( playerMesh.children[0].children[0].children[0].children[0].children[2].children[0].matrixWorld );
		armHighRMesh.position.copy(_tempVec3);
		armHighRMesh.updateMatrix();

		THREE.SceneUtils.attach ( armHighRMesh, scene, playerMesh.children[0].children[0].children[0].children[0].children[2].children[0]);


		// arm low/hight right -- hight
		var armLowRMesh = new THREE.Mesh( armLowHighRightGeo, material );
		armLowRMesh.userData.isHitBox = true;
		armLowRMesh.userData.hitBoxType = 'arm';
		armLowRMesh.visible = visibleFlag;
		armLowRMesh.userData.hitBoxPlayerMesh = playerMesh;

		_tempVec3.setFromMatrixPosition( playerMesh.children[0].children[0].children[0].children[0].children[2].children[0].children[0].matrixWorld );
		armLowRMesh.position.copy(_tempVec3);
		armLowRMesh.updateMatrix();

		THREE.SceneUtils.attach ( armLowRMesh, scene, playerMesh.children[0].children[0].children[0].children[0].children[2].children[0].children[0]);













		//console.log('test');


		//return player

	};


	return attachHitBox;
}));