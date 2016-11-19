function basicAttack(attackerObject, hitObject) {
	
	console.log(attackerObject.name + " is attacking " + hitObject.name);
	
	hitObject.HP -= attackerObject.strength;
	if(hitObject.HP <= 0 && hitObject==hero)
	{
		hitObject.HP = 0;
		console.log("PLAYER DIEDED");
		
		// TODO: death message
	}
	else if (hitObject.HP <= 0) {
		hitObject.HP = 0;
		hitObject.isActive = false;
		hitObject.drawObject = false;
		hitObject.calculateCollision = false;
		currentlyPressedEntity = null;
		console.log("dieded");
	}
	
}