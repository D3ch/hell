var isLaunching = false;
var clickedCompress = false;

class WorldLayer extends UiLayer
{
    layerName = "WorldLayer";
    zIndex = 3;
    isRendered = true;
    isPopup = false;
    allowBubbling = true;
    context = MAIN;
    previouslyViewedDepth = 0;

    leftBound = Math.ceil(mainw * .082);
    topBound = mainh * .111;
    levelHeight = mainh * .178;
    numberOfDepthsVisible = 5;
    minVisibleDepth = 0;

    topCityLevelCount = 4;

    minerFrames = 8;
    minerFrameWidth = 32;
    minerFrameSpacing = 2;

    constructor(boundingBox)
    {
        super(boundingBox);
        if(this.context)
        {
            this.context.canvas.style.x = boundingBox.x;
            this.context.canvas.style.y = boundingBox.y;
            this.context.canvas.style.width = boundingBox.width;
            this.context.canvas.style.height = boundingBox.height;
        }

        initFoundArray(this.numberOfDepthsVisible);

        // Trading Posts
        for(var i = 0; i < tradeConfig.tradingPosts.length; ++i)
        {
            this.addHitbox(new WorldEntityHitbox(
                tradeConfig.tradingPosts[i].depth,
                {
                    x: Math.ceil(mainw * .082),
                    y: 0,
                    width: tradeConfig.tradingPosts[i].image.width,
                    height: tradeConfig.tradingPosts[i].image.height,
                },
                {
                    onmousedown: function (i)
                    {
                        if(tradingPostStructures[i].level == 0)
                        {
                            var craftingWindow = openUi(CraftingWindow, null, i);
                            if(craftingWindow)
                            {
                                craftingWindow.openTab(1);
                                if(i == 0)
                                {
                                    craftingWindow.selectedBlueprint = getBlueprintById(3, 0);
                                }
                                else if(i == 1)
                                {
                                    craftingWindow.selectedBlueprint = getBlueprintById(3, 5);
                                }
                                craftingWindow.initializeCraftingPane();
                            }
                        }
                        else
                        {
                            openUi(TradeWindow, null, i);
                        }
                    }.bind(this, i)
                },
                'pointer',
                "tradingPost_" + i,
                this
            ));
        }

        // Lunar Sell Center
        this.addHitbox(new WorldEntityHitbox(
            1030, {
            x: (this.boundingBox.width / uiScaleX) * .10,
            y: 0,
            width: (this.boundingBox.width / uiScaleX) * .275,
            height: (this.boundingBox.height / uiScaleY) * .25
        }, {
            onmousedown: function ()
            {
                openUi(SellWindow, null, MOON_INDEX);
            }
        },
            'pointer',
            "sellCenter",
            this
        ));
        // Lunar Hire Center
        this.addHitbox(new WorldEntityHitbox(
            1030, {
            x: (this.boundingBox.width / uiScaleX) * .375,
            y: (this.boundingBox.height / uiScaleY) * .04,
            width: (this.boundingBox.width / uiScaleX) * .17,
            height: (this.boundingBox.height / uiScaleY) * .25
        }, {
            onmousedown: function ()
            {
                openUi(HireWindow, null, MOON_INDEX);
            }
        },
            'pointer',
            "hireCenter",
            this
        ));
        // Lunar Drill Center
        this.addHitbox(new WorldEntityHitbox(
            1030, {
            x: (this.boundingBox.width / uiScaleX) * .62,
            y: 0,
            width: (this.boundingBox.width / uiScaleX) * .14,
            height: (this.boundingBox.height / uiScaleY) * .25
        }, {
            onmousedown: function ()
            {
                openUi(CraftingWindow, null, MOON_INDEX);
            }
        },
            'pointer',
            "drillCenter",
            this
        ));
        // Lunar Garage
        this.addHitbox(new WorldEntityHitbox(
            1030, {
            x: (this.boundingBox.width / uiScaleX) * .55,
            y: (this.boundingBox.height / uiScaleY) * .05,
            width: (this.boundingBox.width / uiScaleX) * .065,
            height: (this.boundingBox.height / uiScaleY) * .18
        }, {
            onmousedown: function ()
            {
                openUi(PurchaseWindow, null, MOON_INDEX);
                if(document.getElementById('buyoptions'))
                {
                    document.getElementById('buyoptions').innerHTML = paypalhtml;
                    document.getElementById("BTC1").style.visibility = "hidden";
                    document.getElementById("BTC1").style.zIndex = -2;
                    document.getElementById("BTC2").style.visibility = "hidden";
                    document.getElementById("BTC2").style.zIndex = -2;
                    document.getElementById("REDEEM").style.visibility = "hidden";
                    document.getElementById("REDEEM").style.zIndex = -2;
                }
            }
        },
            'pointer',
            "lunarGarage",
            this
        ));

        // Titan Sell Center
        this.addHitbox(new WorldEntityHitbox(
            1812, {
            x: (this.boundingBox.width / uiScaleX) * .10,
            y: 0,
            width: (this.boundingBox.width / uiScaleX) * .275,
            height: (this.boundingBox.height / uiScaleY) * .25
        }, {
            onmousedown: function ()
            {
                openUi(SellWindow, null, TITAN_INDEX);
            }
        },
            'pointer',
            "sellCenter",
            this
        ));
        // Titan Hire Center
        this.addHitbox(new WorldEntityHitbox(
            1812, {
            x: (this.boundingBox.width / uiScaleX) * .375,
            y: (this.boundingBox.height / uiScaleY) * .04,
            width: (this.boundingBox.width / uiScaleX) * .17,
            height: (this.boundingBox.height / uiScaleY) * .25
        }, {
            onmousedown: function ()
            {
                openUi(HireWindow, null, TITAN_INDEX);
            }
        },
            'pointer',
            "hireCenter",
            this
        ));
        // Titan Drill Center
        this.addHitbox(new WorldEntityHitbox(
            1812, {
            x: (this.boundingBox.width / uiScaleX) * .62,
            y: 0,
            width: (this.boundingBox.width / uiScaleX) * .14,
            height: (this.boundingBox.height / uiScaleY) * .25
        }, {
            onmousedown: function ()
            {
                openUi(CraftingWindow, null, TITAN_INDEX);
            }
        },
            'pointer',
            "drillCenter",
            this
        ));
        // Titan Garage
        this.addHitbox(new WorldEntityHitbox(
            1812, {
            x: (this.boundingBox.width / uiScaleX) * .55,
            y: (this.boundingBox.height / uiScaleY) * .05,
            width: (this.boundingBox.width / uiScaleX) * .065,
            height: (this.boundingBox.height / uiScaleY) * .18
        }, {
            onmousedown: function ()
            {
                openUi(PurchaseWindow, null, TITAN_INDEX);
                if(document.getElementById('buyoptions'))
                {
                    document.getElementById('buyoptions').innerHTML = paypalhtml;
                    document.getElementById("BTC1").style.visibility = "hidden";
                    document.getElementById("BTC1").style.zIndex = -2;
                    document.getElementById("BTC2").style.visibility = "hidden";
                    document.getElementById("BTC2").style.zIndex = -2;
                    document.getElementById("REDEEM").style.visibility = "hidden";
                    document.getElementById("REDEEM").style.zIndex = -2;
                }
            }
        },
            'pointer',
            "titanGarage",
            this
        ));

        // Manager
        this.addHitbox(new WorldEntityHitbox(-2, {
            x: (this.boundingBox.width / uiScaleX) * .3,
            y: (this.boundingBox.height / uiScaleY) * .08,
            width: (this.boundingBox.width / uiScaleX) * .05,
            height: (this.boundingBox.height / uiScaleY) * .12
        }, {
            onmouseenter: function ()
            {
                if(managerStructure.level == 0) return;

                if(managerStructure.level == 1)
                {
                    showTooltip(_("Manager Level {0}", managerStructure.level), _("- Unlocks sell center resource locking.<br><br>- Grants you offline progress at 25% efficiency for 12hrs."));
                } else if(managerStructure.level == 2)
                {
                    showTooltip(_("Manager Level {0}", managerStructure.level), _("- Unlocks sell center resource locking.<br><br>- Grants you offline progress at 50% efficiency for 24hrs."));
                } else
                {
                    showTooltip(_("Manager Level {0}", managerStructure.level), _("- Unlocks sell center resource locking.<br><br>- Grants you offline progress at 100% efficiency for 48hrs."));
                }
            },
            onmouseexit: function ()
            {
                hideTooltip();
            }
        },
            'pointer',
            "manager",
            this
        ));

        //Super Miner
        this.addHitbox(new WorldEntityHitbox(10, {
            x: (this.boundingBox.width / uiScaleX) * .1,
            y: (this.boundingBox.height / uiScaleY) * .025,
            width: (this.boundingBox.width / uiScaleX) * .68,
            height: (this.boundingBox.height / uiScaleY) * .15
        }, {
            onmousedown: function ()
            {
                if(superMinerManager.recievedInitialSuperMiner)
                {
                    openUi(SuperMinersWindow);
                }
                else
                {
                    chestService.spawnChest(0, Chest.purchased, ChestType.black);
                    chestService.presentChest(0);
                    superMinerManager.recievedInitialSuperMiner = true;
                }
            },
        },
            'pointer',
            "superMiners",
            this
        ));

        // Gem Forge
        this.addHitbox(new WorldEntityHitbox(302, {
            x: (this.boundingBox.width / uiScaleX) * .09,
            y: (this.boundingBox.height / uiScaleY) * .03,
            width: (this.boundingBox.width / uiScaleX) * .25,
            height: (this.boundingBox.height / uiScaleY) * .3
        }, {
            onmousedown: function ()
            {
                openUi(GemForgeWindow);
            }
        },
            'pointer',
            "gemForge",
            this
        ));

        // City Achievements
        this.addHitbox(new WorldEntityHitbox(300, {
            x: (this.boundingBox.width / uiScaleX) * .32,
            y: (this.boundingBox.height / uiScaleY) * .07,
            width: (this.boundingBox.width / uiScaleX) * .2,
            height: (this.boundingBox.height / uiScaleY) * .2
        }, {
            onmousedown: function ()
            {
                openUi(QuestWindow, "", 1);
            }
        },
            'pointer',
            "cityAchievements",
            this
        ));

        // Weapon Crafting
        this.addHitbox(new WorldEntityHitbox(300, {
            x: (this.boundingBox.width / uiScaleX) * .55,
            y: (this.boundingBox.height / uiScaleY) * .07,
            width: (this.boundingBox.width / uiScaleX) * .25,
            height: (this.boundingBox.height / uiScaleY) * .62
        }, {
            onmousedown: function ()
            {
                openUi(WeaponCraftingWindow);
            }
        },
            'pointer',
            "weaponCrafting",
            this
        ));

        // Oil Rig
        this.addHitbox(new WorldEntityHitbox(302, {
            x: (this.boundingBox.width / uiScaleX) * .36,
            y: (this.boundingBox.height / uiScaleY) * .03,
            width: (this.boundingBox.width / uiScaleX) * .15,
            height: (this.boundingBox.height / uiScaleY) * .3
        }, {
            onmousedown: function ()
            {
                openUi(OilPumpWindow);
            },
        },
            'pointer',
            "oilRig",
            this
        ));

        // Core
        this.addHitbox(new WorldEntityHitbox(
            501, {
            x: Math.ceil(mainw * .082),
            y: 0,
            width: lavachasm.width,
            height: lavachasm.height,
        }, {
            onmousedown: function ()
            {
                openUi(PitWindow);
            }
        },
            'pointer',
            "core",
            this
        ));

        //Reactor
        this.addHitbox(new WorldEntityHitbox(1133, {
            x: (this.boundingBox.width / uiScaleX) * .1,
            y: (this.boundingBox.height / uiScaleY) * .03,
            width: (this.boundingBox.width / uiScaleX) * .68,
            height: (this.boundingBox.height / uiScaleY) * .3
        }, {
            onmousedown: function ()
            {
                openUi(ReactorWindow);
            },
        },
            'pointer',
            "reactor",
            this
        ));

        //Buff Lab
        this.addHitbox(new WorldEntityHitbox(1135, {
            x: (this.boundingBox.width / uiScaleX) * .1,
            y: (this.boundingBox.height / uiScaleY) * .025,
            width: (this.boundingBox.width / uiScaleX) * .68,
            height: (this.boundingBox.height / uiScaleY) * .15
        }, {
            onmousedown: function ()
            {
                openUi(BuffLabWindow);
            },
        },
            'pointer',
            "buffLab",
            this
        ));

        // Launch Button
        this.addHitbox(new WorldEntityHitbox(
            999, {
            x: (this.boundingBox.width / uiScaleX) * .82,
            y: 0,
            width: (this.boundingBox.width / uiScaleX) * .1,
            height: (this.boundingBox.height / uiScaleY) * .04
        }, {
            onmouseenter: function ()
            {
                if(!isLaunching && isWaitingForLiftoff())
                {
                    document.body.style.cursor = 'pointer';
                }
            },
            onmousedown: function ()
            {
                if(!isLaunching && isWaitingForLiftoff())
                {
                    isLaunching = true;
                    newNews("> 5 <");
                    if(!mutebuttons) {takeoffCountdownAudio.play();}
                    setTimeout(function () {newNews("> 4 <"); if(!mutebuttons) {takeoffCountdownAudio.play();} }, 1000);
                    setTimeout(function () {newNews("> 3 <"); if(!mutebuttons) {takeoffCountdownAudio.play();} }, 2000);
                    setTimeout(function () {newNews("> 2 <"); if(!mutebuttons) {takeoffCountdownAudio.play();} }, 3000);
                    setTimeout(function () {newNews("> 1 <"); if(!mutebuttons) {takeoffCountdownAudio.play();} }, 4000);
                    setTimeout(function ()
                    {
                        newNews("> 0 <");
                        if(!mutebuttons) {takeoffCountdownAudio.play();}
                        hasLaunched++;
                        isLaunching = false;
                    }, 5000);

                    //xCoordinateOfLevel + (this.boundingBox.width/uiScaleX)*.74, yCoordinateOfLevelTop - (this.boundingBox.height/uiScaleY)*.18, (this.boundingBox.width/uiScaleX)*.1, (this.boundingBox.height/uiScaleY)*.04
                }
            },
            onmouseexit: function ()
            {

            }
        },
            null,
            "launchButton",
            this
        ));

        // Launch Button (From Moon to Titan)
        this.addHitbox(new WorldEntityHitbox(
            1782, {
            x: (this.boundingBox.width / uiScaleX) * .82,
            y: 0,
            width: (this.boundingBox.width / uiScaleX) * .1,
            height: (this.boundingBox.height / uiScaleY) * .04
        }, {
            onmouseenter: function ()
            {
                if(!isLaunching && isWaitingForLiftoff())
                {
                    document.body.style.cursor = 'pointer';
                }
            },
            onmousedown: function ()
            {
                if(!isLaunching && isWaitingForLiftoff())
                {
                    isLaunching = true;
                    newNews("> 5 <");
                    setTimeout(function () {newNews("> 4 <");}, 1000);
                    setTimeout(function () {newNews("> 3 <");}, 2000);
                    setTimeout(function () {newNews("> 2 <");}, 3000);
                    setTimeout(function () {newNews("> 1 <");}, 4000);
                    setTimeout(function ()
                    {
                        newNews("> 0 <");
                        hasLaunched++;
                        isLaunching = false;
                    }, 5000);

                    //xCoordinateOfLevel + (this.boundingBox.width/uiScaleX)*.74, yCoordinateOfLevelTop - (this.boundingBox.height/uiScaleY)*.18, (this.boundingBox.width/uiScaleX)*.1, (this.boundingBox.height/uiScaleY)*.04
                }
            },
            onmouseexit: function ()
            {

            }
        },
            null,
            "launchButton2",
            this
        ));

        this.addHitbox(new WorldEntityHitbox(
            CAVE_BUILDING_DEPTH,
            {
                x: Math.ceil(mainw * .082),
                y: 0,
                width: caveBuildingLevel.width,
                height: caveBuildingLevel.height,
            },
            {
                onmousedown: function ()
                {
                    openUi(CaveManagementWindow);
                }
            },
            'pointer',
            'caveBuildingLevel',
            this
        ));
    }

