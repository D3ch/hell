function handle(delta)
{
    if(windowState[14] < 2)
    {
        var magnitude = (keysPressed.hasOwnProperty("Control")) ? 5 : 1;
        if(delta < 0)
        {
            changeViewedDepth(magnitude);
        }
        else
        {
            changeViewedDepth((-1 * magnitude));
        }
    }
    else
    {
        if(delta < 0)
        {
            eventlogScroll++;
        }
        else
        {
            eventlogScroll--;
        }
        if(windowState[14] == 2)
        {
            if(eventlogScroll > eventlog.length - MAX_EVENT_LOG_SIZE)
            {
                eventlogScroll = eventlog.length - MAX_EVENT_LOG_SIZE;
            }
        }
        else if(windowState[14] == 3)
        {
            if(eventlogScroll > consoleLog.length - MAX_EVENT_LOG_SIZE)
            {
                eventlogScroll = consoleLog.length - MAX_EVENT_LOG_SIZE;
            }
        }
        if(eventlogScroll < 0)
        {
            eventlogScroll = 0;
        }
    }
    afk = 15;
}

function wheel(event)
{
    var delta = 0;
    if(!event)
    {
        event = window.event;
    }
    if(event.wheelDelta)
    {
        delta = event.wheelDelta / 120;
    } else if(event.detail)
    {
        delta = -event.detail / 3;
    }
    if(delta)
    {
        handle(delta);
    }
    if(event.preventDefault)
    {
        event.preventDefault();
    }
    event.returnValue = false;
}

if(window.addEventListener)
{
    window.addEventListener('DOMMouseScroll', wheel, false);
}
// window.onmousewheel = document.onmousewheel = wheel;

document.onclick = function ()
{
    afk = 15;
    isWindowInFocus = 1;
}

window.onblur = function ()
{
    isWindowInFocus = 0;
    if(chosen > -1)
    {
        document.title = "Capacity: " + Math.floor(capacity * 100 / maxHoldingCapacity()) + "%";
    }
}

window.onisWindowInFocus = function ()
{
    isWindowInFocus = 1;
    document.title = "Mr.Mine";
}

function hideEquipInfo()
{
    hideDiv("INFOD");
}


function getMineralUpdateLockFunction(mineralNum)
{
    var functionToReturn = function ()
    {
        var amtToLock = document.getElementById("simpleInputFieldText").value;
        document.getElementById("simpleInputFieldText").value = "";

        var value = parseInt(amtToLock.replace(/,/g, ''));
        if(!isNaN(value) && value >= 0)
        {
            lockedMineralAmtsToSave[mineralNum] = value;
        } else
        {
            newNews(_("Error value entered is invalid"));
        }
        hideSimpleInput();
    };
    return functionToReturn;
}

