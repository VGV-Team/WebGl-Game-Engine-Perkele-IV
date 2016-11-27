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
	this.bottomBar = document.getElementById("bottomBar");
	
	this.abilityBasicAttackCooldownBar = document.getElementById("abilityBasicAttackCooldownBar");
	this.ability360SlashCooldownBar = document.getElementById("ability360SlashCooldownBar");
	this.abilityHealCooldownBar = document.getElementById("abilityHealCooldownBar");
	
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
	
	this.currentHP = document.getElementById("currentHP");
	this.currentFury = document.getElementById("currentFury");
	
	
	// CHARACTER STATS
	this.characterStatsOpen = false;
	this.characterBar = document.getElementById("characterBar");
	this.characterStatsHP = document.getElementById("characterStatsHP");
	this.characterStatsHPRegen = document.getElementById("characterStatsHPRegen");
	this.characterStatsFury = document.getElementById("characterStatsFury");
	this.characterStatsFuryDecay = document.getElementById("characterStatsFuryDecay");
	this.characterStatsBaseAttack = document.getElementById("characterStatsBaseAttack");
	this.characterStatsBaseCritical = document.getElementById("characterStatsBaseCritical");
	this.characterStatsWeaponAttack = document.getElementById("characterStatsWeaponAttack");
	this.characterStatsWeaponCritical = document.getElementById("characterStatsWeaponCritical");
	this.characterStatsTotalAttack = document.getElementById("characterStatsTotalAttack");
	this.characterStatsTotalCritical = document.getElementById("characterStatsTotalCritical");
	this.characterStatsDiscovery = document.getElementById("characterStatsDiscovery");
	
	// MENU PANEL
	this.menuPanelOpen = false;
	this.menuBar = document.getElementById("menuBar");
	
	// HELP PANEL
	this.helpPanelOpen = false;
	this.helpBar = document.getElementById("helpBar");
	
	/* 
	--------------
	MENU RELATED STUFF
	--------------
	*/
	//GAME OVER
	this.gameOverScreen = document.getElementById("gameOverScreen");
	this.isGameOver = false;
	this.gameOverToMainMenuBtn = document.getElementById("gameOverToMainMenuBtn");
	
	//MAIN MENU
	this.mainMenuScreen = document.getElementById("mainMenuScreen");
	
	//LOADING SCREEN
	this.loadingScreen = document.getElementById("loadingBar");
	
	/* 
	--------------
	AUDIO
	--------------
	*/
	//AMBIENT
	this.audioAmbient = document.getElementById("audioAmbient");
	this.audioAmbient.volume = 0.2;
	this.audioAmbient.loop = true;
	
	//BASIC Attack
	this.audioBasicAttack = [];
	var tmp = document.getElementsByClassName("audioBasicAttack");
	for(var i = 0; i < tmp.length; i++)
	{
		this.audioBasicAttack.push(tmp.item(i));
	}
	
	//360Slash - Whirlwind
	this.audioWhirlwind = document.getElementById("audioWhirlwind");
	
	//Heal
	this.audioHeal = document.getElementById("audioHeal");
	
	//Get hit sounds
	this.audioGetHit = [];
	this.getHitCount = 0;
	tmp = document.getElementsByClassName("audioGetHit");
	for(var i = 0; i < tmp.length; i++)
	{
		this.audioGetHit.push(tmp.item(i));
	}
	
	//Death
	this.audioDeath1 = document.getElementById("audioDeath1");
	this.audioDeath2 = document.getElementById("audioDeath2");
	this.audioYouDied = document.getElementById("audioYouDied");
	
	//Weapon drops
	this.audioDropNormal = document.getElementById("audioDropNormal");
	this.audioDropLegendary = document.getElementById("audioDropLegendary");
	
	//"Button" - when closing and opening menus
	this.audioButton = document.getElementById("audioButton");
	
	//Pickup audio
	this.audioPickup = document.getElementById("audioPickup");
	
	//Change weapon in inventory
	this.audioSelectWeapon = document.getElementById("audioSelectWeapon");
			
	//DIABLO
	this.audioDiabloBoast = [];
	tmp = document.getElementsByClassName("audioDiabloBoast");
	for(var i = 0; i < tmp.length; i++)
	{
		this.audioDiabloBoast.push(tmp.item(i));
	}
	
	this.audioDiabloHalfHealth = [];
	tmp = document.getElementsByClassName("audioDiabloHalfHealth");
	for(var i = 0; i < tmp.length; i++)
	{
		this.audioDiabloHalfHealth.push(tmp.item(i));
	}
	
	this.audioDiabloQuarterHealth = [];
	tmp = document.getElementsByClassName("audioDiabloQuarterHealth");
	for(var i = 0; i < tmp.length; i++)
	{
		this.audioDiabloQuarterHealth.push(tmp.item(i));
	}
	
	this.audioDiabloKillsHero = [];
	tmp = document.getElementsByClassName("audioDiabloKillsHero");
	for(var i = 0; i < tmp.length; i++)
	{
		this.audioDiabloKillsHero.push(tmp.item(i));
	}
	
	this.audioDiabloDies = [];
	tmp = document.getElementsByClassName("audioDiabloDies");
	for(var i = 0; i < tmp.length; i++)
	{
		this.audioDiabloDies.push(tmp.item(i));
	}
	
	this.audioPlayerKillsDiablo = [];
	tmp = document.getElementsByClassName("audioPlayerKillsDiablo");
	for(var i = 0; i < tmp.length; i++)
	{
		this.audioPlayerKillsDiablo.push(tmp.item(i));
	}
	
	//AMBIENT DIABLO FIGHT
	this.audioDiabloFightAmbient = document.getElementById("audioDiabloFightAmbient");
	this.audioDiabloFightStarted = false;
	this.audioPlayerWonAmbient = document.getElementById("audioPlayerWonAmbient");
	
	this.audioPlayerDiabloTaunt = document.getElementById("audioPlayerDiabloTaunt");
	
	//VICTORY SCREEN
	this.victoryBar = document.getElementById("victoryBar");
	this.victoryToMainMenuBtn = document.getElementById("victoryToMainMenuBtn");
	this.victoryText = document.getElementById("victoryText");
}


