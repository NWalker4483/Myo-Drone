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

var flying=false;
// speeds can be anything between 0 and 1
var yawSpeed = 0.5;
var pitchSpeed = 0.5;
var rollSpeed = 0.5;

myMyo.on('connect', function() {
  console.log("I'm Alive");
});
console.log("begin");
  
myMyo.on('pose', function(pose) {
  // takeoff
  if (pose == 'fist')
  {
    console.log("landing")
    client.land()
  }
  // landing
  if ((pose == 'fingers_spread'))
  {
    client.disableEmergency(); // in case drone crashed on previous run
    flying = true; 
    console.log("taking flight");
    client.takeoff();
    }
  else if ((pose == 'double_tap')){

    flying = true;
    console.log("Do A Barrel Roll");
    client.animate('flipBehind',1000);
    
    
  }
  else if ((pose == 'wave_in')){

    console.log("left");
    client.left(rollSpeed);
    
    
  }
  else if ((pose == 'wave_out')){

    console.log("right");
    client.right(rollSpeed); 
  }
  });

