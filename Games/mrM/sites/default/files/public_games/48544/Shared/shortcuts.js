shortcut.add("f12", function ()
{
	console.log("F12 disabled");
}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': false
});

shortcut.add("f12", function ()
{
	console.log("F12 disabled");
}, {
	'type': 'keydown',
	'target': document,
	'disable_in_input': false
});
shortcut.add("ctrl+shift+j", function ()
{
	console.log("Console Disabled");
}, {
	'type': 'keydown',
	'target': document,
	'disable_in_input': false
});
shortcut.add("ctrl+shift+j", function ()
{
	console.log("Console Disabled");
}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': false
});
shortcut.add("ctrl+shift+i", function ()
{
	console.log("Console Disabled");
}, {
	'type': 'keydown',
	'target': document,
	'disable_in_input': false
});
shortcut.add("ctrl+shift+i", function ()
{
	console.log("Console Disabled");
}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': false
});
shortcut.add("ctrl+s", function ()
{
	savegame();
	backupSavesToCloud();
	newNews(_("Game saved!"));
}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': false
});

var keysPressed = {};

document.addEventListener("keydown", e =>
{
	if(!isGameLoaded) return;
	keysPressed[e.key] = true;

	afk = 15;
	e = e || window.event;
	if(e.key == "ArrowUp")
	{
		handle(1);
	}
	else if(e.key == "ArrowDown")
	{
		handle(-1);
	}
	else if(e.key == 'Escape')
	{
		if(isBossBattleActive || battleActive)
		{
			lostBattle();
		}
		else
		{
			closeOtherUIs();
		}
	}

	if(battleActive)
	{
		if(e.key == 1 && battleInventory[0].length > 0) atk(0);
		if(e.key == 2 && battleInventory[1].length > 0) atk(1);
		if(e.key == 3 && battleInventory[2].length > 0) atk(2);
		if(e.key == 4 && battleInventory[3].length > 0) atk(3);
		if(e.key == 5 && battleInventory[4].length > 0) atk(4);
		if(e.key == 6 && battleInventory[5].length > 0) atk(5);
		if(e.key == 7 && battleInventory[6].length > 0) atk(6);
		if(e.key == 8 && battleInventory[7].length > 0) atk(7);
		if(e.key == 9 && battleInventory[8].length > 0) atk(8);
		if(e.key == 0 && battleInventory[9].length > 0) atk(9);
		if(e.key == "!" && battleInventory[10].length > 0) atk(10);
		if(e.key == "@" && battleInventory[11].length > 0) atk(11);
		if(e.key == "#" && battleInventory[12].length > 0) atk(12);
		if(e.key == "$" && battleInventory[13].length > 0) atk(13);
		if(e.key == "%" && battleInventory[14].length > 0) atk(14);
		if(e.key == "^" && battleInventory[15].length > 0) atk(15);
	}

	//Auto Locate Chests,Minerals,Battles when space is pressed
	if(metalDetectorStructure.level >= 4)
	{
		if(e.code == "Space")
		{
			//Chests
			let sortedChests = chestService.chests.sort((a, b) => a.depth - b.depth);
			for(var i = 0; i < sortedChests.length; i++)
			{
				if(chestService.chests[i])
				{
					panToViewDepth(sortedChests[i].depth)
					return;
				}
			}

			//Mineral Deposits
			for(var i = 0; i < worldClickables.length; i++)
			{
				if(worldClickables[i] && worldClickables[i].type != 3)
				{
					panToViewDepth(worldClickables[i].depth);
					return;
				}
			}

			//Battles
			if(battleWaiting.length > 0)
			{
				panToViewDepth(battleWaiting[1]);
			}
		}
	}
});

document.addEventListener("keyup", e =>
{
	if(!isGameLoaded) return;
	delete keysPressed[e.key];
});


