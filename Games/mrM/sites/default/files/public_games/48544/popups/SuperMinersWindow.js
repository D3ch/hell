/* 

    The way this popup works is a little convoluted and maybe a little jank? 
    It serves many different purposes, but the confusing part lies with how it interacts with SuperMinerSelectorWindow.js
    to facilitate getting new super miners from ethereal chests when your slots are already full. 
    Look to that file if you have questions about what some of this functionality does. 

*/

class SuperMinersWindow extends TabbedPopupWindow
{
    layerName = "Super"; // Used as key in activeLayers
    domElementId = "SUPERD"; // ID of dom element that gets shown or hidden
    context = SPR;         // Canvas rendering context for popup
    zIndex = 5;

    popupFrameImage = smFrame;

    slotsPerRow = 4;
    fractionalSlotPadding = 0.025;
    superMinerHitboxes = [];

    constructor(boundingBox, worldIndex, showScrapButtons = false)
    {
        super(boundingBox);
        if(!boundingBox)
        {
            this.setBoundingBox();
        }
        this.initializeTabs();

        this.windowYOffset = this.tabHeight - 0.023 * this.boundingBox.height;

        this.bodyContainer.boundingBox = {
            x: this.boundingBox.width * 0.037,
            y: this.windowYOffset + this.boundingBox.height * 0.048,
            width: this.boundingBox.width * 0.909,
            height: (this.boundingBox.height - this.windowYOffset) * 0.877,
        }

        this.headerHeight = this.bodyContainer.boundingBox.height * 0.1;

        this.worldIndex = worldIndex;
        this.showScrapButtons = showScrapButtons;
        this.lastAnimation = currentTime();
        this.sortedBy = "";
        this.miners = superMinerManager.currentSuperMiners;

        this.initializeHitboxes();
        this.intializeSortButtons();
        this.initializeScrollboxContents();
        this.sortSuperMiners();
    }

    initializeHitboxes()
    {
        var scrollboxY = this.windowYOffset + (this.boundingBox.height - this.windowYOffset) * 0.149;
        this.superMinerPane = new Scrollbox(
            this.bodyContainer.boundingBox.width - 15,
            0,
            this.context,
            this.bodyContainer.boundingBox.x,
            scrollboxY,
            this.bodyContainer.boundingBox.width,
            this.bodyContainer.boundingBox.height - scrollboxY + 2 * this.windowYOffset,
            15

        );
        this.superMinerPane.scrollToTop();
        this.addHitbox(this.superMinerPane);
    }

    intializeSortButtons()
    {
        var fractionalButtonWidth = 0.95;
        var buttonWidth = this.headerHeight * fractionalButtonWidth;
        var yOffset = (1 - fractionalButtonWidth) / 2 * this.headerHeight;
        var xOffset = -buttonWidth / 2;

        this.createSortButton(
            "rarity",
            "left",
            {
                x: xOffset + this.bodyContainer.boundingBox.width - 3 * buttonWidth,
                y: yOffset,
                width: buttonWidth,
                height: buttonWidth,
            }
        );
        this.createSortButton(
            "level",
            "middle",
            {
                x: xOffset + this.bodyContainer.boundingBox.width - 2 * buttonWidth,
                y: yOffset,
                width: buttonWidth,
                height: buttonWidth,
            },
        );
        this.createSortButton(
            "type",
            "right",
            {
                x: xOffset + this.bodyContainer.boundingBox.width - buttonWidth,
                y: yOffset,
                width: buttonWidth,
                height: buttonWidth,
            }
        );
    }

    createSortButton(sortType, position, boundingBox)
    {
        var button = this.bodyContainer.addHitbox(new Hitbox(
            boundingBox,
            {
                onmousedown: () =>
                {
                    this.sortSuperMiners(sortType);
                },
            },
            'pointer',
            ''
        ));
        button.render = function (root)
        {
            var coords = this.getRelativeCoordinates(0, 0, root);
            let button = window[position + (root.sortedBy == sortType ? "SMButtonDim" : "SMButton")];
            let buttonIcon = window[sortType + (root.sortedBy == sortType ? "dimSMIcon" : "SMIcon")];

            root.context.drawImage(
                button,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height
            );
            root.context.drawImage(
                buttonIcon,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height
            );
        }.bind(button, this);
    }

