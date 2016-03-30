var players = [];

function Player(){

    this.playerId = players.length;


    this.model = {};
    this.position = {};
    this.camera = {};
 //   this.testPlayer = {};
    this.rotation = {}

//    this.model.objects = new THREE.Object3D();
    this.model.motion = 'stand';
    this.model.state = 'stand';
    this.position.x = 0;
    this.position.y = 0;
    this.position.z = 0;
   // this.position.direction = 0;
    this.camera.speed = 300;
    this.camera.distance = 5;
    this.camera.x = 0;
    this.camera.y = 0;
    this.camera.z = 0;

//
    this.keyState={};
    this.moveSpeed = 0.1;
    this.turnSpeed = 0.03

    this.rotation.x = 0;
    this.rotation.y = 0;
    this.rotation.z = 0;

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




// KEYBOARD Handlers

//keyDown handler
var onKeyDown = function( event ,id ){

    console.log('onKeyDown call');
    console.log(event)
    console.log('id :'+ id );

    //event = event || window.event;
    var player = playerForId(id);


    player.keyState[event] = true; // side effect -- activate key

    console.log(player);

};

//keyUp handler
var onKeyUp = function( event ,id ){

    console.log('onKeyUp call');
    console.log(event)
    console.log('id :'+ id );

    //event = event || window.event;
    var player = playerForId(id);


    player.keyState[event] = false; // side effect -- de-activate key

    console.log(player);

};



var renderPlayers = function() {
    players.forEach(function (playerItem) {


        //console.log(playerItem.playerId);
        //console.log(playerItem.keyState);
        //console.log(playerItem.position);
        //console.log(playerItem.rotation);

        checkKeyStates(playerItem);


    });
   // socket.emit('updateWorld', players) //  надо ли переносить в checkKeyStates?? !!!!!!!!!!! Или вообще на месте обрабатывать в consumer'е
}

//setInterval(renderPlayers,300)

var checkKeyStates = function(player){

    if (player.keyState[38] || player.keyState[87]) {
        // up arrow or 'w' - move forward
        player.position.x -= player.moveSpeed * Math.sin(player.rotation.y);
        player.position.z -= player.moveSpeed * Math.cos(player.rotation.y);
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    if (player.keyState[40] || player.keyState[83]) {
        // down arrow or 's' - move backward
        player.position.x += player.moveSpeed * Math.sin(player.rotation.y);
        player.position.z += player.moveSpeed * Math.cos(player.rotation.y);
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    if (player.keyState[37] || player.keyState[65]) {
        // left arrow or 'a' - rotate left
        player.rotation.y += player.turnSpeed;
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    if (player.keyState[39] || player.keyState[68]) {
        // right arrow or 'd' - rotate right
        player.rotation.y -= player.turnSpeed;
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    if (player.keyState[81]) {
        // 'q' - strafe left
        player.position.x -= player.moveSpeed * Math.cos(player.rotation.y);
        player.position.z += player.moveSpeed * Math.sin(player.rotation.y);
        //updatePlayerData();
        //socket.emit('updatePosition', playerData);
    }
    if (player.keyState[69]) {
        // 'e' - strage right
        player.position.x += player.moveSpeed * Math.cos(player.rotation.y);
        player.position.z -= player.moveSpeed * Math.sin(player.rotation.y);
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

module.exports.onKeyDown = onKeyDown;
module.exports.onKeyUp = onKeyUp;

module.exports.renderPlayers=renderPlayers;