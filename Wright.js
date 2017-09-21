var arDrone = require('ar-drone');
var keypress = require('keypress');
var client = arDrone.createClient();
var Myo = require('myo')
var myMyo = Myo.create();


keypress(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', function (ch, key) {
  // press ctrl + z to land the drone and exit the program
  if (key && key.ctrl && key.name == 'z' ) {
    client.land(); 
    process.exit();
  }
  // press 'l' to land
  else if (key.name == 'l') {
    console.log("landing");
    client.land();
  }
  // press 'd' to exit emergency state
  else if (key.name == 'd') {
   client.disableEmergency();
   console.log("disable emergency");
  }
});
takecomm=true
var flying=false;
// speeds can be anything between 0 and 1
var yawSpeed = 0.5;
var pitchSpeed = 0.5;
var rollSpeed = 0.5;
poses=['fist','fingers_spread','double_tap','wave_in','wave_out']
myMyo.on('connect', function() {
  console.log("I'm Alive");
});
console.log("begin");
myMyo.setLockingPolicy('none')  
myMyo.on('lock', function(){ myMyo.unlock('hold') })

//Lands if Myo is removed or unresponsive
myMyo.on('arm_unsynced', function(){
  console.log("Houston we have a problem")
  land
  })

myMyo.on('pose', function(pose) {
  //Checks that a pose is held for 3/4s of a second before executing
  function CheckLegal(time){
    hut=true
    while (hut){
  myMyo.on('pose_off',function(){
    //myMyo.trigger('pose','rest')
    return false;
  })
  return true;
  setTimeout(function(){hut=false},750)
}
}
  takecomm=CheckLegal()
  // takeoff
  if (takecomm){
  if (pose == poses[0])
  {
    console.log("landing")
    client.land()
  }
  // landing
  if ((pose == poses[1]))
  {
    client.disableEmergency(); // in case drone crashed on previous run
    flying = true; 
    console.log("taking flight");
    client.takeoff();
    }
  else if ((pose == poses[2])){

    flying = true;
    console.log("Do A Barrel Roll");
    client.animate('flipBehind',1000);
    
    
  }
  else if ((pose == poses[3])){

    console.log("left");
    client.left(rollSpeed);
    
    
  }
  else if ((pose == poses[4])){

    console.log("right");
    client.right(rollSpeed); 
  }
  }});

