class ChestCollectorWindow extends TabbedPopupWindow
{
    layerName = "ChestCollector"; // Used as key in activeLayers
    domElementId = "HIRED"; // ID of dom element that gets shown or hidden
    context = HR;         // Canvas rendering context for popup

    constructor(boundingBox)
    {
        super(boundingBox);
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        this.setFrameImagesByWorldIndex(0);

        let tabs = chestCompressorStructure.level > 0 ? [_("Compress"), _("Queue")] : [];
        this.initializeTabs(tabs);

        this.compressorPane = new Hitbox(
            {
                x: this.bodyContainer.boundingBox.x,
                y: this.bodyContainer.boundingBox.y,
                width: this.bodyContainer.boundingBox.width,
                height: this.bodyContainer.boundingBox.height
            },
            {},
            "",
            "compressorPane"
        );
        this.compressorPane.allowBubbling = true;
        this.addHitbox(this.compressorPane);

        this.queuePane = new Scrollbox(
            this.bodyContainer.boundingBox.width - 15,
            this.bodyContainer.boundingBox.height * .9 + (this.bodyContainer.boundingBox.height * 0.16 * Math.max(0, chestCompressor.queuedChests.length - 3)),
            this.context,
            this.bodyContainer.boundingBox.x,
            this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .1),
            this.bodyContainer.boundingBox.width,
            this.bodyContainer.boundingBox.height * .9,
            15
        );
        this.addHitbox(this.queuePane);
        this.queuePane.setVisible(true);
        this.queuePane.setEnabled(true);