UI.prototype.update = function() {
	
	
	// Update enemy health bar
	if (currentlyPressedEntity == null) this.hideEnemyHealthBar();
	else {
		// Check if we hovered an item
		var itemHover = false;
		for (var i in item) {
			if (item[i] == currentlyPressedEntity) {
				itemHover = true;
				break;
			}
		}
		
		if (itemHover) {
			// Item
			var i = currentlyPressedEntity;
			this.enemyHealthBarPercentage.style.width = "100%";
			this.enemyHealthBarPercentage.style.background = getStyleColorBasedOnRarity(i.stats.rarity);
			this.enemyHealthBarName.innerHTML = /*"Item: " +*/ i.stats.itemName;
			this.showEnemyHealthBar();
			
			
		} else {
			// Enemy
			var percentage = Math.floor((currentlyPressedEntity.HP / currentlyPressedEntity.maxHP) * 100);
			this.enemyHealthBarPercentage.style.width = "" + percentage + "%";
			this.enemyHealthBarPercentage.style.background = "red";
			this.enemyHealthBarName.innerHTML = currentlyPressedEntity.name;
			this.showEnemyHealthBar();
		}
		
		
		
	}
	
	// Update abilities bar
	var abilities = hero.abilities;
	
	var cd = Math.floor(((abilities["BasicAttack"].timeReady - lastUpdateTime) / abilities["BasicAttack"].cooldown) * 100);
	if (cd < 0) cd = 0;
	this.abilityBasicAttackCooldownBar.style.width = cd + "%";
	
	cd = Math.floor(((abilities["360Slash"].timeReady - lastUpdateTime) / abilities["360Slash"].cooldown) * 100);
	if (cd < 0) cd = 0;
	this.ability360SlashCooldownBar.style.width = cd + "%";
	
	cd = Math.floor(((abilities["Heal"].timeReady - lastUpdateTime) / abilities["Heal"].cooldown) * 100);
	if (cd < 0) cd = 0;
	this.abilityHealCooldownBar.style.width = cd + "%";
	
	// Update Inventory Stats
	statsHP.innerHTML = "HP: " + Math.round(hero.HP) + " / " + Math.round(hero.maxHP);
	statsHPRegen.innerHTML = "HP regeneration: " + hero.HPRegen + " / sec";
	statsAttack.innerHTML = "Attack: " + hero.strength;
	statsCriticalChance.innerHTML = "Critical Chance: " + hero.criticalChance + " %"; //FIXME
	statsFury.innerHTML = "Fury: " + Math.round(hero.fury) + " / " + Math.round(hero.maxFury);
	
	// Update frontend HP and fury UI
	var hp = (hero.HP / hero.maxHP) * 100;
	var fury = (hero.fury / hero.maxFury) * 100;
	this.heroHealthPercentage.style.height = "" + hp + "%";
	this.heroFuryPercentage.style.height = "" + fury + "%";
	
	// Update HP and Fury numeric values/text
	hp = Math.round(hero.HP);
	fury = Math.round(hero.fury);
	var maxHP = Math.round(hero.maxHP);
	var maxFury = Math.round(hero.maxFury);
	this.currentHP.innerHTML = "HP<br/>" + hp + " / " + maxHP;
	this.currentFury.innerHTML = "Fury<br/>" + fury + " / " + maxFury;
	
	
	//console.log(this.audioDiabloFightAmbient);
	//DIABLO BASED
	if (globalDiabloMet == true && this.audioDiabloFightStarted == false) {
		this.audioDiabloFightAmbient.volume = 1;
		this.audioDiabloFightAmbient.play();
		this.audioDiabloFightAmbient.loop = true;
		this.audioAmbient.pause();
		this.audioDiabloFightStarted = true;
	}
	
	
	if (hero.HP <= 0 && !this.isGameOver) {
		// Show GAME OVER
		//this.showGameOver();
		this.isGameOver = true;
		globalGameOver = true;
		// Show game over with delay
		
		this.audioAmbient.pause();
		this.audioAmbient.load();
		/*this.audioDiabloFightAmbient.pause();
		this.audioDiabloFightAmbient.load();*/
		this.audioDeath1.play();
		if (globalDiabloMet == true) {
			this.playDiabloKillsHeroAudio();
			this.fadeOutDiabloFightAmbient();
		}
		setTimeout(function() {
			ui.audioDeath2.play()
		}, 1500);
		this.audioYouDied.play();
		
		setTimeout(function() {
			ui.showGameOver();
		}, 6000);
		//Show "back to menu" button
		setTimeout(function(){
			gameOverToMainMenuBtn.style.display = "block";
		}, 8000);
		
		
	}
	
	
	var baseAttack = hero.strength - hero.equippedWeapon.attack;
	var baseCritical = hero.criticalChance - hero.equippedWeapon.criticalChance;
	
	// Update Character Stats panel
	this.characterStatsHP.innerHTML = Math.round(hero.HP) + " / " + Math.round(hero.maxHP);
	this.characterStatsHPRegen.innerHTML = Math.round(hero.HPRegen) + " / sec";
	this.characterStatsFury.innerHTML = Math.round(hero.fury) + " / " + Math.round(hero.maxFury);
	this.characterStatsFuryDecay.innerHTML = Math.floor(hero.furyDecay) + " / sec";
	this.characterStatsBaseAttack.innerHTML = baseAttack;
	this.characterStatsBaseCritical.innerHTML = baseCritical + " %";
	this.characterStatsWeaponAttack.innerHTML = hero.equippedWeapon.attack;
	this.characterStatsWeaponCritical.innerHTML = hero.equippedWeapon.criticalChance + " %";
	this.characterStatsTotalAttack.innerHTML = hero.strength;
	this.characterStatsTotalCritical.innerHTML = hero.criticalChance + " %";
	this.characterStatsDiscovery.innerHTML = hero.discovery + " %";


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
		case "SPECIAL":
			color = "white";
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
	this.audioButton.play();
	if (this.inventoryOpen == true) {
		this.inventoryBar.style.display = 'none';
		this.inventoryOpen = false;
	} else {
		this.inventoryBar.style.display = 'block';
		this.inventoryOpen = true;
	}
}

