class BuffLabWindow extends TabbedPopupWindow
{
    layerName = "bufflab"; // Used as key in activeLayers
    domElementId = "PITD"; // ID of dom element that gets shown or hidden
    context = PIT;         // Canvas rendering context for popup

    buffListPane;
    buffListPaneDefaultWidth;
    buffListHitboxes;

    buffCraftingPane;
    isBuffCraftingPaneInitialized = false;
    selectedBuffIndex;

    currentEnergyDisplayFontSize = 18;

    constructor(boundingBox)
    {
        super(boundingBox);
        if(!boundingBox)
        {
            this.setBoundingBox();
        }
        this.context.imageSmoothingEnabled = false;
        this.setFrameImagesByWorldIndex(MOON_INDEX);

        this.initializeTabs([_("Craft Buffs"), _("Lab Stats")]);
        this.buffListPaneDefaultWidth = this.bodyContainer.boundingBox.width * 0.4;
        this.buffListPane = new Scrollbox(
            this.buffListPaneDefaultWidth - 15,
            this.bodyContainer.boundingBox.height,
            this.context,
            this.bodyContainer.boundingBox.x,
            this.bodyContainer.boundingBox.y,
            this.buffListPaneDefaultWidth,
            this.bodyContainer.boundingBox.height,
            15
        );
        this.addHitbox(this.buffListPane);
        this.buffCraftingPane = new Hitbox(
            {
                x: this.buffListPaneDefaultWidth,
                y: 0,
                width: this.bodyContainer.boundingBox.width - this.buffListPaneDefaultWidth,
                height: this.bodyContainer.boundingBox.height
            },
            {},
            "",
            "buffCraftingPane"
        )
        this.buffCraftingPane.render = function (parent)
        {
            var root = this.getRootLayer();
            var coords = this.getRelativeCoordinates(0, 0, root);
            var context = root.getContext();
            var selectedBuff;
            if(typeof (root.selectedBuffIndex) !== 'undefined' && root.selectedBuffIndex !== null)
            {
                selectedBuff = buffsPurchaseOptions[root.selectedBuffIndex].staticBuff();
            }
            if(parent.selectedBuffIndex || parent.selectedBuffIndex === 0)
            {
                context.save();
                context.fillStyle = "#444444";
                context.fillRect(coords.x, coords.y, 3, this.boundingBox.height);
                context.fillStyle = "#FFFFFF";
                context.textBaseline = "top";
                context.font = "24px Verdana";
                fillTextShrinkToFit(
                    context,
                    _("{0} Buff", selectedBuff.name),
                    coords.x + 15,
                    coords.y + 15 + parent.currentEnergyDisplayFontSize,
                    this.boundingBox.width * 0.9
                );

                context.font = "14px Verdana";
                fillTextWrap(
                    context,
                    buffsPurchaseOptions[root.selectedBuffIndex].formattedDescription(),
                    coords.x + 15,
                    coords.y + 50 + parent.currentEnergyDisplayFontSize,
                    this.boundingBox.width * 0.9
                );
                context.restore();
                this.renderChildren();
            }
            else
            {
                context.fillStyle = "#FFFFFF";
                context.textBaseline = "middle";
                fillTextWrap(
                    context,
                    _("Click a buff on the left to purchase it with energy"),
                    coords.x,
                    coords.y + this.boundingBox.height / 2 - 30 + parent.currentEnergyDisplayFontSize,
                    this.boundingBox.width
                );
            }
        }.bind(this.buffCraftingPane, this);
        this.buffCraftingPane.allowBubbling = true;
        this.bodyContainer.addHitbox(this.buffCraftingPane);

        this.initializeBuffList();
        var craftButton = new Hitbox(
            {
                x: this.buffCraftingPane.boundingBox.width * 0.05,
                y: this.buffCraftingPane.boundingBox.height * 0.8,
                width: this.buffCraftingPane.boundingBox.width * 0.9,
                height: 38
            },
            {
                onmousedown: function ()
                {
                    if(this.selectedBuffIndex == null)
                    {
                        return;
                    }
                    var selectedBuffPurchaseOption = buffsPurchaseOptions[this.selectedBuffIndex];

                    if(selectedBuffPurchaseOption.canPurchase())
                    {
                        selectedBuffPurchaseOption.purchase();
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                }.bind(this),
                onmouseexit: function ()
                {
                    hideTooltip();
                }
            },
            "pointer",
            "craftButton"
        )
        craftButton.onmouseenter = function (root)
        {
            var selectedBuffPurchaseOption = buffsPurchaseOptions[root.selectedBuffIndex];
            if(!selectedBuffPurchaseOption.canPurchase())
            {
                var coords = this.getGlobalCoordinates(0, this.boundingBox.height);
                showTooltip(
                    _(
                        "Missing {0} Energy",
                        beautifynum(selectedBuffPurchaseOption.energyCost - worldResources[NUCLEAR_ENERGY_INDEX].numOwned)
                    ),
                    "",
                    coords.x,
                    coords.y
                );
            }
        }.bind(craftButton, this)
        craftButton.render = function (parentWindow)
        {
            var context = parentWindow.context;
            context.save();
            var relativeCoords = this.getRelativeCoordinates(0, 0, parentWindow);
            var selectedBuffPurchaseOption = buffsPurchaseOptions[parentWindow.selectedBuffIndex];
            if(selectedBuffPurchaseOption.canPurchase())
            {
                // this.setEnabled(true)
                this.cursor = "pointer";
                context.drawImage(upgradeb, relativeCoords.x, relativeCoords.y, this.boundingBox.width, this.boundingBox.height);
                context.fillStyle = "#000000";
            }
            else
            {
                // this.setEnabled(false)
                this.cursor = "";
                context.drawImage(upgradebg_blank, relativeCoords.x, relativeCoords.y, this.boundingBox.width, this.boundingBox.height);
                context.fillStyle = "#444444";
            }
            context.textBaseline = "middle";
            var buttonText;
            buttonText = _("{0} Energy", beautifynum(selectedBuffPurchaseOption.modifiedEnergyCost()));
            context.font = "32px KanitB";
            fillTextShrinkToFit(context, buttonText, relativeCoords.x + 10, relativeCoords.y + this.boundingBox.height / 2 + 2, this.boundingBox.width - 20, "center");
            context.restore();
        }.bind(craftButton, this);

        this.currentEnergyDisplay = new Hitbox(
            {
                x: this.buffCraftingPane.boundingBox.x,
                y: 0,
                width: this.buffCraftingPane.boundingBox.width,
                height: this.currentEnergyDisplayFontSize
            },
            {},
            ""
        )
        this.currentEnergyDisplay.render = function (parent)
        {
            var context = parent.context;
            context.save();
            context.font = parent.currentEnergyDisplayFontSize + "px Verdana";
            context.fillStyle = "#FFFFFF";
            context.textBaseline = "top";
            var coords = this.getRelativeCoordinates(0, 0, parent);
            fillTextWrap(
                context,
                _("Stored Energy: {0}", beautifynum(worldResources[NUCLEAR_ENERGY_INDEX].numOwned)) + "  ",
                coords.x,
                coords.y,
                this.boundingBox.width,
                "right"
            );
            drawImageFitInBox(
                context,
                worldResources[NUCLEAR_ENERGY_INDEX].smallIcon,
                coords.x + this.boundingBox.width - parent.currentEnergyDisplayFontSize,
                coords.y,
                parent.currentEnergyDisplayFontSize,
                parent.currentEnergyDisplayFontSize
            );
            context.fillStyle = "#444444";
            context.fillRect(coords.x, coords.y + this.boundingBox.height + 2, this.boundingBox.width, 3);
            context.restore();
        }.bind(this.currentEnergyDisplay, this);
        this.bodyContainer.addHitbox(this.currentEnergyDisplay);
        this.buffCraftingPane.addHitbox(craftButton);
        this.buffCraftingPane.setEnabled(false)
    }

    onTabChange()
    {
        this.selectedBuffIndex = null;
        this.buffCraftingPane.setVisible(this.currentTabIndex == 0)
        this.buffCraftingPane.setEnabled(this.currentTabIndex == 0)
        this.buffListPane.setEnabled(this.currentTabIndex == 0)
        this.buffListPane.setVisible(this.currentTabIndex == 0)
        this.currentEnergyDisplay.setEnabled(this.currentTabIndex == 0)
        this.currentEnergyDisplay.setVisible(this.currentTabIndex == 0)
        this.initializeBuffList();
    }

    render()
    {
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        super.render();
        if(this.currentTabIndex == 1)
        {
            this.context.save();
            this.context.fillStyle = "#FFFFFF";
            this.context.strokeStyle = "#000000";
            this.context.textBaseline = "bottom";
            this.context.lineWidth = 3;

            if(!bufflab.isMaxLevel())
            {
                var headerText = _("CURRENT");
                var levelText = _("Lab Level: {0}", buffLabStructure.level);
                var statsText = _("Discount: {0}%", (100 * bufflab.currentDiscount()));
                this.context.font = "bold 20px Verdana";
                this.context.strokeText(headerText, this.boundingBox.width * .25 - this.context.measureText(headerText).width / 2, this.boundingBox.height * .2);
                this.context.fillText(headerText, this.boundingBox.width * .25 - this.context.measureText(headerText).width / 2, this.boundingBox.height * .2);
                this.context.font = "20px Verdana";
                this.context.strokeText(levelText, this.boundingBox.width * .25 - this.context.measureText(levelText).width / 2, this.boundingBox.height * .27);
                this.context.fillText(levelText, this.boundingBox.width * .25 - this.context.measureText(levelText).width / 2, this.boundingBox.height * .27);
                this.context.strokeText(statsText, this.boundingBox.width * .25 - this.context.measureText(statsText).width / 2, this.boundingBox.height * .34);
                this.context.fillText(statsText, this.boundingBox.width * .25 - this.context.measureText(statsText).width / 2, this.boundingBox.height * .34);

                var headerText = _("NEXT LEVEL");
                var levelText = _("Lab Level: {0}", buffLabStructure.level + 1);
                var statsText = _("Discount: {0}%", (100 * bufflab.nextLevelDiscount()));
                this.context.font = "bold 20px Verdana";
                this.context.strokeText(headerText, this.boundingBox.width * .75 - this.context.measureText(headerText).width / 2, this.boundingBox.height * .2);
                this.context.fillText(headerText, this.boundingBox.width * .75 - this.context.measureText(headerText).width / 2, this.boundingBox.height * .2);
                this.context.font = "20px Verdana";
                this.context.strokeText(levelText, this.boundingBox.width * .75 - this.context.measureText(levelText).width / 2, this.boundingBox.height * .27);
                this.context.fillText(levelText, this.boundingBox.width * .75 - this.context.measureText(levelText).width / 2, this.boundingBox.height * .27);
                this.context.strokeText(statsText, this.boundingBox.width * .75 - this.context.measureText(statsText).width / 2, this.boundingBox.height * .34);
                this.context.fillText(statsText, this.boundingBox.width * .75 - this.context.measureText(statsText).width / 2, this.boundingBox.height * .34);
            }
            else
            {
                var labLevelUpCost = _("You Are At the Max Level");
                var levelText = _("Lab Level: {0}", buffLabStructure.level);
                var statsText = _("Discount: {0}%", (100 * bufflab.currentDiscount()));
                this.context.strokeText(labLevelUpCost, this.boundingBox.width * .5 - this.context.measureText(labLevelUpCost).width / 2, this.boundingBox.height * .4);
                this.context.fillText(labLevelUpCost, this.boundingBox.width * .5 - this.context.measureText(labLevelUpCost).width / 2, this.boundingBox.height * .4);
                this.context.strokeText(levelText, this.boundingBox.width * .5 - this.context.measureText(levelText).width / 2, this.boundingBox.height * .5);
                this.context.fillText(levelText, this.boundingBox.width * .5 - this.context.measureText(levelText).width / 2, this.boundingBox.height * .5);
                this.context.strokeText(statsText, this.boundingBox.width * .5 - this.context.measureText(statsText).width / 2, this.boundingBox.height * .6);
                this.context.fillText(statsText, this.boundingBox.width * .5 - this.context.measureText(statsText).width / 2, this.boundingBox.height * .6);
            }

            this.context.restore();
        }
    }

    initializeBuffList()
    {
        var parentHitbox = this.buffListPane;
        parentHitbox.clearHitboxes();
        this.buffListHitboxes = [];
        this.generateMenuContents(this.currentTabIndex, this.buffListPane);
        parentHitbox.isDirty = true;
        // parentHitbox.render();
        // this.render();
    }

    generateMenuContents(tabIndex, scrollbox)
    {
        var slotSize = 50;
        var padding = 3;
        scrollbox.context.save();
        scrollbox.context.clearRect(0, 0, scrollbox.canvas.width, scrollbox.canvas.height);
        if(tabIndex >= 0)
        {
            var itemsInCategory = buffsPurchaseOptions.length;
            var slotsPerRow = Math.floor((scrollbox.boundingBox.width - padding * 2 - 15) / slotSize);
            var totalRows = Math.ceil(itemsInCategory / slotsPerRow);
            var slotSpacing = ((scrollbox.boundingBox.width - padding * 2 - 15) - (slotSize * slotsPerRow)) / (slotsPerRow - 1);
            scrollbox.contentHeight = totalRows * (slotSize + slotSpacing) + 2 * padding;
            for(var i = 0; i < itemsInCategory; ++i)
            {
                var indexInRow = i % slotsPerRow;
                var slotX = padding + indexInRow * (slotSize + slotSpacing);
                var slotY = padding + Math.floor(i / slotsPerRow) * (slotSize + slotSpacing);
                var buffName, buffDescription, icon;
                var buffInMenu = buffsPurchaseOptions[i];
                buffName = buffInMenu.staticBuff().name;
                buffDescription = buffInMenu.formattedDescription();
                var icon = buffInMenu.staticBuff().image;
                scrollbox.context.globalAlpha = 0.2;
                scrollbox.context.fillStyle = "#000000";
                scrollbox.context.fillRect(slotX, slotY, slotSize, slotSize);
                scrollbox.context.globalAlpha = 1;
                scrollbox.context.drawImage(icon, slotX, slotY, slotSize, slotSize);

                if(this.selectedBuffIndex == i)
                {
                    scrollbox.context.strokeStyle = "#76E374";
                    scrollbox.context.lineWidth = 3;
                    scrollbox.context.beginPath();
                    scrollbox.context.strokeRect(
                        slotX + scrollbox.context.lineWidth,
                        slotY + scrollbox.context.lineWidth,
                        slotSize - 2 * scrollbox.context.lineWidth,
                        slotSize - 2 * scrollbox.context.lineWidth
                    );
                    scrollbox.context.stroke();
                }
                var itemHitbox = new Hitbox(
                    {
                        x: slotX,
                        y: slotY,
                        width: slotSize,
                        height: slotSize
                    },
                    {
                        onmousedown: function (i)
                        {
                            this.selectedBuffIndex = i;
                            this.buffCraftingPane.setEnabled(true)
                            this.buffCraftingPane.setVisible(true)
                            this.generateMenuContents(this.currentTabIndex, this.buffListPane);
                        }.bind(this, i),
                        onmouseenter: function (name, description, x, y)
                        {
                            var coords = this.getGlobalCoordinates(x, y);
                            showTooltip(
                                name,
                                description,
                                coords.x * uiScaleX,
                                coords.y * uiScaleY
                            );
                        }.bind(scrollbox, buffName, buffDescription, slotX, slotY + slotSize),
                        onmouseexit: function ()
                        {
                            hideTooltip();
                        }
                    },
                    "pointer"
                );
                scrollbox.addHitbox(itemHitbox, true);
            }
        }
        scrollbox.context.restore();
    }

    getBuffEnergyCost(buffIndex)
    {
        return Math.ceil(buffsPurchaseOptions[buffIndex].modifiedEnergyCost());
    }
}