        this.onTabChange();
    }

    onTabChange()
    {
        if(this.currentTabIndex == 0)
        {
            this.compressorPane.setVisible(true);
            this.compressorPane.setEnabled(true);
            this.queuePane.setVisible(false);
            this.queuePane.setEnabled(false);
            this.initializeBaseTab();
        }
        else
        {

            this.compressorPane.setVisible(false);
            this.compressorPane.setEnabled(false);
            this.queuePane.setVisible(true);
            this.queuePane.setEnabled(true);
            this.initializeQueue()
        }
    }

    initializeBaseTab()
    {
        this.compressorPane.clearHitboxes();
        //basic chest
        this.compressorPane.basicChestDisplay = new Hitbox(
            {
                x: 0,
                y: this.bodyContainer.boundingBox.height * -0.05,
                width: this.bodyContainer.boundingBox.width * 0.30,
                height: this.bodyContainer.boundingBox.height * 0.7
            }, {}, ""
        );
        this.compressorPane.basicChestDisplay.render = function (parentWindow)
        {
            var coords = this.getRelativeCoordinates(0, 0, parentWindow);
            var imageBoundingBox = drawImageFitInBox(
                parentWindow.context,
                basicChestIconClosed,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.width
            );
            parentWindow.context.save();
            parentWindow.context.font = "24px Verdana";
            parentWindow.context.fillStyle = "#FFFFFF";
            parentWindow.context.textBaseline = "top";
            fillTextWrap(
                parentWindow.context,
                "x " + chestService.getStoredChestsOfType(ChestType.basic),
                coords.x,
                imageBoundingBox.y + imageBoundingBox.height,
                this.boundingBox.width,
                "center"
            );
            parentWindow.context.restore();
            this.renderChildren();
        }.bind(this.compressorPane.basicChestDisplay, this);
        this.compressorPane.addHitbox(this.compressorPane.basicChestDisplay);

        this.compressorPane.basicChestButton = this.compressorPane.addHitbox(new Button(
            upgradebg_blank, _("Open Basic Chest"), "18px KanitM", "#000000",
            {
                x: this.compressorPane.basicChestDisplay.boundingBox.x,
                y: this.compressorPane.basicChestDisplay.boundingBox.height * 0.7,
                width: this.compressorPane.basicChestDisplay.boundingBox.width,
                height: this.compressorPane.basicChestDisplay.boundingBox.height * 0.15
            },
            {
                onmousedown: function ()
                {
                    chestService.grantStoredChest(ChestType.basic);
                }
            }
        ));
        this.compressorPane.basicChestButton.isEnabled = () => chestService.getStoredChestsOfType(ChestType.basic) > 0;

        if(chestCompressorStructure.level > 0)
        {
            this.compressorPane.basicChestCompressButton = this.compressorPane.addHitbox(new Button(
                upgradebg_blank, _("Compress {0} to 1 Gold", chestCompressorStructure.statValueForCurrentLevel(0)), "18px KanitM", "#000000",
                {
                    x: this.compressorPane.basicChestDisplay.boundingBox.x,
                    y: this.compressorPane.basicChestDisplay.boundingBox.height * .88,
                    width: this.compressorPane.basicChestDisplay.boundingBox.width,
                    height: this.compressorPane.basicChestDisplay.boundingBox.height * 0.15
                },
                {
                    onmousedown: function ()
                    {
                        if(chestCompressor.canQueueChest(ChestType.gold))
                        {
                            chestCompressor.addChestToQueue(ChestType.gold);
                            this.parent.parent.flickerTab(1, 500, 3);
                        }
                    },
                    onmouseenter: function ()
                    {
                        if(!chestCompressor.canQueueChest(ChestType.gold))
                        {
                            showTooltip("Unable to compress chests", "Compressor slots are full or you don't have enough chests", mouseX - (180 / 2), mouseY + 20, 180);
                        }
                    },
                    onmouseexit: () => hideTooltip()
                }
            ));
        }


        //gold chest
        this.compressorPane.goldChestDisplay = new Hitbox(
            {
                x: this.bodyContainer.boundingBox.width * 0.35,
                y: this.bodyContainer.boundingBox.height * -0.05,
                width: this.bodyContainer.boundingBox.width * 0.30,
                height: this.bodyContainer.boundingBox.height * 0.7
            }, {}, ""
        );
        this.compressorPane.goldChestDisplay.render = function (parentWindow)
        {
            var coords = this.getRelativeCoordinates(0, 0, parentWindow);
            var imageBoundingBox = drawImageFitInBox(
                parentWindow.context,
                goldChestIconClosed,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.width
            );
            parentWindow.context.save();
            parentWindow.context.font = "24px Verdana";
            parentWindow.context.fillStyle = "#FFFFFF";
            parentWindow.context.textBaseline = "top";
            fillTextWrap(
                parentWindow.context,
                "x " + chestService.getStoredChestsOfType(ChestType.gold),
                coords.x,
                imageBoundingBox.y + imageBoundingBox.height,
                this.boundingBox.width,
                "center"
            );
            parentWindow.context.restore();
            this.renderChildren();
        }.bind(this.compressorPane.goldChestDisplay, this);
        this.compressorPane.addHitbox(this.compressorPane.goldChestDisplay);

        this.compressorPane.goldChestButton = this.compressorPane.addHitbox(new Button(
            upgradebg_blank, _("Open Gold Chest"), "18px KanitM", "#000000",
            {
                x: this.compressorPane.goldChestDisplay.boundingBox.x,
                y: this.compressorPane.goldChestDisplay.boundingBox.height * 0.7,
                width: this.compressorPane.goldChestDisplay.boundingBox.width,
                height: this.compressorPane.goldChestDisplay.boundingBox.height * 0.15
            },
            {
                onmousedown: function ()
                {
                    chestService.grantStoredChest(ChestType.gold);
                }
            }
        ));
        this.compressorPane.goldChestButton.isEnabled = () => chestService.getStoredChestsOfType(ChestType.gold) > 0;

        if(chestCompressorStructure.level > 0)
        {
            this.compressorPane.goldChestCompressButton = this.compressorPane.addHitbox(new Button(
                upgradebg_blank, _("Compress {0} to 1 Ethereal", chestCompressorStructure.statValueForCurrentLevel(1)), "18px KanitM", "#000000",
                {
                    x: this.compressorPane.goldChestDisplay.boundingBox.x,
                    y: this.compressorPane.goldChestDisplay.boundingBox.height * .88,
                    width: this.compressorPane.goldChestDisplay.boundingBox.width,
                    height: this.compressorPane.goldChestDisplay.boundingBox.height * 0.15
                },
                {
                    onmousedown: function ()
                    {
                        if(chestCompressor.canQueueChest(ChestType.black))
                        {
                            chestCompressor.addChestToQueue(ChestType.black);
                            this.parent.parent.flickerTab(1, 500, 3);
                        }
                    },
                    onmouseenter: function ()
                    {
                        if(!chestCompressor.canQueueChest(ChestType.black))
                        {
                            showTooltip("Unable to compress chests", "Compressor slots are full or you don't have enough chests", mouseX - (180 / 2), mouseY + 20, 180);
                        }
                    },
                    onmouseexit: () => hideTooltip()
                }
            ));
        }


        //ethereal chest
        this.compressorPane.blackChestDisplay = new Hitbox(
            {
                x: this.bodyContainer.boundingBox.width * 0.70,
                y: this.bodyContainer.boundingBox.height * -0.05,
                width: this.bodyContainer.boundingBox.width * 0.30,
                height: this.bodyContainer.boundingBox.height * 0.7
            }, {}, ""
        );
        this.compressorPane.blackChestDisplay.render = function (parentWindow)
        {
            var coords = this.getRelativeCoordinates(0, 0, parentWindow);
            var imageBoundingBox = drawImageFitInBox(
                parentWindow.context,
                blackChestIconClosed,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.width
            );
            parentWindow.context.save();
            parentWindow.context.font = "24px Verdana";
            parentWindow.context.fillStyle = "#FFFFFF";
            parentWindow.context.textBaseline = "top";
            fillTextWrap(
                parentWindow.context,
                "x " + chestService.getStoredChestsOfType(ChestType.black),
                coords.x,
                imageBoundingBox.y + imageBoundingBox.height,
                this.boundingBox.width,
                "center"
            );
            parentWindow.context.restore();
            this.renderChildren();
        }.bind(this.compressorPane.blackChestDisplay, this);
        this.compressorPane.addHitbox(this.compressorPane.blackChestDisplay);

        this.compressorPane.blackChestButton = this.compressorPane.addHitbox(new Button(
            upgradebg_blank, _("Open Ethereal Chest"), "18px KanitM", "#000000",
            {
                x: this.compressorPane.blackChestDisplay.boundingBox.x,
                y: this.compressorPane.blackChestDisplay.boundingBox.height * 0.7,
                width: this.compressorPane.blackChestDisplay.boundingBox.width,
                height: this.compressorPane.blackChestDisplay.boundingBox.height * 0.15
            },
            {
                onmousedown: function ()
                {
                    chestService.grantStoredChest(ChestType.black);
                }
            }
        ));

        this.compressorPane.collectButton = new Button(
            upgradebg_blank, _("Collect from worlds"), "16px KanitM", "#000000",
            {
                x: (this.bodyContainer.boundingBox.width / 2) - ((this.bodyContainer.boundingBox.width * .33) / 2),
                y: this.boundingBox.height * 0.675,
                width: this.compressorPane.boundingBox.width * .33,
                height: this.boundingBox.height * 0.1
            },
            {
                onmousedown: function ()
                {
                    chestService.forEachChest((chest) =>
                    {
                        if(!chestService.isChestCollectorFull())
                        {
                            if(chest.source == "natural" || chest.source == "superminer")
                            {
                                chestService.storeChest(chest.type);
                                chestService.removeChest(chest.depth, chest.worker);
                            }
                        }
                    })
                }
            }
        );
        this.compressorPane.collectButton.isVisible = () => metalDetectorStructure.level >= 6;
        this.compressorPane.collectButton.isEnabled = () => metalDetectorStructure.level >= 6 && chestService.chests.length > 0 && !chestService.isChestCollectorFull();
        this.compressorPane.addHitbox(this.compressorPane.collectButton);
    }

    initializeQueue()
    {
        this.compressorPane.clearHitboxes();
        this.queuePane.clearHitboxes();
        for(var i = 0; i < chestCompressor.queuedChests.length; i++)
        {
            this.queuePane.addHitbox(new Hitbox(
                {
                    x: this.boundingBox.width * 0.05,
                    y: this.boundingBox.height * (0.02 + (.16 * i)),
                    width: this.boundingBox.width * .825,
                    height: this.boundingBox.height * .15
                },
                {},
                'cursor',
                "chestSlot" + i
            ));

            this.queuePane.addHitbox(new Hitbox(
                {
                    x: this.boundingBox.width * 0.71,
                    y: this.boundingBox.height * (.04 + (.16 * i)),
                    width: this.boundingBox.width * .13,
                    height: this.boundingBox.height * .15 * .75
                },
                {
                    onmousedown: function (i)
                    {
                        if(tickets >= chestCompressor.ticketCost(i))
                        {
                            showConfirmationPrompt(
                                _("Pay {0} tickets to skip the remaining time and immediately send the chest to storage", chestCompressor.ticketCost(i)),
                                _("Yes"),
                                () =>
                                {

                                    if(tickets >= chestCompressor.ticketCost(i))
                                    {
                                        tickets -= chestCompressor.ticketCost(i);
                                        chestCompressor.grantChestAndRemoveFromQueue(i);
                                        this.flickerTab(0, 500, 3);
                                        this.initializeQueue();
                                    }
                                },
                                _("Cancel")
                            )
                        }
                    }.bind(this, i)
                },
                'pointer',
                "chestButton" + i
            ))
        }
    }

    render()
    {
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        super.render();

        if(this.currentTabIndex == 0)
        {
            // this.compressorPane.renderChildren();
            this.compressorPane.basicChestButton.image = chestService.getStoredChestsOfType(ChestType.basic) > 0 ? upgradeb : upgradebg_blank;
            this.compressorPane.goldChestButton.image = chestService.getStoredChestsOfType(ChestType.gold) > 0 ? upgradeb : upgradebg_blank;
            this.compressorPane.blackChestButton.image = chestService.getStoredChestsOfType(ChestType.black) > 0 ? upgradeb : upgradebg_blank;

            if(chestCompressorStructure.level > 0)
            {
                this.compressorPane.basicChestCompressButton.image = chestCompressor.canQueueChest(ChestType.gold) ? upgradeb : upgradebg_blank;
                this.compressorPane.goldChestCompressButton.image = chestCompressor.canQueueChest(ChestType.black) ? upgradeb : upgradebg_blank;
            }

            this.compressorPane.collectButton.image = chestService.chests.length > 0 && !chestService.isChestCollectorFull() ? upgradeb : upgradebg_blank;
        }
        else if(this.currentTabIndex == 1)
        {
            this.queuePane.context.clearRect(0, 0, this.queuePane.contentWidth, this.queuePane.contentHeight);

            this.context.font = this.boundingBox.height * 0.05 + "px KanitM"
            this.context.fillStyle = "#FFFFFF"
            fillTextShrinkToFit(this.context, _("Used Slots {0}/{1}", chestCompressor.queuedChests.length, chestCompressor.getSlotCount()), this.queuePane.boundingBox.x, this.queuePane.boundingBox.y - (this.queuePane.boundingBox.height * 0.025), this.queuePane.boundingBox.width, "center");

            for(var i = 0; i < chestCompressor.queuedChests.length; i++)
            {
                let hitbox = this.queuePane.getHitboxById("chestSlot" + i);
                let button = this.queuePane.getHitboxById("chestButton" + i);
                let queuedChest = chestCompressor.queuedChests[i];
                let baseTime = chestCompressor.chestStats[queuedChest[0]].time();
                let percentComplete = (baseTime - queuedChest[1]) / baseTime;

                if(hitbox)
                {
                    renderRoundedRectangle(this.queuePane.context, hitbox.boundingBox.x, hitbox.boundingBox.y, hitbox.boundingBox.width, hitbox.boundingBox.height, 10, "hsla(0, 0%, 100%, 0.5)", "hsla(0, 100%, 0%, 0.6)", 1);

                    let chestIcon = chestCompressor.queuedChests[i][0] == 1 ? goldChestIconClosed : blackChestIconClosed;
                    this.queuePane.context.drawImage(chestIcon, 0, 0, chestIcon.width, chestIcon.height, hitbox.boundingBox.x, hitbox.boundingBox.y + (hitbox.boundingBox.height * 0.05), relativeWidth(chestIcon) * .33, relativeHeight(chestIcon) * .33)

                    this.queuePane.context.font = hitbox.boundingBox.height * 0.25 + "px KanitM"
                    //renderProgressBar(this.queuePane.context, _("Time Remaining: {0}", formattedCountDown(queuedChest[1])), greydot, darkdot, hitbox.boundingBox.width * .25, hitbox.boundingBox.y + hitbox.boundingBox.height * .2, hitbox.boundingBox.width * .6, hitbox.boundingBox.height * .6, "#FFFFFF", percentComplete);

                    renderFancyProgressBar(
                        this.queuePane.context,
                        _("Time Remaining: {0}", formattedCountDown(queuedChest[1])),
                        percentComplete,
                        hitbox.boundingBox.width * .25,
                        hitbox.boundingBox.y + hitbox.boundingBox.height * .2,
                        hitbox.boundingBox.width * .6,
                        hitbox.boundingBox.height * .6,
                        "#5EB65D",
                        "#000000",
                        "#FFFFFF",
                        timerFrame
                    );

                    this.queuePane.context.drawImage(bigb_blank, 0, 0, bigb_blank.width, bigb_blank.height, button.boundingBox.x, button.boundingBox.y, button.boundingBox.width, button.boundingBox.height)

                    fillTextShrinkToFit(this.queuePane.context, _("Skip Time"), button.boundingBox.x, button.boundingBox.y + (button.boundingBox.height * 0.6), button.boundingBox.width, "center");
                }
            }
        }
    }
}