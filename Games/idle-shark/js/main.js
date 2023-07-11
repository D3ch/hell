"use strict";
window.SharkGame = window.SharkGame || {};

window.onmousemove = (event) => {
    SharkGame.lastActivity = _.now();

    const tooltip = document.getElementById("tooltipbox");
    const posX = event.clientX;
    const posY = event.clientY;

    tooltip.style.top = Math.max(Math.min(posY - 20, window.innerHeight - tooltip.offsetHeight - 10), 20) + "px";
    // Would clip over right screen edge
    if (tooltip.offsetWidth + posX + 35 > window.innerWidth) {
        tooltip.style.left = posX - 10 - tooltip.offsetWidth + "px";
    } else {
        tooltip.style.left = posX + 15 + "px";
    }
};

$(document).on("keyup", (event) => {
    SharkGame.lastActivity = _.now();

    const mkey = SharkGame.Keybinds.modifierKeys;
    if ((mkey.ShiftLeft || mkey.ShiftRight) && !event.shiftKey) {
        mkey.ShiftLeft = 0;
        mkey.ShiftRight = 0;
    } else if ((mkey.AltLeft || mkey.AltRight) && !event.altKey) {
        mkey.AltLeft = 0;
        mkey.AltRight = 0;
    } else if ((mkey.ControlLeft || mkey.ControlRight) && !event.ctrlKey) {
        mkey.ControlLeft = 0;
        mkey.ControlRight = 0;
    }

    if (SharkGame.Keybinds.handleKeyUp(event.code)) {
        event.preventDefault();
    }
});

$(document).on("keydown", (event) => {
    SharkGame.lastActivity = _.now();
    if (SharkGame.Keybinds.handleKeyDown(event.code)) {
        event.preventDefault();
    }
});

// CORE VARIABLES AND HELPER FUNCTIONS
$.extend(SharkGame, {
    GAME_NAMES: [
        "Five Seconds A Shark",
        "Next Shark Game",
        "Next Shark Game: Barkfest",
        "Sharky Clicker",
        "Weird Oceans",
        "You Have To Name The Shark Game",
        "Shark A Lark",
        "Bark Shark",
        "Fin Idle",
        "Ray of Dreams",
        "Shark Saver",
        "Shoal Sharker",
        "Shark Souls",
        "Saucy Sharks",
        "Sharkfall",
        "Heart of Sharkness",
        "Sharks and Recreation",
        "Alone in the Shark",
        "Sharkpocalypse",
        "Shark of Darkness",
        "Strange Oceans",
        "A New Frontier",
        "Lobster's Paradise",
        "Revenge of the Crabs",
        "Shark Box",
        "Dolphin Heroes",
        "Maws",
        "Part 6, Stone Ocean",
        "Sailor Crab",
        "League of Lobsters",
        "Eel Team Six",
        "Dungeons And Dolphins",
        "Gameshark",
        "Five Nights in Frigid",
        "The Shark of Wall Street",
        ":the shark game:",
        "Sharkware Edition",
        "Help Wanted",
        "NOT FINISHED",
        "Deluxe",
        "doo doo do-do do-do",
        "DUNGEONS",
        "The Adventure Continues",
        "To Be Continued",
        "what the crab doin",
        "#TeamSeas",
        "Sharks of Rage",
        "Bedrock Edition",
        "Javascript Edition",
        "You are a Shark",
        "Mystery of Shark City",
        "Modded",
        "8 hours later...",
        "Seas of Loathing",
        "Raiders of the Lost Shark",
    ],
    GAME_NAME: null,
    ACTUAL_GAME_NAME: "Shark Game",
    VERSION: "20220712a",
    ORIGINAL_VERSION: 0.71,
    VERSION_NAME: "The Volcanic Update",
    EPSILON: 1e-6, // floating point comparison is a joy
    BIGGEST_SAFE_NUMBER: 1000000000000,
    MAX: 1e300,

    IDLE_THRESHOLD: 120000,
    IDLE_FADE_TIME: 5000,

    INTERVAL: 1000 / 10, // 20 FPS // I'm pretty sure 1000 / 10 comes out to 10 FPS
    dt: 1 / 10,
    before: _.now(),
    lastMouseActivity: _.now(),
    savedMouseActivity: _.now(),

    timestampLastSave: false,
    timestampGameStart: false,
    timestampRunStart: false,
    timestampRunEnd: false,
    timestampSimulated: false,

    sidebarHidden: true,
    paneGenerated: false,

    gameOver: false,
    wonGame: false,

    flags: {},
    persistentFlags: {},

    spriteIconPath: "img/sharksprites.png",
    spriteHomeEventPath: "img/sharkeventsprites.png",

    /**
     *
     * @param {any[]} choices
     * @returns {any} A random element of choices
     */
    choose(choices) {
        return choices[Math.floor(Math.random() * choices.length)];
    },
    getImageIconHTML(imagePath, width, height) {
        if (!imagePath) {
            imagePath = "http://placekitten.com/g/" + Math.floor(width) + "/" + Math.floor(height);
        }
        let imageHtml = "";
        if (SharkGame.Settings.current.iconPositions !== "off") {
            imageHtml += "<img width=" + width + " height=" + height + " src='" + imagePath + "' class='button-icon'>";
        }
        return imageHtml;
    },
    changeSprite(spritePath, imageName, imageDiv, backupImageName) {
        let spriteData = SharkGame.Sprites[imageName];
        if (!imageDiv) {
            imageDiv = $("<div>");
        }

        // if the original sprite data is undefined, try loading the backup
        if (!spriteData) {
            spriteData = SharkGame.Sprites[backupImageName];
        }

        if (spriteData) {
            imageDiv.css("background-image", "url(" + spritePath + ")");
            imageDiv.css("background-position", "-" + spriteData.frame.x + "px -" + spriteData.frame.y + "px");
            imageDiv.width(spriteData.frame.w);
            imageDiv.height(spriteData.frame.h);
        } else {
            imageDiv.css("background-image", 'url("//placehold.it/50x50")');
            imageDiv.width(50);
            imageDiv.height(50);
        }
        return imageDiv;
    },
});

