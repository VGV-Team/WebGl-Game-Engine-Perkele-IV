function World() {
	Entity.call(this);
	
	//this.passable = true;
	
	//this.vertexPositionBuffer = null;
	//this.vertexIndexBuffer = null;
	//this.vertexTextureCoordBuffer;
	
	this.vec4Color = [1.0, 1.0, 1.0, 1.0];
	
	
	//this.position = [0.0, 0.0, 0.0];
	//this.rotation = [2.0, 0.0, 0.0];
	//this.scale = [1.0, 1.0, 1.0];
}
World.prototype = Object.create(Entity.prototype);

World.prototype.load = function(objectLocation) {
	Entity.prototype.load.call(this, objectLocation);
	//load(this, "./assets/world_plane.obj");
};

World.prototype.draw = function() {
	Entity.prototype.draw.call(this);
	//draw(this);
}

World.prototype.drawToFrameBuffer = function() {
	//console.log("KLICEM PARENTA");
	Entity.prototype.drawToFrameBuffer.call(this);
}

//
// handleLoadedWorld
//
// Initialisation of world 
//


//
// loadWorld
//
// Loading world 
//