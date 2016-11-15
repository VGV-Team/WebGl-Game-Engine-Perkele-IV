function gameLoop()
{
	//var t0 = performance.now();
	
	requestAnimationFrame(calculateTime);
	
	//requestAnimationFrame(animate);
	
	handleKeys();
	
	// updates all objects
	
	hero.update();
	for(var i in enemy) enemy[i].update();
	
	
	camera.update();
	

	ui.update();
	
	// draws camera and all objects
    drawScene();
	
	//var t1 = performance.now();
	//console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
					

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

	////// OBJECT DRAWING
	hero.draw();
	
	for(var i in enemy) enemy[i].draw();
	
	//console.log(getObjectCollisionDistance(hero, enemy[0]) + " " + hero.calculateCollision + " " + enemy[0].calculateCollision);
	console.log(hero.HP);
	
	world.draw();
	
	
}

//
// start
//
// Called when the canvas is created to get the ball rolling.
//
function start() {
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
    
	
	// binds keyboard events
	document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
	
	// binds mouse
	canvas.addEventListener('click', function(event) {
		handleMouseClick(event);
	}, false);
	

	
	//////////////// OBJECT LOADING AND INITIALIZING ////////////////
	
	
	
	camera = new Camera();
	
	world = new World();
	world.name = "World";
	world.load("./assets/world_plane_new.obj");

	hero = new Hero();
	hero.name = "Hero";
	hero.isPlayer = true;
	hero.directionVelocity[x] = hero.directionVelocity[x]*1.2;
	hero.directionVelocity[y] = hero.directionVelocity[y]*1.2;
	hero.directionVelocity[z] = hero.directionVelocity[z]*1.2;
	//hero.position[x] -= 10;
	hero.load("./assets/ironman.obj");


	enemy = [];

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
	
	
	
	enemy.push(new Hero());
	enemy[enemy.length-1].load("./assets/bucaNew.obj");
	enemy[enemy.length-1].name = "Evil Pumpkin Slave";
	enemy[enemy.length-1].position[x] -= 10;
	enemy[enemy.length-1].position[z] -= 10;
	//enemy[enemy.length-1].rotation[y] = -90;
	enemy[enemy.length-1].vec4Color = [0.5,0.25,0.75,1.0];
	
	//HARDCODED
	enemy[0].HP = 50;
	enemy[0].maxHP = 100;
	//enemy[1].HP = 30;
	//enemy[1].maxHP = 100;

	
	ui = new UI();
	
    // Set up to draw the scene periodically.
	setInterval(gameLoop, 15);
  }
}