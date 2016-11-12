function gameLoop()
{
	
	requestAnimationFrame(calculateTime);
	
	//requestAnimationFrame(animate);
	
	handleKeys();
	
	// updates all objects
	camera.update();
	hero.update();
	//updateEnemies();
	
	// draws camera and all objects
    drawScene();
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
	world.load();

	hero = new Hero();
	hero.load();

	
    // Set up to draw the scene periodically.
	setInterval(gameLoop, 15);
  }
}