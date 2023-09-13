// ##################################################################
// ##################### GLOBAL VARIABLES ###########################
// ##################################################################
const CHARACTER_BLINK_PERIOD = 36;

var isHoveringOverGarage = 0;
var flickerinventory = false;
var flickercraft = false;
var windowState = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var saveButtons = [0, 0, 0, 0, 0, 0, 0];
var hasAnimatedThisFrame = 0;
var isArrowOnTopLevel = false;

var minerImages = [miner, miner1, miner2, miner3, miner4, miner5, miner6, miner7, miner8, miner9, miner10];
var lunarMinerImages = [lunarminer1, lunarminer2, lunarminer3, lunarminer4, lunarminer5, lunarminer6, lunarminer7, lunarminer8, lunarminer9, lunarminer10, lunarminer11];
var titanMinerImages = [titanminer1, titanminer2, titanminer3, titanminer4, titanminer5, titanminer6, titanminer7, titanminer8, titanminer9, titanminer10, titanminer11];
var minerHatImages = [bigtransblock, bigtransblock, bigtransblock, bigtransblock, bigtransblock, bigtransblock, bigtransblock, bigtransblock, bigtransblock, bigtransblock, bigtransblock];
//var upgradeMinerImages = [0, upgrade1, upgrade2, upgrade3, upgrade4, upgrade5, upgrade6, upgrade7, upgrade8, upgrade9, upgrade10];

var uiScaleX = 1;
var uiScaleY = 1;

var limitFramerate = false;
var maxFramerate = 60;
var isWaitingForRender = false;
var lastRenderTime = 0;
var renderTimeout = 1000; // Time until game gives up on rendering current frame

if(isXmas)
{
    minerHatImages = [hat1, hat1, hat2, hat3, hat4, bigtransblock, bigtransblock, hat7, hat8, hat9, bigtransblock];
}
else if(isHalloween)
{
    minerHatImages = [witchhat1, witchhat1, witchhat2, witchhat3, witchhat4, bigtransblock, bigtransblock, witchhat7, witchhat8, witchhat9, bigtransblock];
}