if(!isMobile())
{
    document.getElementById('METALDETECTORPLACE').onmouseenter = function ()
    {
        var description = "";
        var header = "";
        if(metalDetectorStructure.level > 0)
        {
            header = _("Metal Detector Lvl.{0}", metalDetectorStructure.level);

            if(metalDetectorStructure.level == 1)
            {
                description = _("Blinks when a chest is detected");
            }
            else if(metalDetectorStructure.level == 2)
            {
                description = metalDetectorStructure.structureDescription[1];
            }
            else if(metalDetectorStructure.level == 3)
            {
                description = metalDetectorStructure.structureDescription[2];
            }
            else if(metalDetectorStructure.level == 4)
            {
                description = metalDetectorStructure.structureDescription[3];
            }
            else if(metalDetectorStructure.level == 5)
            {
                description = metalDetectorStructure.structureDescription[4];
            }
            else if(metalDetectorStructure.level == 6)
            {
                description = metalDetectorStructure.structureDescription[5];
            }
        }

        if(metalDetectorStructure.level > 0 && chestCollectorChanceStructure.level > 0)
        {
            description += "<br><br>" + "<b><center>" + _("Chest Collection Chance Lvl.{0}", chestCollectorChanceStructure.level) + "</center></b>";
            description += "<br>" + _("{0}% of chest spawns will be collected", chestCollectorChanceStructure.statValueForCurrentLevel());
        }
        else if(chestCollectorChanceStructure.level > 0 && metalDetectorStructure.level == 0)
        {
            header = _("Chest Collection Chance Lvl.{0}", chestCollectorChanceStructure.level)
            description = _("{0}% of chest spawns will be collected", chestCollectorChanceStructure.statValueForCurrentLevel());
        }

        if(chestCompressorStructure.level > 0)
        {
            description += "<br><br>" + "<b><center>" + _("Chest Compressor Lvl.{0}", chestCompressorStructure.level) + "</center></b>";
            description += "<br>" + _("Compresses {0} basic chests into one gold chest when used", chestCompressorStructure.statValueForCurrentLevel());
        }

        if(header != "")
        {
            showTooltip(header, description);
        }
    }

    document.getElementById('METALDETECTORPLACE').onmouseleave = function () {hideTooltip();}

    document.getElementById('METALDETECTORPLACE').onclick = function ()
    {
        if(chestCollectorStorageStructure.level > 0)
        {
            openUi(ChestCollectorWindow);
        }
    }

    document.getElementById('PLACE1').onclick = function () {if(!isMobile()) openUi(SellWindow, null, EARTH_INDEX);}
    document.getElementById('PLACE2').onclick = function () {if(!isMobile()) openUi(HireWindow, null, EARTH_INDEX);}

    document.getElementById('PLACE3').onclick = function () {if(!isMobile()) openUi(CraftingWindow);}
    document.getElementById('CLOSEb').onclick = function ()
    {
        buyui(0);
        editmode = 0;
    }

    document.getElementById('PLACE4').onclick = function () {if(!isMobile()) openUi(QuestWindow);}

    document.getElementById('ARCHPLACE').onclick = function () {if(!isMobile() && hasUnlockedScientists) {openUi(ScientistsWindow);} }
    document.getElementById('drillHitbox').onmouseover = function ()
    {
        if(isStalledDueToBoss()) {showTooltip(_("Drill Stalled"), _("Defeat the boss at {0}km to progress.", depthOfDeepestBossReached()), "82%", "70%");}
        if(isWaitingForLiftoff()) {showTooltip(_("Drill"), _("Your drill is waiting for your command to lift off."), "82%", "75%");}
        if(depth < 20) {showTooltip(_("Drill"), _("Upgrade your drill by crafting blueprints. Upgrading your drill increases its digging speed."), "82%", "75%");}
    }
    document.getElementById('drillHitbox').onmouseout = function ()
    {
        hideTooltip();
    }
    document.getElementById('drillHitbox').onmousedown = function ()
    {
        if(!isMobile()) openUi(CraftingWindow, null, EARTH_INDEX);
    }
    document.getElementById('bossLevel').onclick = function ()
    {
        if(!isBossBattleActive && !battleActive)
        {
            startBossBattle(bossesDefeated);
        }
    }

    document.getElementById('LOGGERTAB1').onclick = function () {windowState[11] = 1;}
    document.getElementById('LOGGERTAB2').onclick = function () {windowState[11] = 2;}
}

function confirmRerollTrade(worldIndex)
{
    if(tickets > 0)
    {
        showConfirmationPrompt(
            _("Are you sure you want to pay 1 ticket to refresh your trade options?"),
            _("Yes"),
            function ()
            {
                generateTrade(worldIndex);
                hideSimpleInput();
                trackEvent_SpentTickets(1, "REROLL TRADE");
                tickets--;
            },
            _("Cancel"));
    }
    else
    {
        showAlertPrompt(_("You don't have enough tickets"), _("Ok"))
    }
}

function confirmExtendTrade(worldIndex)
{
    if(tickets > 0)
    {
        showConfirmationPrompt(
            _("Are you sure you want to pay 1 ticket to extend the trade duration by 1 hour?"),
            _("Yes"),
            function ()
            {
                extendTradeDuration(worldIndex, 3600);
                hideSimpleInput();
                trackEvent_SpentTickets(1, "EXTEND TRADE");
                tickets--;
            },
            _("Cancel"));
    }
    else
    {
        showAlertPrompt(_("You don't have enough tickets"), _("Ok"))
    }
}

