//
// Matrix utility functions
//
// mvPush   ... push current matrix on matrix stack
// mvPop    ... pop top matrix from stack
// degToRad ... convert degrees to radians
//
function mvPushMatrix() {
  var copy = mat4.create();
  mat4.set(mvMatrix, copy);
  mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function radToDeg(radians) {
  return radians * 180 / Math.PI;
}

//Utility function cuz vec4 doesen't work?
function matrixVectorMultiply4(matrix, vector) {
	var result = [];
	for (var i = 0; i < 4; i++) {
		var sum = 0;
		for (var j = 0; j < 4; j++) {
			sum += (matrix[i*4+j] * vector[j]);
		}
		result[i] = sum;
	}
	return result;
}


//Texture utilities
function initTexture(textureFile) {
  textureArray[textureFile] = gl.createTexture();
  textureArray[textureFile].image = new Image();
  textureArray[textureFile].image.onload = function () {
    handleTextureLoaded(textureArray[textureFile])
  }; // async loading
  var path = "./assets/" + textureFile;
  console.log(path)
  textureArray[textureFile].image.src = path;
}

// Function gets passed a texture object from textureArray
function handleTextureLoaded(texture) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Third texture usus Linear interpolation approximation with nearest Mipmap selection
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);

  gl.bindTexture(gl.TEXTURE_2D, null);

  // when texture loading is finished we can draw scene.
  //texturesLoaded = true;
}

// logic utility

