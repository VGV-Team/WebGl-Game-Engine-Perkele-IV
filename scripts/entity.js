function Entity() {
	
	this.ID = -1;
	
	this.name = "";
	
	this.offset = [0.0,0.0,0.0];
	this.position = [0.0, 0.0, 0.0];
	this.rotation = [0.0, 0.0, 0.0];
	this.scale = [1.0, 1.0, 1.0];
	
	this.waypointMove = false;
	this.destination = [0.0, 0.0, 0.0];
	this.direction = [0.0, 0.0, 0.0];
	this.directionVelocity = [1.0, 1.0, 1.0];
	
	this.vertexPositionBuffer = null;
	this.textureBuffer = null;
	this.normalBuffer = null;
	this.vertexIndexBuffer = null;
	this.textureFile = null;
	
	// Color this object is going to be drawn in the framebuffer
	this.frameBufferColor = [];
	
	this.vec4Color = [0.5, 0.5, 0.5, 1.0];
	this.collisionBox = [0.0,0.0,0.0]; // width, height, depth
	
	
	this.drawObject = true;
	this.calculateCollision = true;
	this.isActive = true;
}
Entity.prototype.load = function(objectLocation) {
	load(this, objectLocation);
	
	// Set a color this object is going to be recognized by in the framebuffer
	//console.log(this.name + " TAKES ID " + globalID);
	this.ID = globalID;
	globalID++;
	//console.log(this.name + " TAKES ID " + this.ID);
	var r = 0.0;
	var g = 0.0;
	var b = 0.0;
	
	r = this.ID;
	while (r > 255) {
		g += 1.0;
		r -= 255;
	}
	
	this.frameBufferColor = [r/255.0, g/255.0, b, 1.0];
};

Entity.prototype.draw = function() {
	if(this.drawObject)	draw(this);
}

Entity.prototype.drawToFrameBuffer = function() {
	//console.log("KLICEM DRAWBUFFER");
	if (this.drawObject) drawObjectToFrameBuffer(this);
}

Entity.prototype.update = function() {
	
	if(this.waypointMove == true) 
	{
		this.direction[x] = this.destination[x] - this.position[x];
		this.direction[y] = this.destination[y] - this.position[y];
		this.direction[z] = this.destination[z] - this.position[z];
	
		this.updateMovement();
		
	}
	
}





