class CaveManagementWindow extends TabbedPopupWindow
{
    layerName = "caveManagement"; // Used as key in activeLayers
    domElementId = "CAVESYSTEMD"; // ID of dom element that gets shown or hidden
    context = CAVESYSTEM;         // Canvas rendering context for popup
    frameWidthFraction = 0.03;
    frameHeightFraction = 0.037;
    frameRightShadowFraction = 0.01;
    frameBottomShadowFraction = 0.05;

    lastRenderTreasureLength = -1;

    constructor(boundingBox)
    {
        super(boundingBox);
        this.popupFrameImage = caveManagerFrame;
        this.backgroundImage = popupBackground;
        this.context.imageSmoothingEnabled = true;
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        this.initializeTabs([_("Caves"), _("Drones")]);
        this.initializeCaveList();
        this.treasureScrollbox = new Scrollbox(
            this.bodyContainer.boundingBox.width * 0.65,
            1,
            this.context,
            this.bodyContainer.boundingBox.x + this.boundingBox.width * 0.175 - 15,
            this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * 0.84,
            this.bodyContainer.boundingBox.width * 0.65,
            this.bodyContainer.boundingBox.height * 0.17,
            15
        );
        this.treasureScrollbox.isVisible = () => this.currentTabIndex == 0;
        this.treasureScrollbox.isEnabled = () => this.currentTabIndex == 0;
        this.addHitbox(this.treasureScrollbox);

        this.blueprintPaneDefaultWidth = this.bodyContainer.boundingBox.width * 0.4;
        this.blueprintPane = new Scrollbox(
            this.blueprintPaneDefaultWidth - 15,
            this.bodyContainer.boundingBox.height,
            this.context,
            this.bodyContainer.boundingBox.x,
            this.bodyContainer.boundingBox.y,
            this.blueprintPaneDefaultWidth,
            this.bodyContainer.boundingBox.height,
            15
        );
        this.blueprintPane.isVisible = () => this.currentTabIndex == 1;
        this.blueprintPane.isEnabled = () => this.currentTabIndex == 1;
        this.addHitbox(this.blueprintPane);
        this.craftingPane = new Hitbox(
            {
                x: this.blueprintPaneDefaultWidth,
                y: 0,
                width: this.bodyContainer.boundingBox.width - this.blueprintPaneDefaultWidth,
                height: this.bodyContainer.boundingBox.height
            },
            {},
            "",
            "craftingPane"
        )
        this.craftingPane.isVisible = () => this.currentTabIndex == 1;
        this.craftingPane.isEnabled = () => this.currentTabIndex == 1;
        this.craftingPane.render = function ()
        {
            var context = this.parent.parent.context;
            var coords = this.getRelativeCoordinates(0, 0, this.parent.parent);
            context.save();
            context.fillStyle = "#444444";
            context.fillRect(coords.x, coords.y, 3, this.boundingBox.height);
            this.renderChildren();
        }
        this.craftingPane.allowBubbling = true;
        this.bodyContainer.addHitbox(this.craftingPane);
        this.initializeBlueprintList();
        this.initializeCraftingPane();
    }

    onTabChange()
    {
        this.initializeBlueprintList();
    }

    render()
    {
        this.clearCanvas();
        if(treasureStorage.treasure.length != this.lastRenderTreasureLength)
        {
            this.generateTreasureScrollboxContents();
        }
        this.renderChildren();
        if(this.currentTabIndex == 0)
        {
            this.context.save();
            this.context.fillStyle = "#FFFFFF";
            this.context.font = "24px KanitM";
            this.context.textBaseline = "top";
            fillTextWrap(
                this.context,
                _("Active Caves"),
                this.bodyContainer.boundingBox.x,
                this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * 0.01,
                this.bodyContainer.boundingBox.width,
                "center"
            );
            fillTextWrap(
                this.context,
                _("Stored Treasure"),
                this.bodyContainer.boundingBox.x,
                this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * 0.785,
                this.bodyContainer.boundingBox.width,
                "center"
            );
            this.context.restore();
        }
    }

