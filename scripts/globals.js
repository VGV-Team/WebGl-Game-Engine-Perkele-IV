// GLOBAL DEFINE FOR COORDINATES
var x = 0;
var y = 1;
var z = 2;


// GLOBAL FRAMEBUFFER
// Framebuffer for making a secondary scene
var rttFramebuffer;
// Var for putting that scene in a texture ?
var rttTexture;


// Global variable definitionvar canvas;
var gl;
var shaderProgram;
var canvas;

// GLOBAL ID FOR COMPARING OBJECTS
var globalID = 1;

var hero;
var world;
var camera;

var enemy;

var world = [];

var ui;


var textureArray = {};


var lastUpdateTime = 0;
var timeTillLastUpdate = 0;


///////HANDLE KEYS

var currentlyPressedKeys = {};
var currentlyPressedMouseCoordinates = [null, null, null];
var currentlyPressedEntity = null;

// Is left mouse pressed? boolean for synchronized framebuffer checking
var leftMousePressed = false;
var leftMouseMoved = false;
var leftMouseEvent = null;



// Model-view and projection matrix and model-view matrix stack
var mvMatrixStack = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
/*
var objectOffset = [];
var objectCollisionBox = [];
var vertexPositionBuffer = [];
var textureBufer = [];
var normalBuffer = [];
var vertexIndexBuffer = [];
var textureFile = [];
*/