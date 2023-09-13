class SellWindow extends TabbedPopupWindow
{
    layerName = "SELL"; // Used as key in activeLayers
    domElementId = "SELLD"; // ID of dom element that gets shown or hidden
    context = SL;         // Canvas rendering context for popup

    worldIndex;
    resourcePane;

    constructor(boundingBox, worldIndex, openTab = 0)
    {
        super(boundingBox);
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        this.setFrameImagesByWorldIndex(worldIndex);

        this.currentTabIndex = openTab;
        this.worldIndex = worldIndex;

        var sellCategories = {
            0: _("Sell Ore"),
            1: _("Sell Isotope")
        }
        this.initializeTabs(Object.values(sellCategories));

        var buttonPadding = .0075;
        for(var i = 0; i < 13; i++)
        {
            var height = this.boundingBox.height * (.05 + buttonPadding) * (i + 2.5);

            this.addHitbox(new Hitbox(
                {
                    x: this.boundingBox.width * .045,
                    y: height,
                    width: this.boundingBox.width * .20,
                    height: this.boundingBox.height * .05
                },
                {
                    onmousedown: this.sellButtonClick(i)
                },
                'pointer',
                "sellButton_" + i
            ))

            if(i < 12)
            {
                var newLockButton = this.addHitbox(new Hitbox(
                    {
                        x: this.boundingBox.width * .25,
                        y: height,
                        width: this.boundingBox.width * .04,
                        height: this.boundingBox.height * .05
                    },
                    {
                        onmousedown: this.lockButtonClick(i),
                        onmouseenter: this.lockButtonHover(i),
                        onmouseexit: function ()
                        {
                            hideTooltip();
                        }
                    },
                    'pointer',
                    "lockButton_" + i
                ))
                newLockButton.isEnabled = function (i)
                {
                    return i < this.getTabResources().length;
                }.bind(this, i);
                newLockButton.isVisible = newLockButton.isEnabled;
            }
        }
        this.toggleSellButtons();
    }

    onTabChange()
    {
        this.toggleSellButtons();
    }

    toggleSellButtons()
    {
        var resourceIndexesViewed = this.getTabResources();
        for(var i = 0; i < 12; ++i)
        {
            this.getHitboxById("sellButton_" + i).setEnabled((i < resourceIndexesViewed.length))
        }
    }

    getWorld()
    {
        return worlds[this.worldIndex];
    }

    getTabResources()
    {
        if(this.currentTabIndex == 0)
        {
            return this.getWorld().mineralIdsToSell;
        }
        else if(this.currentTabIndex == 1)
        {
            return this.getWorld().isotopeIdsToSell;
        }
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
        var sellPriceMultiplier = STAT.sellPriceMultiplier();
        var managerPadding = this.boundingBox.width * .04;
        var buttonPadding = .0075;

        var resourceIndexesViewed = this.getTabResources();

        var buttonToRender = 0;
        var sellAllProfit = 0n;
        for(var i in resourceIndexesViewed)
        {
            var resourceId = resourceIndexesViewed[i];
            var worldResource = worldResources[resourceId];

            buttonToRender++;
            var height = this.boundingBox.height * (.05 + buttonPadding) * (buttonToRender + 1.5);

            if((!worldResource.isIsotope && highestOreUnlocked >= resourceId) || (worldResource.isIsotope && (highestIsotopeUnlocked + 2) >= resourceId))
            {
                this.context.fillText(worldResource.name + ": " + beautifynum(worldResource.numOwned) + " = $" + beautifynum(doBigIntDecimalMultiplication(worldResource.totalValue(), sellPriceMultiplier)), managerPadding + 25 + this.boundingBox.width * .25, 4 + height + (this.boundingBox.height * .025));
                this.context.drawImage(worldResource.smallIcon, 0, 0, worldResource.smallIcon.width, worldResource.smallIcon.height, managerPadding + 3 + this.boundingBox.width * .25, -12 + height + (this.boundingBox.height * .025), 20, 20);
            }
            else
            {
                this.context.fillText(_("????") + ": 0 = $0", managerPadding + 25 + this.boundingBox.width * .25, 6 + height + (this.boundingBox.height * .025));
                this.context.drawImage(worldResource.smallIconHidden, 0, 0, worldResource.smallIconHidden.width, worldResource.smallIconHidden.height, managerPadding + 3 + this.boundingBox.width * .25, -12 + height + (this.boundingBox.height * .025), 20, 20);
            }

            this.context.drawImage(getLockIconForMineralNumber(resourceId), 0, 0, 27, 21, this.boundingBox.width * .25, height, this.boundingBox.width * .04, this.boundingBox.height * .05);
            renderButton(this.context, sellb, _("SELL"), this.boundingBox.width * .045, height, this.boundingBox.width * .20, this.boundingBox.height * .05, "14px Verdana", "#000000");
            sellAllProfit += getMineralSaleStats(resourceId).profit;
        }

        var height = this.boundingBox.height * (.05 + buttonPadding) * 14.25;
        renderButtonScaled(this.context, sellb, _("SELL ALL"), this.boundingBox.width * .045, height + (this.boundingBox.height * .027), this.boundingBox.width * .20, this.boundingBox.height * .05, "14px Verdana", "#000000");
        this.context.fillText("$" + beautifynum(sellAllProfit), this.boundingBox.width * .25, height + (this.boundingBox.height * 0.061));

        showSellerDialogue();

        if(money == 0 && getValueOfMineralsExcludingHe3() >= getEarth().workerHireCost() && getEarth().workersHired == 0)
        {
            drawImageRot(this.context, arrowleft, 0, 0, arrowleft.width, arrowleft.height, (oscillate(numFramesRendered, 8) * this.boundingBox.width * .018), this.boundingBox.height * .125, Math.floor(this.boundingBox.width * .075), Math.floor(this.boundingBox.height * .075), 180);
        }
    }

    close()
    {
        activeLayers.MainUILayer.removeDialogueAttachment();
        animate();

        return super.close();
    }

    sellButtonClick(buttonIndex)
    {
        //button index, this.parent.currentTabIndex, 
        return function ()
        {
            var resourceIndexesViewed = this.parent.getTabResources();
            var previousMineralsOwned = [];
            var previousMoney = money;

            for(var i = 0; i < resourceIndexesViewed.length; i++)
            {
                previousMineralsOwned[i] = worldResources[resourceIndexesViewed[i]].numOwned;
            }

            if(buttonIndex < resourceIndexesViewed.length)
            {
                sellMineral(resourceIndexesViewed[buttonIndex]);
            }
            else if(buttonIndex == 12)
            {
                for(var i in resourceIndexesViewed)
                {
                    var resourceIndex = resourceIndexesViewed[i];
                    sellMineral(resourceIndex);
                }
            }

            if(mutebuttons == 0)
            {
                if(buttonIndex != 12 && worldResources[resourceIndexesViewed[buttonIndex]].numOwned != previousMineralsOwned[buttonIndex])
                {
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                }
                else if(money != previousMoney)
                {
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                }
            }

            var totalSaleProceeds = money - previousMoney;
            if(totalSaleProceeds > 100000000000000000n)
            {
                questManager.getQuest(55).markComplete();
            }
        };
    }

    lockButtonClick(buttonIndex)
    {
        return function ()
        {
            if(managerStructure.level >= 1)
            {
                var resourceIndexesViewed = this.parent.getTabResources();
                var mineralIndex = resourceIndexesViewed[buttonIndex];
                showSimpleInput(_("Enter the amount of {0} you want to prevent from being sold.", getLockedMineralName(mineralIndex)), _("Update"), "0", getMineralUpdateLockFunction(mineralIndex), _("Cancel"));
            }
            else
            {
                var craftingWindow = openUi(CraftingWindow, null, 0);
                if(craftingWindow)
                {
                    craftingWindow.openTab(1);
                    craftingWindow.selectedBlueprint = getBlueprintById(3, 2);
                    craftingWindow.initializeCraftingPane();
                }
            }
            if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
        };
    }

    lockButtonHover(buttonIndex)
    {
        return function ()
        {
            if(managerStructure.level >= 1)
            {
                var resourceIndexesViewed = this.parent.getTabResources();
                var mineralIndex = resourceIndexesViewed[buttonIndex];

                if(lockedMineralAmtsToSave[mineralIndex] == 0)
                {
                    showTooltip(_("Lock Resource"), _("Set minimum amount of {0} to keep", getLockedMineralName(mineralIndex)));
                }
                else
                {
                    showTooltip(_("Resources Locked"), _("Locked to maintain a minimum of {0} {1}", beautifynum(lockedMineralAmtsToSave[mineralIndex]), getLockedMineralName(mineralIndex)));
                }
            }
            else
            {
                showTooltip(_("Craft a Manager to lock mineral amounts"), _("Click to go to the Craft Center"));
            }
        };
    }

}