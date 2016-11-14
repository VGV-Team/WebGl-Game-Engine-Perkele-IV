function Hero() {
	
	Entity.call(this);
	
	this.HP = 100;
	this.maxHP = 100;
	this.HPRegen = 1;
	this.strength = 10;
	this.fury = 0;
	this.furyDecay = 1; //1 per sec
	this.criticalChance = 5; //0-100%
	this.discovery = 5; //% chance of epic drop
	
	//abilities
	this.abilities = [];
	this.abilities["BasicAttack"] = new Ability("BasicAttack", 500, 0);
	this.abilities.length = 1;
	
	//temporary
	this.vec4Color = [0.5, 0.0, 0.0, 1.0];
	
	this.directionVelocity = [10.0, 10.0, 10.0];
	
	// movement waypoint object
	this.waypoint;
	
	// So we don't keep attacking the monster every frame
	this.alreadyAttacked = true;
	
}
Hero.prototype = Object.create(Entity.prototype);


Hero.prototype.load = function(objectLocation) {
	Entity.prototype.load.call(this, objectLocation);
	
	this.waypoint = new Entity();
	Entity.prototype.load.call(this.waypoint, "./assets/mouse_click_waypoint.obj");
	this.waypoint.vec4Color = [1.0,0.25,0.25,1.0];
	this.waypoint.drawObject = false;
};


Hero.prototype.draw = function() {
	//console.log(this.waypoint.position);
	this.waypoint.draw();
	Entity.prototype.draw.call(this);
	
}

Hero.prototype.update = function()
{
	
	for (var i in this.abilities) {
		this.abilities[i].update();
	}
	
	// checks for mouse input
	if(currentlyPressedMouseCoordinates[x]!=null)
	{
		this.destination[x] = currentlyPressedMouseCoordinates[x];
		this.destination[y] = currentlyPressedMouseCoordinates[y];
		this.destination[z] = currentlyPressedMouseCoordinates[z];
		this.waypointMove = true;
		
		if (this.abilities["BasicAttack"].ready)
			this.alreadyAttacked = false;
		
		// prepare mouse for next input
		currentlyPressedMouseCoordinates[x] = null;
		currentlyPressedMouseCoordinates[y] = null;
		currentlyPressedMouseCoordinates[z] = null;
		// We need this var for drawin UI
		//currentlyPressedEntity = null;
		
		this.waypoint.drawObject = true;
		this.waypoint.offset = [0.0,0.0,0.0]; // to make sure it is half clipping through terrain
		this.waypoint.position = this.destination;
	}
	
	Entity.prototype.update.call(this);
	
	if (this.alreadyAttacked == false) {
		console.log("ATT1");
		if (this.waypointMove == false && this.abilities["BasicAttack"].ready == true && currentlyPressedEntity != null) {
			console.log("ATT2");
			this.alreadyAttacked = true;
			// No fury cost so we don't need an else
			if (this.abilities["BasicAttack"].use(this))
				basicAttack(this, currentlyPressedEntity);
		}
	}
	
}