    initializeScrollboxContents()
    {
        this.superMinerPane.clearHitboxes();
        this.superMinerPane.contentHeight = 0;
        this.superMinerHitboxes = [];

        var slotPadding = this.superMinerPane.contentWidth * this.fractionalSlotPadding;
        this.slotWidth = (this.superMinerPane.contentWidth - (slotPadding * (this.slotsPerRow + 1))) / this.slotsPerRow;
        this.slotHeight = getScaledImageDimensions(superMinerRarities.common.smallFrame, this.slotWidth).height;
        this.slotYPadding = this.showScrapButtons ? this.slotHeight * 0.3 : slotPadding;

        for(var i = 0; i < superMinerManager.numSuperMiners(); i++)
        {
            let coords = getItemCoordsInList(
                this.slotWidth,
                this.slotHeight,
                slotPadding,
                this.slotYPadding,
                this.slotsPerRow,
                i
            );
            let slotX = coords.x;
            let slotY = coords.y;

            let superMiner = this.miners[i];

            this.superMinerHitboxes.push(this.superMinerPane.addHitbox(new Hitbox(
                {
                    x: slotX,
                    y: slotY,
                    width: this.slotWidth,
                    height: this.slotHeight,
                },
                {
                    onmousedown: () =>
                    {
                        if(!this.showScrapButtons)
                        {
                            openUi(SuperMinerWindow, null, superMiner);
                            if(superMiner.currentDepth) panToViewDepth(Math.min(depth, superMiner.currentDepth));
                        }
                    },
                },
                'pointer',
                'superMiner_' + i
            )));

            if(this.showScrapButtons)
            {
                this.superMinerPane.addHitbox(new Hitbox(
                    {
                        x: slotX,
                        y: slotY + this.slotHeight,
                        width: this.slotWidth,
                        height: this.slotHeight * 0.25,
                    },
                    {
                        onmousedown: () =>
                        {

                            showConfirmationPrompt(
                                _("Are you sure you want to scrap {0} for {1} Super Miner Souls?", superMiner.name, superMiner.scrapAmount()),
                                _("Yes"),
                                () =>
                                {
                                    superMiner.scrap();
                                    this.miners = superMinerManager.currentSuperMiners;
                                    this.initializeScrollboxContents()
                                },
                                _("No")
                            )
                        },
                    },
                    'pointer',
                    'scrapButton_' + i
                ));
            }
        }

        let coords = getItemCoordsInList(
            this.slotWidth,
            this.slotHeight,
            slotPadding,
            this.slotYPadding,
            this.slotsPerRow,
            i
        );

        this.purchaseButton = this.superMinerPane.addHitbox(new Hitbox(
            {
                x: coords.x,
                y: coords.y,
                width: this.slotWidth,
                height: this.slotHeight,
            },
            {
                onmousedown: () =>
                {
                    if(superMinerManager.canUpgradeSlot())
                    {
                        showConfirmationPrompt(
                            _("Purchase another super miner slot for {0} Super Miner Souls", superMinerManager.nextSlotCost()),
                            _("Purchase"),
                            () =>
                            {
                                superMinerManager.upgradeSlots()
                            },
                            _("Cancel")
                        )
                    }
                    else if(!activeLayers.SuperMinerSelectorWindow)
                    {
                        showConfirmationPrompt(
                            _("You don't have enough Super Miner Souls. Open more Black Chests or scrap Super Miners", superMinerManager.nextSlotCost()),
                            _("Open Black Chests"),
                            () =>
                            {
                                openUi(PurchaseWindow, null, 0, 0);
                            },
                            _("Scrap Super Miners"),
                            () =>
                            {
                                this.showScrapButtons = true;
                                this.initializeScrollboxContents();
                                this.superMinerPane.scrollToBottom();
                            }
                        )
                    }
                },
            },
            'pointer',
            'purchaseSlotButton'
        ));

        var trashButtonSize = this.slotWidth / 2;

        //create trash toggle
        this.trashButton = this.superMinerPane.addHitbox(new Hitbox(
            {
                x: (this.superMinerPane.boundingBox.width - trashButtonSize) * 0.5,
                y: coords.y + this.slotHeight + this.slotYPadding,
                width: trashButtonSize,
                height: trashButtonSize
            },
            {
                onmousedown: () =>
                {
                    if(!activeLayers.SuperMinerSelectorWindow)
                    {
                        this.showScrapButtons = !this.showScrapButtons;
                        this.initializeScrollboxContents();
                        this.superMinerPane.scrollToBottom();
                    }
                },
            },
            'pointer',
            'trash'
        ));

        this.superMinerPane.setContentHeightToIncludeLastChild();
        this.superMinerPane.scrollToTop();
    }

    close()
    {
        if(activeLayers.SuperMinerSelectorWindow && !activeLayers.SuperMinerSelectorWindow.madeAChoice)
        {
            let superMiner = activeLayers.SuperMinerSelectorWindow.superMiner;
            showConfirmationPrompt(
                _("Are you sure you want to scrap {0} for {1} Super Miner Souls?", superMiner.name, superMiner.scrapAmount()),
                _("Yes"),
                () =>
                {
                    superMiner.scrap();
                    activeLayers.SuperMinerSelectorWindow.madeAChoice = true;
                    closeUi(activeLayers.SuperMinerSelectorWindow);
                    closeUi(this);
                },
                _("No")
            )
        }
        else
        {
            return super.close();
        }
    }

