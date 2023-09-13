class ReactorWindow extends TabbedPopupWindow
{
    layerName = "Reactor"; // Used as key in activeLayers
    domElementId = "REACTORD"; // ID of dom element that gets shown or hidden
    context = REACTOR;         // Canvas rendering context for popup
    widthHeightPerCell;

    blueprintPane;
    blueprintPaneDefaultWidth;
    blueprintListHitboxes;

    reactorLayouts;
    craftingPane;
    isCraftingPaneInitialized = false;
    selectedBlueprint;

    craftCategory = 6;

    constructor(boundingBox, openTab = 0)
    {
        super(boundingBox); // Need to call base class constructor
        if(!boundingBox)
        {
            this.setBoundingBox();
        }
        this.context.imageSmoothingEnabled = false;
        this.setFrameImagesByWorldIndex(MOON_INDEX);
        this.currentTabIndex = openTab;

        var tabCategories = {
            0: _("Reactor"),
            1: _("Craft"),
            2: _("Upgrade"),
        }

        this.initializeTabs(Object.values(tabCategories));

        this.reactorPane = new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.boundingBox.width,
                height: this.boundingBox.height
            },
            {},
            "",
            "reactorPane"
        );
        this.reactorPane.allowBubbling = true;
        this.addHitbox(this.reactorPane);

        this.reactorLayouts = new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.boundingBox.width,
                height: this.boundingBox.height
            },
            {},
            "",
            "reactorLayouts"
        );
        this.reactorLayouts.render = function ()
        {
            var context = this.parent.context;
            var coords = this.getRelativeCoordinates(0, 0, this.parent);

            context.save();
            context.strokeStyle = "#000000";
            context.textBaseline = "bottom";
            context.lineWidth = 3;
            context.font = "20px Verdana";
            context.fillStyle = "#FFFFFF";

            context.fillText(_("Current Layout"), (this.boundingBox.width * 0.3) - context.measureText(_("Current Layout")).width / 2, this.boundingBox.height * 0.15, this.boundingBox.width);

            context.font = "18px KanitB";
            context.fillStyle = "#000000";
            context.drawImage(upgradeb, this.boundingBox.width * 0.45, this.boundingBox.height * 0.12, this.boundingBox.width * 0.2, this.boundingBox.height * 0.04);
            context.fillText(_("View Layout"), (this.boundingBox.width * .55) - (context.measureText(_("View Layout")).width * .5), this.boundingBox.height * 0.12 + 21);

            context.drawImage(upgradeb, this.boundingBox.width * 0.68, this.boundingBox.height * 0.12, this.boundingBox.width * 0.2, this.boundingBox.height * 0.04);
            context.fillText(_("Save Layout"), (this.boundingBox.width * .78) - (context.measureText(_("Save Layout")).width * .5), this.boundingBox.height * 0.12 + 21);

            for(var i = 0; i < savedReactorLayouts.length; i++)
            {
                if(savedReactorLayouts[i].length > 0)
                {
                    var heightAdjustment = 0.06 * (i + 2);
                    context.font = "20px Verdana";
                    context.fillStyle = "#FFFFFF";
                    context.fillText(savedReactorLayoutNames[i], (this.boundingBox.width * 0.3) - context.measureText(savedReactorLayoutNames[i]).width / 2, this.boundingBox.height * (0.15 + heightAdjustment), this.boundingBox.width);
                    context.font = "18px KanitB";
                    context.fillStyle = "#000000";
                    context.drawImage(upgradeb, this.boundingBox.width * 0.45, (this.boundingBox.height * (0.12 + heightAdjustment)), this.boundingBox.width * 0.2, this.boundingBox.height * 0.04);
                    context.fillText(_("Load Layout"), (this.boundingBox.width * .55) - (context.measureText(_("Load Layout")).width * .5), (this.boundingBox.height * (0.12 + heightAdjustment)) + 21);
                    context.drawImage(upgradeb, this.boundingBox.width * 0.68, (this.boundingBox.height * (0.12 + heightAdjustment)), this.boundingBox.width * 0.2, this.boundingBox.height * 0.04);
                    context.fillText(_("Delete Layout"), (this.boundingBox.width * .78) - (context.measureText(_("Delete Layout")).width * .5), (this.boundingBox.height * (0.12 + heightAdjustment)) + 21);
                }
            }


            context.restore();
        }
        this.reactorLayouts.allowBubbling = true;
        this.addHitbox(this.reactorLayouts);

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
        this.initializeReactorLayouts();
        this.initializeBlueprintList();
        this.initializeCraftingPane();

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
        this.selectedBlueprint = null;
        this.blueprintListHitboxes = [];

        if(this.currentTabIndex == 0)
        {
            this.reactorPane.setVisible(true)
            this.reactorPane.setEnabled(true)
            this.craftingPane.setVisible(false)
            this.craftingPane.setEnabled(false)
            this.blueprintPane.setVisible(false)
            this.blueprintPane.setEnabled(false)
            this.upgradePane.setVisible(false)
            this.upgradePane.setEnabled(false)
            this.reactorLayouts.setVisible(false)
            this.reactorLayouts.setEnabled(false)

            this.initializeReactorHitboxes();
        }
        else if(this.currentTabIndex == 1)
        {
            this.reactorPane.setVisible(false)
            this.reactorPane.setEnabled(false)
            this.craftingPane.setVisible(true)
            this.craftingPane.setEnabled(true)
            this.blueprintPane.setVisible(true)
            this.blueprintPane.setEnabled(true)
            this.upgradePane.setEnabled(false)
            this.upgradePane.setEnabled(false)
            this.reactorLayouts.setVisible(false)
            this.reactorLayouts.setEnabled(false)


            this.blueprintPane.scrollTo(0);
            this.initializeBlueprintList();
            this.initializeCraftingPane();
            this.blueprintPane.contentHeight = 1;
            this.blueprintPane.clearCanvas();
            this.blueprintPane.initializeScrollbar();
        }
        else if(this.currentTabIndex == 2)
        {
            this.reactorPane.setVisible(false)
            this.reactorPane.setEnabled(false)
            this.craftingPane.setVisible(false)
            this.craftingPane.setEnabled(false)
            this.blueprintPane.setVisible(false)
            this.blueprintPane.setEnabled(false)
            this.upgradePane.setEnabled(true)
            this.upgradePane.setEnabled(true)
            this.reactorLayouts.setVisible(false)
            this.reactorLayouts.setEnabled(false)


            this.initializeReactorUpgradeHitboxes();
        }
    }

    initializeReactorHitboxes()
    {
        this.reactorPane.clearHitboxes();
        this.craftingPane.clearHitboxes();
        this.blueprintPane.clearHitboxes();
        this.upgradePane.clearHitboxes();
        this.reactorLayouts.clearHitboxes();

        var reactorGrid = new Hitbox(
            {
                x: this.boundingBox.width * .33,
                y: this.boundingBox.height * .17,
                width: this.boundingBox.width * .75,
                height: this.boundingBox.height * .62
            },
            {},
            "",
            "reactorGrid"
        );
        reactorGrid.allowBubbling = true;
        this.reactorPane.addHitbox(reactorGrid);

        this.widthHeightPerCell = Math.min(this.boundingBox.width, this.boundingBox.height) * .07;

        for(var i = 0; i < MAX_REACTOR_CELLS_ROWS; i++)
        {
            for(var j = 0; j < MAX_REACTOR_CELLS_COLUMNS; j++)
            {
                var reactorGridCell = new ReactorGridCell({
                    x: this.widthHeightPerCell * j,
                    y: this.widthHeightPerCell * i,
                    width: this.widthHeightPerCell,
                    height: this.widthHeightPerCell
                }, i, j);
                reactorGrid.addHitbox(reactorGridCell);

                if(reactor.grid.grid[i][j] != EMPTY_INTEGER_VALUE)
                {
                    var gridComponent = new ReactorComponentUI({
                        x: 0,
                        y: 0,
                        width: this.widthHeightPerCell,
                        height: this.widthHeightPerCell
                    }, reactor.grid.grid[i][j]);
                    gridComponent.gridSlotX = j;
                    gridComponent.gridSlotY = i;
                    gridComponent.isOnGrid = true;
                    reactorGridCell.addHitbox(gridComponent);
                }
            }
        }

        var inventoryPane = new Hitbox(
            {
                x: this.boundingBox.width * .10,
                y: this.boundingBox.height * .17,
                width: this.boundingBox.width * .16,
                height: this.boundingBox.height * .62
            },
            {},
            "",
            "inventoryPane"
        );
        inventoryPane.allowBubbling = true;
        this.reactorPane.addHitbox(inventoryPane);

        for(var i = 1; i < reactorComponents.length; i++)
        {
            var typeInSlot = reactor.getTypeForSlot(i);

            var reactorInventorySlot = new ReactorInventorySlot({
                x: ((i - 1) % 3) * this.widthHeightPerCell,
                y: Math.floor((i - 1) / 3) * this.widthHeightPerCell,
                width: this.widthHeightPerCell,
                height: this.widthHeightPerCell
            }, i);
            inventoryPane.addHitbox(reactorInventorySlot);

            if(typeInSlot > -1)
            {
                var inventoryComponent = new ReactorComponentUI({
                    x: 0,
                    y: 0,
                    width: this.widthHeightPerCell,
                    height: this.widthHeightPerCell
                }, typeInSlot);
                inventoryComponent.isOnGrid = false;
                reactorInventorySlot.addHitbox(inventoryComponent);
            }
        }

        this.reactorPane.addHitbox(new Hitbox(
            {
                x: this.boundingBox.width * 0.1,     // Copied from renderButton call below
                y: this.boundingBox.height * 0.12,
                width: this.boundingBox.width * 0.8,
                height: this.boundingBox.height * 0.04
            },
            {
                onmouseenter: function ()
                {
                    if(!reactor.isAbleToRun())
                    {
                        showTooltip(_("Reactor is unable to run"), reactor.getReasonForNotRunning(), mouseX, mouseY, 180);
                    }
                },
                onmouseexit: function ()
                {
                    hideTooltip();
                }
            },
            'pointer',
            "reactorStats"
        ));

        this.reactorPane.addHitbox(new Button(
            upgradeb, _("Reactor Layouts"), "18px KanitM", "#000000",
            {
                x: this.boundingBox.width * 0.49,
                y: this.boundingBox.height * 0.82,
                width: this.boundingBox.width * 0.2,
                height: this.boundingBox.height * 0.04
            },
            {
                onmousedown: function ()
                {
                    reactorNotRunningReason.setVisible(false);
                    reactorStats.setVisible(false);
                    this.parent.setVisible(false);
                    this.parent.setEnabled(false);
                    this.parent.clearHitboxes();
                    this.parent.parent.initializeReactorLayouts();
                    this.parent.parent.reactorLayouts.setVisible(true);
                    this.parent.parent.reactorLayouts.setEnabled(true);

                }
            }
        ));

        var reactorNotRunningReason = new Hitbox(
            {
                x: this.boundingBox.width * 0.1,     // Copied from renderButton call below
                y: this.boundingBox.height * 0.9,
                width: this.boundingBox.width * 0.8,
                height: this.boundingBox.height * 0.04
            },
            {},
            '',
            "reactorNotRunningReason"
        );
        reactorNotRunningReason.render = function (root)
        {
            if(root.currentTabIndex == 0 && !reactor.isAbleToRun() && this.parent.reactorLayouts._isVisible == false)
            {
                root.context.save();
                root.context.strokeStyle = "#000000";
                root.context.fillStyle = "#DD5555";
                root.context.textBaseline = "bottom";
                root.context.lineWidth = 3;
                root.context.font = "20px Verdana";
                var coords = this.getRelativeCoordinates(0, 0, root);
                strokeTextShrinkToFit(
                    root.context,
                    reactor.getReasonForNotRunning(),
                    coords.x,
                    coords.y,
                    this.boundingBox.width,
                    "center"
                );
                fillTextShrinkToFit(
                    root.context,
                    reactor.getReasonForNotRunning(),
                    coords.x,
                    coords.y,
                    this.boundingBox.width,
                    "center"
                );
                root.context.restore();
            }
        }.bind(reactorNotRunningReason, this);
        reactorNotRunningReason.allowBubbling = true;
        this.addHitbox(reactorNotRunningReason);

        var reactorStats = new Hitbox(
            {
                x: this.boundingBox.width * 0.34,
                y: this.boundingBox.height * 0.14,
                width: this.boundingBox.width * 0.5,
                height: this.boundingBox.height * 0.14
            },
            {},
            '',
            "reactorStats"
        );
        reactorStats.render = function (root)
        {
            if(root.currentTabIndex == 0 && this.parent.reactorLayouts._isVisible == false)
            {
                root.context.save();
                root.context.strokeStyle = "#000000";
                root.context.textBaseline = "bottom";
                root.context.lineWidth = 3;
                root.context.font = "20px Verdana";
                root.context.fillStyle = (reactor.isRunning) ? "#FFFFFF" : "#DD5555";
                var coords = this.getRelativeCoordinates(0, 0, root);
                strokeTextShrinkToFit(
                    root.context,
                    reactor.getReactorStats(),
                    coords.x,
                    coords.y,
                    this.boundingBox.width,
                    "center"
                );
                fillTextShrinkToFit(
                    root.context,
                    reactor.getReactorStats(),
                    coords.x,
                    coords.y,
                    this.boundingBox.width,
                    "center"
                );
                root.context.restore();
            }
        }.bind(reactorStats, this);
        reactorStats.allowBubbling = true;
        this.addHitbox(reactorStats);
    }

    initializeReactorUpgradeHitboxes()
    {
        this.reactorPane.clearHitboxes();
        this.craftingPane.clearHitboxes();
        this.blueprintPane.clearHitboxes();
        this.upgradePane.clearHitboxes();
        this.reactorLayouts.clearHitboxes();
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.context.restore();

        if(this.currentTabIndex == 0)
        {
            this.context.imageSmoothingEnabled = true;
            super.render(); // Render any child layers
            this.context.imageSmoothingEnabled = false;
        }

        if(this.currentTabIndex == 1)
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

        if(this.currentTabIndex == 2)
        {
            //upgrading
            super.render(); // Render any child layers

            this.context.save();
            this.context.fillStyle = "#FFFFFF";
            this.context.strokeStyle = "#000000";
            this.context.textBaseline = "bottom";
            this.context.lineWidth = 3;

            if(!reactor.isAtMaxLevel())
            {
                var headerText = _("CURRENT");
                var levelText = _("Reactor Level: {0}", reactorStructure.level);
                this.context.font = "bold 20px Verdana";
                this.context.strokeText(headerText, this.boundingBox.width * .25 - this.context.measureText(headerText).width / 2, this.boundingBox.height * .5);
                this.context.fillText(headerText, this.boundingBox.width * .25 - this.context.measureText(headerText).width / 2, this.boundingBox.height * .5);
                this.context.font = "20px Verdana";
                this.context.strokeText(levelText, this.boundingBox.width * .25 - this.context.measureText(levelText).width / 2, this.boundingBox.height * .57);
                this.context.fillText(levelText, this.boundingBox.width * .25 - this.context.measureText(levelText).width / 2, this.boundingBox.height * .57);
                this.drawReactorGrid(this.boundingBox.width * .10, this.boundingBox.height * .14, this.boundingBox.width * .30, this.boundingBox.height * .30, reactorStructure.level);

                var headerText = _("NEXT LEVEL");
                var levelText = _("Reactor Level: {0}", reactorStructure.level + 1);
                this.context.font = "bold 20px Verdana";
                this.context.strokeText(headerText, this.boundingBox.width * .75 - this.context.measureText(headerText).width / 2, this.boundingBox.height * .5);
                this.context.fillText(headerText, this.boundingBox.width * .75 - this.context.measureText(headerText).width / 2, this.boundingBox.height * .5);
                this.context.font = "20px Verdana";
                this.context.strokeText(levelText, this.boundingBox.width * .75 - this.context.measureText(levelText).width / 2, this.boundingBox.height * .57);
                this.context.fillText(levelText, this.boundingBox.width * .75 - this.context.measureText(levelText).width / 2, this.boundingBox.height * .57);
                this.drawReactorGrid(this.boundingBox.width * .60, this.boundingBox.height * .14, this.boundingBox.width * .30, this.boundingBox.height * .30, reactorStructure.level + 1);
            }
            else
            {
                var reactorLevelText = _("You Are At the Max Level");
                this.context.strokeText(reactorLevelText, this.boundingBox.width * .5 - this.context.measureText(reactorLevelText).width / 2, this.boundingBox.height * .4);
                this.context.fillText(reactorLevelText, this.boundingBox.width * .5 - this.context.measureText(reactorLevelText).width / 2, this.boundingBox.height * .4);
            }

            this.context.restore();
        }
    }

    drawReactorGrid(x, y, width, height, level)
    {
        this.context.save();

        this.context.strokeStyle = "#333333";
        this.context.lineWidth = 1;
        for(var i = 0; i < REACTOR_LAYOUTS[level].length; i++)
        {
            for(var j = 0; j < REACTOR_LAYOUTS[level][i].length; j++)
            {
                if(REACTOR_LAYOUTS[level][i][j] == 0)
                {
                    this.context.fillStyle = "#AAAAAA";
                }
                else
                {
                    this.context.fillStyle = "#FFFFFF";
                }
                this.context.fillRect(x + (i * width / MAX_REACTOR_CELLS_ROWS), y + (j * height / MAX_REACTOR_CELLS_COLUMNS), width / MAX_REACTOR_CELLS_ROWS, height / MAX_REACTOR_CELLS_COLUMNS);
                this.context.strokeRect(x + (i * width / MAX_REACTOR_CELLS_ROWS), y + (j * height / MAX_REACTOR_CELLS_COLUMNS), width / MAX_REACTOR_CELLS_ROWS, height / MAX_REACTOR_CELLS_COLUMNS);
            }
        }
        this.context.restore();
    }


    //######################### CRAFTING ##############################

    initializeReactorLayouts()
    {
        var parentHitbox = this.reactorLayouts;
        parentHitbox.clearHitboxes();

        parentHitbox.addHitbox(new Hitbox(
            {
                x: this.boundingBox.width * 0.45,
                y: this.boundingBox.height * 0.12,
                width: this.boundingBox.width * 0.2,
                height: this.boundingBox.height * 0.04
            },
            {
                onmousedown: function ()
                {
                    openUi(ReactorWindow)
                }
            },
            'pointer',
            "viewLayout"
        ));

        //save current layout button
        parentHitbox.addHitbox(new Hitbox(
            {
                x: this.boundingBox.width * 0.68,
                y: this.boundingBox.height * 0.12,
                width: this.boundingBox.width * 0.2,
                height: this.boundingBox.height * 0.04
            },
            {
                onmousedown: function ()
                {
                    showSimpleInput(
                        _("Enter layout name"),
                        _("Save layout"),
                        "",
                        function (parent)
                        {
                            saveReactorLayout(reactor.grid.grid)
                            hideSimpleInput();
                            parent.initializeReactorLayouts();
                        }.bind(null, this.parent.parent),
                        _("Cancel"),
                        18
                    )

                }
            },
            'pointer',
            "saveLayout"
        ));



        this.loadLayoutHitBoxes();
    }

    loadLayoutHitBoxes()
    {
        var parentHitbox = this.reactorLayouts;

        //load layouts
        for(var i = 0; i < savedReactorLayouts.length; i++)
        {
            if(savedReactorLayouts[i].length > 0)
            {
                var heightAdjustment = 0.06 * (i + 2);

                parentHitbox.addHitbox(new Hitbox(
                    {
                        x: this.boundingBox.width * 0.45,
                        y: (this.boundingBox.height * (0.12 + heightAdjustment)),
                        width: this.boundingBox.width * 0.2,
                        height: this.boundingBox.height * 0.04
                    },
                    {
                        onmousedown: this.loadReactorButtonClicked(i)
                    },
                    'pointer',
                    "loadLayout_" + i
                ));

                parentHitbox.addHitbox(new Hitbox(
                    {
                        x: this.boundingBox.width * 0.68,
                        y: (this.boundingBox.height * (0.12 + heightAdjustment)),
                        width: this.boundingBox.width * 0.2,
                        height: this.boundingBox.height * 0.04
                    },
                    {
                        onmousedown: this.deleteReactorLayout(i)
                    },
                    'pointer',
                    "deleteLayout_" + i
                ));
            }
        }
    }

    loadReactorButtonClicked(index)
    {
        return function ()
        {
            //should change this to check for fuel rods that aren't full instead of checking if there is fuel remaining across all fuel rods.
            var fuelRemaining = 0;
            reactor.grid.fuelCellRemainingEnergy.forEach((fuelCell) =>
            {
                fuelRemaining += fuelCell.remainingEnergy;
            })

            if(fuelRemaining > 0)
            {
                showConfirmationPrompt(
                    _("Your reactor contains unused fuel rods are you sure you want to delete them?"),
                    _("Yes, Delete them"),
                    function (parent, layoutToLoad)
                    {
                        parent.loadReactor(layoutToLoad);
                        hideSimpleInput();
                    }.bind(null, this.parent.parent, index),
                    _("Cancel")
                )
            }
            else
            {
                this.parent.parent.loadReactor(index);
            }
        }
    }

    loadReactor(index)
    {
        loadReactorLayout(index);
        this.reactorPane.setVisible(true)
        this.reactorPane.setEnabled(true)
        this.reactorLayouts.setEnabled(false)
        this.reactorLayouts.setVisible(false)
        this.initializeReactorHitboxes();
        redrawInventoryAndGrid();
    }

    deleteReactorLayout(index)
    {
        return function ()
        {
            showConfirmationPrompt(
                _("Are you sure you want to delete this layout?"),
                _("Yes"),
                function (parent, id)
                {
                    savedReactorLayouts.splice(id, 1);
                    savedReactorLayouts[9] = [];
                    savedReactorLayoutNames.splice(id, 1);
                    savedReactorLayoutNames[9] = "";
                    parent.reactorLayouts.deleteHitboxWithId("loadLayout_" + id);
                    parent.reactorLayouts.deleteHitboxWithId("deleteLayout_" + id);
                    parent.initializeReactorLayouts();
                    hideSimpleInput();
                }.bind(null, this.parent.parent, index),
                _("Cancel")
            )
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
        if(this.currentTabIndex == 1)
        {
            blueprintList = getKnownBlueprints();
            var blueprintsInCategory = filterBlueprintsByCategory(blueprintList, this.craftCategory);
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

            drawImageFitInBox(menuHitbox.context, getSingleColoredPixelImage("#CCCCCC", 0.55), slotX, slotY, slotSize, slotSize);
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
                "",
                slotX,
                slotY + slotSize,
                slotSize,
                "right"
            );
            fillTextShrinkToFit(
                menuHitbox.context,
                "",
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
            if(this.currentTabIndex == 1 && isBlueprintUnseen(this.selectedBlueprint.category, this.selectedBlueprint.id))
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
            var yPadding = 0;
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
                drawImageFitInBox(context, getSingleColoredPixelImage("#CCCCCC", 1), relativeCoords.x, relativeCoords.y, iconSize, iconSize);
                drawImageFitInBox(context, blueprint.craftedItem.item.getIcon(), relativeCoords.x, relativeCoords.y, iconSize, iconSize);
                context.fillStyle = "#FFFFFF";
                var fontSize = Math.min(16, parentWindow.boundingBox.height * 0.037);
                context.font = fontSize + "px Verdana";
                context.textBaseline = "bottom";
                context.lineWidth = 3;
                context.strokeStyle = "#000000";
                strokeTextShrinkToFit(
                    context,
                    "",
                    relativeCoords.x,
                    relativeCoords.y + iconSize,
                    iconSize,
                    "right"
                );
                fillTextShrinkToFit(
                    context,
                    "",
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
                if(parentWindow.currentTabIndex == 1)
                {
                    context.globalAlpha = 0.6;
                    context.fillStyle = "#111111";
                    context.fillRect(relativeCoords.x, relativeCoords.y + ingredientsFontSize * 6, this.boundingBox.width, this.boundingBox.height - ingredientsFontSize * 5);
                    // context.fillRect(relativeCoords.x, relativeCoords.y + ingredientsFontSize, this.boundingBox.width, this.boundingBox.height - ingredientsFontSize);
                    context.globalAlpha = 1;
                    context.fillStyle = "#FFFFFF";
                    context.font = ingredientsFontSize + "px KanitM";
                    // context.textBaseline = "top";
                    fillTextWrap(context, parentWindow.selectedBlueprint.craftedItem.item.getDescription(), relativeCoords.x, relativeCoords.y, parentWindow.boundingBox.width, "left", 0.05);

                    context.fillText(_("Ingredients"), relativeCoords.x, relativeCoords.y + ingredientsFontSize * 6);
                }
                context.restore();
                this.renderChildren();
            }.bind(blueprintIngredientsBox, this);

            var slotsPerRow = Math.floor((blueprintIngredientsBox.boundingBox.width - titleBoxPadding * 2) / iconSize);
            var slotSpacing = ((blueprintIngredientsBox.boundingBox.width - titleBoxPadding * 2) - (iconSize * slotsPerRow)) / (slotsPerRow - 1);
            if(isSelectedBlueprintKnown || isSelectedBlueprintAvailable)
            {
                var yOffset = ingredientsFontSize * 6;
                var ingredients = getBlueprintIngredients(this.craftCategory, this.selectedBlueprint.id);
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
                            onmouseenter: function (ingredient, x, y)
                            {
                                var coords = this.getGlobalCoordinates(x, y);
                                showTooltip(
                                    _(ingredient.item.getName()),
                                    _("Owned: {0}<br>Required: {1}", beautifynum(ingredient.item.getQuantityOwned()), beautifynum(ingredient.quantity)),
                                    (coords.x + iconSize) * uiScaleX,
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


                //HANDLE FUEL ROD DECAY REWARD DISPLAY
                var blueprintRewardsBox = new Hitbox(
                    {
                        x: xPadding,
                        y: ingredientsFontSize + blueprintNameBox.boundingBox.y + blueprintNameBox.boundingBox.height + titleBoxPadding + (iconSize * 2 + ingredientsFontSize),
                        width: blueprintNameBox.boundingBox.width,
                        height: titleBoxPadding * 3 + iconSize * 2 + ingredientsFontSize
                    },
                    {}, "", "ingredients"
                );

                var reactorComponent = reactorComponents[this.selectedBlueprint.craftedItem.item.id];
                if(reactorComponent.hasOwnProperty("rewardOutput") && reactorComponent["rewardOutput"] != null)
                {
                    blueprintRewardsBox.render = function (parentWindow)
                    {
                        var context = this.getContext();
                        var relativeCoords = this.getRelativeCoordinates(0, 0, parentWindow);
                        context.save();
                        if(parentWindow.currentTabIndex == 1)
                        {
                            context.globalAlpha = 0.6;
                            context.fillStyle = "#111111";
                            context.fillRect(relativeCoords.x, relativeCoords.y + ingredientsFontSize * 6, this.boundingBox.width, this.boundingBox.height - ingredientsFontSize * 5);
                            // context.fillRect(relativeCoords.x, relativeCoords.y + ingredientsFontSize, this.boundingBox.width, this.boundingBox.height - ingredientsFontSize);
                            context.globalAlpha = 1;
                            context.fillStyle = "#FFFFFF";
                            context.font = ingredientsFontSize + "px KanitM";
                            // context.textBaseline = "top";

                            context.fillText(_("Decay Rewards"), relativeCoords.x, relativeCoords.y + ingredientsFontSize * 6);
                        }
                        context.restore();
                        this.renderChildren();
                    }.bind(blueprintRewardsBox, this);


                    var fuelRodRewardOutput = reactorComponent.rewardOutput;
                    for(var i in fuelRodRewardOutput)
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
                                        _("Owned: {0}", beautifynum(ingredient.item.getQuantityOwned())),
                                        (coords.x + iconSize) * uiScaleX,
                                        coords.y * uiScaleY
                                    );
                                }.bind(blueprintRewardsBox, fuelRodRewardOutput[i], slotX, slotY + iconSize + ingredientsFontSize),
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
                        }.bind(ingredientIcon, this, fuelRodRewardOutput[i]);
                        blueprintRewardsBox.addHitbox(ingredientIcon);
                    }
                }

            }
            var craftButton = new Hitbox(
                {
                    x: blueprintNameBox.boundingBox.x + blueprintNameBox.boundingBox.width * 0.05,
                    y: this.craftingPane.boundingBox.height - 38,
                    width: blueprintNameBox.boundingBox.width * 0.9,
                    height: 38
                },
                {
                    onmousedown: function ()
                    {
                        if(isSelectedBlueprintKnown && this.currentTabIndex == 1)
                        {
                            if(craftBlueprint(this.selectedBlueprint.category, this.selectedBlueprint.id))
                            {
                                this.initializeCraftingPane();
                                newNews(_("You crafted {0}", this.selectedBlueprint.craftedItem.item.getName()), true);
                                if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
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
                if(parentWindow.currentTabIndex == 1 && !canCraftBlueprint(parentWindow.selectedBlueprint.category, parentWindow.selectedBlueprint.id))
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
                if(parentWindow.currentTabIndex == 1 && isSelectedBlueprintKnown && canCraftBlueprint(parentWindow.selectedBlueprint.category, parentWindow.selectedBlueprint.id))
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
                if(parentWindow.currentTabIndex == 1)
                {
                    buttonText = _("Craft");
                }
                fillTextShrinkToFit(context, buttonText, relativeCoords.x + 10, relativeCoords.y + this.boundingBox.height / 2 + 2, this.boundingBox.width - 20, "center");
                context.restore();
            }.bind(craftButton, this)
            this.craftingPane.addHitbox(blueprintNameBox);
            blueprintNameBox.addHitbox(blueprintIcon);
            this.craftingPane.addHitbox(blueprintIngredientsBox);
            this.craftingPane.addHitbox(blueprintRewardsBox);
            this.craftingPane.addHitbox(craftButton);
            this.isCraftingPaneInitialized = true;
        }
        else
        {
            var instructionsText = "";
            var instructionsText2 = "";
            if(this.currentTabIndex == 1)
            {
                if(getAvailableBlueprints().length > 0)
                {
                    instructionsText = _("Click on a blueprint on the left to view it");
                }
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

}

const HOVER_SYSTEM_COLORS = [
    'rgb(140, 110, 110)',
    'rgb(110, 110, 160)',
    'rgb(110, 160, 110)',
    'rgb(110, 160, 160)',
    'rgb(140, 110, 160)',
    'rgb(140, 160, 110)'
];
class ReactorGridCell extends DragDropUIComponent
{
    row;
    column;

    constructor(boundingBox, row, column)
    {
        super(boundingBox); // Need to call base class constructor

        this.displayType = 2;
        this.isDropRegion = true;
        this.dropTypesAccepted = [1];
        this.row = row;
        this.column = column;
        this.id = "Cell_" + row + "_" + column;
    }

    render()
    {
        var rootContext = this.getRootLayer().context;

        if(this.isDropCandidate && reactor.isCellUsable(this.column, this.row))
        {
            rootContext.save();
            rootContext.shadowBlur = 11;
            rootContext.shadowColor = "rgba(255, 255, 0, 1)";
        }

        var cellHoverSystemIndex = reactor.grid.getCellHoveredSystemIndex(this.column, this.row);
        if(cellHoverSystemIndex > -1)
        {
            rootContext.fillStyle = HOVER_SYSTEM_COLORS[cellHoverSystemIndex];
            rootContext.strokeStyle = 'rgb(0, 0, 0)';
        }
        else if(reactor.isCellUsable(this.column, this.row))
        {
            if(reactor.grid.isCellInOverheatingSystem(this.column, this.row))
            {
                var redAmt = (oscillate(numFramesRendered, 7) * 80) + 125;
                rootContext.fillStyle = 'rgb(' + redAmt + ', 25, 25)';
                rootContext.strokeStyle = 'rgb(0, 0, 0)';
            }
            else
            {
                rootContext.fillStyle = 'rgb(220, 220, 220)';
                rootContext.strokeStyle = 'rgb(0, 0, 0)';
            }
        }
        else
        {
            rootContext.fillStyle = 'rgb(64, 64, 64)';
            rootContext.strokeStyle = 'rgb(42, 42, 42)';
            rootContext.globalAlpha = 0.55;
        }
        var localCoordinates = this.parent.getRelativeCoordinates(this.boundingBox.x, this.boundingBox.y, this.getRootLayer());
        rootContext.strokeRect(localCoordinates.x, localCoordinates.y, this.boundingBox.width, this.boundingBox.height);
        rootContext.fillRect(localCoordinates.x, localCoordinates.y, this.boundingBox.width, this.boundingBox.height);
        rootContext.globalAlpha = 1;
        super.render();

        if(this.isDropCandidate)
        {
            rootContext.restore();
        }
    }

    onAcceptDrop()
    {
        if(!reactor.isCellUsable(this.column, this.row))
        {
            activeDraggingInstance.onDropFailed();
            return;
        }
        if(this.hitboxes.length > 0) //deal with swapping later
        {
            activeDraggingInstance.onDropFailed();
            return;
        }
        super.onAcceptDrop();


        if(activeDraggingInstance.reactorComponentType != null && activeDraggingInstance.parentBeforeDrag.displayType == 2)
        {
            if(activeDraggingInstance.parentBeforeDrag.hasOwnProperty("row"))
            {
                var column = activeDraggingInstance.parentBeforeDrag.column;
                var row = activeDraggingInstance.parentBeforeDrag.row;
                reactor.grid.removeComponentFromCell(column, row);
            }
        }

        if(activeDraggingInstance.reactorComponentType != null)
        {
            if(activeDraggingInstance.parentBeforeDrag.hasOwnProperty("row"))
            {
                var column = activeDraggingInstance.parentBeforeDrag.column;
                var row = activeDraggingInstance.parentBeforeDrag.row;
                reactor.grid.addComponentToCell(this.column, this.row, activeDraggingInstance.reactorComponentType, column, row);
            }
            else
            {
                reactor.grid.addComponentToCell(this.column, this.row, activeDraggingInstance.reactorComponentType, null, null);
            }
        }

        this.addHitbox(activeDraggingInstance);
        redrawInventoryAndGrid();
        activeDraggingInstance.boundingBox.x = 1;
        activeDraggingInstance.boundingBox.y = 1;
    }

    onChildRemoved()
    {
        super.onChildRemoved();
        redrawInventoryAndGrid();
    }
}

function redrawInventoryAndGrid()
{
    var inventoryPane = activeLayers.Reactor.getHitboxById("reactorPane").getHitboxById("inventoryPane");
    var gridPane = activeLayers.Reactor.getHitboxById("reactorPane").getHitboxById("reactorGrid");
    for(var i = 1; i < reactorComponents.length; i++)
    {
        var typeInSlot = reactor.getTypeForSlot(i);
        var slotHitbox = inventoryPane.getHitboxById("Inv_" + i);

        slotHitbox.clearHitboxes();

        if(typeInSlot > -1)
        {
            var inventoryComponent = new ReactorComponentUI({
                x: 0,
                y: 0,
                width: activeLayers.Reactor.widthHeightPerCell,
                height: activeLayers.Reactor.widthHeightPerCell
            }, typeInSlot);
            inventoryComponent.isOnGrid = false;
            slotHitbox.addHitbox(inventoryComponent);
        }
    }

    for(var i = 0; i < MAX_REACTOR_CELLS_ROWS; i++)
    {
        for(var j = 0; j < MAX_REACTOR_CELLS_COLUMNS; j++)
        {
            var gridCellHitbox = gridPane.getHitboxById("Cell_" + i + "_" + j);
            gridCellHitbox.clearHitboxes();

            if(reactor.grid.grid[i][j] != EMPTY_INTEGER_VALUE)
            {
                var gridComponent = new ReactorComponentUI({
                    x: 0,
                    y: 0,
                    width: activeLayers.Reactor.widthHeightPerCell,
                    height: activeLayers.Reactor.widthHeightPerCell
                }, reactor.grid.grid[i][j]);
                gridComponent.gridSlotX = j;
                gridComponent.gridSlotY = i;
                gridComponent.isOnGrid = true;
                gridCellHitbox.addHitbox(gridComponent);
            }
        }
    }
}

class ReactorInventorySlot extends DragDropUIComponent
{
    slotIndex;

    constructor(boundingBox, slotIndex)
    {
        super(boundingBox); // Need to call base class constructor

        this.displayType = 3;
        this.isDropRegion = true;
        this.dropTypesAccepted = [1];
        this.slotIndex = slotIndex;
        this.id = "Inv_" + slotIndex;
    }

    render()
    {
        var rootContext = this.getRootLayer().context;

        if(this.isDropCandidate)
        {
            rootContext.save();
            rootContext.shadowBlur = 11;
            rootContext.shadowColor = "rgba(255, 255, 0, 1)";
        }

        rootContext.strokeStyle = 'rgb(0, 0, 0)';
        rootContext.fillStyle = 'rgb(200, 200, 200)';
        var localCoordinates = this.parent.getRelativeCoordinates(this.boundingBox.x, this.boundingBox.y, this.getRootLayer());
        rootContext.strokeRect(localCoordinates.x, localCoordinates.y, this.boundingBox.width, this.boundingBox.height);
        rootContext.fillRect(localCoordinates.x, localCoordinates.y, this.boundingBox.width, this.boundingBox.height);
        super.render();

        rootContext.fillStyle = 'rgb(255, 255, 255)';
        rootContext.textBaseline = "bottom";
        rootContext.lineWidth = 3;
        rootContext.font = "14px Verdana"

        var typeToRender = reactor.getTypeForSlot(this.slotIndex);
        var numOfTypeInInventory = reactor.numOfTypeInInventory(typeToRender);
        if(numOfTypeInInventory > 0)
        {
            var textLength = rootContext.measureText(numOfTypeInInventory).width;
            rootContext.strokeText(numOfTypeInInventory, localCoordinates.x + this.boundingBox.width - (textLength + 1), localCoordinates.y + this.boundingBox.height - 1);
            rootContext.fillText(numOfTypeInInventory, localCoordinates.x + this.boundingBox.width - (textLength + 1), localCoordinates.y + this.boundingBox.height - 1);
        }

        if(this.isDropCandidate)
        {
            rootContext.restore();
        }
    }

    onAcceptDrop()
    {
        super.onAcceptDrop();

        if(activeDraggingInstance.reactorComponentType != null && activeDraggingInstance.parentBeforeDrag.displayType == 2)
        {
            if(activeDraggingInstance.parentBeforeDrag.hasOwnProperty("row"))
            {
                var column = activeDraggingInstance.parentBeforeDrag.column;
                var row = activeDraggingInstance.parentBeforeDrag.row;

                var componentTypeAtCell = reactor.grid.getComponentTypeInCellAtLocation(column, row);
                if(FUEL_ROD_TYPES.includes(componentTypeAtCell))
                {
                    if(reactorComponents[componentTypeAtCell].energyProductionPerSecond > 0)
                    {
                        if(reactor.grid.isFuelCellBurnedUp(column, row))
                        {
                            //They should be prompted when clicking this
                            activeDraggingInstance.onDropFailed();
                            return;
                        }
                        else if(reactor.grid.getFuelCellRemainingEnergy(column, row) != reactorComponents[componentTypeAtCell].totalEnergyOutput)
                        {
                            //some of the fuel already burned do not allow return without deletion first
                            //prompt for deletion
                            showConfirmationPrompt(
                                _("This Fuel Rod has been partially used, it cannot be returned to inventory. Do you wish to delete it?"),
                                _("Yes, Delete It"),
                                function (gridSlotX, gridSlotY)
                                {
                                    reactor.grid.deleteFuelCellState(gridSlotX, gridSlotY);
                                    reactor.grid.deleteComponentInCellAndRemoveQuantityOwned(gridSlotX, gridSlotY);
                                    redrawInventoryAndGrid();
                                    hideSimpleInput();
                                }.bind(null, column, row),
                                _("Cancel")
                            );
                            activeDraggingInstance.onDropFailed();
                            return;
                        }
                        else
                        {
                            //fuel cell was never used allow it to be returned to inventory
                            reactor.grid.deleteFuelCellState(column, row);
                        }
                    }
                    else
                    {
                        reactor.grid.deleteFuelCellState(column, row);
                    }
                }
                else if(BATTERY_TYPES.includes(componentTypeAtCell))
                {
                    var totalCapacityWithBatteryRemoved = reactor.grid.maxBatteryCapacity() - reactorComponents[componentTypeAtCell].energyStorage;
                    if(reactor.currentBatteryCharge() > totalCapacityWithBatteryRemoved)
                    {

                        showConfirmationPrompt(
                            _("Returning this battery to storage will result in decreased total energy stored.  Do you want to proceed?"),
                            _("Yes"),
                            function (gridSlotX, gridSlotY)
                            {
                                reactor.grid.removeComponentFromCell(gridSlotX, gridSlotY);
                                redrawInventoryAndGrid();
                                hideSimpleInput();
                            }.bind(null, column, row),
                            _("Cancel")
                        );
                        activeDraggingInstance.onDropFailed();
                        return;
                    }
                }
                reactor.grid.removeComponentFromCell(column, row);
            }
        }
        redrawInventoryAndGrid();

        activeDraggingInstance.boundingBox.x = 1;
        activeDraggingInstance.boundingBox.y = 1;
    }

    onChildRemoved()
    {
        super.onChildRemoved();
        redrawInventoryAndGrid();
    }
}

class ReactorComponentUI extends DragDropUIComponent
{
    reactorComponentType;
    gridSlotX;
    gridSlotY;
    isOnGrid;
    isMouseOver = false;

    constructor(boundingBox, reactorComponentType)
    {
        super(boundingBox); // Need to call base class constructor

        this.displayType = 1;
        this.isDraggable = true;
        this.reactorComponentType = reactorComponentType;
    }

    cellTypeTop()
    {
        if(this.isOnGrid && this.gridSlotY > 0)
        {
            return reactor.grid.getComponentTypeInCellAtLocation(this.gridSlotX, this.gridSlotY - 1);
        }
        return null;
    }

    cellTypeBottom()
    {
        if(this.isOnGrid && this.gridSlotY < MAX_REACTOR_CELLS_ROWS - 1)
        {
            return reactor.grid.getComponentTypeInCellAtLocation(this.gridSlotX, this.gridSlotY + 1);
        }
        return null;
    }

    cellTypeRight()
    {
        if(this.isOnGrid && this.gridSlotX < MAX_REACTOR_CELLS_COLUMNS - 1)
        {
            return reactor.grid.getComponentTypeInCellAtLocation(this.gridSlotX + 1, this.gridSlotY);
        }
        return null;
    }

    cellTypeLeft()
    {
        if(this.isOnGrid && this.gridSlotX > 0)
        {
            return reactor.grid.getComponentTypeInCellAtLocation(this.gridSlotX - 1, this.gridSlotY);
        }
        return null;
    }

    render()
    {
        var rootContext = this.getRootLayer().context;

        if(this.isDropCandidate)
        {
            rootContext.save();
            rootContext.shadowBlur = 11;
            rootContext.shadowColor = "rgba(255, 255, 0, 1)";
        }

        rootContext.strokeStyle = 'rgb(0, 0, 0)';
        rootContext.fillStyle = 'rgb(255, 255, 255)';
        this.renderComponent();
        super.render();

        if(this.isDropCandidate)
        {
            rootContext.restore();
        }
    }

    onmouseenter(e)
    {
        super.onmouseenter(e);

        reactorComponents[this.reactorComponentType].showTooltip(this);
        this.isMouseOver = true;
        reactor.grid.setComponentAsInFocus(this.gridSlotX, this.gridSlotY);
    }

    onmouseexit(e)
    {
        super.onmouseexit(e);
        hideTooltip();

        this.isMouseOver = false;
        reactor.grid.unsetComponentAsInFocus(this.gridSlotX, this.gridSlotY);
    }

    onmousedown(e)
    {
        if(!keysPressed["Shift"])
        {
            super.onmousedown(e);

            if(this.isOnGrid && FUEL_ROD_TYPES.includes(this.reactorComponentType))
            {
                if(reactor.grid.isFuelCellBurnedUp(this.gridSlotX, this.gridSlotY))
                {
                    showConfirmationPrompt(
                        _("Collect materials from decayed fuel rod?"),
                        _("Yes"),
                        function ()
                        {
                            reactor.grid.collectFuelCell(this.gridSlotX, this.gridSlotY);
                            hideSimpleInput();
                            redrawInventoryAndGrid();
                        }.bind(this),
                        _("Cancel")
                    );
                }
            }
        }
        else
        {
            if(this.isOnGrid)
            {
                var componentTypeAtCell = reactor.grid.getComponentTypeInCellAtLocation(this.gridSlotX, this.gridSlotY);
                console.log(componentTypeAtCell);
                if(FUEL_ROD_TYPES.includes(this.reactorComponentType))
                {
                    if(reactor.grid.isFuelCellBurnedUp(this.gridSlotX, this.gridSlotY))
                    {
                        reactor.grid.collectFuelCell(this.gridSlotX, this.gridSlotY);
                    }
                    else if(reactor.grid.getFuelCellRemainingEnergy(this.gridSlotX, this.gridSlotY) != reactorComponents[componentTypeAtCell].totalEnergyOutput && reactorComponents[componentTypeAtCell].totalEnergyOutput > 0)
                    {
                        //some of the fuel already burned do not allow return without deletion first
                        //prompt for deletion
                        showConfirmationPrompt(
                            _("This Fuel Rod has been partially used, it cannot be returned to inventory. Do you wish to delete it?"),
                            _("Yes, Delete It"),
                            function (gridSlotX, gridSlotY)
                            {
                                reactor.grid.deleteFuelCellState(gridSlotX, gridSlotY);
                                reactor.grid.deleteComponentInCellAndRemoveQuantityOwned(gridSlotX, gridSlotY);
                                redrawInventoryAndGrid();
                                hideSimpleInput();
                            }.bind(null, this.gridSlotX, this.gridSlotY),
                            _("Cancel")
                        );
                    }
                    else
                    {
                        reactor.grid.deleteFuelCellState(this.gridSlotX, this.gridSlotY);
                        reactor.grid.removeComponentFromCell(this.gridSlotX, this.gridSlotY);
                    }
                }
                else
                {
                    reactor.grid.removeComponentFromCell(this.gridSlotX, this.gridSlotY);
                }
                redrawInventoryAndGrid();
            }
            else
            {
                var placedComponent = false;
                reactor.grid.grid.forEach((row, rowNumber) =>
                {
                    if(placedComponent == false)
                    {
                        row.forEach((column, columnNumber) =>
                        {
                            if(column == 0 && placedComponent == false && reactor.isCellUsable(columnNumber, rowNumber))
                            {
                                reactor.grid.addComponentToCell(columnNumber, rowNumber, this.reactorComponentType, null, null);
                                placedComponent = true;
                                redrawInventoryAndGrid();
                            }
                        })
                    }
                })
            }
        }

    }

    renderComponent()
    {
        var rootContext = this.getRootLayer().context;
        var localCoordinates = this.parent.getRelativeCoordinates(this.boundingBox.x, this.boundingBox.y, this.getRootLayer());
        reactorComponents[this.reactorComponentType].render(this, rootContext, localCoordinates.x, localCoordinates.y, this.boundingBox.width, this.boundingBox.height);
    }
}