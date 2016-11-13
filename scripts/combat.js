function basicAttack(attackerObject, hitObject) {
	
	console.log(attackerObject.name + " is attacking " + hitObject.name);
	
	hitObject.HP -= 5;
	if (hitObject.HP <= 0) {
		hitObject.drawObject = false;
		hitObject.calculateCollision = false;
	}
	
}