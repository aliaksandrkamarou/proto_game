'use strict';
/*
var world = require('../server_app/server_world');


var THREE = require('three');
//hacked Clock
var clock = new THREE.Clock;
var g_delta;
var g_lastTick;


function foo(){

 var delta = clock.getDelta(); //call order is important here 1.// side-effect update clock.elapsedTime
console.log('render');

 world.renderPlayers(delta); // call order is important is here 2.

 g_delta = delta;
 g_lastTick = clock.elapsedTime;// copy primitive //call order is important here 3. // call after getDelta() is important. + call after render is important

 setImmediate(foo);
}

*/
//foo();
/*

(function (world.players, g_lastTick, ps)
{
 setTimeout(function () {
  io.emit('outer_UPD_world_CLI', [world.players, g_lastTick, ps])
 }, 30);
}
)
*/
//var meshPlayer = {position: new THREE.Vector3(1,1,1)}
/*
function Player(mesh){
 this.position = mesh.position;
}
var g_player = new Player(meshPlayer);

g_player.position.copy(new THREE.Vector3(2,1,1))

console.log(meshPlayer.position);
console.log(g_player.position);



 function bar(a,b){
  return [a,b]
 }

var f = d = bar(1,2);

console.log(f + ' vs ' + d);




var ar = [1,2,3]

console.log(ar.shift());

*/
/*
var mix = new THREE.AnimationMixer()



function Player(mix){
 this.id =1;
 this.mixer = mix;

}

var p = new Player(mix);

//console.log( 'p '+p.mixtime)

//mix.time.ina = 3;


Object.defineProperty(p, 'mixer', {
 get: function () {return mix; },  //,
 set: function(val) { mix = val;}//,
// configurable: true,
// writable: true

});


//Object.defineProperties(p, {'mixtime': {get: function () {return mix.time; }}});

*/
/*
Object.defineProperties(p, {
 'property1': {
  value: true,
  writable: true
 },
 'maxtime': {
  get: function(){return mix.time}
 // writable: false
 }
 // è ò.ä.
});
*/
//mix.time = 2

//p.mixtime = 4
/*
console.log('mix '+ mix.time)


console.log( 'p '+p.mixer)

console.log('mix '+ mix.time)

p.mixer.time = 13

//console.log(JSON.stringify(mix))


console.log(JSON.stringify(p))



var word ={word:'hello'}
var arr = [word,'world'];
console.log(arr);
var delta = {number: 123};
var new_arr = arr.concat(delta);
console.log(new_arr);
word.word='nooope';
console.log(arr);
console.log(new_arr);


arr = [1,2];
arr.shift();
console.log(arr.length)


//THREE.Interpolant();


function lerp(v1, v2, f) {
 return f * (v2 - v1) + v1
}


var v1 = new THREE.Vector3(10,10,10);
var v2 = new THREE.Vector3(20,20,20);


v1.lerp(v2,.25)

console.log(v1);



*/



/*
for (var i = hist.length-1; i-- > 0; ) { //

 //console.log(hist[i]);


 if (hist[i].ps + g_InterpolationTimeMs / 1000 <= hist[hist.length - 1].ps) {

  console.log(hist[i]);


  var v = lerp(hist[i].ps, hist[i+1].ps, 0.5)

  console.log(v);



  break  ;



 } else break;

}
*/


/*
var g_lastPs_sec ;

var g_InterpolationTimeMs = 4000;
*/













/*

var delta;
var g_InterpolationTimeMs = 4000;
var g_lastTick = 11;
var g_Current_Client_time = g_lastTick;
var g_Current_Rrendiring_time;

var g_Pending_server_hist = [{tick:0.0},{tick:0.4},{tick:0.7},{tick:2.88}, {tick:g_lastTick}] // , {ps:1.5},{ps:1.7} ,{ps:1.9} ,{ps:2.3},{ps:2.8}, {ps:2.9}, {ps:3.4},{ps:4.7},{ps:5}];

var hist = g_Pending_server_hist;




 function serverUpdate( lastTick){
 g_lastTick = lastTick;
 g_Current_Client_time = lastTick;


}


delta = 4.9;
g_Current_Client_time = g_Current_Client_time + delta;
g_Current_Rrendiring_time = g_Current_Client_time - (g_InterpolationTimeMs/1000);


*/
/*


for (var i = hist.length; i-- > 0;) { //

 console.log('g_lastTick ' + g_lastTick + ' g_Current_Client_time ' + g_Current_Client_time + ' g_Current_Rrendiring_time ' + g_Current_Rrendiring_time + ' DELTA ' + delta)
 if (hist[i].tick <= g_Current_Rrendiring_time) {

  if (!hist[i + 1]){ var v = lerp(hist[i].tick, hist[i].tick, 0); console.log(v);  break;}



  console.log('start ' + hist[i].tick + ' renderTime ' + g_Current_Rrendiring_time + ' end ' + hist[i + 1].tick);


  var v = lerp(hist[i].ps, hist[i + 1].ps, 0.5); console.log(v)

  //console.log(v);

  break;


 }

}

/*
var start;


for (var i = 0; i < len ; i++ ) {

// console.log(hist[i]);


if (hist[i].ps + (g_InterpolationTimeMs / 1000 )   <= hist[len -1].ps - delta ) {




 console.log(hist[i]);
//  console.log(g_Pending_server_hist[i].ps)
 console.log( 'inter ? '+ ( hist[i].ps +  delta))


  start = g_Pending_server_hist[i];
  // g_Pending_server_hist.splice(i,1);


 }
else {

//  g_Pending_server_hist.splice(0, i)
break;

 }
}



(start) ? console.log('srtart at ' +start.ps) : console.log('waiting') ;

hist.splice(0, hist.indexOf(start))








console.log(hist);

*/