    initializeCaveList()
    {
        var lineHeightFraction = 0.09;
        this.caveList = new Hitbox(
            {
                x: this.bodyContainer.boundingBox.x,
                y: this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * 0.02,
                width: this.bodyContainer.boundingBox.width,
                height: this.bodyContainer.boundingBox.height * 0.75,
            },
            {},
            ""
        );
        this.caveList.id = "caveList";
        this.caveList.allowBubbling = true;
        this.addHitbox(this.caveList);
        this.caveList.isVisible = () => this.currentTabIndex == 0;
        this.caveList.isEnabled = () => this.currentTabIndex == 0;
        for(var i = 0; i < MAX_CAVE_SYSTEMS_AT_A_TIME; ++i)
        {
            var lineYCoordinate = (this.caveList.boundingBox.height * (.07 + (lineHeightFraction * i))) - 2;
            var newLine = this.caveList.addHitbox(new Hitbox(
                {
                    x: 0,
                    y: lineYCoordinate,
                    width: this.caveList.boundingBox.width,
                    height: this.caveList.boundingBox.height * lineHeightFraction
                },
                {
                    onmousedown: function (caveIndex)
                    {
                        var activeCaves = getActiveCaves();
                        if(caveIndex < activeCaves.length)
                        {
                            changeViewedDepth(activeCaves[caveIndex].kmDepth - currentlyViewedDepth + 2);
                            closeUi(this);
                            if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                            if(keysPressed["Shift"])
                            {
                                openUi(CaveWindow, null, activeCaves[caveIndex].kmDepth);
                            }
                        }
                    }.bind(this, i)
                },
                "pointer"
            ));
            newLine.isEnabled = function (caveIndex)
            {
                var activeCaves = getActiveCaves();
                return caveIndex < activeCaves.length && activeCaves[caveIndex].isActive
            }.bind(this, i);

            newLine.render = function (root, i)
            {
                var coords = this.getRelativeCoordinates(0, 0, root);
                var context = root.context;
                context.globalAlpha = 0.5;
                if(i % 2 == 0)
                {
                    context.fillStyle = "#000000";
                    context.fillRect(
                        coords.x,
                        coords.y,
                        this.boundingBox.width,
                        this.boundingBox.height,
                    );
                }
                context.globalAlpha = 1;
                var barHeight = this.boundingBox.height;
                context.font = "15px Verdana";
                context.textBaseline = "middle";
                var activeCaves = getActiveCaves();
                if(i < activeCaves.length)
                {
                    var cave = activeCaves[i];
                    var fuelBarWidth = this.boundingBox.width / 2.5;
                    context.fillStyle = "#FFFFFF";
                    fillTextShrinkToFit(
                        context,
                        cave.kmDepth + "km",
                        coords.x,
                        coords.y + barHeight / 2,
                        barHeight * 3,
                        "center"
                    );
                    renderFancyProgressBar(
                        context,
                        _("Time Remaining: {0}", formattedCountDown(cave.remainingSeconds)),
                        cave.remainingSeconds / cave.totalDuration,
                        coords.x + barHeight * 3,
                        coords.y + barHeight * 0.075,
                        this.boundingBox.width / 2.5,
                        barHeight * 0.85,
                        "#7F7F7F",
                        "#000000",
                        "#FFFFFF",
                        timerFrame
                    );
                    renderFancyProgressBar(
                        context,
                        _("Fuel: {0}/{1}", Math.floor(cave.currentFuel), caveMaxFuelStructure.statValueForCurrentLevel()),
                        cave.currentFuel / caveMaxFuelStructure.statValueForCurrentLevel(),
                        coords.x + barHeight * 3.5 + this.boundingBox.width / 2.5,
                        coords.y + barHeight * 0.075,
                        fuelBarWidth,
                        barHeight * 0.85,
                        "#5EB65D",
                        "#000000",
                        "#FFFFFF",
                        timerFrame
                    );
                    this.renderChildren();
                }
                else if(i == 0)
                {
                    context.textBaseline = "middle";
                    context.fillStyle = "#FFFFFF";
                    fillTextShrinkToFit(
                        context,
                        _("Any caves that spawn will be listed here"),
                        coords.x,
                        coords.y + this.boundingBox.height / 2,
                        this.boundingBox.width,
                        "center"
                    )
                }
            }.bind(newLine, this, i);
            // newLine.addHitbox(new Button(
            //     closei, "", "", "",
            //     {
            //         x: newLine.boundingBox.height * 0.075,
            //         y: newLine.boundingBox.height * 0.075,
            //         width: newLine.boundingBox.height * 0.85,
            //         height: newLine.boundingBox.height * 0.85
            //     },
            //     {
            //         onmousedown: function (i)
            //         {
            //             var activeCaves = getActiveCaves();
            //             if(i < activeCaves.length && confirm(_("Are you sure you want to collapse this cave? Any uncollected treasure will be lost.")))
            //             {
            //                 for(var j in caves)
            //                 {
            //                     if(caves[j] == activeCaves[i])
            //                     {
            //                         caves[j] = createCaveSystem(0, 0, 1)
            //                         caves[j].isActive = false;
            //                     }
            //                 }
            //             }
            //         }.bind(this, i),
            //         onmouseenter: function ()
            //         {
            //             var coords = this.getGlobalCoordinates(0, this.boundingBox.height);
            //             showTooltip(
            //                 _("Collapse Cave"),
            //                 "",
            //                 coords.x * uiScaleX,
            //                 coords.y * uiScaleY
            //             );
            //         }.bind(newLine),
            //         onmouseexit: function ()
            //         {
            //             hideTooltip();
            //         }
            //     },
            //     'pointer',
            //     "closeButton"
            // ));
        }
    }

