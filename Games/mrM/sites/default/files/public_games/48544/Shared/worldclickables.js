const MINERAL_DEPOSIT_ID = 1;
const ORANGE_FISH_ID = 2;
const CAVE_SYSTEM_ID = 3;

const DEFAULT_CLICKABLE_LIFESPAN_MSEC = 1000 * 60 * 60; //one hour
const UNSPAWNABLE_DEPTHS = [20, 50, 225, 300, 301, 302, 303, 304];
const MAX_SPAWNED_MINERAL_DEPOSITS = 3;

const MIN_ORANGE_FISH_SPAWN_TIME_SECONDS = 60 * 60 * 24;
const MAX_ORANGE_FISH_SPAWN_TIME_SECONDS = 60 * 60 * 48;
const MAX_SPAWNED_ORANGE_FISH = 1;

//####################################################################
//########################## SAVED VALUES ############################
//####################################################################

var secondsSinceOrangeFishSpawn = 0;
var secondsUntilNextOrangeFishSpawn = clickableRoller.rand(MIN_ORANGE_FISH_SPAWN_TIME_SECONDS, MAX_ORANGE_FISH_SPAWN_TIME_SECONDS);
var orangeFishCollected = 0;

//####################################################################
//################### HANDLE GAP CLICKABLE CLICKS ####################
//####################################################################

function clickedGap(relativeDepth, gapNumber)
{
    var depthClicked = (currentlyViewedDepth - (5 - relativeDepth));

    for(var i = 0; i < tradeConfig.tradingPosts.length; ++i)
    {
        if(depthClicked == tradeConfig.tradingPosts[i].depth && gapNumber == 11) //clicked trading post
        {
            // openUi(TradeWindow, null, i);
            return;
        }
    }
    if(gapNumber == 11)
    {
        //AO: I don't like how this is, gotta fix this when we redo all hitbox processing
        onWorkerClicked(relativeDepth, 6);
        clickedGap(relativeDepth, 5);
    }

    if(depthClicked == 50 && gapNumber == 1) //clicked golem
    {
        if(hasFoundGolem == 0)
        {
            // Make golem blueprints available in the shop
            hasFoundGolem = 1;
            learnRangeOfBlueprints(1, 16, 31);
            startFoundGolemDialogue();
        }
        else
        {
            //Later have more dialogue
            openUi(CraftingWindow);
        }
    }

    if(depthClicked == 100)
    {
        if(chestCollectorChanceStructure.level == 0 && chestCollectorStorageStructure.level == 0)
        {
            chestCollectorChanceStructure.level = 1;
            chestCollectorStorageStructure.level = 1;
            learnRangeOfBlueprints(3, 8, 9);
            newNews(_("Discovered the Chest Collector!"));
        }
    }

    if(depthClicked == 112 && gapNumber == 2) //clicked mime
    {
        questManager.getQuest(94).markComplete();
    }

    if(depthClicked == 225 && gapNumber == 1) //clicked robot
    {
        if(hasFoundGidget == 0)
        {
            hasFoundGidget = 1;
            learnRangeOfBlueprints(1, 32, 47);
            startFoundGidgetDialogue();
        }
        else
        {
            //Later have more dialogue
            openUi(CraftingWindow);
        }
    }

    if(depthClicked == 1019 && isUfoVisible())
    {
        //unlock ufo quest
        questManager.getQuest(95).markComplete();
        hasFoundUfo = 1;
    }

    if(depthClicked == 1257 && gapNumber == 1) //clicked robot MK2
    {
        learnRangeOfBlueprints(1, 79, 87);
        openUi(CraftingWindow);
    }

    if(isClickableAtDepth(depthClicked)) //clicked a clickable
    {
        var clickableAtDepth = getClickableAtDepth(depthClicked);
        if(clickableAtDepth.maxClicks > clickableAtDepth.clicks && gapNumber == clickableAtDepth.spawnLocation)
        {
            clickableData[clickableAtDepth.type].onClick(clickableAtDepth);
        }
    }

    if(metalDetectorStructure.level >= 5 && chestService.chestExistsAtDepth(depthClicked) && !isClickableAtDepth(depthClicked))
    {
        chestService.presentChest(depthClicked);
    }
}

//####################################################################
//############################ CLICKABLES ############################
//####################################################################

