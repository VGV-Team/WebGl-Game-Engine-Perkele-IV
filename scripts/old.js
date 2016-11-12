// Buffers
var pyramidVertexPositionBuffer;
var pyramidVertexColorBuffer;
var cubeVertexPositionBuffer;
var cubeVertexColorBuffer;
var cubeVertexIndexBuffer;

// Variables for storing curent rotation of pyramid and cube
var rotationPyramid = 0;
var rotationCube = 0;

// Helper variable for animation
var lastTime = 0;

//
// animate
//
// Called every time before redeawing the screen.
//
function animate() {
  var timeNow = new Date().getTime();
  if (lastTime != 0) {
    var elapsed = timeNow - lastTime;

    // rotate pyramid and cube for a small amount
    rotationPyramid += (90 * elapsed) / 1000.0;
    rotationCube += (75 * elapsed) / 1000.0;
	//console.log(speed);
  }
  lastTime = timeNow;
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we have
// two objecta -- a simple cube and pyramidﬂ.
//
function initBuffers() {
  // PYRAMID
  // Create a buffer for the pyramid's vertices.
  pyramidVertexPositionBuffer = gl.createBuffer();

  // Select the pyramidVertexPositionBuffer as the one to apply vertex
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
  var vertices = [
    // Front face
     0.0,  1.0,  0.0,
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
    // Right face
     0.0,  1.0,  0.0,
     1.0, -1.0,  1.0,
     1.0, -1.0, -1.0,
    // Back face
     0.0,  1.0,  0.0,
     1.0, -1.0, -1.0,
    -1.0, -1.0, -1.0,
    // Left face
     0.0,  1.0,  0.0,
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0
  ];

  // Pass the list of vertices into WebGL to build the shape. We
  // do this by creating a Float32Array from the JavaScript array,
  // then use it to fill the current vertex buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  pyramidVertexPositionBuffer.itemSize = 3;
  pyramidVertexPositionBuffer.numItems = 12;

  // Now set up the colors for the vertices
  pyramidVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexColorBuffer);
  var colors = [
    // Front face
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    // Right face
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    // Back face
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    // Left face
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0
  ];

  // Pass the colors into WebGL
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  pyramidVertexColorBuffer.itemSize = 4;
  pyramidVertexColorBuffer.numItems = 3;

  // CUBE
  // Create a buffer for the cube's vertices.
  cubeVertexPositionBuffer = gl.createBuffer();
  
  // Select the cubeVertexPositionBuffer as the one to apply vertex
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  
  // Now create an array of vertices for the cube.
  vertices = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ];
  
  // Now pass the list of vertices into WebGL to build the shape. We
  // do this by creating a Float32Array from the JavaScript array,
  // then use it to fill the current vertex buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  cubeVertexPositionBuffer.itemSize = 3;
  cubeVertexPositionBuffer.numItems = 24;

  // Now set up the colors for the vertices. We'll use solid colors
  // for each face.
  cubeVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
  colors = [
      [1.0, 0.0, 0.0, 1.0], // Front face
      [1.0, 1.0, 0.0, 1.0], // Back face
      [0.0, 1.0, 0.0, 1.0], // Top face
      [1.0, 0.5, 0.5, 1.0], // Bottom face
      [1.0, 0.0, 1.0, 1.0], // Right face
      [0.0, 0.0, 1.0, 1.0]  // Left face
  ];

  // Convert the array of colors into a table for all the vertices.
  var unpackedColors = [];
  for (var i in colors) {
    var color = colors[i];

    // Repeat each color four times for the four vertices of the face
    for (var j=0; j < 4; j++) {
          unpackedColors = unpackedColors.concat(color);
      }
  }

  // Pass the colors into WebGL
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
  cubeVertexColorBuffer.itemSize = 4;
  cubeVertexColorBuffer.numItems = 24;

  // Build the element array buffer; this specifies the indices
  // into the vertex array for each face's vertices.
  cubeVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.
  var cubeVertexIndices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
  ];

  // Now send the element array to GL
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
  cubeVertexIndexBuffer.itemSize = 1;
  cubeVertexIndexBuffer.numItems = 36;
}




function wtfIsThis()
{
		gl.uniform4f(
      shaderProgram.tempColor,
      this.vec4Color[0],
      this.vec4Color[1],
	  this.vec4Color[2],
	  this.vec4Color[3]
    );
	// Activate textures
	 mvPushMatrix();
	 
  //ZA IZOMETRI»NO
  //mat4.scale(mvMatrix, [50.0,0.0,50.0]);
  
  
  mat4.translate(mvMatrix, [0.0, -10.0, 0.0]);
  /*gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, wallTexture);
  gl.uniform1i(shaderProgram.samplerUniform, 0);

  // Set the texture coordinates attribute for the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);*/

  // Draw the world by binding the array buffer to the world's vertices
  // array, setting attributes, and pushing it to GL.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
  // Set the colors attribute for the vertices.
  /*gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);*/

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);

  // Draw the cube.
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  // Restore the original matrix
  mvPopMatrix();
}