/*

var hi = [];
var o = hi.shift();

 o ? console.log (o) : console.log(o);





*/
/*
console.log('LOOP');

var psh = [1,2,3,4,5,6,7]



for(var i = psh.length; i-- > 0;){
 console.log('go: '+ psh[i]);


 if(psh[i] <= 5){

  console.log('got 4? : '+ psh[i])
  break;



 }
 //console.log('pass');




}


*/
'use strict';
var Ammo = require('../lib/ammo');
var THREE = require('three');
var clock = new THREE.Clock();

//function main() {
 var collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
     dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration),
     overlappingPairCache    = new Ammo.btDbvtBroadphase(),
     solver                  = new Ammo.btSequentialImpulseConstraintSolver(),
     dynamicsWorld           = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
 dynamicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));

 var groundShape     = new Ammo.btBoxShape(new Ammo.btVector3(50, 50, 50)),
     bodies          = [],
     groundTransform = new Ammo.btTransform();

 groundTransform.setIdentity();
 groundTransform.setOrigin(new Ammo.btVector3(0, -56, 0));

 (function() {
  var mass          = 0,
      isDynamic     = (mass !== 0),
      localInertia  = new Ammo.btVector3(0, 0, 0);

  if (isDynamic)
   groundShape.calculateLocalInertia(mass, localInertia);

  var myMotionState = new Ammo.btDefaultMotionState(groundTransform),
      rbInfo        = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, groundShape, localInertia),
      body          = new Ammo.btRigidBody(rbInfo);

//  dynamicsWorld.addRigidBody(body);
//  bodies.push(body);
 })();


 (function() {
  var colShape        = new Ammo.btSphereShape(1),
      startTransform  = new Ammo.btTransform();

  startTransform.setIdentity();

  var mass          = 1,
      isDynamic     = (mass !== 0),
      localInertia  = new Ammo.btVector3(0, 0, 0);

  if (isDynamic)
   colShape.calculateLocalInertia(mass,localInertia);

  startTransform.setOrigin(new Ammo.btVector3(0.0, 10.0, 0.0));

  var myMotionState = new Ammo.btDefaultMotionState(startTransform),
      rbInfo        = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, colShape, localInertia),
      body          = new Ammo.btRigidBody(rbInfo);
  body.setLinearVelocity(new Ammo.btVector3(1.0, 0.0, 1.0))
  body.setAngularVelocity(new Ammo.btVector3(0, Math.PI/4, 0))

  dynamicsWorld.addRigidBody(body);
  bodies.push(body);
 })();



 var convexShape = new Ammo.btCapsuleShape(2,4)
 var ghostObject =  new Ammo.btPairCachingGhostObject();
 var char = new Ammo.btKinematicCharacterController(ghostObject,convexShape ,1,1);
 //dynamicsWorld.addCharacter(char);



 var trans = new Ammo.btTransform(); // taking this out of the loop below us reduces the leaking
 //dynamicsWorld.setFixedTimeStep(1/20);
 //dynamicsWorld.stepSimulation(0.05, 5, 0.05);
 //dynamicsWorld.stepSimulation(0.10, 5, 0.05);
/*
 dynamicsWorld.stepSimulation(0.01, 14, 0.11);
 dynamicsWorld.stepSimulation(0.01, 14, 0.11);
 dynamicsWorld.stepSimulation(0.01, 14, 0.11);
 dynamicsWorld.stepSimulation(0.01, 14, 0.11);
 dynamicsWorld.stepSimulation(0.10, 14, 0.11); // whaaaat???
// dynamicsWorld.stepSimulation(0.00, 5, 0.1);
 //dynamicsWorld.stepSimulation(0.5/20, 0, 1/20);
 dynamicsWorld.stepSimulation(0.01, 14, 0.11);
*/


// var transform = bodies[0].getCenterOfMassTransform();

//var  origin = transform.getOrigin();
// var rotation = transform.getRotation();



 //console.log(bodies[0].getLinearVelocity().x())
// console.log('x: '+ origin.x()+ ' z: '+ origin.z())

 function blocker(time) {
  var now = new Date().getTime()

  while (new Date().getTime() < now + time) {
//  console.log('blocking')
  }
 }