function draw(objectToDraw)
{
	//TEMP color
	gl.uniform4f(
		shaderProgram.tempColor,
		objectToDraw.vec4Color[0],
		objectToDraw.vec4Color[1],
		objectToDraw.vec4Color[2],
		objectToDraw.vec4Color[3]
	);

	
	//ZA IZOMETRIÈNO
	//mat4.scale(mvMatrix, [50.0,1.0,50.0]);
	//mat4.rotate(mvMatrix, degToRad(rotationCube), [1, 1, 1]);

	///////////////////////////////////////////////--------------------------------------------------------
	
	
	
	//POSITION
	gl.bindBuffer(gl.ARRAY_BUFFER, objectToDraw.vertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, objectToDraw.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	//if (objectToDraw.vertexPositionBuffer.itemSize == null) console.log("NAME: " + objectToDraw.name);
	//LIGHTING
	// If object doesen't have a normal bufffer, we won't use lighting on it
	if (objectToDraw.normalBuffer == null) {
		gl.uniform1i(shaderProgram.useLightingUniform, 0);
		gl.disableVertexAttribArray(shaderProgram.vertexNormalAttribute);
	} else {

		//console.log(objectToDraw.name + " using lighting!");
		gl.uniform1i(shaderProgram.useLightingUniform, 1);
		gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
		gl.uniform3f(
		  shaderProgram.ambientColorUniform,
		  0.0,
		  0.0,
		  0.0
		);

		//LIGHT ON CAMERA - NOT WORKING
		/*gl.uniform3f(
		  shaderProgram.pointLightingLocationUniform,
		  camera.position[x],
		  -camera.position[y],
		  camera.position[z]
		);*/
		//LIGHT ON HERO
		//console.log( hero.position[x] + " " + hero.position[y] + " " + hero.position[z]);

		
		gl.uniform3f(
		  shaderProgram.pointLightingLocationUniform,
		  //hero.position[x],
		  0.0,
		  0.0,
		  0.0
		  //hero.position[z]
		  
		);

		gl.uniform3f(
		  shaderProgram.pointLightingColorUniform,
		  0.5,
		  0.5,
		  0.5
		);
		
		
		// Set the normals attribute for the vertices.
		gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
		gl.bindBuffer(gl.ARRAY_BUFFER, objectToDraw.normalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, objectToDraw.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	}
	
	//TEXTURES
	gl.uniform1i(shaderProgram.useTexturesUniform, 0);
	gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
	if (objectToDraw.textureBuffer == null || objectToDraw.textureFile == null) {
		gl.uniform1i(shaderProgram.useTexturesUniform, 0);
		gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
	} else {
		console.log("Drawing textures on: " + objectToDraw.name);
		gl.uniform1i(shaderProgram.useTexturesUniform, 1);
		gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
		
		// Set the texture coordinates attribute for the vertices.
		gl.bindBuffer(gl.ARRAY_BUFFER, objectToDraw.textureBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, objectToDraw.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// Specify the texture to map onto the faces.
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textureArray[objectToDraw.textureFile]);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
	}
	

	
	
	mvPushMatrix();
	mat4.translate(mvMatrix, objectToDraw.position);
	mat4.translate(mvMatrix, objectToDraw.offset);

	mat4.rotateX(mvMatrix, degToRad(objectToDraw.rotation[0]));
	mat4.rotateY(mvMatrix, degToRad(objectToDraw.rotation[1]));
	mat4.rotateZ(mvMatrix, degToRad(objectToDraw.rotation[2]));

	mat4.scale(mvMatrix, objectToDraw.scale);
	//---------------------------------------------------------------------------------------------------
	

	// Set the colors attribute for the vertices.
	/*
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	*/

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objectToDraw.vertexIndexBuffer);

	// Draw the cube.
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, objectToDraw.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	// Restore the original matrix
	mvPopMatrix();
}

function load(objectToLoad, objectURL)
{
	var request = new XMLHttpRequest();
	request.open("GET", objectURL);
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			handleLoad(request.responseText);
		}
	}
	request.send();

	var handleLoad = function(data) {
		
		
		// to calculate collision box
		var minX = 9999;
		var maxX = -9999;
		var minY = 9999;
		var maxY = -9999;
		var minZ = 9999;
		var maxZ = -9999;
		
		

		var lines = data.split("\n");
		
		
		var vertexPositions = [];
		var vertexCount = 0;
		var vertexTextureCoords = [];
		var vertexTextureCount = 0;
		var vertexNormalCoords = [];
		var vertexNormalCount = 0;
		
		/*var vertexIndex = [];
		var textureIndex = [];
		var normalIndex = [];*/
		
		
		var unpacked = {};
		unpacked.vertexPositions = [];
		unpacked.vertexTextureCoords = [];
		unpacked.vertexNormalCoords = [];
		unpacked.indexMatrix = [];
		unpacked.index = 0;
		unpacked.cache = {};
		
		console.log("LOADING " + objectToLoad.name);
		
		var vertexF = [];
		var indexCount = 0;
				
		
		for (var i in lines) {
			var vals = lines[i].split(" ");
			if (vals.length == 4 && vals[0] == "v") {
				// It is a line describing a vertex; get X, Y and Z first
				//vertexPositions.push(parseFloat(vals[1]));
				//vertexPositions.push(parseFloat(vals[2]));
				//vertexPositions.push(parseFloat(vals[3]));	
				vertexPositions[vertexPositions.length] = parseFloat(vals[1]);
				vertexPositions[vertexPositions.length] = parseFloat(vals[2]);
				vertexPositions[vertexPositions.length] = parseFloat(vals[3]);				
				vertexCount += 1;

				if(parseFloat(vals[1])<minX)
				{
					minX = parseFloat(vals[1]);
				}
				else if(parseFloat(vals[1])>maxX)
				{
					maxX = parseFloat(vals[1]);
				}
				if(parseFloat(vals[2])<minY)
				{
					minY = parseFloat(vals[2]);
				}
				else if(parseFloat(vals[2])>maxY)
				{
					maxY = parseFloat(vals[2]);
					
					
				}
				if(parseFloat(vals[3])<minZ)
				{
					minZ = parseFloat(vals[3]);
				}
				else if(parseFloat(vals[3])>maxZ)
				{
					maxZ = parseFloat(vals[3]);
				}
			} else if (vals.length == 2 && vals[0] == "usemtl") {
				objectToLoad.textureFile = vals[1];
				initTexture(vals[1]);
			} else if (vals.length == 3 && vals[0] == "vt") {
				vertexTextureCoords.push(parseFloat(vals[1]));
				vertexTextureCoords.push(parseFloat(vals[2]));		
				vertexTextureCount += 1;	
			} else if (vals.length == 4 && vals[0] == "vn") {
				vertexNormalCoords.push(parseFloat(vals[1]));
				vertexNormalCoords.push(parseFloat(vals[2]));
				vertexNormalCoords.push(parseFloat(vals[3]));		
				vertexNormalCount += 1;
			} else if (vals.length == 4 && vals[0] == "f") {
				var faces;
				for (var i = 1; i <= 3; i++) {
					if(vals[i] in unpacked.cache){
						unpacked.indexMatrix.push(unpacked.cache[vals[i]]);
						continue;
					}
					faces = vals[i].split("/");
					unpacked.vertexPositions.push(vertexPositions[(faces[0] - 1) * 3 + 0]);
					unpacked.vertexPositions.push(vertexPositions[(faces[0] - 1) * 3 + 1]);
					unpacked.vertexPositions.push(vertexPositions[(faces[0] - 1) * 3 + 2]);
					
					if (vertexTextureCoords.length != 0) {
						unpacked.vertexTextureCoords.push(vertexTextureCoords[(faces[1] - 1) * 2 + 0]);
						unpacked.vertexTextureCoords.push(vertexTextureCoords[(faces[1] - 1) * 2 + 1]);
					}
					if (vertexNormalCoords.length != 0) {
						unpacked.vertexNormalCoords.push(vertexNormalCoords[(faces[2] - 1) * 3 + 0]);
						unpacked.vertexNormalCoords.push(vertexNormalCoords[(faces[2] - 1) * 3 + 1]);
						unpacked.vertexNormalCoords.push(vertexNormalCoords[(faces[2] - 1) * 3 + 2]);
					}
					
					unpacked.indexMatrix.push(unpacked.index);
					unpacked.cache[vals[i]] = unpacked.index;
					unpacked.index += 1;
				}

				/*vertexF.push(parseInt(vals[1]) - 1);
				vertexF.push(parseInt(vals[2]) - 1);
				vertexF.push(parseInt(vals[3]) - 1);*/
				//indexCount += 3;
			}
		}

		// align object to world
		//objectToLoad.offset[x] = -minY;
		objectToLoad.offset[y] = -minY;
		//objectToLoad.offset[z] = -minY;
		

		// calculate collision
		objectToLoad.collisionBox = [maxX-minX, maxY-minY, maxZ-minZ];
		
		//console.log(textureIndex.length + " " + normalIndex.length);

		//console.log(unpacked.vertexPositions);
		
		objectToLoad.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, objectToLoad.vertexPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpacked.vertexPositions), gl.STATIC_DRAW);
		objectToLoad.vertexPositionBuffer.itemSize = 3;
		objectToLoad.vertexPositionBuffer.numItems = unpacked.vertexPositions.length;
		
		//Load normals
		if (vertexNormalCoords.length != 0) {
			objectToLoad.normalBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, objectToLoad.normalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpacked.vertexNormalCoords), gl.STATIC_DRAW);
			objectToLoad.normalBuffer.itemSize = 3;
			objectToLoad.normalBuffer.numItems = unpacked.vertexNormalCoords.length;
		}
		
		//Load textures
		if (vertexTextureCoords.length != 0 && objectToLoad.textureFile != null) {
			objectToLoad.textureBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, objectToLoad.textureBuffer);
			// Pass the texture coordinates into WebGL
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpacked.vertexTextureCoords), gl.STATIC_DRAW);
			objectToLoad.textureBuffer.itemSize = 2;
			objectToLoad.textureBuffer.numItems = unpacked.vertexTextureCoords;
		}

		// Now send the element array to GL
		objectToLoad.vertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objectToLoad.vertexIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(unpacked.indexMatrix), gl.STATIC_DRAW);
		objectToLoad.vertexIndexBuffer.itemSize = 1;
		objectToLoad.vertexIndexBuffer.numItems = unpacked.indexMatrix.length;
	}
}


