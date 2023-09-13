class HireWindow extends TabbedPopupWindow
{
    layerName = "Hire"; // Used as key in activeLayers
    domElementId = "HIRED"; // ID of dom element that gets shown or hidden
    context = HR;         // Canvas rendering context for popup

    worldIndex;
    resourcePane;
    hireResults = {};

    constructor(boundingBox, worldIndex)
    {
        super(boundingBox);
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        this.setFrameImagesByWorldIndex(worldIndex);

        this.worldIndex = worldIndex;

        var categories = {
            0: "Hire",
            1: "Upgrades"
        }

        if(typeof (upgradeTabEnabled) !== 'undefined')
        {
            this.initializeTabs(Object.values(categories));
        }
        else
        {
            this.initializeTabs(Object.values({}));
        }

        this.hirePane = new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.boundingBox.width,
                height: this.boundingBox.height
            },
            {},
            "",
            "hirePane"
        );
        this.hirePane.allowBubbling = true;
        this.addHitbox(this.hirePane);

        this.upgradePane = new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.boundingBox.width,
                height: this.boundingBox.height
            },
            {},
            "",
            "upgradePane"
        );
        this.upgradePane.allowBubbling = true;
        this.addHitbox(this.upgradePane);

        this.onTabChange();

    }

    onTabChange()
    {
        if(this.currentTabIndex == 0)
        {
            this.upgradePane.setVisible(false)
            this.upgradePane.setEnabled(false)
            this.hirePane.setVisible(true)
            this.hirePane.setEnabled(true)

            this.initializeHireHitboxes();
        }
        else if(this.currentTabIndex == 1)
        {
            this.upgradePane.setVisible(true)
            this.upgradePane.setEnabled(true)
            this.hirePane.setVisible(false)
            this.hirePane.setEnabled(false)

            this.initializeUpgradeHitboxes();
        }
    }


    initializeUpgradeHitboxes()
    {
        this.upgradePane.clearHitboxes();

        var buttonPadding = .0075;
        var mineralIds = this.getWorld().mineralIdsToSell;
        for(var i = 0; i < mineralIds.length; i++)
        {
            var height = this.boundingBox.height * (.05 + buttonPadding) * (i + 2.5);

            if(mineralIds[i] <= highestOreUnlocked)
            {
                this.upgradePane.addHitbox(new Hitbox(
                    {
                        x: this.boundingBox.width * .045,
                        y: height,
                        width: this.boundingBox.width * .20,
                        height: this.boundingBox.height * .05
                    },
                    {
                        onmousedown: this.levelUpButtonClick(i)
                    },
                    'pointer',
                    "levelUpButton_" + i
                ))
            }
        }
    }

    initializeHireHitboxes()
    {
        this.hirePane.clearHitboxes();

        if(this.getWorld().workersHired < 10)
        {
            this.hirePane.addHitbox(new Hitbox(
                {
                    x: this.boundingBox.width * 0.35,     // Copied from renderButton call below
                    y: this.boundingBox.height * 0.14,
                    width: this.boundingBox.width * 0.28,
                    height: this.boundingBox.height * 0.28
                },
                {
                    onmousedown: function ()
                    {
                        hireMiner(this.parent.parent.worldIndex);
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    },
                    onmouseenter: function ()
                    {
                        if(getEarth().workersHired == 0)
                        {
                            showTooltip(_("Hire your first miner"), _("Miners will work hard to find minerals you don't need to."), "57%", "29%");
                        }
                        else if(getEarth().workersHired == 1)
                        {
                            showTooltip(_("Hire your second miner"), _("Miners will work hard to find minerals you don't need to."), "57%", "29%");
                        }
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                'pointer',
                "hireButton"
            ));
        }
        // Upgrade Buttons
        for(var u = 1; u < 11; u++)
        {
            if(u < 6)
            {
                this.hirePane.addHitbox(new Hitbox(
                    {
                        x: this.boundingBox.width * 0.125,     // Copied from renderButton call below
                        y: this.boundingBox.height * (.48 + (.08 * (u - 1))),
                        width: this.boundingBox.width * 0.3,
                        height: this.boundingBox.height * 0.07
                    },
                    {
                        onmousedown: function ()
                        {
                            console.log(this.parent.parent);
                            upgradeMiners(this.parent.parent.worldIndex);
                            if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                        }
                    },
                    'pointer',
                    "upgradeButton_" + u
                ));
            }
            else 
            {
                this.hirePane.addHitbox(new Hitbox(
                    {
                        x: this.boundingBox.width * 0.55,     // Copied from renderButton call below
                        y: this.boundingBox.height * (.48 + (.08 * (u - 6))),
                        width: this.boundingBox.width * 0.3,
                        height: this.boundingBox.height * 0.07
                    },
                    {
                        onmousedown: function ()
                        {
                            console.log(this.parent.parent);
                            upgradeMiners(this.parent.parent.worldIndex);
                            if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                        }
                    },
                    'pointer',
                    "upgradeButton_" + u
                ));
            }
        }
    }

    getWorld()
    {
        return worlds[this.worldIndex];
    }

    getResources()
    {
        return this.getWorld().mineralIdsToSell;
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.context.restore();
        super.render(); // Render any child layers

        this.context.fillStyle = "#FFFFFF";
        var fontToUse = "14px Verdana";
        this.context.font = fontToUse;

        if(this.currentTabIndex == 0)
        {
            if(this.getWorld().workersHired < 10)
            {
                this.context.drawImage(hireb, 0, 0, hireb.width, hireb.height, this.boundingBox.width * .35, this.boundingBox.height * .14, this.boundingBox.width * .28, this.boundingBox.height * .28);
                this.context.fillStyle = "#000000";
                var prevFont = this.context.font;
                this.context.font = "32px KanitB";
                this.context.fillText(_("HIRE"), this.boundingBox.width * .32 + (this.boundingBox.width * .34 / 2) - (this.context.measureText(_("HIRE")).width / 2), this.boundingBox.height * .11 + (this.boundingBox.height * .34 / 2) + 10);
                this.context.font = prevFont;

                if(money >= getEarth().workerHireCost() && getEarth().workersHired == 0)
                {
                    //arrow on hire button
                    this.context.drawImage(arrowright, 0, 0, arrowright.width, arrowright.height, this.boundingBox.width * .25 + (oscillate(numFramesRendered, 8) * this.boundingBox.width * .018), this.boundingBox.height * .20, Math.floor(this.boundingBox.width * .15), Math.floor(this.boundingBox.height * .15));
                }
            }
            else
            {
                this.context.save();
                this.context.fillStyle = "#FFFFFF";
                this.context.strokeStyle = "#000000";
                this.context.lineWidth = 3;
                this.context.textBaseline = "bottom";
                var prevFont = this.context.font;
                this.context.font = "20px KanitM";
                var minerEfficiencyText = _("Miner Efficiency: {0}/10", this.getWorld().workerLevel);
                this.context.strokeText(minerEfficiencyText, this.boundingBox.width * .32 + (this.boundingBox.width * .34 / 2) - (this.context.measureText(minerEfficiencyText).width / 2), this.boundingBox.height * .11 + (this.boundingBox.height * .34 / 2) + 10);
                this.context.fillText(minerEfficiencyText, this.boundingBox.width * .32 + (this.boundingBox.width * .34 / 2) - (this.context.measureText(minerEfficiencyText).width / 2), this.boundingBox.height * .11 + (this.boundingBox.height * .34 / 2) + 10);
                this.context.restore();
                if(this.getWorld().workerLevel < 10)
                {
                    this.context.fillText(_("Upgrade Efficiency Below"), this.boundingBox.width * .32 + (this.boundingBox.width * .34 / 2) - (this.context.measureText("Upgrade Efficiency Below").width / 2), this.boundingBox.height * .11 + (this.boundingBox.height * .35));
                }
            }

            this.context.fillStyle = "#000000";

            for(var u = 1; u < 11; u++)
            {
                if(this.getWorld().workersHired == 10)
                {
                    if(this.getWorld().workerLevel >= u)
                    {
                        //already had checked
                        if(u < 6)
                        {
                            this.context.drawImage(upgradeb, 0, 0, upgradeb.width, upgradeb.height, this.boundingBox.width * .125, this.boundingBox.height * (.48 + (.08 * (u - 1))), this.boundingBox.width * .3, this.boundingBox.height * .07);


                            this.context.fillText("$" + beautifynum(doBigIntDecimalMultiplication(this.getWorld().workerLevelCosts[u], STAT.minerUpgradeAndHireCostMultiplier())), this.boundingBox.width * .2, this.boundingBox.height * (.53 + (.08 * (u - 1))), 125);


                            this.context.drawImage(craftcheck, 0, 0, 129, 21, this.boundingBox.width * .125, this.boundingBox.height * (.48 + (.08 * (u - 1))), this.boundingBox.width * .3, this.boundingBox.height * .07);
                        }
                        else
                        {
                            this.context.drawImage(upgradeb, 0, 0, upgradeb.width, upgradeb.height, this.boundingBox.width * .55, this.boundingBox.height * (.48 + (.08 * (u - 6))), this.boundingBox.width * .3, this.boundingBox.height * .07);

                            this.context.fillText("$" + beautifynum(doBigIntDecimalMultiplication(this.getWorld().workerLevelCosts[u], STAT.minerUpgradeAndHireCostMultiplier())), this.boundingBox.width * .62, this.boundingBox.height * (.53 + (.08 * (u - 6))), 125);

                            this.context.drawImage(craftcheck, 0, 0, 129, 21, this.boundingBox.width * .55, this.boundingBox.height * (.48 + (.08 * (u - 6))), this.boundingBox.width * .3, this.boundingBox.height * .07);
                        }
                    }
                    else
                    {
                        if(this.getWorld().workerLevel == (u - 1))
                        {
                            //light up
                            if(u < 6)
                            {
                                this.context.drawImage(upgradeb, 0, 0, upgradeb.width, upgradeb.height, this.boundingBox.width * .125, this.boundingBox.height * (.48 + (.08 * (u - 1))), this.boundingBox.width * .3, this.boundingBox.height * .07);
                                this.context.fillText("$" + beautifynum(doBigIntDecimalMultiplication(this.getWorld().workerLevelCosts[u], STAT.minerUpgradeAndHireCostMultiplier())), this.boundingBox.width * .2, this.boundingBox.height * (.53 + (.08 * (u - 1))), 125);
                            }
                            else
                            {
                                this.context.drawImage(upgradeb, 0, 0, upgradeb.width, upgradeb.height, this.boundingBox.width * .55, this.boundingBox.height * (.48 + (.08 * (u - 6))), this.boundingBox.width * .3, this.boundingBox.height * .07);
                                this.context.fillText("$" + beautifynum(doBigIntDecimalMultiplication(this.getWorld().workerLevelCosts[u], STAT.minerUpgradeAndHireCostMultiplier())), this.boundingBox.width * .62, this.boundingBox.height * (.53 + (.08 * (u - 6))), 125);
                            }
                        }
                        else
                        {
                            //can't get yet, grey it.
                            if(u < 6)
                            {
                                this.context.drawImage(upgradebg, 0, 0, upgradebg.width, upgradebg.height, this.boundingBox.width * .125, this.boundingBox.height * (.48 + (.08 * (u - 1))), this.boundingBox.width * .3, this.boundingBox.height * .07);
                            }
                            else
                            {
                                this.context.drawImage(upgradebg, 0, 0, upgradebg.width, upgradebg.height, this.boundingBox.width * .55, this.boundingBox.height * (.48 + (.08 * (u - 6))), this.boundingBox.width * .3, this.boundingBox.height * .07);
                            }
                        }
                    }
                }
                else
                {
                    //can't get - grey
                    if(u < 6)
                    {
                        this.context.drawImage(upgradebg, 0, 0, upgradebg.width, upgradebg.height, this.boundingBox.width * .125, this.boundingBox.height * (.48 + (.08 * (u - 1))), this.boundingBox.width * .3, this.boundingBox.height * .07);
                    }
                    else
                    {
                        this.context.drawImage(upgradebg, 0, 0, upgradebg.width, upgradebg.height, this.boundingBox.width * .55, this.boundingBox.height * (.48 + (.08 * (u - 6))), this.boundingBox.width * .3, this.boundingBox.height * .07);
                    }
                }
            }

            if(this.getWorld().workersHired < 10)
            {
                this.context.fillStyle = "#FFFFFF";
                var hireText = _("Cost to hire: ${0}", beautifynum(this.getWorld().workerHireCost()));
                this.context.fillText(hireText, (this.boundingBox.width * .5) - ((this.context.measureText(hireText).width) * .5), this.boundingBox.height * .45);
                this.context.fillStyle = "#000000";
            }

            showHirerDialogue();
        }
        else
        {
            var buttonPadding = .0075;
            var buttonToRender = 0;
            var resourceIndexesViewed = this.getResources();

            for(var i in resourceIndexesViewed)
            {
                var resourceId = resourceIndexesViewed[i];
                var worldResource = worldResources[resourceId];

                buttonToRender++;
                var height = this.boundingBox.height * (.05 + buttonPadding) * (buttonToRender + 1.5);

                if((!worldResource.isIsotope && highestOreUnlocked >= resourceId))
                {
                    var cost = worldResource.sellValue * 100 * Math.max(1, (worldResource.level * 3));
                    this.context.fillText("Cost: $" + cost + " +100% chance to find " + worldResource.name + ". Current: " + (worldResource.level * 100) + "%", this.boundingBox.width * .29, 4 + height + (this.boundingBox.height * .025));
                    this.context.drawImage(worldResource.smallIcon, 0, 0, worldResource.smallIcon.width, worldResource.smallIcon.height, this.boundingBox.width * .25, -12 + height + (this.boundingBox.height * .025), 20, 20);

                    if(money > cost)
                    {
                        renderButton(this.context, craftb, _("Level up"), this.boundingBox.width * .045, height, this.boundingBox.width * .20, this.boundingBox.height * .05, "14px Verdana", "#000000");
                    }
                    else
                    {
                        renderButton(this.context, craftbg, _("Level up"), this.boundingBox.width * .045, height, this.boundingBox.width * .20, this.boundingBox.height * .05, "14px Verdana", "#000000");
                    }
                }
            }
        }
    }

    close()
    {
        activeLayers.MainUILayer.removeDialogueAttachment();
        animate();

        return super.close();
    }

    levelUpButtonClick(buttonIndex)
    {
        return function ()
        {
            var resourceIndexes = this.parent.parent.getResources();
            var mineralToLevel = worldResources[resourceIndexes[buttonIndex]];
            var cost = mineralToLevel.sellValue * 100 * Math.max(1, (mineralToLevel.level * 3));

            if(mineralToLevel.level < 5 && money >= cost)
            {
                subtractMoney(cost);
                mineralToLevel.level++
            }
        };
    }
}