function Item() {
	Entity.call(this);
	
	this.stats = {
	  itemName: "BUREK",
	  attack: 9000,
	  criticalChance: 100,
	  rarity: "LEGENDARY"
	};
	
	//this.isActive = false;
	
}
Item.prototype = Object.create(Entity.prototype);

Item.prototype.load = function(objectLocation) {
	Entity.prototype.load.call(this, objectLocation);
}


Item.prototype.draw = function() {
	if(!this.isActive) return;
	//this.waypoint.draw();
	Entity.prototype.draw.call(this);
	
}

Item.prototype.drawToFrameBuffer = function() {
	//console.log("KLICEM PARENTA");
	Entity.prototype.drawToFrameBuffer.call(this);
}