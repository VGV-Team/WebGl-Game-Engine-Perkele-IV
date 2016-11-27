function basicAttack(attackerObject, hitObject) {
	
	//console.log(attackerObject.name + " is attacking " + hitObject.name);
	
	var damage=0;
	var criticalRand = Math.floor((Math.random() * 100));
	if (criticalRand <= attackerObject.criticalChance) {
		// Critical hit!
		console.log(attackerObject.name + " does a CRITICAL HIT!");
		damage = attackerObject.strength * 2;
		
	} else {
		// Normal attack
		 damage = attackerObject.strength;
	}
	hitObject.HP -= damage
	
	if (hitObject == hero) {
		ui.playGetHitAudio();
		ui.playEnemyAttackAudio();
	}
	
	if (hitObject == hero && attackerObject.name == "DIABLO") {
		if (globalDiabloHalfHealth == true) {
			globalAttenuationFactor *= 1.15;
		} 
		if (globalDiabloQuarterHealth == true) {
			globalAttenuationFactor *= 1.15;
		} 
		if (globalAttenuationFactor > 0.08) globalAttenuationFactor = 0.08;
	}
	
	if (hitObject.name == "DIABLO") {
		if (globalDiabloHalfHealth == false && hitObject.HP <= hitObject.maxHP/2) {
			globalDiabloHalfHealth = true;
			ui.playDiabloHalfHealthAudio();
		} else if (globalDiabloQuarterHealth == false && hitObject.HP <= hitObject.maxHP/4) {
			globalDiabloQuarterHealth = true;
			ui.playDiabloQuarterHealthAudio();
		} 
		
		if (hitObject.HP <= 0){
			//console.log(hitObject.HP + " " + attackerObject.currentlyEu.stats.itemName)
			if(attackerObject==hero && attackerObject.equippedWeapon.itemName == "Glamdring")
			{
				// YOU WON
				globalDiabloDead = true;
				ui.diabloDiesEndGame();
				//TODO: call ui.vicotry() or sth
				//console.log("end");
			}
			else 
			{
				// play sound for diablo
				// play sound for gandalf
				hitObject.HP = 1; //+= damage;
				//console.log("not");
			}
			
			
		}
	}
	
	
	if(hitObject.HP <= 0 && hitObject==hero)
	{
		hitObject.HP = 0;
		console.log("PLAYER DIEDED");
		
		globalGameOver = true;
	}
	else if (hitObject.HP <= 0) {
		hitObject.HP = 0;
		hitObject.isActive = false;
		hitObject.drawObject = false;
		hitObject.calculateCollision = false;
		currentlyPressedEntity = null;
		console.log("dieded");
		
		var chance = Math.floor((Math.random() * 100));
		if(chance<attackerObject.discovery)
		{
			console.log("GENERATING ITEMS");
			// generate item
			item.push(new Item());
			item[item.length-1].name = "item";
			item[item.length-1].load("./assets/sword.obj");
			item[item.length-1].position[x] = hitObject.position[x];
			item[item.length-1].position[y] = hitObject.position[y];
			item[item.length-1].position[z] = hitObject.position[z];
			
			
			item[item.length-1].stats = { };
			
			
			var type = Math.floor((Math.random() * 100))
			if(type>95) 
			{
				ui.playLegendaryDropAudio();
				item[item.length-1].stats.rarity = "EPIC"; 
				item[item.length-1].stats.attack = Math.floor((Math.random() * 20)+20);
				item[item.length-1].stats.criticalChance = Math.floor((Math.random() * 10)+10);
				item[item.length-1].stats.itemName = epicItemNames[Math.floor((Math.random() * epicItemNames.length))];
			
			}
			else if(type>85) 
			{
				ui.playLegendaryDropAudio();
				item[item.length-1].stats.rarity = "LEGENDARY"; 
				item[item.length-1].stats.attack = Math.floor((Math.random() * 10)+15);
				item[item.length-1].stats.criticalChance = Math.floor((Math.random() * 5)+5);
				item[item.length-1].stats.itemName = legendaryItemNames[Math.floor((Math.random() * legendaryItemNames.length))];
			}
			else if(type>70) 
			{
				ui.playNormalDropAudio();
				item[item.length-1].stats.rarity = "RARE"; 
				item[item.length-1].stats.attack = Math.floor((Math.random() * 10)+5);
				item[item.length-1].stats.criticalChance = Math.floor((Math.random() * 10)+0);
				item[item.length-1].stats.itemName = rareItemNames[Math.floor((Math.random() * rareItemNames.length))];
			}
			else 
			{
				ui.playNormalDropAudio();
				item[item.length-1].stats.rarity = "COMMON"; 
				item[item.length-1].stats.attack = Math.floor((Math.random() * 5)+1);
				item[item.length-1].stats.criticalChance = Math.floor((Math.random() * 5)+0);
				item[item.length-1].stats.itemName = commonItemNames[Math.floor((Math.random() * commonItemNames.length))];
			}


			
	
		}
	}
	
}