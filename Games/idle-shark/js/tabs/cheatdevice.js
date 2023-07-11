"use strict";
SharkGame.CheatsAndDebug = {
    tabId: "cheats",
    tabDiscovered: false,
    tabSeen: false,
    tabName: "Cheaty Powers",
    tabBg: "img/bg/bg-gate.png",

    sceneImage: "img/events/misc/scene-reflection.png",

    discoverReq: {
        flag: {
            debug: true,
        },
    },

    pause: false,
    stop: false,
    speed: 1,
    upgradePriceModifier: 1,
    actionPriceModifier: 1,
    noNumberBeautifying: false,
    cycling: false,
    frozen: false,

    defaultParameters: {
        pause: false,
        stop: false,
        speed: 1,
        upgradePriceModifier: 1,
        actionPriceModifier: 1,
        noNumberBeautifying: false,
        cycling: false,
        frozen: false,
    },

    cheatButtons: {
        giveEverything: {
            get name() {
                return "Give " + sharktext.beautify(sharkmath.getBuyAmount(true)) + " of Everything";
            },
            type: "numeric",
            updates: true,
            category: "stuff",
            click() {
                log.addMessage(cad.giveEverything(sharkmath.getBuyAmount(true)));
            },
        },
        removeEverything: {
            get name() {
                return "Remove " + sharktext.beautify(sharkmath.getBuyAmount(true)) + " of Everything";
            },
            updates: true,
            category: "stuff",
            click() {
                log.addMessage(cad.giveEverything(-sharkmath.getBuyAmount(true)));
            },
        },
        giveSomething: {
            get name() {
                const resource = $("#somethingSelector")[0].value;
                return (
                    "Give " +
                    sharktext.beautify(sharkmath.getBuyAmount(true)) +
                    " " +
                    sharktext.getResourceName(resource, false, sharkmath.getBuyAmount(true), sharkcolor.getVariableColor("--color-light"))
                );
            },
            type: "choice",
            choiceId: "somethingSelector",
            getChoices() {
                const existingStuff = [];
                SharkGame.ResourceMap.forEach((_resource, resourceId) => {
                    if (world.doesResourceExist(resourceId)) {
                        existingStuff.push(resourceId);
                    }
                });
                return existingStuff;
            },
            updates: true,
            category: "stuff",
            click() {
                log.addMessage(cad.giveSomething($("#somethingSelector")[0].value, sharkmath.getBuyAmount(true)));
            },
        },
        removeSomething: {
            get name() {
                const resource = $("#somethingSelector")[0].value;
                return (
                    "Remove " +
                    sharktext.beautify(sharkmath.getBuyAmount(true)) +
                    " " +
                    sharktext.getResourceName(resource, false, sharkmath.getBuyAmount(true), sharkcolor.getVariableColor("--color-light"))
                );
            },
            updates: true,
            category: "stuff",
            click() {
                log.addMessage(cad.giveSomething($("#somethingSelector")[0].value, -sharkmath.getBuyAmount(true)));
            },
        },
        pause: {
            get name() {
                return cad.pause ? "Unpause Game" : "Pause Game";
            },
            updates: true,
            category: "debug",
            click() {
                cad.togglePausePlease();
            },
        },
        stop: {
            get name() {
                return cad.stop ? "Resume Execution" : "Halt Execution";
            },
            updates: true,
            category: "debug",
            click() {
                cad.toggleStopPlease();
            },
        },
        changeSpeed: {
            name: "Game speed",
            type: "up-down",
            category: "modifiers",
            clickUp() {
                const msg = cad.goFasterPlease();
                if (msg) log.addMessage(msg);
            },
            clickDown() {
                const msg = cad.goSlowerPlease();
                if (msg) log.addMessage(msg);
            },
        },
        changeUpgradePrices: {
            name: "Upgrade prices",
            type: "up-down",
            category: "modifiers",
            clickUp() {
                const msg = cad.expensiveUpgradesPlease();
                if (msg) log.addMessage(msg);
            },
            clickDown() {
                const msg = cad.cheaperUpgradesPlease();
                if (msg) log.addMessage(msg);
            },
        },
        changeStuffPrices: {
            name: "Cost of stuff",
            type: "up-down",
            category: "modifiers",
            clickUp() {
                const msg = cad.expensiveStuffPlease();
                if (msg) log.addMessage(msg);
            },
            clickDown() {
                const msg = cad.cheaperStuffPlease();
                if (msg) log.addMessage(msg);
            },
        },
        toggleFreeStuff: {
            get name() {
                return cad.actionPriceModifier ? "Enable free stuff" : "Disable free stuff";
            },
            category: "modifiers",
            updates: true,
            click() {
                const msg = cad.toggleFreeStuff();
                if (msg) log.addMessage(msg);
            },
        },
        toggleFreeUpgrades: {
            get name() {
                return cad.upgradePriceModifier ? "Enable free upgrades" : "Disable free upgrades";
            },
            category: "modifiers",
            updates: true,
            click() {
                const msg = cad.toggleFreeUpgrades();
                if (msg) log.addMessage(msg);
            },
        },
        toggleDebugButton: {
            get name() {
                if (SharkGame.HomeActions.getActionTable().debugbutton.unauthorized) {
                    return "Enable debug button";
                } else {
                    return "Disable debug button";
                }
            },
            category: "debug",
            updates: true,
            click() {
                cad.toggleDebugButton();
            },
        },
        toggleBeautify: {
            get name() {
                if (cad.noNumberBeautifying) {
                    return "Enable number formatting";
                } else {
                    return "Disable number formatting";
                }
            },
            category: "debug",
            updates: true,
            click() {
                cad.toggleBeautify();
            },
        },
        beatWorld: {
            name: "Beat this world immediately",
            category: "misc",
            click() {
                log.addMessage(cad.beatWorldPlease());
            },
        },
        addUpgrades: {
            name: "Get all upgrades",
            category: "misc",
            click() {
                cad.addUpgradesPlease();
            },
        },
        addIdleTime: {
            name: "Add idle time",
            category: "misc",
            click() {
                cad.addIdleTimePlease();
            },
        },
        rollDice: {
            name: "Roll the dice for wacky effects",
            location: "right",
            category: "nonsense",
            click() {
                log.addMessage(cad.rollTheDicePlease());
            },
        },
        freezeGame: {
            get name() {
                return cad.frozen ? "Unfreeze game" : "Freeze the game";
            },
            updates: true,
            category: "nonsense",
            click() {
                log.addMessage(cad.toggleFreezePlease());
            },
        },
        forceExistence: {
            name: "Make all resources exist",
            location: "right",
            category: "nonsense",
            click() {
                log.addMessage(cad.forceAllExist());
            },
        },
        // challengeMe: {
        //     name: "Spin the wheel of challenges",
        //     location: "right",
        //     click() {
        //         log.addMessage(cad.challengeMePlease());
        //     },
        // },
        egg: {
            name: "egg",
            category: "nonsense",
            click() {
                log.addMessage(cad.doEgg());
            },
        },
    },

    init() {
        SharkGame.TabHandler.registerTab(this);
    },

    setup() {
        if (SharkGame.persistentFlags.debug) {
            // unlock cheats for anyone who already has debug mode access
            gateway.unlockCheats();
        }
    },

    switchTo() {
        const content = $("#content");
        content.append($("<div>").attr("id", "tabMessage"));
        content.append($("<div>").attr("id", "aspectList"));
        let message = "";
        if (SharkGame.Settings.current.showTabImages) {
            message =
                "<img width=400 height=200 src='" +
                cad.sceneImage +
                "' id='tabSceneImageEssence'>" +
                "Doubles as a debug menu and a location for various cheats.";
            $("#tabMessage").css("background-image", "url('" + cad.tabBg + "')");
        }
        $("#tabMessage").html(message);

        content.append($("<table>").attr("id", "leftButtons"));
        content.append($("<table>").attr("id", "rightButtons"));
        content.append($("<table>").attr("id", "cheatsDisplay").html("<br>"));
        $.each(cad.defaultParameters, (parameter) => {
            $("#cheatsDisplay").append($("<tr>").attr("id", parameter + "Row"));
        });

        const categories = [];
        let placeLeft = true;
        _.each(cad.cheatButtons, (buttonData) => {
            const category = buttonData.category;
            if (!categories.includes(category)) {
                categories.push(category);
                if (placeLeft) {
                    $("#leftButtons").append(
                        $("<tr>")
                            .attr("id", category)
                            .html("<h3>" + category + "</h3>")
                    );
                    placeLeft = false;
                } else {
                    $("#rightButtons").append(
                        $("<tr>")
                            .attr("id", category)
                            .html("<h3>" + category + "</h3>")
                    );
                    placeLeft = true;
                }
            }
        });

        let selector;
        let container;
        let buttonContainer; // prettier gets angry at me if i try to declare these case-specific variables inside the case
        $.each(cad.cheatButtons, (buttonName, buttonData) => {
            // const toAppendTo = buttonData.location === "right" ? $("#rightButtons") : $("#leftButtons");
            const toAppendTo = $("#" + buttonData.category);
            switch (buttonData.type) {
                case "up-down":
                    if (!buttonData.clickUp || !buttonData.clickDown) {
                        log.addError("Cheat button is up-down type, but has no functions for its buttons.");
                        return true;
                    }
                    container = $("<div>").attr("id", buttonName).addClass("up-down");
                    container.append("<span class='up-downText'>" + buttonData.name + "</span>");
                    buttonContainer = $("<div>").addClass("up-downButtonContainer");
                    buttonContainer.append(
                        $("<button id='" + buttonName + "Up' class='min close-button'>⯅</button>").on("click", buttonData.clickUp)
                    );
                    buttonContainer.append(
                        $("<button id='" + buttonName + "Down' class='min close-button'>⯆</button>").on("click", buttonData.clickDown)
                    );
                    container.append(buttonContainer);
                    toAppendTo.append(container);
                    break;
                case "numeric":
                    main.createBuyButtons("cheat", toAppendTo, "append", true);
                    SharkGame.Button.makeButton(buttonName, buttonData.name, toAppendTo, buttonData.click);
                    break;
                case "choice":
                    selector = $("<select>").attr("id", buttonData.choiceId);
                    _.each(buttonData.getChoices(), (choice) => {
                        selector.append("<option>" + choice + "</option>");
                    });
                    toAppendTo.append(selector);
                    SharkGame.Button.makeButton(buttonName, buttonData.name, toAppendTo, buttonData.click);
                    break;
                default:
                    SharkGame.Button.makeButton(buttonName, buttonData.name, toAppendTo, buttonData.click);
            }
        });

        if (cad.pause) {
            $("#stop").addClass("disabled");
        } else {
            $("#stop").removeClass("disabled");
        }

        if (cad.stop) {
            $("#pause").addClass("disabled");
        } else {
            $("#pause").removeClass("disabled");
        }

        this.update();
        SharkGame.persistentFlags.seenCheatsTab = true;
    },

    update() {
        $.each(cad.defaultParameters, (which, defaultValue) => {
            let msg = "<br>";
            if (defaultValue !== cad[which]) {
                switch (which) {
                    case "pause":
                        msg = "Game paused.";
                        break;
                    case "stop":
                        msg = "Game processing halted.";
                        break;
                    case "speed":
                        msg = "Game speed x" + cad.speed + ".";
                        break;
                    case "upgradePriceModifier":
                        msg = "Upgrades cost " + cad.upgradePriceModifier + "x normal.";
                        break;
                    case "actionPriceModifier":
                        msg = "Buying stuff costs " + cad.actionPriceModifier + "x normal.";
                        break;
                    case "noNumberBeautifying":
                        msg = "Number formatting disabled.";
                        break;
                    case "cycling":
                        msg = "Cycling styles.";
                        break;
                }
            }
            if ($("#" + which + "Row").html() !== msg) {
                $("#" + which + "Row").html(msg);
            }
        });

        $.each(cad.cheatButtons, (buttonName, buttonData) => {
            if (buttonData.updates) {
                switch (buttonData.type) {
                    case "up-down":
                        // does nothing yet
                        break;
                    default:
                        if ($("#" + buttonName).html() !== buttonData.name) {
                            $("#" + buttonName).html(buttonData.name);
                        }
                }
            }
        });
    },

    cycleStyles(time = 2000) {
        if (cad.cycling) return;
        cad.cycling = true;
        let i = 0;
        let intervalId = NaN;
        function nextStyle() {
            if (i >= gateway.allowedWorlds.length && !isNaN(intervalId)) {
                clearInterval(intervalId);
            } else {
                world.worldType = gateway.allowedWorlds[i++];
                console.debug(`worldType now ${world.worldType}`);
            }
        }
        setTimeout(nextStyle);
        intervalId = setInterval(nextStyle, time);
        cad.cycling = false;
    },

    discoverAll() {
        $.each(SharkGame.Tabs, (tabName) => {
            if (tabName !== "current") {
                SharkGame.TabHandler.discoverTab(tabName);
            }
        });
    },

    giveEverything(amount = 1) {
        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            res.changeResource(resourceId, amount);
        });
        return (amount > 0 ? "Gave " + sharktext.beautify(amount) : "Removed " + sharktext.beautify(-amount)) + " stuff.";
    },

    giveSomething(resourceId = "fish", amount = 1) {
        res.changeResource(resourceId, amount);
        let returnText;
        const resourceName = sharktext.getResourceName(
            resourceId,
            false,
            sharkmath.getBuyAmount(true),
            log.isNextMessageEven() ? sharkcolor.getVariableColor("--color-dark") : sharkcolor.getVariableColor("--color-med")
        );
        if (amount > 0) {
            returnText = `Gave ${sharktext.beautify(amount)} ${resourceName}.`;
        } else {
            returnText = `Removed ${sharktext.beautify(-amount)} ${resourceName}.`;
        }
        return returnText;
    },

    debug() {
        SharkGame.persistentFlags.debug = true;
        SharkGame.persistentFlags.unlockedDebug = true;
    },

    hideDebug() {
        SharkGame.persistentFlags.debug = false;
        SharkGame.Tabs.cheats.discovered = false;
        SharkGame.Tabs.cheats.seen = false;
        if (!SharkGame.gameOver) {
            if (SharkGame.Tabs.current === "cheats") {
                SharkGame.Tabs.current = "home";
            }
            SharkGame.TabHandler.setUpTab();
        }
    },

    toggleDebugButton() {
        if (SharkGame.HomeActions.getActionTable().debugbutton.unauthorized) {
            SharkGame.HomeActions.getActionTable().debugbutton.unauthorized = false;
        } else {
            SharkGame.HomeActions.getActionTable().debugbutton.unauthorized = true;
            SharkGame.HomeActions.getActionTable().debugbutton.discovered = false;
        }
    },

    togglePausePlease() {
        if (cad.stop) {
            log.addError("The game is stopped. You can't also pause it.");
            return;
        }
        if (!cad.pause) {
            cad.pause = true;
            $("#stop").addClass("disabled");
        } else {
            cad.pause = false;
            $("#stop").removeClass("disabled");
        }
        this.update();
    },
    toggleStopPlease() {
        if (cad.pause) {
            log.addError("The game is paused. You can't also stop it.");
            return;
        }
        if (!cad.stop) {
            cad.stop = true;
            $("#pause").addClass("disabled");
        } else {
            cad.stop = false;
            $("#pause").removeClass("disabled");
        }
        this.update();
    },
    toggleFreezePlease() {
        if (cad.frozen) {
            cad.frozen = false;
            res.setResource("ice", 0);
            return "Game unfrozen.";
        }
        cad.frozen = true;
        world.forceExistence("ice");
        SharkGame.PlayerResources.get("ice").discovered = true;
        res.setResource("ice", 1000);
        res.setTotalResource("ice", 1000);
        res.clearNetworks();
        res.buildIncomeNetwork();
        res.reconstructResourcesTable();
        return "ICE going, doofus!";
    },
    freeEssencePlease(howMuch = 15) {
        res.changeResource("essence", howMuch);
        return "Okay, but only because you asked nicely.";
    },
    goFasterPlease() {
        if (cad.speed === 512) {
            return "I think you've had enough.";
        }
        let msg = "";
        cad.speed *= 2;
        switch (cad.speed) {
            case 2:
                msg = "Going twice as fast.";
                break;
            case 512:
                msg = "Going...really fast.";
                break;
            default:
                msg = "Going " + cad.speed + " times normal speed.";
                break;
        }
        return msg;
    },
    reallyFastPlease() {
        cad.speed = 512;
        return "Set game speed to 512x.";
    },
    goSlowerPlease() {
        if (cad.speed === 1 / 512) {
            return "I think that's slow enough, don't you?";
        }
        let msg = "";
        cad.speed *= 0.5;
        switch (cad.speed) {
            case 1 / 2:
                msg = "Going twice as slow.";
                break;
            case 1 / 512:
                msg = "Going...really slow.";
                break;
            default:
                msg = "Going " + cad.speed + " times normal speed.";
                break;
        }
        return msg;
    },
    reallySlowPlease() {
        cad.speed = 1 / 512;
        return "Set game speed to 1/512th speed.";
    },
    resetSpeedPlease() {
        cad.speed = 1;
        return "Reset game speed to 1x.";
    },
    giveMeMoreOfEverythingPlease(multiplier) {
        SharkGame.ResourceMap.forEach((_value, key) => {
            SharkGame.PlayerResources.get(key).amount *= multiplier;
        });
        return "Gave you ten times more of everything.";
    },
    setAllResources(howMuch = 1) {
        SharkGame.ResourceMap.forEach((_value, key) => {
            res.setResource(key, 0);
            res.changeResource(key, howMuch);
        });
    },
    doSomethingCoolPlease() {
        return "Did something really cool.";
        // this doesn't do anything
    },
    beatWorldPlease() {
        SharkGame.wonGame = true;
        main.endGame();
        return "You got it, boss.";
    },
    toggleBeautify() {
        cad.noNumberBeautifying = !cad.noNumberBeautifying;
    },
    rollTheDicePlease(number = Math.floor(Math.random() * 20 + 1)) {
        switch (number) {
            case 1:
                world.forceExistence("tar");
                if (!SharkGame.ResourceMap.get("world").income) {
                    SharkGame.ResourceMap.get("world").income = {};
                }
                if (!SharkGame.ResourceMap.get("world").baseIncome) {
                    SharkGame.ResourceMap.get("world").baseIncome = {};
                }
                SharkGame.ResourceMap.get("world").income.tar = 1;
                SharkGame.ResourceMap.get("world").baseIncome.tar = 1;
                res.reconstructResourcesTable();
                return "Rolled a one. Uh oh.";
            case 2:
                res.addNetworkNode(SharkGame.GeneratorIncomeAffectors, "fish", "exponentiate", "shark", 0.999);
                res.addNetworkNode(SharkGame.GeneratorIncomeAffectors, "sand", "exponentiate", "ray", 0.999);
                res.addNetworkNode(SharkGame.GeneratorIncomeAffectors, "crystal", "exponentiate", "crab", 0.999);
                res.clearNetworks();
                res.buildIncomeNetwork();
                return "Rolled a two. Fish make sharks slower. Sand makes rays slower. Crystal makes crabs slower. Oops.";
            case 3:
                if (world.doesResourceExist("fish")) {
                    if (!SharkGame.ResourceMap.get("fish").income) {
                        SharkGame.ResourceMap.get("fish").income = {};
                    }
                    if (!SharkGame.ResourceMap.get("fish").baseIncome) {
                        SharkGame.ResourceMap.get("fish").baseIncome = {};
                    }
                    SharkGame.ResourceMap.get("fish").income.shark = -0.001;
                    SharkGame.ResourceMap.get("fish").income.ray = -0.001;
                    SharkGame.ResourceMap.get("fish").income.crab = -0.001;
                    SharkGame.ResourceMap.get("fish").income.whale = -0.001;
                    SharkGame.ResourceMap.get("fish").income.squid = -0.001;
                    SharkGame.ResourceMap.get("fish").baseIncome.shark = -0.001;
                    SharkGame.ResourceMap.get("fish").baseIncome.ray = -0.001;
                    SharkGame.ResourceMap.get("fish").baseIncome.crab = -0.001;
                    SharkGame.ResourceMap.get("fish").baseIncome.whale = -0.001;
                    SharkGame.ResourceMap.get("fish").baseIncome.squid = -0.001;
                    SharkGame.ResourceMap.get("fish").forceIncome = true;
                    return "Rolled a three. The fish are fighting back!";
                }
                return "Rolled a three, but fish don't exist, so nothing happened.";
            case 4:
                if (SharkGame.ResourceMap.get("shark").baseIncome.fish) {
                    SharkGame.ResourceMap.get("shark").baseIncome.fish = -1;
                    res.reapplyModifiers("shark", "fish");
                    return "Rolled a four. The sharks are eating all the fish!";
                } else {
                    SharkGame.ResourceMap.get("shark").baseIncome.shark = -1;
                    res.reapplyModifiers("shark", "shark");
                    return "Rolled a four. The sharks would be eating fish, but they don't catch fish anymore. NOW THEY'RE EATING EACHOTHER! AAAAAAAAAAAAAAAA";
                }
            case 5:
                res.applyModifier("resourceBoost", "fish", 0.125);
                return "Rolled a five. I just killed 87.5% of all fish in the ocean. Now you get 87.5% less fish.";
            case 6:
                SharkGame.ResourceMap.forEach((_value, key) => {
                    if (key !== "essence") {
                        res.setResource(key, 0);
                        res.changeResource(key, 1);
                    }
                });
                return "Rolled a 6...you own one of exactly everything now. Only one.";
            case 7:
                res.changeResource("shark", res.getResource("shark") * 255);
                return "Rolled a seven. Your sharks have been duplicated. A lot.";
            case 8:
                res.addNetworkNode(SharkGame.ResourceIncomeAffectors, "sand", "multiply", "sand", 0.001);
                res.clearNetworks();
                res.buildIncomeNetwork();
                return "Rolled an eight. Sand makes its own production faster.";
            case 9:
                res.changeResource("fish", 10000000000 * Math.random() ** 3);
                return "Rolled a nine. You eat fish hooray!";
            case 10:
                if (!SharkGame.ResourceMap.get("shark").income) {
                    SharkGame.ResourceMap.get("shark").income = {};
                }
                if (!SharkGame.ResourceMap.get("shark").baseIncome) {
                    SharkGame.ResourceMap.get("shark").baseIncome = {};
                }
                SharkGame.ResourceMap.get("shark").income.fish = 0;
                SharkGame.ResourceMap.get("shark").baseIncome.fish = 0;
                SharkGame.ResourceMap.get("shark").income.shark = 0.1;
                SharkGame.ResourceMap.get("shark").baseIncome.shark = 0.1;
                SharkGame.ResourceMap.get("shark").income.ray = 0.05;
                SharkGame.ResourceMap.get("shark").baseIncome.ray = 0.05;
                SharkGame.ResourceMap.get("shark").income.crab = 0.01;
                SharkGame.ResourceMap.get("shark").baseIncome.crab = 0.01;
                res.reapplyModifiers("shark", "shark");
                res.reapplyModifiers("shark", "ray");
                res.reapplyModifiers("shark", "crab");
                return "Rolled a ten. Sharks now produce themselves. And rays. And crabs. But not fish. Not anymore.";
            case 11:
                res.addNetworkNode(SharkGame.GeneratorIncomeAffectors, "nurse", "exponentiate", "nurse", 1.01);
                res.addNetworkNode(SharkGame.GeneratorIncomeAffectors, "nurse", "exponentiate", "shark", 0.98);
                res.addNetworkNode(SharkGame.GeneratorIncomeAffectors, "maker", "exponentiate", "maker", 1.01);
                res.addNetworkNode(SharkGame.GeneratorIncomeAffectors, "maker", "exponentiate", "ray", 0.98);
                res.clearNetworks();
                res.buildIncomeNetwork();
                return "Rolled an eleven. Nurses speed up one another, but slow down sharks. Ditto for rays and makers.";
            case 12:
                if (!SharkGame.ResourceMap.get("world").income) {
                    SharkGame.ResourceMap.get("world").income = {};
                }
                if (!SharkGame.ResourceMap.get("world").baseIncome) {
                    SharkGame.ResourceMap.get("world").baseIncome = {};
                }
                SharkGame.ResourceMap.get("world").income.shark = 1;
                SharkGame.ResourceMap.get("world").baseIncome.shark = 1;
                return "Rolled a twelve. The world now gives you free sharks. Sweet.";
            case 13:
                if (world.doesResourceExist("fish")) {
                    res.addNetworkNode(SharkGame.GeneratorIncomeAffectors, "fish", "multiply", "shark", 0.0005);
                    res.clearNetworks();
                    res.buildIncomeNetwork();
                    return "Rolled a thirteen. Sharks get faster for every fish owned. I guess a good meal makes for better workers.";
                }
                return "Rolled a thirteen, but fish don't exist, so nothing happened.";
            case 14:
                if (world.doesResourceExist("crab")) {
                    world.worldResources.get("crab").exists = false;
                    res.setResource("crab", 0);
                    res.setTotalResource("crab", 0);
                    world.worldResources.get("brood").exists = false;
                    res.setResource("brood", 0);
                    res.setTotalResource("brood", 0);
                    world.worldResources.get("planter").exists = false;
                    res.setResource("planter", 0);
                    res.setTotalResource("planter", 0);
                    world.worldResources.get("collector").exists = false;
                    res.setResource("collector", 0);
                    res.setTotalResource("collector", 0);
                    world.worldResources.get("extractionTeam").exists = false;
                    res.setResource("extractionTeam", 0);
                    res.setTotalResource("extractionTeam", 0);
                    res.reconstructResourcesTable();
                    if (world.worldType === "start") {
                        delete SharkGame.HomeActions.generated.default.getCrab;
                        delete SharkGame.HomeActions.generated.default.getBrood;
                        delete SharkGame.HomeActions.generated.default.getPlanter;
                        delete SharkGame.HomeActions.generated.default.getCollector;
                        delete SharkGame.HomeActions.generated.default.getExtractionTeam;
                    } else {
                        delete SharkGame.HomeActions.generated[world.worldType].getCrab;
                        delete SharkGame.HomeActions.generated[world.worldType].getBrood;
                        delete SharkGame.HomeActions.generated[world.worldType].getPlanter;
                        delete SharkGame.HomeActions.generated[world.worldType].getCollector;
                        delete SharkGame.HomeActions.generated[world.worldType].getExtractionTeam;
                    }
                    SharkGame.TabHandler.setUpTab();
                    return "Rolled a fourteen. What are you talking about? Crabs aren't real. There were never crabs to begin with.";
                }
                return "Rolled a fourteen, but crabs don't exist, so nothing happened.";
            case 15:
                SharkGame.ResourceMap.get("science").baseIncome = { scientist: 0.01 };
                SharkGame.ResourceMap.get("science").income = { scientist: 0.01 };
                return "Rolled a fifteen. Science produces more science sharks. I guess knowledge is contagious?";
            case 16:
                SharkGame.ResourceMap.get("crystal").income = { sand: 1 };
                SharkGame.ResourceMap.get("crystal").baseIncome = { sand: 1 };
                SharkGame.ResourceMap.get("sand").income = { fish: 1 };
                SharkGame.ResourceMap.get("sand").baseIncome = { fish: 1 };
                if (!SharkGame.ResourceMap.get("fish").income) {
                    SharkGame.ResourceMap.get("fish").income = {};
                }
                return "Rolled a sixteen. Crystals now produce sand. Sand produces fish. Fish still produces whatever it did before. What?";
            case 17:
                world.forceExistence("crab");
                world.forceExistence("brood");
                res.changeResource("crab", 10);
                SharkGame.ResourceMap.get("crab").baseIncome.brood = 0.01;
                res.reapplyModifiers("crab", "brood");
                return "Rolled a seventeen. The crabs. They're multiplying.";
            case 18:
                if (world.doesResourceExist("fish")) {
                    if (!SharkGame.ResourceMap.get("fish").income) {
                        SharkGame.ResourceMap.get("fish").income = {};
                    }
                    SharkGame.ResourceMap.get("fish").income.shark = 0.01;
                    SharkGame.ResourceMap.get("fish").income.ray = 0.002;
                    SharkGame.ResourceMap.get("fish").income.crab = 0.005;
                    SharkGame.ResourceMap.get("fish").income.squid = 0.005;
                    SharkGame.ResourceMap.get("fish").income.whale = 0.00001;
                    SharkGame.ResourceMap.get("fish").income.fish = -0.999;
                    if (!SharkGame.ResourceMap.get("fish").baseIncome) {
                        SharkGame.ResourceMap.get("fish").baseIncome = {};
                    }
                    SharkGame.ResourceMap.get("fish").baseIncome.shark = 0.01;
                    SharkGame.ResourceMap.get("fish").baseIncome.ray = 0.002;
                    SharkGame.ResourceMap.get("fish").baseIncome.crab = 0.005;
                    SharkGame.ResourceMap.get("fish").baseIncome.squid = 0.005;
                    SharkGame.ResourceMap.get("fish").baseIncome.whale = 0.00001;
                    SharkGame.ResourceMap.get("fish").baseIncome.fish = -0.999;
                    return "Rolled an eighteen. Fish will now purchase frenzy members for you. Thank me later.";
                }
                return "Rolled an eighteen, but fish don't exist, so nothing happened.";
            case 19:
                cad.upgradePriceModifier = 0;
                cad.actionPriceModifier = 4;
                return "Rolled a nineteen. Upgrades are free, yay! But everything is four times as expensive. Not-so-yay.";
            case 20:
                res.specialMultiplier *= 20;
                return "Rolled a perfect twenty. Everything times 20.";
        }
    },
    // challengeMePlease() {
    //     switch (world.worldType) {
    //         case "abandoned":
    //             world.forceExistence("tar");
    //             if (!SharkGame.ResourceMap.get("fish").income) SharkGame.ResourceMap.get("fish").income = {};
    //             if (!SharkGame.ResourceMap.get("fish").baseIncome) SharkGame.ResourceMap.get("fish").baseIncome = {};
    //             SharkGame.ResourceMap.get("fish").income.tar = 0.00001;
    //             SharkGame.ResourceMap.get("fish").baseIncome.tar = 0.00001;
    //             res.reapplyModifiers("fish", "tar");
    //             return "Abandoned Challenge:<br>Dirty fish! Fish produce tar!";
    //         case "haven":
    //             SharkGame.ResourceMap.get("nurse").baseIncome.fish = -500000000;
    //             res.reapplyModifiers("nurse", "fish");
    //             SharkGame.ResourceMap.get("maker").baseIncome.fish = -50000000;
    //             res.reapplyModifiers("maker", "fish");
    //             SharkGame.ResourceMap.get("brood").baseIncome.fish = -500000000;
    //             res.reapplyModifiers("brood", "fish");
    //             SharkGame.ResourceMap.get("scientist").baseIncome.crystal = -10000;
    //             res.reapplyModifiers("scientist", "crystal");
    //             SharkGame.ResourceMap.get("treasurer").baseIncome.kelp = -5000;
    //             res.reapplyModifiers("treasurer", "kelp");
    //             SharkGame.ResourceMap.get("planter").baseIncome.sand = -100000;
    //             res.reapplyModifiers("planter", "sand");
    //             return "Haven Challenge:<br>Unionization! Specialists and breeders demand real paychecks!";
    //     }
    // },
    expensiveUpgradesPlease() {
        if (cad.upgradePriceModifier === 512) {
            return "I'm not letting you subject yourself to any more of this.";
        }
        let msg = "";
        cad.upgradePriceModifier *= 2;
        switch (cad.upgradePriceModifier) {
            case 0:
                log.addError("Can't change the price of upgrades because they're free.");
                break;
            case 2:
                msg = "Upgrades are twice as expensive.";
                break;
            case 512:
                msg = "Upgrades are...really expensive.";
                break;
            default:
                msg = "Upgrades are " + cad.upgradePriceModifier + " times normal price.";
                break;
        }
        return msg;
    },
    cheaperUpgradesPlease() {
        if (cad.upgradePriceModifier === 1 / 512) {
            return "Is this not easy enough for you yet??";
        }
        let msg = "";
        cad.upgradePriceModifier *= 0.5;
        switch (cad.upgradePriceModifier) {
            case 0:
                log.addError("Can't change the price of upgrades because they're free.");
                break;
            case 1 / 2:
                msg = "Upgrades are half as expensive.";
                break;
            case 1 / 512:
                msg = "Upgrades are...really cheap.";
                break;
            default:
                msg = "Upgrades are " + cad.upgradePriceModifier + " times normal price.";
                break;
        }
        return msg;
    },
    expensiveStuffPlease() {
        if (cad.actionPriceModifier === 512) {
            return "Seriously?";
        }
        let msg = "";
        cad.actionPriceModifier *= 2;
        switch (cad.actionPriceModifier) {
            case 0:
                log.addError("Can't change the price of stuff because it's free.");
                break;
            case 2:
                msg = "Stuff is twice as expensive.";
                break;
            case 512:
                msg = "Stuff is...really expensive.";
                break;
            default:
                msg = "Stuff is " + cad.actionPriceModifier + " times normal price.";
                break;
        }
        return msg;
    },
    cheaperStuffPlease() {
        if (cad.actionPriceModifier === 1 / 512) {
            return "Is this not easy enough for you yet??";
        }
        let msg = "";
        cad.actionPriceModifier *= 0.5;
        switch (cad.actionPriceModifier) {
            case 0:
                log.addError("Can't change the price of stuff because it's free.");
                break;
            case 1 / 2:
                msg = "Stuff is half as expensive.";
                break;
            case 1 / 512:
                msg = "Stuff is...really cheap.";
                break;
            default:
                msg = "Stuff is " + cad.actionPriceModifier + " times normal price.";
                break;
        }
        return msg;
    },
    toggleFreeStuff() {
        if (cad.actionPriceModifier === 0) {
            cad.actionPriceModifier = 1;
            return "Made stuff not free.";
        } else {
            cad.actionPriceModifier = 0;
            return "Made stuff free.";
        }
    },
    toggleFreeUpgrades() {
        if (cad.upgradePriceModifier === 0) {
            cad.upgradePriceModifier = 1;
            return "Made upgrades not free.";
        } else {
            cad.upgradePriceModifier = 0;
            return "Made upgrades free.";
        }
    },
    addUpgradesPlease() {
        const upgradeTable = SharkGame.Upgrades.getUpgradeTable();
        $.each(upgradeTable, (upgradeId) => {
            SharkGame.Lab.addUpgrade(upgradeId);
        });
        return "Added all upgrades. This might get weird.";
    },
    addIdleTimePlease(time = Math.random() * 120000 + 30000) {
        SharkGame.flags.minuteHandTimer += time;
        res.minuteHand.addBonusTime(time);
        res.minuteHand.updateDisplay();
    },
    forceAllExist() {
        SharkGame.ResourceMap.forEach((resource, resourceId) => {
            if (resource.desc && resource.desc !== "") world.forceExistence(resourceId);
        });
        $("#content").empty();
        cad.switchTo();
        return "Okay, here we go...";
    },
    doEgg() {
        if (SharkGame.flags.egg) {
            SharkGame.flags.egg = false;
        } else {
            SharkGame.flags.egg = true;
        }
        res.reconstructResourcesTable();
        return "egg";
    },
};