UI.prototype.toggleCharacterStats = function() {
	this.audioButton.play();
	if (this.characterStatsOpen == true) {
		this.characterBar.style.display = 'none';
		this.characterStatsOpen = false;
	} else {
		this.characterBar.style.display = 'block';
		this.characterStatsOpen = true;
	}
}

UI.prototype.toggleMenu = function() {
	this.audioButton.play();
	if (this.menuPanelOpen == true) {
		this.menuBar.style.display = 'none';
		this.menuPanelOpen = false;
	} else {
		this.menuBar.style.display = 'block';
		this.menuPanelOpen = true;
	}
}

UI.prototype.toggleHelp = function() {
	this.audioButton.play();
	if (this.helpBarOpen == true) {
		this.helpBar.style.display = 'none';
		this.helpBarOpen = false;
	} else {
		this.helpBar.style.display = 'block';
		this.helpBarOpen = true;
	}
}

UI.prototype.showGameOver = function() {
	this.gameOverScreen.style.display = "block";
	/*this.audioAmbient.pause();
	this.audioAmbient.load();*/
}
UI.prototype.gameOverToMainMenu = function() {
	this.audioButton.play();
	this.gameOverScreen.style.display = "none";
	this.mainMenuScreen.style.display = "block";
	
	this.inventoryBar.style.display = "none";
	this.characterBar.style.display = "none";
	this.menuBar.style.display = "none";
	this.helpBar.style.display = "none";
	this.gameOverToMainMenuBtn.style.display = "none";
	
	this.audioAmbient.pause();
	this.audioAmbient.load();
	
	this.audioDiabloFightAmbient.pause();
	this.audioDiabloFightAmbient.load();
	
	this.audioPlayerWonAmbient.pause();
	this.audioPlayerWonAmbient.load();
	
	this.bottomBar.style.display = "block";
	this.hideVictoryScreen();
	
	start();
}

