function UI() {
	this.topBar = document.getElementById("topBar");
	this.enemyHealthBar = document.getElementById("enemyHealthBar");
	this.enemyHealthBarPercentage = document.getElementById("enemyHealthBarPercentage");
	this.enemyHealthBarName = document.getElementById("enemyHealthBarName");
}


UI.prototype.update = function() {
	
	if (currentlyPressedEntity == null) this.hideEnemyHealthBar();
	else {
		var percentage = Math.floor((currentlyPressedEntity.HP / currentlyPressedEntity.maxHP) * 100);
		this.enemyHealthBarPercentage.style.width = "" + percentage + "%";
		this.enemyHealthBarName.innerHTML = currentlyPressedEntity.name;
		this.showEnemyHealthBar();
	}
	
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