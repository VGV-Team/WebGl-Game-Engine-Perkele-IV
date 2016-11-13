function Entity() {
	this.offset = 0;
	this.position = [0.0, 0.0, 0.0];
	this.rotation = [0.0, 0.0, 0.0];
	this.scale = [1.0, 1.0, 1.0];
	
	this.vec4Color = [0.5, 0.5, 0.5, 1.0];
	
	this.drawObject = true;
}
Entity.prototype.load = function(textureLocation) {
	load(this, textureLocation);
};

Entity.prototype.draw = function() {
	if(this.drawObject)	draw(this);
}