UI.prototype.closeMainMenu = function() {
	this.audioButton.play();
	this.mainMenuScreen.style.display = "none";
	this.audioAmbient.play();
}

UI.prototype.playBasicAttackAudio = function() {
	var r = Math.floor(Math.random()*this.audioBasicAttack.length);
	this.audioBasicAttack[r].play();
}

UI.prototype.playWhirlwindAudio = function() {
	this.audioWhirlwind.play();
}

UI.prototype.playHealAudio = function() {
	this.audioHeal.play();
}

UI.prototype.playGetHitAudio = function() {
	
	var r = Math.floor(Math.random()*this.audioGetHit.length);
	this.audioGetHit[this.getHitCount++].play();
	if (this.getHitCount == 10) this.getHitCount = 0;
}

UI.prototype.showLoadingScreen = function() {
	this.loadingScreen.style.display = "block";
}
UI.prototype.hideLoadingScreen = function() {
	this.audioButton.play();
	this.loadingScreen.style.display = "none";
}

UI.prototype.playNormalDropAudio = function() {
	this.audioDropNormal.play();
}
UI.prototype.playLegendaryDropAudio = function() {
	this.audioDropLegendary.play();
}

UI.prototype.playPickupAudio = function() {
	this.audioPickup.play();
}

UI.prototype.playSelectWeaponAudio = function() {
	this.audioSelectWeapon.play();
}

UI.prototype.playDiabloBoastAudio = function() {
	var r = Math.floor(Math.random()*this.audioDiabloBoast.length);
	this.audioDiabloBoast[r].play();
	
	setTimeout(function() {
		ui.audioPlayerDiabloTaunt.play();
	}, 6000);
}
UI.prototype.playDiabloHalfHealthAudio= function() {
	var r = Math.floor(Math.random()*this.audioDiabloHalfHealth.length);
	this.audioDiabloHalfHealth[r].play();
}
UI.prototype.playDiabloQuarterHealthAudio = function() {
	var r = Math.floor(Math.random()*this.audioDiabloQuarterHealth.length);
	this.audioDiabloQuarterHealth[r].play();
}
UI.prototype.playDiabloKillsHeroAudio = function() {
	var r = Math.floor(Math.random()*this.audioDiabloKillsHero.length);
	this.audioDiabloKillsHero[r].play();
}
UI.prototype.playDiabloDiesAudio = function() {
	var r = Math.floor(Math.random()*this.audioDiabloDies.length);
	this.audioDiabloDies[r].play();
}
UI.prototype.playPlayerKillsDiabloAudio = function() {
	var r = Math.floor(Math.random()*this.audioPlayerKillsDiablo.length);
	this.audioPlayerKillsDiablo[r].play();
}

UI.prototype.playPlayerWonAmbientAudio = function() {
	this.audioPlayerWonAmbient.play();
}

UI.prototype.diabloDiesEndGame = function() {
	this.playDiabloDiesAudio();
	this.playPlayerKillsDiabloAudio();
	this.playPlayerWonAmbientAudio();
	this.audioDiabloFightAmbient.pause();
	this.bottomBar.style.display = "none";
	for (var e in enemy) {
		enemy[e].drawObject = false;
	}
}

UI.prototype.showVictoryScreen = function() {
	ui.victoryBar.style.display = "block";
	ui.victoryToMainMenuBtn.style.display = "block";
}
UI.prototype.hideVictoryScreen = function() {
	ui.victoryBar.style.display = "none";
	ui.victoryToMainMenuBtn.style.display = "none";
}

UI.prototype.showVictoryText = function() {
	ui.victoryText.style.display = "block";
}
UI.prototype.hideVictoryText = function() {
	ui.victoryText.style.display = "none";
}

UI.prototype.fadeOutDiabloFightAmbient = function() {
	if (this.audioDiabloFightAmbient.volume > timeTillLastUpdate/6) this.audioDiabloFightAmbient.volume -= timeTillLastUpdate/6;
	else this.audioDiabloFightAmbient.volume = 0;
}