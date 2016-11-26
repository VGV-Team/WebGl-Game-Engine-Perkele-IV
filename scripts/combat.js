function basicAttack(attackerObject, hitObject) {
	
	//console.log(attackerObject.name + " is attacking " + hitObject.name);
	
	
	var criticalRand = Math.floor((Math.random() * 100));
	if (criticalRand <= attackerObject.criticalChance) {
		// Critical hit!
		console.log(attackerObject.name + " does a CRITICAL HIT!");
		hitObject.HP -= attackerObject.strength * 2;
		
	} else {
		// Normal attack
		hitObject.HP -= attackerObject.strength;
	}
	
	
	if (hitObject == hero) {
		ui.playGetHitAudio();
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
			item[item.length-1].stats.itemName = itemNames[Math.floor((Math.random() * itemNames.length))];
			
			var type = Math.floor((Math.random() * 100))
			if(type>95) 
			{
				ui.playLegendaryDropAudio();
				item[item.length-1].stats.rarity = "EPIC"; 
				item[item.length-1].stats.attack = Math.floor((Math.random() * 20)+20);
				item[item.length-1].stats.criticalChance = Math.floor((Math.random() * 10)+10);
			
			}
			else if(type>85) 
			{
				ui.playLegendaryDropAudio();
				item[item.length-1].stats.rarity = "LEGENDARY"; 
				item[item.length-1].stats.attack = Math.floor((Math.random() * 10)+15);
				item[item.length-1].stats.criticalChance = Math.floor((Math.random() * 5)+5);
			}
			else if(type>70) 
			{
				ui.playNormalDropAudio();
				item[item.length-1].stats.rarity = "RARE"; 
				item[item.length-1].stats.attack = Math.floor((Math.random() * 10)+5);
				item[item.length-1].stats.criticalChance = Math.floor((Math.random() * 10)+0);
			}
			else 
			{
				ui.playNormalDropAudio();
				item[item.length-1].stats.rarity = "COMMON"; 
				item[item.length-1].stats.attack = Math.floor((Math.random() * 5)+1);
				item[item.length-1].stats.criticalChance = Math.floor((Math.random() * 5)+0);
			}


			
	
		}
	}
	
}