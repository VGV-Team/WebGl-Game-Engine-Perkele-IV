function gameLoop()
{
	//requestAnimationFrame(animate);
	
	handleKeys();
	
	// updates all objects
	camera.update();
	hero.update();
	//updateEnemies();
	
	// draws camera and all objects
    drawScene();
}