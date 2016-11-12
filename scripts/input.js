// useful url for input
// https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes

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

	// Left cursor key or A
	if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {

		camera.direction[x] = 1;
	} 
	// Right cursor key or D
	else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {

		camera.direction[x] = -1;
	} 
	else {
		camera.direction[x] = 0;
	}

	// Up cursor key or W
	if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {

		camera.direction[z] = 1;
	} 
	// Down cursor key
	else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
		camera.direction[z] = -1;
	} 
	else {
		camera.direction[z] = 0;
	}

	// Q key
	if (currentlyPressedKeys[81]) {
		camera.direction[y] = 1;
	} 
	// E key
	else if (currentlyPressedKeys[69]) {
		camera.direction[y] = -1;
	} 
	else {
		camera.direction[y] = 0;
	}
  
	
  
  
}