//what was found per miner per deapth viewable
var found = [
    [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
]; //clear top or bottom when currentlyViewedDepth is moved up or down

var backpackRenderLoop;

// ##################################################################
// ##################### ANIMATE DISPLAYS ###########################
// ##################################################################

var animationFrameRequest;
var renderDeltaTime = 1;

function animate()
{
    if(isSimulating) return;
    if(!isWaitingForRender || performance.now() > lastRenderTime + renderTimeout)
    {
        if(animationFrameRequest)
        {
            cancelAnimationFrame(animationFrameRequest);
            animationFrameRequest = null;
        }
        isWaitingForRender = true;
        animationFrameRequest = requestAnimationFrame(_animate);
    }
}

function _animate()
{
    if(isSimulating || (isMobile() && limitFramerate && performance.now() < lastRenderTime + 1000 / maxFramerate))
    {
        return;
    }

    renderDeltaTime = performance.now() - lastRenderTime;

    if(isGameLoaded)
    {
        renderUi();
    }

    if(chosen > -1 && !isTimelapseOn)
    {
        renderDialogues();
        renderHintArrows();
        drawEffects();
    }
    else if(!isMobile())
    {
        renderLoadingScreen();
    }



    lastRenderTime = performance.now();
    isWaitingForRender = false;
    animationFrameRequest = null;
}

// ###################################################
// ##################### MAIN UI #####################
// ###################################################

function renderUi()
{
    //AO: Is this still in use?
    if(windowState[7] > 0)
    {
        renderPurchaseUi();
    }
    for(var key in activeLayers)
    {
        if(!activeLayers[key].overrideRendering)
        {
            activeLayers[key].render();
        }
    }
}

function updateUi(deltaTime)
{
    for(var key in activeLayers)
    {
        activeLayers[key].update(deltaTime);
    }
}

function renderUiOnSubinterval(layerName, uiFunction, subinterval, uiRenderLoop, ...params)
{
    if(subinterval < interval)
    {
        clearInterval(uiRenderLoop);
        uiRenderLoop = setInterval(
            function ()
            {
                if(activeLayers[layerName])
                {
                    uiFunction(...params);
                }
                else
                {
                    clearInterval(uiRenderLoop);
                }
            },
            subinterval
        );
    }
    else
    {
        uiFunction(...params);
    }
}

// ##################################################
// ##################### HEADER #####################
// ##################################################



// ##################################################
// ##################### HINTS ######################
// ##################################################

var showHintArrows = true;
function renderHintArrows()
{
    if(isMobile() || !showHintArrows) return;

    var arrowOnTopLevel = false;
    // ### Top City Hints ###
    if(!activeLayers.hasOwnProperty("SELL") &&
        (
            (getEarth().workersHired == 0 && getValueOfMinerals() >= getEarth().workerHireCost()) || // Can hire first worker
            (getBlueprintCount() == 6 && getValueOfMinerals() >= 150) ||     // Can craft first blueprint
            (drillState.drill().level == 1 && getValueOfMinerals() >= 250) || // Can craft second blueprint
            (isCapacityFull() &&                                            // Capacity is full and has crafted <= 2 blueprints
                drillState.engine().level + drillState.drill().level + drillState.fan().level + drillState.cargo().level <= 6 // Sum of drill part levels <= 6
            ) ||
            (drillState.engine().level == 1 && drillBlueprints[0].ingredients[0].item.getName() == _("Money") &&
                getValueOfMineralsExcludingHe3() >= drillBlueprints[0].ingredients[0].quantity)
        )
    )
    {
        //arrow on sell center
        arrowOnTopLevel = true;
        MAIN.drawImage(arrow, 0, 0, arrow.width, arrow.height, Math.ceil(mainw * .21), Math.ceil(mainh * (.33 - (.179 * currentlyViewedDepth) + (oscillate(numFramesRendered, 8) * .018))), Math.floor(mainw * .05), Math.floor(mainh * .12));
    }
    if(!activeLayers.hasOwnProperty("Hire") && money >= getEarth().workerHireCost() && getEarth().workersHired == 0)
    {
        //arrow on hire center
        arrowOnTopLevel = true;
        MAIN.drawImage(arrow, 0, 0, arrow.width, arrow.height, Math.ceil(mainw * .41), Math.ceil(mainh * (.37 - (.179 * currentlyViewedDepth) + (oscillate(numFramesRendered, 8) * .018))), Math.floor(mainw * .05), Math.floor(mainh * .12));
    }
    if(!activeLayers.hasOwnProperty("Arch") && numExcavationsCompleted == 0 && hasUnlockedScientists != 0 && numActiveScientists() > 0 && !isOnActiveExcavation(0))
    {
        //arrow on scientist building
        arrowOnTopLevel = true;
        if(currentlyViewedDepth == 0)
        {
            MAIN.drawImage(arrow, 0, 0, arrow.width, arrow.height, Math.ceil(mainw * .31), Math.ceil(mainh * (.20 - (.179 * currentlyViewedDepth) + (oscillate(numFramesRendered, 8) * .018))), Math.floor(mainw * .05), Math.floor(mainh * .12));
        }
    }
    if(numCoalOwned() < 30 && getEarth().workersHired == 0 && worldClickables.length > 0 && money < 30)
    {
        //arrow on mineral deposit
        var yCoordinateOfLevelTop = mainh * .111 + ((4 - (currentlyViewedDepth - worldClickables[0].depth)) * .178 * mainh);
        MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, mainw * (.135 + ((worldClickables[0].spawnLocation - 1) * .072)) + (oscillate(numFramesRendered, 8) * mainh * .018), yCoordinateOfLevelTop + (mainh * .075), Math.floor(mainw * .075), Math.floor(mainh * .08));
    }
    if(currentlyViewedDepth == 0 && depth >= 1 && !hasBranchTriggered(0) && depth < 10)
    {
        MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.08)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * .90), Math.floor(mainw * .075), Math.floor(mainh * .08));
    }
    if((getBlueprintCount() > 0 &&
        (!hasCraftedABlueprint && canCraftAnyBlueprint(1)) ||
        (drillState.drill().level == 1 && canCraftBlueprint(1))) || playerNeedsHelpCraftingManager())
    {
        // Player owns blueprints but hasn't crafted any
        if(!activeLayers.crafting)
        {
            //arrow on drill center
            arrowOnTopLevel = true;
            MAIN.drawImage(arrow, Math.ceil(mainw * .65), Math.ceil(mainh * (.34 - (.179 * currentlyViewedDepth) + (oscillate(numFramesRendered, 8) * .018))), Math.floor(mainw * .05), Math.floor(mainh * .12));
        }
        else
        {
            if(playerNeedsHelpCraftingManager() && activeLayers.crafting.currentTabIndex != 1)
            {
                MAIN.drawImage(arrow, Math.ceil(mainw * .38), Math.ceil(mainh * (.11 - (.179 * currentlyViewedDepth) + (oscillate(numFramesRendered, 8) * .018))), Math.floor(mainw * .03), Math.floor(mainh * .075));
            }

            if((!hasCraftedABlueprint && activeLayers.crafting.currentTabIndex == 0) || (playerNeedsHelpCraftingManager() && activeLayers.crafting.currentTabIndex == 1))
            {

                if(!activeLayers.crafting.selectedBlueprint)
                {
                    if(activeLayers.crafting.blueprintListHitboxes[0].isCollapsed)
                    {
                        MAIN.drawImage(
                            arrowright,
                            Math.floor(mainw * 0.165) + (oscillate(numFramesRendered, 8) * mainw * .013),
                            Math.ceil(mainh * 0.26),
                            Math.floor(mainw * 0.075),
                            Math.floor(mainh * 0.08)
                        );
                    }
                    else if(activeLayers.crafting.currentTabIndex == 0)
                    {
                        MAIN.drawImage(
                            arrowright,
                            Math.floor(mainw * 0.165) + (oscillate(numFramesRendered, 8) * mainw * .013),
                            Math.ceil(mainh * 0.35),
                            Math.floor(mainw * 0.075),
                            Math.floor(mainh * 0.08)
                        );
                    }
                    else if(activeLayers.crafting.currentTabIndex == 1)
                    {
                        activeLayers.crafting.openTab(1);
                        activeLayers.crafting.selectedBlueprint = getBlueprintById(3, 2);
                        activeLayers.crafting.initializeCraftingPane();
                    }

                }
                else
                {
                    MAIN.drawImage(
                        arrowleft,
                        Math.floor(mainw * 0.75) + (oscillate(numFramesRendered, 8) * mainw * .013),
                        Math.ceil(mainh * 0.68),
                        Math.floor(mainw * 0.075),
                        Math.floor(mainh * 0.08)
                    );
                }
            }
        }
    }
    for(var i = 0; i < questManager.quests.length; i++)
    {
        if(questManager.getQuest(i) && questManager.getQuest(i).isCollectable())
        {
            //arrow on the quest guy since a quest was completed
            arrowOnTopLevel = true;
            MAIN.drawImage(arrow, 0, 0, arrow.width, arrow.height, Math.ceil(mainw * .63), Math.ceil(mainh * (.19 - (.179 * currentlyViewedDepth) + (oscillate(numFramesRendered, 8) * .018))), Math.floor(mainw * .05), Math.floor(mainh * .12));
            break;
        }
    }
    // ### Minerl Deposit Hint ###
    if(depth < 10 && depth >= 5 && isClickableAtDepth(5) && getClickableAtDepth(5).spawnLocation == 10)
    {
        if(currentlyViewedDepth >= 5)
        {
            for(var i = 0; i < 5; i++)
            {
                if((currentlyViewedDepth - i) == 5)
                {
                    MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.80)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * (.175 + (.178 * (4 - i)))), Math.floor(mainw * .075), Math.floor(mainh * .08));
                }
            }
        }
    }

    // ### Trading Post Hint ### 
    for(var i in tradeConfig.tradingPosts)
    {
        var trades = getTradesForWorld(i);
        if(isTradeAvailable(trades[0]) && !tradeConfig.tradingPosts[i].playerHasSeenNewTrade)
        {
            if(depth >= tradeConfig.tradingPosts[i].depth && currentlyViewedDepth >= tradeConfig.tradingPosts[i].depth)
            {
                for(var j = 0; j < 5; j++)
                {
                    if((currentlyViewedDepth - j) == tradeConfig.tradingPosts[i].depth)
                    {
                        MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.5)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * (.15 + (.178 * (4 - j)))), Math.floor(mainw * .075), Math.floor(mainh * .08));
                    }
                }
            }
        }
    }

    if(playerNeedsHelpCraftingTradingPost())
    {
        if(currentlyViewedDepth < tradeConfig.tradingPosts[0].depth - 1)
        {
            //down arrow
            MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.08)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * .9), Math.floor(mainw * .075), Math.floor(mainh * .08));
        }
        else if(currentlyViewedDepth > tradeConfig.tradingPosts[0].depth + 4)
        {
            //up arrow
            MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.08)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * .15), Math.floor(mainw * .075), Math.floor(mainh * .08));
        }

        if(depth >= tradeConfig.tradingPosts[0].depth && currentlyViewedDepth >= tradeConfig.tradingPosts[0].depth)
        {
            for(var j = 0; j < 5; j++)
            {
                if((currentlyViewedDepth - j) == tradeConfig.tradingPosts[0].depth)
                {
                    MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.5)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * (.15 + (.178 * (4 - j)))), Math.floor(mainw * .075), Math.floor(mainh * .08));
                }
            }
        }
    }

    if(chestService.totalBlackChestsOpened == 0 && depth > SUPER_MINER_DEPTH + 2)
    {
        if(currentlyViewedDepth < SUPER_MINER_DEPTH - 2)
        {
            //down arrow
            MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.08)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * .9), Math.floor(mainw * .075), Math.floor(mainh * .08));
        }
        else if(currentlyViewedDepth > SUPER_MINER_DEPTH + 2)
        {
            //up arrow
            MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.08)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * .15), Math.floor(mainw * .075), Math.floor(mainh * .08));
        }

    }

    // ### Cave Hint ###
    var activeCaves;
    if(numberOfCavesExplored == 0 && depth >= MIN_CAVE_SYSTEM_SPAWN_DEPTH && (activeCaves = getActiveCaves()).length > 0)
    {
        // MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.80)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * (.175 + (.178 * (4 - i)))), Math.floor(mainw * .075), Math.floor(mainh * .08));
        var clickable = getClickableAtDepth(activeCaves[0].kmDepth);
        if(clickable)
        {
            var yCoordinateOfLevelTop = mainh * .111 + ((4 - (currentlyViewedDepth - activeCaves[0].kmDepth)) * .178 * mainh);
            MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, mainw * (.135 + ((clickable.spawnLocation - 1) * .072)) + (oscillate(numFramesRendered, 8) * mainh * .018), yCoordinateOfLevelTop + (mainh * .075), Math.floor(mainw * .075), Math.floor(mainh * .08));
        }
    }
    else if(!hasCollectedTreasure && treasureStorage.treasure.length > 0)
    {
        if(!activeLayers.caveManagement)
        {
            if(currentlyViewedDepth >= CAVE_BUILDING_DEPTH && currentlyViewedDepth < CAVE_BUILDING_DEPTH + 5)
            {
                var yCoordinateOfLevelTop = mainh * .111 + ((4 - (currentlyViewedDepth - CAVE_BUILDING_DEPTH)) * .178 * mainh);
                MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.5)) + (oscillate(numFramesRendered, 8) * mainw * .013), yCoordinateOfLevelTop + (mainh * .075), Math.floor(mainw * .075), Math.floor(mainh * .08));
            }
            else
            {
                MAIN.drawImage(arrowright, 0, 0, arrowright.width, arrowright.height, Math.floor(mainw * (.84)) + (oscillate(numFramesRendered, 8) * mainw * .013), mainh * .32, Math.floor(mainw * .075), Math.floor(mainh * .08));
            }
        }
        else
        {
            MAIN.drawImage(arrowright, 0, 0, arrowright.width, arrowright.height, Math.floor(mainw * (.1)) + (oscillate(numFramesRendered, 8) * mainw * .013), mainh * .824, Math.floor(mainw * .075), Math.floor(mainh * .08));
        }
    }

    // ### Arrow to get to the top level to see other arrows ###
    if(currentlyViewedDepth > 2 && arrowOnTopLevel)
    {
        MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.08)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * .15), Math.floor(mainw * .075), Math.floor(mainh * .08));
    }

    // ### Golem Hint ###
    if(playerNeedsHelpFindingGolem())
    {

        if(currentlyViewedDepth < 49)
        {
            //down arrow
            MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.08)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * .9), Math.floor(mainw * .075), Math.floor(mainh * .08));
        }
        else if(currentlyViewedDepth > 54)
        {
            //up arrow
            MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.08)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * .15), Math.floor(mainw * .075), Math.floor(mainh * .08));
        }

        if(depth > 49 && currentlyViewedDepth >= 50)
        {
            for(var i = 0; i < 5; i++)
            {
                if((currentlyViewedDepth - i) == 50)
                {
                    MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.16)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * (.15 + (.178 * (4 - i)))), Math.floor(mainw * .075), Math.floor(mainh * .08));
                }
            }
        }
    }

    if(playerNeedsHelpFindingBrokenRobot())
    {
        if(currentlyViewedDepth < 224)
        {
            //down arrow
            MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.08)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * .9), Math.floor(mainw * .075), Math.floor(mainh * .08));
        }
        else if(currentlyViewedDepth > 229)
        {
            //up arrow
            MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.08)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * .15), Math.floor(mainw * .075), Math.floor(mainh * .08));
        }

        if(depth > 224 && currentlyViewedDepth >= 225)
        {
            for(var i = 0; i < 5; i++)
            {
                if((currentlyViewedDepth - i) == 225)
                {
                    MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.16)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * (.15 + (.178 * (4 - i)))), Math.floor(mainw * .075), Math.floor(mainh * .08));
                }
            }
        }
    }

    if(playerNeedsHelpFindingChestCollector())
    {
        if(currentlyViewedDepth < 99)
        {
            //down arrow
            MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.08)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * .9), Math.floor(mainw * .075), Math.floor(mainh * .08));
        }
        else if(currentlyViewedDepth > 104)
        {
            //up arrow
            MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.08)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * .15), Math.floor(mainw * .075), Math.floor(mainh * .08));
        }

        if(depth > 99 && currentlyViewedDepth >= 100)
        {
            for(var i = 0; i < 5; i++)
            {
                if((currentlyViewedDepth - i) == 100)
                {
                    MAIN.drawImage(arrowleft, 0, 0, arrowleft.width, arrowleft.height, Math.floor(mainw * (.73)) + (oscillate(numFramesRendered, 8) * mainw * .013), Math.ceil(mainh * (.15 + (.178 * (4 - i)))), Math.floor(mainw * .075), Math.floor(mainh * .08));
                }
            }
        }
    }
}