var clickableData = {};
clickableData[MINERAL_DEPOSIT_ID] = {
    "name": "Mineral Deposit",
    "onSpawn": onSpawnMineralDeposit,
    "onClick": onClickedMineralDeposit, //args: self
    "rollForSpawn": rollForMineralDepositSpawn
};
clickableData[ORANGE_FISH_ID] = {
    "name": "Orange Fish",
    "onSpawn": onSpawnOrangeFish,
    "onClick": onClickedOrangeFish, //args: self
    "rollForSpawn": rollForOrangeFishSpawn
};
clickableData[CAVE_SYSTEM_ID] = {
    "name": "Cave System",
    "onSpawn": function () { },
    "onClick": onClickedCaveSystem, //args: self
    "rollForSpawn": function () { }
};

var clickablesSpawned = 0; //used for uids
var worldClickables = [];

//Runs every 30 seconds
function spawnWorldClickables()
{
    removeExpiredClickables();
    updateCaveSystemSpawns();
    for(var key in clickableData)
    {
        clickableData[key].rollForSpawn();
    }
}

function disposeWorldClickable(clickable)
{
    for(var i = worldClickables.length - 1; i >= 0; i--)
    {
        if(worldClickables[i].uid == clickable.uid)
        {
            if(worldClickables[i].hitbox)
            {
                var level = activeLayers.WorldLayer.getHitboxById("level_" + worldClickables[i].depth);
                level.deleteHitboxWithId(worldClickables[i].hitbox.id);
            }
            worldClickables.splice(i, 1);
            return;
        }
    }
}

function removeClickablesOfType(clickableType)
{
    for(var i = worldClickables.length - 1; i >= 0; i--)
    {
        if(worldClickables[i].type == clickableType)
        {
            worldClickables.splice(i, 1);
        }
    }
}

function removeExpiredClickables()
{
    var currentGameTime = currentTime();
    for(var i = worldClickables.length - 1; i >= 0; i--)
    {
        if(worldClickables[i].expireTime < currentGameTime)
        {
            worldClickables.splice(i, 1);
        }
    }
}

function numClickablesOfType(type)
{
    var result = 0;
    for(var i = 0; i < worldClickables.length; i++)
    {
        if(worldClickables[i].type == type) result++;
    }
    return result;
}

function isClickableAtDepth(depthToCheck)
{
    for(var i = 0; i < worldClickables.length; i++)
    {
        if(worldClickables[i].depth == depthToCheck) return true;
    }
    return false;
}

function getClickableAtDepth(depthToCheck)
{
    for(var i = 0; i < worldClickables.length; i++)
    {
        if(worldClickables[i].depth == depthToCheck) return worldClickables[i];
    }
    return null;
}

function isSpawnableAtDepth(depthToCheck)
{
    return !isDepthWithoutWorkers(depthToCheck);
}

//####################################################
//################# MINERAL DEPOSITS #################
//####################################################

function getMineralDepositType(depthToCheck)
{
    //get most popular mineral type on the level
    var typesAtDepth = levels[depthToCheck];
    var maxValue = 0;
    var maxValueType = 1;
    for(var i = 0; i < typesAtDepth.length; i++)
    {
        if(typesAtDepth[i][1] > maxValue)
        {
            maxValue = typesAtDepth[i][1];
            maxValueType = typesAtDepth[i][0];
        }
    }
    return maxValueType;
}

function rollForMineralDepositSpawn()
{
    if(depth > 100 && clickableRoller.rand(0 + STAT.mineralDepositMultiplier(), 30) == 30 &&
        numClickablesOfType(MINERAL_DEPOSIT_ID) < MAX_SPAWNED_MINERAL_DEPOSITS + STAT.additionalMineralDeposits() &&
        !isCapacityFull()
    ) //every 15min on average, no more than 3 available at a time
    {
        onSpawnMineralDeposit();
    }
}

