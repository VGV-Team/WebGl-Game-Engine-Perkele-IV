function Ability(aname, acooldown, afuryreq) {
	
	this.abilityName = aname;
	this.cooldown = acooldown;
	this.timeReady = 0;
	this.furyRequired = afuryreq;
	this.ready = true;
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
	
	if (casterObject.fury < this.furyRequired) return false;
	
	this.ready = false;
	this.timeReady = lastUpdateTime + this.cooldown;
	casterObject.fury -= this.furyRequired;
	
	return true;
}