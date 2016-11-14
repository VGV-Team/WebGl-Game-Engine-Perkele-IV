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
	this.abilities["BasicAttack"] = new Ability("BasicAttack", 500, 0, 3);
	this.abilities.length = 1;
	
	//temporary
	this.vec4Color = [1.0, 1.0, 1.0, 1.0];

	
	this.directionVelocity = [10.0, 10.0, 10.0];
	
	// movement waypoint object
	this.waypoint;
	
	// So we don't keep attacking the monster every frame
	this.alreadyAttacked = true;
	
	this.isPlayer = false;
	
	this.viewRange = 10;
	this.target = null;
	
}
Hero.prototype = Object.create(Entity.prototype);


Hero.prototype.load = function(objectLocation) {
	Entity.prototype.load.call(this, objectLocation);
	
	this.waypoint = new Entity();
	this.waypoint.name = "Waypoint";
	Entity.prototype.load.call(this.waypoint, "./assets/mouse_click_waypoint.obj");
	this.waypoint.vec4Color = [1.0,0.25,0.25,1.0];
	this.waypoint.drawObject = false;
};


Hero.prototype.draw = function() {
	//console.log(this.waypoint.position);
	this.waypoint.draw();
	Entity.prototype.draw.call(this);
	
}

Hero.prototype.updatePlayer = function()
{
	// checks for mouse input
	if(currentlyPressedMouseCoordinates[x]!=null)
	{
		this.destination[x] = currentlyPressedMouseCoordinates[x];
		this.destination[y] = currentlyPressedMouseCoordinates[y];
		this.destination[z] = currentlyPressedMouseCoordinates[z];
		this.waypointMove = true;
		this.target = currentlyPressedEntity;
		
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
	
	
}

Hero.prototype.updateAI = function()
{
	// if is in range -> attacking
	if(getRange(this, hero) < this.viewRange)
	{
		console.log("I see you and I dont like you.");
		this.target = hero;
		this.waypointMove = true;
	}
	else
	{
		this.target = null;
		this.waypointMove = false;
	}
}


Hero.prototype.update = function()
{
	if(!this.isPlayer) return;
	
	//Entity.prototype.update.call(this);
	
	if(this.isPlayer) this.updatePlayer();
	else this.updateAI();
	
	
	if(this.target!=null)
	{
		//console.log(this.destination[x] + " " + this.destination[z])
		this.destination[x] = this.target.position[x];
		this.destination[y] = this.target.position[y];
		this.destination[z] = this.target.position[z];
	}
	
	
	for (var i in this.abilities) {
		this.abilities[i].update();
	}
	
	//console.log(isInRange(hero, enemy[0], this.abilities["BasicAttack"]));
	
	if (this.alreadyAttacked == false) {
		//console.log("ATT1");
		//if (this.waypointMove == false && this.abilities["BasicAttack"].ready == true && currentlyPressedEntity != null) {
		if (//this.waypointMove == false && 
			this.abilities["BasicAttack"].ready == true && 
			this.target != null &&
			getRange(hero, this.target) - this.abilities["BasicAttack"].range <= 0
		) 
		{
			console.log("ATT2");
			this.alreadyAttacked = true;
			// No fury cost so we don't need an else
			if (this.abilities["BasicAttack"].use(this))
				basicAttack(this, this.target);
		}
	}
	
}

