function World() {
	Entity.call(this);
	
	
	//this.vertexPositionBuffer = null;
	//this.vertexIndexBuffer = null;
	//this.vertexTextureCoordBuffer;
	
	this.vec4Color = [1.0, 1.0, 1.0, 1.0];
	
	
	//this.position = [0.0, 0.0, 0.0];
	//this.rotation = [0.0, 0.0, 0.0];
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