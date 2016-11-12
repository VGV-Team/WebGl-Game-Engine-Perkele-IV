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
    camera.direction[x] = 1;
  } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
    // Right cursor key or D
    camera.direction[x] = -1;
  } else {
    camera.direction[x] = 0;
  }

  if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
    // Up cursor key or W
    camera.direction[z] = 1;
  } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
    // Down cursor key
    camera.direction[z] = -1;
  } else {
    camera.direction[z] = 0;
  }
  
  if (currentlyPressedKeys[81]) {
    // Q key
    camera.direction[y] = 1;
  } else if (currentlyPressedKeys[69]) {
    // E key
    camera.direction[y] = -1;
  } else {
    camera.direction[y] = 0;
  }
}