function onSpawnMineralDeposit()
{
    var minDepthToSpawn = Math.max(0, depth - 100);
    var depthToSpawn = clickableRoller.rand(minDepthToSpawn, depth);
    if(!isClickableAtDepth(depthToSpawn) && isSpawnableAtDepth(depthToSpawn))
    {
        var mineralTypeToSpawn = getMineralDepositType(depthToSpawn);

        var numMineralsPerMinute = estimatedMineralsPerMinuteAtLevel(depthToSpawn);
        var minimumMinutesWorthOfMineral = 10;
        var maximumMinutesWorthOfMineral = Math.max(10, depth / 2);
        var numMineralsToSpawnCandidate1 = clickableRoller.rand(minimumMinutesWorthOfMineral, maximumMinutesWorthOfMineral) * numMineralsPerMinute[mineralTypeToSpawn];

        var moneyGeneratedPerMinute = valueOfMineralsPerSecond() * 60n;
        var minutesOfMoneyInMineralAwarded = BigInt(clickableRoller.rand(10, 20));
        var moneyInMineralAwarded = (moneyGeneratedPerMinute * minutesOfMoneyInMineralAwarded);
        var numMineralsToSpawnCandidate2 = moneyInMineralAwarded / worldResources[mineralTypeToSpawn].sellValue;

        var numMineralsToSpawn = bigIntMin(500000000n, bigIntMax(BigInt(parseInt(numMineralsToSpawnCandidate1)), numMineralsToSpawnCandidate2));
        var numMineralPerClick = parseInt(numMineralsToSpawn / 5n);

        if(!Number.isNaN(numMineralPerClick))
        {
            var newClickable = getNewMineralDeposit(++clickablesSpawned, mineralTypeToSpawn, numMineralPerClick, depthToSpawn, rand(1, 9));
            worldClickables.push(newClickable);
        }
    }
}

function getNewMineralDeposit(uid, mineralType, valuePerClick, depthToSpawn, spawnLocation)
{
    var newClickable = {
        "uid": uid,
        "type": MINERAL_DEPOSIT_ID,
        "subType": mineralType,
        "valuePerClick": valuePerClick,
        "depth": depthToSpawn,
        "spawnLocation": spawnLocation,
        "clicks": 0,
        "maxClicks": 5,
        "renderAssetFunction": renderMineralDeposit(mineralType),
        "expireTime": currentTime() + DEFAULT_CLICKABLE_LIFESPAN_MSEC,
        "spawnTime": currentTime()
    };
    newClickable.hitbox = createClickableHitbox(newClickable);

    return newClickable;
}

function renderMineralDeposit(mineralType)
{
    return function (x, y, clickableObject)
    {
        var oreDepositAsset = window["ore" + mineralType + "deposit"];

        var timeSinceSpawn = currentTime() - clickableObject.spawnTime;
        var sizeMultiplier = Math.min(1, (timeSinceSpawn / 500));
        var renderWidth = mainw * .045 * sizeMultiplier;
        var maxRenderWidth = mainw * .045;
        var renderHeight = mainh * .09 * sizeMultiplier;
        var maxRenderHeight = mainh * .09;

        if(oreDepositAsset)
        {
            MAIN.drawImage(oreDepositAsset, (oreDepositAsset.width / 4) * Math.min(clickableObject.clicks, 3), 0, oreDepositAsset.width / 4, oreDepositAsset.height, x + ((maxRenderWidth - renderWidth) / 2), y + (maxRenderHeight - renderHeight), renderWidth, renderHeight);
        }
    };
}

function renderMineralDepositHitbox(mineralType)
{
    return function (clickableObject)
    {
        var hitbox = clickableObject.hitbox;
        var coords = hitbox.getGlobalCoordinates(0, 0);
        var oreDepositAsset = document.getElementById("ore" + mineralType + "deposit");
        var timeSinceSpawn = currentTime() - clickableObject.spawnTime;
        var sizeMultiplier = Math.min(1, (timeSinceSpawn / 500));
        var maxRenderWidth = hitbox.boundingBox.width;
        var renderWidth = maxRenderWidth * sizeMultiplier;
        var maxRenderHeight = hitbox.boundingBox.height;
        var renderHeight = maxRenderHeight * sizeMultiplier;
        MAIN.drawImage(
            oreDepositAsset,
            (oreDepositAsset.width / 4) * Math.min(clickableObject.clicks, 3),
            0,
            oreDepositAsset.width / 4,
            oreDepositAsset.height,
            coords.x + ((maxRenderWidth - renderWidth) / 2),
            coords.y + (maxRenderHeight - renderHeight),
            renderWidth,
            renderHeight
        );
        hitbox.renderChildren();
    };
}