shortcut.add("s", function () //Swap between Earth and Moon sell centres 
{
	if(!isGameLoaded) return;

	if((worldBeingViewed().name == "Earth" && !activeLayers.SELL) || (worldBeingViewed().name == "Titan" && activeLayers.SELL))
	{
		panToViewDepth(0);
		openUi(SellWindow, null, EARTH_INDEX);
	}
	else if(getMoon().hasReached() && (worldBeingViewed().name != "Moon" && worldBeingViewed().name != "Titan"))
	{
		panToViewDepth(getMoon().startDepth);
		openUi(SellWindow, null, MOON_INDEX);
	}
	else if(worldBeingViewed().name == "Moon" && !activeLayers.SELL)
	{
		panToViewDepth(getMoon().startDepth);
		openUi(SellWindow, null, MOON_INDEX);
	}
	else if(getTitan().hasReached() && (worldBeingViewed().name != "Earth" && worldBeingViewed().name != "Titan"))
	{
		panToViewDepth(getTitan().startDepth);
		openUi(SellWindow, null, TITAN_INDEX);
	}
	else if(worldBeingViewed().name == "Titan" && !activeLayers.SELL)
	{
		panToViewDepth(getTitan().startDepth);
		openUi(SellWindow, null, TITAN_INDEX);
	}
	else
	{
		panToViewDepth(0);
		openUi(SellWindow, null, EARTH_INDEX);
	}

}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': true
})

shortcut.add("h", function () //Swap between hire centres 
{
	if(!isGameLoaded) return;
	if((worldBeingViewed().name == "Earth" && !activeLayers.Hire) || (worldBeingViewed().name == "Titan" && activeLayers.Hire))
	{
		panToViewDepth(0);
		openUi(HireWindow, null, EARTH_INDEX);
	}
	else if(getMoon().hasReached() && (worldBeingViewed().name != "Moon" && worldBeingViewed().name != "Titan"))
	{
		panToViewDepth(getMoon().startDepth);
		openUi(HireWindow, null, MOON_INDEX);
	}
	else if(worldBeingViewed().name == "Moon" && !activeLayers.Hire)
	{
		panToViewDepth(getMoon().startDepth);
		openUi(HireWindow, null, MOON_INDEX);
	}
	else if(getTitan().hasReached() && (worldBeingViewed().name != "Earth" && worldBeingViewed().name != "Titan"))
	{
		panToViewDepth(getTitan().startDepth);
		openUi(HireWindow, null, TITAN_INDEX);
	}
	else if(worldBeingViewed().name == "Titan" && !activeLayers.Hire)
	{
		panToViewDepth(getTitan().startDepth);
		openUi(HireWindow, null, TITAN_INDEX);
	}
	else
	{
		panToViewDepth(0);
		openUi(HireWindow, null, EARTH_INDEX);
	}

}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': true
})

shortcut.add("d", function () //Swap between Earth and Moon blueprint centres 
{
	if(!isGameLoaded) return;

	if((worldBeingViewed().name == "Earth" && !activeLayers.crafting) || (worldBeingViewed().name == "Titan" && activeLayers.crafting))
	{
		panToViewDepth(0);
		openUi(CraftingWindow, null, EARTH_INDEX);
	}
	else if(getMoon().hasReached() && (worldBeingViewed().name != "Moon" && worldBeingViewed().name != "Titan"))
	{
		panToViewDepth(getMoon().startDepth);
		openUi(CraftingWindow, null, MOON_INDEX);
	}
	else if(worldBeingViewed().name == "Moon" && !activeLayers.crafting)
	{
		panToViewDepth(getMoon().startDepth);
		openUi(CraftingWindow, null, MOON_INDEX);
	}
	else if(getTitan().hasReached() && (worldBeingViewed().name != "Earth" && worldBeingViewed().name != "Titan"))
	{
		panToViewDepth(getTitan().startDepth);
		openUi(CraftingWindow, null, TITAN_INDEX);
	}
	else if(worldBeingViewed().name == "Titan" && !activeLayers.crafting)
	{
		panToViewDepth(getTitan().startDepth);
		openUi(CraftingWindow, null, TITAN_INDEX);
	}
	else
	{
		panToViewDepth(0);
		openUi(CraftingWindow, null, EARTH_INDEX);
	}

}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': true
})

