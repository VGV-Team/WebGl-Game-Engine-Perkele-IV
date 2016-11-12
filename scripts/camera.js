function Camera()
{
	this.position = [0.0, -5.0, -10.0];
	this.rotation = [30.0, 0.0, 0.0];
	this.scale = [1.0, 1.0, 1.0];

	this.direction = [0, 0, 0];
	this.directionVelocity = [0.25, 0.25, 0.25];
	// multiplier of camera speed
	
	
}

Camera.prototype.draw = function()
{
	mat4.identity(mvMatrix);
	
	//mat4.translate(mvMatrix, [0.0, -100.0, 0.0]);
	mat4.rotateX(mvMatrix, degToRad(this.rotation[x]));
	mat4.rotateY(mvMatrix, degToRad(this.rotation[y]));
	mat4.rotateZ(mvMatrix, degToRad(this.rotation[z]));
	
	mat4.translate(mvMatrix, this.position);
	
	//mat4.translate(mvMatrix, objectToDraw.position);

	

	//mat4.scale(mvMatrix, .scale);
}

Camera.prototype.update = function()
{
	this.position[x] += this.direction[x]*this.directionVelocity[x];
	this.position[y] += this.direction[y]*this.directionVelocity[y];
	this.position[z] += this.direction[z]*this.directionVelocity[z];
}