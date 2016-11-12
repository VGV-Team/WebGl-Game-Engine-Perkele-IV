function Hero() {
	this.HP = 100;
	this.HPRegen = 1;
	this.strength = 10;
	this.fury = 0;
	this.furyDecay = 1; //1 na sec
	this.criticalChance = 5; //0-100%
	this.discovery = 5; //% vecji statsi
	
	this.vertexPositionBuffer = null;
	this.vertexIndexBuffer = null;
	
	//temporary
	this.vec4Color = [1.0, 0.0, 0.0, 1.0];
	
	
	this.position = [0.0, 10.0, 0.0];
	this.rotation = [0.0, 0.0, 0.0];
	this.scale = [1.0, 1.0, 1.0];
	
	this.direction = [0.0, 0.0, 0.0];
	this.directionVelocity = [0.0, 0.0, 0.0];
}

Hero.prototype.load = function() {
	load(this, "./assets/hero.obj");
};


Hero.prototype.draw = function() {
	draw(this);
}

Hero.prototype.update = function()
{
	
}
