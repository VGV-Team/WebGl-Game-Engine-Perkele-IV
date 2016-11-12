function gameLoop()
{
	//requestAnimationFrame(animate);
	
	handleKeys();
	
	// updates all objects
	camera.update();
	//updateHero();
	//updateEnemies();
	
	// draws camera and all objects
    drawScene();
}