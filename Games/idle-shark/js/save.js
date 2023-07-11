"use strict";
SharkGame.Save = {
    saveFileName: "sharkGameSave",

    saveGame() {
        // populate save data object
        let saveString = "";
        const saveData = {
            version: SharkGame.VERSION,
            resources: {},
            tabs: {},
            completedRequirements: {},
            world: { type: world.worldType },
            aspects: {},
            gateway: { betweenRuns: SharkGame.gameOver, wonGame: SharkGame.wonGame },
        };

        SharkGame.PlayerResources.forEach((resource, resourceId) => {
            if (resource.amount > 0 || resource.totalAmount > 0) {
                saveData.resources[resourceId] = {
                    amount: resource.amount,
                    totalAmount: resource.totalAmount,
                };
            }
        });

        saveData.upgrades = _.cloneDeep(SharkGame.Upgrades.purchased);
        // Save non-zero artifact levels
        _.each(SharkGame.Aspects, ({ level }, aspectId) => {
            if (level) saveData.aspects[aspectId] = level;
        });

        $.each(SharkGame.Tabs, (tabId, tab) => {
            if (tabId !== "current") {
                saveData.tabs[tabId] = [tab.discovered, tab.seen];
            } else {
                saveData.tabs.current = tab;
            }
        });

        saveData.completedRequirements = _.cloneDeep(SharkGame.Gate.completedRequirements);
        saveData.settings = _.cloneDeep(SharkGame.Settings.current);

        saveData.completedWorlds = _.cloneDeep(SharkGame.Gateway.completedWorlds);

        saveData.flags = _.cloneDeep(SharkGame.flags);
        saveData.persistentFlags = _.cloneDeep(SharkGame.persistentFlags);
        saveData.planetPool = _.cloneDeep(gateway.planetPool);

        saveData.keybinds = SharkGame.Keybinds.keybinds;

        // add timestamp
        saveData.timestampLastSave = _.now();
        saveData.timestampGameStart = SharkGame.timestampGameStart;
        saveData.timestampRunStart = SharkGame.timestampRunStart;
        saveData.timestampRunEnd = SharkGame.timestampRunEnd;

        saveData.saveVersion = SharkGame.Save.saveUpdaters.length - 1;
        saveString = ascii85.encode(pako.deflate(JSON.stringify(saveData), { to: "string" }));

        try {
            if (saveString === undefined || saveString === "<~~>") throw new Error("Something went wrong while saving");
            localStorage.setItem(SharkGame.Save.saveFileName, saveString);
        } catch (err) {
            throw new Error("Couldn't save to local storage. Reason: " + err.message);
        }

        return saveString;
    },

    decodeSave(saveDataString) {
        // if first letter of string is <, data is encoded in ascii85, decode it.
        if (saveDataString.substring(0, 2) === "<~") {
            try {
                saveDataString = ascii85.decode(saveDataString);
            } catch (err) {
                throw new Error(
                    "Saved data looked like it was encoded in ascii85, but it couldn't be decoded. Can't load. Your save: " + saveDataString
                );
            }
        }

        // if first letter of string is x, data is compressed and needs uncompressing.
        if (saveDataString.charAt(0) === "x") {
            // decompress string
            try {
                saveDataString = pako.inflate(saveDataString, { to: "string" });
            } catch (err) {
                throw new Error("Saved data is compressed, but it can't be decompressed. Can't load. Your save: " + saveDataString);
            }
        }

        // if first letter of string is {, data is json
        if (saveDataString.charAt(0) === "{") {
            try {
                return JSON.parse(saveDataString);
            } catch (err) {
                const errMessage = "Couldn't load save data. It didn't parse correctly. Your save: " + saveDataString;
                throw new Error(errMessage);
            }
        }
    },

    loadGame(importSaveData) {
        let saveData;
        const saveDataString = importSaveData || localStorage.getItem(SharkGame.Save.saveFileName);

        if (!saveDataString) {
            throw new Error("Tried to load game, but no game to load.");
        } else if (typeof saveDataString !== "string") {
            throw new Error("Tried to load game, but save wasn't a string.");
        }

        saveData = this.decodeSave(saveDataString);

        if (saveData) {
            // check for updates
            const currentVersion = SharkGame.Save.saveUpdaters.length - 1;
            if (!_.has(saveData, "saveVersion")) {
                saveData = SharkGame.Save.saveUpdaters[0](saveData);
            } else if (typeof saveData.saveVersion !== "number" || saveData.saveVersion <= 12) {
                // After save version 12, packing support was removed; Backwards compatibility is not maintained because gameplay changed significantly after this point.
                throw new Error("This is a save from before New Frontiers 0.2, after which the save system was changed.");
            } else if (saveData.saveVersion === 15 || saveData.saveVersion === 16) {
                // gonna reset aspects, need to inform player
                SharkGame.missingAspects = true;
            }

            if (saveData.saveVersion < currentVersion) {
                for (let i = saveData.saveVersion + 1; i <= currentVersion; i++) {
                    const updater = SharkGame.Save.saveUpdaters[i];
                    saveData = updater(saveData);
                    saveData.saveVersion = i;
                }
                // let player know update went fine
                log.addMessage("Updated save data from v " + saveData.version + " to " + SharkGame.VERSION + ".");
            }

            // we're going to assume that everything has already been reset; we assume that we're just loading values into a blank slate

            const currTimestamp = _.now();
            // create surrogate timestamps if necessary
            if (typeof saveData.timestampLastSave !== "number") {
                saveData.timestampLastSave = currTimestamp;
            }
            if (typeof saveData.timestampGameStart !== "number") {
                saveData.timestampGameStart = currTimestamp;
            }
            if (typeof saveData.timestampRunStart !== "number") {
                saveData.timestampRunStart = currTimestamp;
            }
            if (typeof saveData.timestampRunEnd !== "number") {
                saveData.timestampRunEnd = currTimestamp;
            }

            SharkGame.timestampLastSave = saveData.timestampLastSave;
            SharkGame.timestampGameStart = saveData.timestampGameStart;
            SharkGame.timestampRunStart = saveData.timestampRunStart;
            SharkGame.timestampRunEnd = saveData.timestampRunEnd;
            SharkGame.timestampSimulated = saveData.timestampLastSave;

            SharkGame.flags = saveData.flags ? saveData.flags : {};
            SharkGame.persistentFlags = saveData.persistentFlags ? saveData.persistentFlags : {};

            $.each(saveData.resources, (resourceId, resource) => {
                // check that this isn't an old resource that's been removed from the game for whatever reason
                if (SharkGame.PlayerResources.has(resourceId)) {
                    SharkGame.PlayerResources.get(resourceId).amount = isNaN(resource.amount) ? 0 : resource.amount;
                    SharkGame.PlayerResources.get(resourceId).totalAmount = isNaN(resource.totalAmount) ? 0 : resource.totalAmount;
                }
            });

            // load world type
            if (saveData.world) {
                if (!Object.keys(SharkGame.WorldTypes).includes(saveData.world.type)) {
                    world.worldType = "start";
                    gateway.badWorld = true;
                } else {
                    world.worldType = saveData.world.type;
                }
            }

            SharkGame.Upgrades.purchaseQueue = [];
            _.each(saveData.upgrades, (upgradeId) => {
                SharkGame.Upgrades.purchaseQueue.push(upgradeId);
            });

            // load aspects (need to have the cost reducer loaded before world init)
            if (
                _.some(saveData.aspects, (_aspectLevel, aspectId) => {
                    return !_.has(SharkGame.Aspects, aspectId);
                })
            ) {
                // missing aspect detected! this is bad news.
                // there's no good way to handle this while preserving the player's aspects,
                // since we don't know how much the player spent to upgrade the missing aspects.
                // an easy, foolproof fix is to simply reset all aspects and refund all essence.
                SharkGame.missingAspects = true;
            }

            $.each(saveData.aspects, (aspectId, level) => {
                if (_.has(SharkGame.Aspects, aspectId)) {
                    SharkGame.Aspects[aspectId].level = level;
                }
            });

            _.each(saveData.completedWorlds, (worldType) => {
                gateway.markWorldCompleted(worldType);
            });

            if (saveData.tabs && saveData.tabs.home) {
                if (typeof saveData.tabs.home === "object") {
                    $.each(saveData.tabs, (tabName, discoveryArray) => {
                        if (_.has(SharkGame.Tabs, tabName) && tabName !== "current") {
                            SharkGame.Tabs[tabName].discovered = discoveryArray[0];
                            SharkGame.Tabs[tabName].seen = discoveryArray[1];
                        }
                    });
                } else {
                    $.each(saveData.tabs, (tabName, discovered) => {
                        if (_.has(SharkGame.Tabs, tabName) && tabName !== "current") {
                            SharkGame.Tabs[tabName].discovered = discovered;
                            SharkGame.Tabs[tabName].seen = true;
                        }
                    });
                }
            }

            if (saveData.tabs && saveData.tabs.current) {
                SharkGame.Tabs.current = saveData.tabs.current;
            }

            if (saveData.completedRequirements) {
                SharkGame.Gate.completedRequirements = _.cloneDeep(saveData.completedRequirements);
            }

            if (saveData.planetPool) {
                gateway.planetPool = saveData.planetPool;
            }

            $.each(saveData.settings, (settingId, currentvalue) => {
                SharkGame.Settings.current[settingId] = currentvalue;
                // update anything tied to this setting right off the bat
                if (SharkGame.Settings[settingId] && typeof SharkGame.Settings[settingId].onChange === "function") {
                    SharkGame.Settings[settingId].onChange();
                }
            });

            if (saveData.gateway) {
                if (typeof saveData.gateway.wonGame === "boolean") {
                    SharkGame.wonGame = saveData.gateway.wonGame;
                }
                if (typeof saveData.gateway.betweenRuns === "boolean") {
                    SharkGame.gameOver = saveData.gateway.betweenRuns;
                }
            }

            if (!SharkGame.gameOver) {
                // get times elapsed since last save game
                let secondsElapsed = (_.now() - saveData.timestampLastSave) / 1000;
                if (secondsElapsed < 0) {
                    // something went hideously wrong or someone abused a system clock somewhere
                    secondsElapsed = 0;
                } else {
                    SharkGame.flags.needOfflineProgress = secondsElapsed;
                }
            }

            if (saveData.keybinds) {
                SharkGame.Keybinds.keybinds = saveData.keybinds;
            }
        } else {
            throw new Error(
                "Couldn't load saved game. I don't know how to break this to you, but I think your save is corrupted. Your save: " + saveDataString
            );
        }
    },

    importData(data) {
        // load the game from this save data string
        try {
            main.wipeGame();
            SharkGame.Save.loadGame(data);
            main.setUpGame();
        } catch (err) {
            log.addError(err);
        }
        // refresh current tab
        SharkGame.TabHandler.setUpTab();
    },

    exportData() {
        // get save
        /** @type string */
        let saveData;
        try {
            saveData = SharkGame.Save.saveGame();
        } catch (err) {
            log.addError(err);
        }
        // check if save isn't encoded
        if (saveData.substring(0, 2) !== "<~") {
            // encode it
            saveData = ascii85.encode(saveData);
        }
        return saveData;
    },

    savedGameExists(tag = ``) {
        return localStorage.getItem(SharkGame.Save.saveFileName + tag) !== null;
    },

    deleteSave(tag = ``) {
        localStorage.removeItem(SharkGame.Save.saveFileName + tag);
    },

    getTaggedSaveCharacteristics(tag) {
        if (_.isUndefined(tag)) {
            SharkGame.Log.addError(`Tried to get characteristics of a tagged save, but no tag was given.`);
            throw new Error(`Tried to get characteristics of a tagged save, but no tag was given.`);
        }
        const save = this.decodeSave(localStorage.getItem(SharkGame.Save.saveFileName + tag));
        let text;
        if (save) {
            text = ` from ${SharkGame.TextUtil.formatTime(_.now() - save.timestampLastSave)} ago`;
            if (save.resources.essence) {
                text += ` with ${save.resources.essence.totalAmount || 0} lifetime essence`;
            }
        } else {
            SharkGame.Log.addError(`Tried to get characteristics of ${SharkGame.Save.saveFileName + tag}, but no such save exists.`);
            throw new Error(`Tried to get characteristics of ${SharkGame.Save.saveFileName + tag}, but no such save exists.`);
        }
        return text;
    },

    createTaggedSave(tag) {
        if (_.isUndefined(tag)) {
            SharkGame.Log.addError(`Tried to create a tagged save, but no tag was given.`);
            throw new Error(`Tried to create a tagged save, but no tag was given.`);
        }
        localStorage.setItem(SharkGame.Save.saveFileName + tag, localStorage.getItem(SharkGame.Save.saveFileName));
    },

    loadTaggedSave(tag) {
        if (_.isUndefined(tag)) {
            SharkGame.Log.addError(`Tried to load a tagged save, but no tag was given.`);
            throw new Error(`Tried to load a tagged save, but no tag was given.`);
        }

        if (this.savedGameExists(tag)) {
            this.importData(localStorage.getItem(SharkGame.Save.saveFileName + tag));
        } else {
            SharkGame.Log.addError(`Tried to load ${SharkGame.Save.saveFileName + tag}, but no such save exists.`);
        }
    },

    wipeSave() {
        this.createTaggedSave(`Backup`);
        this.deleteSave();
    },

    saveUpdaters: [
        // used to update saves and to make templates
        function update0(save) {
            // no one is converting a real save to version 0, so it doesn't need real values
            save.saveVersion = 0;
            save.version = null;
            save.timestamp = null;
            save.resources = {};

            [
                "essence",
                "shark",
                "ray",
                "crab",
                "scientist",
                "nurse",
                "laser",
                "maker",
                "planter",
                "brood",
                "crystalMiner",
                "autoTransmuter",
                "fishMachine",
                "science",
                "fish",
                "sand",
                "crystal",
                "kelp",
                "seaApple",
                "sharkonium",
            ].forEach((resourceName) => (save.resources[resourceName] = { amount: null, totalAmount: null }));
            save.upgrades = {};

            [
                "crystalBite",
                "crystalSpade",
                "crystalContainer",
                "underwaterChemistry",
                "seabedGeology",
                "thermalVents",
                "laserRays",
                "automation",
                "engineering",
                "kelpHorticulture",
                "xenobiology",
                "biology",
                "rayBiology",
                "crabBiology",
                "sunObservation",
                "transmutation",
                "exploration",
                "farExploration",
                "gateDiscovery",
            ].forEach((upgrade) => (save.upgrades[upgrade] = null));

            save.tabs = {
                current: "home",
                home: { discovered: true },
                lab: { discovered: false },
                gate: { discovered: false },
            };
            save.settings = {
                buyAmount: 1,
                offlineModeActive: true,
                autosaveFrequency: 5,
                logMessageMax: 15,
                sidebarWidth: "25%",
                showAnimations: true,
                colorCosts: true,
            };
            save.gateCostsMet = {
                fish: false,
                sand: false,
                crystal: false,
                kelp: false,
                seaApple: false,
                sharkonium: false,
            };
            return save;
        },

        // future updaters for save versions beyond the base:
        // they get passed the result of the previous updater and it continues in a chain
        // and they start based on the version they were saved
        function update1(save) {
            save = $.extend(true, save, {
                resources: { sandDigger: { amount: 0, totalAmount: 0 }, junk: { amount: 0, totalAmount: 0 } },
                upgrades: { statsDiscovery: null, recyclerDiscovery: null },
                settings: { showTabHelp: true, groupResources: true },
                timestampLastSave: save.timestamp,
                timestampGameStart: null,
                timestampRunStart: null,
            });
            // reformat tabs
            save.tabs = {
                current: save.tabs.current,
                home: save.tabs.home.discovered,
                lab: save.tabs.lab.discovered,
                gate: save.tabs.gate.discovered,
                stats: false,
                recycler: false,
            };
            delete save.timestamp;
            return save;
        },

        // v0.6
        function update2(save) {
            // add new setting to list of saves
            save = $.extend(true, save, {
                settings: { iconPositions: "top" },
            });
            return save;
        },

        // v0.7
        function update3(save) {
            save = $.extend(true, save, {
                settings: { showTabImages: true },
                tabs: { reflection: false },
                timestampRunEnd: null,
            });
            _.each(
                [
                    "shrimp",
                    "lobster",
                    "dolphin",
                    "whale",
                    "chimaera",
                    "octopus",
                    "eel",
                    "queen",
                    "berrier",
                    "biologist",
                    "pit",
                    "worker",
                    "harvester",
                    "treasurer",
                    "philosopher",
                    "chorus",
                    "transmuter",
                    "explorer",
                    "collector",
                    "scavenger",
                    "technician",
                    "sifter",
                    "skimmer",
                    "purifier",
                    "heater",
                    "spongeFarmer",
                    "berrySprayer",
                    "glassMaker",
                    "silentArchivist",
                    "tirelessCrafter",
                    "clamCollector",
                    "sprongeSmelter",
                    "seaScourer",
                    "prostheticPolyp",
                    "sponge",
                    "jellyfish",
                    "clam",
                    "coral",
                    "algae",
                    "coralglass",
                    "delphinium",
                    "spronge",
                    "tar",
                    "ice",
                ],
                (resourceId) => {
                    save.resources[resourceId] = { amount: 0, totalAmount: 0 };
                }
            );
            _.each(
                [
                    "environmentalism",
                    "thermalConditioning",
                    "coralglassSmelting",
                    "industrialGradeSponge",
                    "aquamarineFusion",
                    "coralCircuitry",
                    "sprongeBiomimicry",
                    "dolphinTechnology",
                    "spongeCollection",
                    "jellyfishHunting",
                    "clamScooping",
                    "pearlConversion",
                    "crustaceanBiology",
                    "eusociality",
                    "wormWarriors",
                    "cetaceanAwareness",
                    "dolphinBiology",
                    "delphinePhilosophy",
                    "coralHalls",
                    "eternalSong",
                    "eelHabitats",
                    "creviceCreches",
                    "bioelectricity",
                    "chimaeraMysticism",
                    "abyssalEnigmas",
                    "octopusMethodology",
                    "octalEfficiency",
                ],
                (upgradeId) => {
                    save.upgrades[upgradeId] = false;
                }
            );
            save.world = { type: "start", level: 1 };
            save.artifacts = {};
            _.each(
                [
                    "permanentMultiplier",
                    "planetTerraformer",
                    "gateCostReducer",
                    "planetScanner",
                    "sharkMigrator",
                    "rayMigrator",
                    "crabMigrator",
                    "shrimpMigrator",
                    "lobsterMigrator",
                    "dolphinMigrator",
                    "whaleMigrator",
                    "eelMigrator",
                    "chimaeraMigrator",
                    "octopusMigrator",
                    "sharkTotem",
                    "rayTotem",
                    "crabTotem",
                    "shrimpTotem",
                    "lobsterTotem",
                    "dolphinTotem",
                    "whaleTotem",
                    "eelTotem",
                    "chimaeraTotem",
                    "octopusTotem",
                    "progressTotem",
                    "carapaceTotem",
                    "inspirationTotem",
                    "industryTotem",
                    "wardingTotem",
                ],
                (artifactId) => {
                    save.artifacts[artifactId] = 0;
                }
            );
            save.gateway = { betweenRuns: false };
            return save;
        },

        // a little tweak here and there
        function update4(save) {
            save = $.extend(true, save, {
                settings: { buttonDisplayType: "pile" },
            });
            return save;
        },
        function update5(save) {
            save = $.extend(true, save, {
                gateway: { wonGame: false },
            });
            return save;
        },
        function update6(save) {
            // forgot to add numen to saved resources (which is understandable given it can't actually be legitimately achieved at this point)
            save.resources.numen = { amount: 0, totalAmount: 0 };
            // completely change how gate slot status is saved
            save.gateCostsMet = [false, false, false, false, false, false];
            return save;
        },

        // v 0.71
        function update7(save) {
            _.each(["eggBrooder", "diver"], (resourceId) => {
                save.resources[resourceId] = { amount: 0, totalAmount: 0 };
            });
            _.each(
                [
                    "agriculture",
                    "ancestralRecall",
                    "utilityCarapace",
                    "primordialSong",
                    "leviathanHeart",
                    "eightfoldOptimisation",
                    "mechanisedAlchemy",
                    "mobiusShells",
                    "imperialDesigns",
                ],
                (upgradeId) => {
                    save.upgrades[upgradeId] = false;
                }
            );
            return save;
        },

        // MODDED, v0.1
        function update8(save) {
            save = $.extend(true, save, {
                completedWorlds: {},
            });
            _.each(["iterativeDesign", "superprocessing"], (upgradeId) => {
                save.upgrades[upgradeId] = false;
            });
            _.each(["start", "marine", "chaotic", "haven", "tempestuous", "volcanic", "abandoned", "shrouded", "frigid"], (worldType) => {
                save.completedWorlds[worldType] = false;
            });
            return save;
        },

        function update9(save) {
            save = $.extend(true, save, {
                settings: { enableThemes: true, framerate: 20 },
            });
            return save;
        },

        function update10(save) {
            save = $.extend(true, save, {
                settings: { boldCosts: true },
            });
            return save;
        },

        // MODDED v0.2
        function update11(save) {
            _.each(["investigator", "filter", "ancientPart"], (resourceId) => {
                save.resources[resourceId] = { amount: 0, totalAmount: 0 };
            });
            _.each(
                ["farAbandonedExploration", "reverseEngineering", "highEnergyFusion", "artifactAssembly", "superiorSearchAlgorithms"],
                (upgradeId) => {
                    save.upgrades[upgradeId] = false;
                }
            );
            return save;
        },

        function update12(save) {
            save = $.extend(true, save, {
                settings: { grottoMode: "simple", incomeTotalMode: "absolute" },
            });
            return save;
        },

        function update13(save) {
            _.each(["historian", "crimsonCombine", "kelpCultivator"], (resourceName) => {
                save.resources[resourceName] = { amount: 0, totalAmount: 0 };
            });
            _.each(
                ["coralCollection", "whaleCommunication", "delphineHistory", "whaleSong", "farHavenExploration", "crystallineConstruction"],
                (upgradeName) => {
                    save.upgrades[upgradeName] = false;
                }
            );
            return save;
        },

        // Haven rework
        function update14(save) {
            _.each(
                [
                    "planetTerraformer",
                    "shrimpMigrator",
                    "lobsterMigrator",
                    "dolphinMigrator",
                    "whaleMigrator",
                    "eelMigrator",
                    "chimaeraMigrator",
                    "octopusMigrator",
                    "shrimpTotem",
                    "lobsterTotem",
                    "dolphinTotem",
                    "whaleTotem",
                    "eelTotem",
                    "chimaeraTotem",
                    "octopusTotem",
                    "carapaceTotem",
                    "inspirationTotem",
                    "industryTotem",
                ],
                (deprecatedTotem) => {
                    if (_.has(save.artifacts, deprecatedTotem)) {
                        delete save.artifacts[deprecatedTotem];
                    }
                }
            );

            if (_.has(save, "gateCostsMet")) {
                delete save.gateCostsMet;
            }

            if (_.has(save.settings, "iconPositions")) {
                save.settings.showIcons = save.settings.iconPositions !== "off";
                delete save.settings.iconPositions;
            } else {
                save.settings.showIcons = true;
            }
            save.settings.minimizedTopbar = true;

            if (_.has(save.resources, "philosopher")) {
                delete save.resources.philosopher;
            }
            if (_.has(save.upgrades, "coralHalls")) {
                delete save.upgrades.coralHalls;
            }

            // Don't bother saving 0 or null values, they're implied already
            _.each(save.resources, (resource, resourceId) => {
                if ([0, null].includes(resource.amount) && [0, null].includes(resource.totalAmount)) {
                    delete save.resources[resourceId];
                }
            });
            _.each(save.artifacts, (level, artifactId) => {
                if (level === 0 || level === null) {
                    delete save.artifacts[artifactId];
                }
            });

            /** @type string[] */
            const purchasedUpgrades = [];
            $.each(save.upgrades, (upgradeId, purchased) => {
                if (purchased === true) {
                    purchasedUpgrades.push(upgradeId);
                }
            });
            save.upgrades = purchasedUpgrades;

            /** @type string[] */
            const completedWorlds = [];
            _.each(save.completedWorlds, (completed, worldType) => {
                if (completed === true) {
                    completedWorlds.push(worldType);
                }
            });
            save.completedWorlds = completedWorlds;

            return save;
        },

        // Frigid rework
        function update15(save) {
            if (_.has(save, "settings.showTabHelp")) {
                if (!_.has(save, "settings.showTooltips")) {
                    save.settings.showTooltips = save.settings.showTabHelp;
                }
                delete save.settings.showTabHelp;
            }

            if (_.has(save, "artifacts")) {
                delete save.artifacts;
            }
            if (!_.has(save, "aspects")) {
                save.aspects = {};
            }

            return save;
        },

        // flags and colorcosts
        function update16(save) {
            if (save.settings.colorCosts) {
                save.settings.colorCosts = "color";
            } else {
                save.settings.colorCosts = "none";
            }

            save.flags = {};
            save.persistentFlags = {};
            save.planetPool = [];

            return save;
        },

        // this is a dummy updater, used to simply mark the version number
        // this version number difference is then used to catalyze a one-time aspect reset
        function update17(save) {
            return save;
        },
        // save below are test saves for updating
        // <~GasapgN)%,&H.k(BDUb*8:od=Di/RTB&^h<29eK8%hK%=W(DL?5W`^-s5!j>PXI"Mp`UFRLPt!-fs@aJ_%YEi-lH7pi?J9gj5$1hIp7B3]3,>>J`]FE]&Y3JrZ6#g\1G2f05FN7D/c%N"]ec,0?<aHX2+(iIQRk_U.>V`UI?/d,V<[jqZu@A5!,YV<\un.gPCb39/7.A$Q>pWRY>f-*fuur@&2:gF)E:]MS&p;:)5S/.A8OB3%r-&3M"&WV<W4WjMVp6A;&AT?fWpJUPS&RB,i&?c2]Qj]P$m_GpEg9fnXGQ:t]P=JOZ!QW/!:tOmA?"2d33GKi"IX[1gQo$uS\RV4GH_96f70gR:_2;Qm4bb]J.8cS"1EL[X2UdXk17N*`0V#FG9pY^%b[Kf>@D\2]nX?AmWWNkPJqb;u]TRRttM(U<rJ^D1@1b=YTjru,\p7FTJ^c>c$3d2402WnG&+lm&^g<EEDp`/qoEj/p\@L+KD_gV,(,:R%9#6qJ:48P7Gc9IZA;MEfAUVas@K%saUKPX@3&eI`rn6rS,G0@!MG?q)B('QFgK2`P$MmBdd?""KPu8KK6.=VUITB%2)=OplK(AW%rUpb;4a_(j%[g`Z)HRd7h0T&t#`BNSg0M1ZICZ8;UXBn8@(Jh6%>eXo??)O$Q(=#rJ"V#"bh-.'J]dR>/(.(p29!C2\GkD[hf=-1*X7`]Qj]9k4XHT[)Q-6u<\FDLqLMQW@_DbcKMbni+k$;1=3nYKY6*s'<Z0DF`n[fpK"9TtPhSA'Rs(Lg4V=$1dm!at>d:/:X`S4@Q=3`[e>$)u/2.I$re$/f?!l+6`k_K2!Y2SNgiS^uT`#(+m>FB&:dok1<eIc^S*EY[*,8PO@n#]"%!R[8f8G""=BhD%+$Vtmd`V=cEgE_u1LDg0B>_lmTPf3eHN2lHo'X*aiR6U`qQfK"F&X?ErG"i6e?%%Ons(0:nmkJMAuY;b6#F"ZoCM)0W?CrghE"mp43]PD_[<Gn]/4L5!PYV%rRlCl2eBt7-i1,%&-ig,k"alP<G?6MJalX\!-1ORQM4`@"nq@NE?hsfnOGE'hM>u"`7;_$!QDM.>`-m<ct/]#7#Q)_mKobDVEZonNaD:*e0ND"Ct@9@et>e$KfZl6r>dt[,Ja,T$r'&2;":n6G<cK-2H>?f"9iLG>`=Mls,D`]b&dMlK`E\BqpI_:3Z2k:ZEpoWG$:ib`33NEl^FAMh+,M_RHo2bX]/^lZHA`$06(/<!"8aG!`Ln-B##H?Yi*X.Dg`ajWa>2nZ!<K=lM>+#"0YiuX-C&ENcfkG$"\lG$UP7`h$/h;;AI)dsUii.-^)?C19eX`VW<eEWj'A^dB__.d!]Uq]_2,K-!r6).KC,\hIgW7YF2<<dYcsjJnJTmi(mn^i<O#7AU>I.$eOqfY,_-%)u?tMF#q]]^-G8Z]b5sVr,bJ$9,n\(k\Y5T[rM\[%hn97YZUi`Gl/!bYCLns<Nf^#_Q2%%De+D5!)oNE\#iV)JhmFQi1R%&algk4^Ko>e&FFAB$Urj-!oV>'(SK%pQ^Hf+H%mPcZ(oT_O,mA;HO)bOY9$t$&*0(Jk,,MF<oK1Fd#n(#h:%^5NOEXonkQC_`l384cNLVbSa8"A:N*J5=8#2#:GN(aF<I&eDYQkQ,@oN\"P3ApB5!>]G9LpjG=DG[%XrJWHH%!m9/M,BJk4*ZY/N\\$H%n$RA]+DF2#2>f[.u@Y_HuXcK12C%AIUL/Z0^!J0IMe1k-#$7fB*bDX&)KH7@f3YXQl"-CcQH')#pRP"bW!KTn]$P(a%O8tc/$&&`;^m.X^M;,&%s9;U]~>
        // <~GasapbAu>q'`F:,B=`.A,Y7F`SYA6:RCI6R9s_oO!KiIsRKOH-[%h7(ml^Y"M52nd(O6!?]K!D\pYb=`nAM^H8d<m5\0/P7]R085Dp&Z82p:,/d+kQpQeV_qhZIa)QR-kUAW>uN%Be`l^adOmjY0GY>Qn`co]$cVM]sSuN>@2c8QsJ_p(>k))6Hhp.%20r0h>/P8JXhlJs%rbZZ$u("7e/H5t]B[j![c(j97do=V.%NR*L:k]a2O:]T*hoWnY4K'/FQi`KV/6+t%@I75UX#EI^.j!>+I?cg#68_D%L.kb\?FSMh-pF:!qQBYtn%IMm7&Q)\-r'rk:r@I21qVA*:h)4XsK8Io`T-LFH/>KrT#oF.<s_D;_[K8%a*9eMB2TW&0_qHu"&/*$l'9/>q*9NJ@9DDt'mJ:V:&<GTjTBtB5/rX?OVAq.ur8<*WfC`Z$obbEC&rd:Fp9!2."Gu<3a?FQu<[c3,eM8.&7Tm7)O=D>3ld362"VA>=_8K&@99%,Ifl%Pi+eJs'r,UW>KVo_Cg/-Alm`GlL;1qqTYlR?R&UJ[Nq,U/6QB?R`S<[2(hL%7@J8Wq)O@\1o)3[S:*Trt_<&S6S9-<q07`u,&?(n@A30+@/\:;WBQ7@'N&32)M3$,fUIlrb%m@W#-CH5*5%-8E$YiT_c?8#%Vd%jmMn84]NJ_Cu2p4TQN?V5I:S]q"$%,U`"R(Z'RFL[c^2RRZQ3!Dl[9c.mYeRY5Ch+Lip]rD1Y(L4l&sZ#a:?h00nJed@n,_g(/<(&GEoK*#:tl1kpA=T<J`nh-%e+s_91=<J5SRE\[["0s_ufsoIQp&Ba/.YDU9Roso<F#P')<Q"@$qL>Y4>M\g"pXbb4TQZCGA-RXiAi?Q4GpmH0A<Z6uZh&F1DeiZ_s.iF+b!#4RDHUiOQ0df4Mnelg[:"9&cbFY%kQZ\\q=.n\U#k\Rm"rp$\XR<<Kg-bsQ/-LmK]u4O0m`7pmgZbPSBLe)@a-\p7/;kR'R1+<GO8/3b&nPnO1"IL=I6$ro[%(C4Bs=LR5\qUEQ^u"jRS]^b:k-aFgC$')'&9`cPsM$q@NFZhsfnOGL)^"]*uFiVGuc.g]ZAG;8W2!dKDoXXAjVl@p`S%9%srVIjEjjhmcYK&R(N&Vh&VLcD.)$3)>o:IbYdC@CZ8"KAcQbJ&`O^IqriH):mKmN\sK4n[:6k-[j?!0DG#Sf/FZ<rMGdQ4FZTD+-bRVcH^1DE4REGcZ.b*On2WKV(L.Tm[i<02AT$1nZLHH\Igo;c50B2$SDU>mZ,D@R'afV\ZMBl\[;_1e["ELa$TS(Q*\r^>'6kqV_03a&7&?1lM6I8n&/5pS2:;3PH$\tMlh__[$SH^H\Ym!d<M61R5OJm7f:H1[;%Wo+/b6l%r02+FeH]kDZ`e0C[]TODN?XacF.>SqC#D"GR(MeZ9\_:=SF,h$;VP%D]qBm]k-)/dJ.$I**[n*Q,S@j`8U/k=@h[K)-8lt^^3T_eM,Tnc"[rSGsKZdRd%4XG`pep$epaBlHhs+HanjRS`W^TF6Q6!U&NGJOJV^5-p__PLO7qN$19/k[IeT)SD*XBmVF;6NA>m`*kB5^UT8'`A.OWHYb'Aoedf1]cuKWn#aSe0XuP/C(PfjY+-/Chh)Y^"#n4%J'$rl]kjY^//YQs1UX68MI<+3*D$)9;ed61tZeaPEXntt*//7`"1l959gH.+.B.$X463j6:X'OB5BnC3kdOU0lr:o:**b<j-VZ";hI:/(UK\%r9n_4*c6o74iYC#d2!$V-6';Kn>'/5$R*@HXo/(!Yt;oBX,BFLB'a,/7"FWXEWn)J=FoHXA:G".(E~>
        function update18(save) {
            if (save.resources.essence && save.resources.essence.totalAmount > 0 && save.aspects.apotheosis) {
                if (save.aspects.pathOfIndustry) {
                    save.aspects.tokenOfIndustry = save.aspects.pathOfIndustry;
                    save.aspects.pathOfIndustry = 0;
                }
                if (save.aspects.pathOfEnlightenment) {
                    save.aspects.pathOfEnlightenment = 0;
                    save.aspects.distantForesight = 1;
                }
                save.aspects.pathOfEnlightenment = 1;
            }
            return save;
        },

        // keybinds were added here
        function update19(save) {
            save.keybinds = SharkGame.Keybinds.defaultBinds;
            return save;
        },
    ],
};
