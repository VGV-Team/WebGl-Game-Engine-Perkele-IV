function Entity() {
	this.name = "";
	
	this.offset = [0.0,0.0,0.0];
	this.position = [0.0, 0.0, 0.0];
	this.rotation = [0.0, 0.0, 0.0];
	this.scale = [1.0, 1.0, 1.0];
	
	this.waypointMove = false;
	this.destination = [0.0, 0.0, 0.0];
	this.direction = [0.0, 0.0, 0.0];
	this.directionVelocity = [1.0, 1.0, 1.0];
	
	this.vertexPositionBuffer = null;
	this.vertexIndexBuffer = null;
	
	this.vec4Color = [0.5, 0.5, 0.5, 1.0];
	this.collisionBox = [0.0,0.0,0.0]; // width, height, depth
	
	
	this.drawObject = true;
}
Entity.prototype.load = function(objectLocation) {
	load(this, objectLocation);
};

Entity.prototype.draw = function() {
	if(this.drawObject)	draw(this);
}

Entity.prototype.update = function() {
	
	if(this.waypointMove == true) Entity.prototype.updateMovement.call(this);
}

Entity.prototype.updateMovement = function() {
	
	this.direction[x] = this.destination[x] - this.position[x];
	this.direction[y] = this.destination[y] - this.position[y];
	this.direction[z] = this.destination[z] - this.position[z];
	
	
	var d = Math.sqrt(this.direction[x]*this.direction[x]+this.direction[y]*this.direction[y]+this.direction[z]*this.direction[z]);
	
	// checks if we already reached our destination
	if(d==0) {
		this.waypointMove=false;
		this.waypoint.drawObject = false;
	}
	else {
		this.direction[x] = this.direction[x]/d;
		this.direction[y] = this.direction[y]/d;
		this.direction[z] = this.direction[z]/d;
	
	
		var updateX = this.direction[x]*this.directionVelocity[x]*timeTillLastUpdate;
		var updateY = this.direction[y]*this.directionVelocity[y]*timeTillLastUpdate;
		var updateZ = this.direction[z]*this.directionVelocity[z]*timeTillLastUpdate;
		
		// checks if we collide with other objects
		var collision = checkCollisionWithObjects([this.position[x] + updateX, this.position[y] + updateY, this.position[z] + updateZ]);
		if(collision!=null) return;
		
		// checks if we already passed our destination
		if((this.direction[x]>=0 && this.position[x] + updateX > this.destination[x]) || 
			(this.direction[x]<0 && this.position[x] + updateX < this.destination[x]))
		{
			this.position[x]=this.destination[x];
		}
		else 
		{
			this.position[x] += updateX;
		}
		
		if((this.direction[y]>=0 && this.position[x] + updateX > this.destination[y]) || 
			(this.direction[y]<0 && this.position[y] + updateY < this.destination[y]))
		{
			this.position[y]=this.destination[y];
		}
		else 
		{
			this.position[y] += updateY;
		}
		
		if((this.direction[z]>=0 && this.position[z] + updateZ > this.destination[z]) || 
			(this.direction[z]<0 && this.position[z] + updateZ < this.destination[z]))
		{
			this.position[z]=this.destination[z];
		}
		else 
		{
			this.position[z] += updateZ;
		}
		
		// rotation towards waypoint
		if(this.direction[x] >= 0 && this.direction[z] >= 0 ||
			this.direction[x] < 0 && this.direction[z] >= 0)
			this.rotation[y] = radToDeg(Math.asin(this.direction[x]));
		if(this.direction[x] < 0 && this.direction[z] < 0 ||
			this.direction[x] >= 0 && this.direction[z] < 0)
			this.rotation[y] = 180-radToDeg(Math.asin(this.direction[x]));
	}
}