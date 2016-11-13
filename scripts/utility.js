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

	// Save the current matrix, then translate, rotate and scale before we draw.
	mvPushMatrix();	

	mat4.translate(mvMatrix, objectToDraw.position);
	mat4.translate(mvMatrix, objectToDraw.offset);

	mat4.rotateX(mvMatrix, degToRad(objectToDraw.rotation[0]));
	mat4.rotateY(mvMatrix, degToRad(objectToDraw.rotation[1]));
	mat4.rotateZ(mvMatrix, degToRad(objectToDraw.rotation[2]));

	mat4.scale(mvMatrix, objectToDraw.scale);

	
	//ZA IZOMETRIÈNO
	//mat4.scale(mvMatrix, [50.0,1.0,50.0]);



	//mat4.rotate(mvMatrix, degToRad(rotationCube), [1, 1, 1]);

	// Draw the cube by binding the array buffer to the cube's vertices
	// array, setting attributes, and pushing it to GL.
	gl.bindBuffer(gl.ARRAY_BUFFER, objectToDraw.vertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, objectToDraw.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// Set the colors attribute for the vertices.
	/*gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);*/

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
		var vertexCount = 0;
		var vertexPositions = [];
		var vertexTextureCoords = [];
		var vertexF = [];
		var indexCount = 0;
		for (var i in lines) {
			var vals = lines[i].split(" ");
			if (vals.length == 4 && vals[0] == "v") {
				// It is a line describing a vertex; get X, Y and Z first
				vertexPositions.push(parseFloat(vals[1]));
				vertexPositions.push(parseFloat(vals[2]));
				vertexPositions.push(parseFloat(vals[3]));		
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
			  
			  
			} else if (vals.length == 4 && vals[0] == "f") {
				vertexF.push(parseInt(vals[1]) - 1);
				vertexF.push(parseInt(vals[2]) - 1);
				vertexF.push(parseInt(vals[3]) - 1);
				indexCount += 3;
			}
		}

		// align object to world
		//objectToLoad.offset[x] = -minY;
		objectToLoad.offset[y] = -minY;
		//objectToLoad.offset[z] = -minY;
		

		// calculate collision
		objectToLoad.collisionBox = [maxX-minX, maxY-minY, maxZ-minZ];
		

		objectToLoad.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, objectToLoad.vertexPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);
		objectToLoad.vertexPositionBuffer.itemSize = 3;
		objectToLoad.vertexPositionBuffer.numItems = vertexCount;

		// Now send the element array to GL
		objectToLoad.vertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objectToLoad.vertexIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexF), gl.STATIC_DRAW);
		objectToLoad.vertexIndexBuffer.itemSize = 1;
		objectToLoad.vertexIndexBuffer.numItems = indexCount;
	}
}


function calculateTime()
{
	timeTillLastUpdate = (new Date().getTime() - lastUpdateTime)/1000;
	lastUpdateTime = new Date().getTime();
}


// coordinates - x,y,z coordinates to check
// returns x,y,z and clicked object. Null if no results found
function checkCollisionWithObjects(coordinates)
{
	//////////////// check if click collides with any object ////////////////
		
	//////// check for enemy ////////
	for(var i in enemy)
	{
		if(
		(enemy[i].position[x]-enemy[i].collisionBox[x]/2) < coordinates[x] &&
		(enemy[i].position[x]+enemy[i].collisionBox[x]/2) > coordinates[x] &&
		(enemy[i].position[y]-enemy[i].collisionBox[y]/2) < coordinates[y] &&
		(enemy[i].position[y]+enemy[i].collisionBox[y]/2) > coordinates[y] &&
		(enemy[i].position[z]-enemy[i].collisionBox[z]/2) < coordinates[z] &&
		(enemy[i].position[z]+enemy[i].collisionBox[z]/2) > coordinates[z]
		)
		{
			return [enemy[i].position[x], enemy[i].position[y], enemy[i].position[z], enemy[i]];
		}
	}
	
	//////// check for pickable items ////////
	
	//////// check for world objects ////////
	
	
	
	return null;
}