var tempConfirmRerollIndex = -1;

function confirmRerollExcavations(scientistIndex)
{
    if(tickets > 0)
    {
        tempConfirmRerollIndex = scientistIndex;
        showConfirmationPrompt(_("Are you sure you want to pay 1 ticket to refresh your excavation options?"), _("Yes"), function ()
        {
            rerollExcavations();
            hideSimpleInput();
        }, _("Cancel"));
    }
    else
    {
        showAlertPrompt(_("You don't have enough tickets"), _("Ok"))
    }
}

function rerollExcavations()
{
    if(tickets > 0 && tempConfirmRerollIndex > -1)
    {
        var scientistIndex = tempConfirmRerollIndex;
        var activeScientist = activeScientists[scientistIndex];
        if(!isOnActiveExcavation(scientistIndex) && !isScientistDead(scientistIndex))
        {
            tickets--;
            trackEvent_SpentTickets(1, "REFRESH EXCAVATION");
            generateExcavationChoices(scientistIndex);
            tempConfirmRerollIndex = -1;
        }
    }
}

var tempConfirmForfeitIndex = -1;

function confirmForfeitExcavation(scientistIndex)
{
    tempConfirmForfeitIndex = scientistIndex;
    showConfirmationPrompt(_("Are you sure you want to forfeit your reward?"), _("Yes"), function ()
    {
        onConfirmedForfeitExcavation();
        hideSimpleInput();
    }, _("Cancel"));
}

function onConfirmedForfeitExcavation()
{
    if(tempConfirmForfeitIndex > -1)
    {
        forfeitRewardForFinishedExcavation(tempConfirmForfeitIndex, true);
        tempConfirmForfeitIndex = -1;
    }
}

function showTooltipForRelic(relicIndex)
{
    var rewardId = equippedRelics[relicIndex];
    if(rewardId != -1)
    {
        var rewardInfo = excavationRewards[rewardId];
        showTooltip(rewardInfo.name, getRewardDescription(rewardId));
    }
}

function showTooltipForUnequippedRelic(relicIndex, x = 0, y = 0)
{
    var rewardInfo = excavationRewards[relicIndex];
    var description = "";
    if(rewardInfo.hasOwnProperty("description"))
    {
        description = rewardInfo.description;
    }
    else
    {
        description = rewardInfo.statType.getTooltip(rewardInfo.amount);
    }
    showTooltip(rewardInfo.name, description, x, y);
}