function playerNeedsHelpCraftingManager()
{
    return (canCraftBlueprint(3, 2) && managerStructure.level == 0)
}

function playerNeedsHelpCraftingTradingPost()
{
    return (canCraftBlueprint(3, 0) && tradingPostStructure.level == 0 && drillState.equippedDrillEquips[0] >= 9)
}

function playerNeedsHelpFindingChestCollector()
{
    return (depth > 200 && chestCollectorChanceStructure.level < 1)
}

function playerNeedsHelpFindingGolem()
{
    return (depth > 52 && depth < 70 && hasFoundGolem == 0 && afk >= 14);
}

function playerNeedsHelpFindingBrokenRobot()
{
    return (depth > 227 && depth < 250 && hasFoundGidget == 0)
}

// ##################################################
// ############### TUTORIAL DIALOGUES ###############
// ##################################################

function renderDialogues()
{
    if(oneTimeDialogue.isActive)
    {
        if(!isMobile())
        {
            TUT.clearRect(0, 0, tutw, tuth);
            TUT.fillStyle = "#a5a5a5";
            TUT.strokeStyle = "#000000";
            TUT.fillRect(tutw * .25, tuth * .13, tutw * .5, tuth * .27);
            TUT.strokeRect(tutw * .25, tuth * .13, tutw * .5, tuth * .27);
            TUT.fillStyle = "#000000";
            TUT.drawImage(oneTimeDialogue.image, 0, 0, oneTimeDialogue.image.width, oneTimeDialogue.image.height, tutw * .25, tuth * .13, tutw * .125, tuth * .27);
            TUT.strokeRect(tutw * .25, tuth * .13, tutw * .125, tuth * .27);
            document.getElementById("tutorialTextContent").innerHTML = _(oneTimeDialogue.text);
            document.getElementById("tutorialNextText").innerHTML = _("Tap to Continue");
            document.getElementById("personTalkingNameText").innerHTML = _(oneTimeDialogue.name);
        }
        else
        {
            TUT.clearRect(0, 0, tutw, tuth);
            TUT.fillStyle = "#a5a5a5";
            TUT.strokeStyle = "#000000";
            TUT.fillRect(tutw * .1, tuth * .13, tutw * .8, tuth * .432);
            TUT.strokeRect(tutw * .1, tuth * .13, tutw * .8, tuth * .432);
            TUT.fillStyle = "#000000";
            TUT.drawImage(oneTimeDialogue.image, 0, 0, oneTimeDialogue.image.width, oneTimeDialogue.image.height, tutw * .1, tuth * .13, tutw * .2, tuth * .432);
            TUT.strokeRect(tutw * .1, tuth * .13, tutw * .2, tuth * .432);
            document.getElementById("tutorialTextContent").innerHTML = _(oneTimeDialogue.text);
            document.getElementById("tutorialNextText").innerHTML = _("Tap to Continue");
            document.getElementById("personTalkingNameText").innerHTML = _(oneTimeDialogue.name);
            document.getElementById("tutorialNextText").style.top = "50%";
            document.getElementById("tutorialNextText").style.left = "45%";
            document.getElementById("personTalkingNameText").style.left = "22%";
        }
    }
    else if(tutsection != -1)
    {
        TUT.clearRect(0, 0, tutw, tuth);
        if((tutcoordinates[tutsection][0] + tutcoordinates[tutsection][1]) > 0)
        {
            TUT.drawImage(bloop, 0, 0, 50, 50, (tutcoordinates[tutsection][0] * tutw) - (50 * Math.abs(Math.sin(numFramesRendered / Math.PI))), (tutcoordinates[tutsection][1] * tuth) - (50 * Math.abs(Math.sin(numFramesRendered / Math.PI))), 100 * Math.abs(Math.sin(numFramesRendered / Math.PI)), 100 * Math.abs(Math.sin(numFramesRendered / Math.PI)));
            if(tutcoordinates[tutsection][2] !== 0 && tutcoordinates[tutsection][3] !== 0)
            {
                TUT.strokeStyle = "#000000";
                TUT.lineWidth = 9;
                TUT.beginPath();
                TUT.moveTo((tutcoordinates[tutsection][0] * tutw), (tutcoordinates[tutsection][1] * tuth));
                TUT.lineTo(tutcoordinates[tutsection][2] * tutw, tutcoordinates[tutsection][3] * tuth);
                if(tutcoordinates[tutsection][4] !== 0 && tutcoordinates[tutsection][5] !== 0)
                {
                    TUT.lineTo(tutcoordinates[tutsection][4] * tutw, tutcoordinates[tutsection][5] * tuth);
                }
                TUT.stroke();
                TUT.strokeStyle = "#FFFFFF";
                TUT.lineWidth = 5;
                TUT.beginPath();
                TUT.moveTo((tutcoordinates[tutsection][0] * tutw), (tutcoordinates[tutsection][1] * tuth));
                TUT.lineTo(tutcoordinates[tutsection][2] * tutw, tutcoordinates[tutsection][3] * tuth);
                if(tutcoordinates[tutsection][4] !== 0 && tutcoordinates[tutsection][5] !== 0)
                {
                    TUT.lineTo(tutcoordinates[tutsection][4] * tutw, tutcoordinates[tutsection][5] * tuth);
                }
                TUT.stroke();
            }
        }
        TUT.drawImage(tuts[tutsection], 0, 0, 640, 193, tutw * .25, tuth * .13, tutw * .5, tuth * .27);
        document.getElementById("tutorialTextContent").innerHTML = _(tutsText[tutsection]);
        document.getElementById("tutorialNextText").innerHTML = _("Click to Continue");
        document.getElementById("personTalkingNameText").innerHTML = _(tutsNames[tutsection]);
    }
}

