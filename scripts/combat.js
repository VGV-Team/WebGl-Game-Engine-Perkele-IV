function basicAttack(attackerObject, hitObject) {
	
	console.log(attackerObject.name + " is attacking " + hitObject.name);
	
	hitObject.HP -= 5;
	if(hitObject.HP <= 0 && hitObject==hero)
	{
		console.log("PLAYER DIEDED");
		
		// TODO: death message
	}
	else if (hitObject.HP <= 0) {
		hitObject.isActive = false;
		hitObject.drawObject = false;
		hitObject.calculateCollision = false;
		console.log("dieded");
	}
	
}