function Ability(aname, acooldown, afuryreq, range) {
	
	this.abilityName = aname;
	this.cooldown = acooldown;
	this.timeReady = 0;
	this.furyRequired = afuryreq;
	this.ready = true;
	this.range = range;
}

Ability.prototype.update = function() {
	if (this.ready == false) {
		if (this.timeReady <= lastUpdateTime) {
			this.ready = true;
		}
	}
}

//casterObject = hero ?
/*Ability.prototype.setAction = function(functionAction, casterObject, targetObject) {
	
	if (casterObject.fury < this.furyRequired) return false;
	
	casterObject.fury -= this.furyRequired;
	functionAction(casterObject, targetObject);		
}*/

//Set ready time and ready to false
Ability.prototype.use = function(casterObject) {
	
	if (this.ready == false) return false;
	if (casterObject.fury < this.furyRequired) return false;
	
	this.ready = false;
	this.timeReady = lastUpdateTime + this.cooldown;
	casterObject.fury -= this.furyRequired;
	if (casterObject.fury > casterObject.maxFury) casterObject.fury = casterObject.maxFury;
	
	casterObject.waypointMove = false;
	casterObject.waypoint.drawObject = false;
	
	return true;
}