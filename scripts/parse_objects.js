var lines=["s s s s s ",
			" y k k y a",
			"a  y  y   ",
			"  xxxxxx a",
			"a         ",
			"  xxxxxx a",
			"a          ",
			"         a",
			"a     p   ",
			" s s s s a"];
	
	
var zamik=5;
	
function parseObjects(){
	for(var i=0; i<lines.length; i++)
			for(var j=0; j<lines[i].length; j++)
				if(lines[i][j]=='p'){
					hero.position[x] = 5*(j-zamik);
					hero.position[z] = 5*(i-zamik);
					//hero.position[x] -= 10;
					hero.load("./assets/ironman.obj"); 
				};
				
	for(var i=0; i<lines.length; i++)
			for(var j=0; j<lines[i].length; j++)
				switch(lines[i][j]){
					case 'x':
						enemy.push(new Hero());
						enemy[enemy.length-1].load("./assets/bucaNew.obj");
						enemy[enemy.length-1].name = "Evil Pumpkin Slave";
						enemy[enemy.length-1].position[x] = 5*(j-zamik);
						enemy[enemy.length-1].position[z] = 5*(i-zamik);
						//enemy[enemy.length-1].rotation[y] = -90;
						enemy[enemy.length-1].vec4Color = [0.5,0.25,0.75,1.0];
						break;
					case 'y':
						enemy.push(new Hero());
						enemy[enemy.length-1].load("./assets/feralGhoul.obj");
						enemy[enemy.length-1].name = "Feral Ghoul";
						enemy[enemy.length-1].position[x] = 5*(j-zamik);
						enemy[enemy.length-1].position[z] = 5*(i-zamik);
						//enemy[enemy.length-1].rotation[y] = -90;
						break;
					case 'k':
						enemy.push(new Hero());
						enemy[enemy.length-1].load("./assets/slasher.obj");
						enemy[enemy.length-1].name = "Wat iz dis???";
						enemy[enemy.length-1].position[x] = 5*(j-zamik);
						enemy[enemy.length-1].position[z] = 5*(i-zamik);
						//enemy[enemy.length-1].rotation[y] = -90;
						break;
					case 's':
						obstacle.push(new World());
						obstacle[obstacle.length - 1].name = "Obstacle";
						obstacle[obstacle.length - 1].load("./assets/wall_x.obj");
						obstacle[obstacle.length - 1].position[x] = 5*(j-zamik);
						obstacle[obstacle.length - 1].position[z] = 5*(i-zamik);
						obstacle[obstacle.length - 1].vec4Color = [0.5,0.5,0.5,1.0];
						break;
					case 'a':
						obstacle.push(new World());
						obstacle[obstacle.length - 1].name = "Obstacle";
						obstacle[obstacle.length - 1].load("./assets/wall_z.obj");
						obstacle[obstacle.length - 1].position[x] = 5*(j-zamik);
						obstacle[obstacle.length - 1].position[z] = 5*(i-zamik);
						obstacle[obstacle.length - 1].vec4Color = [0.5,0.5,0.5,1.0];
						break;
					deafult: break;
				}
}