if(!isMobile())
{
    document.getElementById('GARAGE').onmouseover = function () {isHoveringOverGarage = 1;}
    document.getElementById('GARAGE').onmouseout = function () {isHoveringOverGarage = 0;}
    document.getElementById('GARAGE').onclick = function ()
    {
        if(!isMobile()) openUi(PurchaseWindow);

        if(document.getElementById('buyoptions') != null)
        {
            //document.getElementById('buyoptions').innerHTML = paypalhtml;
            document.getElementById("BTC1").style.visibility = "hidden";
            document.getElementById("BTC1").style.zIndex = -2;
            document.getElementById("BTC2").style.visibility = "hidden";
            document.getElementById("BTC2").style.zIndex = -2;
            document.getElementById("REDEEM").style.visibility = "hidden";
            document.getElementById("REDEEM").style.zIndex = -2;
        }
    }

    if(document.getElementById('BTC1') != null)
    {
        document.getElementById('BTC1').onclick = function ()
        {
            if(tickets > 0)
            {
                if(depth < 40)
                {
                    var depthu = 40;
                } else
                {
                    var depthu = depth;
                }
                chestService.spawnChest(0, Chest.purchased);
                chestService.presentChest(0);
                tickets--;
            }
            else
            {
                showAlertPrompt(_("You don't have enough tickets"), _("Ok"))
            }
        }
        document.getElementById('BTC2').onclick = function ()
        {
            if(tickets > 9)
            {
                if(depth < 40)
                {
                    var depthu = 40;
                } else
                {
                    var depthu = depth;
                }
                chestService.spawnChest(0, Chest.purchased, ChestType.gold);
                chestService.presentChest(0);
                tickets -= 10;
            }
            else
            {
                showAlertPrompt(_("You don't have enough tickets"), _("Ok"))
            }
        }
    }

    if(document.getElementById('REDEEM') != null)
    {
        document.getElementById('REDEEM').onclick = function ()
        {
            showRedeemPrompt();
        }
    }

    document.getElementById('BTB1').onclick = function ()
    {
        windowState[2] = 1;
        hideequips();
    }
    document.getElementById('BTB2').onclick = function ()
    {
        windowState[2] = 2;
        hideequips();
        flickercraft = false;
    }
    document.getElementById('BTB3').onclick = function ()
    {
        windowState[2] = 3;
        showequips();
        flickerinventory = false;
    }
    document.getElementById('BTB4').onclick = function ()
    {
        windowState[2] = 4;
        hideequips();
    }

    document.getElementById('CLOSEl2').onclick = function () {logui(0);}

    document.getElementById('G7i').onclick = function () {showImportPopup();}
    document.getElementById('G7i').onmouseover = function () {showTooltip(_("Import game"), _("Import a game save using an import code. Only compatible with codes from Steam MrMine."), "20%", "80%");}
    document.getElementById('G7i').onmouseout = function () {hideTooltip();}
    document.getElementById('CLOSEhe').onclick = function () {helpui(0);}

    document.getElementById('PAGES1').onclick = function () {drillPurchasePage = 0;}
    document.getElementById('PAGES2').onclick = function () {drillPurchasePage = 1;}
    document.getElementById('PAGES3').onclick = function () {drillPurchasePage = 2;}
    document.getElementById('PAGES4').onclick = function () {drillPurchasePage = 3;}
    document.getElementById('PAGES5').onclick = function () {drillPurchasePage = 4;}
    document.getElementById('PAGES6').onclick = function () {drillPurchasePage = 5;}

    document.getElementById('L5a').onclick = function () {onWorkerClicked(5, 1);}
    document.getElementById('L5b').onclick = function () {onWorkerClicked(5, 2);}
    document.getElementById('L5c').onclick = function () {onWorkerClicked(5, 3);}
    document.getElementById('L5d').onclick = function () {onWorkerClicked(5, 4);}
    document.getElementById('L5e').onclick = function () {onWorkerClicked(5, 5);}
    document.getElementById('L5f').onclick = function () {onWorkerClicked(5, 6);}
    document.getElementById('L5g').onclick = function () {onWorkerClicked(5, 7);}
    document.getElementById('L5h').onclick = function () {onWorkerClicked(5, 8);}
    document.getElementById('L5i').onclick = function () {onWorkerClicked(5, 9);}
    document.getElementById('L5j').onclick = function () {onWorkerClicked(5, 10);}
    document.getElementById('L4a').onclick = function () {onWorkerClicked(4, 1);}
    document.getElementById('L4b').onclick = function () {onWorkerClicked(4, 2);}
    document.getElementById('L4c').onclick = function () {onWorkerClicked(4, 3);}
    document.getElementById('L4d').onclick = function () {onWorkerClicked(4, 4);}
    document.getElementById('L4e').onclick = function () {onWorkerClicked(4, 5);}
    document.getElementById('L4f').onclick = function () {onWorkerClicked(4, 6);}
    document.getElementById('L4g').onclick = function () {onWorkerClicked(4, 7);}
    document.getElementById('L4h').onclick = function () {onWorkerClicked(4, 8);}
    document.getElementById('L4i').onclick = function () {onWorkerClicked(4, 9);}
    document.getElementById('L4j').onclick = function () {onWorkerClicked(4, 10);}
    document.getElementById('L3a').onclick = function () {onWorkerClicked(3, 1);}
    document.getElementById('L3b').onclick = function () {onWorkerClicked(3, 2);}
    document.getElementById('L3c').onclick = function () {onWorkerClicked(3, 3);}
    document.getElementById('L3d').onclick = function () {onWorkerClicked(3, 4);}
    document.getElementById('L3e').onclick = function () {onWorkerClicked(3, 5);}
    document.getElementById('L3f').onclick = function () {onWorkerClicked(3, 6);}
    document.getElementById('L3g').onclick = function () {onWorkerClicked(3, 7);}
    document.getElementById('L3h').onclick = function () {onWorkerClicked(3, 8);}
    document.getElementById('L3i').onclick = function () {onWorkerClicked(3, 9);}
    document.getElementById('L3j').onclick = function () {onWorkerClicked(3, 10);}
    document.getElementById('L2a').onclick = function () {onWorkerClicked(2, 1);}
    document.getElementById('L2b').onclick = function () {onWorkerClicked(2, 2);}
    document.getElementById('L2c').onclick = function () {onWorkerClicked(2, 3);}
    document.getElementById('L2d').onclick = function () {onWorkerClicked(2, 4);}
    document.getElementById('L2e').onclick = function () {onWorkerClicked(2, 5);}
    document.getElementById('L2f').onclick = function () {onWorkerClicked(2, 6);}
    document.getElementById('L2g').onclick = function () {onWorkerClicked(2, 7);}
    document.getElementById('L2h').onclick = function () {onWorkerClicked(2, 8);}
    document.getElementById('L2i').onclick = function () {onWorkerClicked(2, 9);}
    document.getElementById('L2j').onclick = function () {onWorkerClicked(2, 10);}
    document.getElementById('L1a').onclick = function () {onWorkerClicked(1, 1);}
    document.getElementById('L1b').onclick = function () {onWorkerClicked(1, 2);}
    document.getElementById('L1c').onclick = function () {onWorkerClicked(1, 3);}
    document.getElementById('L1d').onclick = function () {onWorkerClicked(1, 4);}
    document.getElementById('L1e').onclick = function () {onWorkerClicked(1, 5);}
    document.getElementById('L1f').onclick = function () {onWorkerClicked(1, 6);}
    document.getElementById('L1g').onclick = function () {onWorkerClicked(1, 7);}
    document.getElementById('L1h').onclick = function () {onWorkerClicked(1, 8);}
    document.getElementById('L1i').onclick = function () {onWorkerClicked(1, 9);}
    document.getElementById('L1j').onclick = function () {onWorkerClicked(1, 10);}
    document.getElementById('L5gap1').onclick = function () {clickedGap(5, 1);}
    document.getElementById('L5gap2').onclick = function () {clickedGap(5, 2);}
    document.getElementById('L5gap3').onclick = function () {clickedGap(5, 3);}
    document.getElementById('L5gap4').onclick = function () {clickedGap(5, 4);}
    document.getElementById('L5gap5').onclick = function () {clickedGap(5, 5);}
    document.getElementById('L5gap6').onclick = function () {clickedGap(5, 6);}
    document.getElementById('L5gap7').onclick = function () {clickedGap(5, 7);}
    document.getElementById('L5gap8').onclick = function () {clickedGap(5, 8);}
    document.getElementById('L5gap9').onclick = function () {clickedGap(5, 9);}
    document.getElementById('L5gap10').onclick = function () {clickedGap(5, 10);}
    document.getElementById('L5gap11').onclick = function () {clickedGap(5, 11);}
    document.getElementById('L4gap1').onclick = function () {clickedGap(4, 1);}
    document.getElementById('L4gap2').onclick = function () {clickedGap(4, 2);}
    document.getElementById('L4gap3').onclick = function () {clickedGap(4, 3);}
    document.getElementById('L4gap4').onclick = function () {clickedGap(4, 4);}
    document.getElementById('L4gap5').onclick = function () {clickedGap(4, 5);}
    document.getElementById('L4gap6').onclick = function () {clickedGap(4, 6);}
    document.getElementById('L4gap7').onclick = function () {clickedGap(4, 7);}
    document.getElementById('L4gap8').onclick = function () {clickedGap(4, 8);}
    document.getElementById('L4gap9').onclick = function () {clickedGap(4, 9);}
    document.getElementById('L4gap10').onclick = function () {clickedGap(4, 10);}
    document.getElementById('L4gap11').onclick = function () {clickedGap(4, 11);}
    document.getElementById('L3gap1').onclick = function () {clickedGap(3, 1);}
    document.getElementById('L3gap2').onclick = function () {clickedGap(3, 2);}
    document.getElementById('L3gap3').onclick = function () {clickedGap(3, 3);}
    document.getElementById('L3gap4').onclick = function () {clickedGap(3, 4);}
    document.getElementById('L3gap5').onclick = function () {clickedGap(3, 5);}
    document.getElementById('L3gap6').onclick = function () {clickedGap(3, 6);}
    document.getElementById('L3gap7').onclick = function () {clickedGap(3, 7);}
    document.getElementById('L3gap8').onclick = function () {clickedGap(3, 8);}
    document.getElementById('L3gap9').onclick = function () {clickedGap(3, 9);}
    document.getElementById('L3gap10').onclick = function () {clickedGap(3, 10);}
    document.getElementById('L3gap11').onclick = function () {clickedGap(3, 11);}
    document.getElementById('L2gap1').onclick = function () {clickedGap(2, 1);}
    document.getElementById('L2gap2').onclick = function () {clickedGap(2, 2);}
    document.getElementById('L2gap3').onclick = function () {clickedGap(2, 3);}
    document.getElementById('L2gap4').onclick = function () {clickedGap(2, 4);}
    document.getElementById('L2gap5').onclick = function () {clickedGap(2, 5);}
    document.getElementById('L2gap6').onclick = function () {clickedGap(2, 6);}
    document.getElementById('L2gap7').onclick = function () {clickedGap(2, 7);}
    document.getElementById('L2gap8').onclick = function () {clickedGap(2, 8);}
    document.getElementById('L2gap9').onclick = function () {clickedGap(2, 9);}
    document.getElementById('L2gap10').onclick = function () {clickedGap(2, 10);}
    document.getElementById('L2gap11').onclick = function () {clickedGap(2, 11);}
    document.getElementById('L1gap1').onclick = function () {clickedGap(1, 1);}
    document.getElementById('L1gap2').onclick = function () {clickedGap(1, 2);}
    document.getElementById('L1gap3').onclick = function () {clickedGap(1, 3);}
    document.getElementById('L1gap4').onclick = function () {clickedGap(1, 4);}
    document.getElementById('L1gap5').onclick = function () {clickedGap(1, 5);}
    document.getElementById('L1gap6').onclick = function () {clickedGap(1, 6);}
    document.getElementById('L1gap7').onclick = function () {clickedGap(1, 7);}
    document.getElementById('L1gap8').onclick = function () {clickedGap(1, 8);}
    document.getElementById('L1gap9').onclick = function () {clickedGap(1, 9);}
    document.getElementById('L1gap10').onclick = function () {clickedGap(1, 10);}
    document.getElementById('L1gap11').onclick = function () {clickedGap(1, 11);}
}

