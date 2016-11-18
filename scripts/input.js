// useful url for input
// https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes



function handleKeyDown(event) {
  // storing the pressed state for individual key
  currentlyPressedKeys[event.keyCode] = true;
  
  // Drugace se vsak frame odpre/zapre
  if (event.keyCode == 73) {
	  ui.toggleInventory();
  }
}

function handleKeyUp(event) {
  // reseting the pressed state for individual key
  currentlyPressedKeys[event.keyCode] = false;
}

function getObjectIDFromCoordinates(xPos, yPos) {
	var pressedID = -1;
	var pixels = new Uint8Array(1 * 1 * 4);
	gl.readPixels(xPos, yPos, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	pressedID = pixels[0];
	return pressedID;
}

function handleMouse(pressedID, xPos, yPos) {
	if (pressedID == -1) console.log("You didn't press any object!");
	else if (pressedID == world.ID) {
		currentlyPressedEntity = null;
		if (leftMousePressed == false) return;
		console.log("You pressed the world!");
		//Black magic, leave as it is!
		var mx = (2.0 * xPos) / canvas.width - 1.0;
		var my = 1.0 - (2.0 * (canvas.height-yPos)) / canvas.height;
		var mz = 1.0;
		
		var ray = vec3.create();
		ray[x] = mx;
		ray[y] = my;
		ray[z] = mz;
		
		var ray_clip = []
		ray_clip[x] = ray[0];
		ray_clip[y] = ray[1];
		ray_clip[z] = -1.0;
		ray_clip[3] = 1.0;
		
		//console.log(ray_clip);
		var ray_eye = matrixVectorMultiply4(mat4.inverse(pMatrix),ray_clip);	
		//console.log(ray_eye);
		ray_eye[z] = -1.0;
		ray_eye[3] = 0.0;
		
		var viewMatrix = mat4.create();
		mat4.identity(viewMatrix);
		
		mat4.rotateX(viewMatrix, degToRad(-camera.rotation[x]));
		mat4.rotateY(viewMatrix, degToRad(-camera.rotation[y]));
		mat4.rotateZ(viewMatrix, degToRad(-camera.rotation[z]));
		mat4.translate(viewMatrix, camera.position);
		mat4.translate(viewMatrix, camera.offset);
		
		var ray_wor = matrixVectorMultiply4(mat4.inverse(viewMatrix), ray_eye);
		//console.log(ray_wor);
		
		var final_vector = vec3.create();
		final_vector[x] = ray_wor[x];
		final_vector[y] = ray_wor[y];
		final_vector[z] = ray_wor[z];

		vec3.normalize(final_vector,final_vector);
		
		//final_vector represents direction where the camera is looking
		
		var currentPos = []
		currentPos[x] = -camera.position[x]-camera.offset[x];
		currentPos[y] = -camera.position[y]-camera.offset[y];
		currentPos[z] = -camera.position[z]-camera.offset[z];
		
		//We get the camera position and keep adding the direction vector to it.
		//When we "pierce" the world plane, we stop and get our x and z coordinates.
		//There is also a threshold for safety if something happens or we click outside of the world plane.
		var limit = 10000;
		var count = 0;
		//console.log((enemy.position[x]-enemy.collisionBox[x]/2) + " " + (enemy.position[x]+enemy.collisionBox[x]/2));
		//console.log((enemy.position[z]-enemy.collisionBox[y]/2) + " " + (enemy.position[y]+enemy.collisionBox[y]/2));
		//console.log((enemy.position[z]-enemy.collisionBox[z]/2) + " " + (enemy.position[z]+enemy.collisionBox[z]/2));
		
		currentlyPressedEntity = null;
		while (currentPos[y] > world.position[y]) {
			currentPos[x] += final_vector[x]*0.5;
			currentPos[y] += final_vector[y]*0.5;
			currentPos[z] += final_vector[z]*0.5;
			count++;
			if (count > limit) break;
		}
		
		if (count <= limit) console.log("Clicked position | x: " + currentPos[x] + " z: " + currentPos[z]);
		else console.log("BAD CLICKED POSITION");
		//We pass the values to the mouseCorrdinate variable for further use.
		currentlyPressedMouseCoordinates[x] = currentPos[x];
		currentlyPressedMouseCoordinates[y] = world.position[y]+world.offset[y];
		currentlyPressedMouseCoordinates[z] = currentPos[z];
	}
	else if (pressedID == hero.ID) console.log("You pressed the hero!");
	else {
		for (var e in enemy) {
			if (enemy[e].ID == pressedID) {
				var temp = enemy[e];
				console.log("You pressed " + temp.name);
				currentlyPressedEntity = enemy[e];
				if (leftMousePressed) {
					currentlyPressedMouseCoordinates[x] = temp.position[x];
					currentlyPressedMouseCoordinates[y] = temp.position[y];//+world.offset[y];
					currentlyPressedMouseCoordinates[z] = temp.position[z];
				}
				break;
			}
		}
	}
}

function checkMouse()
{
	if (!leftMouseMoved && !leftMousePressed) return;
	
	handleMouseViaBuffer();
}

function handleMouseViaBuffer() {
	// NUJNO ZLO
	gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
	gl.viewport(0, 0, rttFramebuffer.width, rttFramebuffer.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//PERSPEKTIVA
	// Establish the perspective with which we want to view the
	// scene. Our field of view is 45 degrees, with a width/height
	// ratio and we only want to see objects between 0.1 units
	// and 100 units away from the camera.
	mat4.perspective(90, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	//mat4.identity(pMatrix);
	//mat4.ortho(0, 1280, 0, 720, 0.01, 1000.0, pMatrix);
	
	// CAMERA POSITION
	camera.draw();

	////// OBJECT DRAWING
	//hero.drawToFrameBuffer();
	
	for(var i in enemy) enemy[i].drawToFrameBuffer();
	
	//console.log(getObjectCollisionDistance(hero, enemy[0]) + " " + hero.calculateCollision + " " + enemy[0].calculateCollision);
	//console.log(hero.HP);
	
	world.drawToFrameBuffer();
	world1.drawToFrameBuffer();
	
	
	//TOLE NVEM CE BO DELAL TO JE BLO TM NAKONC
	gl.bindTexture(gl.TEXTURE_2D, rttTexture);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
	
	//gl.viewport(0, 0, canvas.width, canvas.height);
	//var pixels = new Uint8Array(50 * 50 * 4);
	//gl.readPixels(canvas.width/2, canvas.height/2, 50, 50, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	//if (pixels[0] != 0) alert("ALO");
	//console.log(pixels);
	
	//if (leftMouseMoved || leftMousePressed) {
		var rect = canvas.getBoundingClientRect();
		var mouse_x = leftMousePressEvent.clientX - rect.left;
		//console.log(rect.top);
		var mouse_y = canvas.height - (leftMousePressEvent.clientY - rect.top);
		var pressedID = getObjectIDFromCoordinates(mouse_x, mouse_y);
		handleMouse(pressedID, mouse_x, mouse_y);
		leftMousePressed = false;
		leftMousePressEvent = null;
		leftMouseMoved = false;
	//}
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

///*********************************************
/// OLD HANDLEMOUSECLICK WHICH USES RAYCASTING
/*function handleMouseClick(event) {

	//Get mouse coordinates canvas-wise
	var rect = canvas.getBoundingClientRect();
	var mouse_x = event.clientX - rect.left;
	var mouse_y = event.clientY - rect.top;
	//console.log("x: " + mouse_x + " y: " + mouse_y);
	
	//Black magic, leave as it is!
	var mx = (2.0 * mouse_x) / canvas.width - 1.0;
	var my = 1.0 - (2.0 * mouse_y) / canvas.height;
	var mz = 1.0;
	
	var ray = vec3.create();
	ray[x] = mx;
	ray[y] = my;
	ray[z] = mz;
	
	var ray_clip = []
	ray_clip[x] = ray[0];
	ray_clip[y] = ray[1];
	ray_clip[z] = -1.0;
	ray_clip[3] = 1.0;
	
	//console.log(ray_clip);
	var ray_eye = matrixVectorMultiply4(mat4.inverse(pMatrix),ray_clip);	
	//console.log(ray_eye);
	ray_eye[z] = -1.0;
	ray_eye[3] = 0.0;
	
	var viewMatrix = mat4.create();
	mat4.identity(viewMatrix);
	
	mat4.rotateX(viewMatrix, degToRad(-camera.rotation[x]));
	mat4.rotateY(viewMatrix, degToRad(-camera.rotation[y]));
	mat4.rotateZ(viewMatrix, degToRad(-camera.rotation[z]));
	mat4.translate(viewMatrix, camera.position);
	mat4.translate(viewMatrix, camera.offset);
	
	var ray_wor = matrixVectorMultiply4(mat4.inverse(viewMatrix), ray_eye);
	//console.log(ray_wor);
	
	var final_vector = vec3.create();
	final_vector[x] = ray_wor[x];
	final_vector[y] = ray_wor[y];
	final_vector[z] = ray_wor[z];

	vec3.normalize(final_vector,final_vector);
	
	//final_vector represents direction where the camera is looking
	
	var currentPos = []
	currentPos[x] = -camera.position[x]-camera.offset[x];
	currentPos[y] = -camera.position[y]-camera.offset[y];
	currentPos[z] = -camera.position[z]-camera.offset[z];
	
	//We get the camera position and keep adding the direction vector to it.
	//When we "pierce" the world plane, we stop and get our x and z coordinates.
	//There is also a threshold for safety if something happens or we click outside of the world plane.
	var limit = 10000;
	var count = 0;
	//console.log((enemy.position[x]-enemy.collisionBox[x]/2) + " " + (enemy.position[x]+enemy.collisionBox[x]/2));
	//console.log((enemy.position[z]-enemy.collisionBox[y]/2) + " " + (enemy.position[y]+enemy.collisionBox[y]/2));
	//console.log((enemy.position[z]-enemy.collisionBox[z]/2) + " " + (enemy.position[z]+enemy.collisionBox[z]/2));
	
	currentlyPressedEntity = null;
	while (currentPos[y] > world.position[y]) {
	//while (currentPos[y] > world.position[y]-5) {
		currentPos[x] += final_vector[x]*0.5;
		currentPos[y] += final_vector[y]*0.5;
		currentPos[z] += final_vector[z]*0.5;
		//console.log(currentPos[y] + " " + final_vector[y] + " " + (final_vector[y]*0.5))
		// creates new temp class Entity as collision detection requires object
		
		var tempObjectMouse = new Entity();
		tempObjectMouse.position[x] = currentPos[x];
		tempObjectMouse.position[y] = currentPos[y];
		//tempObjectMouse.offset[y] = currentPos[y];
		tempObjectMouse.position[z] = currentPos[z];
		
		var clickedObject = checkCollisionBetweenAllObjects(tempObjectMouse);
		//console.log(clickedObject);
		delete tempObjectMouse;
		
		//var clickedObject = checkCollisionWithObject(currentPos);
		//var clickedObject = rayTracingCheckCollision(currentPos);
		if(clickedObject != null && clickedObject != hero)
		{
			currentPos[x] = clickedObject.position[x];
			currentPos[y] = clickedObject.position[y];
			currentPos[z] = clickedObject.position[z];
			currentlyPressedEntity = clickedObject;
			console.log("Clicked entity " + currentlyPressedEntity.name);
			
			break;
		}
		
		
		count++;
		if (count > limit) break;
	}
	
	//if(clickedObject==null) 
	//{
	//	clickedObject = world;
	//}
	
	
	if (count <= limit) console.log("Clicked position | x: " + currentPos[x] + " z: " + currentPos[z]);
	else console.log("BAD CLICKED POSITION");
	
	//We pass the values to the mouseCorrdinate variable for further use.
	
	currentlyPressedMouseCoordinates[x] = currentPos[x];
	currentlyPressedMouseCoordinates[y] = world.position[y]+world.offset[y];
	currentlyPressedMouseCoordinates[z] = currentPos[z];


}*/
// END OF OLD HANDLEMOUSECLICK
//**********************************************

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
  
  
	// N key
	if (currentlyPressedKeys[78]) {
		//world.offset[y]+=0.5;
		world.position[y]+=0.5;
	}
	// M key
	if (currentlyPressedKeys[77]) {
		//world.offset[y]-=0.5;
		world.position[y]-=0.5;
	}
  
  
  
  ///////////////////////// debug only ////////////////////////////////
  /*
	if(currentlyPressedKeys[102]) {
		hero.direction[x]=1;
		//hero.move=true;
	}
	else if(currentlyPressedKeys[100]) {
		hero.direction[x]=-1;
		//hero.move=false;
	}
	else {
		hero.direction[x]=0;
		//hero.move=false;
	}
	
	if(currentlyPressedKeys[104]) {
		hero.direction[z]=-1;
		//hero.move=true;
	}
	else if(currentlyPressedKeys[98]) {
		hero.direction[z]=1;
		//hero.move=true;
	}
	else {
		hero.direction[z]=0;
		//hero.move=false;
	}
	
	
	if(currentlyPressedKeys[101]) {
		
		hero.destination[x]=-8.1360884308815;
		hero.destination[z]=1.0930535793304443;
		//hero.destination[x]=0;
		//hero.destination[y]=hero.position[y];
		//hero.destination[x]=1;
		//hero.destination[z]=1;
		hero.waypointMove=true;
	}
	else {
		//hero.destination[x]=0;
		//hero.destination[y]=0;
		//hero.destination[z]=0;
		//hero.waypointMove=false;
		//hero.move=true;
	}
	*/
}