    generateTreasureScrollboxContents()
    {
        this.lastRenderTreasureLength = treasureStorage.treasure.length;
        var box = this.treasureScrollbox;
        var slotSize = 42;
        var iconSize = 30;
        var padding = 10;
        box.clearHitboxes();
        box.context.save();
        box.context.clearRect(0, 0, box.contentWidth, box.contentWidth);
        var slotsPerRow = Math.min(9, Math.floor((box.contentWidth - padding * 2) / slotSize));
        var totalRows = Math.max(2, Math.ceil(MAX_STORED_TREASURE / slotsPerRow));
        var slotSpacingX = ((box.contentWidth - padding * 2) - (slotSize * slotsPerRow)) / (slotsPerRow - 1);
        var slotSpacingY = slotSpacingX / 3;
        box.contentHeight = totalRows * slotSize + (totalRows - 1) * slotSpacingY + 1;
        box.initializeScrollbar();
        box.canvas.height = box.contentHeight;
        box.setScale();
        for(var i = 0; i < MAX_STORED_TREASURE; ++i)
        {
            var indexInRow = i % slotsPerRow;
            var slotX = padding + indexInRow * (slotSize + slotSpacingX);
            var slotY = Math.floor(i / slotsPerRow) * (slotSize + slotSpacingY);
            box.context.fillStyle = "#000000";
            box.context.globalAlpha = 0.5;
            box.context.fillRect(slotX, slotY, slotSize, slotSize);
            box.context.globalAlpha = 1;
            if(i < treasureStorage.treasure.length)
            {
                var item = treasureStorage.treasure[i];
                box.context.imageSmoothingEnabled = false;
                drawImageFitInBox(
                    box.context,
                    item.icon,
                    slotX + (slotSize - iconSize) / 2,
                    slotY + (slotSize - iconSize) / 2,
                    iconSize,
                    iconSize
                );
                box.addHitbox(new Hitbox(
                    {
                        x: slotX,
                        y: slotY,
                        width: slotSize,
                        height: slotSize,
                    },
                    {
                        onmousedown: function (item, index)
                        {
                            treasureStorage.grantAndRemove(index);
                        }.bind(this, item, i),
                        onmouseenter: function (item, x, y)
                        {
                            var coords = this.getGlobalCoordinates(x, y + slotSize);
                            showTooltip(
                                item.getName(),
                                "",
                                coords.x * uiScaleX,
                                coords.y * uiScaleY
                            );
                        }.bind(this.treasureScrollbox, item, slotX, slotY),
                        onmouseexit: function ()
                        {
                            hideTooltip();
                        }
                    },
                    "pointer"
                )
                );
            }
            box.context.drawImage(
                itemFrame,
                slotX,
                slotY,
                slotSize,
                slotSize
            );
        }
        box.context.restore();
    }