function hidedebug()
{
    hideDiv("DebugH");
}

if(!isMobile())
{
    document.getElementById('H2').onclick = function ()
    {
        windowState[5] = 1;
        document.getElementById('H17').innerHTML = helphtml[0][0];
        hidedebug();
    }
    document.getElementById('H3').onclick = function ()
    {
        windowState[5] = 2;
        document.getElementById('H17').innerHTML = helphtml[0][0];
        hidedebug();
    }
    document.getElementById('H4').onclick = function ()
    {
        windowState[5] = 3;
        document.getElementById('H17').innerHTML = helphtml[0][0];
        hidedebug();
    }
    document.getElementById('H5').onclick = function ()
    {
        windowState[5] = 4;
        document.getElementById('H17').innerHTML = helphtml[0][0];
        hidedebug();
    }
    document.getElementById('H6').onclick = function ()
    {
        windowState[5] = 5;
        document.getElementById('H17').innerHTML = helphtml[0][0];
        hidedebug();
    }
    document.getElementById('H7').onclick = function ()
    {
        windowState[5] = 6;
        document.getElementById('H17').innerHTML = helphtml[0][0];
        hidedebug();
    }
    document.getElementById('H8').onclick = function ()
    {
        windowState[5] = 7;
        document.getElementById('H17').innerHTML = helphtml[0][0];
        hidedebug();
    }
    document.getElementById('H9').onclick = function ()
    {
        windowState[5] = 8;
        document.getElementById('H17').innerHTML = helphtml[0][0];
        hidedebug();
    }
    document.getElementById('H10').onclick = function ()
    {
        windowState[5] = 9;
        document.getElementById('H17').innerHTML = helphtml[0][7];
        hidedebug();
    }
    document.getElementById('H11').onclick = function ()
    {
        windowState[5] = 10;
        document.getElementById('H17').innerHTML = helphtml[0][6];
        hidedebug();
    }
    document.getElementById('H12').onclick = function ()
    {
        windowState[5] = 11;
        document.getElementById('H17').innerHTML = helphtml[0][0];
        document.getElementById("DebugH").style.visibility = "visible";
        document.getElementById("DebugH").style.zIndex = 2;
    }
    document.getElementById('H13').onclick = function ()
    {
        windowState[5] = 12;
        document.getElementById('H17').innerHTML = helphtml[0][5];
        hidedebug();
    }
    document.getElementById('H14').onclick = function ()
    {
        windowState[5] = 13;
        document.getElementById('H17').innerHTML = "<font size='2'>" + document.getElementById('Gi').innerHTML + "</font>";
        hidedebug();
    }
    document.getElementById('H15').onclick = function ()
    {
        windowState[5] = 14;
        document.getElementById('H17').innerHTML = helphtml[0][3];
        hidedebug();
    }
    document.getElementById('H16').onclick = function ()
    {
        windowState[5] = 15;
        document.getElementById('H17').innerHTML = helphtml[0][2];
        hidedebug();
    }

    document.getElementById('G1').onclick = function ()
    {
        if(pendingDeleteSlotIndex > 0)
        {
            pendingDeleteSlotIndex = 0;
            hideDeletionConfirmationHitbox();
        } else if(checks[6] > 0 && lgame == 0 && isGameReady)
        {
            document.getElementById('WRAPPERD').style.background = 'url("Shared/Assets/UI/gui2.webp")';
            document.getElementById('WRAPPERD').style.backgroundSize = '100% 100%';
            loadGame(0);
            saveButtons[0] = 0;
        }
    }
    document.getElementById('G2').onclick = function ()
    {
        if(pendingDeleteSlotIndex > 0)
        {
            pendingDeleteSlotIndex = 0;
            hideDeletionConfirmationHitbox();
        } else if(checks[6] > 0 && lgame == 0 && isGameReady)
        {
            document.getElementById('WRAPPERD').style.background = 'url("Shared/Assets/UI/gui2.webp")';
            document.getElementById('WRAPPERD').style.backgroundSize = '100% 100%';
            loadGame(1);
            saveButtons[1] = 0;
        }
    }
    document.getElementById('G3').onclick = function ()
    {
        if(pendingDeleteSlotIndex > 0)
        {
            pendingDeleteSlotIndex = 0;
            hideDeletionConfirmationHitbox();
        } else if(checks[6] > 0 && lgame == 0 && isGameReady)
        {
            document.getElementById('WRAPPERD').style.background = 'url("Shared/Assets/UI/gui2.webp")';
            document.getElementById('WRAPPERD').style.backgroundSize = '100% 100%';
            loadGame(2);
            saveButtons[2] = 0;
        }
    }

    document.getElementById('G7').onclick = function ()
    {
        if(lgame == 0 && isGameReady)
        {
            openNewGamePrompt();
            saveButtons[6] = 0;
        }
    }
    document.getElementById('G1d').onclick = function ()
    {
        if(pendingDeleteSlotIndex > 0)
        {
            pendingDeleteSlotIndex = 0;
            hideDeletionConfirmationHitbox();
        } else {onClickDeleteSaveSlot(1);}
    }
    document.getElementById('G2d').onclick = function ()
    {
        if(pendingDeleteSlotIndex > 0)
        {
            pendingDeleteSlotIndex = 0;
            hideDeletionConfirmationHitbox();
        } else {onClickDeleteSaveSlot(2);}
    }
    document.getElementById('G3d').onclick = function ()
    {
        if(pendingDeleteSlotIndex > 0)
        {
            pendingDeleteSlotIndex = 0;
            hideDeletionConfirmationHitbox();
        } else {onClickDeleteSaveSlot(3);}
    }
    document.getElementById('G1c').onclick = function ()
    {
        if(pendingDeleteSlotIndex > 0)
        {
            deleteGame(0);
            pendingDeleteSlotIndex = 0;
            hideDeletionConfirmationHitbox();
        }
    }
    document.getElementById('G2c').onclick = function ()
    {
        if(pendingDeleteSlotIndex > 0)
        {
            deleteGame(1);
            pendingDeleteSlotIndex = 0;
            hideDeletionConfirmationHitbox();
        }
    }
    document.getElementById('G3c').onclick = function ()
    {
        if(pendingDeleteSlotIndex > 0)
        {
            deleteGame(2);
            pendingDeleteSlotIndex = 0;
            hideDeletionConfirmationHitbox();
        }
    }

    document.getElementById('G1').onmouseover = function ()
    {
        saveButtons[0] = 1;
        if(pendingDeleteSlotIndex > 0)
        {
            pendingDeleteSlotIndex = 0;
            hideDeletionConfirmationHitbox();
        }
    }
    document.getElementById('G2').onmouseover = function ()
    {
        saveButtons[1] = 1;
        if(pendingDeleteSlotIndex > 0)
        {
            pendingDeleteSlotIndex = 0;
            hideDeletionConfirmationHitbox();
        }
    }
    document.getElementById('G3').onmouseover = function ()
    {
        saveButtons[2] = 1;
        if(pendingDeleteSlotIndex > 0)
        {
            pendingDeleteSlotIndex = 0;
            hideDeletionConfirmationHitbox();
        }
    }
    document.getElementById('G1').onmouseout = function () {saveButtons[0] = 0;}
    document.getElementById('G2').onmouseout = function () {saveButtons[1] = 0;}
    document.getElementById('G3').onmouseout = function () {saveButtons[2] = 0;}

    document.getElementById('cng').onclick = function ()
    {
        createNewGame(document.getElementById("gname").value);
    }
    document.getElementById('cngc').onclick = function ()
    {
        cancelNewGame();
    }

    document.getElementById('tutorialTextContent').onclick = function ()
    {
        onProgressTutorial();
    }
    document.getElementById('TUTORIALDI').onclick = function ()
    {
        onProgressTutorial();
    }
    document.getElementById('TUTORIALD').onclick = function ()
    {
        onProgressTutorial();
    }
    document.getElementById('tutorialTextContent').touchstart = function ()
    {
        onProgressTutorial();
    }
    document.getElementById('TUTORIALDI').touchstart = function ()
    {
        onProgressTutorial();
    }
    document.getElementById('TUTORIALD').touchstart = function ()
    {
        onProgressTutorial();
    }
}

