function Hero() {
	this.HP = 100;
	this.HPRegen = 1;
	this.strength = 10;
	this.fury = 0;
	this.furyDecay = 1; //1 na sec
	this.criticalChance = 5; //0-100%
	this.discovery = 5; //% vecji statsi
	
	this.vertexPositionBuffer = null;
	this.vertexIndexBuffer = null;
	
	//temporary
	this.vec4Color = [1.0, 0.0, 0.0, 1.0];
	
}
Hero.prototype.load = function() {

    var request = new XMLHttpRequest();
	request.open("GET", "./assets/hero.obj");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			handleLoad(request.responseText);
		}
	}
	request.send();
	
	
	var handleLoad = function(data) {
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
		} else if (vals.length == 4 && vals[0] == "f") {
			vertexF.push(parseInt(vals[1]) - 1);
			vertexF.push(parseInt(vals[2]) - 1);
			vertexF.push(parseInt(vals[3]) - 1);
			indexCount += 3;
		}
	  }
	  
	  
	  hero.vertexPositionBuffer = gl.createBuffer();
	  gl.bindBuffer(gl.ARRAY_BUFFER, hero.vertexPositionBuffer);
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);
	  hero.vertexPositionBuffer.itemSize = 3;
	  hero.vertexPositionBuffer.numItems = vertexCount;
	  
	  
	   /*var cubeVertexIndices = [
		  0, 1, 2,      0, 2, 3,    // Front face
		  4, 5, 6,      4, 6, 7,    // Back face
		  8, 9, 10,     8, 10, 11,  // Top face
		  12, 13, 14,   12, 14, 15, // Bottom face
		  16, 17, 18,   16, 18, 19, // Right face
		  20, 21, 22,   20, 22, 23  // Left face
	  ];*/

	  // Now send the element array to GL
	  hero.vertexIndexBuffer = gl.createBuffer();
	  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, hero.vertexIndexBuffer);
	  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexF), gl.STATIC_DRAW);
	  hero.vertexIndexBuffer.itemSize = 1;
	  hero.vertexIndexBuffer.numItems = indexCount;
	  
	  
		
	}
	
	
};

Hero.prototype.draw = function() {
	
  //TEMP color
  gl.uniform4f(
      shaderProgram.tempColor,
      this.vec4Color[0],
      this.vec4Color[1],
	  this.vec4Color[2],
	  this.vec4Color[3]
    );
	
  //mat4.translate(mvMatrix, [-3.0, -50.0, -100.0]);
  mat4.translate(mvMatrix, [-3.0, 0.0, -10.0]);
  
  // Save the current matrix, then rotate before we draw.
  mvPushMatrix();
  
  //ZA IZOMETRIČNO
  //mat4.scale(mvMatrix, [50.0,1.0,50.0]);
  
  
  
  //mat4.rotate(mvMatrix, degToRad(rotationCube), [1, 1, 1]);

  // Draw the cube by binding the array buffer to the cube's vertices
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




