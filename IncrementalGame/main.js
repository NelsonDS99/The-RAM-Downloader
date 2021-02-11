var timer = 256
var tickRate = 16
var visualRate = 256
var spacex_RAM_MAX = 200
var value = null

//Initialization of RAM and speed
var resources = {"RAM":0,"speed":1}
//Cost of each item
var costs = {"speed":15,
	     "wifi":200,
	     "wifi_boost":15,
		"spacex": 300,
		"Damage": 150,
		"Soldier": 400}
//Costs of each item after upgrade
var growthRate = {"speed":1.25,
		  "wifi":1.5,
	     "wifi_boost":2.00,
		"spacex": 1.5,
		"Damage": 1.25,
		"Soldier": 1.50}

var increments = [{"input":["wifi","wifi_boost"],
		   "output":"RAM"}]
//Unlock the speed at 10 RAM, unlock miner at 100 RAM, unlock wifi booster at 1 wifi
var unlocks = {"speed":{"RAM":10},
	       "wifi":{"RAM":100},
	       "wifi_boost":{"wifi":1},
			"spacex": {"wifi":1},
			"Damage": {"spacex": 1},
			"Health": {"spacex":1},
			"Soldier": {"Damage": 30}}
//Download more ram
function mineRAM(num){
    resources["RAM"] += num*resources["speed"]
    updateText()
};
//Used to deal damage to enemy
function fightEnemy(num)
{
	let health = document.getElementById("health")
	health.value -= resources["Damage"]*num
	resources["Health"] = health.value
};
//Restore enemy to max value
function increaseEnemyHealth()
{
	let health = document.getElementById("health")
	health.max = resources["enemy"] * 100
	health.value = resources["enemy"] * 100
	resources["Health"] = health.max
};
//Check if enemy is still alive or dead
function checkEnemyHealth(cool)
{
	let health = document.getElementById("health")
	if(health.value != 0)
	{
		resources["RAM"] = 0
		hideEnemy()
		increaseEnemyHealth()
	}
	else
	{
		hideEnemy()
		increaseEnemyHealth()
	}
	window.clearInterval(cool)
};
//Show enemy
function enemyAppeared()
{
	if(!resources["Damage"])
	{
		resources["Damage"] = 5
	}
	if(!resources["Health"])
	{
		resources["Health"] = 100
	}
	for(var element of document.getElementsByClassName("show_enemy"))
	{
		element.style.display = "block"
	}


};
//Hide the enemy
function hideEnemy()
{
	for(var element of document.getElementsByClassName("show_enemy"))
	{
		element.style.display = "none"
	}
};
//function checkEnemyHealth()
function withdrawRAM(){
	resources["RAM"] += resources["spacex_RAM"]
	resources["spacex_RAM"] = 0
	updateText()
};
//Increase wifi boost
function upgradeWifiBoost(num){
    if ((resources["RAM"] >= costs["wifi_boost"]*num) && resources["wifi"] > 0){
	resources["wifi_boost"] += num
	resources["RAM"] -= num*costs["wifi_boost"]
	
	costs["wifi_boost"] *= growthRate["wifi_boost"]
	
	updateText()
    }
};

//Upgrade the speed
function upgradeSpeed(num){
    if (resources["RAM"] >= costs["speed"]*num){
	resources["speed"] += num
	resources["RAM"] -= num*costs["speed"]
	
	costs["speed"] *= growthRate["speed"]
	
	updateText()
    }
};
//Buy a wifi router
function buyWifi(num){
    if (resources["RAM"] >= costs["wifi"]*num){
	if (!resources["wifi"]){
	    resources["wifi"] = 0
	}
	if (!resources["wifi_boost"]){
	    resources["wifi_boost"] = 1
	}
	resources["wifi"] += num
	resources["RAM"] -= num*costs["wifi"]
	
	costs["wifi"] *= growthRate["wifi"]
	
	updateText()

	
    }
};

//Buy a spacex satellite
function buySpaceX(num)
{
	if(resources["RAM"] >= costs["spacex"]*num){
		if(!resources["spacex"]) {
			resources["spacex"] = 0
		}
		if(!resources["spacex_RAM"]){
			resources["spacex_RAM"] = 0
		}
		if(!resources["enemy"]){
			resources["enemy"] = 0
		}


		//Spacex satellites
		resources["spacex"] += num
		spacex_RAM_MAX *= resources["spacex"]
		resources["RAM"] -= num*costs["spacex"]
		//Creation of enemies
		resources["enemy"] += num + resources["spacex"] + resources["wifi"] + resources["speed"]
		costs["spacex"] *= growthRate["spacex"]

		updateText()
	}
};

//Upgrade the damage
function upgradeDamage(num)
{
	if(resources["RAM"] >= costs["Damage"]*num)
	{
		if(!resources["Damage"])
		{
			resources["Damage"] = 5
		}
		resources["Damage"] +=5
		resources["RAM"] -= num*costs["Damage"]
		costs["Damage"] *= growthRate["Damage"]

		updateText()
	}
};

//Recruit more soldiers
function upgradeSoldier(num)
{
	if(resources["RAM"] >= costs["Soldier"]*num)
	{
		if(!resources["Soldier"])
		{
			resources["Soldier"] = 0
		}

		resources["Soldier"] +=1
		resources["RAM"] -= num*costs["Soldier"]
		costs["Soldier"] *= growthRate["Soldier"]

		updateText()
	}
};

//Soldiers hurt the alien
function hurtAlien()
{
	let health = document.getElementById("health")
	health.value -= resources["Soldier"]*5
	resources["Health"] = health.value
};
function updateText(){
    for (var key in unlocks){
	var unlocked = true
	for (var criterion in unlocks[key]){
	    unlocked = unlocked && resources[criterion] >= unlocks[key][criterion]
	}
	if (unlocked){
		//Displays the specific upgrade
	    for (var element of document.getElementsByClassName("show_"+key)){		
		element.style.display = "block"
	    }
	}
    }
    
    for (var key in resources){
    	//Displays the specific RAM
	 for (var element of document.getElementsByClassName(key)){
	    element.innerHTML = resources[key].toFixed(2)
	}
    }
    for (var key in costs){
	for (var element of document.getElementsByClassName(key+"_cost")){
	    element.innerHTML = costs[key].toFixed(2)
	}
    }
document.getElementById("spacex_RAM_MAX").innerHTML = spacex_RAM_MAX

};

//Handle the wifi increments
window.setInterval(function(){
    timer += tickRate

    //What increments the RAM at the moment
    for (var increment of increments){
	total = 1
	for (var input of increment["input"]){
	    total *= resources[input]

	}
	if (total){
	    console.log(total)
	    resources[increment["output"]] += total/tickRate
	}
    }
    if(resources["spacex_RAM"] <=  spacex_RAM_MAX) {
		resources["spacex_RAM"] += (resources["spacex"] * 1) / 16
	}
    else
	{
		var difference = resources["spacex_RAM"] - spacex_RAM_MAX
		resources["spacex_RAM"] -= difference
	}
    if (timer > visualRate){
	timer -= visualRate
	updateText()
    }
  

}, tickRate);
//Occur every 16 seconds, handles the alien
window.setInterval(function()
{
	if(resources["spacex"] >= 1)
	{
		enemyAppeared()
		var cool = window.setInterval(function()
		{
			if(resources["Soldier"] > 0)
			{
				hurtAlien()
			}
		},500)
		//Occur after 8 seconds
		window.setTimeout(function(){checkEnemyHealth(cool)}, 8000)

	}
},16000)