var timePassed = 0;
//function looper () {

 for (var i = 0; i < 2; i++) {

 var delta = clock.getDelta();
 timePassed +=delta;


 console.log('1. delta '+delta);
  console.log('2. time passed '+ timePassed +' steps: '+Math.floor(timePassed/0.05))
 dynamicsWorld.stepSimulation(1/60, 1,1/60);

 bodies.forEach(function (body) {
  if (body.getMotionState()) {

 //  console.log('CF ' + body.getCollisionFlags());
   // body.setActivationState(4);
   //  body.setCollisionFlags(2);
//   console.log(body.isActive())
   //(body.getActivationState())
   // body.setActivationState(4);
   var transform = body.getCenterOfMassTransform();
   var  origin = transform.getOrigin();
   var rotation = transform.getRotation();
   body.getMotionState().getWorldTransform(trans);
   console.log(trans.getRotation().y() + ' VS ' + rotation.y())
   console.log(trans.getOrigin().x())
  // console.log(trans.getPosition().y())
   //console.log("3. world pos = " + [origin.x(), origin.y(), origin.z()]);
  }
 });
// blocker(10)
// setInterval(looper,100)
//}
};

 //looper();

 // Delete objects we created through |new|. We just do a few of them here, but you should do them all if you are not shutting down ammo.js
 // we'll free the objects in reversed order as they were created via 'new' to avoid the 'dead' object links
 Ammo.destroy(dynamicsWorld);
 Ammo.destroy(solver);
 Ammo.destroy(overlappingPairCache);
 Ammo.destroy(dispatcher);
 Ammo.destroy(collisionConfiguration);

 console.log('ok.')
//}

//main();


//console.log(char.getGravity());
/*
var currTime = 6;
var arr = [1,2,3,4,5];
var renderTime ;
arr.some(function(time, i, arr){
 if (time >= currTime - 3 ) {
  renderTime = time
  return true
 }
});

console.log(renderTime);

var arr2 = new Array(5)
arr2.fill(0)
setInterval(function(){
 arr2.shift()
 arr2.push('val');
 console.log(arr2.length)
 console.log(arr2)

},1000)


*/
/*
var  tester = [1,2,3,4,5];
var res = tester.some(function(el,idx,arr){
 console.log('test '+ el);
 arr.splice(idx,1)
 if (2 == el) return true;
})

console.log(res);


var  tester2 = [10,20,30,40,50];
tester2.forEach(function(e,i,arr){
 console.log(e);
 arr.splice(i,1);
})

var i = 0
for (i; i< 1; i++ ){
 console.log('i = '+ i)
}
console.log(tester2.length)


while (tester.length>0){
 console.log('tester length '+tester.length)
 tester.shift()
}

var t3 =[];
t3.unshift(1);
t3.unshift(2);
t3.unshift(3);
t3.unshift(4);

var it;

for (it = t3.length - 1; it>=0; it-- )
{
  console.log('t3 '+  t3[it])
 t3.pop();
}
console.log(t3)

console.log(JSON.parse(JSON.stringify(-2.748893639961059)))







console.log(Math.round(-2.748893639961059 * 10000)/10000)


console.log(Math.round(-2.748893639961059,8 ))


console.log(1.005*1000)

console.log((Math.round((1.005 * 1000)/10)/100).toFixed(4))


function round(value, exp) {
 if (typeof exp === 'undefined' || +exp === 0)
  return Math.round(value);

 value = +value;
 exp = +exp;

 if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
  return NaN;

 // Shift
 value = value.toString().split('e');
 value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

 // Shift back
 value = value.toString().split('e');
 return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}


console.log(round(1.005,2))

*/

console.log(Math.PI/4)


console.log(false != true)

var diff = 1/10;

var delta = 1/60;

//var alpha = delta / diff;
var alpha = 0.1;


var vec0 = new THREE.Vector3(0,0,0);
var vec1 = new THREE.Vector3(10,10,10);

var vec2 = new THREE.Vector3().lerpVectors ( vec0, vec1, alpha )


//vec0.lerp(vec1, (alpha))
//vec0.lerp(vec1, (alpha))
console.log(vec2)


var arrt = [1,2,3,4]
console.log(arrt);
arrt.length=0;
console.log(arrt);
arrt.length=4;
console.log(arrt);


var mesh = {};
mesh.actions = {
 stand: 10,
 run: 20,
 back: 30,
 attack: 40//,
 //         painOne: mesh.mixer.clipAction(mesh.geometry.animations[3]),
 //       wave: mesh.mixer.clipAction(mesh.geometry.animations[10])

};

var state0 = []
    state0[14]= {
     stand: 15,
     run: 25,
     back: 35,
     attack: 45//,
   }


for (var prop in mesh.actions) {
 if( mesh.actions.hasOwnProperty( prop ) ) {
  console.log("obj." + prop + " = " + mesh.actions[prop]+ ' ' + state0[14][prop]);
 }
}


var ar1 = [1,2,3]
ar1.push([4,5,6])
console.log(ar1)

ar1.splice(0,2)

console.log(ar1)