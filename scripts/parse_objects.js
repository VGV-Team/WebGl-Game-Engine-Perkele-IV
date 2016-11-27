var lines=[
"               wssssssssw               ",
"               a        a               ",
"               a    d   a               ",
"               a        a               ",
"               ac      ta               ",
"               a       ca               ",
"               a   k    a               ",
"               a k   k  a               ",
"   wssssssssw  a        a               ",
"   ax       a  wsss ssssw               ",
"   a c   y  a                           ",
"   a        a                           ",
"   a c   x  a                           ",
"   a        a                           ",
"   a  y   t a                           ",
"   a    x   a  wsss ssssw     wssssssssw",
"   a t           k   k  a     a    f   a",
"   wsssss ssw  a        a     a  y   x a",
"               a c  y   a     a   t c  a",
"               a      f a     a   x    a",
"               a y  c                x a",
"               a        a     a c   f  a",
"   wsssss ssw  a   t x  a     a  x    ta",
"   a   y         y   y  a     a   f  p a",
"   a  c     a  wsss ssssw     wssssssssw",
"   a  t     a                           ",
"   a     y  a                           ",
"   a  y   c a                           ",
"   a  c     a                           ",
"   a k  t   a                           ",
"   a     c  a  wsss ssssw               ",
"   wssssssssw  a c  x   a               ",
"               a f     fa               ",
"               a    y t a               ",
"               a  y     a               ",
"               a      c a               ",
"               a  y   y a               ",
"               a        a               ",
"               a c  k  fa               ",
"               wssssssssw               "
];
	
	
var zamik=lines.length/2;
	
function parseObjects(){
	/*
	for(var i=0; i<lines.length; i++)
			for(var j=0; j<lines[i].length; j++)
				if(lines[i][j]=='p'){
					hero.position[x] = 5*(j-zamik);
					hero.position[z] = 5*(i-zamik);
					hero.position[y] = t[i][j][0];
					//hero.position[x] -= 10;
					hero.load("./assets/Ironman.obj"); 
				};
	*/
	
	for(var i=0; i<lines.length; i++)
			for(var j=0; j<lines[i].length; j++)
				switch(lines[i][j]){
					case 'p':
						hero.position[x] = 5*(j-zamik);
						hero.position[z] = 5*(i-zamik);
						hero.position[y] = t[i][j][0];
						//hero.position[x] -= 10;
						hero.load("./assets/Ironman.obj"); 
						break;
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
						enemy[enemy.length-1].maxHP = 100;
						enemy[enemy.length-1].HP = 100;
						enemy[enemy.length-1].strength = 15;
						break;
					case 'f':
						enemy.push(new Hero());
						enemy[enemy.length-1].load("./assets/frog.obj");
						enemy[enemy.length-1].name = "Abathur's Mutation";
						enemy[enemy.length-1].position[x] = 5*(j-zamik);
						enemy[enemy.length-1].position[z] = 5*(i-zamik);
						enemy[enemy.length-1].position[y] = t[i][j][0];
						//enemy[enemy.length-1].rotation[y] = -90;
						enemy[enemy.length-1].abilities["BasicAttack"].cooldown = 500;
						enemy[enemy.length-1].collisionBox[z] /= 2;
						enemy[enemy.length-1].collisionBox[x] /= 2;
						enemy[enemy.length-1].vec4Color = [0.5,0.25,0.75,1.0];
						enemy[enemy.length-1].maxHP = 100;
						enemy[enemy.length-1].HP = 100;
						enemy[enemy.length-1].strength = 10;
						break;
					case 'y':
						enemy.push(new Hero());
						enemy[enemy.length-1].load("./assets/feralGhoul.obj");
						enemy[enemy.length-1].name = "Feral Ghoul";
						enemy[enemy.length-1].position[x] = 5*(j-zamik);
						enemy[enemy.length-1].position[z] = 5*(i-zamik);
						enemy[enemy.length-1].position[y] = t[i][j][0];
						//enemy[enemy.length-1].rotation[y] = -90;
						enemy[enemy.length-1].maxHP = 250;
						enemy[enemy.length-1].HP = 250;
						enemy[enemy.length-1].strength = 25;
						break;
					case 'k':
						enemy.push(new Hero());
						enemy[enemy.length-1].load("./assets/slasher.obj");
						//enemy[enemy.length-1].name = "Wat iz dis???";
						enemy[enemy.length-1].name = "Abomination";
						enemy[enemy.length-1].position[x] = 5*(j-zamik);
						enemy[enemy.length-1].position[z] = 5*(i-zamik);
						enemy[enemy.length-1].position[y] = t[i][j][0];
						//enemy[enemy.length-1].rotation[y] = -90;
						enemy[enemy.length-1].maxHP = 500;
						enemy[enemy.length-1].HP = 500;
						enemy[enemy.length-1].strength = 50;
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
						enemy[enemy.length-1].HP = 2000;
						enemy[enemy.length-1].maxHP = 2000;
						enemy[enemy.length-1].strength = 70;
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
					case 'c':
						obstacle.push(new World());
						obstacle[obstacle.length - 1].name = "Obstacle";
						obstacle[obstacle.length - 1].load("./assets/crate.obj");
						obstacle[obstacle.length - 1].position[x] = 5*(j-zamik);
						obstacle[obstacle.length - 1].position[z] = 5*(i-zamik);
						obstacle[obstacle.length - 1].position[y] = t[i][j][0];
						break;
					case 't':
						obstacle.push(new World());
						obstacle[obstacle.length - 1].name = "Obstacle";
						obstacle[obstacle.length - 1].load("./assets/Trunk.obj");
						obstacle[obstacle.length - 1].position[x] = 5*(j-zamik);
						obstacle[obstacle.length - 1].position[z] = 5*(i-zamik);
						obstacle[obstacle.length - 1].position[y] = t[i][j][0];
						obstacle[obstacle.length - 1].collisionBox[x] -= 0.1;
						obstacle[obstacle.length - 1].collisionBox[z] -= 1.1;
						break;
						
					deafult: break;
				}
}