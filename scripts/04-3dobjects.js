
// GLOBAL DEFINE FOR COORDINATES
var x = 0;
var y = 1;
var z = 2;

// Global variable definitionvar canvas;
var gl;
var shaderProgram;
var canvas;



var hero;
var world;
var camera;

var lastUpdateTime = 0;
var timeTillLastUpdate = 0;


function drawScene() {
	//NUJNO ZLO
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
	
	//POZICIJA KAMERE
	camera.draw();
	
	//console.log(mvMatrix);



	//////RISANJE OBJEKTOV V SVETU
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
    
    // Here's where we call the routine that builds all the objects
    // we'll be drawing.
    //initBuffers();
	
	
	camera = new Camera();
	
	world = new World();
	world.load();

	hero = new Hero();
	hero.load();

	
	// binds keyboard events
	document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
	
	canvas.addEventListener('click', function(event) {
		handleMouseClick(event);
	}, false);
	
	//console.log(hero.vertexPositionBuffer)
    
    // Set up to draw the scene periodically.
	setInterval(gameLoop, 15);
  }
}
