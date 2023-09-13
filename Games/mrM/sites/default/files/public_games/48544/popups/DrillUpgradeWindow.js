class DrillUpgradeWindow extends TabbedPopupWindow
{
    layerName = "drill"; // Used as key in activeLayers
    domElementId = "DRILLD"; // ID of dom element that gets shown or hidden
    context = DRILL;         // Canvas rendering context for popup

    constructor(boundingBox)
    {
        super(boundingBox); // Need to call base class constructor
        if(!boundingBox)
        {
            this.setBoundingBox();
        }
        this.setFrameImagesByWorldIndex(0);
        this.initializeTabs([_("Engine"), _("Drill"), _("Drill Fan"), _("Cargo")]);

        this.addHitbox(new Hitbox(
            {
                x: this.boundingBox.width * 0.31,
                y: (this.boundingBox.height) * 0.81,
                width: this.boundingBox.width * 0.35,
                height: this.boundingBox.height * 0.08
            },
            {
                onmousedown: function ()
                {
                    var nextLevelEquip = getDrillEquipByLevel(this.parent.currentTabIndex, getDrillEquipById(drillState.equippedDrillEquips[this.parent.currentTabIndex]).level + 1);
                    var nextLevelBlueprint = getDrillBlueprintByEquipId(nextLevelEquip.id);
                    var craftingItems = getIngredientListWithDiscounts(nextLevelBlueprint.ingredients);

                    for(var i = 0; i < craftingItems.length; i++)
                    {
                        if(craftingItems[i].item.hasQuantity(craftingItems[i].quantity / 10))
                        {
                            craftingItems[i].item.spendQuantity(craftingItems[i].quantity / 10);
                        }
                    }
                    drillState.levelsTowardNextUpgrades[this.parent.currentTabIndex] += 1;

                    if(drillState.levelsTowardNextUpgrades[this.parent.currentTabIndex] >= 10)
                    {
                        drillState.equippedDrillEquips[nextUpgrade.type] = nextUpgrade.id;
                        newNews(_("You crafted {0}", nextLevelBlueprint.craftedItem.item.getName()), true);
                        drillState.levelsTowardNextUpgrades[this.parent.currentTabIndex] = 0;
                    }

                    if(!mutebuttons) craftDrillAudio.play();
                }
            },
            'pointer',
            "upgradeButton"
        ));
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.context.restore();
        super.render();
        var nextUpgrade = getDrillEquipByLevel(this.currentTabIndex, getDrillEquipById(drillState.equippedDrillEquips[this.currentTabIndex]).level + 1);

        renderProgressBar(this.context, _("{0}/10", drillState.levelsTowardNextUpgrades[this.currentTabIndex]), extradarkgreydot, blackdot, this.boundingBox.width * .2, this.boundingBox.height * .20, this.boundingBox.width * .58, this.boundingBox.height * .09, "#FFFFFF", Number(drillState.levelsTowardNextUpgrade) * .1);

        this.context.drawImage(getDrillEquipById(drillState.equippedDrillEquips[this.currentTabIndex]).icon, 0, 0, 50, 50, this.boundingBox.width * .1, this.boundingBox.height * .18, this.boundingBox.width * .08, this.boundingBox.height * .12);
        this.context.drawImage(nextUpgrade.icon, 0, 0, 50, 50, this.boundingBox.width * .8, this.boundingBox.height * .18, this.boundingBox.width * .08, this.boundingBox.height * .12);

        var wattsAfterLevel = drillState.totalWattage();
        var wattMultiplierAfterLevel = drillState.totalWattMultiplier();
        var cargoImprovement = maxHoldingCapacity();

        if(this.currentTabIndex == 0)
        {
            wattMultiplierAfterLevel = drillState.statForType(ENGINE_TYPE, drillState.levelsTowardNextUpgrades[ENGINE_TYPE] + 1, "wattMultiplier") * drillState.statForType(DRILL_TYPE, drillState.levelsTowardNextUpgrades[DRILL_TYPE], "wattMultiplier") * drillState.statForType(DRILL_FAN_TYPE, drillState.levelsTowardNextUpgrades[DRILL_FAN_TYPE], "wattMultiplier");
            wattsAfterLevel = drillState.statForType(ENGINE_TYPE, drillState.levelsTowardNextUpgrades[ENGINE_TYPE] + 1, "baseWatts") + drillState.statForType(DRILL_TYPE, drillState.levelsTowardNextUpgrades[DRILL_TYPE], "baseWatts") + drillState.statForType(DRILL_FAN_TYPE, drillState.levelsTowardNextUpgrades[DRILL_FAN_TYPE], "baseWatts");
        }
        else if(this.currentTabIndex == 1)
        {
            wattMultiplierAfterLevel = drillState.statForType(ENGINE_TYPE, drillState.levelsTowardNextUpgrades[ENGINE_TYPE], "wattMultiplier") * drillState.statForType(DRILL_TYPE, drillState.levelsTowardNextUpgrades[DRILL_TYPE] + 1, "wattMultiplier") * drillState.statForType(DRILL_FAN_TYPE, drillState.levelsTowardNextUpgrades[DRILL_FAN_TYPE], "wattMultiplier");
            wattsAfterLevel = drillState.statForType(ENGINE_TYPE, drillState.levelsTowardNextUpgrades[ENGINE_TYPE], "baseWatts") + drillState.statForType(DRILL_TYPE, drillState.levelsTowardNextUpgrades[DRILL_TYPE] + 1, "baseWatts") + drillState.statForType(DRILL_FAN_TYPE, drillState.levelsTowardNextUpgrades[DRILL_FAN_TYPE], "baseWatts");
        }
        else if(this.currentTabIndex == 2)
        {
            wattMultiplierAfterLevel = drillState.statForType(ENGINE_TYPE, drillState.levelsTowardNextUpgrades[ENGINE_TYPE], "wattMultiplier") * drillState.statForType(DRILL_TYPE, drillState.levelsTowardNextUpgrades[DRILL_TYPE], "wattMultiplier") * drillState.statForType(DRILL_FAN_TYPE, drillState.levelsTowardNextUpgrades[DRILL_FAN_TYPE] + 1, "wattMultiplier");
            wattsAfterLevel = drillState.statForType(ENGINE_TYPE, drillState.levelsTowardNextUpgrades[ENGINE_TYPE], "baseWatts") + drillState.statForType(DRILL_TYPE, drillState.levelsTowardNextUpgrades[DRILL_TYPE], "baseWatts") + drillState.statForType(DRILL_FAN_TYPE, drillState.levelsTowardNextUpgrades[DRILL_FAN_TYPE] + 1, "baseWatts");
        }
        else if(this.currentTabIndex == 3)
        {
            if(drillState.levelsTowardNextUpgrades[this.currentTabIndex] + 1n < 10n)
            {
                cargoImprovement = (nextUpgrade.capacity - maxHoldingCapacity()) * ((drillState.levelsTowardNextUpgrades[this.currentTabIndex] + 1) * .5);
            }
            else
            {
                cargoImprovement = nextUpgrade.capacity;
            }
        }

        this.context.font = "13px Verdana";

        //Watts
        this.context.fillStyle = "#1c1c1cd6";
        this.context.fillRect(this.boundingBox.width * .07, this.boundingBox.height * .34, this.boundingBox.width * .25, this.boundingBox.height * .21);
        this.context.fillStyle = "#000000";
        this.context.strokeRect(this.boundingBox.width * .07, this.boundingBox.height * .34, this.boundingBox.width * .25, this.boundingBox.height * .21);
        this.context.fillStyle = "#FFFFFF";
        this.context.fillText(_("Watts"), this.boundingBox.width * .07 + (this.boundingBox.width * .25 / 2 - this.context.measureText(_("Watts")).width / 2), this.boundingBox.height * .38);
        this.context.fillText(beautifynum(drillState.totalBaseWattage()), this.boundingBox.width * .07 + (this.boundingBox.width * .25 / 2 - this.context.measureText(beautifynum(drillState.totalWattage())).width / 2), this.boundingBox.height * .43);
        this.context.fillText(_("Next Level"), this.boundingBox.width * .07 + (this.boundingBox.width * .25 / 2 - this.context.measureText(_("Next Level")).width / 2), this.boundingBox.height * .48);
        this.context.fillText(beautifynum(wattsAfterLevel), this.boundingBox.width * .07 + (this.boundingBox.width * .25 / 2 - this.context.measureText(beautifynum(wattsAfterLevel)).width / 2), this.boundingBox.height * .53);

        //Watts Multiplier
        this.context.fillStyle = "#1c1c1cd6";
        this.context.fillRect(this.boundingBox.width * .36, this.boundingBox.height * .34, this.boundingBox.width * .25, this.boundingBox.height * .21);
        this.context.fillStyle = "#000000";
        this.context.strokeRect(this.boundingBox.width * .36, this.boundingBox.height * .34, this.boundingBox.width * .25, this.boundingBox.height * .21);
        this.context.fillStyle = "#FFFFFF";
        this.context.fillText(_("Watts Multiplier"), this.boundingBox.width * .36 + (this.boundingBox.width * .25 / 2 - this.context.measureText(_("Watts Multiplier")).width / 2), this.boundingBox.height * .38);
        this.context.fillText(beautifynum(drillState.totalWattMultiplier()), this.boundingBox.width * .36 + (this.boundingBox.width * .25 / 2 - this.context.measureText(beautifynum(drillState.totalWattMultiplier())).width / 2), this.boundingBox.height * .43);
        this.context.fillText(_("Next Level"), this.boundingBox.width * .36 + (this.boundingBox.width * .25 / 2 - this.context.measureText(_("Next Level")).width / 2), this.boundingBox.height * .48);
        this.context.fillText(beautifynum(wattMultiplierAfterLevel), this.boundingBox.width * .36 + (this.boundingBox.width * .25 / 2 - this.context.measureText(beautifynum(wattMultiplierAfterLevel)).width / 2), this.boundingBox.height * .53);

        //Cargo
        this.context.fillStyle = "#1c1c1cd6";
        this.context.fillRect(this.boundingBox.width * .65, this.boundingBox.height * .34, this.boundingBox.width * .25, this.boundingBox.height * .21);
        this.context.fillStyle = "#000000";
        this.context.strokeRect(this.boundingBox.width * .65, this.boundingBox.height * .34, this.boundingBox.width * .25, this.boundingBox.height * .21);
        this.context.fillStyle = "#FFFFFF";
        this.context.fillText(_("Cargo"), this.boundingBox.width * .65 + (this.boundingBox.width * .25 / 2 - this.context.measureText(_("Cargo")).width / 2), this.boundingBox.height * .38);
        this.context.fillText(beautifynum(maxHoldingCapacity()), this.boundingBox.width * .65 + (this.boundingBox.width * .25 / 2 - this.context.measureText(beautifynum(maxHoldingCapacity())).width / 2), this.boundingBox.height * .43);
        this.context.fillText(_("Next Level"), this.boundingBox.width * .65 + (this.boundingBox.width * .25 / 2 - this.context.measureText(_("Next Level")).width / 2), this.boundingBox.height * .48);
        this.context.fillText(beautifynum(cargoImprovement), this.boundingBox.width * .65 + (this.boundingBox.width * .25 / 2 - this.context.measureText(beautifynum(cargoImprovement)).width / 2), this.boundingBox.height * .53);

        this.context.fillStyle = "#1c1c1cd6";
        this.context.fillRect(this.boundingBox.width * .15, this.boundingBox.height * .58, this.boundingBox.width * .68, this.boundingBox.height * .2);
        this.context.fillStyle = "#000000";
        this.context.strokeRect(this.boundingBox.width * .15, this.boundingBox.height * .58, this.boundingBox.width * .68, this.boundingBox.height * .2);

        this.context.font = "15px Verdana";
        this.context.fillStyle = "#FFFFFF";
        this.context.fillText(_("Ingredients"), this.boundingBox.width * .17, this.boundingBox.height * .63);

        this.context.font = "20px KanitB";

        var craftingItems = getIngredientListWithDiscounts(getDrillBlueprintByEquipId(nextUpgrade.id).ingredients);

        for(var i = 0; i < craftingItems.length; i++)
        {
            var item = craftingItems[i].item;
            this.context.drawImage(item.getIcon(), 0, 0, 70, 70, this.boundingBox.width * .17 + (i * 70), this.boundingBox.height * .65, this.boundingBox.width * .08, this.boundingBox.height * .12);
            this.context.fillStyle = "#FFFFFF";
            this.context.fillText(shortenAndBeautifyNum(craftingItems[i].quantity / 10), this.boundingBox.width * .17 + (i * 70), this.boundingBox.height * .75);
            this.context.fillStyle = "#000000";
            this.context.strokeText(shortenAndBeautifyNum(craftingItems[i].quantity / 10), this.boundingBox.width * .17 + (i * 70), this.boundingBox.height * .75);

            if(craftingItems[i].item.hasQuantity(craftingItems[i].quantity / 10))
            {
                renderCheckmark(this.context, this.boundingBox.width * .17 + (i * 70), this.boundingBox.height * .65, 70 / 5, 70 / 5);
            }
            else
            {
                renderXMark(this.context, this.boundingBox.width * .17 + (i * 70), this.boundingBox.height * .65, 60 / 5, 60 / 5);
            }
        }


        this.context.drawImage(upgradeb, this.boundingBox.width * 0.31, this.boundingBox.height * 0.81, this.boundingBox.width * 0.35, this.boundingBox.height * 0.08);
        this.context.font = "19px KanitB";
        this.context.fillStyle = "#000000";
        this.context.fillText(_("Upgrade"), this.boundingBox.width * .31 + (this.boundingBox.width * .35 / 2 - this.context.measureText(_("Upgrade")).width / 2), this.boundingBox.height * .86);
    }
}
