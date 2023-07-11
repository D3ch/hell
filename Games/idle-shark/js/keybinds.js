SharkGame.Keybinds = {
    defaultBinds: {
        Period: "bind home ocean button",
        P: "pause",
        A: "press all buying buttons",
        L: "buy topmost upgrade",
        R: "return all tokens",
        "Shift + 1": "switch to home tab",
        "Shift + 2": "switch to lab tab",
        "Shift + 3": "switch to grotto tab",
        "Shift + 4": "switch to recycler tab",
        "Shift + 5": "switch to gate tab",
        "Shift + 6": "switch to reflection tab",
        "Shift + Z": "switch to buy 1",
        "Shift + X": "switch to buy 10",
        "Shift + C": "switch to buy 100",
        "Shift + V": "switch to buy 1/3 max",
        "Shift + B": "switch to buy 1/2 max",
        "Shift + N": "switch to buy max",
        "Shift + M": "switch to buy custom",
        "Control + O": "open options",
        "Control + S": "save",
    },
    keybinds: {},

    actions: [
        `nothing`,
        `bind home ocean button`,
        `press all buying buttons`,
        `buy topmost upgrade`,
        `return all tokens`,
        `toggle idle time use`,
        `pause`,
        `save`,
        `skip world`,
        `enter gate`,
        `open options`,
        `switch to home tab`,
        `switch to lab tab`,
        `switch to grotto tab`,
        `switch to recycler tab`,
        `switch to gate tab`,
        `switch to reflection tab`,
        `switch home button tab left`,
        `switch home button tab right`,
        `switch to buy 1`,
        `switch to buy 10`,
        `switch to buy 100`,
        `switch to buy 1/3 max`,
        `switch to buy 1/2 max`,
        `switch to buy max`,
        `switch to buy custom`,
    ],

    modifierKeys: {
        ShiftLeft: 0,
        ShiftRight: 0,
        AltLeft: 0,
        AltRight: 0,
        ControlLeft: 0,
        ControlRight: 0,
    },

    init() {
        if ($.isEmptyObject(this.keybinds)) {
            this.resetKeybindsToDefault();
        }
        this.bindMode = false;
        this.bindModeLock = false;
        this.waitForKey = false;
        this.settingAction = undefined;
        this.settingKey = undefined;
    },

    setup() {},

    resetKeybindsToDefault() {
        this.keybinds = _.cloneDeep(this.defaultBinds);
    },

    compressKeyID(keyID) {
        keyID = keyID.replace(/ /gi, ``).replace(`+`, `-`);
        return keyID;
    },

    cleanActionID(actionID) {
        if (!this.actions.includes(actionID)) {
            if (SharkGame.HomeActions.getActionTable()[actionID]) {
                // see if this action happens to have a name in this world
                actionID = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionID).name;
            } else {
                // perform a manual search to find the name of this action
                _.each(SharkGame.HomeActions, (homeActionsObject) => {
                    if (typeof homeActionsObject === "object" && homeActionsObject[actionID]) {
                        actionID = homeActionsObject[actionID].name;
                        return false;
                    }
                });
            }
        }

        return actionID;
    },

    // makes IDs human-readable
    cleanID(keyID) {
        keyID = keyID
            .replace(`Digit`, ``)
            .replace(`Key`, ``)
            .replace(`CapsLock`, `Caps Lock`)
            .replace(`NumLock`, `Num Lock`)
            .replace(`ScrollLock`, `Scroll Lock`)
            .replace(`ContextMenu`, `Context Menu`);
        _.each([`Left`, `Right`, `Up`, `Down`, `Numpad`], (direction) => {
            if (keyID.includes(direction)) {
                keyID = `${direction} ` + keyID.replace(direction, ``);
            }
        });
        keyID = keyID.replace(`Up Page`, `Page Up`).replace(`Down Page`, `Page Down`);
        return keyID;
    },

    composeKeys(keyID) {
        _.each(["Shift", "Alt", "Control"], (modifier) => {
            if (keyID.includes(modifier)) return;
            if (this.modifierKeys[modifier + "Left"] || this.modifierKeys[modifier + "Right"]) {
                keyID = modifier + " + " + keyID;
            }
        });

        return keyID;
    },

    handleKeyUp(keyID) {
        const modifiersEntry = this.modifierKeys[keyID];
        if (!_.isUndefined(modifiersEntry)) {
            this.modifierKeys[keyID] = 0;
        }

        keyID = this.cleanID(keyID);
        keyID = this.composeKeys(keyID);

        const boundAction = this.keybinds[keyID];
        if (this.bindMode && boundAction !== "bind home ocean button") {
            if (_.isUndefined(modifiersEntry)) {
                this.settingKey = keyID;
                this.updateBindModeState();
            }
        } else if (boundAction) {
            return this.handleUpBind(boundAction);
        }
    },

    handleKeyDown(keyID) {
        const modifiersEntry = this.modifierKeys[keyID];
        const isModifier = !_.isUndefined(modifiersEntry);
        if (isModifier) {
            this.modifierKeys[keyID] = 1;
        }

        keyID = this.cleanID(keyID);
        keyID = this.composeKeys(keyID);

        const boundAction = this.keybinds[keyID];
        if (this.bindMode && boundAction !== "bind home ocean button") {
            if (!isModifier) {
                this.settingKey = keyID;
                this.updateBindModeState();
            }
        } else if (this.waitForKey && !boundAction && !$.isEmptyObject($(`#new-bind-button`)) && !isModifier) {
            this.bindMenuNewBind(keyID);
            return true;
        } else if (boundAction) {
            return this.handleDownBind(boundAction);
        }
    },

    handleUpBind(actionType) {
        if (!this.tempDisableBind) {
            switch (actionType) {
                default:
                    if (
                        SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionType) &&
                        $(`#${actionType}`).hasClass(`keep-button-pressed`)
                    ) {
                        $(`#${actionType}`).removeClass(`keep-button-pressed`);
                        home.onHomeButton(null, actionType);
                    } else {
                        return false;
                    }
            }
            return true;
        }
    },

    handleDownBind(actionType) {
        // make sure to remember to search all homeaction worlds in order when
        // looking for the data associated with it
        if (!this.tempDisableBind && actionType) {
            switch (actionType) {
                case "test":
                    break;
                case "open bind menu":
                    // do nothing for now
                    // TODO: Implement this, I suppose
                    break;
                case "bind home ocean button":
                    if (!this.bindModeLock) {
                        this.toggleBindMode(true);
                    }
                    break;
                case "pause":
                    if (SharkGame.Aspects.meditation.level && !SharkGame.gameOver) {
                        res.pause.togglePause();
                    }
                    break;
                case "switch to home tab":
                    SharkGame.TabHandler.keybindSwitchTab("home");
                    break;
                case "switch to lab tab":
                    SharkGame.TabHandler.keybindSwitchTab("lab");
                    break;
                case "switch to grotto tab":
                    SharkGame.TabHandler.keybindSwitchTab("stats");
                    break;
                case "switch to recycler tab":
                    SharkGame.TabHandler.keybindSwitchTab("recycler");
                    break;
                case "switch to gate tab":
                    SharkGame.TabHandler.keybindSwitchTab("gate");
                    break;
                case "switch to reflection tab":
                    SharkGame.TabHandler.keybindSwitchTab("reflection");
                    break;
                case `switch home button tab left`:
                    if (SharkGame.Tabs.current === `home`) {
                        home.changeButtonTab(home.getPreviousButtonTab());
                    }
                    break;
                case `switch home button tab right`:
                    if (SharkGame.Tabs.current === `home`) {
                        home.changeButtonTab(home.getNextButtonTab());
                    }
                    break;
                case "switch to buy 1":
                    if (!$("#buy-1").hasClass("disabled")) {
                        SharkGame.Settings.current.buyAmount = 1;
                        $("#custom-input").attr("disabled", true);
                        $("button[id^='buy-']").removeClass("disabled");
                        $("#buy-1").addClass("disabled");
                    }
                    break;
                case "switch to buy 10":
                    if (!$("#buy-10").hasClass("disabled")) {
                        SharkGame.Settings.current.buyAmount = 10;
                        $("#custom-input").attr("disabled", true);
                        $("button[id^='buy-']").removeClass("disabled");
                        $("#buy-10").addClass("disabled");
                    }
                    break;
                case "switch to buy 100":
                    if (!$("#buy-100").hasClass("disabled")) {
                        SharkGame.Settings.current.buyAmount = 100;
                        $("#custom-input").attr("disabled", true);
                        $("button[id^='buy-']").removeClass("disabled");
                        $("#buy-100").addClass("disabled");
                    }
                    break;
                case "switch to buy 1/3 max":
                    if (!$("#buy--3").hasClass("disabled")) {
                        SharkGame.Settings.current.buyAmount = -3;
                        $("#custom-input").attr("disabled", true);
                        $("button[id^='buy-']").removeClass("disabled");
                        $("#buy--3").addClass("disabled");
                    }
                    break;
                case "switch to buy 1/2 max":
                    if (!$("#buy--2").hasClass("disabled")) {
                        SharkGame.Settings.current.buyAmount = -2;
                        $("#custom-input").attr("disabled", true);
                        $("button[id^='buy-']").removeClass("disabled");
                        $("#buy--2").addClass("disabled");
                    }
                    break;
                case "switch to buy max":
                    if (!$("#buy--1").hasClass("disabled")) {
                        SharkGame.Settings.current.buyAmount = -1;
                        $("#custom-input").attr("disabled", true);
                        $("button[id^='buy-']").removeClass("disabled");
                        $("#buy--1").addClass("disabled");
                    }
                    break;
                case "switch to buy custom":
                    if (!$("#buy-custom").hasClass("disabled")) {
                        SharkGame.Settings.current.buyAmount = `custom`;
                        $("#custom-input").attr("disabled", false);
                        $("button[id^='buy-']").removeClass("disabled");
                        $("#buy-custom").addClass("disabled");
                    }
                    break;
                case "open options":
                    if (!SharkGame.PaneHandler.isPaneAlreadyUp(`Options`)) {
                        SharkGame.PaneHandler.showOptions();
                    }
                    break;
                case "save":
                    SharkGame.Save.saveGame();
                    SharkGame.Log.addMessage(`Saved game.`);
                    break;
                case "skip world":
                    if (!SharkGame.gameOver) {
                        SharkGame.TitleBar.skipLink.onClick();
                    }
                    break;
                case `toggle idle time use`:
                    if (SharkGame.persistentFlags.everIdled && !SharkGame.gameOver) {
                        res.minuteHand.toggleMinuteHand();
                    }
                    break;
                case `return all tokens`:
                    _.each(res.tokens.list, (token) => {
                        res.tokens.tryReturnToken(null, false, token);
                    });
                    break;
                case `buy topmost upgrade`:
                    if (!cad.pause && !cad.stop) {
                        SharkGame.Lab.onLabButton(SharkGame.Lab.findAllAffordableUpgrades()[0]);
                    }
                    break;
                case `press all buying buttons`:
                    if (!SharkGame.flags.pressedAllButtonsThisTick) {
                        _.each(home.buttonNamesList, (actionName, actionData) => {
                            // actionData gets immediately overwritten because
                            // linter will yell at me if i define a variable in the switch statement
                            // and this is a decent workaround
                            actionData = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName);
                            if (!home.doesButtonGiveNegativeThing(actionData) && home.shouldHomeButtonBeUsable(actionData) && !actionData.isRemoved) {
                                home.onHomeButton(null, actionName);
                            }
                        });
                        SharkGame.flags.pressedAllButtonsThisTick = true;
                    }
                    break;
                case `enter gate`:
                    if (SharkGame.Gate.shouldBeOpen()) {
                        SharkGame.Gate.enterGate();
                    }
                    break;
                default:
                    if (SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionType)) {
                        $(`#${actionType}`).addClass(`keep-button-pressed`);
                    } else {
                        return false;
                    }
            }
            return true;
        }
        return false;
    },

    addKeybind(keyID, actionType) {
        this.keybinds[keyID] = actionType;
    },

    bindMenuNewBind(keyID) {
        this.waitForKey = false;
        this.addKeybind(keyID, `nothing`);
        // just remake the whole pane
        SharkGame.PaneHandler.nextPaneInStack();
        SharkGame.PaneHandler.showKeybinds();
    },

    updateBindModeOverlay(toggledByKey) {
        if (this.bindMode) {
            if (!SharkGame.OverlayHandler.isOverlayShown()) {
                SharkGame.OverlayHandler.revealOverlay(250, 0.8);
            }

            $(`#buttonList`).children().addClass("front");

            const textConatiner = $(`<div>`).attr(`id`, `keybind-overlay-container`);
            textConatiner.css(`width`, SharkGame.Settings.current.sidebarWidth);

            $(`#overlay`).empty();

            textConatiner.append($(`<h1>`).html("ACTION BIND MODE"));
            if (_.isUndefined(this.settingAction) && _.isUndefined(this.settingKey)) {
                textConatiner.append($(`<p>`).html(`<strong>Click the button you want to bind, then press a key to bind it to.</strong>`));
            } else if (!_.isUndefined(this.settingAction) && _.isUndefined(this.settingKey)) {
                textConatiner.append($(`<p>`).html(`<strong>Press a key to bind to ${this.cleanActionID(this.settingAction)}.</strong>`));
            } else if (_.isUndefined(this.settingAction) && !_.isUndefined(this.settingKey)) {
                textConatiner.append($(`<p>`).html(`<strong>Click a button to bind to ${this.settingKey}.</strong>`));
            } else {
                textConatiner.append($(`<p>`).html(`<strong>Bound ${this.settingKey} to ${this.cleanActionID(this.settingAction)}.</strong>`));
            }

            $(`#overlay`).append(textConatiner);
            $(`#overlay`)
                .on(`click`, () => {
                    this.toggleBindMode(true);
                })
                .css(`cursor`, `pointer`);
        } else {
            $(`#overlay`).css(`cursor`, ``);
            this.bindModeLock = true;
            if (toggledByKey) {
                SharkGame.OverlayHandler.hideOverlay(250, () => {
                    $(`#buttonList`).children().removeClass("front");
                    $(`#overlay`).empty();
                    $(`#overlay`).off("click");
                    this.bindModeLock = false;
                });
            } else {
                setTimeout(() => {
                    SharkGame.OverlayHandler.hideOverlay(250, () => {
                        $(`#buttonList`).children().removeClass("front");
                        $(`#overlay`).empty();
                        $(`#overlay`).off("click");
                        this.bindModeLock = false;
                    });
                }, 1000);
            }
        }
    },

    updateBindModeState(toggledByKey) {
        this.updateBindModeOverlay(toggledByKey);
        if (this.checkForBindModeCombo()) {
            this.addKeybind(this.composeKeys(this.settingKey), this.settingAction);
            this.toggleBindMode();
        }
    },

    checkForBindModeCombo() {
        return this.settingAction && this.settingKey;
    },

    toggleBindMode(toggledByKey) {
        // toggle bind mode:
        // first, settingaction and settingkey to undefined
        // then toggle the bindmode property in sharkgame.keybinds
        // then, if it was just turned on, pop up an overlay window if not in the gate
        // (make sure to turn off overlay in keybinds init)
        // if it was just turned off, remove the overlay
        //
        // on key up don't accept input from the bind mode toggle key
        // on keydown test to see if its the bindmode key and turn off bindmode if it is
        // on keydown test to see if it's not a modifier key
        // if it's not a modifier key, set the overlay to display the key on it,
        // and set the settingkey property in sharkgame.keybinds
        // then test to see if we have a settingaction
        // if we do, bind it and toggle bind mode
        //
        // on home button press, check for bindmode
        // if bindmode, set settingaction, update the overlay, and run checkForCombo

        this.settingKey = undefined;
        this.settingAction = undefined;

        if (SharkGame.PaneHandler.isStackClosable() && SharkGame.Tabs.current === `home`) {
            if (this.bindMode) {
                this.bindMode = false;
            } else {
                this.bindMode = true;
                SharkGame.PaneHandler.tryWipeStack();
            }

            this.updateBindModeState(toggledByKey);
        }
    },
};