function onClickedMineralDeposit(clickableObject)
{
    if(clickableObject.clicks < clickableObject.maxClicks)
    {
        if(!mutebuttons) clickMineral[rand(0, clickMineral.length - 1)].play();
        clickableObject.clicks++;
        if(!isNaN(clickableObject.valuePerClick))
        {
            showFloatingText("+" + beautifynum(clickableObject.valuePerClick) + "x " + worldResources[clickableObject.subType].name, "16px Verdana", "#FFFFFF", (mouseX / uiScaleX) + rand(-10, 10), (mouseY / uiScaleY) - rand(10, 25), 1200, true, sinSquared, getFunctionYMovementOnly(easeInPowerFunction(2), -30));
            worldResources[clickableObject.subType].numOwned += clickableObject.valuePerClick;
        }
        else
        {
            clickableObject.clicks = clickableObject.maxClicks;
        }
    }
    if(clickableObject.clicks >= clickableObject.maxClicks)
    {
        disposeWorldClickable(clickableObject);
    }
}

//####################################################
//################### ORANGE FISH ####################
//####################################################

function rollForOrangeFishSpawn()
{
    if(depth > 51 && secondsSinceOrangeFishSpawn >= secondsUntilNextOrangeFishSpawn && numClickablesOfType(ORANGE_FISH_ID) < MAX_SPAWNED_ORANGE_FISH)
    {
        onSpawnOrangeFish();
    }
}

function onSpawnOrangeFish()
{
    var depthToSpawn = clickableRoller.rand(51, depth);
    if(!isClickableAtDepth(depthToSpawn) && isSpawnableAtDepth(depthToSpawn))
    {
        var newClickable = getNewOrangeFishClickable(++clickablesSpawned, depthToSpawn, clickableRoller.rand(1, 9));
        worldClickables.push(newClickable);
    }
}

function getNewOrangeFishClickable(uid, depthToSpawn, spawnLocation)
{
    var newClickable = {
        "uid": uid,
        "type": ORANGE_FISH_ID,
        "depth": depthToSpawn,
        "spawnLocation": spawnLocation,
        "clicks": 0,
        "maxClicks": 5,
        "renderAssetFunction": renderOrangeFish(),
        "expireTime": Number.MAX_SAFE_INTEGER, //don't expire
        "spawnTime": currentTime()
    };
    newClickable.hitbox = createClickableHitbox(newClickable);

    return newClickable;
}

function renderOrangeFish()
{
    return function (x, y, clickableObject)
    {
        MAIN.drawImage(orangeFish, (orangeFish.width / 4) * Math.min(clickableObject.clicks, 3), 0, orangeFish.width / 4, orangeFish.height, x, y, mainw * .045, mainh * .09);
    };
}

function renderOrangeFishHitbox()
{
    return function (clickableObject)
    {
        var hitbox = clickableObject.hitbox;
        var coords = hitbox.getGlobalCoordinates(0, 0);
        MAIN.drawImage(
            orangeFish,
            (orangeFish.width / 4) * Math.min(clickableObject.clicks, 3),
            0,
            orangeFish.width / 4,
            orangeFish.height,
            coords.x,
            coords.y,
            hitbox.boundingBox.width,
            hitbox.boundingBox.height
        );
    };
}

function onClickedOrangeFish(clickableObject)
{
    secondsSinceOrangeFishSpawn = 0;
    secondsUntilNextOrangeFishSpawn = clickableRoller.rand(MIN_ORANGE_FISH_SPAWN_TIME_SECONDS, MAX_ORANGE_FISH_SPAWN_TIME_SECONDS);

    if(clickableObject.clicks < clickableObject.maxClicks)
    {
        if(!mutebuttons) clickMineral[rand(0, clickMineral.length - 1)].play();
        clickableObject.clicks++;

        var grantedText = "";
        var hoursOfValue = Math.max(0.5, depth / 200);
        var minutesOfValue = 60 * hoursOfValue;
        switch(clickableRoller.rand(0, 4))
        {
            case 0:
                //money
                var moneyGranted = valueOfMineralsPerSecond() * 60n * BigInt(parseInt(minutesOfValue));
                addMoney(moneyGranted);
                grantedText = "$" + beautifynum(moneyGranted);
                break;
            case 1:
                //1 ticket
                tickets++;
                grantedText = _("1x ticket");
                break;
            case 2:
                //ores
                grantedText = grantMineral(getMineralDepositType(clickableRoller.rand(Math.floor(depth / 2), depth)), hoursOfValue);
                break;
            case 3:
                //building materials
                var buildingMaterialsGained = Math.floor(Math.max(1, hoursOfValue));
                worldResources[BUILDING_MATERIALS_INDEX].numOwned += buildingMaterialsGained;
                grantedText = _("{0}x building materials", buildingMaterialsGained);
                break;
            case 4:
                //building materials (double)
                var buildingMaterialsGained = Math.floor(Math.max(1, hoursOfValue * 2));
                worldResources[BUILDING_MATERIALS_INDEX].numOwned += buildingMaterialsGained;
                grantedText = _("{0}x building materials", buildingMaterialsGained);
                break;
        }
        showFloatingText("+" + grantedText, "16px Verdana", "#FFFFFF", (mouseX / uiScaleX) + rand(-10, 10), (mouseY / uiScaleY) - rand(10, 25), 1200, true, sinSquared, getFunctionYMovementOnly(easeInPowerFunction(2), -30));
    }
    if(clickableObject.clicks >= clickableObject.maxClicks)
    {
        disposeWorldClickable(clickableObject);
        orangeFishCollected++;
    }
}

