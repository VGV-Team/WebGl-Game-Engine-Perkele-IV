var lines=[
"               wssssssssw               ",
"               a        a               ",
"               a    d   a               ",
"               a        a               ",
"               a        a               ",
"               a        a               ",
"               a   k    a               ",
"               a k   k  a               ",
"  wssssssssw   a        a               ",
"  a        a   wsss ssssw               ",
"  a        a                            ",
"  a        a                            ",
"  a        a                            ",
"  a        a                            ",
"  a        a                            ",
"  a        a   wsss ssssw     wssssssssw",
"  a              k   k  a     a        a",
"  wsssss ssw   a        a     a  y   x a",
"               a    y   a     a        a",
"               a        a     a   x    a",
"               a y                   x a",
"               a        a     a        a",
"  wsssss ssw   a     x  a     a  x     a",
"  a              y   y  a     a      p a",
"  a        a   wsss ssssw     wssssssssw",
"  a        a                            ",
"  a        a                            ",
"  a        a                            ",
"  a        a                            ",
"  a        a                            ",
"  a        a   wsss ssssw               ",
"  a        a   a    x   a               ",
"  wssssssssw   a        a               ",
"               a    y   a               ",
"               a  y     a               ",
"               a        a               ",
"               a  y   y a               ",
"               a        a               ",
"               a    k   a               ",
"               wssssssssw               "
];
	
	
var zamik=lines.length/2;
	
function parseObjects(){
	for(var i=0; i<lines.length; i++)
			for(var j=0; j<lines[i].length; j++)
				if(lines[i][j]=='p'){
					hero.position[x] = 5*(j-zamik);
					hero.position[z] = 5*(i-zamik);
					hero.position[y] = t[i][j][0];
					//hero.position[x] -= 10;
					hero.load("./assets/Ironman.obj"); 
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
						enemy[enemy.length-1].position[y] = t[i][j][0];
						//enemy[enemy.length-1].rotation[y] = -90;
						enemy[enemy.length-1].abilities["BasicAttack"].cooldown = 1000;
						enemy[enemy.length-1].vec4Color = [0.5,0.25,0.75,1.0];
						break;
					case 'y':
						enemy.push(new Hero());
						enemy[enemy.length-1].load("./assets/feralGhoul.obj");
						enemy[enemy.length-1].name = "Feral Ghoul";
						enemy[enemy.length-1].position[x] = 5*(j-zamik);
						enemy[enemy.length-1].position[z] = 5*(i-zamik);
						enemy[enemy.length-1].position[y] = t[i][j][0];
						//enemy[enemy.length-1].rotation[y] = -90;
						break;
					case 'k':
						enemy.push(new Hero());
						enemy[enemy.length-1].load("./assets/slasher.obj");
						enemy[enemy.length-1].name = "Wat iz dis???";
						enemy[enemy.length-1].position[x] = 5*(j-zamik);
						enemy[enemy.length-1].position[z] = 5*(i-zamik);
						enemy[enemy.length-1].position[y] = t[i][j][0];
						//enemy[enemy.length-1].rotation[y] = -90;
						break;
					case 'd':	
						enemy.push(new Hero());
						enemy[enemy.length-1].name="DIABLO";
						enemy[enemy.length-1].load("./assets/diablo.obj");
						enemy[enemy.length-1].position[x] = 5*(j-zamik);
						enemy[enemy.length-1].position[z] = 5*(i-zamik);
						enemy[enemy.length-1].position[y] = t[i][j][0];
						enemy[enemy.length-1].collisionBox[z] -= 5;
						enemy[enemy.length-1].collisionBox[x] -= 5;
						enemy[enemy.length-1].viewRange = 20;
						break;
					case 's':
						obstacle.push(new World());
						obstacle[obstacle.length - 1].name = "Obstacle";
						obstacle[obstacle.length - 1].load("./assets/wall_x.obj");
						obstacle[obstacle.length - 1].position[x] = 5*(j-zamik);
						obstacle[obstacle.length - 1].position[z] = 5*(i-zamik);
						obstacle[obstacle.length - 1].position[y] = t[i][j][0];
						break;
					case 'a':
						obstacle.push(new World());
						obstacle[obstacle.length - 1].name = "Obstacle";
						obstacle[obstacle.length - 1].load("./assets/wall_z.obj");
						obstacle[obstacle.length - 1].position[x] = 5*(j-zamik);
						obstacle[obstacle.length - 1].position[z] = 5*(i-zamik);
						obstacle[obstacle.length - 1].position[y] = t[i][j][0];

						break;
					case 'w':
						obstacle.push(new World());
						obstacle[obstacle.length - 1].name = "Obstacle";
						obstacle[obstacle.length - 1].load("./assets/wall_z.obj");
						obstacle[obstacle.length - 1].position[x] = 5*(j-zamik);
						obstacle[obstacle.length - 1].position[z] = 5*(i-zamik);
						obstacle[obstacle.length - 1].position[y] = t[i][j][0];
						obstacle.push(new World());
						obstacle[obstacle.length - 1].name = "Obstacle";
						obstacle[obstacle.length - 1].load("./assets/wall_x.obj");
						obstacle[obstacle.length - 1].position[x] = 5*(j-zamik);
						obstacle[obstacle.length - 1].position[z] = 5*(i-zamik);
						obstacle[obstacle.length - 1].position[y] = t[i][j][0];
						break;
					deafult: break;
				}
}