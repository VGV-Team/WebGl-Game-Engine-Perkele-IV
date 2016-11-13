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
	
	
	
	// movement waypoint object
	this.waypoint;
}

Hero.prototype.load = function() {
	load(this, "./assets/hero.obj");
	
	waypoint = new Entity();
	waypoint.load("./assets/mouse_click_waypoint.obj");
	waypoint.drawObject = false;
	
};


Hero.prototype.draw = function() {
	draw(this);
	waypoint.draw();
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
		
		waypoint.drawObject = true;
		waypoint.offset = 0; // to make sure it is half clipping through terrain
		waypoint.position = this.destination;
	}
	

	// if we are moving via waypoints
	if(this.waypointMove == true) this.updateMovement();
	
	
}

Hero.prototype.updateMovement = function(){
	
	this.direction[x] = this.destination[x] - this.position[x];
	this.direction[y] = this.destination[y] - this.position[y];
	this.direction[z] = this.destination[z] - this.position[z];
	
	
	var d = Math.sqrt(this.direction[x]*this.direction[x]+this.direction[y]*this.direction[y]+this.direction[z]*this.direction[z]);
	
	// checks if we already reached our destination
	if(d==0) {
		this.waypointMove=false;
		waypoint.drawObject = false;
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
		else 
		{
			this.position[x] += updateX;
		}
		
		if((this.direction[y]>=0 && this.position[y] + updateY > this.destination[y]) || 
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
		if(this.direction[x] > 0 && this.direction[z] > 0 ||
			this.direction[x] < 0 && this.direction[z] > 0)
			this.rotation[y] = radToDeg(Math.asin(this.direction[x]));
		if(this.direction[x] < 0 && this.direction[z] < 0 ||
			this.direction[x] > 0 && this.direction[z] < 0)
			this.rotation[y] = 180-radToDeg(Math.asin(this.direction[x]));
	}
}