    sortSuperMiners(sort)
    {
        if(sort == "rarity")
        {
            this.miners.sort((a, b) => b.rarity.id - a.rarity.id);
        }
        else if(sort == "level")
        {
            this.miners.sort((a, b) => b.level - a.level);
        }
        else if(sort == "type")
        {
            this.miners.sort((a, b) => b.type - a.type);
        }
        else
        {
            this.miners.sort((a, b) => (b.hasButton && b.percentageUntilAction() == 1) - (a.hasButton && a.percentageUntilAction() == 1))
        }
        this.sortedBy = sort;
        this.initializeScrollboxContents();
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.context.restore();
        super.render(); // Render any child layers

        this.context.font = (this.boundingBox.height * 0.05) + "px KanitM"
        this.context.textBaseline = "middle";

        this.superMinerPane.context.clearRect(0, 0, this.superMinerPane.contentWidth, this.superMinerPane.contentHeight);

        //slots display
        this.context.fillStyle = superMinerManager.isFull() ? "#FF0000" : "#FFFFFF";
        this.context.textBaseline = "middle";
        fillTextShrinkToFit(
            this.context,
            _("Slots: {0}/{1}", superMinerManager.numSuperMiners(), superMinerManager.slots),
            0,
            this.bodyContainer.boundingBox.y + this.headerHeight / 2,
            this.boundingBox.width,
            "center"
        );

        //souls display
        var soulIconWidth = this.headerHeight * 0.95;
        this.context.fillStyle = "#FFFFFF";
        let souls = worldResources[SUPER_MINER_SOULS_INDEX];
        this.context.drawImage(
            souls.largeIcon,
            (this.boundingBox.width * 0.05),
            this.bodyContainer.boundingBox.y + (this.headerHeight - soulIconWidth) / 2,
            this.boundingBox.width * .06,
            this.boundingBox.width * .06
        );
        fillTextShrinkToFit(
            this.context,
            souls.numOwned,
            this.boundingBox.width * 0.12,
            this.bodyContainer.boundingBox.y + this.headerHeight / 2,
            this.boundingBox.width,
            "left"
        );

        this.superMinerPane.context.font = (this.superMinerPane.boundingBox.height * .1) + "px KanitM"
        this.superMinerPane.context.fillStyle = "#000000";
        for(var i = 0; i < superMinerManager.numSuperMiners(); i++)
        {
            let superMiner = this.miners[i];
            let buttonIcon = superMiner.buttonIcon;
            let frame = superMiner.needsProgressBar ? superMiner.rarity.smallFrame : superMiner.rarity.smallFrameNoFill;
            let portrait = superMiner.portrait;

            let superMinerHitbox = this.superMinerHitboxes[i];
            if(superMinerHitbox)
            {
                let boundingBox = superMinerHitbox.boundingBox;
                let buttonOffset = superMiner.needsProgressBar ? (boundingBox.width * 0.045) : (boundingBox.width * 0.36);
                let portraitOffset = (boundingBox.width * 0.04);

                //action progress bar 
                if(superMiner.needsProgressBar)
                {
                    this.superMinerPane.context.fillStyle = "#000000";
                    this.superMinerPane.context.fillRect(boundingBox.x + (boundingBox.width * .33), boundingBox.y + (boundingBox.height * 0.78), boundingBox.width * .65, boundingBox.height * .195);
                    this.superMinerPane.context.fillStyle = "#FF8800";
                    this.superMinerPane.context.fillRect(boundingBox.x + (boundingBox.width * .33), boundingBox.y + (boundingBox.height * 0.78), (boundingBox.width * .65) * superMiner.percentageUntilAction(), boundingBox.height * .195);
                }

                //frame/portrait
                if(frame && frame.drawAnimation)
                {
                    frame.phaseShift = i * 7;
                    frame.drawAnimation(
                        this.superMinerPane.context,
                        boundingBox.x,
                        boundingBox.y,
                        boundingBox.width,
                        boundingBox.height
                    );
                }
                else
                {
                    this.superMinerPane.context.drawImage(
                        frame,
                        boundingBox.x,
                        boundingBox.y,
                        boundingBox.width,
                        boundingBox.height
                    );
                }
                drawImageFitInBox(
                    this.superMinerPane.context,
                    portrait,
                    boundingBox.x + (boundingBox.width * 0.04),
                    boundingBox.y + (boundingBox.height * 0.145),
                    boundingBox.width * 0.92,
                    boundingBox.height * 0.60
                );


                //level
                this.superMinerPane.context.font = (this.superMinerPane.boundingBox.height * .05) + "px KanitB"
                this.superMinerPane.context.textBaseline = "bottom";

                var levelTextArgs = [
                    this.superMinerPane.context,
                    _("LVL. {0}", superMiner.level),
                    boundingBox.x,
                    boundingBox.y + (boundingBox.height * 0.75),
                    boundingBox.width,
                    "center"
                ];

                this.superMinerPane.context.lineWidth = 3;
                this.superMinerPane.context.strokeStyle = "#000000";
                strokeTextShrinkToFit(...levelTextArgs);

                this.superMinerPane.context.fillStyle = "#FFFFFF";
                fillTextShrinkToFit(...levelTextArgs);


                if(buttonIcon)
                {
                    this.superMinerPane.context.drawImage(buttonIcon, 0, 0, buttonIcon.width, buttonIcon.height, boundingBox.x + buttonOffset, boundingBox.y + (boundingBox.height * 0.79), boundingBox.width * .27, boundingBox.width * .27);
                }

                this.superMinerPane.context.fillStyle = "#000000";
                this.superMinerPane.context.textBaseline = "middle";
                fillTextWrapWithHeightLimit(
                    this.superMinerPane.context,
                    superMiner.name,
                    boundingBox.x,
                    boundingBox.y + (boundingBox.height * 0.08),
                    boundingBox.width,
                    boundingBox.height * .1,
                    "center"
                );
            }

            let scrapButton = this.superMinerPane.getHitboxById("scrapButton_" + i)
            if(scrapButton)
            {
                this.superMinerPane.context.drawImage(stopb, 0, 0, stopb.width, stopb.height, scrapButton.boundingBox.x, scrapButton.boundingBox.y, scrapButton.boundingBox.width, scrapButton.boundingBox.height)
                this.superMinerPane.context.lineWidth = 5;
                this.superMinerPane.context.strokeStyle = "#000000";
                this.superMinerPane.context.fillStyle = "#FFFFFF";
                this.superMinerPane.context.textBaseline = "middle";
                strokeTextWrapWithHeightLimit(this.superMinerPane.context, _("Scrap"), scrapButton.boundingBox.x + (scrapButton.boundingBox.width * 0.1), scrapButton.boundingBox.y + (scrapButton.boundingBox.height * 0.5), scrapButton.boundingBox.width * 0.8, scrapButton.boundingBox.height * .7, "center");
                fillTextWrapWithHeightLimit(this.superMinerPane.context, _("Scrap"), scrapButton.boundingBox.x + (scrapButton.boundingBox.width * 0.1), scrapButton.boundingBox.y + (scrapButton.boundingBox.height * 0.5), scrapButton.boundingBox.width * 0.8, scrapButton.boundingBox.height * .7, "center");
            }
        }

        let purchaseSlot = this.purchaseButton;
        this.superMinerPane.context.drawImage(smallAddFrame, 0, 0, smallAddFrame.width, smallAddFrame.height, purchaseSlot.boundingBox.x, purchaseSlot.boundingBox.y, purchaseSlot.boundingBox.width, purchaseSlot.boundingBox.height);
        this.superMinerPane.context.font = (this.superMinerPane.boundingBox.height * .05) + "px KanitM"
        this.superMinerPane.context.fillStyle = superMinerManager.canUpgradeSlot() ? "#bebebe" : "#b65d5e"
        this.superMinerPane.context.drawImage(souls.smallIcon, 0, 0, souls.smallIcon.width, souls.smallIcon.height, purchaseSlot.boundingBox.x + (purchaseSlot.boundingBox.width * 0.15), purchaseSlot.boundingBox.y + (purchaseSlot.boundingBox.height * 0.7), this.boundingBox.width * .03, this.boundingBox.width * .03);
        fillTextWrapWithHeightLimit(this.superMinerPane.context, superMinerManager.nextSlotCost(), purchaseSlot.boundingBox.x + (purchaseSlot.boundingBox.width * 0.4), purchaseSlot.boundingBox.y + (purchaseSlot.boundingBox.height * 0.8), purchaseSlot.boundingBox.width * 0.5, purchaseSlot.boundingBox.height * .7, "left");


        let trashButton = this.trashButton;
        let trashAsset = this.showScrapButtons ? window["trashb2"] : window["trashb"];
        this.superMinerPane.context.drawImage(trashAsset, 0, 0, trashAsset.width, trashAsset.height, trashButton.boundingBox.x, trashButton.boundingBox.y, trashButton.boundingBox.width, trashButton.boundingBox.height);

    }

}