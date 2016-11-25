function gameLoop()
{
	//var t0 = performance.now();
	//console.log(textureBuffer);
	
	requestAnimationFrame(calculateTime);
	
	//requestAnimationFrame(animate);
	
	handleKeys();
	
	// updates all objects
	
	if (globalGameOver == false) {
		hero.update();
		for(var i in enemy) enemy[i].update();
		for(var i in item) item[i].update();
	} else {
		//FADE PLAYER LIGHT
		hero.waypoint.drawObject = false;
		globalAttenuationFactor *= 1.02;
	}
	
	
	camera.update();
	//console.log(getVectorAngle(hero.position, enemy[0].position));

	ui.update();
	//checkMouse();
	handleMouseViaBuffer()
	
	// draws camera and all objects	
    drawScene();
	
	//console.log(getObjectCollisionDistance(hero, enemy[0]) + " " + getDirectionBetweenVectors(hero.position, enemy[0].position));
	
	//var t1 = performance.now();
	//console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
	
	//console.log(hero.position[x] + " " + hero.position[z])

	//checkCollisionBetweenTwoObjectsSimple(hero, enemy[0]);
	//console.log(getObjectCollisionDistance(hero, enemy[0]));
	//console.log(world.position[y] + " " + world.offset[y]);
	
	//drawFrameBufferWorld()
	
	/*
	var q = getDirectionBetweenVectors(hero.position, enemy[0].position);
	var dest = normalizeVector(hero.destination);
	var v1 = getVectorAngle(dest, normalizeVector(q));
	console.log(v1);
	*/
	
	//var v2 = getVectorAngle(normalizeVector(q), dest);
	//console.log(q[x] + " " + q[z]);
	//console.log(v[x] + " " + v[z]);
	//console.log(v1 + " || " + dest[x] + " " + dest[z] +" || "+q[x] + " "+q[z]);
	
	//console.log(timeTillLastUpdate);
}



function drawLights() {
	
	mvPushMatrix();

	mat4.translate(mvMatrix, hero.position);
	mat4.translate(mvMatrix, hero.offset);

	var newMatrix = unpackMat4(mvMatrix);
	
	pointLightPosition = [0.0, 5.0, 0.0, 1.0];
	
	pointLightPosition = matrixVectorMultiply4(newMatrix, pointLightPosition);
	pointLightPosition[x] /= pointLightPosition[3];
	pointLightPosition[y] /= pointLightPosition[3];
	pointLightPosition[z] /= pointLightPosition[3];
	pointLightPosition[3] = 1;
	
	mvPopMatrix();
}