function calculateTime()
{
	timeTillLastUpdate = (new Date().getTime() - lastUpdateTime)/1000;
	lastUpdateTime = new Date().getTime();
}



function getRange(object1, object2)
{
	var dist = Math.sqrt(
		(object1.position[x] - object2.position[x]) * (object1.position[x] - object2.position[x]) +
		(object1.position[y] - object2.position[y]) * (object1.position[y] - object2.position[y]) +
		(object1.position[z] - object2.position[z]) * (object1.position[z] - object2.position[z])
	);
	//console.log(dist);
	return dist;
}


//////////////////////////////// NEW SIMPLE COLLISION DETECTION ////////////////////////////////
function checkCollisionBetweenTwoObjectsSimple(object1, object2)
{
	
	var range = getRange(object1, object2);
	var dist1 = Math.min(object1.collisionBox[x], object1.collisionBox[z])/2;
	var dist2 = Math.min(object2.collisionBox[x], object2.collisionBox[z])/2;
	var coll = range - dist1 - dist2;
	
	console.log(object1.name + " " + object2.name + " " + range + " " + dist1 + " " + dist2 + " " + coll);
	if(coll<0) return true;
	else return false;
}



function checkCollisionBetweenAllObjects(object)
{
	//////////////// check if click collides with any object ////////////////
		
	//////// check for enemy ////////
	for(var i in enemy)
	{
		//if(checkCollisionBetweenTwoObjects(object, enemy[i]))
		if(checkCollisionBetweenTwoObjectsSimple(object, enemy[i]))
		{
			return enemy[i];
		}
	}
	
	//////// check for pickable items ////////
	
	//////// check for world objects ////////
	
	
	return null;
}




