function Camera()
{
	this.position = [0.0, -5.0, -10.0];
	this.rotation = [45.0, 0.0, 0.0];
	this.scale = [1.0, 1.0, 1.0];

	this.speed = [0, 0, 0];

	// multiplier of camera speed
	var kSpeed = 10;
	
	
}




Camera.prototype.draw = function()
{
	mat4.identity(mvMatrix);
	
	//mat4.translate(mvMatrix, [0.0, -100.0, 0.0]);
	mat4.rotateX(mvMatrix, degToRad(cameraRotation[x]));
	mat4.rotateY(mvMatrix, degToRad(cameraRotation[y]));
	mat4.rotateZ(mvMatrix, degToRad(cameraRotation[z]));
	
	mat4.translate(mvMatrix, cameraPosition);
	
	//mat4.translate(mvMatrix, objectToDraw.position);

	

	//mat4.scale(mvMatrix, .scale);
}

Camera.prototype.update = ()
{
	this.position[x] += speed[x];
	this.position[y] += speed[y];
	this.position[z] += speed[z];
}