function createClickableHitbox(clickable)
{
    var worldLayer = activeLayers.WorldLayer;
    if(worldLayer)
    {
        var level = worldLayer.getHitboxById("level_" + clickable.depth);
        if(level)
        {
            var xPos = worldConfig.levelClickableWidth * (clickable.spawnLocation - 0.5) + worldConfig.levelClickableSpacing * (clickable.spawnLocation - 1);
            var hitbox = new Hitbox(
                {
                    x: xPos,
                    y: level.boundingBox.height * 0.2,
                    width: worldConfig.levelClickableWidth * 1.3,
                    height: worldConfig.levelClickableHeight * 1.3
                },
                {
                    onmousedown: function (clickable)
                    {
                        if(clickable)
                        {
                            clickableData[clickable.type].onClick(clickable)
                        }
                        else
                        {
                            this.parent.deleteHitboxWithId(this.id);
                        }
                    }.bind(hitbox, clickable)
                },
                "pointer",
                "clickable_" + clickable.uid
            )
            switch(clickable.type)
            {
                case MINERAL_DEPOSIT_ID:
                    hitbox.render = renderMineralDepositHitbox(clickable.subType).bind(hitbox, clickable);
                    hitbox.addHitbox(new EasyHintArrow(
                        "down",
                        function ()
                        {
                            return numCoalOwned() < 30 && getEarth().workersHired == 0 && money < 30
                        },
                        -0.45
                    ));
                    break;
                case ORANGE_FISH_ID:
                    hitbox.render = renderOrangeFishHitbox(clickable.subType).bind(hitbox, clickable);
                    break;
                case CAVE_SYSTEM_ID:
                    hitbox.render = renderCaveSystemHitbox(clickable.subType).bind(hitbox, clickable);
                    hitbox.addHitbox(new EasyHintArrow(
                        "down",
                        function ()
                        {
                            return numberOfCavesExplored == 0;
                        },
                        -0.45
                    ));
                    break;
            }
            level.addHitbox(hitbox);
            return hitbox;
        }
    }
    return null;
}

//####################################################
//################### CAVE SYSTEM ####################
//####################################################

function updateCaveSystemSpawns()
{
    //Check cave systems and see if one of the systems is not listed
    //Check km depth and use this to determine spawn depth and whether it works there
    var activeCaves = getActiveCaves();
    for(var i = 0; i < activeCaves.length; i++)
    {
        if(getClickableAtDepth(activeCaves[i].kmDepth) == null)
        {
            var newClickable = getNewCaveSystemClickable(++clickablesSpawned, activeCaves[i].kmDepth, 1 + activeCaves[i].kmDepth % 9);
            worldClickables.push(newClickable);
        }
    }

    //Check if there are cave system clickables on a depth that there is no system
    for(var i = worldClickables.length - 1; i >= 0; i--)
    {
        if(worldClickables[i].type == CAVE_SYSTEM_ID)
        {
            if(getCaveAtDepth(worldClickables[i].depth) == null)
            {
                disposeWorldClickable(worldClickables[i]);
            }
        }
    }
}

