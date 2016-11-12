function gameLoop()
{
	//requestAnimationFrame(animate);
	
	handleKeys();
	
	// updates all objects
	updateCamera();
	//updateHero();
	//updateEnemies();
	
	// draws camera and all objects
    drawScene();
}