function onProgressTutorial()
{
    if(oneTimeDialogue.isActive)
    {
        if(oneTimeDialogue.callback != null)
        {
            oneTimeDialogue.callback();
        }
        endOneTimeDialogue();
    }
    else if(tutsection > -1)
    {
        if((tutsection >= 8 && depth < 100) || tutsection >= 13)
        {
            trackEvent_FinishTutorial();
            tutsection = -1;
            document.getElementById("TUTORIALD").style.visibility = "hidden";
            document.getElementById("TUTORIALD").style.zIndex = -2;
        }
        else
        {
            if(tutsection == 0)
            {
                trackEvent_StartTutorial();
            }
            tutsection++;
        }
    }
}

document.oncontextmenu = function (e)
{
    var el = window.event.srcElement || e.target;
    var tp = el.tagName || '';
    if(tp.toLowerCase() !== 'input' && tp.toLowerCase() !== 'select' && tp.toLowerCase() !== 'textarea')
    {
        console.log("Right click disabled");
        return false;
    }
};

function onNewGameTextEntered(e)
{
    if(e.keyCode == 13)
    {
        createNewGame(document.getElementById("gname").value);
        return false;
    }
    else if(e.keyCode == 32)
    {
        e.preventDefault();
        return false;
    }

    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if(regex.test(str))
    {
        return true;
    }
    e.preventDefault();
    return false;
}