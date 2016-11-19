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

function getVectorAngle(vec1, vec2)
{
	/*
	return Math.acos((vec1[x]*vec2[x]+vec1[y]*vec2[y]+vec1[z]*vec2[z]) / 
		(
			Math.sqrt(vec1[x]*vec1[x]+vec1[y]*vec1[y]+vec1[z]*vec1[z])+
			Math.sqrt(vec2[x]*vec2[x]+vec2[y]*vec2[y]+vec2[z]*vec2[z])
		)
	)
	*/
	
	
	var Va = [];
	Va[x] = vec1[x]/Math.sqrt(vec1[x]*vec1[x]+vec1[z]*vec1[z]);
	Va[y] = 0;
	Va[z] = vec1[z]/Math.sqrt(vec1[x]*vec1[x]+vec1[z]*vec1[z]);
	
	var Vb = [];
	Vb[x] = vec2[x]/Math.sqrt(vec2[x]*vec2[x]+vec2[z]*vec2[z]);
	Vb[y] = 0;
	Vb[z] = vec2[z]/Math.sqrt(vec2[x]*vec2[x]+vec2[z]*vec2[z]);
	
	var angle = radToDeg(Math.acos((Va[x]*Vb[x]+Va[z]*Vb[z])));
	var cross = [];
	cross[x] = Va[y]*Vb[z]-Va[z]*Vb[y];
	cross[y] = Va[z]*Vb[x]+Va[x]*Vb[z];
	cross[z] = Va[x]*Vb[y]+Va[y]*Vb[x];
	
	var Vn = [0,1,0];
	//var Vn = vec2;
	//console.log((Vn[x]*cross[x] + Vn[y]*cross[y] + Vn[z]*cross[z]));
	if((Vn[x]*cross[x] + Vn[y]*cross[y] + Vn[z]*cross[z])<0)
	{
		//console.log("qweqweqweqwe");
		angle = -angle;
	}		
	//console.log(cross[y]);
	
	/*
	//var def = [1,0,0]
	var def = vec1;
	var ang1 = vec1[x]*def[x]+vec1[z]*def[z];
	var ang2 = vec2[x]*def[x]+vec2[z]*def[z];
	//return (ang1-ang2);
	console.log((radToDeg(ang1-ang2)));
	*/
	
	
	/*
	var Va = []; 
	Va[x] = vec1[x]/Math.sqrt(vec1[x]*vec1[x]+vec1[z]*vec1[z]);
	Va[y] = 0;
	Va[z] = vec1[z]/Math.sqrt(vec1[x]*vec1[x]+vec1[z]*vec1[z]);
	
	var Vb = [];
	Vb[x] = vec2[x]/Math.sqrt(vec2[x]*vec2[x]+vec2[z]*vec2[z]);
	Vb[y] = 0;
	Vb[z] = vec2[z]/Math.sqrt(vec2[x]*vec2[x]+vec2[z]*vec2[z]);
	
	
	var cross = [];
	cross[x] = Va[y]*Vb[z]-Va[z]*Vb[y];
	cross[y] = Va[z]*Vb[x]+Va[x]*Vb[z];
	cross[z] = Va[x]*Vb[y]+Va[y]*Vb[x];
	var dot = Va[x]*Vb[x]+Va[z]*Vb[z];
	//if(cross[x]<0)cross[x] = -cross[x];
	//if(cross[y]<0)cross[y] = -cross[y];
	//if(cross[z]<0)cross[z] = -cross[z];
	
	var qwe = Math.sqrt(cross[x]*cross[x]+cross[y]*cross[y]+cross[z]*cross[z]);
	
	angle = Math.atan2(qwe, dot);
	console.log("qwe " + radToDeg(angle));
	//console.log(cross + " " + dot);
	*/
	
	return angle;
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

function getDirectionBetweenVectors(pos1, pos2)
{
	var posX = pos2[x]-pos1[x];
	var posZ = pos2[z]-pos1[z];
	return [posX/Math.sqrt(posX*posX+posZ*posZ), 0, posZ/Math.sqrt(posX*posX+posZ*posZ)];
}

function normalizeVector(vec)
{
	var d = Math.sqrt(vec[x]*vec[x]+vec[y]*vec[y]+vec[z]*vec[z]);
	return [vec[x]/d, vec[y]/d, vec[z]/d];
}


//// TEXTURE FRAMEBUFFER INIT
function initTextureFramebuffer() {
  rttFramebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
  rttFramebuffer.width = canvas.width;
  rttFramebuffer.height = canvas.height;

  rttTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, rttTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  var renderbuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height);

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function drawObjectToFrameBuffer(objectToDraw) {
	//console.log("QWE");
	//TEMP color
	gl.uniform4f(
		shaderProgram.tempColor,
		objectToDraw.frameBufferColor[0],
		objectToDraw.frameBufferColor[1],
		objectToDraw.frameBufferColor[2],
		objectToDraw.frameBufferColor[3]
	);
	
	//console.log(objectToDraw.frameBufferColor[0]);
	
	//ZA IZOMETRIÈNO
	//mat4.scale(mvMatrix, [50.0,1.0,50.0]);
	//mat4.rotate(mvMatrix, degToRad(rotationCube), [1, 1, 1]);

	///////////////////////////////////////////////--------------------------------------------------------
	
	
	
	//POSITION
	gl.bindBuffer(gl.ARRAY_BUFFER, objectToDraw.vertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, objectToDraw.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	//if (objectToDraw.vertexPositionBuffer.itemSize == null) console.log("NAME: " + objectToDraw.name);

	gl.uniform1i(shaderProgram.useLightingUniform, 0);
	gl.disableVertexAttribArray(shaderProgram.vertexNormalAttribute);
	
	
	
	gl.uniform1i(shaderProgram.useTexturesUniform, 0);
	gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
	
	mvPushMatrix();
	mat4.translate(mvMatrix, objectToDraw.position);
	mat4.translate(mvMatrix, objectToDraw.offset);

	mat4.rotateX(mvMatrix, degToRad(objectToDraw.rotation[0]));
	mat4.rotateY(mvMatrix, degToRad(objectToDraw.rotation[1]));
	mat4.rotateZ(mvMatrix, degToRad(objectToDraw.rotation[2]));
	
	mat4.scale(mvMatrix, objectToDraw.scale);
	
	// Scaling for easier clicking
	//if (objectToDraw.ID > world[world.length - 1].ID) mat4.scale(mvMatrix, [1.5, 1.0, 1.5]);
	//---------------------------------------------------------------------------------------------------
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objectToDraw.vertexIndexBuffer);

	
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, objectToDraw.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	// Restore the original matrix
	mvPopMatrix();
	
}


function getTopWorldObject(object) {
	gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
	gl.viewport(0, 0, rttFramebuffer.width, rttFramebuffer.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	mat4.perspective(90, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

	
	var tmp1 = camera.position[x];
	var tmp2 = camera.position[y];
	var tmp3 = camera.position[z];
	var tmp4 = camera.offset[x];
	var tmp5 = camera.offset[z];
	var tmp6 = camera.rotation[x];
	var tmp7 = camera.offset[y];
	camera.position[x] = -object.position[x]-object.offset[x];
	camera.position[y] = -object.position[y]-object.offset[y];
	camera.position[z] = -object.position[z]-object.offset[z];
	camera.offset[x] = 0;
	camera.offset[y] = -10;
	camera.offset[z] = 0;
	camera.rotation[x] = 90;
	//console.log((-camera.position[y])+" "+(-camera.offset[y])+" "+object.position[y]+" "+object.offset[y])
	// CAMERA POSITION
	camera.draw();

	camera.position[x] = tmp1;
	camera.position[y] = tmp2;
	camera.position[z] = tmp3;
	camera.offset[x] = tmp4;
	camera.offset[z] = tmp5;
	camera.rotation[x] = tmp6;
	camera.offset[y] = tmp7;
	
	
	//world.drawToFrameBuffer();
	//world1.drawToFrameBuffer();
	
	for (var w in world) {
		world[w].drawToFrameBuffer();
	}
	
	gl.bindTexture(gl.TEXTURE_2D, rttTexture);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
	
	
	var mouse_x = canvas.width/2;
	var mouse_y = canvas.height/2;
	var pressedID = getObjectIDFromCoordinates(mouse_x, mouse_y);

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	//console.log(pressedID);
	
	for (var w in world) {
		if (world[w].ID == pressedID)
			return world[w];
	}
	return null;
}

function getTopWorldObjectByCoordiantes(x, z) {
	gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
	gl.viewport(0, 0, rttFramebuffer.width, rttFramebuffer.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	mat4.perspective(90, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

	
	var tmp1 = camera.position[x];
	var tmp2 = camera.position[y];
	var tmp3 = camera.position[z];
	var tmp4 = camera.offset[x];
	var tmp5 = camera.offset[z];
	var tmp6 = camera.rotation[x];
	var tmp7 = camera.offset[y];
	camera.position[x] = -x;
	//camera.position[y] = -object.position[y]-object.offset[y];
	camera.position[z] = -z;
	camera.offset[x] = 0;
	camera.offset[y] = -10;
	camera.offset[z] = 0;
	camera.rotation[x] = 90;
	//console.log((-camera.position[y])+" "+(-camera.offset[y])+" "+object.position[y]+" "+object.offset[y])
	// CAMERA POSITION
	camera.draw();

	camera.position[x] = tmp1;
	camera.position[y] = tmp2;
	camera.position[z] = tmp3;
	camera.offset[x] = tmp4;
	camera.offset[z] = tmp5;
	camera.rotation[x] = tmp6;
	camera.offset[y] = tmp7;
	
	
	for (var w in world) {
		world[w].drawToFrameBuffer();
	}
	
	gl.bindTexture(gl.TEXTURE_2D, rttTexture);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
	
	
	var mouse_x = canvas.width/2;
	var mouse_y = canvas.height/2;
	var pressedID = getObjectIDFromCoordinates(mouse_x, mouse_y);

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	//console.log(pressedID);
	
	for (var w in world) {
		if (world[w].ID == pressedID)
			return world[w];
	}
	return null;
}


//Texture utilities
function initTexture(textureFile) {
  textureArray[textureFile] = gl.createTexture();
  textureArray[textureFile].image = new Image();
  textureArray[textureFile].image.onload = function () {
    handleTextureLoaded(textureArray[textureFile])
  }; // async loading
  var path = "./assets/" + textureFile;
  //console.log(path)
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

		/*var newPos = [hero.position[x]+hero.offset[x], -1.0, hero.position[z]+hero.offset[z]];
		mvPushMatrix();
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, newPos);
		newPos[3] = 1.0;
		newPos = matrixVectorMultiply4(mvMatrix, newPos);
		console.log(newPos[z] + " - " + hero.position[z]);*/
		gl.uniform3f(
		  shaderProgram.pointLightingLocationUniform,
		  //hero.position[x],
		  hero.position[x]+camera.position[x] + camera.offset[x],
		  -hero.position[z]-camera.position[z] - camera.offset[z],
		  hero.position[y]+hero.offset[y]+camera.position[y] + camera.offset[y]
		  
		  //hero.position[z]
		  
		);
		//mvPopMatrix();

		gl.uniform3f(
		  shaderProgram.pointLightingColorUniform,
		  1.0,
		  1.0,
		  1.0
		);
		
		
		
		
		//DIRECTIONAL LIGHT (on hero)
		gl.uniform3f(
		  shaderProgram.directionalLightColorUniform,
		  0.0,
		  0.0,
		  0.0
		);
		//console.log(mvMatrix);
		/*var newPos = [hero.position[x], 5.0, 0.0];
		mvPushMatrix();
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, newPos);
		newPos[3] = 1.0;
		newPos = matrixVectorMultiply4(mvMatrix, newPos);
		//console.log(lightPos + " " + newPos);*/
		gl.uniform3f(
		  shaderProgram.directionalLightLocationUniform,
		  0.0,
		  -1.0,
		  0.0
		);
		//mvPopMatrix();
		
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
		//console.log("Drawing textures on: " + objectToDraw.name);
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


//// TEST LOAD TO LOAD TEXTURES ONLY ONCE ////
/*
function load(objectToLoad, objectURL)
{
	objectToLoad.vertexPositionBuffer = vertexPositionBuffer[objectURL];
	objectToLoad.textureBufer = textureBufer[objectURL];
	objectToLoad.normalBuffer = normalBuffer[objectURL];
	objectToLoad.vertexIndexBuffer = vertexIndexBuffer[objectURL];
	objectToLoad.textureFile = textureFile[objectURL];
	objectToLoad.collisionBox = objectCollisionBox[objectURL];
	objectToLoad.offset = objectOffset[objectURL];
}
*/
/*
function loadModels(objectURL)
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
		
		//var vertexIndex = [];
		//var textureIndex = [];
		//var normalIndex = [];
		
		
		var unpacked = {};
		unpacked.vertexPositions = [];
		unpacked.vertexTextureCoords = [];
		unpacked.vertexNormalCoords = [];
		unpacked.indexMatrix = [];
		unpacked.index = 0;
		unpacked.cache = {};
		
		console.log("LOADING " + objectURL);
		
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
				textureFile[objectURL] = vals[1];
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

				//vertexF.push(parseInt(vals[1]) - 1);
				//vertexF.push(parseInt(vals[2]) - 1);
				//vertexF.push(parseInt(vals[3]) - 1);
				//indexCount += 3;
			}
		}

		// align object to world
		objectOffset[objectURL] = [];
		objectOffset[objectURL][x] = 0;
		objectOffset[objectURL][y] = -minY;
		objectOffset[objectURL][z] = 0;
		

		// calculate collision
		objectCollisionBox[objectURL] = [maxX-minX, maxY-minY, maxZ-minZ];
		
		//console.log(textureIndex.length + " " + normalIndex.length);

		//console.log(unpacked.vertexPositions);
		
		vertexPositionBuffer[objectURL] = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer[objectURL]);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpacked.vertexPositions), gl.STATIC_DRAW);
		vertexPositionBuffer[objectURL].itemSize = 3;
		vertexPositionBuffer[objectURL].numItems = unpacked.vertexPositions.length;
		
		//Load normals
		if (vertexNormalCoords.length != 0) {
			normalBuffer[objectURL] = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer[objectURL]);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpacked.vertexNormalCoords), gl.STATIC_DRAW);
			normalBuffer[objectURL].itemSize = 3;
			normalBuffer[objectURL].numItems = unpacked.vertexNormalCoords.length;
		}
		
		//Load textures
		if (vertexTextureCoords.length != 0 && textureFile[objectURL] != null) {
			textureBuffer[objectURL] = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer[objectURL]);
			// Pass the texture coordinates into WebGL
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpacked.vertexTextureCoords), gl.STATIC_DRAW);
			textureBuffer[objectURL].itemSize = 2;
			textureBuffer[objectURL].numItems = unpacked.vertexTextureCoords;
		}
		
console.log(textureBuffer[objectURL]);

		// Now send the element array to GL
		vertexIndexBuffer[objectURL] = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer[objectURL]);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(unpacked.indexMatrix), gl.STATIC_DRAW);
		vertexIndexBuffer[objectURL].itemSize = 1;
		vertexIndexBuffer[objectURL].numItems = unpacked.indexMatrix.length;
	}
}
*/


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
		
		//var vertexIndex = [];
		//var textureIndex = [];
		//var normalIndex = [];
		
		
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

				//vertexF.push(parseInt(vals[1]) - 1);
				//vertexF.push(parseInt(vals[2]) - 1);
				//vertexF.push(parseInt(vals[3]) - 1);
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


function getDistanceBetweenVectors(vec1, vec2)
{
	var dist = Math.sqrt(
		(vec1[x] - vec2[x]) * (vec1[x] - vec2[x]) +
		(vec1[y] - vec2[y]) * (vec1[y] - vec2[y]) +
		(vec1[z] - vec2[z]) * (vec1[z] - vec2[z])
	);
	return dist;
}

function getRange(object1, object2)
{
	var dist = Math.sqrt(
		(object1.position[x] - object2.position[x]) * (object1.position[x] - object2.position[x]) +
		//(object1.position[y] - object2.position[y]) * (object1.position[y] - object2.position[y]) +
		(object1.position[z] - object2.position[z]) * (object1.position[z] - object2.position[z])
	);
	//console.log(dist);
	return dist;
}

//var cnt1 = 0;
//var cnt2 = 0;
//////////////////////////////// NEW SIMPLE COLLISION DETECTION ////////////////////////////////
function checkCollisionBetweenTwoObjectsSimple(object1, object2)
{
	
	var yDir = false;
	var y11 = object1.position[y]+object1.offset[y]-object1.collisionBox[y]/2; // o1 down
	var y12 = object1.position[y]+object1.offset[y]+object1.collisionBox[y]/2; // o1 up
	var y21 = object2.position[y]+object2.offset[y]-object2.collisionBox[y]/2; // o2 down
	var y22 = object2.position[y]+object2.offset[y]+object2.collisionBox[y]/2; // o2 up
	if(
		y12>y21 && y12<y22 ||
		y11>y21 && y11<y22 ||
		y11<y21 && y12>y21 ||
		y11<y22 && y12>y22
	)
	{
		//console.log(y11 + " " + y12 + " " + y21 + " " + y22);
		//console.log(object1.position[x] + " " + object1.position[z] + " " + object2.position[x] + " " + object2.position[z]);
		//console.log("true");
		//cnt1++;
		yDir = true;
	}
	/*
	cnt2++;
	
	if(yDir)
	{
		//console.log(getObjectCollisionDistance(object1, object2) +  " " + object1.position[x] + " " + object1.position[z] + " " + object2.position[x] + " " + object2.position[z]);
	
	}	
	*/
	//console.log(getObjectCollisionDistance(object1, object2) +  " " + y11 + " " + y22 + " ");
	//console.log(hero.position[y] + " " + hero.offset[y] + " " + world.position[y] + " " + world.offset[y]);
	//console.log(y11 + " " + y12 + " " + y21 + " " + y22);
	//console.log(getObjectCollisionDistance(object1, object2));
	//console.log(object1.name + " " + object2.name + " " + range + " " + dist1 + " " + dist2 + " " + coll);
	if(getObjectCollisionDistance(object1, object2)<0 && yDir) return true;
	else return false;
}

// circle distance based on x and z transformed to radius
function getObjectCollisionDistance(object1, object2)
{
	if(!object1.calculateCollision || !object2.calculateCollision) return 9999; // do not calc collision so collision never happens
	var range = getRange(object1, object2);
	//var dist1 = Math.max(object1.collisionBox[x], object1.collisionBox[z])/2;
	//var dist2 = Math.max(object2.collisionBox[x], object2.collisionBox[z])/2;
	
	var dist1 = (object1.collisionBox[x] + object1.collisionBox[z])/2;
	var dist2 = (object2.collisionBox[x] + object2.collisionBox[z])/2;
	//var dist3 = object1.collisionBox[y]/2 + object2.collisionBox[y]/2;
	return (range - (dist1/2 + dist2/2));
}




function checkCollisionBetweenAllObjects(object)
{
	if(!object.calculateCollision) return null;
	//////////////// check if click collides with any object ////////////////
	//////// check for enemy ////////
	for(var i in enemy)
	{
		//if(checkCollisionBetweenTwoObjects(object, enemy[i]))
		if(object != enemy[i] && enemy[i].calculateCollision && checkCollisionBetweenTwoObjectsSimple(object, enemy[i]))
		{
			return enemy[i];
		}
	}
	
	//////// check for pickable items ////////
	
	//////// check for world objects ////////
	
	//////// check for player ////////
	if(object != hero && hero.calculateCollision && checkCollisionBetweenTwoObjectsSimple(object, hero))
	{
	//	console.log("sdfsdfwefewfwef");
		return hero;
	}
	//console.log("WTF");
	
	//if(object == world && world.calculateCollision && checkCollisionBetweenTwoObjectsSimple(object, world))
	//{
	//	console.log("qwewqeqw");
	//	return world;
	//}
	
	//console.log("burek");
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
	var y11 = object1.position[y]+object1.offset[y]-object1NewCollisionBox[y]/2;
	var y12 = object1.position[y]+object1.offset[y]+object1NewCollisionBox[y]/2;
	var y21 = object2.position[y]+object2.offset[y]-object2NewCollisionBox[y]/2;
	var y22 = object2.position[y]+object2.offset[y]+object2NewCollisionBox[y]/2;
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