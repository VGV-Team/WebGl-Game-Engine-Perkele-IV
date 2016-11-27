function Hero() {
	
	Entity.call(this);
	
	this.HP = 250;
	this.maxHP = 250;
	this.HPRegen = 1;
	this.strength = 10;
	this.fury = 0;
	this.maxFury = 100;
	this.furyDecay = 3; //1 per sec
	this.criticalChance = 10; //0-100%
	this.discovery = 50; //% chance of epic drop
	
	//abilities
	this.abilities = [];
	this.abilities["BasicAttack"] = new Ability("BasicAttack", 700, -10, 1);
	this.abilities.length = 1;
	
	//temporary
	this.vec4Color = [1.0, 1.0, 1.0, 1.0];

	
	this.directionVelocity = [8.0, 8.0, 8.0];
	
	// movement waypoint object
	this.waypoint;
	
	// So we don't keep attacking the monster every frame
	this.alreadyAttacked = true;
	
	this.isPlayer = false;
	
	this.viewRange = 10;
	this.target = null;
	
	// Temporarily filled with items
	this.inventory = [];
	this.equippedWeapon = null;
	
	// 360 SLASH ANIMATION
	this.slashAnim = false;
	this.slashRotation = 20;
	this.slashRotationCount = 0;
	
}
Hero.prototype = Object.create(Entity.prototype);

Hero.prototype.load = function(objectLocation) {
	Entity.prototype.load.call(this, objectLocation);
	
	this.waypoint = new Entity();
	this.waypoint.name = "Waypoint";
	Entity.prototype.load.call(this.waypoint, "./assets/mouse_click_waypoint.obj");
	this.waypoint.vec4Color = [1.0,0.25,0.25,1.0];
	this.waypoint.drawObject = false;
	if (this == hero) {
		
		this.HP = 1000;
		this.maxHP = 1000;
		
		this.inventory.push({
			itemName: "Glamdring",
			attack: 1,
			criticalChance: 0,
			rarity: "SPECIAL"
		});
		/*
		this.inventory.push({
			itemName: "GUARD SWORD",
			attack: 5,
			criticalChance: 2,
			rarity: "RARE"
		});
		this.inventory.push({
			itemName: "SWORD OF PALADINS",
			attack: 15,
			criticalChance: 5,
			rarity: "LEGENDARY"
		});
		this.inventory.push({
			itemName: "BANISHER OF DEMONS",
			attack: 25,
			criticalChance: 10,
			rarity: "EPIC"
		});
		*/
		this.changeEquippedWeapon(0);
		
		this.abilities["360Slash"] = new Ability("360Slash", 3500, 50, 1.2);
		this.abilities["Heal"] = new Ability("Heal", 6000, 25, 0);
	}
	
	

	
};

Hero.prototype.changeEquippedWeapon = function (itemIndex) {
	if (this.equippedWeapon) {
		this.strength -= this.equippedWeapon.attack;
		this.criticalChance -= this.equippedWeapon.criticalChance;
	}
	this.equippedWeapon = this.inventory[itemIndex];
	this.strength += this.equippedWeapon.attack;
	this.criticalChance += this.equippedWeapon.criticalChance;
	ui.updateWeaponDescription();
	ui.updateInventoryItemList();
	ui.playSelectWeaponAudio();
}

Hero.prototype.draw = function() {
	this.waypoint.draw();
	Entity.prototype.draw.call(this);
	
}

Hero.prototype.drawToFrameBuffer = function() {
	//console.log("KLICEM PARENTA");
	Entity.prototype.drawToFrameBuffer.call(this);
}


Hero.prototype.updatePlayer = function()
{
	if (this.slashAnim) {
		this.rotation[y] -= this.slashRotation;
		this.slashRotationCount++;
		if (this.slashRotationCount >= 360/this.slashRotation) {
			this.slashRotationCount = 0;
			this.slashAnim = false;
			this.rotation[y] += 360;
		}
	}
	
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
	
	// Fury decay
	this.fury -= (this.furyDecay * (timeTillLastUpdate));
	if (this.fury < 0) this.fury = 0;
	//this.fury = Math.round(this.fury*100)/100;
	
	//HP regen
	this.HP += (this.HPRegen * (timeTillLastUpdate));
	if (this.HP > this.maxHP) this.HP = this.maxHP;
	//this.HP = Math.round(this.HP*100)/100;
}

