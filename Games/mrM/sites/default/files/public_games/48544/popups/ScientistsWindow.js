class ScientistsWindow extends TabbedPopupWindow
{
    layerName = "Arch"; // Used as key in activeLayers
    domElementId = "ARCHD"; // ID of dom element that gets shown or hidden
    context = ARCH;         // Canvas rendering context for popup

    scientistsPane;
    relicsPane;

    buttonHitboxes;

    constructor(boundingBox)
    {
        super(boundingBox); // Need to call base class constructor
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        var tabCategories = {
            0: _("Scientist 1"),
            1: _("Scientist 2"),
            2: _("Scientist 3"),
            3: _("Relics")
        }

        this.initializeTabs(Object.values(tabCategories));
        this.backgroundImage = scientistbg;

        this.scientistsPane = new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.boundingBox.width,
                height: this.boundingBox.height
            },
            {},
            "",
            "scientistPane"
        );
        this.scientistsPane.allowBubbling = true;
        this.addHitbox(this.scientistsPane);

        this.relicsPane = new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.boundingBox.width,
                height: this.boundingBox.height
            },
            {},
            "",
            "relicsPane"
        );
        this.relicsPane.allowBubbling = true;
        this.addHitbox(this.relicsPane);

        this.onTabChange();
    }

    onTabChange()
    {
        if(this.currentTabIndex < 3)
        {
            this.relicsPane.setVisible(false)
            this.relicsPane.setEnabled(false)
            this.scientistsPane.setVisible(true)
            this.scientistsPane.setEnabled(true)

            this.initializeScientistHitboxes();
        }
        else
        {
            this.relicsPane.setVisible(true)
            this.relicsPane.setEnabled(true)
            this.scientistsPane.setVisible(false)
            this.scientistsPane.setEnabled(false)

            this.initializeRelicsHitboxes();
        }
    }

    initializeScientistHitboxes()
    {
        var scientistIndex = this.currentTabIndex;
        var activeScientist = activeScientists[scientistIndex];
        this.scientistsPane.clearHitboxes();

        if(activeScientist.length == 0)
        {
            //No hitboxes
            return;
        }
        else
        {
            var buryAndCollectButton = new Hitbox(
                {
                    x: this.boundingBox.width * .4,
                    y: this.boundingBox.height * .79,
                    width: this.boundingBox.width * .20,
                    height: this.boundingBox.height * .05
                },
                {
                    onmousedown: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(isOnActiveExcavation(scientistIndex))
                        {
                            if(isScientistDead(scientistIndex))
                            {
                                onClickBuryScientist(scientistIndex);
                            }
                            else if(isExcavationDone(scientistIndex))
                            {
                                onClickClaimExcavationReward(scientistIndex);
                            }
                        }
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    },
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(isOnActiveExcavation(scientistIndex))
                        {
                            if(isScientistDead(scientistIndex) || isExcavationDone(scientistIndex))
                            {
                                this.cursor = 'pointer';
                            }
                        }
                    }
                },
                "default",
                "buryAndCollectButton"
            );
            this.scientistsPane.addHitbox(buryAndCollectButton);

            var forfeitButton = new Hitbox(
                {
                    x: this.boundingBox.width * .4,
                    y: this.boundingBox.height * .86,
                    width: this.boundingBox.width * .20,
                    height: this.boundingBox.height * .05
                },
                {
                    onmousedown: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(isOnActiveExcavation(scientistIndex))
                        {
                            if(isExcavationDone(scientistIndex) && !isScientistDead(scientistIndex))
                            {
                                confirmForfeitExcavation(scientistIndex);
                            }
                            else if(isScientistDead(scientistIndex))
                            {
                                onClickResurrect(scientistIndex);
                            }
                        }
                        else
                        {
                            confirmRerollExcavations(scientistIndex);
                        }
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    },
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(isOnActiveExcavation(scientistIndex))
                        {
                            if(isExcavationDone(scientistIndex) && !isScientistDead(scientistIndex))
                            {
                                showTooltip(_("Forfeit Reward"), _("Forfeit your reward if you cannot claim it or do not want to claim it."));
                                this.cursor = 'pointer';
                            }
                            else if(isScientistDead(scientistIndex))
                            {
                                showTooltip(_("Rescue Scientist"), _("Rescue {0} for {1} tickets", scientists[activeScientists[scientistIndex][0]].name, getCostToResurrect(scientistIndex)));
                                this.cursor = 'pointer';
                            }
                        }
                        else
                        {
                            showTooltip(_("Refresh Excavations"), _("Pay 1 ticket to get two new excavation options"));
                            this.cursor = 'pointer';
                        }
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "default",
                "forfeitButton"
            );
            this.scientistsPane.addHitbox(forfeitButton);

            var leftStartButton = new Hitbox(
                {
                    x: this.boundingBox.width * .15,
                    y: this.boundingBox.height * .78,
                    width: this.boundingBox.width * .20,
                    height: this.boundingBox.height * .05
                },
                {
                    onmousedown: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(!isOnActiveExcavation(scientistIndex) && !isScientistDead(scientistIndex))
                        {
                            startExcavation(scientistIndex, 0);
                        }
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    },
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(!isOnActiveExcavation(scientistIndex) && !isScientistDead(scientistIndex))
                        {
                            this.cursor = 'pointer';
                        }
                    }
                },
                "default",
                "leftStartButton"
            );
            this.scientistsPane.addHitbox(leftStartButton);

            var rightStartButton = new Hitbox(
                {
                    x: this.boundingBox.width * .65,
                    y: this.boundingBox.height * .78,
                    width: this.boundingBox.width * .20,
                    height: this.boundingBox.height * .05
                },
                {
                    onmousedown: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(!isOnActiveExcavation(scientistIndex))
                        {
                            startExcavation(scientistIndex, 1);
                        }
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    },
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(!isOnActiveExcavation(scientistIndex))
                        {
                            this.cursor = 'pointer';
                        }
                    }
                },
                "default",
                "rightStartButton"
            );
            this.scientistsPane.addHitbox(rightStartButton);

            var rewardOption1Icon = new Hitbox(
                {
                    x: this.boundingBox.width * .2125,
                    y: this.boundingBox.height * .6,
                    width: this.boundingBox.width * .075,
                    height: this.boundingBox.height * .1125
                },
                {
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(firstOpenScientistSlot() > scientistIndex && !isOnActiveExcavation(scientistIndex))
                        {
                            if(!isOnActiveExcavation(scientistIndex))
                            {
                                var rewardInfo = getExcavationChoiceRewardValues(scientistIndex, 0);
                                showTooltip(rewardInfo.name, rewardInfo.description);
                                this.cursor = 'pointer';
                            }
                        }
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "default",
                "rewardOption1Icon"
            );
            this.scientistsPane.addHitbox(rewardOption1Icon);

            var rewardOption2Icon = new Hitbox(
                {
                    x: this.boundingBox.width * .7125,
                    y: this.boundingBox.height * .6,
                    width: this.boundingBox.width * .075,
                    height: this.boundingBox.height * .1125
                },
                {
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(firstOpenScientistSlot() > scientistIndex && !isOnActiveExcavation(scientistIndex))
                        {
                            if(!isOnActiveExcavation(scientistIndex))
                            {
                                var rewardInfo = getExcavationChoiceRewardValues(scientistIndex, 1);
                                showTooltip(rewardInfo.name, rewardInfo.description);
                                this.cursor = 'pointer';
                            }
                        }
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "default",
                "rewardOption2Icon"
            );
            this.scientistsPane.addHitbox(rewardOption2Icon);
            this.scientistsPane.addHitbox(rewardOption1Icon);

            var rewardActive = new Hitbox(
                {
                    x: this.boundingBox.width * .45,
                    y: this.boundingBox.height * .46,
                    width: this.boundingBox.width * .1,
                    height: this.boundingBox.height * .15
                },
                {
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(firstOpenScientistSlot() > scientistIndex && isOnActiveExcavation(scientistIndex))
                        {
                            if(isOnActiveExcavation(scientistIndex))
                            {
                                var rewardInfo = getActiveExcavationRewardValues(scientistIndex);
                                showTooltip(rewardInfo.name, rewardInfo.description);
                                this.cursor = 'pointer';
                            }
                        }
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "default",
                "rewardActive"
            );
            this.scientistsPane.addHitbox(rewardActive);
        }
    }

    initializeRelicsHitboxes()
    {
        this.scientistsPane.clearHitboxes();

        var cellWidth = .14;
        var cellHeight = .21;
        var cellsPerRow = 5;
        var xOffset = .15 * this.boundingBox.width;
        var yOffset = .16 * this.boundingBox.height;
        for(var i = 0; i < absoluteMaxRelicSlots; i++)
        {
            var x = (cellWidth * this.boundingBox.width * (i % cellsPerRow)) + xOffset;
            var y = (cellHeight * this.boundingBox.height * Math.floor(i / cellsPerRow)) + yOffset;

            this.context.strokeRect(x, y, this.boundingBox.width * cellWidth, this.boundingBox.height * cellHeight);

            var relicHitbox = new Hitbox(
                {
                    x: x,
                    y: y,
                    width: this.boundingBox.width * cellWidth,
                    height: this.boundingBox.height * cellHeight
                },
                {
                    onmouseenter: function ()
                    {
                        var relicIndex = parseInt(this.id.split("_")[1]);
                        if(equippedRelics[relicIndex] > -1)
                        {
                            this.cursor = 'pointer';
                            showTooltipForRelic(relicIndex);
                        }
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    },
                    onmousedown: function ()
                    {
                        var relicIndex = parseInt(this.id.split("_")[1]);
                        if(equippedRelics[relicIndex] > -1)
                        {
                            if(relicEditMode == 1)
                            {
                                showConfirmationPrompt(
                                    _("Are you sure you want to delete this relic?"),
                                    _("Yes"),
                                    function ()
                                    {
                                        deleteEquippedRelic(relicIndex);
                                        hideSimpleInput();
                                    },
                                    _("No")
                                );
                                relicEditMode = 0;
                            }
                        }
                    }
                },
                "default",
                "relicHitbox_" + i
            );
            this.relicsPane.addHitbox(relicHitbox);
        }

        var relicTrashHitbox = new Hitbox(
            {
                x: this.boundingBox.width * .45,
                y: this.boundingBox.height * .8,
                width: this.boundingBox.width * .1,
                height: this.boundingBox.height * .12
            },
            {
                onmouseenter: function ()
                {
                    this.cursor = 'pointer';
                    if(relicEditMode == 0)
                    {
                        showTooltip(_("Trash"), _("Currently not set to delete, click this to toggle relic deletion mode."));
                    }
                    else
                    {
                        showTooltip(_("Trash"), _("Currently set to delete, click this to turn off relic deletion mode."));
                    }
                },
                onmouseexit: function ()
                {
                    hideTooltip();
                },
                onmousedown: function ()
                {
                    if(relicEditMode == 1)
                    {
                        relicEditMode = 0;
                    }
                    else
                    {
                        relicEditMode = 1;
                    }
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                }
            },
            "default",
            "relicTrashHitbox"
        );
        this.relicsPane.addHitbox(relicTrashHitbox);
    }

    getRarityColor(rarity)
    {
        if(rarity == _("Common")) return "#38b53a";
        else if(rarity == _("Uncommon")) return "#008dd9";
        else if(rarity == _("Rare")) return "#9c2828";
        else if(rarity == _("Legendary")) return "#ebab34";
        else if(rarity == _("Warped")) return (quality == 1) ? "#000000" : "#ffffff";
        else if(rarity == _("Warped+")) return (quality == 1) ? "#000000" : "#ffffff";
        else if(rarity == _("Warped++")) return (quality == 1) ? "#000000" : "#ffffff";
    }

    getDifficultyColor(difficulty)
    {
        if(difficulty == _("Easy")) return "#46eb49";
        else if(difficulty == _("Medium")) return "#ecf759";
        else if(difficulty == _("Hard")) return "#fc8608";
        else if(difficulty == _("Nightmare")) return "#d1000a";
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.context.restore();
        super.render(); // Render any child layers

        //Scientists tab
        if(this.currentTabIndex < 3)
        {
            this.context.drawImage(darkdot, 0, 0, darkdot.width, darkdot.height, this.bodyContainer.boundingBox.x, this.bodyContainer.boundingBox.y, this.bodyContainer.boundingBox.width, this.bodyContainer.boundingBox.height);

            var scientistIndex = this.currentTabIndex;
            var activeScientist = activeScientists[scientistIndex];
            if(activeScientist.length == 0)
            {
                var titleText = _("You do not have {0} scientists, you need to unlock more.", (scientistIndex + 1));
                this.context.fillText(titleText, this.boundingBox.width * .5 - this.context.measureText(titleText).width / 2, this.boundingBox.height * .25);
                if(language == "english")
                {
                    var howToGetText = _("Find more scientists from chests.");
                    this.context.fillText(howToGetText, this.boundingBox.width * .5 - this.context.measureText(howToGetText).width / 2, this.boundingBox.height * .30);
                }
            }
            else
            {
                var staticScientist = scientists[activeScientist[0]];
                var imageId = getScientistImage(activeScientist[0]);

                this.context.drawImage(characterInfoFrame, 0, 0, characterInfoFrame.width, characterInfoFrame.height, this.boundingBox.width * .25, this.boundingBox.height * .135, this.boundingBox.width * .50, this.boundingBox.height * .26);

                this.context.fillStyle = "#211A14"
                this.context.fillRect(this.boundingBox.width * .30, this.boundingBox.height * .16, this.boundingBox.width * .12, this.boundingBox.height * .20);
                if(!staticScientist.isNormal && quality == 1)
                {
                    var noiseImages = [noise1, noise2, noise3, noise4, noise5, noise6];
                    var selectedNoise = noiseImages[rand(0, noiseImages.length - 1)];
                    this.context.globalAlpha = 0.2 + (0.15 * Math.random());
                    this.context.drawImage(selectedNoise, 0, 0, selectedNoise.width, selectedNoise.height, this.boundingBox.width * .30, this.boundingBox.height * .16, this.boundingBox.width * .12, this.boundingBox.height * .20);
                    this.context.globalAlpha = 1;
                }

                if(!isScientistDead(scientistIndex))
                {
                    this.context.drawImage(imageId, 0, 0, imageId.width, imageId.height, this.boundingBox.width * .30, this.boundingBox.height * .16, this.boundingBox.width * .12, this.boundingBox.height * .20);
                }

                var nameText = staticScientist.name;
                this.context.fillStyle = "#FFFFFF"
                this.context.font = "20px Verdana";

                this.context.fillText(nameText, this.boundingBox.width * .45, this.boundingBox.height * .215);
                this.context.fillRect(this.boundingBox.width * .45, (this.boundingBox.height * .215) + 3, this.context.measureText(nameText).width, 1);
                this.context.font = "16px Verdana";
                var titleText1 = _("Lvl") + " " + getScientistLevel(scientistIndex) + " (" + Math.floor(getScientistPercentToNextLevel(scientistIndex) * 100) + "%)";
                this.context.fillText(titleText1, this.boundingBox.width * .46, this.boundingBox.height * .28);

                this.context.fillStyle = this.getRarityColor(staticScientist.rarity);
                this.context.save();
                if(staticScientist.rarity == _("Legendary") && quality == 1)
                {
                    var shadowAlpha = 0.5 + oscillate(currentTime(), 500) * 0.5;
                    this.context.shadowColor = 'rgba(255, 255, 0, ' + shadowAlpha + ')';
                    this.context.shadowOffsetX = 0;
                    this.context.shadowOffsetY = 0;
                    this.context.shadowBlur = 1 + oscillate(currentTime(), 500) * 2;
                }
                else if(staticScientist.rarity.includes(_("Warped")) && quality == 1)
                {
                    var shadowAlpha = 0.6 + (0.4 + oscillate(currentTime(), 79));
                    this.context.shadowColor = 'rgba(255, 255, 255, ' + shadowAlpha + ')';
                    this.context.shadowOffsetX = oscillate(currentTime(), 499) * 2;
                    this.context.shadowOffsetY = oscillate(currentTime(), 331) * 2;
                    this.context.shadowBlur = 1.5 + oscillate(currentTime(), oscillate(currentTime(), 211)) * 1.5;
                }
                var titleText2 = _("Rarity: {0}", staticScientist.rarity);
                fillTextShrinkToFit(this.context, titleText2, this.boundingBox.width * .46, this.boundingBox.height * .33, this.boundingBox.width * .25);
                this.context.restore();
                this.context.fillStyle = "#FFFFFF";
                this.context.font = "14px Verdana";

                if(isOnActiveExcavation(scientistIndex))
                {
                    var activeExcavation = activeExcavations[scientistIndex];
                    var staticExcavation = excavations[activeExcavation[5]];
                    var difficultyText = staticExcavation.difficulty;
                    this.context.fillStyle = this.getDifficultyColor(difficultyText);
                    this.context.font = "bold 14px Verdana";
                    var excavationText = getActiveExcavationText(scientistIndex);
                    this.context.fillText(excavationText, this.boundingBox.width * .5 - this.context.measureText(excavationText).width / 2, this.boundingBox.height * .435);
                    this.context.fillStyle = "#FFFFFF";
                    this.context.font = "14px Verdana";

                    var excavationRewardValues = getActiveExcavationRewardValues(scientistIndex);

                    this.context.save();
                    this.context.fillStyle = "rgba(255, 255, 255, 0.1)";
                    this.context.fillRect(this.boundingBox.width * .45, this.boundingBox.height * .46, this.boundingBox.width * .1, this.boundingBox.height * .15);
                    this.context.restore();

                    if(excavationRewardValues.id > -1)
                    {
                        excavationRewards[excavationRewardValues.id].renderFunction(this.context, excavationRewardValues.id, this.boundingBox.width * .45, this.boundingBox.height * .46, this.boundingBox.width * .1, this.boundingBox.height * .15);
                    }
                    else
                    {
                        this.context.drawImage(darkdot, 0, 0, darkdot.width, darkdot.height, this.boundingBox.width * .45, this.boundingBox.height * .46, this.boundingBox.width * .1, this.boundingBox.height * .15);
                    }

                    var rewardText = excavationRewardValues.name;
                    this.context.fillText(rewardText, this.boundingBox.width * .5 - this.context.measureText(rewardText).width / 2, this.boundingBox.height * .66);

                    var percentComplete = excavationPercentComplete(scientistIndex);
                    var remainingTime = excavationTimeRemainingSeconds(scientistIndex);

                    if(isScientistDead(scientistIndex))
                    {
                        var deathReason = getDeathReason(scientistIndex);
                        renderProgressBar(this.context, deathReason, darkdot, darkdot, this.boundingBox.width * .2, this.boundingBox.height * .70, this.boundingBox.width * .6, this.boundingBox.height * .08, "#CC3333", percentComplete);
                        renderButton(this.context, craftb, _("ABANDON"), this.boundingBox.width * .4, this.boundingBox.height * .79, this.boundingBox.width * .20, this.boundingBox.height * .05, "14px Verdana", "#000000");
                        renderButton(this.context, craftb, _("RESCUE"), this.boundingBox.width * .4, this.boundingBox.height * .86, this.boundingBox.width * .20, this.boundingBox.height * .05, "14px Verdana", "#000000");
                    }
                    else if(isExcavationDone(scientistIndex))
                    {
                        renderProgressBar(this.context, _("Excavation Complete"), darkdot, darkdot, this.boundingBox.width * .2, this.boundingBox.height * .69, this.boundingBox.width * .6, this.boundingBox.height * .08, "#22CC22", 1);
                        renderButton(this.context, craftb, _("COLLECT"), this.boundingBox.width * .4, this.boundingBox.height * .79, this.boundingBox.width * .20, this.boundingBox.height * .05, "14px Verdana", "#000000");
                        renderButton(this.context, craftb, _("FORFEIT"), this.boundingBox.width * .4, this.boundingBox.height * .86, this.boundingBox.width * .20, this.boundingBox.height * .05, "14px Verdana", "#000000");
                    }
                    else
                    {
                        renderProgressBar(this.context, _("Time Remaining: {0}", formattedCountDown(remainingTime)), greydot, darkdot, this.boundingBox.width * .2, this.boundingBox.height * .70, this.boundingBox.width * .6, this.boundingBox.height * .08, "#FFFFFF", percentComplete);
                    }
                }
                else
                {
                    for(var i = 0; i < 2; i++)
                    {
                        var excavationChoice = excavationChoices[scientistIndex][i];
                        var excavationStaticData = excavations[excavationChoice[0]];
                        var excavationName = excavationStaticData.names[excavationChoice[5]];
                        var deathChance = Math.max(0, Math.round(excavationChoice[2] * staticScientist.deathChanceMultiple * STAT.increasedExcavationSuccessRatePercent()));
                        var difficultyText = excavationStaticData.difficulty;
                        var isRewardShown = excavationChoice[3];
                        var rewardId = excavationChoice[4];
                        var excavationDurationMinutes = excavationChoice[1];
                        var rewardStaticData = excavationRewards[rewardId];
                        var rewardImagecurrentlyViewedDepth = rewardStaticData.image;
                        var rewardImageRenderFunction = rewardStaticData.renderFunction;
                        var rewardName = rewardStaticData.name;
                        var rewardDescription = rewardStaticData.description;
                        var offset = i * this.boundingBox.width * .50;

                        //render the choice
                        this.context.font = "bold 14px Verdana";
                        this.context.fillStyle = this.getDifficultyColor(difficultyText);
                        this.context.fillText(excavationName, offset + this.boundingBox.width * .25 - this.context.measureText(excavationName).width / 2, this.boundingBox.height * .47);
                        this.context.font = "14px Verdana";
                        this.context.fillStyle = "#FFFFFF";
                        this.context.fillText(_("Abandon Chance: {0}", deathChance + "%"), offset + this.boundingBox.width * .25 - this.context.measureText(_("Abandon Chance: {0}", deathChance + "%")).width / 2, this.boundingBox.height * .52);
                        var durationText = _("Duration") + ": " + formattedCountDown(excavationDurationMinutes * 60);
                        this.context.fillText(durationText, offset + this.boundingBox.width * .25 - this.context.measureText(durationText).width / 2, this.boundingBox.height * .57);
                        if(isRewardShown)
                        {
                            this.context.save();
                            this.context.fillStyle = "rgba(255, 255, 255, 0.1)";
                            this.context.fillRect(offset + this.boundingBox.width * .2125, this.boundingBox.height * .6, this.boundingBox.width * .075, this.boundingBox.height * .1125);
                            this.context.restore();

                            rewardImageRenderFunction(this.context, rewardId, offset + this.boundingBox.width * .2125, this.boundingBox.height * .6, this.boundingBox.width * .075, this.boundingBox.height * .1125);

                            var tempFont = this.context.font;
                            this.context.font = "14px Verdana";
                            if(language == "german") this.context.font = "11px Verdana";
                            var rewardText = _("Reward") + ": " + rewardName;
                            if(language == "german") rewardText = rewardName;
                            this.context.fillText(rewardText, offset + this.boundingBox.width * .25 - this.context.measureText(rewardText).width / 2, this.boundingBox.height * .76);
                            this.context.font = tempFont;
                        }
                        else
                        {
                            this.context.save();
                            this.context.fillStyle = "rgba(255, 255, 255, 0.1)";
                            this.context.fillRect(offset + this.boundingBox.width * .2125, this.boundingBox.height * .6, this.boundingBox.width * .075, this.boundingBox.height * .1125);
                            this.context.restore();

                            this.context.fillText("???", offset + this.boundingBox.width * .2125 + (this.boundingBox.width * .075 / 2) - this.context.measureText("???").width / 2, this.boundingBox.height * .6 + this.boundingBox.height * .1125 / 2);
                            var tempFont = this.context.font;
                            this.context.font = "14px Verdana";
                            var rewardText = _("Reward") + ": ???";
                            this.context.fillText(rewardText, offset + this.boundingBox.width * .25 - this.context.measureText(rewardText).width / 2, this.boundingBox.height * .76);
                            this.context.font = tempFont;
                        }

                        renderButton(this.context, craftb, _("START"), offset + this.boundingBox.width * .15, this.boundingBox.height * .78, this.boundingBox.width * .20, this.boundingBox.height * .05, "14px Verdana", "#000000");
                        renderButton(this.context, craftb, _("REFRESH"), this.boundingBox.width * .4, this.boundingBox.height * .86, this.boundingBox.width * .20, this.boundingBox.height * .05, "14px Verdana", "#000000");
                    }
                }
            }
        }
        else
        {
            var cellWidth = .14;
            var cellHeight = .21;
            var cellsPerRow = 5;
            var xOffset = .15 * this.boundingBox.width;
            var yOffset = .16 * this.boundingBox.height;
            for(var i = 0; i < maxRelicSlots; i++)
            {
                var x = (cellWidth * this.boundingBox.width * (i % cellsPerRow)) + xOffset;
                var y = (cellHeight * this.boundingBox.height * Math.floor(i / cellsPerRow)) + yOffset;
                var rewardId = equippedRelics[i];
                this.context.strokeStyle = "rgba(255, 255, 255, 1)";
                this.context.strokeRect(x, y, this.boundingBox.width * cellWidth, this.boundingBox.height * cellHeight);
                if(rewardId == -1)
                {
                    this.context.save();
                    this.context.fillStyle = "rgba(255, 255, 255, 0.3)";
                    this.context.fillRect(x, y, this.boundingBox.width * cellWidth, this.boundingBox.height * cellHeight);
                    this.context.restore();
                }
                else
                {
                    var relicImage = excavationRewards[rewardId].image;
                    this.context.save();
                    this.context.fillStyle = "rgba(255, 255, 255, 0.3)";
                    this.context.fillRect(x, y, this.boundingBox.width * cellWidth, this.boundingBox.height * cellHeight);
                    this.context.restore();

                    excavationRewards[rewardId].renderFunction(this.context, rewardId, x, y, this.boundingBox.width * cellWidth, this.boundingBox.height * cellHeight);
                }
            }

            if(relicEditMode == 0)
            {
                this.context.drawImage(trashb, 0, 0, 20, 20, this.boundingBox.width * .45, this.boundingBox.height * .8, this.boundingBox.width * .1, this.boundingBox.height * .12);
            }
            else
            {
                this.context.drawImage(trashb2, 0, 0, 20, 20, this.boundingBox.width * .45, this.boundingBox.height * .8, this.boundingBox.width * .1, this.boundingBox.height * .12);
            }
        }
    }
}
