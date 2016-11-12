function Hero() {
	this.HP = 100;
	this.HPRegen = 1;
	this.strength = 10;
	this.fury = 0;
	this.furyDecay = 1; //1 per sec
	this.criticalChance = 5; //0-100%
	this.discovery = 5; //% chance of epic drop
	
	this.vertexPositionBuffer = null;
	this.vertexIndexBuffer = null;
	
	//temporary
	this.vec4Color = [1.0, 0.0, 0.0, 1.0];
	
	this.offset = 0;
	this.position = [0.0, 0.0, 0.0];
	this.rotation = [0.0, 0.0, 0.0];
	this.scale = [1.0, 1.0, 1.0];
	
	this.waypointMove = false;
	this.destination = [0.0, 0.0, 0.0];
	this.direction = [0.0, 0.0, 0.0];
	this.directionVelocity = [10.0, 10.0, 10.0];
	
	
}

Hero.prototype.load = function() {
	load(this, "./assets/hero.obj");
};


Hero.prototype.draw = function() {
	draw(this);
}

Hero.prototype.update = function()
{
	// checks for mouse input
	if(currentlyPressedMouseCoordinates[x]!=null)
	{
		this.destination[x] = currentlyPressedMouseCoordinates[x];
		this.destination[y] = currentlyPressedMouseCoordinates[y];
		this.destination[z] = currentlyPressedMouseCoordinates[z];
		this.waypointMove = true;
		
		currentlyPressedMouseCoordinates[x] = null;
		currentlyPressedMouseCoordinates[y] = null;
		currentlyPressedMouseCoordinates[z] = null;
	}
	
	
	

	// if we are moving via waypoints
	
	if(this.waypointMove == true)
	//{
		this.direction[x] = this.destination[x] - this.position[x];
		this.direction[y] = this.destination[y] - this.position[y];
		this.direction[z] = this.destination[z] - this.position[z];
	//}
	
	var d = Math.sqrt(this.direction[x]*this.direction[x]+this.direction[y]*this.direction[y]+this.direction[z]*this.direction[z]);
	
	// checks if we already reached our destination
	if(d==0) {
		this.waypointMove=false;
	}
	else {
		this.direction[x] = this.direction[x]/d;
		this.direction[y] = this.direction[y]/d;
		this.direction[z] = this.direction[z]/d;
	
	
		var updateX = this.direction[x]*this.directionVelocity[x]*timeTillLastUpdate;
		var updateY = this.direction[y]*this.directionVelocity[y]*timeTillLastUpdate;
		var updateZ = this.direction[z]*this.directionVelocity[z]*timeTillLastUpdate;
		
		// checks if we already passed our destination
		if((this.direction[x]>=0 && this.position[x] + updateX > this.destination[x]) || 
			(this.direction[x]<0 && this.position[x] + updateX < this.destination[x]))
		{
			this.position[x]=this.destination[x];
		}
		else this.position[x] += updateX;
		
		if((this.direction[y]>=0 && this.position[y] + updateY > this.destination[y]) || 
			(this.direction[y]<0 && this.position[y] + updateY < this.destination[y]))
		{
			this.position[y]=this.destination[y];
		}
		else this.position[y] += updateY;
		
		if((this.direction[z]>=0 && this.position[z] + updateZ > this.destination[z]) || 
			(this.direction[z]<0 && this.position[z] + updateZ < this.destination[z]))
		{
			this.position[z]=this.destination[z];
		}
		else this.position[z] += updateZ;
		
	}


}