// ##################################################
// ################ PREMIUM CURRENCY ################
// ##################################################

function renderPurchaseUi()
{
    PU.fillStyle = "#FFFFFF";
    PU.drawImage(sellbg, 0, 0, 640, 405, 0, 0, purchasedw, purchasedh);
    var fontToUse = "14px Verdana"
    if(language == "french") {fontToUse = "12px Verdana";}
    if(windowState[7] == 1)
    {
        if(typeof (isPaypalWindowVisible) != 'undefined' && !isPaypalWindowVisible)
        {
            showDiv("paypalPopup", 4);
        }
        renderButton(PU, tab_blank, _("GET TICKETS"), 0, 0, purchasedw * .2, purchasedh * .05, fontToUse, "#FFFFFF");
        renderButton(PU, tab_dark_blank, _("USE TICKETS"), purchasedw * .2, 0, purchasedw * .2, purchasedh * .05, fontToUse, "#FFFFFF");

        PU.drawImage(ticketicon, 0, 0, 25, 25, purchasedw * .45, purchasedh * .9, purchasedw * .05, purchasedh * .05);
        PU.fillText("x" + tickets, purchasedw * .5, purchasedh * .933);
    }
    else
    {
        if(typeof (isPaypalWindowVisible) != 'undefined' && isPaypalWindowVisible)
        {
            hideDiv("paypalPopup");
        }
        renderButton(PU, tab_dark_blank, _("GET TICKETS"), 0, 0, purchasedw * .2, purchasedh * .05, fontToUse, "#FFFFFF");
        renderButton(PU, tab_blank, _("USE TICKETS"), purchasedw * .2, 0, purchasedw * .2, purchasedh * .05, fontToUse, "#FFFFFF");
        PU.fillText("x" + tickets, purchasedw * .5, purchasedh * .933);
        PU.drawImage(chest1, 0, 0, 100, 120, purchasedw * .15, purchasedh * .2, purchasedw * .3, purchasedh * .48);
        PU.drawImage(chest2, 0, 0, 100, 120, purchasedw * .55, purchasedh * .2, purchasedw * .3, purchasedh * .48);
        PU.font = "24px KanitM";
        PU.fillStyle = "#1798c7";
        PU.fillText(_("BUY"), purchasedw * .15 + (purchasedw * .3 / 2) - (PU.measureText(_("BUY")).width / 2), purchasedh * .2 + purchasedh * .43);
        PU.fillText(_("BUY"), purchasedw * .55 + (purchasedw * .3 / 2) - (PU.measureText(_("BUY")).width / 2), purchasedh * .2 + purchasedh * .43);
        PU.drawImage(ticketicon, 0, 0, 25, 25, purchasedw * .45, purchasedh * .9, purchasedw * .05, purchasedh * .05);
        renderButton(PU, craftb, _("REDEEM"), purchasedw * .75, purchasedh * .90, purchasedw * .20, purchasedh * .04, fontToUse, "#000000");
    }
    PU.drawImage(closei, 0, 0, closei.width, closei.height, purchasedw * .94, purchasedh * .01, purchasedw * .05, purchasedh * .05);
}