SharkGame.Main = {
    tickHandler: -1,
    autosaveHandler: -1,

    applyFramerate() {
        SharkGame.INTERVAL = 1000 / SharkGame.Settings.current.framerate;
        SharkGame.dt = 1 / SharkGame.Settings.current.framerate;
        if (main.tickHandler) {
            clearInterval(main.tickHandler);
        }
        main.tickHandler = setInterval(main.tick, SharkGame.INTERVAL);
    },

    // specifically wipe all progress
    resetGame() {
        SharkGame.Save.wipeSave();
        main.wipeGame();
        main.setUpGame();
    },

    // start the game
    init() {
        // wipe it
        main.wipeGame();
        // load a save if needed
        main.restoreGame("load");
        // then set up the game according to this data
        main.setUpGame();

        const isSafari =
            /constructor/i.test(window.HTMLElement) ||
            (!window.safari || (typeof safari !== "undefined" && window.safari.pushNotification)).toString() === "[object SafariRemoteNotification]";
        if (isSafari) {
            console.info("Detected Safari browser!");
            SharkGame.PaneHandler.addPaneToStack("Safari Notice", SharkGame.Panes.safariNotice);
        }
    },

    // reset all game variables to their defaults
    // leaves a blank slate
    wipeGame() {
        const now = _.now();
        SharkGame.before = now;
        SharkGame.timestampSimulated = now;
        SharkGame.lastActivity = now;
        if (SharkGame.GAME_NAME === null) {
            SharkGame.GAME_NAME = SharkGame.choose(SharkGame.GAME_NAMES);
            document.title = SharkGame.ACTUAL_GAME_NAME + ": " + SharkGame.GAME_NAME;
        }

        SharkGame.timestampLastSave = now;
        SharkGame.timestampGameStart = now;
        SharkGame.timestampRunStart = now;

        $("#game").removeClass("inGateway");
        $("#sidebar").hide();
        $("#overlay").hide();
        $("#idle-overlay").hide();
        SharkGame.sidebarHidden = true;
        // remove any errant classes
        $("#pane").removeClass("gateway");

        // clear any html and remove errant classes from tooltip
        $("#tooltipbox")
            .removeClass("forHomeButtonOrGrotto")
            .removeClass("forIncomeTable")
            .removeClass("forAspectTree")
            .removeClass("forAspectTreeUnpurchased")
            .removeClass("forAspectTreeAffordable")
            .html("");

        $("#gameName").html("- " + SharkGame.GAME_NAME + " -");
        $("#versionNumber").html(
            `New Frontiers v ${SharkGame.VERSION} - ${SharkGame.VERSION_NAME}<br/>\
Mod of v ${SharkGame.ORIGINAL_VERSION}`
        );
        $.getJSON("https://api.github.com/repos/Toby222/SharkGame/commits/alpha", (data) => {
            SharkGame.COMMIT_SHA = data.sha;
        });
        log.clearMessages(false);
        SharkGame.Settings.current.buyAmount = 1;

        // here to stop timer from saying NaN
        SharkGame.persistentFlags.totalPausedTime = 0;
        SharkGame.persistentFlags.currentPausedTime = 0;

        // wipe all resource tables
        SharkGame.Resources.init();

        // initialise world
        // MAKE SURE GATE IS INITIALISED AFTER WORLD!!
        SharkGame.World.init();

        // reset planetpool and completed worlds and gameover and wongame
        SharkGame.Gateway.init();

        // generate requiredBy entries
        SharkGame.AspectTree.init();

        // initialise tabs
        SharkGame.Home.init();
        SharkGame.Lab.init();
        SharkGame.Stats.init();
        SharkGame.Recycler.init();
        SharkGame.Gate.init();
        SharkGame.Reflection.init();
        SharkGame.CheatsAndDebug.init();

        // clear flags
        SharkGame.flags = {};
        SharkGame.persistentFlags = {};

        SharkGame.EventHandler.init();

        SharkGame.TitleBarHandler.init();
        SharkGame.TabHandler.init();
        SharkGame.PaneHandler.init();
        SharkGame.OverlayHandler.init();

        SharkGame.Keybinds.init();

        SharkGame.Resources.minuteHand.init();
        SharkGame.Resources.pause.init();
        SharkGame.Resources.dial.init();
    },

    // load stored game data, if there is anything to load
    restoreGame(goal) {
        switch (goal) {
            case "load":
                if (SharkGame.Save.savedGameExists()) {
                    try {
                        SharkGame.Save.loadGame();
                        log.addMessage("Loaded game.");
                    } catch (err) {
                        log.addError(err);
                    }
                }
                break;
            case "loop":
                // idk yet
                break;
            default:
            // nothing to restore
        }
    },

    // interpret and use the data from the previous steps
    setUpGame() {
        const now = _.now();
        SharkGame.timestampLastSave = SharkGame.timestampLastSave || now;
        SharkGame.timestampGameStart = SharkGame.timestampGameStart || now;
        SharkGame.timestampRunStart = SharkGame.timestampRunStart || now;

        // first set up the world because it adds the world resource
        SharkGame.World.setup();

        // refund aspects if necessary
        // create restrictions
        SharkGame.AspectTree.setup();

        // now set up resources because a lot depends on it
        SharkGame.Resources.setup();

        // initialise tabs
        // always set up lab first
        SharkGame.Lab.setup();
        SharkGame.Home.setup();
        SharkGame.Stats.setup();
        SharkGame.Recycler.setup();
        SharkGame.Gate.setup();
        SharkGame.Reflection.setup();
        SharkGame.CheatsAndDebug.setup();

        SharkGame.EventHandler.setup();

        res.minuteHand.setup();
        res.tokens.init();

        // end game if necessary
        SharkGame.Gateway.setup();

        // rename a game option if this is a first time run
        SharkGame.TitleBarHandler.correctTitleBar();

        // apply tick settings
        main.applyFramerate();

        // apply settings
        $.each(SharkGame.Settings, (settingId, settingData) => {
            if (_.isUndefined(SharkGame.Settings.current[settingId])) {
                SharkGame.Settings.current[settingId] = settingData.defaultSetting;
                if (typeof settingData.onChange === "function") {
                    settingData.onChange();
                }
            }
        });

        SharkGame.TitleBarHandler.updateTopBar();

        if (main.autosaveHandler === -1) {
            main.autosaveHandler = setInterval(main.autosave, SharkGame.Settings.current.autosaveFrequency * 60000);
        }

        // window.addEventListener("beforeunload", main.autosave);

        if (SharkGame.Settings.current.updateCheck) {
            main.checkForUpdateHandler = setInterval(main.checkForUpdate, 300000);
        }

        $("#title").on("click", (event) => {
            if (event.clientX < 100 && event.clientY > 150 && event.clientY < 200) {
                event.currentTarget.classList.add("radical");
            }
        });

        if (!SharkGame.persistentFlags.dialSetting) SharkGame.persistentFlags.dialSetting = 1;

        if (SharkGame.persistentFlags.pause) {
            if (!cad.pause) {
                res.pause.togglePause();
            }
            main.showSidebarIfNeeded();
            if (SharkGame.flags.needOfflineProgress && SharkGame.Settings.current.truePause) {
                SharkGame.persistentFlags.currentPausedTime += SharkGame.flags.needOfflineProgress * 1000;
                SharkGame.flags.needOfflineProgress = 0;
            }
        }

        if (SharkGame.flags.needOfflineProgress) {
            const secondsElapsed = SharkGame.flags.needOfflineProgress;

            if (SharkGame.Settings.current.idleEnabled && !SharkGame.gameOver) {
                res.minuteHand.allowMinuteHand();
                res.minuteHand.updateMinuteHand(secondsElapsed * 1000);
                if (SharkGame.Aspects.overtime.level) {
                    res.minuteHand.updateMinuteHand(secondsElapsed * 200 * SharkGame.Aspects.overtime.level);
                    res.minuteHand.addBonusTime(secondsElapsed * 200 * SharkGame.Aspects.overtime.level);
                }
            } else {
                main.processSimTime(secondsElapsed / SharkGame.persistentFlags.dialSetting, true);
            }

            // acknowledge long time gaps
            // (update these messages some time later)
            if (secondsElapsed > 3600) {
                let notification = "Welcome back! It's been ";
                const numHours = Math.floor(secondsElapsed / 3600);
                if (numHours > 24) {
                    const numDays = Math.floor(numHours / 24);
                    if (numDays > 7) {
                        const numWeeks = Math.floor(numDays / 7);
                        if (numWeeks > 4) {
                            const numMonths = Math.floor(numWeeks / 4);
                            if (numMonths > 12) {
                                const numYears = Math.floor(numMonths / 12);
                                notification +=
                                    "almost " +
                                    (numYears === 1 ? "a" : numYears) +
                                    " year" +
                                    sharktext.plural(numYears) +
                                    ", thanks for remembering this exists!";
                            } else {
                                notification +=
                                    "like " +
                                    (numMonths === 1 ? "a" : numMonths) +
                                    " month" +
                                    sharktext.plural(numMonths) +
                                    ", it's getting kinda crowded.";
                            }
                        } else {
                            notification +=
                                "about " + (numWeeks === 1 ? "a" : numWeeks) + " week" + sharktext.plural(numWeeks) + ", you were gone a while!";
                        }
                    } else {
                        notification +=
                            (numDays === 1 ? "a" : numDays) + " day" + sharktext.plural(numDays) + ", and look at all the stuff you have now!";
                    }
                } else {
                    notification += (numHours === 1 ? "an" : numHours) + " hour" + sharktext.plural(numHours) + " since you were seen around here!";
                }
                log.addMessage(notification);
            }
            SharkGame.flags.needOfflineProgress = 0;
        }

        // set up tab after load
        SharkGame.TabHandler.setUpTab();
    },

    purgeGame() {
        // empty out all the containers!
        $("#status").empty();
        log.clearMessages();
        $("#content").empty();
    },

    loopGame() {
        if (SharkGame.gameOver) {
            SharkGame.persistentFlags.totalPausedTime = 0;
            SharkGame.persistentFlags.currentPausedTime = 0;

            // populate save data object
            let saveString = "";
            const saveData = {
                version: SharkGame.VERSION,
                resources: {},
                world: { type: world.worldType },
                aspects: {},
            };

            _.each(SharkGame.ResourceCategories.special.resources, (resourceName) => {
                saveData.resources[resourceName] = {
                    amount: res.getResource(resourceName),
                    totalAmount: res.getTotalResource(resourceName),
                };
            });

            _.each(SharkGame.Aspects, ({ level }, aspectId) => {
                if (level) saveData.aspects[aspectId] = level;
            });

            saveData.settings = _.cloneDeep(SharkGame.Settings.current);

            saveData.completedWorlds = _.cloneDeep(SharkGame.Gateway.completedWorlds);
            saveData.persistentFlags = _.cloneDeep(SharkGame.persistentFlags);
            saveData.planetPool = _.cloneDeep(gateway.planetPool);

            // add timestamp
            saveData.timestampLastSave = _.now();
            saveData.timestampGameStart = SharkGame.timestampGameStart;
            saveData.timestampRunStart = _.now();
            saveData.timestampRunEnd = SharkGame.timestampRunEnd;

            saveData.keybinds = _.cloneDeep(SharkGame.Keybinds.keybinds);

            saveData.saveVersion = SharkGame.Save.saveUpdaters.length - 1;
            saveString = ascii85.encode(pako.deflate(JSON.stringify(saveData), { to: "string" }));

            SharkGame.Save.importData(saveString);

            res.minuteHand.applyHourHand();
            res.minuteHand.giveRequestedTime();

            try {
                SharkGame.Save.saveGame();
                log.addMessage("Game saved.");
            } catch (err) {
                log.addError(err);
            }
        }
    },

    tick() {
        if (cad.stop) {
            return;
        }

        const now = _.now();
        const elapsedTime = now - SharkGame.before;

        if (cad.pause) {
            if (SharkGame.Settings.current.truePause) {
                SharkGame.persistentFlags.currentPausedTime += _.now() - SharkGame.before;
            } else {
                if (!SharkGame.persistentFlags.everIdled) {
                    res.minuteHand.allowMinuteHand();
                }
                res.minuteHand.updateMinuteHand(elapsedTime * (1 + SharkGame.Aspects.overtime.level * 0.2));
                res.minuteHand.addBonusTime(elapsedTime * SharkGame.Aspects.overtime.level * 0.2);
            }
            SharkGame.before = now;
            SharkGame.lastActivity = now;
            switch (SharkGame.Tabs.current) {
                case "home":
                    $.each($("#buttonList").children(), (_index, button) => {
                        $(button).addClass("disabled");
                    });
                    break;
                case "lab":
                    $.each($("#buttonList").children(), (_index, button) => {
                        $(button).addClass("disabled");
                    });
                    break;
                default:
                    SharkGame.Tabs[SharkGame.Tabs.current].code.update();
            }
            res.updateResourcesTable();
            return;
        }

        if (!SharkGame.gameOver) {
            SharkGame.EventHandler.handleEventTick("beforeTick");

            if (SharkGame.persistentFlags.currentPausedTime) {
                SharkGame.persistentFlags.totalPausedTime += SharkGame.persistentFlags.currentPausedTime;
                SharkGame.persistentFlags.currentPausedTime = 0;
            }

            // tick main game stuff
            if (now - SharkGame.lastActivity > SharkGame.IDLE_THRESHOLD && res.idleMultiplier === 1 && SharkGame.Settings.current.idleEnabled) {
                main.startIdle(now, elapsedTime);
            }

            if (res.idleMultiplier < 1) {
                main.continueIdle(now, elapsedTime);
            }

            if (res.minuteHand.active) {
                res.minuteHand.updateMinuteHand(elapsedTime);
            } else if (SharkGame.Aspects.overtime.level) {
                res.minuteHand.updateMinuteHand(elapsedTime * 0.2 * SharkGame.Aspects.overtime.level);
                res.minuteHand.addBonusTime(elapsedTime * 0.2 * SharkGame.Aspects.overtime.level);
            }

            // check if the sidebar needs to come back
            if (SharkGame.sidebarHidden) {
                main.showSidebarIfNeeded();
            }

            if (elapsedTime > SharkGame.INTERVAL) {
                // Compensate for lost time.
                main.processSimTime(SharkGame.dt * (elapsedTime / SharkGame.INTERVAL));
            } else {
                main.processSimTime(SharkGame.dt);
            }

            res.updateResourcesTable();

            const tabCode = SharkGame.Tabs[SharkGame.Tabs.current].code;
            tabCode.update();

            SharkGame.TabHandler.checkTabUnlocks();

            SharkGame.before = now;

            SharkGame.EventHandler.handleEventTick("afterTick");
        } else {
            SharkGame.lastActivity = _.now();
        }

        // see if resource table tooltip needs updating
        if (document.getElementById("tooltipbox").className.split(" ").includes("forIncomeTable")) {
            if (document.getElementById("tooltipbox").attributes.current) {
                res.tableTextEnter(null, document.getElementById("tooltipbox").attributes.current.value);
            }
        }
    },

    startIdle(now, elapsedTime) {
        const idleOverlay = $("#idle-overlay");
        idleOverlay.addClass("pointy").removeClass("click-passthrough");
        idleOverlay.on("click", main.endIdle);
        if (idleOverlay.is(":hidden")) {
            $("#minute-hand-div").addClass("front");
            idleOverlay.show().css("opacity", 0).animate({ opacity: 0.8 }, SharkGame.IDLE_FADE_TIME);
        }
        res.minuteHand.toggleOff();
        SharkGame.savedMouseActivity = SharkGame.lastActivity;
        main.continueIdle(now, elapsedTime);
    },

    continueIdle(now, elapsedTime) {
        const speedRatio = Math.min((now - SharkGame.savedMouseActivity - SharkGame.IDLE_THRESHOLD) / SharkGame.IDLE_FADE_TIME, 1);
        res.idleMultiplier = 1 - speedRatio;

        if (speedRatio > 0.8 && !SharkGame.persistentFlags.everIdled) {
            res.minuteHand.allowMinuteHand();
        }
        res.minuteHand.updateMinuteHand(elapsedTime * speedRatio);
    },

    endIdle() {
        const idleOverlay = $("#idle-overlay");
        if (!idleOverlay.is(":hidden")) {
            idleOverlay.stop(true).animate({ opacity: 0 }, 800, () => {
                $("#minute-hand-div").removeClass("front");
                idleOverlay.hide().stop(true);
            });
        }
        idleOverlay.removeClass("pointy").addClass("click-passthrough");
        SharkGame.lastActivity = _.now();
        res.idleMultiplier = 1;
    },

    processSimTime(numberOfSeconds, load = false) {
        // income calculation
        res.processIncomes(numberOfSeconds, false, load);
    },

    autosave() {
        try {
            SharkGame.Save.saveGame();
            log.addMessage("Autosaved.");
        } catch (err) {
            log.addError(err);
        }
    },

    checkForUpdate() {
        $.getJSON("https://api.github.com/repos/Toby222/SharkGame/commits/alpha", (data) => {
            if (data.sha !== SharkGame.COMMIT_SHA) {
                $("#updateGameBox")
                    .html(
                        `You see a new update swimming towards you.<br> On it you can just make out the words <br>"${
                            data.commit.message.split("\n")[0]
                        }". <br>Click to update.`
                    )
                    .on("click", () => {
                        try {
                            SharkGame.Save.saveGame();
                            history.go(0);
                        } catch (err) {
                            log.addError(err);
                            console.error(err);
                            log.addMessage("Something went wrong while saving.");
                        }
                    });
            }
        });
    },

    createBuyButtons(customLabel, addToWhere, appendOrPrepend, absoluteOnly) {
        if (!addToWhere) {
            log.addError("Attempted to create buy buttons without specifying what to do with them.");
            return;
        }

        // add buy buttons
        const buttonList = $("<ul>").attr("id", "buyButtons");
        switch (appendOrPrepend) {
            case "append":
                addToWhere.append(buttonList);
                break;
            case "prepend":
                addToWhere.prepend(buttonList);
                break;
            default:
                log.addError("Attempted to create buy buttons without specifying whether to append or prepend.");
                return;
        }
        _.each(SharkGame.Settings.buyAmount.options, (amount) => {
            if (amount < 0 && absoluteOnly) {
                return true;
            }

            const disableButton = amount === SharkGame.Settings.current.buyAmount;
            buttonList.append(
                $("<li>").append(
                    $("<button>")
                        .addClass("min" + (disableButton ? " disabled" : ""))
                        .attr("id", "buy-" + amount)
                )
            );
            let label = customLabel ? customLabel + " " : "buy ";
            if (amount < 0) {
                if (amount < -2) {
                    label += "1/3 max";
                } else if (amount < -1) {
                    label += "1/2 max";
                } else {
                    label += "max";
                }
            } else if (amount === "custom") {
                label += "custom";
            } else {
                label += sharktext.beautify(amount);
            }
            $("#buy-" + amount)
                .html(label)
                .on("click", function callback() {
                    const thisButton = $(this);
                    if (thisButton.hasClass("disabled")) return;
                    if (thisButton[0].id === "buy-custom") {
                        $("#custom-input").attr("disabled", false);
                    } else {
                        $("#custom-input").attr("disabled", true);
                    }
                    SharkGame.Settings.current.buyAmount = amount === "custom" ? "custom" : parseInt(thisButton.attr("id").slice(4));
                    $("button[id^='buy-']").removeClass("disabled");
                    thisButton.addClass("disabled");
                })
                .on("mouseenter", () => {
                    $(`#tooltipbox`).html(`${label} amount of things`);
                })
                .on("mouseleave", () => {
                    $(`#tooltipbox`).html(``);
                });
        });
        buttonList.append(
            $("<li>").append(
                $("<input>")
                    .prop("type", "number")
                    .attr("id", "custom-input")
                    .attr("value", 1)
                    .attr("min", "1")
                    .attr("disabled", SharkGame.Settings.current.buyAmount !== "custom")
            )
        );
        document.getElementById("custom-input").addEventListener("input", main.onCustomChange);
        if (SharkGame.Settings.current.customSetting) {
            $("#custom-input")[0].value = SharkGame.Settings.current.customSetting;
        }
    },

    onCustomChange() {
        SharkGame.Settings.current.customSetting = $("#custom-input")[0].value;
    },

    showSidebarIfNeeded() {
        // if we have any non-zero resources, show sidebar
        // if we have any log entries, show sidebar
        if (res.haveAnyResources()) {
            // show sidebar
            if (SharkGame.Settings.current.showAnimations) {
                $("#sidebar").show("500");
            } else {
                $("#sidebar").show();
            }
            res.rebuildTable = true;
            // flag sidebar as shown
            SharkGame.sidebarHidden = false;
        }
    },

    endGame(loadingFromSave) {
        // stop autosaving
        clearInterval(main.autosaveHandler);
        main.autosaveHandler = -1;

        // flag game as over
        SharkGame.gameOver = true;

        // grab end game timestamp
        if (!loadingFromSave) {
            SharkGame.timestampRunEnd = _.now();
        }

        // kick over to passage
        gateway.enterGate(loadingFromSave);
    },

    isFirstTime() {
        return world.worldType === "start" && res.getTotalResource("essence") <= 0;
    },

    resetTimers() {
        SharkGame.timestampLastSave = _.now();
        SharkGame.timestampGameStart = _.now();
        SharkGame.timestampRunStart = _.now();
    },

    shouldShowTooltips() {
        if (!(main.isFirstTime() && res.getResource("fish") < 35 && res.getResource("shark") < 3)) {
            SharkGame.persistentFlags.tooltipUnlocked = true;
        }
        return SharkGame.persistentFlags.tooltipUnlocked;
    },
};

