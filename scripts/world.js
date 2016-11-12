function World() {
	this.vertexPositionBuffer = null;
	this.vertexIndexBuffer = null;
	//this.vertexTextureCoordBuffer;
	
	this.vec4Color = [1.0, 1.0, 1.0, 1.0];
	
	this.offset = 0;
	this.position = [0.0, 0.0, 0.0];
	this.rotation = [0.0, 0.0, 0.0];
	this.scale = [1.0, 1.0, 1.0];
}

World.prototype.load = function() {
	load(this, "./assets/world_plane.obj");
};

World.prototype.draw = function() {
	
	draw(this);
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