shortcut.add("t", function () //Swap between Earth and Moon trading posts 
{
	if(!isGameLoaded) return;
	if(lastLocationIsEarth[2] && depth >= tradeConfig.tradingPosts[1].depth && getMoon().hasReached()) // If Moon isn't unlocked always just go to Earth trading post
	{   //Go to Moon
		panToViewDepth(tradeConfig.tradingPosts[1].depth);
		//Open trading post
		openUi(TradeWindow, null, MOON_INDEX);
		lastLocationIsEarth[2] = false;
	} else if(depth >= tradeConfig.tradingPosts[0].depth)	//Trading post doesn't unlock at depth 0
	{	//Go to Earth
		panToViewDepth(tradeConfig.tradingPosts[0].depth);
		//Open trading post
		openUi(TradeWindow, null, EARTH_INDEX);
		lastLocationIsEarth[2] = true;
	}
}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': true
})

shortcut.add("shift+s", function () //Scientists
{
	if(!isGameLoaded) return;
	if(!hasUnlockedScientists) return; //No scientists
	//Open scientists/relic window
	openUi(ScientistsWindow);
}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': true
})

shortcut.add("q", function () //Quests
{
	if(!isGameLoaded) return;
	if(lastLocationIsEarth[3] && depth > 299) // If Underground city isn't unlocked always just go to Earth quests
	{   //Go to Underground
		panToViewDepth(303);
		//Open quests
		openUi(QuestWindow, "", 1);
		lastLocationIsEarth[3] = false;
	} else
	{	//Go to Earth
		panToViewDepth(0);
		//Open quests
		openUi(QuestWindow);
		lastLocationIsEarth[3] = true;
	}
}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': true
})

shortcut.add("g", function () //Gems
{
	if(!isGameLoaded) return;
	if(depth < 300) return; //Underground not unlocked
	//Go to Underground
	panToViewDepth(303);
	//Open Forge/Gems window
	openUi(GemForgeWindow);
}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': true
})

shortcut.add("o", function () //Oil
{
	if(!isGameLoaded) return;
	if(depth < 300) return; //Underground not unlocked
	//Go to Underground
	panToViewDepth(303);
	//Open Oil pump window
	openUi(OilPumpWindow)
}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': true
})

shortcut.add("w", function () //Weapons
{
	if(!isGameLoaded) return;
	if(depth < 300) return; //Underground not unlocked
	//Go to Underground
	panToViewDepth(303);
	//Open Oil pump window
	openUi(WeaponCraftingWindow);
}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': true
})

shortcut.add("c", function () //Core
{
	if(!isGameLoaded) return;
	if(depth < 501) return; //Core not unlocked
	//Go to Core
	panToViewDepth(503);
	//Open Core window
	openUi(PitWindow);
}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': true
})

shortcut.add("r", function () //Reactor
{
	if(keysPressed.hasOwnProperty("Control")) return;
	if(!isGameLoaded) return;
	if(depth < REACTOR_DEPTH + 1) return;
	panToViewDepth(REACTOR_DEPTH + 1);
	openUi(ReactorWindow);
}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': true
})

shortcut.add("b", function () //Buff lab
{
	if(!isGameLoaded) return;
	if(depth < REACTOR_DEPTH + 2) return;
	panToViewDepth(REACTOR_DEPTH + 1);
	openUi(BuffLabWindow);
}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': true
})


shortcut.add("k", function () //Cave Management
{
	if(!isGameLoaded) return;
	if(depth < 45) return;
	panToViewDepth(45);
	openUi(CaveManagementWindow);
}, {
	'type': 'keyup',
	'target': document,
	'disable_in_input': true
})
