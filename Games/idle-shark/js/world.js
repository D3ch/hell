"use strict";
SharkGame.World = {
    _worldType: "start",
    get worldType() {
        return this._worldType;
    },
    set worldType(worldType) {
        const body = document.querySelector("body");
        body.classList.remove(this._worldType);
        body.classList.add(worldType);
        this._worldType = worldType;
    },
    worldResources: new Map(),
    worldRestrictedCombinations: new Map(),

    init() {
        world.resetWorldProperties();
        world.worldType = "start";
    },

    setup() {
        res.setResource("world", 1);
        res.setTotalResource("world", 1);
        world.apply();
        res.setResource("specialResourceOne", 1);
        res.setTotalResource("specialResourceOne", 1);
        res.setResource("specialResourceTwo", 1);
        res.setTotalResource("specialResourceTwo", 1);
    },

    apply() {
        world.applyWorldProperties();
        world.applyGateCosts();
    },

    resetWorldProperties() {
        const worldResources = world.worldResources;
        world.worldRestrictedCombinations.clear();

        // set up defaults
        SharkGame.ResourceMap.forEach((_resourceData, resourceName) => {
            worldResources.set(resourceName, {});
            worldResources.get(resourceName).exists = true;
        });
    },

    applyWorldProperties() {
        const worldResources = world.worldResources;
        const worldInfo = SharkGame.WorldTypes[world.worldType];

        // enable resources allowed on the planet
        if (worldInfo.includedResources) {
            SharkGame.ResourceMap.forEach((_resourceData, resourceName) => {
                worldResources.get(resourceName).exists = false;
            });
            _.each(worldInfo.includedResources, (group) => {
                if (_.has(SharkGame.InternalCategories, group)) {
                    _.each(SharkGame.InternalCategories[group].resources, (resource) => {
                        worldResources.get(resource).exists = true;
                    });
                } else {
                    worldResources.get(group).exists = true;
                }
            });
        }

        // disable resources not allowed on planet
        _.each(worldInfo.absentResources, (absentResource) => {
            worldResources.get(absentResource).exists = false;
        });

        // apply world modifiers
        _.each(worldInfo.modifiers, (modifierData) => {
            res.applyModifier(modifierData.modifier, modifierData.resource, modifierData.amount);
        });
        res.buildIncomeNetwork();
    },

    applyGateCosts() {
        const worldInfo = SharkGame.WorldTypes[world.worldType];

        // get multiplier
        const gateCostMultiplier = world.getGateCostMultiplier();

        SharkGame.Gate.createSlots(worldInfo.gateRequirements, gateCostMultiplier);
    },

    getWorldEntryMessage() {
        return SharkGame.WorldTypes[world.worldType].entry;
    },

    doesResourceExist(resourceName) {
        return world.worldResources.get(resourceName).exists;
    },

    forceExistence(resourceName) {
        world.worldResources.get(resourceName).exists = true;
    },

    getGateCostMultiplier() {
        return 1;
    },

    isScoutingMission() {
        if (SharkGame.flags.scouting) {
            return true;
        }

        // if this is NOT marked as a scouting mission, make sure that's accurate
        // (but if it IS marked as a scouting mission, we don't care if that's accurate, just blindly accept)
        if (!gateway.completedWorlds.includes(world.worldType)) {
            // this should be a scouting mission
            SharkGame.flags.scouting = true;
        }
        return SharkGame.flags.scouting;
    },
};