Entity.prototype.updateMovement = function() {
	
	//console.log("s: " + this.direction[x] + " " + this.direction[z] + " " + this.position[x] + " " + this.position[z]);
	
	
	// TODO: get correct world position !!!
	//this.destination[y]=world.position[y];
	var place = getTopWorldObject(this);
	if(place!=null)
	{
		this.position[y] = place.position[y]+place.offset[y]+place.collisionBox[y]; // FIXIT: stopala so notr v stengah
		//console.log(this.destination[y]);
		this.direction[y] = 0;
	}
	
	//this.destination[y] = 0;
	//console.log(place.position[y]+" "+place.offset[y]+" "+hero.position[y]+" "+hero.offset[y]);
	//console.log(hero.position[y]);
	var d = Math.sqrt(this.direction[x]*this.direction[x]+this.direction[y]*this.direction[y]+this.direction[z]*this.direction[z]);
	
	// checks if we already reached our destination
	if(d==0) {
		this.waypointMove=false;
		this.waypoint.drawObject = false;
	}
	else {
		//console.log(this.destination[y] + " " + this.position[y] + " " + d + " " + this.direction[x] + " " + this.direction[y] + " " + this.direction[z]);

		
		this.direction[x] = this.direction[x]/d;
		this.direction[y] = this.direction[y]/d;
		this.direction[z] = this.direction[z]/d;
	
	
		var updateX = this.direction[x]*this.directionVelocity[x]*timeTillLastUpdate;
		//var updateY = this.direction[y]*this.directionVelocity[y]*timeTillLastUpdate;
		var updateY = this.direction[y]*this.directionVelocity[x]*timeTillLastUpdate;
		var updateZ = this.direction[z]*this.directionVelocity[z]*timeTillLastUpdate;
		
		
		// rotation towards waypoint
		/*
		if(this.direction[x] >= 0 && this.direction[z] >= 0 ||
			this.direction[x] < 0 && this.direction[z] >= 0)
			this.rotation[y] = radToDeg(Math.asin(this.direction[x]));
		if(this.direction[x] < 0 && this.direction[z] < 0 ||
			this.direction[x] >= 0 && this.direction[z] < 0)
			this.rotation[y] = 180-radToDeg(Math.asin(this.direction[x]));
		*/
		if(this.direction[z] >= 0) this.rotation[y] = radToDeg(Math.asin(this.direction[x]));
		else this.rotation[y] = 180-radToDeg(Math.asin(this.direction[x]));
		
		
		
		
		// checks if we collide with other objects
		
		//// OLD COLLISION DETECTION
		//var collision = checkCollisionWithObject([this.position[x] + updateX, this.position[y] + updateY, this.position[z] + updateZ]);
		//if(collision!=null) return;
		
		//// NEW COLLISION DETECTION
		// we need to fo fake update, calculate and then revert changes
	
		//console.log(this.position[y] + " " + (this.position[y] + updateY))
	
		this.position[x] += updateX;
		this.position[y] += updateY;
		this.position[z] += updateZ;
		//this.position[y]-=10;
		var collision = checkCollisionBetweenAllObjects(this);
		//console.log(collision);
		this.position[x] -= updateX;
		this.position[y] -= updateY;
		this.position[z] -= updateZ;
		//this.position[y]+=10;
		//console.log("sp: " + this.direction[x] + " " + this.direction[z] + " " + this.position[x] + " " + this.position[z]);
	
		if(collision!=null) {
			//console.log(this.name + " " + collision.name);
			if(collision == this.target) return; // if we hit our target then no need to move further
			
			
			
			if(collision.name == "Obstacle") // if we hit obstacle then calculate collision differently
			{
				
			}
			else // Moves player to left or right and rechecks collision with objects
			{
				var dir = getDirectionBetweenVectors(this.position, collision.position);
				
				//console.log(getVectorAngle(this.direction,dir) + " " + dir[x] + " " + this.direction[x] + " | " + dir[z] + " " + this.direction[z]);
				
				
				/*
				var q = getDirectionBetweenVectors(hero.position, enemy[0].position);
				var dest = normalizeVector(hero.destination);
				var v1 = getVectorAngle(dest, normalizeVector(q));
				console.log(v1);
				*/
				
				var tmp1 = [];
				tmp1[x] = -dir[z];
				tmp1[y] = 0;
				tmp1[z] = dir[x];
				tmp1 = normalizeVector(tmp1);
				var tmp2 = [];
				tmp2[x] = dir[z];
				tmp2[y] = 0;
				tmp2[z] = -dir[x];
				tmp2 = normalizeVector(tmp2);
				
				var newPos1 = [];
				newPos1[x] = this.position[x] + tmp1[x]*this.directionVelocity[x]*timeTillLastUpdate;
				newPos1[y] = 0;
				newPos1[z] = this.position[z] + tmp1[z]*this.directionVelocity[z]*timeTillLastUpdate;
				
				var newPos2 = [];
				newPos2[x] = this.position[x] + tmp2[x]*this.directionVelocity[x]*timeTillLastUpdate;
				newPos2[y] = 0;
				newPos2[z] = this.position[z] + tmp2[z]*this.directionVelocity[z]*timeTillLastUpdate;
				
				
				
				var d1 = getDistanceBetweenVectors(newPos1, this.destination);
				var d2 = getDistanceBetweenVectors(newPos2, this.destination);
				
				
				var tmpX=this.position[x];
				var tmpY=this.position[y];
				var tmpZ=this.position[z];
				
				// move to one side and check for collision
				
				this.position[x]=newPos1[x];
				this.position[y]=newPos1[y];
				this.position[z]=newPos1[z];
				var ok1=true;
				for(var i in obstacle)
				{
					if(checkCollisionWithObjectRound(this, obstacle[i]))
					//if(checkCollisionWithObject(newPos1, obstacle[i]))
					{
						ok1 = false;
						break;
					}
				}
				
				/*
				this.position[x] += tmp1[x];
				this.position[y] = 0
				this.position[z] += tmp1[z];
				if(!checkCollisionBetweenAllObjects(this)) ok1=false;
				this.position[x] -= tmp1[x];
				this.position[y] = 0
				this.position[z] -= tmp1[z];
				*/
				
				
				// move to the other side and check for collision

				this.position[x]=newPos2[x];
				this.position[y]=newPos2[y];
				this.position[z]=newPos2[z];
				var ok2=true;
				for(var i in obstacle)
				{
					if(checkCollisionWithObjectRound(this, obstacle[i]))
					//if(checkCollisionWithObject(newPos2, obstacle[i]))
					{
						ok2 = false;
						break;
					}
				}
				
				// restore values
				this.position[x]=tmpX;
				this.position[y]=tmpY;
				this.position[z]=tmpZ;
				
				/*
				this.position[x] += tmp2[x];
				this.position[y] = 0
				this.position[z] += tmp2[z];
				if(!checkCollisionBetweenAllObjects(this)) ok2=false;
				this.position[x] -= tmp2[x];
				this.position[y] = 0
				this.position[z] -= tmp2[z];
				*/
				
				
				// decide if left or right is better
				if(d1<d2 && ok1) 
				{
					this.direction[x] = tmp1[x];
					this.direction[z] = tmp1[z];
				}
				else if(ok2)
				{
					this.direction[x] = tmp2[x];
					this.direction[z] = tmp2[z];
				}
				else return;
				
				
			}
			

			
			//// old attempt to calc collision
			
			/*
			var Qvec1 = [dir[x], 0, dir[z]];
			var Qvec1dis = Qvec1[x]*Qvec1[x]+Qvec1[z]*Qvec1[z];
			Qvec1[x] = Qvec1[x] / Qvec1dis;
			Qvec1[z] = Qvec1[z] / Qvec1dis;
			var Qvec2 = [dir.position[x], 0, dir.position[z]];
			var Qvec2dis = Qvec2[x]*Qvec2[x]+Qvec2[z]*Qvec2[z];
			Qvec2[x] = Qvec2[x] / Qvec2dis;
			Qvec2[z] = Qvec2[z] / Qvec2dis;
			
			
			//console.log(getVectorAngle(hero.position, enemy[0].position));
			
			
			if(this.direction[x]<=0 &&
				this.direction[z]<=0 &&
				
				dir[x] <= this.direction[x] && 
				dir[z] >= this.direction[z] && 
				collision.position[x]<=this.position[x] &&
				collision.position[z]<=this.position[z]
				) // bottom-right -> top-right
			{
				
				this.direction[x] = -dir[z];
				this.direction[z] = dir[x];
			}
			else if(this.direction[x]<=0 &&
				this.direction[z]<=0 &&
				dir[x] >= this.direction[x] &&  
				dir[z] <= this.direction[z] &&
				collision.position[x]<=this.position[x] &&
				collision.position[z]<=this.position[z]) // bottom-right -> bottom-left
			{
				this.direction[x] = dir[z];
				this.direction[z] = -dir[x];
			}
			
			else if(this.direction[x]<=0 &&
				this.direction[z]<=0 &&
				dir[x] <= this.direction[x] && 
				dir[z] >= this.direction[z] &&
				collision.position[x]<=this.position[x] &&
				collision.position[z]>this.position[z]) // bottom-right -> top-right past
			{
				this.direction[x] = -dir[z];
				this.direction[z] = dir[x];
			}
			else if(this.direction[x]<=0 &&
				this.direction[z]<=0 &&
				dir[x] >= this.direction[x] && 
				dir[z] <= this.direction[z] &&
				collision.position[x]>this.position[x] &&
				collision.position[z]<=this.position[z]) // bottom-right -> bottom-left past
			{
				this.direction[x] = dir[z];
				this.direction[z] = -dir[x];
			}
			
			
			
			
			if(this.direction[x]>=0 &&
				this.direction[z]>=0 &&
				
				dir[x] >= this.direction[x] && 
				dir[z] <= this.direction[z] && 
				collision.position[x]>=this.position[x] &&
				collision.position[z]>=this.position[z]
				) // bottom-right -> top-right
			{
				
				//this.direction[x] = -dir[z];
				//this.direction[z] = dir[x];
			}
			if(this.direction[x]>=0 &&
				this.direction[z]>=0 &&
				dir[x] <= this.direction[x] &&  
				dir[z] <= this.direction[z] &&
				collision.position[x]>=this.position[x] &&
				collision.position[z]>=this.position[z]) // bottom-right -> bottom-left
			{
				//this.direction[x] = dir[z];
				//this.direction[z] = -dir[x];
			}
			
			if(this.direction[x]>=0 &&
				this.direction[z]>=0 &&
				dir[x] >= this.direction[x] && 
				dir[z] <= this.direction[z] &&
				collision.position[x]>=this.position[x] &&
				collision.position[z]<=this.position[z]) // bottom-right -> top-right past
			{
				//this.direction[x] = -dir[z];
				//this.direction[z] = dir[x];
			}
			if(this.direction[x]>=0 &&
				this.direction[z]>=0 &&
				dir[x] >= this.direction[x] && 
				dir[z] <= this.direction[z] &&
				collision.position[x]>this.position[x] &&
				collision.position[z]<=this.position[z]) // bottom-right -> bottom-left past
			{
				//this.direction[x] = dir[z];
				//this.direction[z] = -dir[x];
			}
			*/
			
			
			/*
			console.log(
				this.direction[x] + " " + 
				this.direction[z] + " " + 
				this.position[x] + " " + 
				this.position[z]
			);
			*/
			
			var dirVecNormalized = normalizeVector(this.direction);
			var updateX = dirVecNormalized[x]*this.directionVelocity[x]*timeTillLastUpdate;
			var updateY = dirVecNormalized[y]*this.directionVelocity[y]*timeTillLastUpdate;
			var updateZ = dirVecNormalized[z]*this.directionVelocity[z]*timeTillLastUpdate;	
			this.position[x] += updateX;
			this.position[y] += updateY;
			this.position[z] += updateZ;
			var collision1 = checkCollisionBetweenAllObjects(this);
			if(collision1!=null)
			{
				this.position[x] -= updateX;
				this.position[y] -= updateY;
				this.position[z] -= updateZ;
				return;
			}
			else return;
			
			
			
			
			//this.updateMovement();
			/*
			// no move if we collide - this was old system
			this.waypoint.drawObject = false;
			this.waypointMove = false;
			return; 
			*/
		}
		
		
		
		
		//console.log(this.direction[x] + " " + this.direction[y] + " " + this.direction[z] + " " + this.destination[y] + " " + this.position[y]);
		//console.log(this.destination[y]);
		
		
		
		
		
		var reached = [0,0,0];
		// checks if we already passed our destination
		if((this.direction[x]>=0 && this.position[x] + updateX > this.destination[x]) || 
			(this.direction[x]<0 && this.position[x] + updateX < this.destination[x]))
		{
			reached[x] = 1;
			var tmp = this.position[x];
			this.position[x]=this.destination[x];
			for(var i in obstacle)
			{
				//if(checkCollisionBetweenTwoObjects(this, obstacle[i]))
				if(checkCollisionWithObjectRound(this, obstacle[i]))
				{
					ok = false;
					//this.position[z] = obstacle[i].position[z]+obstacle[i].offset[z]+obstacle[i].collisionBox[x];
					break;
				}
			}
			if(!ok) this.position[x] = tmp;
		}
		else 
		{
			
			this.position[x] += updateX;
			var ok=true;
			for(var i in obstacle)
			{
				//if(checkCollisionBetweenTwoObjects(this, obstacle[i]))
				if(checkCollisionWithObjectRound(this, obstacle[i]))
				{
					ok = false;
					//this.position[x] = obstacle[i].position[x]+obstacle[i].offset[x]+obstacle[i].collisionBox[x];
					break;
				}
			}
			if(!ok) this.position[x] -= updateX;

		}
		/*
		if((this.direction[y]>=0 && this.position[y] + updateY > this.destination[y]) || 
			(this.direction[y]<0 && this.position[y] + updateY < this.destination[y]))
		{
			reached[y] = 1;
			this.position[y]=this.destination[y];
		}
		else 
		{
			this.position[y] += updateY;
		}
		*/
		if((this.direction[z]>=0 && this.position[z] + updateZ > this.destination[z]) || 
			(this.direction[z]<0 && this.position[z] + updateZ < this.destination[z]))
		{
			reached[z] = 1;
			var tmp = this.position[z];
			this.position[z]=this.destination[z];
			for(var i in obstacle)
			{
				//if(checkCollisionBetweenTwoObjects(this, obstacle[i]))
				if(checkCollisionWithObjectRound(this, obstacle[i]))
				{
					ok = false;
					//this.position[z] = obstacle[i].position[z]+obstacle[i].offset[z]+obstacle[i].collisionBox[x];
					break;
				}
			}
			if(!ok) this.position[z] = tmp;
		}
		else 
		{
			
			this.position[z] += updateZ;
			var ok=true;
			for(var i in obstacle)
			{
				//if(checkCollisionBetweenTwoObjects(this, obstacle[i]))
				if(checkCollisionWithObjectRound(this, obstacle[i]))
				{
					ok = false;
					//this.position[z] = obstacle[i].position[z]+obstacle[i].offset[z]+obstacle[i].collisionBox[x];
					break;
				}
			}
			if(!ok) this.position[z] -= updateZ;
			

		}
		//console.log("qq: " + reached + " " + this.direction[z] + " " + this.position[x] + " " + this.position[z]);
	
		if(reached[x]==1 && reached[z]==1)
		{
			//console.log("qwe");
			this.waypointMove=false;
			this.waypoint.drawObject = false;
		}
		
		
	}
}

