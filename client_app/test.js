/*
 console.log('Hello')
 var key = {};
 var i ;
 var b = 'W';

 key[i||b] = true;

 console.log(key);

 console.log(i||b);
 */

/*
 var x = {id:12 };


 var foo = function(par){
 var y = par;
 y.name = 'sasha';
 console.log(y);
 }

 foo(x);
 console.log(x)
 */
/*
var arr = [];

var renderPlayers = function () {
    arr.forEach(function (item, i, arr) {
        console.log(i + ": " + item + " (array:" + arr + ")");
    })
}

setInterval(renderPlayers,100);
*/


var players = [];
var gamer = {};

gamer.playerId = 1
gamer.data = 'some data';
players.push(gamer);
console.log(gamer);

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


var someguy = playerForId(1);
someguy.data = 'new data';

console.log(gamer);







