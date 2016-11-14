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