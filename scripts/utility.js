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
	mat4.translate(mvMatrix, [0.0,objectToDraw.offset,0.0]);

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

		// align object to world
		var min = 9999;

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

				// align object to world
				if(parseFloat(vals[2])<min)
				{
					min = parseFloat(vals[2]);
				}
			  
			  
			} else if (vals.length == 4 && vals[0] == "f") {
				vertexF.push(parseInt(vals[1]) - 1);
				vertexF.push(parseInt(vals[2]) - 1);
				vertexF.push(parseInt(vals[3]) - 1);
				indexCount += 3;
			}
		}

		// align object to world
		objectToLoad.offset = -min;
		//objectToLoad.position[y]=-min;

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