Hero.prototype.updateAI = function()
{
	// if is in range -> attacking
	if(getRange(this, hero) < this.viewRange)
	{
		//console.log("I see you and I dont like you.");
		//if(this.target == hero) return;
		this.target = hero;
		this.waypointMove = true;
		if (this.abilities["BasicAttack"].ready)
		{
			this.alreadyAttacked = false;
			//this.waypointMove = false;
		}	
		
		//DIABLO
		if (globalDiabloMet == false && this.name == "DIABLO") {
			globalDiabloMet = true;
			ui.playDiabloBoastAudio();
		}
		
		
	}
	else
	{
		this.target = null;
		this.waypointMove = false;
	}
}


Hero.prototype.update = function()
{
	//return;
	//if(!this.isPlayer) return;
	if(!this.isActive) return;
	
	
	
	
	
	
	
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
	//console.log(getObjectCollisionDistance(this, enemy[0]));
	if (this.alreadyAttacked == false) {
		//if(this.target != null) console.log(getRange(hero, this.target) + " " + this.abilities["BasicAttack"].range);
		//if(this.target != null) console.log(getObjectCollisionDistance(hero, this.target));
		
		//console.log("ATT1");
		//if (this.waypointMove == false && this.abilities["BasicAttack"].ready == true && currentlyPressedEntity != null) {
		if (//this.waypointMove == false && 
			this.abilities["BasicAttack"].ready == true && 
			this.target != null && this.target.name != "item" && 
			//getRange(hero, this.target) - this.abilities["BasicAttack"].range <= 0
			getObjectCollisionDistance(this, this.target) - this.abilities["BasicAttack"].range <= 0
		) 
		{
			
			//console.log("ATT2");
			this.alreadyAttacked = true;
			// No fury cost so we don't need an else
			if (this.abilities["BasicAttack"].use(this)) {
				if (this == hero) ui.playBasicAttackAudio();
				basicAttack(this, this.target);
			}
				
		}
	}
	
	if(this.target!=null && this.target.name == "item" && getObjectCollisionDistance(this, this.target)<0)
	{
		/*
		var ok=true;
		for(var i in item)
		{
			if(getObjectCollisionDistance(this, item[i])<0)
			{
				item[i].isActive = false;
				item[i].drawObject = false;
				item[i].calculateCollision = false;

				this.inventory.push(item[i].stats);
				ok=false;
				break;
			}
		}
		if(ok!=true)
		{
			this.waypointMove = false;
			this.target = null;
			this.waypoint.drawObject = false;
		}
		*/
		
		this.target.isActive = false;
		this.target.drawObject = false;
		this.target.calculateCollision = false;
		//console.log(this.target);
		
		ui.playPickupAudio();
		
		this.inventory.push(this.target.stats);
		ui.updateInventoryItemList();
		
		this.waypointMove = false;
		this.target = null;
		this.waypoint.drawObject = false;
		
		console.log("You collected item!");
	}
	
	
	
	
	Entity.prototype.update.call(this);
}

Hero.prototype.useAbility = function(abilityName) {
	
	console.log("Hero is using ability " + abilityName);
	
	if (abilityName == "360Slash") {
		if (this.abilities["360Slash"].use(this)) {
			
			this.slashAnim = true;
			ui.playWhirlwindAudio();
			
			// Check all enemies
			for (var e in enemy) {
				// If current enemy in range, damage it!
				if (getObjectCollisionDistance(this, enemy[e]) - this.abilities["360Slash"].range <= 0) {
					// DIRTY FIX
					this.strength *= 2;
					
					basicAttack(this, enemy[e]);
					
					// DIRTY FIX
					this.strength /= 2;
				}
			}
			
		} else {
			//"Not enough fury" audio? TODO
		}
	}
	
	if (abilityName == "Heal") {
		if (this.abilities["Heal"].use(this)) {
			
			ui.playHealAudio();
			
			//Heal
			this.HP += this.maxHP/2;
			if (this.HP > this.maxHP) this.HP = this.maxHP;
			
		} else {
			//"Not enough fury" audio? TODO
		}
	}
	
}
