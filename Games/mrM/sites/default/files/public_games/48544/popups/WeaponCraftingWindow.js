class WeaponCraftingWindow extends TabbedPopupWindow
{
    layerName = "weaponcrafting"; // Used as key in activeLayers
    domElementId = "CRAFTINGD"; // ID of dom element that gets shown or hidden
    context = CRAFTING;         // Canvas rendering context for popup

    blueprintPane;
    blueprintPaneDefaultWidth;
    blueprintListHitboxes;

    craftingPane;
    isCraftingPaneInitialized = false;
    selectedBlueprint;

    craftCategory = 2;

    constructor(boundingBox)
    {
        super(boundingBox);
        if(!boundingBox)
        {
            this.setBoundingBox();
        }
        this.context.imageSmoothingEnabled = false;
        this.initializeTabs([_("Craft"), _("Weapon Stats")]);
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
        this.initializeEquipList();
    }

    render()
    {
        if(this.currentTabIndex == 0)
        {
            var menuPadding = 2;
            this.context.save();
            this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
            if(isKnownBlueprintsDirty)
            {
                this.initializeBlueprintList();
                isKnownBlueprintsDirty = false;
            }
            if(this.blueprintListHitboxes.length > 0)
            {
                // Update bounding boxes to account for menu expansion
                for(var i = 1; i < this.blueprintListHitboxes.length; ++i)
                {
                    if(this.blueprintListHitboxes[i].boundingBox.y != this.blueprintListHitboxes[i - 1].boundingBox.y + this.blueprintListHitboxes[i - 1].boundingBox.height + menuPadding)
                    {
                        this.blueprintListHitboxes[i].boundingBox.y = this.blueprintListHitboxes[i - 1].boundingBox.y + this.blueprintListHitboxes[i - 1].boundingBox.height + menuPadding;
                    }
                }
                var bottomOfLastMenu = this.blueprintListHitboxes[i - 1].boundingBox.y + this.blueprintListHitboxes[i - 1].boundingBox.height + menuPadding;
                if(bottomOfLastMenu != this.blueprintPane.contentHeight)
                {
                    this.blueprintPane.contentHeight = bottomOfLastMenu;
                    this.blueprintPane.initializeScrollbar();
                    this.blueprintPane.render();
                    this.blueprintPane.scrollTo(this.blueprintPane.currentScrollY);
                }
            }
            this.context.restore();
            super.render();
        }
        else if(this.currentTabIndex == 1)
        {
            //stats
            this.context.save();
            this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
            super.render();

            this.context.font = "20px Verdana";

            var maxHealth = userMaxHealth();
            var statsText = _("Max Health: {0}  -  Total DPS: {1}", beautifynum(maxHealth), getTotalDps().toFixed(3));
            this.context.strokeText(statsText, this.boundingBox.width * .5 - (this.context.measureText(statsText).width / 2), this.boundingBox.height * .86);
            this.context.fillText(statsText, this.boundingBox.width * .5 - (this.context.measureText(statsText).width / 2), this.boundingBox.height * .86);

            this.context.restore();
        }

        showTyrusDialogue();
    }

    close()
    {
        activeLayers.MainUILayer.removeDialogueAttachment();
        animate();

        return super.close();
    }

    onTabChange()
    {
        this.selectedBlueprint = null;
        this.blueprintListHitboxes = [];
        if(this.currentTabIndex == 0)
        {
            this.craftingPane.setVisible(true)
            this.craftingPane.setEnabled(true)
            this.blueprintPane.setVisible(true)
            this.blueprintPane.setEnabled(true)
            this.equipList.setVisible(false)
            this.equipList.setEnabled(false)
            this.blueprintPane.scrollTo(0);
            this.initializeBlueprintList();
            this.initializeCraftingPane();
            this.blueprintPane.contentHeight = 1;
            this.blueprintPane.clearCanvas();
            this.blueprintPane.initializeScrollbar();
        }
        else if(this.currentTabIndex == 1)
        {
            this.craftingPane.setVisible(false)
            this.craftingPane.setEnabled(false)
            this.blueprintPane.setVisible(false)
            this.blueprintPane.setEnabled(false)
            this.equipList.setVisible(true)
            this.equipList.setEnabled(true)
        }
    }

    initializeBlueprintList(openSubcategoryMenus = [])
    {
        var parentHitbox = this.blueprintPane;
        parentHitbox.clearHitboxes();
        for(var i in this.blueprintListHitboxes)
        {
            if(!this.blueprintListHitboxes[i].isCollapsed)
            {
                openSubcategoryMenus.push(i);
            }
        }
        // parentHitbox.context.clearRect(0, 0, parentHitbox.contentWidth, parentHitbox.contentHeight);
        this.blueprintListHitboxes = [];
        var cumulativeHeight = 0;
        var blueprintList;
        if(this.currentTabIndex == 0)
        {
            blueprintList = getKnownBlueprints();
            var blueprintsInCategory = filterBlueprintsByCategory(blueprintList, this.craftCategory);
            blueprintsInCategory = filterBlueprints(blueprintsInCategory, function (blueprint) {return !blueprint.craftedItem.item.isAtMaxLevel();});

            blueprintsInCategory = sortBlueprintsBySubcategory(blueprintsInCategory);
        }
        for(var subcategory in blueprintsInCategory)
        {
            //targetCanvasContext, x, y, width, collapsedHeight, expandedHeight, titleText, fontSize, fontColor
            var newMenu = new CollapsibleMenu(
                parentHitbox.context,
                0,
                cumulativeHeight,
                parentHitbox.boundingBox.width - parentHitbox.scrollbarWidth,
                40,
                0,
                subcategory,
                "18px Verdana",
                "#FFFFFF"
            );
            this.generateSubcategoryMenuContents(blueprintsInCategory[subcategory], newMenu);
            this.blueprintListHitboxes.push(newMenu);
            parentHitbox.addHitbox(newMenu);
            cumulativeHeight += newMenu.boundingBox.height;
        }
        if(openSubcategoryMenus.length > 0)
        {
            for(var i in openSubcategoryMenus)
            {
                if(this.blueprintListHitboxes[openSubcategoryMenus[i]])
                {
                    this.blueprintListHitboxes[openSubcategoryMenus[i]].expand();
                }
            }
        }
        else if(this.blueprintListHitboxes.length == 1)
        {
            this.blueprintListHitboxes[0].expand();
        }
        parentHitbox.isDirty = true;
        // parentHitbox.render();
        // this.render();
    }

    generateSubcategoryMenuContents(blueprintsInSubcategory, menuHitbox)
    {
        var slotSize = Math.min(50, Math.floor(this.boundingBox.height * 0.117));
        var padding = 3;
        var slotsPerRow = Math.floor((menuHitbox.boundingBox.width - padding * 2) / slotSize);
        var totalRows = Math.ceil(blueprintsInSubcategory.length / slotsPerRow);
        var slotSpacing = ((menuHitbox.boundingBox.width - padding * 2) - (slotSize * slotsPerRow)) / (slotsPerRow - 1);
        menuHitbox.canvas.height = totalRows * (slotSize + slotSpacing) + 2 * padding;
        menuHitbox.expandedHeight = menuHitbox.canvas.height + menuHitbox.collapsedHeight;
        menuHitbox.context.save();
        menuHitbox.showNotificationIcon = false;
        for(var i = 0; i < blueprintsInSubcategory.length; ++i)
        {
            var blueprint = blueprintsInSubcategory[i];
            if(!blueprint) continue;
            var indexInRow = i % slotsPerRow;
            var slotX = padding + indexInRow * (slotSize + slotSpacing);
            var slotY = padding + Math.floor(i / slotsPerRow) * (slotSize + slotSpacing);
            drawImageFitInBox(
                menuHitbox.context,
                blueprint.craftedItem.item.getIcon(),
                slotX,
                slotY,
                slotSize,
                slotSize
            );
            if(this.selectedBlueprint == blueprint)
            {
                menuHitbox.context.strokeStyle = "#76E374";
                menuHitbox.context.lineWidth = 3;
                menuHitbox.context.beginPath();
                menuHitbox.context.strokeRect(
                    slotX + menuHitbox.context.lineWidth,
                    slotY + menuHitbox.context.lineWidth,
                    slotSize - 2 * menuHitbox.context.lineWidth,
                    slotSize - 2 * menuHitbox.context.lineWidth
                );
                menuHitbox.context.stroke();
            }
            if(isBlueprintUnseen(blueprint.category, blueprint.id))
            {
                menuHitbox.showNotificationIcon = true;
                var markerSize = 5;
                menuHitbox.context.fillStyle = "#FF0000";
                menuHitbox.context.strokeStyle = "#FFFFFF";
                menuHitbox.context.lineWidth = 2;
                menuHitbox.context.beginPath();
                menuHitbox.context.arc(
                    slotX + slotSize - markerSize,
                    slotY + markerSize,
                    markerSize,
                    0,
                    2 * Math.PI
                );
                menuHitbox.context.fill();
                menuHitbox.context.stroke();
            }
            menuHitbox.context.fillStyle = "#FFFFFF";
            var fontSize = Math.min(16, this.boundingBox.height * 0.037);
            menuHitbox.context.font = fontSize + "px Verdana";
            menuHitbox.context.textBaseline = "bottom";
            menuHitbox.context.lineWidth = 3;
            menuHitbox.context.strokeStyle = "#000000";
            strokeTextShrinkToFit(
                menuHitbox.context,
                blueprint.craftedItem.item.getCurrentLevel() + 2,
                slotX,
                slotY + slotSize,
                slotSize,
                "right"
            );
            fillTextShrinkToFit(
                menuHitbox.context,
                blueprint.craftedItem.item.getCurrentLevel() + 2,
                slotX,
                slotY + slotSize,
                slotSize,
                "right"
            );
            var itemHitbox = new Hitbox(
                {
                    x: slotX,
                    y: slotY + menuHitbox.collapsedHeight,
                    width: slotSize,
                    height: slotSize
                },
                {
                    onmousedown: function (blueprint)
                    {
                        this.selectedBlueprint = blueprint;
                        this.initializeCraftingPane();
                    }.bind(this, blueprint),
                    onmouseenter: function (blueprint, x, y)
                    {
                        var coords = this.getGlobalCoordinates(x, y);
                        showTooltip(
                            _(blueprint.craftedItem.item.getName()),
                            _(blueprint.craftedItem.item.getDescription()),
                            coords.x * uiScaleX,
                            coords.y * uiScaleY,
                            200
                        );
                    }.bind(menuHitbox, blueprint, slotX, slotY + slotSize + menuHitbox.collapsedHeight),
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "pointer"
            );
            menuHitbox.addHitbox(itemHitbox, true);
        }
        menuHitbox.context.restore();
    }

    initializeCraftingPane()
    {
        if(this.selectedBlueprint)
        {
            if(this.currentTabIndex == 0 && isBlueprintUnseen(this.selectedBlueprint.category, this.selectedBlueprint.id))
            {
                flagBlueprintAsSeen(this.selectedBlueprint.category, this.selectedBlueprint.id);
            }
            this.initializeBlueprintList();
            this.craftingPane.clearHitboxes();

            var isSelectedBlueprintKnown = isBlueprintKnown(
                this.selectedBlueprint.category,
                this.selectedBlueprint.craftedItem.item.id
            );
            var isSelectedBlueprintAvailable = isBlueprintAvailable(
                this.selectedBlueprint.category,
                this.selectedBlueprint.craftedItem.item.id
            );
            var xPadding = 20;
            var yPadding = this.boundingBox.height * 0.07;
            var iconSize = Math.min(55, Math.floor(this.boundingBox.height * 0.128));
            var titleBoxPadding = iconSize / 10;
            var blueprintNameBox = new Hitbox(
                {
                    x: xPadding,
                    y: yPadding,
                    width: this.craftingPane.boundingBox.width - 2 * xPadding,
                    height: iconSize + 2 * titleBoxPadding
                },
                {}, ""
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
                var fontSize = Math.min(22, parentWindow.boundingBox.height * 0.051);
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
                            coords.y * uiScaleY,
                            200
                        );
                    }.bind(blueprintNameBox, this.selectedBlueprint, titleBoxPadding, titleBoxPadding + iconSize),
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "pointer"
            );
            blueprintIcon.render = function (parentWindow)
            {
                var context = this.getContext();
                var blueprint = parentWindow.selectedBlueprint;
                var relativeCoords = this.getRelativeCoordinates(0, 0, parentWindow);
                drawImageFitInBox(context, blueprint.craftedItem.item.getIcon(), relativeCoords.x, relativeCoords.y, iconSize, iconSize);
                context.fillStyle = "#FFFFFF";
                var fontSize = Math.min(16, parentWindow.boundingBox.height * 0.037);
                context.font = fontSize + "px Verdana";
                context.textBaseline = "bottom";
                context.lineWidth = 3;
                context.strokeStyle = "#000000";
                strokeTextShrinkToFit(
                    context,
                    blueprint.craftedItem.item.getCurrentLevel() + 2,
                    relativeCoords.x,
                    relativeCoords.y + iconSize,
                    iconSize,
                    "right"
                );
                fillTextShrinkToFit(
                    context,
                    blueprint.craftedItem.item.getCurrentLevel() + 2,
                    relativeCoords.x,
                    relativeCoords.y + iconSize,
                    iconSize,
                    "right"
                );
            }.bind(blueprintIcon, this);
            var ingredientsFontSize = Math.min(16, this.boundingBox.height * 0.037);
            var blueprintIngredientsBox = new Hitbox(
                {
                    x: xPadding,
                    y: ingredientsFontSize + blueprintNameBox.boundingBox.y + blueprintNameBox.boundingBox.height + titleBoxPadding,
                    width: blueprintNameBox.boundingBox.width,
                    height: titleBoxPadding * 3 + iconSize * 2 + ingredientsFontSize
                },
                {}, "", "ingredients"
            );
            blueprintIngredientsBox.render = function (parentWindow)
            {
                var context = this.getContext();
                var relativeCoords = this.getRelativeCoordinates(0, 0, parentWindow);
                context.save();
                if(parentWindow.currentTabIndex == 0)
                {
                    context.globalAlpha = 0.6;
                    context.fillStyle = "#111111";
                    context.fillRect(relativeCoords.x, relativeCoords.y + ingredientsFontSize * 5, this.boundingBox.width, this.boundingBox.height - ingredientsFontSize * 5);
                    // context.fillRect(relativeCoords.x, relativeCoords.y + ingredientsFontSize, this.boundingBox.width, this.boundingBox.height - ingredientsFontSize);
                    context.globalAlpha = 1;
                    context.fillStyle = "#FFFFFF";
                    context.font = ingredientsFontSize + "px KanitM";
                    // context.textBaseline = "top";
                    // context.fillText(_("Ingredients"), relativeCoords.x, relativeCoords.y)    
                    fillTextWrap(context, parentWindow.selectedBlueprint.craftedItem.item.getDescription(), relativeCoords.x, relativeCoords.y + ingredientsFontSize, parentWindow.boundingBox.width, "left", 0.25);
                }
                context.restore();
                this.renderChildren();
            }.bind(blueprintIngredientsBox, this);
            var slotsPerRow = Math.floor((blueprintIngredientsBox.boundingBox.width - titleBoxPadding * 2) / iconSize);
            var slotSpacing = ((blueprintIngredientsBox.boundingBox.width - titleBoxPadding * 2) - (iconSize * slotsPerRow)) / (slotsPerRow - 1);
            if(isSelectedBlueprintKnown || isSelectedBlueprintAvailable)
            {
                var yOffset = ingredientsFontSize * 5;
                var level = this.selectedBlueprint.craftedItem.item.getCurrentLevel();
                var ingredients = getBlueprintIngredients(this.craftCategory, this.selectedBlueprint.id, level + 1);
                for(var i in ingredients)
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
                            onmousedown: function (blueprint)
                            {
                                if(blueprint)
                                {
                                    /*if(blueprint.category != 2)
                                    {
                                        this.blueprintPane.scrollTo(0);
                                        this.currentTabIndex = blueprint.category + 1;
                                        this.initializeBlueprintList();
                                    }
                                    this.selectedBlueprint = blueprint;
                                    this.initializeCraftingPane();*/
                                }
                            }.bind(this, getBlueprintForCraftingItem(ingredients[i].item, true)),
                            onmouseenter: function (ingredient, x, y)
                            {
                                var coords = this.getGlobalCoordinates(x, y);
                                showTooltip(
                                    _(ingredient.item.getName()),
                                    _("Owned: {0}<br>Required: {1}", beautifynum(ingredient.item.getQuantityOwned()), beautifynum(ingredient.quantity)),
                                    coords.x * uiScaleX,
                                    coords.y * uiScaleY
                                );
                            }.bind(blueprintIngredientsBox, ingredients[i], slotX, slotY + iconSize + ingredientsFontSize),
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
                            shortenNum(ingredient.quantity),
                            relativeCoords.x,
                            relativeCoords.y + iconSize,
                            iconSize * 0.95,
                            "right"
                        );
                        fillTextShrinkToFit(
                            context,
                            shortenNum(ingredient.quantity),
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
                    }.bind(ingredientIcon, this, ingredients[i]);
                    blueprintIngredientsBox.addHitbox(ingredientIcon);
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
                        if(isSelectedBlueprintKnown && this.currentTabIndex == 0)
                        {
                            if(craftBlueprint(this.selectedBlueprint.category, this.selectedBlueprint.id, level + 1))
                            {
                                this.initializeCraftingPane();
                                newNews(_("You crafted {0}", this.selectedBlueprint.craftedItem.item.getName()), true);
                                if(!mutebuttons) armoryUpgradeAudio.play();
                            }
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
            craftButton.onmouseenter = function (parentWindow)
            {
                if(parentWindow.currentTabIndex == 0 && !canCraftBlueprint(parentWindow.selectedBlueprint.category, parentWindow.selectedBlueprint.id))
                {
                    var coords = this.getGlobalCoordinates(0, this.boundingBox.height);
                    var level = parentWindow.selectedBlueprint.craftedItem.item.getCurrentLevel();
                    showTooltip(getBlueprintNotCraftableReason(parentWindow.selectedBlueprint.category, parentWindow.selectedBlueprint.id, level + 1), "", coords.x, coords.y);
                }
            }.bind(craftButton, this);
            craftButton.render = function (parentWindow)
            {
                var context = parentWindow.context;
                context.save();
                var relativeCoords = this.getRelativeCoordinates(0, 0, parentWindow);
                var level = parentWindow.selectedBlueprint.craftedItem.item.getCurrentLevel();
                if(parentWindow.currentTabIndex == 0 && isSelectedBlueprintKnown && canCraftBlueprint(parentWindow.selectedBlueprint.category, parentWindow.selectedBlueprint.id, level + 1))
                {
                    context.drawImage(upgradeb, relativeCoords.x, relativeCoords.y, this.boundingBox.width, this.boundingBox.height);
                    context.fillStyle = "#000000";
                }
                else
                {
                    context.drawImage(upgradebg_blank, relativeCoords.x, relativeCoords.y, this.boundingBox.width, this.boundingBox.height);
                    context.fillStyle = "#444444";
                }
                context.textBaseline = "middle";
                var buttonText;
                var fontSize = Math.min(32, parentWindow.boundingBox.height * 0.074);
                context.font = fontSize + "px KanitB";
                if(parentWindow.currentTabIndex == 0)
                {
                    if(level < 0)
                    {
                        buttonText = _("Craft");
                    }
                    else if(level >= parentWindow.selectedBlueprint.levels.length - 1)
                    {
                        buttonText = _("Max Level");
                    }
                    else
                    {
                        buttonText = _("Upgrade");
                    }
                }
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
            var instructionsText = "";
            var instructionsText2 = "";
            if(this.currentTabIndex == 0)
            {
                if(getAvailableBlueprints().length > 0)
                {
                    instructionsText = _("Click on a blueprint on the left to view it");
                }
                instructionsText2 = _("Find more weapons from chests and battles");
            }
            this.craftingPane.clearHitboxes();
            var instructionsHitbox = new Hitbox(
                {
                    x: 10,
                    y: 10,
                    width: this.craftingPane.boundingBox.width - 20,
                    height: this.craftingPane.boundingBox.height - 20,
                },
                {},
                ""
            );
            instructionsHitbox.render = function (parentWindow)
            {
                var coords = this.getRelativeCoordinates(0, 0, parentWindow);
                var context = parentWindow.context;
                context.fillStyle = "#FFFFFF";
                context.textBaseline = "middle";
                fillTextWrap(
                    context,
                    instructionsText,
                    coords.x,
                    coords.y + 10,
                    this.boundingBox.width
                );
                fillTextWrap(
                    context,
                    instructionsText2,
                    coords.x,
                    coords.y + 70,
                    this.boundingBox.width
                );
            }.bind(instructionsHitbox, this);
            this.craftingPane.addHitbox(instructionsHitbox);
        }
    }

    initializeEquipList()
    {
        var iconSize = 50;
        var padding = 8;
        var detailsWidth = 135;
        var equipList = new Hitbox(
            {
                x: 28,
                y: iconSize + padding,
                width: this.bodyContainer.boundingBox.width - 60,
                height: this.bodyContainer.boundingBox.height
            },
            {}, "", "equipList"
        );

        for(var i = 0; i < battleInventory.length; ++i)
        {
            if(battleInventory[i].length > 0)
            {
                var xCoordinate = (i % 3) * (iconSize + padding + detailsWidth);
                var yCoordinate = Math.floor(i / 3) * (iconSize + padding);
                var equipHitbox = new Hitbox(
                    {
                        x: xCoordinate,
                        y: yCoordinate,
                        width: iconSize,
                        height: iconSize
                    },
                    {
                        onmouseenter: function (i, x, y)
                        {
                            var item = new WeaponCraftingItem(battleInventory[i][0]);
                            var coords = this.getGlobalCoordinates(x, y);
                            showTooltip(
                                _(item.getName()),
                                _(item.getDescription()),
                                coords.x * uiScaleX,
                                coords.y * uiScaleY
                            );
                        }.bind(equipList, i, xCoordinate + iconSize, yCoordinate),
                        onmouseexit: function ()
                        {
                            hideTooltip();
                        }
                    },
                    "pointer"
                )
                equipHitbox.render = function (parentWindow, i)
                {
                    var item = new WeaponCraftingItem(battleInventory[i][0]);
                    var coords = this.getRelativeCoordinates(0, 0, parentWindow);
                    parentWindow.context.drawImage(darkdot, coords.x - 2, coords.y - 2, this.boundingBox.width + detailsWidth + 2, this.boundingBox.height + 4);
                    parentWindow.context.drawImage(item.getIcon(), coords.x, coords.y, this.boundingBox.width, this.boundingBox.height);
                    parentWindow.context.fillStyle = "#FFFFFF";
                    var fontSize = Math.min(16, parentWindow.boundingBox.height * 0.037);
                    parentWindow.context.font = fontSize + "px Verdana";
                    parentWindow.context.textBaseline = "bottom";
                    parentWindow.context.lineWidth = 3;
                    parentWindow.context.strokeStyle = "#000000";
                    strokeTextShrinkToFit(
                        parentWindow.context,
                        item.getCurrentLevel() + 1,
                        coords.x,
                        coords.y + this.boundingBox.width,
                        this.boundingBox.height,
                        "right"
                    );
                    fillTextShrinkToFit(
                        parentWindow.context,
                        item.getCurrentLevel() + 1,
                        coords.x,
                        coords.y + this.boundingBox.width,
                        this.boundingBox.height,
                        "right"
                    );

                    parentWindow.context.textBaseline = "top";
                    var fontSize = Math.min(11, parentWindow.boundingBox.height * 0.026);
                    parentWindow.context.font = fontSize + "px Verdana";
                    //DPS and stats
                    fillTextWrap(
                        parentWindow.context,
                        item.getName() + " Lv." + (item.getCurrentLevel() + 1) + " <br> ATK: " + item.getAttack() + " <br> CD: " + beautifynum(item.getCooldown()) + "ms <br> DPS: " + item.getDps().toFixed(3),
                        coords.x + iconSize + 3,
                        coords.y + 1,
                        detailsWidth,
                        "left",
                        0.2
                    );
                }.bind(equipHitbox, this, i);
                equipList.addHitbox(equipHitbox);
            }
        }

        this.equipList = equipList;
        this.addHitbox(equipList);
        if(this.currentTabIndex != 1)
        {
            this.equipList.setEnabled(false)
            this.equipList.setVisible(false)
        }
    }
}