SharkGame.Button = {
    makeHoverscriptButton(id, name, div, handler, hhandler, huhandler) {
        return $("<button>")
            .html(name)
            .attr("id", id)
            .addClass("hoverbutton")
            .appendTo(div)
            .on("click", handler)
            .on("mouseenter", hhandler)
            .on("mouseleave", huhandler);
    },

    makeButton(id, name, div, handler) {
        return $("<button>").html(name).attr("id", id).appendTo(div).on("click", handler);
    },
};

SharkGame.FunFacts = {
    dilutedResources: ["shark", "ray", "crab", "fish"], // dilute these while not in starter to keep the fun facts fresher

    showFact() {
        log.addMessage(this.getFact());
    },

    getFact() {
        const pool = this.getPool();
        return SharkGame.choose(pool);
    },

    getPool() {
        const pool = [];
        const currentWorld = world.worldType;
        if (
            this.worldBased[currentWorld] &&
            (!this.worldBased[currentWorld].areRequirementsMet || this.worldBased[currentWorld].areRequirementsMet())
        ) {
            _.each(this.worldBased[currentWorld].messages, (fact) => {
                pool.push(sharktext.boldString(`Fun fact: `) + `<i>${fact}</i>`);
            });
        }

        let anyAvailableResource = false;
        $.each(this.resourceBased, (resource, facts) => {
            // purposefully dilute some facts if we are not on the starter world
            // I want these facts to be more likely relevant than not
            if (world.doesResourceExist(resource) && res.getTotalResource(resource)) {
                anyAvailableResource = true;
                if (!this.dilutedResources.includes(resource) || currentWorld === "start" || Math.random() < 0.25) {
                    _.each(facts, (fact) => {
                        pool.push(
                            sharktext.boldString(
                                `${sharktext.getResourceName(
                                    resource,
                                    false,
                                    1,
                                    SharkGame.Log.isNextMessageEven()
                                        ? sharkcolor.getVariableColor("--color-dark")
                                        : sharkcolor.getVariableColor("--color-med")
                                )} fact: `
                            ) + `<i>${fact}</i>`
                        );
                    });
                }
            }
        });

        if (anyAvailableResource) {
            // only 10% chance to include the 'default' facts
            // this is because those facts are seen all over the place
            // they would end up diluting the world-specific and resource-specific facts
            //
            // also acts as a failsafe in case there are no other facts to display
            if (Math.random() < 0.1 || pool.length === 0) {
                _.each(this.default, (fact) => {
                    pool.push(sharktext.boldString(`Fun fact: `) + `<i>${fact}</i>`);
                });
            }
            return pool;
        } else {
            return ["Fun fact: <i>New fun facts are unlocked as you see new stuff. Keep playing to unlock some!</i>"];
        }
    },

    worldBased: {
        frigid: {},
        volcanic: {
            messages: [
                "This world was originally called Violent, now it's Volcanic. Playtesters got confused and thought the world had violence, when really, it just has the threat of violence.",
                "Hydrothermal vents do not spew fire in real life. They spew smoke.",
                "Hydrothermal vents support a diverse array of sea life due to their high output of minerals. Bacteria eat these minerals, starting a food chain.",
                "Hydrothermal vents are found at fault lines in the earth's crust, where water becomes superheated due to magma rising close to the ocean floor.",
            ],
            areRequirementsMet() {
                return SharkGame.Upgrades.purchased.includes("thermalVents");
            },
        },
        shrouded: {},
        abandoned: {
            messages: ["This world was the first one to be remade for New Frontiers."],
        },
        haven: {
            messages: ["Kelp paper is real. You cannot write on it though."],
            areRequirementsMet() {
                return SharkGame.Upgrades.purchased.includes("sunObservation");
            },
        },
        marine: {},
    },

    resourceBased: {
        // add fish facts at some point
        shark: [
            "There are many species of sharks that investigate things with their mouths. This can end badly for the subject of investigation.",
            "There have been social behaviours observed in lemon sharks, and evidence that suggests they prefer company to being alone.",
            "Some shark species display 'tonic immobility' when rubbed on the nose. They stop moving, appear deeply relaxed, and can stay this way for up to 15 minutes before swimming away.",
            "In some shark species eggs hatch within their mothers, and in some of these species the hatched babies eat unfertilised or even unhatched eggs.",
            "More people are killed by lightning every year than by sharks.",
            "White sharks have been observed to have a variety of body language signals to indicate submission and dominance towards each other without violence.",
            "A kiss from a shark can make you immortal. But only if they want you to be immortal.",
            "A shark is worth one in the bush, and a bunch in the sea water. Don't put sharks in bushes.",
            "Sharks are very old, evolutionarily speaking. The first sharks emerged some time around 400 million years ago.",
            "Sharks have very rough skin, like sandpaper. In fact, shark skin was literally used as sandpaper in the past.",
        ],
        crystal: ["Magic crystals are probably not real."],
        ray: [
            "Rays can be thought of as flattened sharks. The two are very closely related evolutionarily.",
            "Rays are pancakes of the sea. (note: probably not true)",
        ],
        crab: [
            "Throughout history, many species crustaceans have independently evovled into crabs for no discernable reason. The phenomenon is called carcinisation.",
            "Some species of crab exhibit a kind of claw asymmetry. Called the crusher and cutter, they have different shapes that give their claws more specialized purposes.",
        ],
        octopus: [
            "It's octopuses, not octopi.",
            "Octopuses are capable of extremely advanced camoflague. They can change color, pattern, and texture to match their surroundings, enough to easily fool anything, even humans.",
            "In novel circumstances, octopuses are capable of simple problem-solving. Some will step back and thoroughly analyze things when confused.",
            "Octopuses can get bored in captivity. They may fiddle with toys or interact with humans for entertainment.",
            "Octopuses have great dexterity. They can use their tentacles in a variety of ways to manipulate objects.",
            "Octopuses have no bones whatsoever.",
            "Each limb of an octopus is considered to individually have a brain to itself. They can be thought of as soldiers (little brains) being commanded by a general in the center (big brain).",
        ],
        dolphin: [
            "Dolphins are considered some of the most intelligent animal problem-solvers, next to monkeys, elephants and parrots as examples.",
            "Dolphins are not smug in real life. Probably. Maybe.",
            "Dolphins are creative and capable of handling abstract concepts. In captivity, they can be asked to try inventing new tricks, and will often succeed.",
            "Dolphins have been seen directly communicating with each other. In fact, it is believed that they hold full conversations with one another.",
        ],
        whale: [
            "The top 10 largest animal species are all whales.",
            "While some whales are active hunters, others are merely supersized filter feeders. This game's whales are of unspecified type.",
            "Whales are very social creatures. Most whales travel in small groups called pods, which might make up clans, and then communities. Some whales, however, are solitary.",
            "It is not completely understood why whales sing, but scientists agree it serves some kind of social purpose." /* Whales are observed to react to each other's songs and come to */,
        ],
        urchin: [
            "Sea urchins primarily eat kelp. A lot of kelp.",
            "Sea urchins have been observed to wear various items on top of themselves, such as rocks. If you give them little hats, they will wear those too. It is not agreed upon why they do this.",
            "Most sea urchins are not venomous.",
            "The spines on most sea urchins are not very sharp. You can hold many species urchins in your palm if you're careful.",
        ],
        squid: [
            "Squid eat crabs. They're not eating yours out of politeness.",
            "Giant squid are real. They live incredibly deep in the ocean.",
            "Squid have no bones whatsoever.",
            // Squid have camoflague look into it
        ],
        lobster: [
            "Lobsters really do eat clams. They instinctively know how to crack them open.",
            "Lobsters can live for an extremely long time. Rarely, some will live longer than humans.",
            "Lobsters have teeth in their stomach, not in their mouth, and they chew with those teeth, too.",
            "Lobsters have asymmetric claws. One of them, called the crusher, is used for...crushing. The other, called the pincer, is used for...pincing. Marine biologists were feeling creative, clearly.",
        ],
        shrimp: [
            "There are real eusocial shrimps that live in communities in sponges on reefs, complete with queens.",
            "Shrimp are close relatives of lobsters. They have a lot of similarities, and in some ways are just smaller, narrower lobsters.",
        ],
        eel: [
            // "Eels come in a wide range of sizes, from just a few inches to multiple meters.",
        ],
        chimaera: [
            "Chimaera are closely related to sharks and rays.",
            "Chimaera are deep-sea animals, usually found more than 500 meters (~1500 feet) below the surface of the ocean.",
            "Chimaera have a venomous spine in front of their dorsal fin.",
            "Chimaera are not purple, they are completely pale, because deep-sea animals like chimaera have no reason to invest in any kind of colors, it's just too dark to care.",
        ],
        seaApple: [
            "Sea apples are a type of sea cucumber. They feed on debris and detritus.",
            "Sea apples are in no way actually attracted to kelp. It's just a convenient mechanic.",
        ],
        jellyfish: [
            // "Sharks would definitely not have a way of acquiring most kinds of jellyfish in real life.",
            "Jellyfish can be extremely dangerous. Some kinds of box jellyfish have fatal stings.",
            // do more research into jellies
        ],
        sharkonium: ["There is nothing suspicious about the machines."],
        porite: [
            "The idea for porite comes from the structure of bones, which have spongey insides that reduce their weight while retaining their strength.",
        ],
        calcinium: ["Calcinium was inspired by the appearance and texture of limestone."],
        laser: ["Sharks with lasers were overdone, okay? At least 'laser ray' is a pun."],
        coral: [
            "Some coral can actually catch small fish.",
            "Coral is not a plant, it is an animal. A weird, stationary animal.",
            "Coral are primarily carnivores. They eat plankton (teeny tiny things that can't swim), grabbing them with little tentacles and pulling them into their mouths.",
            "Many kinds of coral have a mutualistic relationship with certain species of alage, who produce nutrients in exchange for carbon dioxide and shelter.",
        ],
        sponge: [
            "Sponges are incredibly distinct from all other animals. They are asymmetric, have no organs, and their cells can change specialization at will, which is true for no other animal.",
            "Sponges are incredibly, incredibly old, evolutionarily speaking. They probably date back at least 600 million years.",
            "Sponge is not a plant, it is an animal. A weird, amorphous animal.",
            "The pores in sponges are designed to help them filter water for food at maximum efficiency.",
            "Many species of sponge have a mualistic realitionship with certain species of algae. The algaes use photosynthesis to produce food for the sponges.",
        ],
        algae: [
            "Algae comes in many different shapes, sizes, and forms, like 'valonia ventricosa,' a species where every individual cell can grow larger than a grape. Look it up, it's insane.",
            "Algae is neither plant nor animal. It is something else entirely (a protist?).",
            "Kelp is a kind of algae. In fact, all seaweed is algae. The sea is mostly just advanced algae and a bunch of animals, with very few actual plants.",
        ],
        kelp: ["Kelp is not a plant. It's a kind of algae, and algae isn't a plant, so kelp isn't a plant."],
        arcana: ["Arcane, super-charged energy crystals are definitely not real."],
        ice: ["In the original shark game, ice used to eat away your resources instead of slowing their production."],
        tar: ["In the original shark game, tar was gained passively. Machines produced basically none."],
    },

    default: [
        "Shark Game's initial bare minimum code came from an abandoned idle game about bees. Almost no trace of bees remains!",
        "The existence of resources that create resources that create resources in this game were inspired by Derivative Clicker!",
        "Kitten Game was an inspiration for this game! This surprises probably no one. The very first message the game gives you is a nod of sorts.",
        "There is a surprising deficit of cookie in this game.",
        "Remoras were banished from the oceans in the long bygone eras. The sharks hope they never come back.",
        "Fun facts will only talk about things you have already seen in-game.",
        "Fun facts have always been in the game's code, but have never been exposed until this system for displaying them was added.",
        "New Frontiers, this Shark Game mod, was inspired by the unfolding nature of the Candy Box games and A Dark Room.",
        "Any timewalls in this game can be completely bypassed with good strategy.",
        "This game has keybinds. They are more useful than you might think. Check the options menu.",
    ],
};