// ##################################################
// ################## START SCREEN ##################
// ##################################################

function renderLoadingScreen()
{
    //If not yet chosen game to load
    TI.clearRect(0, 0, titlecw, titlech);
    TI.drawImage(title4, 0, 0, title4.width, title4.height, 0, 0, titlecw, titlech);
    //TI.drawImage(testWebm, Math.floor(testWebm.width / 30) * (numFramesRendered % 30), 0, Math.floor(testWebm.width / 30), testWebm.height, 0, 0, testWebm.width / 30, testWebm.height);

    TI.drawImage(newgameblank, 0, 0, newgameblank.width, newgameblank.height, titlecw * .2, titlech * .82, titlecw * .28, titlech * .15);
    TI.drawImage(importb, 0, 0, importb.width, importb.height, titlecw * .105, titlech * .82, titlecw * .09, titlech * .15);
    if(isSteam() || isWeb())
    {
        TI.drawImage(steamBackup, 0, 0, steamBackup.width, steamBackup.height, titlecw * .04, titlech * .945, titlecw * .03, titlech * .05)
    }

    var prevStyle = TI.fillStyle;
    var prevFont = TI.font;
    TI.fillStyle = "#000000";
    TI.font = "56px BubbleGum";
    TI.textBaseline = "top";
    if(language == "czech")
    {
        TI.font = "56px KanitB";
    }

    if(saves.length == 0 && Object.keys(currentBackups.shortTerm).length + Object.keys(currentBackups.longTerm).length < 1)
    {
        TI.drawImage(arrow, Math.ceil(titlecw * .3), Math.ceil((titlech * .63) + (oscillate(numFramesRendered, 2) * 4)), Math.floor(titlecw * .08), Math.floor(titlech * .18));
    }
    else if(saves.length == 0 && Object.keys(currentBackups.shortTerm).length + Object.keys(currentBackups.longTerm).length > 0)
    {
        TI.drawImage(arrow, Math.ceil(titlecw * .025), Math.ceil((titlech * .80) + (oscillate(numFramesRendered, 2) * 4)), Math.floor(titlecw * .06), Math.floor(titlech * .14));
    }

    fillTextWrapWithHeightLimit(TI, _("NEW GAME"), titlecw * .225, titlech * .86, titlecw * .225, titlech * .08, "center");
    TI.textBaseline = "bottom";

    TI.fillStyle = prevStyle;
    TI.font = prevFont;

    if(isHalloween)
    {
        TI.drawImage(jackolantern, 0, 0, jackolantern.width, jackolantern.height, titlecw * .435, titlech * .12, titlecw * .0533, titlech * .1);
    }
    if(isXmas)
    {
        TI.drawImage(xmasTree, 0, 0, xmasTree.width, xmasTree.height, titlecw * .41, titlech * .03, titlecw * .075, titlech * .18);
    }
    TI.fillStyle = "#FFFFFF";
    var versionText = "v" + ((version - 100) / 100).toFixed(2) + buildLetter;
    TI.fillText(versionText, titlecw - TI.measureText(versionText).width, titlech - 2);

    if(checks[6] != 0)
    {
        TI.fillStyle = "#FFFFFF";
        if(lgame != 0)
        {
            TI.fillText(_("Please Refresh the Game!"), titlecw * .36, titlech * .46);
        }
        document.getElementById("Gi").style.visibility = "visible";
    }

    TI.drawImage(Logo, 0, 0, Logo.width, Logo.height, titlecw * .55, titlech * .02, titlecw * .5, titlech * .5)

    for(var t = 0; t < 50; t++)
    {
        if(Math.random() < 0.5)
        {
            if(lights[t + 1] > lights[t]) {lights[t]++} else {lights[t]--;}
            if(lights[t] < 10 && Math.floor(Math.random() * 30) > 10) {lights[t] += 2;}
            if(t < 10 || t > 40) {if(Math.floor(Math.random() * 30) > 10) {lights[t] += 2;} }
            lights[t] = lights[t] + lightlogic[Math.floor(Math.random() * 38)];
            if(lights[t] > 28) {lights[t] = 28;} else if(lights[t] < 1) {lights[t] = 1;} else { }
        }
        TI.drawImage(titlelight, 0, 0, 3, 10, titlecw * (.718 + (.003 * t)), titlech * (-.11 + (lights[t] / 100)), titlecw * .003, titlech * (.29 - (lights[t] / 100)));
    }

    TI.drawImage(homeFrame, 0, 0, homeFrame.width, homeFrame.height, titlecw * .631, titlech * .5, titlecw * (.38 * .85), titlech * (.44 * .85))

    if(RSc > 2)
    {
        TI.drawImage(newgamebtnshadow, 0, 0, newgamebtnshadow.width, newgamebtnshadow.height, titlecw * .2, titlech * .82, titlecw * .28, titlech * .15);
        TI.drawImage(importbtnshadow, 0, 0, importbtnshadow.width, importbtnshadow.height, titlecw * .105, titlech * .82, titlecw * .09, titlech * .15);
    }

    for(var s = 0; s < 3; s++)
    {
        if(pendingDeleteSlotIndex == 0 || (s + 1) !== pendingDeleteSlotIndex)
        {
            if(s < RSc)
            {
                TI.drawImage(closei, 0, 0, 32, 32, Math.floor(titlecw * .50), (Math.floor(titlech * .22) + (s * Math.floor(titlech * .175))) + s + Math.floor(titlech * .13), 25, 25);
            }
        }
        else
        {
            TI.drawImage(yesno, 0, 0, 225, 99, Math.floor(titlecw * .41), (Math.floor(titlech * .3) + (s * Math.floor(titlech * .175))) + s, Math.floor(titlecw * .13), Math.floor(titlech * .147));
            TI.fillStyle = "#000000";
            TI.font = "15px KanitM";
            if(language == "japanese") {TI.font = "12px KanitM";}
            fillTextShrinkToFit(TI, _("Delete This Game?"), Math.floor(titlecw * .412) + titlecw * .005, (Math.floor(titlech * .3) + (s * Math.floor(titlech * .175))) + s + Math.floor(titlech * .035), Math.floor(titlecw * .12));
            TI.font = "13px KanitM";
            TI.fillText(_("YES"), Math.floor(titlecw * .41) + titlecw * .055 - TI.measureText(_("YES")).width / 2, (Math.floor(titlech * .3) + (s * Math.floor(titlech * .175))) + s + Math.floor(titlech * .108));
            TI.fillText(_("NO"), Math.floor(titlecw * .41) + titlecw * .102 - TI.measureText(_("NO")).width / 2, (Math.floor(titlech * .3) + (s * Math.floor(titlech * .175))) + s + Math.floor(titlech * .108));
            TI.fillStyle = "#FFFFFF";
        }
    }

    for(var l = 0; l < RSc; l++)
    {
        addl = 0;

        TI.font = "17px Verdana";
        if(saveButtons[l] > 0)
        {
            TI.fillStyle = "#FFDF00";
        }
        TI.fillText(sids[l], titlecw * (.05 + addl), titlech * (.325 + (l * .175)));
        TI.fillText(beautifynum(parseInt(saves[l][1])) + " Km", titlecw * (.05 + addl), titlech * (.35 + (l * .175)));
        TI.fillText("$" + beautifynum(saves[l][0]), titlecw * (.05 + addl), titlech * (.375 + (l * .175)));
        TI.fillText(beautifynum(Math.ceil(saves[l][81] / 60)) + " " + _("mins"), titlecw * (.05 + addl), titlech * (.4 + (l * .175)));
        TI.fillStyle = "#FFFFFF";

        if(saves[l][1] > 303)
        {
            try
            {
                for(var tE = 0; tE < 15; tE++)
                {
                    var tempEquip = saves[l][(137 + tE)].split("!");
                    if(tempEquip[0] !== "" && tempEquip.length > 1 && !isNaN(tempEquip[0]))
                    {
                        TI.drawImage(weaponStats[tempEquip[0]].icon, 0, 0, 50, 50, titlecw * (.05 + (tE * .02) + addl), titlech * (.41 + (l * .175)), titlecw * .02, titlech * .03);
                    }
                }
            }
            catch(e)
            {
                console.error(e);
            }
        }

        try
        {
            if(saveButtons[l] > 0) //animate on hover
            {
                TI.drawImage(getDrillEquipById(parseInt(saves[l][5])).worldAsset, 168 * getAnimationFrameIndex(4, 10), 0, 168, 158, titlecw * (.3 + addl), titlech * (.3 + (l * .175)), titlecw * .09, titlech * .125);
                TI.drawImage(getDrillEquipById(parseInt(saves[l][4])).worldAsset, 168 * getAnimationFrameIndex(4, 10), 0, 168, 158, titlecw * (.3 + addl), titlech * (.3 + (l * .175)), titlecw * .09, titlech * .125);
            }
            else
            {
                TI.drawImage(getDrillEquipById(parseInt(saves[l][5])).worldAsset, 0, 0, 168, 158, titlecw * (.3 + addl), titlech * (.3 + (l * .175)), titlecw * .09, titlech * .125);
                TI.drawImage(getDrillEquipById(parseInt(saves[l][4])).worldAsset, 0, 0, 168, 158, titlecw * (.3 + addl), titlech * (.3 + (l * .175)), titlecw * .09, titlech * .125);
            }
        }
        catch(e)
        {
            console.error(e);
        }
    }

    TI.font = "18px Verdana";
}

function initFoundArray(numberOfDepthsVisible)
{
    found = [];
    for(var i = 0; i < numberOfDepthsVisible; ++i)
    {
        found.push([[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]])
    }
}