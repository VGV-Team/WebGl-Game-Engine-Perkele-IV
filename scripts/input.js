///////HANDLE KEYS

var currentlyPressedKeys = {};


function handleKeyDown(event) {
  // storing the pressed state for individual key
  currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
  // reseting the pressed state for individual key
  currentlyPressedKeys[event.keyCode] = false;
}


function handleKeys() {

  if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
    // Left cursor key or A
    speed[x] = 0.03*kSpeed;
  } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
    // Right cursor key or D
    speed[x] = -0.03*kSpeed;
  } else {
    speed[x] = 0;
  }

  if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
    // Up cursor key or W
    speed[z] = 0.03*kSpeed;
  } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
    // Down cursor key
    speed[z] = -0.03*kSpeed;
  } else {
    speed[z] = 0;
  }
  
  if (currentlyPressedKeys[81]) {
    // Q key
    speed[y] = 0.03*kSpeed;
  } else if (currentlyPressedKeys[69]) {
    // E key
    speed[y] = -0.03*kSpeed;
  } else {
    speed[y] = 0;
  }
}