SharkGame.Changelog = {
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20220712a": [
        "Time in the minute hand can now persist between worlds, with a few caveats.",
        "Added 3 new aspects that complement the changes to minute hand time.",
        "Changed the pricing and location of aspects on the tree.",
        "Disabling idle time accruing in the minute hand no longer completely removes it from the UI.",
        "Added a choice to use SI units.",
        "Fixed a bug where tooltips would persist when changing tabs via hotkey.",
        "Fixed a bug where the game throws errors when trying to disable buttons while paused.",
        "Greatly improved aspect tree on touchscreen devices.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20220630a": [
        "Added a setting to disable idle time from the pause button.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20220629a": [
        "Fixed a bug with a certain sponge button not appearing.",
        "Fixed a bug with pressing buttons that don't exist anymore.",
        "Updated the pause button, which now activates idle mode at will.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20220625a": [
        "Added Volcanic worldtype.",
        "Added FUN FACTS! Press to receive a random fun fact! You get different ones based on where you are and what you own!",
        "World-time doesn't increase when you are offline or idle. That time is added only if you use it through the minute hand (time from the hour hand aspect is excluded).",
        "Stuff table tooltips now show how a resource slows or speeds up others.",
        "Began adding placeholder art to temporarily supplement actually completed art.",
        "Removed alpha notice.",
        "Added a link to the hub on the titlebar.",
        "New credits (see bottom of page).",
        "Fixed a bunch of miscellaneous bugs.",
        "Did other assorted tasks.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> patch 20220603a": [
        "Added Marine worldtype.",
        "Planet descriptions are now much more vague until you've visited them.",
        "Distant Foresight greatly decreases vagueness of planet descriptions now.",
        "Swapped the order of some aspects on the tree.",
        "Revised the ending of the Abandoned world.",
        "Revised bits of the Shrouded world's story.",
        "Abandoned world gives one bonus essence, bumping its scouting reward to 5 and non-scouting reward to 3.",
        "By popular demand, added auto-transmuter to Shrouded.",
        "Fixed some miscellaneous bugs.",
        "Ixbix - tweaked text visibility system",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20220125a": [
        "Added keybinds. You can now bind a large array of actions to different key combinations.",
        "Added backup saves. You can now back up your saves as you wish, with three slots!",
        "Added real species/family names when recruiting urchins and squid, instead of weird placeholder messages.",
        "When first unlocking cheats at 1000 lifetime essence, a special backup is automatically created.",
        "Added toggle for cheats; you don't have to see them if you don't want to.",
        "Made some more UI changes.",
        "Removed aspect: Anything and Everything",
        "Ixbix - fixed issues with gateway time spent in last world",
        "Ixbix - stopped minute hand slider from flopping around",
        "Ixbix - added touchscreen support for the aspect tree",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20211201a": [
        "Added something special at 1000 total essence.",
        "Changed the aspect tree UI to remove unnecessary buttons from below the tree.",
        "Fixed some bugs related to the patience and gumption aspects.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20211109a": [
        "Final revamp of the aspect tree. Not the final addition to it, though.",
        "Added idle mode. The game will pause and accumulate idle time after 2 minutes of inactivity.",
        "The minute hand now stores offline progress and idle time. You can use your stored time in the form of a multiplier.",
        "Removed the playstyle choice because the new idle system does its job better.",
        "Implemented scouting. You get more essence when you first play a world, but SOME aspects can't be used.",
        "Implemented par times. If you beat a world faster than par, you get extra essence. Go even faster for even more.",
        "Added and changed sprites.",
        "Updated UI.",
        "Fixed some out-of-place flavor text.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210814a": [
        "Added Shrouded worldtype.",
        "Retooled Haven worldtype.",
        "Changed the aspect tree and its aspects significantly. All aspects must be refunded because of this. Sorry!",
        "Implemented a basic 'playstyle' choice. The game will adjust pacing to suit your choice.",
        "Improved resource table tooltips.",
        "You can now access the options menu in the gateway. (this took a surprising amount of work)",
        "'Wipe Save' now doesn't reset any settings. Added a separate button to reset settings.",
        "Added sprites.",
        "Greatly improved game stability when dealing with large numbers (above a quadrillion).",
        "Fixed bugs with save wiping and resetting.",
        "Fixed bugs with grotto.",
        "Fixed bugs with tooltips in the aspect tree.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210728a": [
        "The log can now be in one of 3 spots. Change which one in options. Default is now right side.",
        "Added Resource Affect tooltips; mouse over the multipliers in the R column in the advanced grotto table and you can see what is causing them.",
        "Added work-in-progress (but functional) aspect table as an alternative to the tree, specifically for accessibility.",
        "Added extraction team sprite.",
        "Added historian sprite; decided to repurpose the old philosopher sprite from OG shark game.",
        "Updated tooltip formatting.",
        "Updated Recycler UI to eliminate quirkiness.",
        "Fixed a bug where costs disappear in no-icons mode.",
        "Fixed incorrect description of an aspect.",
        "Fixed bugs with importing saves.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210713a": [
        "Tooltips show you how much you already own of what you're buying. Can be turned off in options.",
        "Tooltips have their numbers scale based on how much of something you're buying. Can be turned off in options.",
        "The key for advanced mode grotto has been enhanced.",
        "Tabs you haven't visited yet will glow. This is on a per-world basis.",
        "Gave scroll bars to some stuff.",
        "Changed the order of categories in the resource table to make more sense.",
        "You can close windows by clicking outside of them.",
        "Options menu is less wordy.",
        "Corrected a bunch of upgrade effect descriptions.",
        "Minor bugfixes.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210709a": [
        "Added the Frigid worldtype.",
        "Replaced the Artifacts system with the Aspects system.",
        "Tweaked Haven.",
        "Tweaked UI colors.",
        "Grotto now shows how the world affects resources.",
        "Moved UI elements around to make the game not freak out on smaller screens.",
        "Moved buy amount buttons closer to the places you'll need them, they're not in the tab list anymore!",
        "Added 'bright' text color mode, screws up some colors but makes colored text easier to read.",
        "Added auto color-visibility adjuster. Tries to change the color of text if it would be hard to read on a certain background.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210610a": [
        "Fixed bug where haven had no essence. Oops.",
        "Changed home messages a little.",
        "Retconned some previous patch notes.",
        "Added sprite for octopus investigator.",
        "Internal stuff.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210515a": ["Added missing flavor text.", "Internal stuff."],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210422a": [
        "Implemented reworked gameplay for the Haven worldtype.",
        "Made sweeping changes to the UI.",
        "Improved grotto formatting.",
        "Changed the colors for Haven worlds.",
        "In the grotto, amounts for each producer now update live.",
        "Both kinds of tooltips update live.",
        "Tooltips can tell you more things: for example, it now says how much science you get from sea apples.",
        "Added minimized titlebar. You can switch it back to the old one in the options menu.",
        "Added categories to options menu. Now it's readable!",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210314a": [
        "Fixed bug related to how artifacts display in the grotto.",
        "Fixed bug related to artifact affects not applying properly.",
        "Fixed bug where the grotto would show an upgrade multiplier for everything, even if it was x1.",
        "Fixed bug where artifact effects would not reset when importing.",
        "Added 'INCOME PER' statistic to Simple grotto. Shows absolutely how much of a resource you get per generator.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 patch 20210312a": [
        "Added simplified grotto.",
        "Made grotto way easier to understand.",
        "Added tooltips to income table.",
        "Did internal rework of the multiplier system, created the modifier system.",
    ],
    "<a href='https://github.com/Toby222/SharkGame'>New Frontiers</a> 0.2 - New Perspectives (2021/??/??)": [
        "Scrapped Chaotic worldtype. Completely.",
        "Implemented gameplay for 1 out of 7 necessary planet reworks.",
        "Implemented new assets.",
    ],
    "<a href='https://github.com/spencers145/SharkGame'>New Frontiers</a> 0.11 - New Foundations (2021/1/27)": [
        "New, greatly improved UI for everything.",
        "Rebalanced stuff.",
        "Added world themes, so the page now changes color depending on what world you're in.",
        "Added a TPS/FPS setting, to make the game smoother and nicer to look at, or chunkier and easier on performance.",
        "Custom purchase amounts.",
        "Added a 'grace period'. Ice doesn't build up if you have no income for anything.",
        "Artifact descriptions and distant foresight planet properties are useful.",
        "See 5 artifact choices instead of 3. On that note, buffed base essence to 4 per world.",
    ],
    "<a href='https://github.com/spencers145/SharkGame'>New Frontiers</a> 0.1 - New is Old (2021/1/7)": [
        "22 NEW SPRITES! More are coming but we couldn't finish all the sprites in time!",
        "TRUE OFFLINE PROGRESS! Days are compressed to mere seconds with RK4 calculation.",
        "Attempted to rebalance worlds, especially frigid and abandoned, by making hazardous materials more threatening and meaningful.",
        "Halved the effectiveness of the 3 basic shark machines (except sand digger, which is 2/3 as productive), but added a new upgrade to counterbalance it.",
        "Added recycler efficiency system. The more you recycle at once, the more you lose in the process. Added an upgrade which makes the mechanic less harsh.",
        "Added new UI elements to the Recycler to make it less of a guessing game and more of a cost-benefit analysis.",
        "Increased the effectiveness of many machines.",
        "Greatly improved number formatting.",
        "World shaper has been disabled because it will probably break plans for future game balance.",
        "Distant foresight now has a max level of 5, and reveals 20% of world properties per level, up to 100% at level 5.",
        "Fixed exploits, bugs, and buggy exploits and exploitable bugs. No more crystals -> clams & sponges -> science & clams -> crystals loop.",
        "No more science from sponges.",
        "Removed jellyfish from a bunch of worlds where the resource was a dead end.",
    ],
    "0.71 (2014/12/20)": [
        "Fixed and introduced and fixed a whole bunch of horrible game breaking bugs. If your save was lost, I'm sorry.",
        "Made the recycler stop lying about what could be made.",
        "Made the recycler not pay out so much for animals.",
        "Options are no longer reset after completing a run for real this time.",
        "Bunch of tweaked gate costs.",
        "One new machine, and one new job.",
        "Ten new post-chasm-exploration technologies to invest copious amounts of science into.",
    ],
    "0.7 - Stranger Oceans (2014/12/19)": [
        "WHOLE BUNCH OF NEW STUFF ADDED.",
        "Resource system slightly restructured for something in the future.",
        "New worlds with some slight changes to availabilities, gate demands, and some other stuff.",
        "Categories added to Home Sea tab for the benefit of trying to make sense of all the buttons.",
        "Newly added actions show up in highlights for your convenience.",
        "The way progress continues beyond the gate is now... a little tweaked.",
        "Options are no longer reset after completing a run.",
        "Artifacts exist.",
        "Images are a work in progress. Apologies for the placeholder graphics in these trying times.",
        "Partial production when there's insufficient resources for things that take costs. Enjoy watching your incomes slow to a trickle!",
    ],
    "0.62 (2014/12/12)": [
        "Fixed infinity resource requirement for gate.",
        "Attempted to fix resource table breaking in some browsers for some sidebar widths.",
    ],
    "0.61 (2014/12/12)": [
        "Added categories for buttons in the home sea, because there are going to be so many buttons.",
        "Miscellaneous shuffling of files.",
        "Some groundwork laid for v0.7, which will be the actual official release.",
    ],
    "0.6 - Return of Shark (2014/12/8)": [
        "Major graphical update!",
        "Now features graphics sort of!",
        "Some UI rearrangements:" +
            "<ul><li>Researched techs now show in lab instead of grotto.</li>" +
            "<li>General stats now on right of grotto instead of left.</li>" +
            "<li>Large empty space in grotto right column reserved for future use!</li></ul>",
        "Pointless version subtitle!",
        "<span class='medDesc'>Added a donate link. Hey, sharks gotta eat.</span>",
    ],
    "0.59 (2014/09/30)": [
        "Bunch of small fixes and tweaks!",
        "End of run time now shown at the end of a run.",
        "A couple of fixes for issues only found in IE11.",
        "Fixed a bug that could let people buy hundreds of things for cheap by overwhelming the game's capacity for input. Hopefully fixed, anyway.",
        "Gaudy social media share menu shoehorned in below the game title. Enjoy!",
    ],
    "0.531 (2014/08/20)": [
        "Banned sea apples from the recycler because the feedback loop is actually far more crazy powerful than I was expecting. Whoops!",
    ],
    "0.53 (2014/08/18)": ["Changed Recycler so that residue into new machines is linear, but into new resources is constant."],
    "0.52 (2014/08/18)": [
        "Emergency bug-fixes.",
        "Cost to assemble residue into new things is now LINEAR (gets more expensive as you have more things) instead of CONSTANT.",
    ],
    "0.51 (2014/08/18)": [
        "Edited the wording of import/export saving.",
        "Made machine recycling less HORRIBLY BROKEN in terms of how much a machine is worth.",
    ],
    "0.5 (2014/08/18)": [
        "Added the Grotto - a way to better understand what you've accomplished so far.",
        "Added the Recycler. Enjoy discovering its function!",
        "Added sand machines for more machine sand goodness.",
        "Fixed oscillation/flickering of resources when at zero with anything providing a negative income.",
        "Added 'support' for people stumbling across the page with scripts turned off.",
        "Upped the gate kelp requirement by 10x, due to request.",
        "Added time tracking. Enjoy seeing how much of your life you've invested in this game.",
        "Added grouping for displaying resources on the left.",
        "Added some help and action descriptions.",
        "Added some text to the home tab to let people have an idea of where they should be heading in the very early game.",
        "Thanks to assistance from others, the saves are now much, much smaller than before.",
        "Made crab broods less ridiculously explosive.",
        "Adjusted some resource colours.",
        "Added a favicon, probably.",
        "<span class='medDesc'>Added an overdue copyright notice I guess.</span>",
    ],
    "0.48 (2014/08-ish)": [
        "Saves are now compressed both in local storage and in exported strings.",
        "Big costs significantly reduced.",
        "Buy 10, Buy 1/3 max and Buy 1/2 max buttons added.",
        "Research impact now displayed on research buttons.",
        "Resource effectiveness multipliers now displayed in table." +
            "<ul><li>These are not multipliers for how much of that resource you are getting.</li></ul>",
        "Some dumb behind the scenes things to make the code look nicer.",
        "Added this changelog!",
        "Removed upgrades list on the left. It'll come back in a future version.",
        "Added ray and crab generating resources, and unlocking techs.",
    ],
    "0.47 (2014/08-ish)": ["Bulk of game content added.", "Last update for Seamergency 2014!"],
    "0.4 (2014/08-ish)": ["Added Laboratory tab.", "Added the end of the game tab."],
    "0.3 (2014/08-ish)": ["Added description to options.", "Added save import/export.", "Added the ending panel."],
    "0.23 (2014/08-ish)": ["Added autosave.", "Income system overhauled.", "Added options panel."],
    "0.22 (2014/08-ish)": [
        "Offline mode added. Resources will increase even with the game off!",
        "(Resource income not guaranteed to be 100% accurate.)",
    ],
    "0.21 (2014/08-ish)": ["Save and load added."],
    "<0.21 (2014/08-ish)": ["A whole bunch of stuff.", "Resource table, log, initial buttons, the works."],
};

$(() => {
    $("#game").show();
    main.init();
});
