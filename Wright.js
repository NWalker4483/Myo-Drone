var arDrone = require('ar-drone');
var keypress = require('keypress');
var client = arDrone.createClient();
var myMyo = require('myo');
myMyo.connect('com.stolksdorf.myAwesomeApp', require('ws'));

//var myMyo = Myo.create();

keypress(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', function (key) {
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
  else if (key.name == 't') {
    console.log("takeoff");
    client.takeoff();
  }
  // press 'd' to exit emergency state
  else if (key.name == 'd') {
   client.disableEmergency();
   console.log("disable emergency");
  }
});


var takecomm=true
var enabled_control=false;
// speeds can be anything between 0 and 1
var yawSpeed = 0.5;
var pitchSpeed = 0.5;
var rollSpeed = 0.5;
var y_data = [];
var x_data = [];
var z_data = [];
var x_zero = 0;
var y_zero = 0;
var z_zero = 0;

setInterval(function(){
  x_data = []
  y_data = []
  z_data = []
 }, 3000);

function reset(){
  var new_zeroes = myMyo.myos[0]["lastIMU"]['gyroscope'];
  console.log('Reset Zeroes')
  x_zero = new_zeroes['x'];
  y_zero = new_zeroes['y'];
  z_zero = new_zeroes['z'];
}
 setInterval(function(){
   if(!enabled_control){
  reset();
}}, 1000);

myMyo.on('connected', function() {
  console.log("I'm Alive");
  myMyo.setLockingPolicy('none');
  console.log("And free");
});

myMyo.on('gyroscope', function(data){  
  if (enabled_control){
    //////////////// IGNORE BELOW //////////////////////////
    if (x_data.length < 10){
      x_data.push(data['x'].toPrecision(3));
    }
    else{
      x_data.shift();
      x_data.push(data['x'].toPrecision(3));
    }
    values = x_data;
    sum = values.reduce(add, 0);
    var xavg = (sum / values.length).toPrecision(3);
    ////////////////// IGNORE ABOVE ///////////////////////////
    function add(a, b) {
        return parseInt(a) + parseInt(b);
    }
    console.log('x: ', (xavg));

    if (xavg > 150){
      console.log("Rolling Left");
      client.left((xavg/10)*rollSpeed);
      client.after(2000, function() {
        client.stop(); 
      })
      this.vibrate('short');
    }
    else if (xavg < -150) {
      console.log("Rolling Right");
      client.right((xavg/10)*rollSpeed);
      client.after(2000, function() {
        client.stop();
      })
      this.vibrate('short');
    }
  };
});

//Lands if Myo is removed or unresponsive
myMyo.on('arm_unsynced', function(){
  console.log("Houston we have a problem")
  console.log("Arm unsynced")
  client.land();
  })

myMyo.on('pose_off', function(pose,edge) {
  if ((pose != 'double_tap') && (pose != 'fingers_spread')) {
    client.stop();
  console.log("Pose Off: ",pose);
  }
  if (pose == 'fist'){
    enabled_control = false
  }
});
myMyo.on('pose', function(pose) {
  if (pose == 'fist')
  {
    enabled_control = true;
  }
  // landing
  if ((pose == 'fingers_spread'))
  {
    console.log("landing flight");
    client.land();
  }

  else if ((pose == 'double_tap')){

    client.disableEmergency(); // in case drone crashed on previous run
    flying = true; 
    console.log("Takeoff Roll");
    client.takeoff()
    //client.animate('flipBehind',1000);d   
  };
});