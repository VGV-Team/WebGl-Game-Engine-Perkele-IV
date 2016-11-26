function Camera()
{
	Entity.call(this);
	
	
	
	//this.position = [0.0, -5.0, -10.0];
	//this.scale = [1.0, 1.0, 1.0];

	//this.direction = [0, 0, 0];
	this.directionVelocity = [0.25, 0.25, 0.25];
	// multiplier of camera speed
	
	// for top down camera
	this.offset = [0.0, -10.0, -10.0];
	this.rotation = [50.0, 0.0, 0.0];
	
	// for free camera
	//this.offset = [-6.5, -12, -6.5]
	//this.rotation = [60.0, -45.0, 0.0];
	
	this.freeCamera = true;
}
Camera.prototype = Object.create(Entity.prototype);

Camera.prototype.draw = function()
{
	mat4.identity(mvMatrix);
	mat4.rotateX(mvMatrix, degToRad(this.rotation[x]));
	mat4.rotateY(mvMatrix, degToRad(this.rotation[y]));
	mat4.rotateZ(mvMatrix, degToRad(this.rotation[z]));
	mat4.translate(mvMatrix, this.position);
	mat4.translate(mvMatrix, [this.offset[x],this.offset[y],this.offset[z]]);

	//mat4.translate(mvMatrix, [0.0, -100.0, 0.0]);
	//mat4.translate(mvMatrix, objectToDraw.position);
	//mat4.scale(mvMatrix, .scale);
}

Camera.prototype.update = function()
{
	//this.offset = [0.0, -5.0, -10.0];
	//this.position[x] += this.direction[x]*this.directionVelocity[x];
	//this.position[y] += this.direction[y]*this.directionVelocity[y];
	//this.position[z] += this.direction[z]*this.directionVelocity[z];
	
	if(this.freeCamera)
	{
		this.offset[x] += this.direction[x]*this.directionVelocity[x];
		this.offset[y] += this.direction[y]*this.directionVelocity[y];
		this.offset[z] += this.direction[z]*this.directionVelocity[z];
	}
	else
	{
		this.position[x] = -hero.position[x];
		this.position[y] = -hero.position[y];
		this.position[z] = -hero.position[z];
	}
	
	
	
	
	Entity.prototype.update.call(this);
}