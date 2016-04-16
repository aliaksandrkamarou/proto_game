
var THREE = require('three');
//var clock = new THREE.Clock();
var objects = [];

var players = [];

function Player(){

    this.playerId = players.length;


    this.model = {};
    this.position = {};
    this.camera = {};
 //   this.testPlayer = {};
    this.rotation = {};


//    this.model.objects = new THREE.Object3D();
    this.model.motion = 'stand';
    this.model.state = 'stand';
    this.position.x = 0;
    this.position.y = .5;
    this.position.z = 0;
   // this.position.direction = 0;
    this.camera.speed = 300;
    this.camera.distance = 5;
    this.camera.x = 0;
    this.camera.y = 0;
    this.camera.z = 0;

//
    this.keyState={};
    this.mouseState ={};
    this.moveSpeed = 0.1;
    this.turnSpeed = 0.03

    this.rotation.x = 0;
    this.rotation.y = 0;
    this.rotation.z = 0;

//  droid

    this.md2frames = {
        // first, last, fps
        stand: [0, 39, 9, {state: 'stand', action: false}],   // STAND
        run: [40, 45, 10, {state: 'stand', action: false}],   // RUN
        attack: [46, 53, 10, {state: 'stand', action: true}],   // ATTACK
        pain1: [54, 57, 7, {state: 'stand', action: true}],   // PAIN_A
        pain2: [58, 61, 7, {state: 'stand', action: true}],   // PAIN_B
        pain3: [62, 65, 7, {state: 'stand', action: true}],   // PAIN_C
        jump: [66, 71, 7, {state: 'stand', action: true}],   // JUMP
        flip: [72, 83, 7, {state: 'stand', action: true}],   // FLIP
        salute: [84, 94, 7, {state: 'stand', action: true}],   // SALUTE
        taunt: [95, 111, 10, {state: 'stand', action: true}],   // FALLBACK
        wave: [112, 122, 7, {state: 'stand', action: true}],   // WAVE
        point: [123, 134, 6, {state: 'stand', action: true}],   // POINT
        crstand: [135, 153, 10, {state: 'crstand', action: false}],   // CROUCH_STAND
        crwalk: [154, 159, 7, {state: 'crstand', action: false}],   // CROUCH_WALK
        crattack: [160, 168, 10, {state: 'crstand', action: true}],   // CROUCH_ATTACK
        crpain: [196, 172, 7, {state: 'crstand', action: true}],   // CROUCH_PAIN
        crdeath: [173, 177, 5, {state: 'freeze', action: true}],   // CROUCH_DEATH
        death1: [178, 183, 7, {state: 'freeze', action: true}],   // DEATH_FALLBACK
        death2: [184, 189, 7, {state: 'freeze', action: true}],   // DEATH_FALLFORWARD
        death3: [190, 197, 7, {state: 'freeze', action: true}],   // DEATH_FALLBACKSLOW
        //boom    : [ 198, 198,  5 ]    // BOOM
    };
    this.moveState = {


        moving: false,
        front: false,
        Backwards: false,
        left: false,
        right: false,
        speed: .1,
        angle: 0,
        hitOnce: false
    };

    this.mouse2D = {};

    this.actions = {};

    this.camera = {};




}

var addPlayer = function(id){

    var player = new Player();
    player.playerId = id;
    players.push( player );   // side effect

    return player;
};

var removePlayer = function(player){

    var index = players.indexOf(player);

    if (index > -1) {
        players.splice(index, 1);
    }
};

var updatePlayerData = function(data){
    var player = playerForId(data.playerId);
    player.x = data.x;
    player.y = data.y;
    player.z = data.z;
    player.r_x = data.r_x;
    player.r_y = data.r_y;
    player.r_z = data.r_z;

    return player;
};

var playerForId = function(id){

    var player;
    for (var i = 0; i < players.length; i++){
        if (players[i].playerId === id){

            player = players[i];
            break;

        }
    }

    return player;
};




var renderPlayers = function() {
    players.forEach(function (playerItem) {
        checkKeyStates(playerItem);
    });
//    deltaTime = clock.getDelta();
       // socket.emit('updateWorld', players) //  надо ли переносить в checkKeyStates?? !!!!!!!!!!! Или вообще на месте обрабатывать в consumer'е
}

var resetMoveStates = function(){
    players.forEach(function (playerItem) {


        playerItem.moveState = {


            moving: false,
            front: false,
            Backwards: false,
            left: false,
            right: false,
            speed: .1,
            angle: 0,
            hitOnce: false
        };
    });
}

//setInterval(renderPlayers,300)

var checkKeyStates = function(player){

    if (player.keyState[38] || player.keyState[87]) {
        // up arrow or 'w' - move forward
        player.position.x -= player.moveSpeed * Math.cos(player.rotation.y);
        player.position.z += player.moveSpeed * Math.sin(player.rotation.y);

        //player.position.x -= player.moveSpeed * Math.sin(player.rotation.y);
        //player.position.z -= player.moveSpeed * Math.cos(player.rotation.y);

        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    if (player.keyState[40] || player.keyState[83]) {
        // down arrow or 's' - move backward
        player.position.x += player.moveSpeed * Math.cos(player.rotation.y);
        player.position.z -= player.moveSpeed * Math.sin(player.rotation.y);
        //player.position.x += player.moveSpeed * Math.sin(player.rotation.y);
        //player.position.z += player.moveSpeed * Math.cos(player.rotation.y);

        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    if (player.keyState[37] || player.keyState[65]) {
        // left arrow or 'a' - rotate left
        !(player.keyState[40] || player.keyState[83]) ? player.rotation.y += player.turnSpeed : player.rotation.y -= player.turnSpeed ; // switch for backward
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    if ((player.keyState[39] || player.keyState[68])) {
        // right arrow or 'd' - rotate right
        !(player.keyState[40] || player.keyState[83]) ? player.rotation.y -= player.turnSpeed : player.rotation.y += player.turnSpeed ; // switch for backward
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    if (player.keyState[81]) {
        // 'q' - strafe left
        player.position.x += player.moveSpeed * Math.sin(player.rotation.y);
        player.position.z += player.moveSpeed * Math.cos(player.rotation.y);
        //player.position.x -= player.moveSpeed * Math.cos(player.rotation.y);
        //player.position.z += player.moveSpeed * Math.sin(player.rotation.y);
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    if (player.keyState[69]) {
        // 'e' - strage right
        player.position.x -= player.moveSpeed * Math.sin(player.rotation.y);
        player.position.z -= player.moveSpeed * Math.cos(player.rotation.y);
        //player.position.x += player.moveSpeed * Math.cos(player.rotation.y);
        //player.position.z -= player.moveSpeed * Math.sin(player.rotation.y);
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }

};



//


module.exports.players = players;
module.exports.addPlayer = addPlayer;
module.exports.removePlayer = removePlayer;
module.exports.updatePlayerData = updatePlayerData;
module.exports.playerForId = playerForId;

//module.exports.onKeyDown = onKeyDown;
//module.exports.onKeyUp = onKeyUp;
//module.exports.onMouseDown = onMouseDown;
//module.exports.onMouseUp = onMouseUp;

module.exports.renderPlayers = renderPlayers;

module.exports.resetMoveStates = resetMoveStates;