    setBoundingBox()
    {
        this.boundingBox = this.context.canvas.getBoundingClientRect();
        this.boundingBox.x /= uiScaleX;
        this.boundingBox.y /= uiScaleY;
        this.boundingBox.width /= uiScaleX;
        this.boundingBox.height /= uiScaleY;
    }



    // ##################################################################
    // ########################## RENDER WORLD ##########################
    // ##################################################################

    renderTopCity()
    {
        if(currentlyViewedDepth < 4)
        {
            if(hasUnlockedScientists == 0)
            {
                MAIN.drawImage(toplevel, 0, ((currentlyViewedDepth / 4) * 480), 926, 480 - ((currentlyViewedDepth / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .724), Math.floor(mainh * .712) * ((4 - currentlyViewedDepth) / 4));
            }
            else
            {
                MAIN.drawImage(toplevel2, 0, ((currentlyViewedDepth / 4) * 480), 926, 480 - ((currentlyViewedDepth / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .724), Math.floor(mainh * .712) * ((4 - currentlyViewedDepth) / 4));
            }
            MAIN.drawImage(animatedDrillCenter, animatedDrillCenter.width / 2 * getAnimationFrameIndex(2, 10), 0, animatedDrillCenter.width / 2, animatedDrillCenter.height, Math.ceil(mainw * .6025), Math.floor(mainh * .712) * ((4 - currentlyViewedDepth) / 4) - Math.ceil(mainh * .2515), mainw * .1723, mainh * .237);
            MAIN.fillStyle = "#f4f5f4";
            MAIN.fillRect(Math.ceil(mainw * .642), Math.floor(mainh * .712) * ((4 - currentlyViewedDepth) / 4) - Math.ceil(mainh * .239), mainw * .081, mainh * .037);
            MAIN.fillStyle = "#000000";
            if(Math.floor(framesRendered2 / 68) % 7 == 0)
            {
                MAIN.drawImage(animatedMechanic, animatedMechanic.width / 4 * (Math.floor(framesRendered2 / 17) % 4), 0, animatedMechanic.width / 4, animatedMechanic.height, Math.ceil(mainw * .648), Math.floor(mainh * .712) * ((4 - currentlyViewedDepth) / 4) - Math.ceil(mainh * .1375), mainw * .0333, mainh * .055);
            }
            else
            {
                MAIN.drawImage(animatedMechanic, 0, 0, animatedMechanic.width / 4, animatedMechanic.height, Math.ceil(mainw * .648), Math.floor(mainh * .712) * ((4 - currentlyViewedDepth) / 4) - Math.ceil(mainh * .1375), mainw * .0333, mainh * .055);
            }

            if(Math.floor(framesRendered2 / 52) % 11 == 3)
            {
                MAIN.drawImage(animatedSeller, animatedSeller.width / 4 * (Math.floor(framesRendered2 / 13) % 4), 0, animatedSeller.width / 4, animatedSeller.height, Math.ceil(mainw * .197), Math.floor(mainh * .712) * ((4 - currentlyViewedDepth) / 4) - Math.ceil(mainh * .1375), mainw * .0333, mainh * .055);
            }
            else
            {
                MAIN.drawImage(animatedSeller, 0, 0, animatedSeller.width / 4, animatedSeller.height, Math.ceil(mainw * .197), Math.floor(mainh * .712) * ((4 - currentlyViewedDepth) / 4) - Math.ceil(mainh * .1375), mainw * .0333, mainh * .055);
            }

            if(Math.floor(framesRendered2 / 76) % 13 == 5)
            {
                MAIN.drawImage(animatedHirer, animatedHirer.width / 4 * (Math.floor(framesRendered2 / 19) % 4), 0, animatedHirer.width / 4, animatedHirer.height, Math.ceil(mainw * .397), Math.floor(mainh * .712) * ((4 - currentlyViewedDepth) / 4) - Math.ceil(mainh * .0895), mainw * .0333, mainh * .055);
            }
            else
            {
                MAIN.drawImage(animatedHirer, 0, 0, animatedHirer.width / 4, animatedHirer.height, Math.ceil(mainw * .397), Math.floor(mainh * .712) * ((4 - currentlyViewedDepth) / 4) - Math.ceil(mainh * .0895), mainw * .0333, mainh * .055);
            }

            MAIN.font = "900 14px KanitM";
            fillTextShrinkToFit(MAIN, _("SELL CENTER"), Math.ceil(mainw * .192), Math.floor(mainh * .712) * ((4 - currentlyViewedDepth) / 4) - Math.ceil(mainh * .215), mainw * .080, "center", .25);
            if(language == "german") MAIN.font = "12px KanitM";
            if(language == "spanish") MAIN.font = "12px KanitM";
            if(language == "japanese") MAIN.font = "12px KanitM";
            if(language == "french") MAIN.font = "12px KanitM";
            fillTextShrinkToFit(MAIN, _("HIRE CENTER"), Math.ceil(mainw * .392), Math.floor(mainh * .712) * ((4 - currentlyViewedDepth) / 4) - Math.ceil(mainh * .167), mainw * .080, "center", .25);
            MAIN.font = "900 14px KanitM";
            if(language == "french") MAIN.font = "13px KanitM";
            fillTextShrinkToFit(MAIN, _("CRAFT CENTER"), Math.ceil(mainw * .643), Math.floor(mainh * .712) * ((4 - currentlyViewedDepth) / 4) - Math.ceil(mainh * .215), mainw * .080, "center", .25);
            MAIN.font = "18px CFont";

            if(currentlyViewedDepth < 2)
            {
                MAIN.drawImage(questguy, 0, 0, 62, 54, Math.ceil(mainw * .625), Math.ceil(mainh * (.35 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .05), Math.floor(mainh * .08));
                if(isXmas)
                {
                    MAIN.drawImage(hat5, 64, 0, 32, 48, Math.ceil(mainw * .638), Math.ceil(mainh * (.343 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .028), Math.floor(mainh * .064));
                }
                else if(isHalloween)
                {
                    MAIN.drawImage(witchhat5, 0, 0, 32, 48, Math.ceil(mainw * .6365), Math.ceil(mainh * (.336 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .032), Math.floor(mainh * .074));
                }
            }

            if(currentlyViewedDepth < 3)
            {
                MAIN.save();
                MAIN.fillStyle = "#9D9D92";
                MAIN.strokeStyle = "#000000";

                if(isHoveringOverGarage)
                {
                    MAIN.drawImage(toplevel3, 0, ((currentlyViewedDepth / 4) * 480), 926, 480 - ((currentlyViewedDepth / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .724), Math.floor(mainh * .712) * ((4 - currentlyViewedDepth) / 4));
                }
                if(showGarageSparkles && depth > 20)
                {
                    MAIN.globalAlpha = 0.25 + (0.25 * oscillate(numFramesRendered, 17));
                    MAIN.drawImage(
                        garageSparkle,
                        (garageSparkle.width / 2) * (Math.floor(numFramesRendered / 3) % 2), 0, garageSparkle.width / 2, garageSparkle.height,
                        Math.ceil(mainw * .53),
                        Math.floor(mainh * .552) * ((4 - currentlyViewedDepth) / 4),
                        mainw * .09,
                        mainh * .09
                    );
                    MAIN.globalAlpha = 1;
                }
                MAIN.lineWidth = 2;
                MAIN.font = "16px KanitM";
                MAIN.strokeText(tickets, Math.ceil(mainw * .588), Math.ceil(mainh * (.538 - (.179 * currentlyViewedDepth))));
                MAIN.fillText(tickets, Math.ceil(mainw * .588), Math.ceil(mainh * (.538 - (.179 * currentlyViewedDepth))));
                MAIN.restore();
            }

            //chest collector
            if(chestCollectorChanceStructure.level > 0 && chestCollectorStorageStructure.level > 0)
            {
                MAIN.save();
                var text = chestService.getTotalStoredChests() + "/" + chestService.getMaxStoredChests();
                MAIN.strokeStyle = "#000000";
                MAIN.lineWidth = 4;
                MAIN.fillStyle = "#ffffff"
                MAIN.font = "20px Verdana";
                MAIN.strokeText(text, Math.ceil(mainw * .14) - MAIN.measureText(text).width / 2, Math.floor(mainh * .76) * ((4 - currentlyViewedDepth) / 4) - Math.ceil(mainh * .12));
                MAIN.fillText(text, Math.ceil(mainw * .14) - MAIN.measureText(text).width / 2, Math.floor(mainh * .76) * ((4 - currentlyViewedDepth) / 4) - Math.ceil(mainh * .12));
                MAIN.font = "12px Verdana";
                MAIN.fillStyle = "#000000";
                MAIN.strokeStyle = "#000000";
                MAIN.lineWidth = 1;

                var totalCollectorLevel = chestCollectorChanceStructure.level + chestCollectorStorageStructure.level;

                if(totalCollectorLevel < 4)
                {
                    MAIN.drawImage(collector1, 0, 0, 150, 160, Math.ceil(mainw * .081), Math.ceil(mainh * (.594 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .11), Math.floor(mainh * .22));
                }
                else if(totalCollectorLevel >= 4 && totalCollectorLevel < 6)
                {
                    MAIN.drawImage(collector2, 0, 0, 150, 160, Math.ceil(mainw * .081), Math.ceil(mainh * (.594 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .11), Math.floor(mainh * .22));
                }
                else if(totalCollectorLevel >= 6 && totalCollectorLevel < 8)
                {
                    MAIN.drawImage(collector3, 0, 0, 150, 160, Math.ceil(mainw * .081), Math.ceil(mainh * (.594 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .11), Math.floor(mainh * .22));
                }
                else if(totalCollectorLevel >= 8 && totalCollectorLevel < 10)
                {
                    MAIN.drawImage(collector4, 0, 0, 150, 160, Math.ceil(mainw * .081), Math.ceil(mainh * (.594 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .11), Math.floor(mainh * .22));
                }
                else if(totalCollectorLevel >= 10)
                {
                    MAIN.drawImage(collector5, 0, 0, 150, 160, Math.ceil(mainw * .081), Math.ceil(mainh * (.594 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .11), Math.floor(mainh * .22));
                }

                MAIN.restore();
            }

            //metal detector
            if(metalDetectorStructure.level > 0)
            {
                if(metalDetectorStructure.level == 1)
                {
                    MAIN.drawImage(detector1, 0, 0, 65, 80, Math.ceil(mainw * .11), Math.ceil(mainh * (.65 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .05), Math.floor(mainh * .12));
                    if(Math.floor(numFramesRendered / 4) % 4 == 0 && chestService.hasUnclaimedChests())
                    {
                        MAIN.drawImage(detectRed, 0, 0, 65, 80, Math.ceil(mainw * .11), Math.ceil(mainh * (.65 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .05), Math.floor(mainh * .12));
                    }
                } else if(metalDetectorStructure.level == 2)
                {
                    MAIN.drawImage(detector2, 0, 0, 65, 80, Math.ceil(mainw * .11), Math.ceil(mainh * (.65 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .05), Math.floor(mainh * .12));
                    if(Math.floor(numFramesRendered / 4) % 4 == 0 && chestService.hasUnclaimedChests())
                    {
                        MAIN.drawImage(detectRed, 0, 0, 65, 80, Math.ceil(mainw * .11), Math.ceil(mainh * (.65 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .05), Math.floor(mainh * .12));
                    }
                } else if(metalDetectorStructure.level == 3)
                {
                    MAIN.drawImage(detector3, 0, 0, 65, 80, Math.ceil(mainw * .11), Math.ceil(mainh * (.65 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .05), Math.floor(mainh * .12));
                    if(Math.floor(numFramesRendered / 4) % 4 == 0 && chestService.hasUnclaimedChests())
                    {
                        MAIN.drawImage(detectRed, 0, 0, 65, 80, Math.ceil(mainw * .10), Math.ceil(mainh * (.635 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .09), Math.floor(mainh * .12));
                    }
                } else
                {
                    MAIN.drawImage(detector4, 0, 0, 65, 80, Math.ceil(mainw * .11), Math.ceil(mainh * (.65 - (.179 * currentlyViewedDepth))) + (mainh * (oscillate(numFramesRendered + 5, 13) * .005)), Math.floor(mainw * .05), Math.floor(mainh * .12));
                    if(Math.floor(numFramesRendered / 2) % 4 == 0 && chestService.hasUnclaimedChests())
                    {
                        MAIN.drawImage(detectRed, 0, 0, 65, 80, Math.ceil(mainw * .116), Math.ceil(mainh * (.655 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .05), Math.floor(mainh * .12));
                    }
                }
            }

            if(chestCompressorStructure.level > 0)
            {
                var compressorOffset = 0;
                if(clickedCompress)
                {
                    compressorOffset = 1;
                    clickedCompress = false;
                }
                if(chestCompressorStructure.level <= 2)
                {
                    MAIN.drawImage(compactor1, compressorOffset * compactor1.width / 2, 0, compactor1.width / 2, compactor1.height, Math.ceil(mainw * .17), Math.ceil(mainh * (.65 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .04), Math.floor(mainh * .15));
                }
                else if(chestCompressorStructure.level <= 4)
                {
                    MAIN.drawImage(compactor2, compressorOffset * compactor2.width / 2, 0, compactor2.width / 2, compactor2.height, Math.ceil(mainw * .17), Math.ceil(mainh * (.65 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .04), Math.floor(mainh * .15));
                }
                else if(chestCompressorStructure.level <= 6)
                {
                    MAIN.drawImage(compactor3, compressorOffset * compactor3.width / 2, 0, compactor3.width / 2, compactor3.height, Math.ceil(mainw * .17), Math.ceil(mainh * (.65 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .04), Math.floor(mainh * .15));
                }
                else if(chestCompressorStructure.level == 7)
                {
                    MAIN.drawImage(compactor4, compressorOffset * compactor4.width / 2, 0, compactor4.width / 2, compactor4.height, Math.ceil(mainw * .17), Math.ceil(mainh * (.65 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .04), Math.floor(mainh * .15));
                }
                else if(chestCompressorStructure.level >= 8)
                {
                    MAIN.drawImage(compactor5, compressorOffset * compactor5.width / 2, 0, compactor5.width / 2, compactor5.height, Math.ceil(mainw * .17), Math.ceil(mainh * (.65 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .04), Math.floor(mainh * .15));
                }
            }

            //manager
            if(managerStructure.level > 0)
            {
                if(managerStructure.level == 1)
                {
                    MAIN.drawImage(manager1, 0, 0, manager1.width, manager1.height, Math.ceil(mainw * .3), Math.ceil(mainh * (.55 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .05), Math.floor(mainh * .12));
                }
                else if(managerStructure.level == 2)
                {
                    MAIN.drawImage(manager2, 0, 0, manager2.width, manager2.height, Math.ceil(mainw * .3), Math.ceil(mainh * (.55 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .05), Math.floor(mainh * .12));
                }
                else
                {
                    MAIN.drawImage(manager3, 0, 0, manager3.width, manager3.height, Math.ceil(mainw * .3), Math.ceil(mainh * (.55 - (.179 * currentlyViewedDepth))), Math.floor(mainw * .05), Math.floor(mainh * .12));
                }
            }

            if(currentlyViewedDepth == 0)
            {
                if(isXmas)
                {
                    for(var i = 0; i < 17; i++)
                    {
                        MAIN.drawImage(xmasLights, ((i + framesRendered2) % 4) * xmasLights.width / 4, 0, xmasLights.width / 4, xmasLights.height / 3, mainw * .082 + (i * mainw * .052), mainh * .105, mainw * .052, mainh * .055);
                    }
                }

                if(isHalloween)
                {
                    MAIN.drawImage(spiderweb, 0, 0, spiderweb.width, spiderweb.height, mainw * .886, mainh * .112, mainw * .05, mainh * .1125);
                }
            }
        }
    }

    isTradingPost(depth)
    {
        for(var i = 0; i < tradeConfig.tradingPosts.length; ++i)
        {
            if(depth == tradeConfig.tradingPosts[i].depth) return true;
        }
        return false
    }

    isCore(depth)
    {
        return depth == 501;
    }

    renderTradingPost()
    {
        for(var i = 0; i < tradeConfig.tradingPosts.length; ++i)
        {
            if(currentlyViewedDepth >= tradeConfig.tradingPosts[i].depth && currentlyViewedDepth < tradeConfig.tradingPosts[i].depth + 10)
            {
                var xCoordinateOfLevel = Math.ceil(mainw * .082);
                var yCoordinateOfLevelTop = mainh * .111 + ((4 - (currentlyViewedDepth - tradeConfig.tradingPosts[i].depth)) * .178 * mainh);

                var tradingPostImage;
                if(tradingPostStructures[i].level == 0)
                {
                    tradingPostImage = tradeConfig.tradingPosts[i].unbuiltImage;
                }
                else
                {
                    tradingPostImage = tradeConfig.tradingPosts[i].image;
                }

                MAIN.drawImage(
                    tradingPostImage,
                    xCoordinateOfLevel,
                    yCoordinateOfLevelTop,
                    Math.floor(mainw * .724),
                    Math.ceil(mainh * .178)
                );

                saveCanvasState(MAIN);
                MAIN.font = "11px KanitM";
                if(tradingPostStructures[i].level != 0)
                {
                    fillTextShrinkToFit(MAIN,
                        _("TRADING POST"),
                        xCoordinateOfLevel + tradeConfig.tradingPosts[i].buildingTextCoords.x,
                        yCoordinateOfLevelTop + tradeConfig.tradingPosts[i].buildingTextCoords.y,
                        Math.floor(mainw * .055),
                        "center"
                    );

                    this.trades = getTradesForWorld(0);
                    if(i == 0 && isTradeAvailable(this.trades[0]) && isTradeAvailable(this.trades[1]))
                    {
                        var traderImage = getTraderImage(0, this.trades[0][TRADE_INDEX_TRADER]);

                        if(traderImage != null)
                        {
                            MAIN.save();
                            MAIN.shadowBlur = 5;
                            MAIN.shadowColor = "rgba(150, 150, 150, 0.75)";
                            MAIN.drawImage(
                                traderImage,
                                0,
                                traderImage.height * .1,
                                traderImage.width,
                                traderImage.height * .8,
                                xCoordinateOfLevel + tradeConfig.tradingPosts[i].buildingTextCoords.x - mainw * -.005,
                                yCoordinateOfLevelTop + tradeConfig.tradingPosts[i].buildingTextCoords.y + mainh * .0176,
                                mainw * .038,
                                mainw * .038 * (traderImage.width / traderImage.height * .7)
                            );
                            MAIN.restore();
                        }
                    }
                }
                restoreCanvasState(MAIN);
            }
        }
    }

    renderCaveBuilding()
    {
        if(currentlyViewedDepth >= CAVE_BUILDING_DEPTH && currentlyViewedDepth < CAVE_BUILDING_DEPTH + 10)
        {
            var xCoordinateOfLevel = Math.ceil(mainw * .082);
            var yCoordinateOfLevelTop = mainh * .111 + ((4 - (currentlyViewedDepth - CAVE_BUILDING_DEPTH)) * .178 * mainh);
            var levelWidth = Math.floor(mainw * .724);
            var levelHeight = Math.ceil(mainh * .178);
            MAIN.drawImage(
                caveBuildingStuff,
                getAnimationFrameIndex(3, 10) * caveBuildingStuff.width / 3,
                0,
                caveBuildingStuff.width / 3,
                caveBuildingStuff.height,
                xCoordinateOfLevel,
                yCoordinateOfLevelTop,
                levelWidth,
                levelHeight
            );
            MAIN.drawImage(
                caveBuildingLevel,
                xCoordinateOfLevel,
                yCoordinateOfLevelTop,
                levelWidth,
                levelHeight
            );
            MAIN.drawImage(
                caveBuildingBelt,
                getAnimationFrameIndex(3, 10) * caveBuildingBelt.width / 3,
                0,
                caveBuildingBelt.width / 3,
                caveBuildingBelt.height,
                xCoordinateOfLevel,
                yCoordinateOfLevelTop,
                levelWidth,
                levelHeight
            );
            drawImageRot(
                MAIN,
                caveBuildingGear1,
                0,
                0,
                caveBuildingGear1.width,
                caveBuildingGear1.height,
                xCoordinateOfLevel + levelWidth * 0.525 - (levelWidth * caveBuildingGear1.width / caveBuildingLevel.width) / 2,
                yCoordinateOfLevelTop + levelHeight * 0.48 - (levelHeight * caveBuildingGear1.height / caveBuildingLevel.height) / 2,
                levelWidth * caveBuildingGear1.width / caveBuildingLevel.width,
                levelHeight * caveBuildingGear1.height / caveBuildingLevel.height,
                (numFramesRendered % 32) * -11.25
            );
            drawImageRot(
                MAIN,
                caveBuildingGear2,
                0,
                0,
                caveBuildingGear2.width,
                caveBuildingGear2.height,
                xCoordinateOfLevel + levelWidth * 0.54 - (levelWidth * caveBuildingGear2.width / caveBuildingLevel.width) / 2,
                yCoordinateOfLevelTop + levelHeight * 0.72 - (levelHeight * caveBuildingGear2.height / caveBuildingLevel.height) / 2,
                levelWidth * caveBuildingGear2.width / caveBuildingLevel.width,
                levelHeight * caveBuildingGear2.height / caveBuildingLevel.height,
                (numFramesRendered % 16) * 22.5
            );
            drawImageRot(
                MAIN,
                caveBuildingGear3,
                0,
                0,
                caveBuildingGear3.width,
                caveBuildingGear3.height,
                xCoordinateOfLevel + levelWidth * 0.565 - (levelWidth * caveBuildingGear3.width / caveBuildingLevel.width) / 2,
                yCoordinateOfLevelTop + levelHeight * 0.68 - (levelHeight * caveBuildingGear3.height / caveBuildingLevel.height) / 2,
                levelWidth * caveBuildingGear3.width / caveBuildingLevel.width,
                levelHeight * caveBuildingGear3.height / caveBuildingLevel.height,
                (numFramesRendered % 24) * -15
            );
            MAIN.drawImage(
                frontOfCaveBuildingDrone,
                getAnimationFrameIndex(2, 2) * frontOfCaveBuildingDrone.width / 2,
                0,
                frontOfCaveBuildingDrone.width / 2,
                frontOfCaveBuildingDrone.height,
                xCoordinateOfLevel + levelWidth * .46,
                yCoordinateOfLevelTop + levelHeight * .48,
                levelWidth * .055,
                levelHeight * .38
            );
        }
    }

    renderCore()
    {
        if(currentlyViewedDepth > 499 && currentlyViewedDepth < 509)
        {
            var xCoordinateOfLevel = Math.ceil(mainw * .082);
            var yCoordinateOfLevelTop = mainh * .111 + ((4 - (currentlyViewedDepth - 501)) * .178 * mainh);

            MAIN.save();
            if(isCoreWarped)
            {
                MAIN.filter = 'hue-rotate(' + (130 + (oscillate(numFramesRendered, 20) * 50)) + 'deg) grayscale(67%) saturate(160%)';
            }
            else if(isCoreBlessed)
            {
                MAIN.filter = ' grayscale(75%) brightness(' + (150 + (oscillate(numFramesRendered, 20) * 50)) + '%) saturate(160%)';
            }
            MAIN.drawImage(
                lavachasm,
                0,
                0,
                lavachasm.width,
                lavachasm.height,
                xCoordinateOfLevel,
                yCoordinateOfLevelTop,
                Math.floor(mainw * .724),
                Math.ceil(mainh * .178)
            );
            MAIN.restore();
            MAIN.drawImage(
                coreEdges,
                0,
                0,
                coreEdges.width,
                coreEdges.height,
                xCoordinateOfLevel,
                yCoordinateOfLevelTop,
                Math.floor(mainw * .724),
                Math.ceil(mainh * .178)
            );

            saveCanvasState(MAIN);
            MAIN.font = "11px KanitM";
            restoreCanvasState(MAIN);
        }
    }


    renderUndergroundCity()
    {
        if(currentlyViewedDepth > 299 && currentlyViewedDepth < 309)
        {
            var yCoordinateOfLevelTop = mainh * .111 + ((4 - (currentlyViewedDepth - 301)) * .178 * mainh);
            var xCoordinateOfLevel = Math.ceil(mainw * .082);

            MAIN.drawImage(bottomlevelnew, 0, (((currentlyViewedDepth - 304) / 4) * 480), 926, 480 - (((currentlyViewedDepth - 304) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .724), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 304)) / 4));
            MAIN.drawImage(undergroundcitylights, 926 * getAnimationFrameIndex(3, 10), (((currentlyViewedDepth - 304) / 4) * 480), 926, 480 - (((currentlyViewedDepth - 304) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .724), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 304)) / 4));

            MAIN.drawImage(undergroundcityfire, 150 * (Math.floor(numFramesRendered / 2) % 4), 0, 150, undergroundcityfire.height, Math.ceil(mainw * .57), yCoordinateOfLevelTop + Math.ceil(mainh * .3), Math.floor(mainw * .117), Math.floor(mainh * .2));

            MAIN.save();
            if(currentTargetHitbox && currentTargetHitbox.hitbox.id == "weaponCrafting")
            {
                MAIN.shadowBlur = 8;
                MAIN.shadowColor = "rgba(255, 255, 64, .5)";
            }
            MAIN.drawImage(undergroundcitystatue, 0, 0, 926, undergroundcitystatue.height, Math.ceil(mainw * .082), yCoordinateOfLevelTop - Math.floor(mainh * .18), Math.floor(mainw * .724), Math.floor(mainh * .72));
            MAIN.restore();

            MAIN.save();
            if(currentTargetHitbox && currentTargetHitbox.hitbox.id == "oilRig")
            {
                MAIN.shadowBlur = 8;
                MAIN.shadowColor = "rgba(255, 255, 64, .5)";
            }
            if(!isOilRigFull())
            {
                MAIN.drawImage(getOilRigAsset(), 200 * (Math.floor(numFramesRendered / 4) % 4), 0, 200, Oil_Extractor.height, Math.ceil(mainw * .35), yCoordinateOfLevelTop + Math.ceil(mainh * .17), Math.floor(mainw * .153), Math.floor(mainh * .325));
            }
            else
            {
                MAIN.drawImage(getOilRigAsset(), 0, 0, 200, Oil_Extractor.height, Math.ceil(mainw * .35), yCoordinateOfLevelTop + Math.ceil(mainh * .17), Math.floor(mainw * .153), Math.floor(mainh * .325));
            }
            MAIN.restore();

            MAIN.save();
            if(currentTargetHitbox && currentTargetHitbox.hitbox.id == "gemForge")
            {
                MAIN.shadowBlur = 8;
                MAIN.shadowColor = "rgba(255, 255, 64, .5)";
            }

            var forgeAsset = undergroundcitygemassembler;
            if(gemForgeStructure.level == 2)
            {
                forgeAsset = undergroundcitygemassembler2;
            }
            else if(gemForgeStructure.level == 3)
            {
                forgeAsset = undergroundcitygemassembler3;
            }
            else if(gemForgeStructure.level == 4)
            {
                forgeAsset = undergroundcitygemassembler4;
            }
            else if(gemForgeStructure.level == 5)
            {
                forgeAsset = undergroundcitygemassembler5;
            }
            else if(gemForgeStructure.level >= 6)
            {
                forgeAsset = undergroundcitygemassembler6;
            }

            MAIN.drawImage(forgeAsset, 350 * (Math.floor(numFramesRendered / 3) % 4), 0, 350, undergroundcitygemassembler.height, Math.ceil(mainw * .082), yCoordinateOfLevelTop + Math.floor(mainh * .205), Math.floor(mainw * .273), Math.floor(mainh * .32));
            MAIN.restore();

            MAIN.drawImage(bottomlevelnewborder, 0, (((currentlyViewedDepth - 304) / 4) * 480), 926, 480 - (((currentlyViewedDepth - 304) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .724), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 304)) / 4));
        }
    }

    renderEndOfWorld()
    {
        if(currentlyViewedDepth > 999 && currentlyViewedDepth < 1009)
        {
            MAIN.drawImage(EndOfWorld, 0, (((currentlyViewedDepth - 1004) / 4) * 480), EndOfWorld.width, 480 - (((currentlyViewedDepth - 1004) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .855), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1004)) / 4));

            var xCoordinateOfLevel = Math.ceil(mainw * .082);
            var yCoordinateOfLevelTop = mainh * .111 + ((4 - (currentlyViewedDepth - 1001)) * .178 * mainh);

            if(depth >= 1007 || decimalDepth() < 1000.1)
            {
                drawImageRot(MAIN, idleFarmer, (Math.floor(framesRendered2 / 2) % 6) * 96, 0, 96, 96, xCoordinateOfLevel + (mainw * .55), yCoordinateOfLevelTop - (mainh * .02), Math.ceil(mainw * .08), Math.floor(mainh * .16), 180);
            }
            else
            {
                drawImageRot(MAIN, shockedFarmer, (Math.floor(framesRendered2 / 2) % 2) * 96, 0, 96, 96, xCoordinateOfLevel + (mainw * .55), yCoordinateOfLevelTop - (mainh * .02), Math.ceil(mainw * .08), Math.floor(mainh * .16), 180);
            }
        }
        if(currentlyViewedDepth > 1003 && currentlyViewedDepth < 1013)
        {
            MAIN.drawImage(blueSky, 0, (((currentlyViewedDepth - 1008) / 4) * 480), blueSky.width, 480 - (((currentlyViewedDepth - 1008) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .855), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1008)) / 4));
        }
        if(currentlyViewedDepth > 1007 && currentlyViewedDepth < 1017)
        {
            MAIN.drawImage(blueSky2, 0, (((currentlyViewedDepth - 1012) / 4) * 480), blueSky.width, 480 - (((currentlyViewedDepth - 1012) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .855), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1012)) / 4));
        }
        if(currentlyViewedDepth > 1011 && currentlyViewedDepth < 1021)
        {
            MAIN.drawImage(skySpaceTransition, 0, (((currentlyViewedDepth - 1016) / 4) * 480), skySpaceTransition.width, 480 - (((currentlyViewedDepth - 1016) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .855), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1016)) / 4));
        }
        if(currentlyViewedDepth > 1015 && currentlyViewedDepth < 1025)
        {
            MAIN.drawImage(spaceWithStars, 0, (((currentlyViewedDepth - 1020) / 4) * 480), spaceWithStars.width, 480 - (((currentlyViewedDepth - 1020) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .855), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1020)) / 4));
        }
        if(currentlyViewedDepth > 1019 && currentlyViewedDepth < 1029)
        {
            MAIN.drawImage(spaceWithStars2, 0, (((currentlyViewedDepth - 1024) / 4) * 480), spaceWithStars2.width, 480 - (((currentlyViewedDepth - 1024) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .855), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1024)) / 4));

            if(isUfoVisible())
            {
                var yCoordinateOfLevelTop = mainh * .111 + ((4 - (currentlyViewedDepth - 1019)) * .178 * mainh);
                MAIN.drawImage(worldUfo, (worldUfo.width / 4) * getAnimationFrameIndex(3, 10), 0, worldUfo.width / 4, worldUfo.height, Math.ceil(mainw * .35) + Math.floor(oscillate(numFramesRendered, 79) * Math.ceil(mainw * .33)), yCoordinateOfLevelTop + Math.ceil(mainh * .17) + Math.floor(oscillate(numFramesRendered, 31) * Math.ceil(mainw * .05)), Math.floor(mainw * .075), Math.floor(mainh * .14));
            }
        }
        if(currentlyViewedDepth > 1023 && currentlyViewedDepth < 1033)
        {
            MAIN.drawImage(spaceWithStars3, 0, (((currentlyViewedDepth - 1028) / 4) * 480), spaceWithStars3.width, 480 - (((currentlyViewedDepth - 1028) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .855), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1028)) / 4));
        }

        if(currentlyViewedDepth > 1782 && currentlyViewedDepth < 1792)
        {
            MAIN.drawImage(EndOfMoon, 0, (((currentlyViewedDepth - 1787) / 4) * 480), EndOfWorld.width, 480 - (((currentlyViewedDepth - 1787) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .855), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1787)) / 4));
        }
        if(currentlyViewedDepth > 1786 && currentlyViewedDepth < 1796)
        {
            MAIN.drawImage(spaceWithStars4, 0, (((currentlyViewedDepth - 1791) / 4) * 480), spaceWithStars4.width, 480 - (((currentlyViewedDepth - 1791) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .855), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1791)) / 4));
        }
        if(currentlyViewedDepth > 1790 && currentlyViewedDepth < 1800)
        {
            MAIN.drawImage(spaceWithStars2, 0, (((currentlyViewedDepth - 1795) / 4) * 480), spaceWithStars2.width, 480 - (((currentlyViewedDepth - 1795) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .855), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1795)) / 4));
        }
        if(currentlyViewedDepth > 1794 && currentlyViewedDepth < 1804)
        {
            MAIN.drawImage(spaceWithStars5, 0, (((currentlyViewedDepth - 1799) / 4) * 480), spaceWithStars5.width, 480 - (((currentlyViewedDepth - 1799) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .855), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1799)) / 4));
        }
        if(currentlyViewedDepth > 1798 && currentlyViewedDepth < 1808)
        {
            MAIN.drawImage(spaceWithStars5, 0, (((currentlyViewedDepth - 1803) / 4) * 480), spaceWithStars5.width, 480 - (((currentlyViewedDepth - 1803) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .855), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1803)) / 4));
        }
        if(currentlyViewedDepth > 1802 && currentlyViewedDepth < 1812)
        {
            MAIN.drawImage(spaceWithStars5, 0, (((currentlyViewedDepth - 1807) / 4) * 480), spaceWithStars5.width, 480 - (((currentlyViewedDepth - 1807) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .855), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1807)) / 4));
        }
        if(currentlyViewedDepth > 1805 && currentlyViewedDepth < 1815)
        {
            MAIN.drawImage(spaceWithStars6, 0, (((currentlyViewedDepth - 1810) / 4) * 480), spaceWithStars6.width, 480 - (((currentlyViewedDepth - 1810) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .114), Math.floor(mainw * .855), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1810)) / 4));
        }

    }

    renderMoonbase()
    {
        if(currentlyViewedDepth > 1027 && currentlyViewedDepth < 1037)
        {
            MAIN.drawImage(lunarBase, 0, (((currentlyViewedDepth - 1032) / 4) * 480), lunarBase.width, 480 - (((currentlyViewedDepth - 1032) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.floor(mainw * .855), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1032)) / 4));

            MAIN.fillStyle = "#000000";
            MAIN.font = "14px KanitM";
            fillTextShrinkToFit(MAIN, _("SELL CENTER"), Math.ceil(mainw * .193), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1032)) / 4) - Math.ceil(mainh * .215), mainw * .080, "center", .25);
            if(language == "german") MAIN.font = "12px KanitM";
            if(language == "spanish") MAIN.font = "12px KanitM";
            if(language == "japanese") MAIN.font = "12px KanitM";
            if(language == "french") MAIN.font = "12px KanitM";
            fillTextShrinkToFit(MAIN, _("HIRE CENTER"), Math.ceil(mainw * .391), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1032)) / 4) - Math.ceil(mainh * .167), mainw * .080, "center", .25);
            MAIN.font = "14px KanitM";
            if(language == "french") MAIN.font = "13px KanitM";
            fillTextShrinkToFit(MAIN, _("CRAFT CENTER"), Math.ceil(mainw * .642), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1032)) / 4) - Math.ceil(mainh * .215), mainw * .080, "center", .25);
        }
    }

    renderTitanbase()
    {
        if(currentlyViewedDepth > 1809 && currentlyViewedDepth < 1819)
        {
            MAIN.drawImage(titanBase, 0, (((currentlyViewedDepth - 1814) / 4) * 480), titanBase.width, 480 - (((currentlyViewedDepth - 1814) / 4) * 480), Math.ceil(mainw * .082), Math.ceil(mainh * .112), Math.floor(mainw * .855), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1814)) / 4));

            MAIN.fillStyle = "#000000";
            MAIN.font = "14px KanitM";
            fillTextShrinkToFit(MAIN, _("SELL CENTER"), Math.ceil(mainw * .193), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1814)) / 4) - Math.ceil(mainh * .215), mainw * .080, "center", .25);
            if(language == "german") MAIN.font = "12px KanitM";
            if(language == "spanish") MAIN.font = "12px KanitM";
            if(language == "japanese") MAIN.font = "12px KanitM";
            if(language == "french") MAIN.font = "12px KanitM";
            fillTextShrinkToFit(MAIN, _("HIRE CENTER"), Math.ceil(mainw * .391), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1814)) / 4) - Math.ceil(mainh * .167), mainw * .080, "center", .25);
            MAIN.font = "14px KanitM";
            if(language == "french") MAIN.font = "13px KanitM";
            fillTextShrinkToFit(MAIN, _("CRAFT CENTER"), Math.ceil(mainw * .642), Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - 1814)) / 4) - Math.ceil(mainh * .215), mainw * .080, "center", .25);
        }
    }

    renderReactor()
    {
        if(currentlyViewedDepth > REACTOR_DEPTH - 1 && currentlyViewedDepth < REACTOR_DEPTH + 10)
        {
            var yCoordinateOfLevelTop = mainh * .111 + ((4 - (currentlyViewedDepth - REACTOR_DEPTH + 1)) * .178 * mainh);
            var xCoordinateOfLevel = Math.ceil(mainw * .082);
            var reactorWidth = 0;
            var reactorHeight = 0;
            var reactorHeightOffset = 0;
            var reactorAsset = reactor1;

            if(reactorStructure.level == 1)
            {
                reactorAsset = reactor1;
                reactorWidth = .34;
                reactorHeight = .67;
                reactorHeightOffset = (mainh * .178 * 2 * .7);
            }
            else if(reactorStructure.level == 2)
            {
                reactorAsset = reactor2;
                reactorWidth = .385;
                reactorHeight = .73;
                reactorHeightOffset = (mainh * .178 * 2 * .65);
            }
            else if(reactorStructure.level == 3)
            {
                reactorAsset = reactor3;
                reactorWidth = .485;
                reactorHeight = .75;
                reactorHeightOffset = (mainh * .178 * 2 * .7);
            }
            else if(reactorStructure.level == 4)
            {
                reactorAsset = reactor4;
                reactorWidth = .485;
                reactorHeight = .78;
                reactorHeightOffset = (mainh * .178 * 2 * .62);
            }
            else if(reactorStructure.level >= 5)
            {
                reactorAsset = reactor5;
                reactorWidth = .725;
                reactorHeight = .90;
                reactorHeightOffset = (mainh * .178 * 2 * .5);
            }
            var reactorFrameWidth = reactorAsset.width / 4;

            MAIN.drawImage(
                reactor_level,
                0,
                (((currentlyViewedDepth - REACTOR_DEPTH - 4) / 4) * 480),
                926,
                480 - (((currentlyViewedDepth - REACTOR_DEPTH - 4) / 4) * 480),
                Math.ceil(mainw * .082),
                Math.ceil(mainh * .111),
                Math.floor(mainw * .724),
                Math.floor(mainh * .712) * ((4 - (currentlyViewedDepth - REACTOR_DEPTH - 4)) / 4)
            );

            var reactorRenderWidth = Math.floor(mainw * .724 * reactorWidth);
            var reactorRenderHeight = Math.floor(mainh * .178 * 2 * reactorHeight);
            var xOffset = (mainw * .724 - reactorRenderWidth) / 2;

            MAIN.drawImage(
                reactorAsset,
                reactorFrameWidth * (Math.floor(numFramesRendered / 2) % 4),
                0,
                reactorFrameWidth,
                reactorAsset.height,
                xCoordinateOfLevel + xOffset,
                yCoordinateOfLevelTop + reactorHeightOffset,
                reactorRenderWidth,
                reactorRenderHeight
            );
        }
    }

    renderBuffLab()
    {
        if(currentlyViewedDepth > REACTOR_DEPTH - 1 && currentlyViewedDepth < REACTOR_DEPTH + 10)
        {
            var xCoordinateOfLevel = Math.ceil(mainw * .082);
            var yCoordinateOfLevelTop = mainh * .111 + ((4 - (currentlyViewedDepth - REACTOR_DEPTH - 2)) * .178 * mainh);

            MAIN.drawImage(
                lunarbackground,
                xCoordinateOfLevel,
                yCoordinateOfLevelTop,
                Math.floor(mainw * .724),
                Math.ceil(mainh * .178)
            );

            MAIN.drawImage(
                lab_bg,
                xCoordinateOfLevel,
                yCoordinateOfLevelTop,
                Math.floor(mainw * .724),
                Math.ceil(mainh * .178)
            );

            MAIN.drawImage(
                lab1,
                926 * (Math.floor(numFramesRendered / 4) % 4),
                0,
                926,
                lab1.height,
                Math.ceil(mainw * .085),
                yCoordinateOfLevelTop,
                Math.floor(mainw * .7),
                Math.floor(mainh * .178)
            );
            MAIN.save();
            var signX = Math.floor(mainw * .7) * 0.3975;
            var signY = Math.floor(mainh * .178) * 0.2675;
            var signWidth = Math.floor(mainw * .7) * 0.115;
            var signHeight = Math.floor(mainh * .178) * 0.13;
            MAIN.font = signHeight + "px KanitM";
            MAIN.textBaseline = "middle";
            MAIN.fillStyle = "#000000";
            fillTextShrinkToFit(
                MAIN,
                _("BUFF LAB"),
                xCoordinateOfLevel + signX,
                yCoordinateOfLevelTop + signY,
                signWidth,
                "center"
            );
            MAIN.restore();
        }
    }

    renderSuperMinerBuilding()
    {
        if(currentlyViewedDepth >= SUPER_MINER_DEPTH && currentlyViewedDepth <= SUPER_MINER_DEPTH + 4)
        {
            var xCoordinateOfLevel = Math.ceil(mainw * .082);
            var yCoordinateOfLevelTop = mainh * .111 + ((4 - (currentlyViewedDepth - SUPER_MINER_DEPTH)) * .178 * mainh);

            MAIN.drawImage(
                superMinerLevel,
                0,
                0,
                superMinerLevel.width,
                superMinerLevel.height,
                xCoordinateOfLevel,
                yCoordinateOfLevelTop,
                Math.floor(mainw * .724),
                Math.floor(mainh * .179)
            );

            if(!superMinerManager.recievedInitialSuperMiner)
            {
                let chestX = Math.ceil(mainw * .475);
                let chestY = mainh * .205 + ((4 - (currentlyViewedDepth - SUPER_MINER_DEPTH)) * .178 * mainh)
                MAIN.drawImage(
                    superMinerLevelChest,
                    0,
                    0,
                    superMinerLevelChest.width,
                    superMinerLevelChest.height,
                    chestX,
                    chestY,
                    relativeWidth(superMinerLevelChest),
                    relativeHeight(superMinerLevelChest)
                );

                let starAnimationDuration = 1500;
                this.context.globalAlpha = 0.5 * oscillate(currentTime(), starAnimationDuration);

                MAIN.drawImage(
                    superMinerLevelGlow,
                    0,
                    0,
                    superMinerLevelGlow.width,
                    superMinerLevelGlow.height,
                    xCoordinateOfLevel,
                    yCoordinateOfLevelTop,
                    Math.floor(mainw * .724),
                    Math.floor(mainh * .179)
                );
                this.context.globalAlpha = 1;
            }

            var signX = Math.floor(mainw * .7) * 0.46;
            var signY = Math.floor(mainh * .178) * 0.18;
            var signWidth = Math.floor(mainw * .7) * 0.09;
            var signHeight = Math.floor(mainh * .178) * 0.13;
            MAIN.font = signHeight + "px KanitM";
            MAIN.fillStyle = "#000000";
            fillTextShrinkToFit(
                MAIN,
                _("SUPER MINERS"),
                xCoordinateOfLevel + signX,
                yCoordinateOfLevelTop + signY,
                signWidth,
                "center"
            );
        }
    }

    renderDrill()
    {
        if(currentlyViewedDepth >= depth - 1 && ((depth > 1000 && depth < 1032) || (depth > 1783 && depth < 1813)) && !isStalledDueToBoss() && !isWaitingForLiftoff())
        {
            var yCoordinate = Math.ceil(mainh * .532) + Math.floor(mainh * .234) * subTickDistancePercent();
            if(currentlyViewedDepth == (depth - 1))
            {
                yCoordinate += Math.ceil(.234 * mainh);
            }
            MAIN.drawImage(rocketDrillFlames, 168 * getAnimationFrameIndex(4, 10), 0, 168, 158, Math.ceil(mainw * .805), yCoordinate - Math.ceil(mainh * .062), Math.ceil(mainw * .131), Math.floor(mainh * .234));
            MAIN.drawImage(drillState.drill().worldAsset, 168 * getAnimationFrameIndex(4, 10), 0, 168, 158, Math.ceil(mainw * .805), yCoordinate, Math.ceil(mainw * .131), Math.floor(mainh * .234));
            MAIN.drawImage(drillState.engine().worldAsset, 168 * getAnimationFrameIndex(4, 10), 0, 168, 158, Math.ceil(mainw * .805), yCoordinate, Math.ceil(mainw * .131), Math.floor(mainh * .234));
        }
        else if(currentlyViewedDepth == depth)
        {
            saveCanvasState(MAIN);
            MAIN.strokeStyle = "#000000";
            MAIN.fillStyle = "#999999";
            MAIN.fillRect(Math.ceil(mainw * .815), Math.ceil(mainh * .72), Math.ceil(mainw * .111), Math.ceil(mainh * .02));
            MAIN.fillStyle = "#333333";
            MAIN.fillRect(Math.ceil(mainw * .815), Math.ceil(mainh * .72), Math.ceil(mainw * .111) * Math.min(1, (divideBigIntToDecimalNumber(progressTowardsNextDepth, depthDifficultyTable[depth]))), Math.ceil(mainh * .02));
            MAIN.strokeRect(Math.ceil(mainw * .815), Math.ceil(mainh * .72), Math.ceil(mainw * .111), Math.ceil(mainh * .02));
            if(!isStalledDueToBoss() && !isWaitingForLiftoff())
            {
                MAIN.drawImage(drillState.drill().worldAsset, 168 * getAnimationFrameIndex(4, 10), 0, 168, 158, Math.ceil(mainw * .805), Math.ceil(mainh * .766), Math.ceil(mainw * .131), Math.floor(mainh * .234));
                MAIN.drawImage(drillState.engine().worldAsset, 168 * getAnimationFrameIndex(4, 10), 0, 168, 158, Math.ceil(mainw * .805), Math.ceil(mainh * .766), Math.ceil(mainw * .131), Math.floor(mainh * .234));
            }
            else
            {
                MAIN.drawImage(drillState.drill().worldAsset, 0, 0, 168, 158, Math.ceil(mainw * .805), Math.ceil(mainh * .766), Math.ceil(mainw * .131), Math.floor(mainh * .234));
                MAIN.drawImage(drillState.engine().worldAsset, 0, 0, 168, 158, Math.ceil(mainw * .805), Math.ceil(mainh * .766), Math.ceil(mainw * .131), Math.floor(mainh * .234));
            }
            restoreCanvasState(MAIN);
        }
    }

    renderSingleLevelOfDepth(depthToRender)
    {
        var xCoordinateOfLevel = Math.ceil(mainw * .082);
        var yCoordinateOfLevelTop = mainh * .111 + ((4 - (currentlyViewedDepth - depthToRender)) * .178 * mainh);

        if(!isDepthWithoutWorkers(depthToRender))
        {
            this.renderBackgroundForDepth(depthToRender, xCoordinateOfLevel, yCoordinateOfLevelTop);
            this.renderBackgroundDecalsForDepth(depthToRender, xCoordinateOfLevel, yCoordinateOfLevelTop);
            this.renderBackgroundEffectsForDepth(depthToRender, xCoordinateOfLevel, yCoordinateOfLevelTop);
            this.renderLevelImageForDepth(depthToRender, xCoordinateOfLevel, yCoordinateOfLevelTop);
            this.renderLightsForDepth(depthToRender, yCoordinateOfLevelTop);
            this.renderKmTextForDepth(depthToRender, xCoordinateOfLevel, yCoordinateOfLevelTop);
            if(!isBossLevel(depthToRender))
            {
                this.renderWorkersForDepth(depthToRender, yCoordinateOfLevelTop);
            }
        }

        //World buttons
        if(((depthToRender == 1000 && hasLaunched == 0) || (depthToRender == 1783 && hasLaunched == 1)) && isWaitingForLiftoff() && !isLaunching)
        {
            renderButton(MAIN, upgradeb, _("LAUNCH"), xCoordinateOfLevel + mainw * .74, yCoordinateOfLevelTop - mainh * .18, mainw * .1, mainh * .04, "18px Verdana", "#000000");
        }
    }

    renderBackgroundForDepth(depthToRender, xCoordinateOfLevel, yCoordinateOfLevelTop)
    {
        if(depthToRender < 1000)
        {
            if(!isDepthWithoutWorkers(depthToRender) && !this.isTradingPost(depthToRender) && !this.isCore(depthToRender))
            {
                for(var i = 0; i < 45; i++)
                {
                    if(backgroundGemPattern[depthToRender % 10][i] > 0)
                    {
                        MAIN.drawImage(wallgems, 10 * ((backgroundGemPattern[depthToRender % 15][i] - 1) + ((levels[depthToRender][0][0] - 1) * 5)), 0, 20, 120, xCoordinateOfLevel + Math.floor(mainw * (i * .016)), yCoordinateOfLevelTop, Math.floor(mainw * .016), Math.ceil(mainh * .178));
                    }
                }
            }
        }
        else if(depthToRender >= 1032)
        {
            MAIN.drawImage(lunarbackground, 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
        }
    }

    renderBackgroundDecalsForDepth(depthToRender, xCoordinateOfLevel, yCoordinateOfLevelTop)
    {
        if(depthToRender == 50)
        {
            MAIN.drawImage(crack, 40 - (40 * (Math.ceil((numFramesRendered % 16) / 15))), 0, 40, 120, xCoordinateOfLevel + (mainw * .038), yCoordinateOfLevelTop, Math.floor(mainw * .032), Math.ceil(mainh * .178));
        }
        if(depthToRender == 100 && (chestCollectorChanceStructure.level == 0 || chestCollectorStorageStructure.level == 0))
        {
            MAIN.drawImage(collector1, 0, 0, collector1.width, collector1.height, xCoordinateOfLevel + Math.floor(mainw * (.57)), yCoordinateOfLevelTop + Math.floor(mainh * (-.06)), Math.floor(mainw * .11), Math.floor(mainh * .22));
        }
        if(depthToRender == 112)
        {
            MAIN.drawImage(mime, 0, 0, mime.width, mime.height, xCoordinateOfLevel + Math.floor(mainw * (.12)), yCoordinateOfLevelTop + Math.floor(mainh * (.04)), Math.floor(mainw * .16), Math.ceil(mainh * .073));
        }
        if(depthToRender == 225)
        {
            MAIN.drawImage(robot, 30 * (Math.floor(numFramesRendered / 3) % 4), 0, 30, 120, xCoordinateOfLevel + (mainw * .048), yCoordinateOfLevelTop + (mainh * .054), Math.floor(mainw * .032), Math.ceil(mainh * .178));
        }
        if(depthToRender == 1257)
        {
            MAIN.drawImage(Lunar_Robot, 40 * (Math.floor(numFramesRendered / 3) % 4), 0, 40, 160, xCoordinateOfLevel + (mainw * .048), yCoordinateOfLevelTop + (mainh * .053), Math.floor(mainw * .03), Math.ceil(mainh * .14));
        }
    }

    renderBackgroundEffectsForDepth(depthToRender, xCoordinateOfLevel, yCoordinateOfLevelTop)
    {
        if(battleWaiting[1] == depthToRender)
        {
            MAIN.drawImage(pulsered, Math.floor(oscillate(numFramesRendered, 9) * 9), 0, 1, 1, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .7), Math.ceil(mainh * .178));
        }
        if(chestService.chestExistsAtDepth(depthToRender) && !(depthToRender == 0 && activeLayers.hasOwnProperty("Chest")))
        {
            MAIN.drawImage(pulseyellow, Math.floor(oscillate(numFramesRendered, 9) * 9), 0, 1, 1, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .7), Math.ceil(mainh * .178));
        }
    }

    renderLevelImageForDepth(depthToRender, xCoordinateOfLevel, yCoordinateOfLevelTop)
    {
        if(depthToRender == 0)
        {
            MAIN.drawImage(level, 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop - 1, Math.floor(mainw * .724), Math.ceil(mainh * .18));
        }
        else if(depthToRender < 100)
        {
            MAIN.drawImage(level, 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
        }
        else if(depthToRender < 200)
        {
            MAIN.drawImage(level2, 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
        }
        else if(depthToRender < 300)
        {
            MAIN.drawImage(level3, 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
        }
        else if(depthToRender < 400)
        {
            MAIN.drawImage(level4, 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
        }
        else if(depthToRender < 1000)
        {
            MAIN.drawImage(brown, 0, 0, 1, 1, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .724), 4);
            if(!isBossLevel(depthToRender))
            {
                if(depthToRender < 900)
                {
                    MAIN.drawImage(level5, 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
                }
                else
                {
                    MAIN.drawImage(level6, 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
                }
            }
            else
            {
                MAIN.drawImage(getBossLevelAsset(depthToRender), 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
            }
        }
        else if(depth >= 1000)
        {
            if(depthToRender == 1032)
            {
                MAIN.drawImage(lunarlevel2, 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop - 1, Math.floor(mainw * .724), Math.ceil(mainh * .18));
            }
            else if(!isBossLevel(depthToRender))
            {
                if(depthToRender < 1132)
                {
                    MAIN.drawImage(lunarlevel2, 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
                }
                else if(depthToRender < 1432)
                {
                    MAIN.drawImage(lunarlevel1, 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
                }
                else if(depthToRender < 1532)
                {
                    MAIN.drawImage(lunarlevel4, 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
                }
                else if(depthToRender >= 1532 && depthToRender <= 1782)
                {
                    MAIN.drawImage(lunarlevel3, 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
                }
                else if(depthToRender < 1914)
                {
                    MAIN.drawImage(titanlevel4, 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
                }
                else if(depthToRender <= 2014) //switch back to < after new depths are added
                {
                    MAIN.drawImage(titanlevel1, 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
                }
            } else
            {
                MAIN.drawImage(getBossLevelAsset(depthToRender), 0, 0, 926, 120, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
            }
        }
    }

    renderLightsForDepth(depthToRender, yCoordinateOfLevelTop)
    {
        if(worldBeingViewed().index == 0)
        {
            if(isHalloween)
            {
                MAIN.drawImage(halloweenlight, 0, 0, 926, 120, Math.ceil(mainw * (.072 + (((depthToRender) % 7 % 3) * .003))), yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
            }
            else
            {
                MAIN.drawImage(light, 0, 0, 926, 120, Math.ceil(mainw * (.072 + (((depthToRender) % 7 % 3) * .003))), yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
            }
        } else if(worldBeingViewed().index == 1)
        {
            MAIN.drawImage(lunarlight, 0, 0, 926, 120, Math.ceil(mainw * (.072 + (((depthToRender) % 7 % 3) * .003))), yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
        }
        else if(worldBeingViewed().index == 2)
        {
            MAIN.drawImage(titanlight, 0, 0, 926, 120, Math.ceil(mainw * (.072 + (((depthToRender) % 7 % 3) * .003))), yCoordinateOfLevelTop, Math.floor(mainw * .724), Math.ceil(mainh * .178));
        }
    }

    renderKmTextForDepth(depthToRender, xCoordinateOfLevel, yCoordinateOfLevelTop)
    {
        MAIN.save();
        MAIN.fillStyle = "#FFFFFF";
        MAIN.font = "18px CFont";
        MAIN.lineWidth = 3;
        if(depthToRender < 1032)
        {
            MAIN.fillText(depthToRender + "Km", xCoordinateOfLevel + Math.ceil(mainw * .01), yCoordinateOfLevelTop + Math.ceil(mainh * .022));
        }
        else if(depthToRender < 1813)
        {
            MAIN.fillText((depthToRender - 1032) + "Km", xCoordinateOfLevel + Math.ceil(mainw * .01), yCoordinateOfLevelTop + Math.ceil(mainh * .022));
        }
        else
        {
            MAIN.fillText((depthToRender - 1814) + "Km", xCoordinateOfLevel + Math.ceil(mainw * .01), yCoordinateOfLevelTop + Math.ceil(mainh * .022));
        }
        MAIN.restore();
    }

    renderWorkersForDepth(depthToRender, yCoordinateOfLevelTop)
    {
        var workersToSkip = [];
        if(chestService.chestExistsAtDepth(depthToRender) && !(depthToRender == 0 && activeLayers.hasOwnProperty("Chest")))
        {
            var workerLevel = workersLevelAtDepth(depthToRender);
            let chests = chestService.getChestsAtDepth(depthToRender);
            for(var i = chestService.getChestsAtDepth(depthToRender).length; i > 0; i--)
            {
                let chest = chests[i - 1];

                if(chest.type == ChestType.gold)
                {
                    if(depthToRender < 1000)
                    {

                        if(workerLevel < 5)
                        {
                            MAIN.drawImage(found2, 32 * getAnimationFrameIndex(4, 10), 0, 32, 96, Math.ceil(mainw * (.085 + ((chest.worker - 1) * .072))), yCoordinateOfLevelTop, Math.ceil(mainw * .025), Math.floor(mainh * .142));
                        }
                        else
                        {
                            MAIN.drawImage(window["found" + workerLevel], 32 * getAnimationFrameIndex(4, 10), 0, 32, 96, Math.ceil(mainw * (.085 + ((chest.worker - 1) * .072))), yCoordinateOfLevelTop, Math.ceil(mainw * .025), Math.floor(mainh * .142));
                        }
                    }
                    else
                    {
                        MAIN.drawImage(foundm2, 32 * getAnimationFrameIndex(4, 10), 0, 32, 96, Math.ceil(mainw * (.085 + ((chest.worker - 1) * .072))), yCoordinateOfLevelTop, Math.ceil(mainw * .025), Math.floor(mainh * .142));
                    }
                }
                else if(chest.type == ChestType.black)
                {
                    if(depthToRender < 1000)
                    {

                        if(workerLevel < 5)
                        {
                            MAIN.drawImage(foundb, 32 * getAnimationFrameIndex(4, 10), 0, 32, 96, Math.ceil(mainw * (.085 + ((chest.worker - 1) * .072))), yCoordinateOfLevelTop, Math.ceil(mainw * .025), Math.floor(mainh * .142));
                        }
                        else
                        {
                            MAIN.drawImage(window["foundb" + workerLevel], 32 * getAnimationFrameIndex(4, 10), 0, 32, 96, Math.ceil(mainw * (.085 + ((chest.worker - 1) * .072))), yCoordinateOfLevelTop, Math.ceil(mainw * .025), Math.floor(mainh * .142));
                        }
                    }
                    else
                    {
                        MAIN.drawImage(foundmb, 32 * getAnimationFrameIndex(4, 10), 0, 32, 96, Math.ceil(mainw * (.085 + ((chest.worker - 1) * .072))), yCoordinateOfLevelTop, Math.ceil(mainw * .025), Math.floor(mainh * .142));
                    }
                }
                else
                {
                    if(depthToRender < 1000)
                    {
                        if(workerLevel < 5)
                        {
                            MAIN.drawImage(foundt, 32 * getAnimationFrameIndex(4, 10), 0, 32, 96, Math.ceil(mainw * (.085 + ((chest.worker - 1) * .072))), yCoordinateOfLevelTop, Math.ceil(mainw * .025), Math.floor(mainh * .142));
                        }
                        else
                        {
                            MAIN.drawImage(window["foundt" + workerLevel], 32 * getAnimationFrameIndex(4, 10), 0, 32, 96, Math.ceil(mainw * (.085 + ((chest.worker - 1) * .072))), yCoordinateOfLevelTop, Math.ceil(mainw * .025), Math.floor(mainh * .142));
                        }
                    }
                    else
                    {
                        MAIN.drawImage(foundmt, 32 * getAnimationFrameIndex(4, 10), 0, 32, 96, Math.ceil(mainw * (.085 + ((chest.worker - 1) * .072))), yCoordinateOfLevelTop, Math.ceil(mainw * .025), Math.floor(mainh * .142));
                    }
                }

                workersToSkip.push(chest.worker);
            }
        }

        var screenLevel = (currentlyViewedDepth - depthToRender);
        var workersToDisplay = workersHiredAtDepth(depthToRender);
        var workerLevel = workersLevelAtDepth(depthToRender);

        for(var m = 1; m <= workersToDisplay; m++)
        {
            if(!workersToSkip.includes(m))
            {
                if(!isCapacityFull())
                {
                    //mining animation
                    var minerSpritesheet;
                    var frameToRender = getAnimationFrameIndex(this.minerFrames, IDLE_FRAMERATE, (m - 1) + depthToRender);
                    if(depthToRender < 1000)
                    {
                        minerSpritesheet = minerImages[workerLevel];
                    }
                    else if(depthToRender <= 1782)
                    {
                        minerSpritesheet = lunarMinerImages[workerLevel];
                    }
                    else if(depthToRender >= getTitan().startDepth)
                    {
                        minerSpritesheet = titanMinerImages[workerLevel];
                    }

                    var spatialArgs = [
                        (this.minerFrameWidth + this.minerFrameSpacing) * frameToRender,
                        0,
                        32,
                        minerSpritesheet.height,
                        Math.ceil(mainw * (.085 + ((m - 1) * .072))),
                        yCoordinateOfLevelTop + Math.floor(mainh * .075),
                        Math.ceil(mainw * .025),
                        Math.floor(mainh * .071)
                    ]

                    if(m == 8 && depthToRender == 1089) //render jeb, c'mon jeb what are you doing...
                    {
                        drawImageRot(MAIN, minerSpritesheet, ...spatialArgs, 180);
                    }
                    else
                    {
                        MAIN.drawImage(minerSpritesheet, ...spatialArgs);
                        if(depthToRender < 1000)
                        {
                            MAIN.drawImage(minerHatImages[workerLevel], ...spatialArgs);
                        }
                    }
                }
                else
                { //no animation, not mining
                    if(depthToRender < 1000)
                    {
                        MAIN.drawImage(minerImages[workerLevel], 0, 0, 32, 48, Math.ceil(mainw * (.085 + ((m - 1) * .072))), yCoordinateOfLevelTop + Math.floor(mainh * .075), Math.ceil(mainw * .025), Math.floor(mainh * .071));
                        MAIN.drawImage(minerHatImages[workerLevel], 0, 0, 32, 48, Math.ceil(mainw * (.085 + ((m - 1) * .072))), yCoordinateOfLevelTop + Math.floor(mainh * .075), Math.ceil(mainw * .025), Math.floor(mainh * .071));
                    }
                    else if(depthToRender <= 1782)
                    {
                        if(m == 8 && depthToRender == 1089) //render jeb, c'mon jeb what are you doing...
                        {
                            drawImageRot(MAIN, lunarMinerImages[workerLevel], 0, 0, 32, 48, Math.ceil(mainw * (.085 + ((m - 1) * .072))), yCoordinateOfLevelTop + Math.floor(mainh * .075), Math.ceil(mainw * .025), Math.floor(mainh * .071), 180);
                        }
                        else
                        {
                            MAIN.drawImage(lunarMinerImages[workerLevel], 0, 0, 32, 48, Math.ceil(mainw * (.085 + ((m - 1) * .072))), yCoordinateOfLevelTop + Math.floor(mainh * .075), Math.ceil(mainw * .025), Math.floor(mainh * .071));
                        }
                    }
                    else if(depthToRender >= getTitan().startDepth)
                    {
                        MAIN.drawImage(titanMinerImages[workerLevel], 0, 0, 32, 48, Math.ceil(mainw * (.085 + ((m - 1) * .072))), yCoordinateOfLevelTop + Math.floor(mainh * .075), Math.ceil(mainw * .025), Math.floor(mainh * .071));
                    }
                }

                if(m == battleWaiting[0] && battleWaiting[1] == depthToRender && depthToRender > 303)
                {
                    //click this guy for battle
                    MAIN.drawImage(Exclamation, 0, 0, 40, 40, Math.ceil(mainw * (.091 + ((m - 1) * .072))), yCoordinateOfLevelTop + Math.floor(mainh * .045), Math.ceil(mainw * .015), Math.floor(mainh * .02));
                }

                if(quality == 1)
                {
                    var typeFound = found[screenLevel][0][(m - 1)];
                    var framesRemainingToShow = found[screenLevel][1][(m - 1)];
                    if(typeFound > -1 && framesRemainingToShow >= 1)
                    {
                        MAIN.globalAlpha = MINERAL_COLLECTED_POPUP_ALPHA_SEQUENCE[framesRemainingToShow];
                        var yOffsetForSequence = MINERAL_COLLECTED_POPUP_OFFSET_SEQUENCE[framesRemainingToShow];
                        MAIN.drawImage(worldResources[typeFound + 1].smallIcon, 0, 0, worldResources[typeFound + 1].smallIcon.width, worldResources[typeFound + 1].smallIcon.height, Math.ceil(mainw * (.085 + ((m - 1) * .072))) + Math.ceil(mainw * .006), yCoordinateOfLevelTop + Math.floor(mainh * .045) + yOffsetForSequence, Math.ceil(mainw * .012), Math.floor(mainh * .021));
                        MAIN.globalAlpha = 1;
                        found[screenLevel][1][(m - 1)]--;
                    }
                }
            }
        }
        workersToSkip = [];

        if(isClickableAtDepth(depthToRender))
        {
            var clicklableAtDepth = getClickableAtDepth(depthToRender);
            var gapToRenderTo = clicklableAtDepth.spawnLocation;
            clicklableAtDepth.renderAssetFunction(mainw * (.109 + ((gapToRenderTo - 1) * .072)), yCoordinateOfLevelTop + Math.floor(mainh * .0575), clicklableAtDepth);
        }
        //renderSpeechBubble(MAIN, "I'm Diggin' this little hole looking for something nice.", mouseX, mouseY);
    }

    renderForegroundLightingForDepth(depthToRender)
    {
        if(depthToRender > 0 && depthTintOverlays.length > depthToRender)
        {
            var xCoordinateOfLevel = Math.ceil(mainw * .082);
            var yCoordinateOfLevelTop = mainh * .111 + ((4 - (currentlyViewedDepth - depthToRender)) * .178 * mainh);

            var levelColor = depthTintOverlays[depthToRender];
            drawRgbColoredRect(MAIN, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .855), (mainh * .178), levelColor.r, levelColor.g, levelColor.b, levelColor.a);
        }
        //MAIN.drawImage(shade, depthToRender * 2, 0, 1, 1, xCoordinateOfLevel, yCoordinateOfLevelTop, Math.floor(mainw * .855), (mainh * .178));
    }

    renderForeground(depthToRender)
    {
        MAIN.save();
        if(currentlyViewedDepth > getTitan().startDepth - 4 && depthToRender > getTitan().startDepth - 3) 
        {
            var yCoordinateOfLevelTop = mainh * .111 + ((4 - (currentlyViewedDepth - depthToRender)) * .178 * mainh);



            if(depthToRender % 4 == 0 && depthToRender % 8 != 0 && depthToRender % 12 != 0)
            {
                MAIN.drawImage(
                    waves2,
                    waves2.width / 4 * getAnimationFrameIndex(4, 10),
                    0,
                    waves2.width / 4,
                    waves2.height,
                    Math.ceil(mainw * .3),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((waves2.width / 4) / mainw)),
                    Math.ceil(mainh * (waves2.height / mainh))
                );

                MAIN.drawImage(
                    bubbles5,
                    bubbles5.width / 4 * getAnimationFrameIndex(4, 10),
                    0,
                    bubbles5.width / 4,
                    bubbles5.height,
                    Math.ceil(mainw * .7),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((bubbles5.width / 4) / mainw)),
                    Math.ceil(mainh * (bubbles5.height / mainh))
                );
            }
            else if(depthToRender % 5 == 0 && depthToRender % 10 != 0)
            {
                MAIN.drawImage(
                    waves1,
                    waves1.width / 4 * getAnimationFrameIndex(4, 10),
                    0,
                    waves1.width / 4,
                    waves1.height,
                    Math.ceil(mainw * .1),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((waves1.width / 4) / mainw)),
                    Math.ceil(mainh * (waves1.height / mainh))
                );

                MAIN.drawImage(
                    bubbles1,
                    bubbles1.width / 4 * getAnimationFrameIndex(4, 10),
                    0,
                    bubbles1.width / 4,
                    bubbles1.height,
                    Math.ceil(mainw * .4),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((bubbles1.width / 4) / mainw)),
                    Math.ceil(mainh * (bubbles1.height / mainh))
                );
            }
            else if(depthToRender % 6 == 0 && depthToRender % 12 != 0)
            {
                MAIN.drawImage(
                    waves2,
                    waves2.width / 4 * (getAnimationFrameIndex(4, 10)),
                    0,
                    waves2.width / 4,
                    waves2.height,
                    Math.ceil(mainw * .7),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((waves2.width / 4) / mainw)),
                    Math.ceil(mainh * (waves2.height / mainh))
                );

                MAIN.drawImage(
                    bubbles1,
                    bubbles1.width / 4 * (getAnimationFrameIndex(4, 10)),
                    0,
                    bubbles1.width / 4,
                    bubbles1.height,
                    Math.ceil(mainw * .2),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((bubbles1.width / 4) / mainw)),
                    Math.ceil(mainh * (bubbles1.height / mainh))
                );

                MAIN.drawImage(
                    bubbles4,
                    bubbles4.width / 4 * (getAnimationFrameIndex(4, 10)),
                    0,
                    bubbles4.width / 4,
                    bubbles4.height,
                    Math.ceil(mainw * .3),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((bubbles4.width / 4) / mainw)),
                    Math.ceil(mainh * (bubbles4.height / mainh))
                );
            }
            else if(depthToRender % 7 == 0 && depthToRender % 14 != 0)
            {
                MAIN.drawImage(
                    waves3,
                    waves3.width / 4 * (getAnimationFrameIndex(4, 10)),
                    0,
                    waves3.width / 4,
                    waves3.height,
                    Math.ceil(mainw * .4),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((waves3.width / 4) / mainw)),
                    Math.ceil(mainh * (waves3.height / mainh))
                );

                MAIN.drawImage(
                    bubbles2,
                    bubbles2.width / 4 * (getAnimationFrameIndex(4, 10)),
                    0,
                    bubbles2.width / 4,
                    bubbles2.height,
                    Math.ceil(mainw * .2),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((bubbles2.width / 4) / mainw)),
                    Math.ceil(mainh * (bubbles2.height / mainh))
                );

            }
            else if(depthToRender % 8 == 0 && depthToRender % 16 != 0)
            {
                MAIN.drawImage(
                    waves4,
                    waves4.width / 4 * (getAnimationFrameIndex(4, 10)),
                    0,
                    waves4.width / 4,
                    waves4.height,
                    Math.ceil(mainw * .6),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((waves4.width / 4) / mainw)),
                    Math.ceil(mainh * (waves4.height / mainh))
                );

                MAIN.drawImage(
                    bubbles1,
                    bubbles1.width / 4 * (getAnimationFrameIndex(4, 10)),
                    0,
                    bubbles1.width / 4,
                    bubbles1.height,
                    Math.ceil(mainw * .8),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((bubbles1.width / 4) / mainw)),
                    Math.ceil(mainh * (bubbles1.height / mainh))
                );

                MAIN.drawImage(
                    bubbles2,
                    bubbles2.width / 4 * (getAnimationFrameIndex(4, 10)),
                    0,
                    bubbles2.width / 4,
                    bubbles2.height,
                    Math.ceil(mainw * .3),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((bubbles2.width / 4) / mainw)),
                    Math.ceil(mainh * (bubbles2.height / mainh))
                );
            }
            else if(depthToRender % 10 == 0)
            {
                MAIN.drawImage(
                    waves3,
                    waves3.width / 4 * (getAnimationFrameIndex(4, 10)),
                    0,
                    waves3.width / 4,
                    waves3.height,
                    Math.ceil(mainw * .2),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((waves3.width / 4) / mainw)),
                    Math.ceil(mainh * (waves3.height / mainh))
                );

                MAIN.drawImage(
                    bubbles4,
                    bubbles4.width / 4 * (getAnimationFrameIndex(4, 10)),
                    0,
                    bubbles4.width / 4,
                    bubbles4.height,
                    Math.ceil(mainw * .85),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((bubbles4.width / 4) / mainw)),
                    Math.ceil(mainh * (bubbles4.height / mainh))
                );
            }
            else if(depthToRender % 12 == 0)
            {
                MAIN.drawImage(
                    bubbles1,
                    bubbles1.width / 4 * (getAnimationFrameIndex(4, 10)),
                    0,
                    bubbles1.width / 4,
                    bubbles1.height,
                    Math.ceil(mainw * .2),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((bubbles1.width / 4) / mainw)),
                    Math.ceil(mainh * (bubbles1.height / mainh))
                );

                MAIN.drawImage(
                    bubbles2,
                    bubbles2.width / 4 * (getAnimationFrameIndex(4, 10)),
                    0,
                    bubbles2.width / 4,
                    bubbles2.height,
                    Math.ceil(mainw * .8),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((bubbles2.width / 4) / mainw)),
                    Math.ceil(mainh * (bubbles2.height / mainh))
                );
            }
            else if(depthToRender % 13 == 0 && depthToRender % 6 != 0)
            {
                MAIN.drawImage(
                    waves3,
                    waves3.width / 4 * (getAnimationFrameIndex(4, 10)),
                    0,
                    waves3.width / 4,
                    waves3.height,
                    Math.ceil(mainw * .4),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((waves3.width / 4) / mainw)),
                    Math.ceil(mainh * (waves3.height / mainh))
                );
            }
            else if(depthToRender % 14 == 0)
            {
                MAIN.drawImage(
                    waves4,
                    waves4.width / 4 * (getAnimationFrameIndex(4, 10)),
                    0,
                    waves4.width / 4,
                    waves4.height,
                    Math.ceil(mainw * .4),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((waves4.width / 4) / mainw)),
                    Math.ceil(mainh * (waves4.height / mainh))
                );
            }
            else if(depthToRender % 16 == 0)
            {
                MAIN.drawImage(
                    waves1,
                    waves1.width / 4 * (getAnimationFrameIndex(4, 10)),
                    0,
                    waves1.width / 4,
                    waves1.height,
                    Math.ceil(mainw * .6),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((waves1.width / 4) / mainw)),
                    Math.ceil(mainh * (waves1.height / mainh))
                );

                MAIN.drawImage(
                    bubbles5,
                    bubbles5.width / 4 * (getAnimationFrameIndex(4, 10)),
                    0,
                    bubbles5.width / 4,
                    bubbles5.height,
                    Math.ceil(mainw * .6),
                    Math.floor(yCoordinateOfLevelTop),
                    Math.ceil(mainw * ((bubbles5.width / 4) / mainw)),
                    Math.ceil(mainh * (bubbles5.height / mainh))
                );
            }
        }
        MAIN.restore();
    }


    renderBackground()
    {
        if(currentlyViewedDepth < 1005)
        {
            MAIN.drawImage(drilldiv2, 0, 0, 167, 600, Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.ceil(mainw * 0.723), mainh); //level bg (maybe add gradient later)

            if(currentlyViewedDepth == depth)
            {
                MAIN.drawImage(drilldiv, 0, 0, 167, 600, Math.ceil(mainw * .805), Math.ceil(mainh * .111), Math.ceil(mainw * .131), Math.floor(mainh * .89));
            }
            else
            {
                MAIN.clearRect(Math.ceil(mainw * .805), Math.ceil(mainh * .111), Math.ceil(mainw * .131), Math.floor(mainh * .89));
                MAIN.drawImage(drilldiv2, 0, 0, 167, 600, Math.ceil(mainw * .805), Math.ceil(mainh * .111), Math.ceil(mainw * .131), Math.floor(mainh * .89));
            }
        }
        else
        {
            MAIN.drawImage(lunardrilldiv2, 0, 0, 167, 600, Math.ceil(mainw * .082), Math.ceil(mainh * .111), Math.ceil(mainw * 0.723), mainh); //level bg (maybe add gradient later)

            if(currentlyViewedDepth == depth)
            {
                MAIN.drawImage(lunardrilldiv, 0, 0, 167, 600, Math.ceil(mainw * .805), Math.ceil(mainh * .111), Math.ceil(mainw * .131), Math.floor(mainh * .89));
            }
            else
            {
                MAIN.clearRect(Math.ceil(mainw * .805), Math.ceil(mainh * .111), Math.ceil(mainw * .131), Math.floor(mainh * .89));
                MAIN.drawImage(lunardrilldiv2, 0, 0, 167, 600, Math.ceil(mainw * .805), Math.ceil(mainh * .111), Math.ceil(mainw * .131), Math.floor(mainh * .89));
            }
        }
    }

    render()
    {
        this.renderBackground();
        this.renderTopCity();
        this.renderTradingPost();
        this.renderCore();
        this.renderUndergroundCity();
        this.renderEndOfWorld();
        this.renderMoonbase();
        this.renderTitanbase();
        this.renderReactor();
        this.renderBuffLab();
        this.renderSuperMinerBuilding();

        for(var i = currentlyViewedDepth - 4; i <= currentlyViewedDepth; i++)
        {
            this.renderSingleLevelOfDepth(i);
        }

        this.renderDrill();

        for(var i = currentlyViewedDepth - 4; i <= currentlyViewedDepth; i++)
        {
            this.renderForegroundLightingForDepth(i);
        }
        this.renderCaveBuilding();

        this.updateWorldEntityHitboxLocations();


        for(var i = currentlyViewedDepth - 4; i <= currentlyViewedDepth; i++)
        {
            this.renderForeground(i);
        }

        superMinerManager.render();
    }

    updateWorldEntityHitboxLocations()
    {
        if(this.previouslyViewedDepth != currentlyViewedDepth)
        {
            this.previouslyViewedDepth = currentlyViewedDepth;

            this.hitboxYOffset = (-1 * (currentlyViewedDepth * .178 * mainh)) / uiScaleY;
        }
    }
}