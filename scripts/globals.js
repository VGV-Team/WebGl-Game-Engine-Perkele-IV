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


///////HANDLE KEYS

var currentlyPressedKeys = {};
var currentlyPressedMouseCoordinates = [null, null, null];



// Model-view and projection matrix and model-view matrix stack
var mvMatrixStack = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();