function getNewCaveSystemClickable(uid, depthToSpawn, spawnLocation)
{
    var newClickable = {
        "uid": uid,
        "type": CAVE_SYSTEM_ID,
        "depth": depthToSpawn,
        "spawnLocation": spawnLocation,
        "clicks": 0,
        "maxClicks": Number.MAX_SAFE_INTEGER,
        "renderAssetFunction": renderCaveSystem(),
        "expireTime": Number.MAX_SAFE_INTEGER, //don't expire
        "spawnTime": currentTime()
    };
    newClickable.hitbox = createClickableHitbox(newClickable);

    return newClickable;
}

function renderCaveSystem()
{
    return function (x, y, clickableObject)
    {
        if(getCaveAtDepth(clickableObject.depth) != null)
        {
            var caveTimeRemaining = getCaveAtDepth(clickableObject.depth).remainingSeconds;
            if(caveTimeRemaining > 0)
            {
                var caveAsset = earthCave1;
                if(worldAtDepth(clickableObject.depth).name == "Earth")
                {
                    if(clickableObject.depth < 500)
                    {
                        caveAsset = earthCave1;
                    }
                    else
                    {
                        caveAsset = earthCave2;
                    }
                }
                else
                {
                    if(clickableObject.depth < 1500)
                    {
                        caveAsset = moonCave1;
                    }
                    else
                    {
                        caveAsset = moonCave2;
                    }
                }

                MAIN.drawImage(caveAsset, 0, 0, caveAsset.width, caveAsset.height, x, y, mainw * .045, mainh * .09);
                MAIN.save();
                MAIN.font = "10px Verdana";
                MAIN.fillStyle = "#FFFFFF";
                MAIN.strokeStyle = "#000000";
                MAIN.lineWidth = 3;
                var xCoordinateOfText = ((mainw * .045) - MAIN.measureText(formattedCountDown(caveTimeRemaining)).width) / 2;
                MAIN.strokeText(formattedCountDown(caveTimeRemaining), x + xCoordinateOfText, y + mainh * .09);
                MAIN.fillText(formattedCountDown(caveTimeRemaining), x + xCoordinateOfText, y + mainh * .09);
                MAIN.restore();
            }
        }
    };
}

function renderCaveSystemHitbox()
{
    return function (clickableObject)
    {
        var hitbox = clickableObject.hitbox;
        var coords = hitbox.getGlobalCoordinates(0, 0);
        if(getCaveAtDepth(clickableObject.depth) != null)
        {
            var caveTimeRemaining = getCaveAtDepth(clickableObject.depth).remainingSeconds;
            if(caveTimeRemaining > 0)
            {
                var caveAsset = earthCave1;
                if(worldAtDepth(clickableObject.depth).name == "Earth")
                {
                    if(clickableObject.depth < 500)
                    {
                        caveAsset = earthCave1;
                    }
                    else
                    {
                        caveAsset = earthCave2;
                    }
                }
                else if(worldAtDepth(clickableObject.depth).name == "Moon")
                {
                    if(clickableObject.depth < 1500)
                    {
                        caveAsset = moonCave1;
                    }
                    else
                    {
                        caveAsset = moonCave2;
                    }
                }

                MAIN.drawImage(caveAsset, coords.x, coords.y, hitbox.boundingBox.width, hitbox.boundingBox.height);
                MAIN.save();
                MAIN.font = "14px Verdana";
                MAIN.fillStyle = "#FFFFFF";
                MAIN.strokeStyle = "#000000";
                MAIN.lineWidth = 3;
                MAIN.textBaseline = "top";

                strokeTextShrinkToFit(MAIN, formattedCountDown(caveTimeRemaining), coords.x - (this.boundingBox.width * .25), coords.y + this.boundingBox.height - 13, this.boundingBox.width * 1.5, "center");
                fillTextShrinkToFit(MAIN, formattedCountDown(caveTimeRemaining), coords.x - (this.boundingBox.width * .25), coords.y + this.boundingBox.height - 13, this.boundingBox.width * 1.5, "center");
                MAIN.restore();
            }
        }
        hitbox.renderChildren();
    };
}

function onClickedCaveSystem(clickableObject)
{
    //open the UI for the cave system at the given depth
    if(getCaveAtDepth(clickableObject.depth) != null)
    {
        if(!mutebuttons) clickMineral[rand(0, clickMineral.length - 1)].play();
        openUi(CaveWindow, null, clickableObject.depth);
    }
}

function isUfoVisible()
{
    return hasFoundUfo == 0 && depth > 1000 && ((currentTime() / 60000) % 600) <= 15;
}