//////////////////////////////// OLD COLLISION DETECTION 2 ////////////////////////////////
// problem with rotation of box and then calculating collision
//////////////// IMPLEMENT SEPERATING AXIS THEOREM TO MAKE THIS WORK ////////////////
// Checks for collision between two objects
function checkCollisionBetweenTwoObjects(object1, object2)
{
	if(!object1.calculateCollision || !object2.calculateCollision) return false;
	var object1NewCollisionBox = null;
	var object2NewCollisionBox = null;
	var m = mat4.create();
	
	//// rotate collision box to object rotation
	
	// rotate collision box of object1 to object1 rotation
	mat4.identity(m);
	mat4.translate(m, [-object1.collisionBox[x]/2, -object1.collisionBox[y]/2, -object1.collisionBox[z]/2]);
	mat4.rotateX(m, degToRad(object1.rotation[x]));
	mat4.rotateY(m, degToRad(object1.rotation[y]));
	mat4.rotateZ(m, degToRad(object1.rotation[z]));
	mat4.translate(m, [object1.collisionBox[x]/2,object1.collisionBox[y]/2,object1.collisionBox[z]/2]);
	object1.collisionBox[3] = 0;
	object1NewCollisionBox = matrixVectorMultiply4(m, object1.collisionBox);
	object1NewCollisionBox[x] = Math.abs(object1NewCollisionBox[x]);
	object1NewCollisionBox[y] = Math.abs(object1NewCollisionBox[y]);
	object1NewCollisionBox[z] = Math.abs(object1NewCollisionBox[z]);
	
	// rotate collision box of object2 to object2 rotation
	mat4.identity(m);
	mat4.translate(m, [-object2.collisionBox[x]/2, -object2.collisionBox[y]/2, -object2.collisionBox[z]/2]);
	mat4.rotateX(m, degToRad(object2.rotation[x]));
	mat4.rotateY(m, degToRad(object2.rotation[y]));
	mat4.rotateZ(m, degToRad(object2.rotation[z]));
	mat4.translate(m, [object2.collisionBox[x]/2,object2.collisionBox[y]/2,object2.collisionBox[z]/2]);
	object2.collisionBox[3] = 0;
	object2NewCollisionBox = matrixVectorMultiply4(m, object2.collisionBox);
	object2NewCollisionBox[x] = Math.abs(object2NewCollisionBox[x]);
	object2NewCollisionBox[y] = Math.abs(object2NewCollisionBox[y]);
	object2NewCollisionBox[z] = Math.abs(object2NewCollisionBox[z]);
	
	//console.log(object1.collisionBox);
	//console.log(newVec);
	
	// checks collision for all three axises, if all three collide then we have collision
	var collisionDirection = [0,0,0];
	
	/*
	x12>x21 && x12<x22
	x11>x21 && x11<x22
	x11<x21 && x12>x21
	x11<x22 && x12>x22
	*/
	var x11 = object1.position[x]-object1NewCollisionBox[x]/2;
	var x12 = object1.position[x]+object1NewCollisionBox[x]/2;
	var x21 = object2.position[x]-object2NewCollisionBox[x]/2;
	var x22 = object2.position[x]+object2NewCollisionBox[x]/2;
	if(
		x12>x21 && x12<x22 ||
		x11>x21 && x11<x22 ||
		x11<x21 && x12>x21 ||
		x11<x22 && x12>x22
	)
	{
		collisionDirection[x] = 1;
	}
	
	/*
	y12>y21 && y12<y22
	y11>y21 && y11<y22
	y11<y21 && y12>y21
	y11<y22 && y12>y22
	*/
	var y11 = object1.position[y]-object1NewCollisionBox[y]/2;
	var y12 = object1.position[y]+object1NewCollisionBox[y]/2;
	var y21 = object2.position[y]-object2NewCollisionBox[y]/2;
	var y22 = object2.position[y]+object2NewCollisionBox[y]/2;
	if(
		y12>y21 && y12<y22 ||
		y11>y21 && y11<y22 ||
		y11<y21 && y12>y21 ||
		y11<y22 && y12>y22
	)
	{
		collisionDirection[y] = 1;
	}
	
	/*
	z12>z21 && z12<z22
	z11>z21 && z11<z22
	z11<z21 && z12>z21
	z11<z22 && z12>z22
	*/
	var z11 = object1.position[z]-object1NewCollisionBox[z]/2;
	var z12 = object1.position[z]+object1NewCollisionBox[z]/2;
	var z21 = object2.position[z]-object2NewCollisionBox[z]/2;
	var z22 = object2.position[z]+object2NewCollisionBox[z]/2;
	if(
		z12>z21 && z12<z22 ||
		z11>z21 && z11<z22 ||
		z11<z21 && z12>z21 ||
		z11<z22 && z12>z22
	)
	{
		collisionDirection[z] = 1;
	}
	
	// if all there collide then we have collision
	if(collisionDirection[x] == 1 && collisionDirection[y] == 1 && collisionDirection[z] == 1) return true;
	return false;
}

//////////////////////////////// OLD COLLISION DETECTION ////////////////////////////////
// used only for vector collision - should NOT be used anymore
// coordinates - x,y,z coordinates to check, object - object to check with
// returns true if coordinates collide, else returns false
function checkCollisionWithObject(coordinates, object)
{
	//console.log(enemy[i].position[x] + "|" +enemy[i].position[z] + "  " + coordinates[x] + "|" +coordinates[z] + "  " + (enemy[i].position[x]-enemy[i].collisionBox[x]/2) + "|" + (enemy[i].position[x]+enemy[i].collisionBox[x]/2));
	if(
		(object.position[x]-object.collisionBox[x]/2) <= coordinates[x] &&
		(object.position[x]+object.collisionBox[x]/2) > coordinates[x] &&
		(object.position[y]-object.collisionBox[y]/2) <= coordinates[y] &&
		(object.position[y]+object.collisionBox[y]/2) > coordinates[y] &&
		(object.position[z]-object.collisionBox[z]/2) <= coordinates[z] &&
		(object.position[z]+object.collisionBox[z]/2) > coordinates[z]
	)
	{
		return true;
	}
	return false;
}