    initializeBlueprintList()
    {
        var parentHitbox = this.blueprintPane;
        parentHitbox.clearHitboxes();
        this.blueprintListHitboxes = [];
        this.generateMenuContents(this.blueprintPane);
        parentHitbox.isDirty = true;
        // parentHitbox.render();
        // this.render();
    }

    generateMenuContents(scrollbox)
    {
        var slotSize = 56;
        var padding = 3;
        scrollbox.context.save();
        scrollbox.context.clearRect(0, 0, scrollbox.canvas.width, scrollbox.canvas.height);
        var craftCategory = craftingCategories.droneUpgrades;
        var blueprintList = getKnownBlueprints();
        var blueprintsInCategory = filterBlueprintsByCategory(blueprintList, craftCategory);
        var slotsPerRow = Math.floor((scrollbox.boundingBox.width - padding * 2 - 15) / slotSize);
        var totalRows = Math.ceil(blueprintsInCategory / slotsPerRow);
        var slotSpacing = ((scrollbox.boundingBox.width - padding * 2 - 15) - (slotSize * slotsPerRow)) / (slotsPerRow - 1);
        scrollbox.contentHeight = totalRows * (slotSize + slotSpacing) + 2 * padding;
        for(var i = 0; i < blueprintsInCategory.length; ++i)
        {
            var indexInRow = i % slotsPerRow;
            var slotX = padding + indexInRow * (slotSize + slotSpacing);
            var slotY = padding + Math.floor(i / slotsPerRow) * (slotSize + slotSpacing);
            var blueprint = blueprintsInCategory[i];
            scrollbox.context.globalAlpha = 0.5;
            scrollbox.context.fillStyle = "#000000";
            scrollbox.context.fillRect(
                slotX,
                slotY,
                slotSize,
                slotSize
            );
            scrollbox.context.globalAlpha = 1;
            drawImageFitInBox(
                scrollbox.context,
                blueprint.craftedItem.item.getIcon(),
                slotX,
                slotY,
                slotSize - 6,
                slotSize - 6
            );
            drawImageFitInBox(
                scrollbox.context,
                itemFrame,
                slotX,
                slotY,
                slotSize,
                slotSize
            );
            if(this.selectedBlueprintIndex == i)
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
            var blueprintHitbox = new Hitbox(
                {
                    x: slotX,
                    y: slotY,
                    width: slotSize,
                    height: slotSize
                },
                {
                    onmousedown: function (blueprint, i)
                    {
                        this.selectedBlueprint = blueprint;
                        if(blueprint.hasOwnProperty("levels"))
                        {
                            var nextLevel = 1 + this.selectedBlueprint.craftedItem.item.getCurrentLevel();
                            if(!blueprint.craftedItem.item.isAtMaxLevel())
                            {
                                this.discountedIngredients = getIngredientListWithDiscounts(blueprint.levels[nextLevel].ingredients);
                            }
                            else
                            {
                                this.discountedIngredients = null;
                            }
                        }
                        this.initializeCraftingPane();
                    }.bind(this, blueprint, i),
                    onmouseenter: function (blueprint, x, y)
                    {
                        var coords = this.getGlobalCoordinates(x, y);
                        showTooltip(
                            blueprint.craftedItem.item.getName(),
                            blueprint.craftedItem.item.getDescription(),
                            coords.x * uiScaleX,
                            coords.y * uiScaleY
                        );
                    }.bind(scrollbox, blueprint, slotX, slotY + slotSize),
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "pointer"
            );
            scrollbox.addHitbox(blueprintHitbox, true);
        }
        scrollbox.context.restore();
    }

    initializeCraftingPane()
    {
        if(this.selectedBlueprint)
        {
            if(this.currentTabIndex == 1)
            {
                if(this.selectedBlueprint.hasOwnProperty("levels"))
                {
                    var nextLevel = 1 + this.selectedBlueprint.craftedItem.item.getCurrentLevel();
                    if(!this.selectedBlueprint.craftedItem.item.isAtMaxLevel())
                    {
                        this.discountedIngredients = getIngredientListWithDiscounts(this.selectedBlueprint.levels[nextLevel].ingredients);
                    }
                    else
                    {
                        this.discountedIngredients = null;
                    }
                }
            }

            if(isBlueprintUnseen(this.selectedBlueprint.category, this.selectedBlueprint.id))
            {
                flagBlueprintAsSeen(this.selectedBlueprint.category, this.selectedBlueprint.id);
            }
            this.initializeBlueprintList();
            this.craftingPane.clearHitboxes();
            var isSelectedBlueprintKnown = isBlueprintKnown(
                this.selectedBlueprint.category,
                this.selectedBlueprint.id
            );
            var isSelectedBlueprintAvailable = isBlueprintAvailable(
                this.selectedBlueprint.category,
                this.selectedBlueprint.id
            );
            var xPadding = 20;
            var yPadding = this.boundingBox.height * 0.07;
            var iconSize = Math.min(55, Math.ceil(this.boundingBox.height * 0.128));
            var titleBoxPadding = iconSize / 10;
            var blueprintNameBox = new Hitbox(
                {
                    x: xPadding,
                    y: yPadding,
                    width: this.craftingPane.boundingBox.width - 2 * xPadding,
                    height: iconSize + 2 * titleBoxPadding
                },
                {},
                "",
                "blueprintNameBox"
            );
            blueprintNameBox.render = function (parentWindow)
            {
                var context = parentWindow.getContext();
                var relativeCoords = this.getRelativeCoordinates(0, 0, parentWindow);
                context.save();
                context.globalAlpha = 0.6;
                context.fillStyle = "#111111";
                context.fillRect(relativeCoords.x, relativeCoords.y, this.boundingBox.width, this.boundingBox.height);
                context.globalAlpha = 1;
                var fontSize = Math.min(22, parentWindow.boundingBox.height * 0.055);
                context.font = fontSize + "px KanitM";
                context.fillStyle = "#FFFFFF";
                context.textBaseline = "top";
                fillTextWrap(
                    context,
                    parentWindow.selectedBlueprint.craftedItem.item.getName(),
                    relativeCoords.x + iconSize + titleBoxPadding * 4,
                    relativeCoords.y + titleBoxPadding,
                    this.boundingBox.width - iconSize - titleBoxPadding * 5,
                    "left",
                    0.25
                );
                context.restore();
                this.renderChildren();
            }.bind(blueprintNameBox, this);
            var blueprintIcon = new Hitbox(
                {
                    x: titleBoxPadding,
                    y: titleBoxPadding,
                    width: iconSize,
                    height: iconSize
                },
                {
                    onmouseenter: function (blueprint, x, y)
                    {
                        var coords = this.getGlobalCoordinates(x, y);
                        var rawIngredients = getRawIngredientsForBlueprint(blueprint);
                        var ingredientsString = _("Requires") + ":<br>";
                        for(var i in rawIngredients)
                        {
                            ingredientsString += i + ": " + rawIngredients[i] + "<br>";
                        }
                        showTooltip(
                            _(blueprint.craftedItem.item.getName()),
                            blueprint.craftedItem.item.getDescription(),
                            coords.x * uiScaleX,
                            coords.y * uiScaleY
                        );
                    }.bind(blueprintNameBox, this.selectedBlueprint, titleBoxPadding, titleBoxPadding + iconSize),
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "pointer",
                "blueprintIcon"
            );
            blueprintIcon.render = function (parentWindow)
            {
                var context = this.getContext();
                var blueprint = parentWindow.selectedBlueprint;
                var relativeCoords = this.getRelativeCoordinates(0, 0, parentWindow);
                context.save();
                context.imageSmoothingEnabled = false;
                drawImageFitInBox(context, blueprint.craftedItem.item.getIcon(), relativeCoords.x, relativeCoords.y, iconSize, iconSize);

                if(blueprint.category != 1 && blueprint.craftedItem.item.getQuantityOwned() > -1)
                {
                    var nextLevel = blueprint.craftedItem.item.getCurrentLevel() + 1;
                    context.fillStyle = "#FFFFFF";
                    var fontSize = Math.min(16, this.boundingBox.height * 0.037);
                    context.font = fontSize + "px Verdana";
                    context.textBaseline = "bottom";
                    strokeTextShrinkToFit(
                        parentWindow.context,
                        nextLevel,
                        relativeCoords.x,
                        relativeCoords.y + iconSize,
                        this.boundingBox.height,
                        "right"
                    );
                    fillTextShrinkToFit(
                        parentWindow.context,
                        nextLevel,
                        relativeCoords.x,
                        relativeCoords.y + iconSize,
                        this.boundingBox.height,
                        "right"
                    );
                }
                context.restore();
            }.bind(blueprintIcon, this);
            var ingredientsFontSize = Math.min(16, this.boundingBox.height * 0.037);
            var blueprintIngredientsBox = new Hitbox(
                {
                    x: xPadding,
                    y: ingredientsFontSize + blueprintNameBox.boundingBox.y + blueprintNameBox.boundingBox.height + titleBoxPadding,
                    width: blueprintNameBox.boundingBox.width,
                    height: titleBoxPadding * 4 + iconSize * 2 + ingredientsFontSize * 2
                },
                {}, "", "ingredients"
            );
            blueprintIngredientsBox.render = function (parentWindow)
            {
                var context = this.getContext();
                var relativeCoords = this.getRelativeCoordinates(0, 0, parentWindow);
                context.save();
                context.fillStyle = "#FFFFFF";
                context.font = ingredientsFontSize + "px KanitB";
                fillTextWrap(context, _("Blueprint"), relativeCoords.x, relativeCoords.y + ingredientsFontSize, parentWindow.boundingBox.width);
                context.font = ingredientsFontSize + "px KanitM";
                fillTextWrap(context, parentWindow.selectedBlueprint.craftedItem.item.getDescription(), relativeCoords.x, relativeCoords.y + ingredientsFontSize + 24, parentWindow.boundingBox.width - relativeCoords.x, "left", 0.25);
                context.globalAlpha = 0.6;
                context.fillStyle = "#111111";
                context.fillRect(relativeCoords.x, relativeCoords.y + ingredientsFontSize * 13, this.boundingBox.width, this.boundingBox.height - ingredientsFontSize * 13);
                context.globalAlpha = 1;
                context.restore();
                this.renderChildren();
            }.bind(blueprintIngredientsBox, this);
            var slotsPerRow = Math.floor((blueprintIngredientsBox.boundingBox.width - titleBoxPadding * 2) / iconSize);
            var slotSpacing = ((blueprintIngredientsBox.boundingBox.width - titleBoxPadding * 2) - (iconSize * slotsPerRow)) / (slotsPerRow - 1);

            if(isSelectedBlueprintKnown || isSelectedBlueprintAvailable)
            {
                var yOffset = ingredientsFontSize * 13;
                for(var i in this.discountedIngredients)
                {
                    var indexInRow = i % slotsPerRow;
                    var slotX = titleBoxPadding + indexInRow * (iconSize + slotSpacing);
                    var slotY = titleBoxPadding + Math.floor(i / slotsPerRow) * (iconSize + slotSpacing);
                    var ingredientIcon = new Hitbox(
                        {
                            x: slotX,
                            y: slotY + yOffset,
                            width: iconSize,
                            height: iconSize
                        },
                        {
                            onmouseenter: function (ingredient, x, y)
                            {
                                var coords = this.getGlobalCoordinates(x, y);
                                showTooltip(
                                    _(ingredient.item.getName()),
                                    _("Owned: {0}<br>Required: {1}", beautifynum(ingredient.item.getQuantityOwned()), beautifynum(ingredient.quantity)),
                                    coords.x * uiScaleX,
                                    coords.y * uiScaleY
                                );
                            }.bind(blueprintIngredientsBox, this.discountedIngredients[i], slotX, slotY + iconSize + ingredientsFontSize),

                            onmouseexit: function ()
                            {
                                hideTooltip();
                            }
                        },
                        "pointer"
                    )
                    ingredientIcon.render = function (parentWindow, ingredient)
                    {
                        var context = this.getContext();
                        var relativeCoords = this.getRelativeCoordinates(0, 0, parentWindow);
                        drawImageFitInBox(context, ingredient.item.getIcon(), relativeCoords.x, relativeCoords.y, iconSize, iconSize);
                        context.fillStyle = "#FFFFFF";
                        var fontSize = Math.min(16, parentWindow.boundingBox.height * 0.037);
                        context.font = fontSize + "px Verdana";
                        context.textBaseline = "bottom";
                        context.lineWidth = 3;
                        context.strokeStyle = "#000000";
                        strokeTextShrinkToFit(
                            context,
                            ingredient.item.getFormattedQuantity(ingredient.quantity),
                            relativeCoords.x,
                            relativeCoords.y + iconSize,
                            iconSize * 0.95,
                            "right"
                        );
                        fillTextShrinkToFit(
                            context,
                            ingredient.item.getFormattedQuantity(ingredient.quantity),
                            relativeCoords.x,
                            relativeCoords.y + iconSize,
                            iconSize * 0.95,
                            "right"
                        );
                        if(ingredient.item.hasQuantity(ingredient.quantity))
                        {
                            // drawImageFitInBox(context, checkmark, relativeCoords.x, relativeCoords.y, iconSize / 5, iconSize / 5);
                            renderCheckmark(context, relativeCoords.x, relativeCoords.y, iconSize / 5, iconSize / 5);
                        }
                        else
                        {
                            // drawImageFitInBox(context, xmark, relativeCoords.x, relativeCoords.y, iconSize / 5, iconSize / 5);
                            renderXMark(context, relativeCoords.x, relativeCoords.y, iconSize / 5, iconSize / 5);
                        }
                    }.bind(ingredientIcon, this, this.discountedIngredients[i]);
                    blueprintIngredientsBox.addHitbox(ingredientIcon);
                    blueprintIngredientsBox.boundingBox.height = ingredientIcon.boundingBox.y + ingredientIcon.boundingBox.height;
                }
            }
            var craftButton = new Hitbox(
                {
                    x: blueprintNameBox.boundingBox.x + blueprintNameBox.boundingBox.width * 0.05,
                    y: this.craftingPane.boundingBox.height - yPadding - 10,
                    width: blueprintNameBox.boundingBox.width * 0.9,
                    height: 38
                },
                {
                    onmousedown: function ()
                    {
                        var level = this.selectedBlueprint.craftedItem.item.getCurrentLevel();
                        if(craftBlueprint(this.selectedBlueprint.category, this.selectedBlueprint.id, level + 1, this.discountedIngredients))
                        {
                            newNews(_("You crafted {0}", this.selectedBlueprint.craftedItem.item.getName()), true);
                            if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                        }
                        this.initializeCraftingPane();
                    }.bind(this),
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "pointer",
                "craftButton"
            )
            craftButton.onmouseenter = function (parentWindow)
            {
                if(parentWindow.currentTabIndex == 0 && !canCraftBlueprint(parentWindow.selectedBlueprint.category, parentWindow.selectedBlueprint.id, 0, parentWindow.discountedIngredients))
                {
                    var coords = this.getGlobalCoordinates(0, this.boundingBox.height);
                    showTooltip(getBlueprintNotCraftableReason(parentWindow.selectedBlueprint.category, parentWindow.selectedBlueprint.id), "", coords.x, coords.y);
                }
            }.bind(craftButton, this);
            craftButton.render = function (parentWindow)
            {
                var context = parentWindow.context;
                context.save();
                var relativeCoords = this.getRelativeCoordinates(0, 0, parentWindow);
                var nextLevel = 1 + parentWindow.selectedBlueprint.craftedItem.item.getCurrentLevel();
                var buttonText;
                if(parentWindow.selectedBlueprint.craftedItem.item.isAtMaxLevel())
                {
                    context.drawImage(upgradebg_blank, relativeCoords.x, relativeCoords.y, this.boundingBox.width, this.boundingBox.height);
                    context.fillStyle = "#444444";
                    buttonText = _("Max Level");
                }
                else if(
                    isSelectedBlueprintKnown &&
                    canCraftBlueprint(parentWindow.selectedBlueprint.category, parentWindow.selectedBlueprint.id, nextLevel, parentWindow.discountedIngredients)
                )
                {
                    context.drawImage(upgradeb, relativeCoords.x, relativeCoords.y, this.boundingBox.width, this.boundingBox.height);
                    context.fillStyle = "#000000";
                    buttonText = _("Upgrade");
                }
                else
                {
                    context.drawImage(upgradebg_blank, relativeCoords.x, relativeCoords.y, this.boundingBox.width, this.boundingBox.height);
                    context.fillStyle = "#444444";
                    buttonText = _("Upgrade");
                }
                context.textBaseline = "middle";
                var fontSize = Math.min(32, parentWindow.boundingBox.height * 0.080);
                context.font = fontSize + "px KanitB";
                fillTextShrinkToFit(context, buttonText, relativeCoords.x + 10, relativeCoords.y + this.boundingBox.height / 2 + 2, this.boundingBox.width - 20, "center");
                context.restore();
            }.bind(craftButton, this)
            this.craftingPane.addHitbox(blueprintNameBox);
            blueprintNameBox.addHitbox(blueprintIcon);
            this.craftingPane.addHitbox(blueprintIngredientsBox);
            this.craftingPane.addHitbox(craftButton);
            this.isCraftingPaneInitialized = true;
        }
        else
        {
            var instructionsText;
            if(this.currentTabIndex == 0 || this.currentTabIndex == 1)
            {
                if(knownBlueprints.length == 0 || knownBlueprints.length == 1 && knownBlueprints[0] == "")
                {
                    instructionsText = _("You don't own any blueprints. Find more in the mines.");
                }
                else
                {
                    instructionsText = _("Click on a drone on the left to upgrade it");
                }
            }
            this.craftingPane.clearHitboxes();
            var instructionsHitbox = new Hitbox(
                {
                    x: 20,
                    y: 20,
                    width: this.craftingPane.boundingBox.width - 40,
                    height: this.craftingPane.boundingBox.height - 40,
                },
                {},
                "",
                "instructionsHitbox"
            );
            instructionsHitbox.render = function (parentWindow)
            {
                var coords = this.getRelativeCoordinates(0, 0, parentWindow);
                var context = parentWindow.context;
                context.font = "18px Verdana";
                context.fillStyle = "#FFFFFF";
                context.textBaseline = "middle";
                fillTextWrap(
                    context,
                    instructionsText,
                    coords.x,
                    coords.y + this.boundingBox.height / 2 - 30,
                    this.boundingBox.width
                );
            }.bind(instructionsHitbox, this);
            this.craftingPane.addHitbox(instructionsHitbox);
        }
    }
}