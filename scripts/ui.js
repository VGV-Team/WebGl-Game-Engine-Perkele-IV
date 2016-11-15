function UI() {
	this.topBar = document.getElementById("topBar");
	this.enemyHealthBar = document.getElementById("enemyHealthBar");
	this.enemyHealthBarPercentage = document.getElementById("enemyHealthBarPercentage");
	this.enemyHealthBarName = document.getElementById("enemyHealthBarName");
	
	// Dynamic adding abilites to UI
	/*this.abilityBar = document.getElementById("abilityBar");
	this.abilityBar.style.width = (hero.abilities.length*100+10)*2 + "px";
	for(var in in hero.abilites) {
		this.abilityBar.innerHTML += '<div class="abilityBox"><span class="abilityName">BasicAttack</span><div id="ability' + hero.abilites[i].name + '" class="abilityCooldown"></div></div>';
	}
	this.abilityBoxes = */
	this.abilityBasicAttackCooldownBar = document.getElementById("abilityBasicAttackCooldownBar");
	
	// INVENTORY INIT
	this.inventoryOpen = false;
	this.inventoryBar = document.getElementById("inventoryBar");
	this.inventoryItemList = document.getElementById("itemList");
	this.selectedWeaponName = document.getElementById("selectedWeaponName");
	this.weaponAttack = document.getElementById("weaponAttack");
	this.weaponcriticalChance = document.getElementById("weaponcriticalChance");
	this.weaponRarity = document.getElementById("weaponRarity");
	
	// PLAYER STATS INIT (INVENTORY)
	this.statsHP = document.getElementById("statsHP");
	this.statsHPRegen = document.getElementById("statsHPRegen");
	this.statsAttack = document.getElementById("statsAttack");
	this.statsCriticalChance = document.getElementById("statsCriticalChance");
	this.statsFury = document.getElementById("statsFury");
	
	// PLAYER HP AND FURY BOX
	this.heroHealthPercentage = document.getElementById("healthPercentage");
	this.heroFuryPercentage = document.getElementById("furyPercentage");
	
}


UI.prototype.update = function() {
	
	
	// Update enemy health bar
	if (currentlyPressedEntity == null) this.hideEnemyHealthBar();
	else {
		var percentage = Math.floor((currentlyPressedEntity.HP / currentlyPressedEntity.maxHP) * 100);
		this.enemyHealthBarPercentage.style.width = "" + percentage + "%";
		this.enemyHealthBarName.innerHTML = currentlyPressedEntity.name;
		this.showEnemyHealthBar();
	}
	
	// Update abilities bar
	var abilities = hero.abilities;
	var cd = Math.floor(((abilities["BasicAttack"].timeReady - lastUpdateTime) / abilities["BasicAttack"].cooldown) * 100);
	if (cd < 0) cd = 0;
	this.abilityBasicAttackCooldownBar.style.width = cd + "%";
	
	// Update Inventory Stats
	statsHP.innerHTML = "HP: " + hero.HP + " / " + hero.maxHP;
	statsHPRegen.innerHTML = "HP regeneration: " + hero.HPRegen + " / sec";
	statsAttack.innerHTML = "Attack: " + hero.strength;
	statsCriticalChance.innerHTML = "Critical Chance: " + hero.criticalChance + " %"; //FIXME
	statsFury.innerHTML = "Fury: " + hero.fury + " / " + hero.maxFury;
	
	// Update frontend HP and fury UI
	var hp = (hero.HP / hero.maxHP) * 100;
	var fury = (hero.fury / hero.maxFury) * 100;
	this.heroHealthPercentage.style.height = "" + hp + "%";
	this.heroFuryPercentage.style.height = "" + fury + "%";
	
	if (hero.HP <= 0) {
		// Show GAME OVER
	}
}

// Separated because you can't click on HTML element if constantly innerHTMLing
UI.prototype.updateInventoryItemList = function() {
	this.inventoryItemList.innerHTML = "<h3>INVENTORY</h3>Choose a weapon to equip";
	for (var itemIndex in hero.inventory) {
		var item = hero.inventory[itemIndex];
		var color = ' style="background-color:' + getStyleColorBasedOnRarity(item.rarity) + ';';
		if (item == hero.equippedWeapon) {
			color += ' border-color:yellow"';
		} else {
			color += ' border-color:black"';
		}
		var onClick = "onclick='hero.changeEquippedWeapon(" + itemIndex + ")'";
		
		var html = '<div ' + color + ' ' + onClick + ' class="inventoryItem"> \
					<img class="itemImg" src="assets/ui/swordIcon.jpg" /> \
					<span class="itemName">' + item.itemName + '</span> \
					</div>';
		this.inventoryItemList.innerHTML += html;
	}
}

function getStyleColorBasedOnRarity(rarity) {
	var color;
	switch (rarity) {
		case "COMMON":
			color = "gray";
			break;
		case "RARE":
			color = "skyblue";
			break;
		case "LEGENDARY":
			color = "purple";
			break;
		case "EPIC":
			color = "orange";
			break;
		default:
			color = "red";
			break;
	}
	return color;
}

UI.prototype.updateWeaponDescription = function () {
	//var item = hero.inventory[itemIndex];
	var item = hero.equippedWeapon;
	//this.selectedWeaponIndex = itemIndex;
	selectedWeaponName.innerHTML = item.itemName;
	weaponAttack.innerHTML = "Attack: +" + item.attack;
	weaponcriticalChance.innerHTML = "Critical chance: +" + item.criticalChance + "%";
	var color = getStyleColorBasedOnRarity(item.rarity);
	weaponRarity.innerHTML = 'Rarity: <span style="background-color:brown;color:' + color + ';">' + item.rarity + '</span>';
	this.updateInventoryItemList();
}

UI.prototype.hideEnemyHealthBar = function() {
	this.topBar.style.display = "none";
	//this.enemyHealthBar.style.display = "none";
	//this.enemyHealthBarPercentage.style.display = "none";
	//this.enemyHealthBarName.style.display = "none";
}

UI.prototype.showEnemyHealthBar = function() {
	this.topBar.style.display = "block";
	//this.enemyHealthBar.style.display = "block";
	//this.enemyHealthBarPercentage.style.display = "block";
	//this.enemyHealthBarName.style.display = "block";
}

UI.prototype.toggleInventory = function() {
	if (this.inventoryOpen == true) {
		this.inventoryBar.style.display = 'none';
		this.inventoryOpen = false;
	} else {
		this.inventoryBar.style.display = 'block';
		this.inventoryOpen = true;
	}
}
