function Hero() {
	this.HP = 100;
	this.HPRegen = 1;
	this.strength = 10;
	this.fury = 0;
	this.furyDecay = 1; //1 per sec
	this.criticalChance = 5; //0-100%
	this.discovery = 5; //% chance of epic drop
	
	this.vertexPositionBuffer = null;
	this.vertexIndexBuffer = null;
	
	//temporary
	this.vec4Color = [1.0, 0.0, 0.0, 1.0];
	
	
	this.position = [0.0, 10.0, 0.0];
	this.rotation = [0.0, 0.0, 0.0];
	this.scale = [1.0, 1.0, 1.0];
	
	this.waypointMove = false;
	this.destination = [0.0, 0.0, 0.0];
	this.direction = [0.0, 0.0, 0.0];
	this.directionVelocity = [0.025, 0.025, 0.025];
	
	
}

Hero.prototype.load = function() {
	load(this, "./assets/hero.obj");
};


Hero.prototype.draw = function() {
	draw(this);
}

Hero.prototype.update = function()
{

	if(this.waypointMove == true)
	{
		this.direction[x] = this.destination[x] - this.position[x];
		this.direction[y] = this.destination[y] - this.position[y];
		this.direction[z] = this.destination[z] - this.position[z];
		
		
	}
	var d = Math.sqrt(this.direction[x]*this.direction[x]+this.destination[y]*this.position[y]+this.direction[z]*this.direction[z]);

	console.log(d + " " + this.direction[y] + " " + this.destination[y] + " " + this.position[y]);
	if(d==0) {
		this.direction[x] = 0;
		this.direction[y] = 0;
		this.direction[z] = 0;
		this.destination[x] = 0;
		this.destination[y] = 0;
		this.destination[z] = 0;
		this.waypointMove=false;
		return;
	}
	else {
		
		this.direction[x] = this.direction[x]/d;
		this.direction[y] = this.direction[y]/d;
		this.direction[z] = this.direction[z]/d;
	
		//console.log(this.direction[x] + " " + this.direction[y] + " " + this.direction[z]);
		//console.log(this.position[x] + " " + this.position[y] + " " + this.position[z]);
		
		if(Math.abs(this.position[x] + this.direction[x]*this.directionVelocity[x] - this.destination[x]) < 0.01) {
			this.direction[x]=0;
			this.position[x]=this.destination[x];
		}
		if(Math.abs(this.position[y] + this.direction[y]*this.directionVelocity[y] - this.destination[y]) < 0.01) {
			this.direction[y]=0;
			this.position[y]=this.destination[y];
		}
		if(Math.abs(this.position[z] + this.direction[z]*this.directionVelocity[z] - this.destination[z]) < 0.01) {
			this.direction[z]=0;
			this.position[z]=this.destination[z];
		}
		
		this.position[x] += this.direction[x]*this.directionVelocity[x];
		this.position[y] += this.direction[y]*this.directionVelocity[y];
		this.position[z] += this.direction[z]*this.directionVelocity[z];
	}


}