function drawScene() {
	// NUJNO ZLO
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//PERSPEKTIVA
	// Establish the perspective with which we want to view the
	// scene. Our field of view is 45 degrees, with a width/height
	// ratio and we only want to see objects between 0.1 units
	// and 100 units away from the camera.
	mat4.perspective(90, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	//mat4.identity(pMatrix);
	//mat4.ortho(0, 1280, 0, 720, 0.01, 1000.0, pMatrix);
	
	// CAMERA POSITION
	camera.draw();

	drawLights();
	
	////// OBJECT DRAWING
	hero.draw();
	
	for(var i in enemy) enemy[i].draw();
	for(var i in item) item[i].draw();
	//console.log(getObjectCollisionDistance(hero, enemy[0]) + " " + hero.calculateCollision + " " + enemy[0].calculateCollision);
	//console.log(hero.HP);
	
	
	//world.draw();
	//world1.draw();
	for (var w in world) world[w].draw();
	for (var o in obstacle) obstacle[o].draw();
	
	
}


function clearGlobals() {
	rttFramebuffer = null;
	rttTexture = null;
	gl = null;
	shaderProgram = null;
	canvas = null;
	globalID = 1;
	hero = null;
	world = null;
	camera = null;
	enemy = null;
	item = [];
	world = [];
	obstacle = [];
	ui = null;
	pointLightPosition = [0.0, 0.0, 0.0, 1.0];
	directionalLightPos = [0.0, 0.0, 0.0, 1.0];
	textureArray = {};


	lastUpdateTime = 0;
	timeTillLastUpdate = 0;


	currentlyPressedKeys = {};
	currentlyPressedMouseCoordinates = [null, null, null];
	currentlyPressedEntity = null;

	// Is left mouse pressed? boolean for synchronized framebuffer checking
	leftMousePressed = false;
	leftMouseMoved = false;
	leftMouseEvent = null;


	mvMatrixStack = [];
	mvMatrix = mat4.create();
	pMatrix = mat4.create();
	globalGameOver = false;
	globalAttenuationFactor = 0.01;
}
//
// start
//
// Called when the canvas is created to get the ball rolling.
//
function start() {
  
  
  
  if (firstLoad == false) {
	  ui.showLoadingScreen();
	  clearInterval(gameLoopInterval);
  }
  
  clearGlobals();
  
  canvas = document.getElementById("glcanvas");
  gl = initGL(canvas);      // Initialize the GL context

  // Only continue if WebGL is available and working
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
    gl.clearDepth(1.0);                                     // Clear everything
    gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
    gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things

    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.
    initShaders();
	
	// Init framebuffer
	initTextureFramebuffer();
    
	
	// binds keyboard events
	document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
	
	if (firstLoad) {
				
		// binds mouse
		canvas.addEventListener('mousemove', function(event) {
			//handleMouseClick(event);
			leftMouseMoved = true;
			leftMousePressEvent = event;
		}, false);
		
		canvas.addEventListener('click', function(event) {
			//handleMouseClick(event);
			leftMousePressed = true;
			leftMousePressEvent = event;
		}, false);
		firstLoad = false;
	}
	

	
	//////////////// OBJECT LOADING AND INITIALIZING ////////////////
	
	
	camera = new Camera();
	
	ui = new UI();
	
	world = [];
	item = [];
	enemy = [];
	
	//////////////// WORLD MUST LOAD FIRST !!!! ////////////////
	
	world.push(new World());
	world[world.length - 1].name = "World";
	world[world.length - 1].load("./assets/world_grass.obj");
	// world[world.length - 1].normalBuffer = null; - not working because load is async
	//world[world.length - 1].position[y]+=10;
	
	world.push(new World());
	world[world.length - 1].name = "World";
	world[world.length - 1].load("./assets/world_grass.obj");
	world[world.length - 1].position[x]-=50;
	world[world.length - 1].position[y]+=5;
	
	/*world.push(new World());
	world[world.length - 1].name = "World";
	world[world.length - 1].load("./assets/stair_x.obj");
	world[world.length - 1].position[x]=-26.5;
	world[world.length - 1].position[y]=5;
	world[world.length - 1].position[z]=10;*/
	
	loadTerrain();
	
	/*obstacle.push(new World());
	obstacle[obstacle.length - 1].name = "Skatla";
	obstacle[obstacle.length - 1].load("./assets/grass.obj");
	obstacle[obstacle.length - 1].position[x] += 0;
	obstacle[obstacle.length - 1].position[z] += 5;
	//obstacle[obstacle.length - 1].vec4Color = [0.5,0.5,0.5,1.0];
	obstacle[obstacle.length - 1].position[y] = 2;
	obstacle[obstacle.length - 1].rotation[x] = 90;
	obstacle[obstacle.length - 1].vec4Color = [1.0,1.0,1.0,0.0];*/
	//obstacle[obstacle.length - 1].vec4Color = [0.5,0.5,0.5,1.0];
	
	/*
	obstacle.push(new World());
	obstacle[obstacle.length - 1].name = "Obstacle";
	obstacle[obstacle.length - 1].load("./assets/wall_x.obj");
	obstacle[obstacle.length - 1].position[x] += 0;
	obstacle[obstacle.length - 1].position[z] += 4;
	obstacle[obstacle.length - 1].vec4Color = [0.5,0.5,0.5,1.0];
	//obstacle[obstacle.length - 1].position[y] = 1;
	//obstacle[obstacle.length - 1].vec4Color = [0.5,0.5,0.5,1.0];
	*/
	
	/*
	world1 = new World();
	world1.name = "World1";
	world1.load("./assets/world_plane_new.obj");
	world1.position[x] = -10;
	world1.position[y] = 1;
	world1.vec4Color = [0.5,0.5,0.5,1.0];
	*/
	/*
	world.push(new World());
	world[world.length - 1].name = "World1";
	world[world.length - 1].load("./assets/wall_z.obj");
	world[world.length - 1].position[x] = -10;
	world[world.length - 1].position[y] = 1;
	world[world.length - 1].vec4Color = [0.5,0.5,0.5,1.0];
	*/
	
	/*obstacle.push(new World());
	obstacle[obstacle.length - 1].name = "Obstacle";
	obstacle[obstacle.length - 1].load("./assets/wall_z.obj");
	obstacle[obstacle.length - 1].position[x] = -10;
	obstacle[obstacle.length - 1].position[y] = 0;
	obstacle[obstacle.length - 1].position[z] = 5;
	obstacle[obstacle.length - 1].vec4Color = [0.5,0.5,0.5,1.0];
	/*
	obstacle.push(new World());
	obstacle[obstacle.length - 1].name = "Obstacle";
	obstacle[obstacle.length - 1].load("./assets/wall_z.obj");
	obstacle[obstacle.length - 1].position[x] = -10;
	//obstacle[obstacle.length - 1].position[y] = -0.4;
	obstacle[obstacle.length - 1].position[z] = -5;
	obstacle[obstacle.length - 1].vec4Color = [0.9,0.5,0.5,1.0];
	
	obstacle.push(new World());
	obstacle[obstacle.length - 1].name = "Obstacle";
	obstacle[obstacle.length - 1].load("./assets/wall_z.obj");
	obstacle[obstacle.length - 1].position[x] = -11;
	//obstacle[obstacle.length - 1].position[y] = -0.4;
	obstacle[obstacle.length - 1].position[z] = -5;
	obstacle[obstacle.length - 1].vec4Color = [0.2,0.2,0.2,1.0];
	
	obstacle.push(new World());
	obstacle[obstacle.length - 1].name = "Obstacle";
	obstacle[obstacle.length - 1].load("./assets/wall_z.obj");
	obstacle[obstacle.length - 1].position[x] = -10;
	//obstacle[obstacle.length - 1].position[y] = 0.4;
	obstacle[obstacle.length - 1].position[z] = 15;
	obstacle[obstacle.length - 1].vec4Color = [0.9,0.5,0.5,1.0];
	*/
	/*
	obstacle.push(new World());
	obstacle[obstacle.length - 1].name = "Obstacle";
	obstacle[obstacle.length - 1].load("./assets/box.obj");
	obstacle[obstacle.length - 1].position[x] += 0;
	obstacle[obstacle.length - 1].position[z] += 0;
	obstacle[obstacle.length - 1].vec4Color = [0.5,0.5,0.5,1.0];
	*/
	/*
	obstacle.push(new World());
	obstacle[obstacle.length - 1].name = "Obstacle";
	obstacle[obstacle.length - 1].load("./assets/qweqwe.obj");
	obstacle[obstacle.length - 1].position[x] += 0;
	obstacle[obstacle.length - 1].position[z] += 0;
	obstacle[obstacle.length - 1].vec4Color = [0.5,0.5,0.5,1.0];
	obstacle[obstacle.length - 1].position[y] = 1;
	obstacle[obstacle.length - 1].vec4Color = [0.5,0.5,0.5,1.0];
	*/
	/*
	item.push(new Item());
	item[item.length-1].name = "item";
	item[item.length-1].load("./assets/sword.obj");
	item[item.length-1].position[x] += 7;
	item[item.length-1].position[z] += 2;
	*/
	
	hero = new Hero();
	hero.name = "Hero";
	hero.isPlayer = true;
	//hero.position[x] -= 5;
	hero.directionVelocity[x] = hero.directionVelocity[x]*1.2;
	hero.directionVelocity[y] = hero.directionVelocity[y]*1.2;
	hero.directionVelocity[z] = hero.directionVelocity[z]*1.2;
	//hero.position[z] -= 5;
	//hero.position[x] -= 10;
	//hero.load("./assets/ironman.obj");

	
	
	// Fury decay
	// TODO: better location
	/*setInterval(function() {
		hero.fury -= hero.furyDecay;
		if (hero.fury < 0) hero.fury = 0;
	}, 1000);*/
	

	
	
	parseObjects();
	
	//for (var o in obstacle) {console.log(obstacle[o].position[x]+" "+obstacle[o].position[z]);}
	/*
	enemy.push(new Hero());
	enemy[enemy.length-1].load("./assets/slasher.obj");
	enemy[enemy.length-1].name = "Slasher";
	enemy[enemy.length-1].position[x] -= 10;
	enemy[enemy.length-1].position[z] -= 0;	
	enemy[enemy.length-1].vec4Color = [0.5,0.25,0.75,1.0];
	
	
	enemy.push(new Hero());
	enemy[enemy.length-1].load("./assets/feralGhoul.obj");
	enemy[enemy.length-1].name = "Feral Ghoul";
	//enemy[enemy.length-1].position[x] -= 10;
	enemy[enemy.length-1].position[z] -= 10;
	enemy[enemy.length-1].vec4Color = [0.5,0.25,0.75,1.0];
	*/
	
	
	/*enemy.push(new Hero());
	enemy[enemy.length-1].load("./assets/bucaNew.obj");
	enemy[enemy.length-1].name = "Evil Pumpkin Slave1";
	enemy[enemy.length-1].position[x] += 5;
	enemy[enemy.length-1].position[z] += 5;
	//enemy[enemy.length-1].rotation[y] = -90;
	enemy[enemy.length-1].vec4Color = [0.5,0.25,0.75,1.0];
	enemy.push(new Hero());
	enemy[enemy.length-1].load("./assets/bucaNew.obj");
	enemy[enemy.length-1].name = "Evil Pumpkin Slave2";
	enemy[enemy.length-1].position[x] += 7;
	enemy[enemy.length-1].position[z] += 7;
	//enemy[enemy.length-1].rotation[y] = -90;
	enemy[enemy.length-1].vec4Color = [0.5,0.25,0.75,1.0];
	/*
	enemy.push(new Hero());
	enemy[enemy.length-1].load("./assets/slasher.obj");
	enemy[enemy.length-1].name = "Evil Pumpkin Slave3";
	enemy[enemy.length-1].position[x] += 2;
	enemy[enemy.length-1].position[z] += 2;
	//enemy[enemy.length-1].rotation[y] = -90;
	enemy[enemy.length-1].vec4Color = [0.5,0.25,0.75,1.0];
	*/
	/*
	enemy.push(new Hero());
	enemy[enemy.length-1].load("./assets/feralGhoul.obj");
	enemy[enemy.length-1].name = "Feral Ghoul";
	enemy[enemy.length-1].position[x] -= 5;
	enemy[enemy.length-1].position[z] += 5;
	//enemy[enemy.length-1].rotation[y] = -90;
	
	enemy.push(new Hero());
	enemy[enemy.length-1].load("./assets/slasher.obj");
	enemy[enemy.length-1].name = "Wat iz dis???";
	enemy[enemy.length-1].position[x] += 5;
	enemy[enemy.length-1].position[z] -= 5;
	
	//HARDCODED
	enemy[0].HP = 90;
	enemy[0].maxHP = 100;
	//enemy[1].HP = 30;
	//enemy[1].maxHP = 100;
	*/
	
	ui.updateInventoryItemList();

	// Set up to draw the scene periodically.
	gameLoopInterval = setInterval(gameLoop, 15);

	setTimeout(function() {
		ui.hideLoadingScreen();
	}, 4000);
	
  }
}
