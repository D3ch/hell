"use strict";
SharkGame.Gate = {
    tabId: "gate",
    tabDiscovered: false,
    tabSeen: false,
    tabName: "Strange Gate",
    tabBg: "img/bg/bg-gate.png",

    discoverReq: {
        upgrade: ["gateDiscovery", "farAbandonedExploration", "farHavenExploration", "rapidRecharging", "arcaneCompass", "apologeticAmnesty"],
    },

    message: "A foreboding circular structure, closed shut.<br/>There are many slots, and a sign you know to mean 'insert items here'.",
    messageOneSlot: "A foreboding circular structure, closed shut.<br/>One slot remains.",
    messageOpened: "A foreboding circular structure, wide open.<br/>The water glows and shimmers within it. A gentle tug pulls at you.",
    messagePaid: "The slot accepts your donation and ceases to be.",
    messageCantPay: "The slot spits everything back out. You get the sense it wants more at once.",
    messagePaidNotOpen:
        "For some reason, every slot is already filled. The structure doesn't open, though.<br/><strong>Perhaps it needs something else.</strong>",
    messageAllPaid: "The last slot closes. The structure opens. The water glows and shimmers within it.<br/>A gentle tug pulls at you.",
    messageEnter: "You swim through the gate...",

    sceneClosedImage: "img/events/misc/scene-gate-closed.png",
    sceneAlmostOpenImage: "img/events/misc/scene-gate-one-slot.png",
    sceneOpenImage: "img/events/misc/scene-gate-open.png",
    sceneClosedButFilledImage: "img/events/misc/scene-gate-closed-but-filled.png",

    requirements: {},
    completedRequirements: {},

    init() {
        // register tab
        SharkGame.TabHandler.registerTab(this);
        SharkGame.Gate.opened = false;
        // redundant reset of gate requirements
        SharkGame.Gate.resetSlots();
    },

    setup() {
        /* doesnt need to do anything */
    },

    resetSlots() {
        SharkGame.Gate.requirements = {};
        SharkGame.Gate.completedRequirements = {};
    },

    createSlots(gateRequirements, gateCostMultiplier) {
        const gate = SharkGame.Gate;
        const req = gate.requirements;
        const creq = gate.completedRequirements;

        if (gateRequirements.slots) {
            req.slots = {};
            sharkmisc.tryAddProperty(creq, `slots`, {});
            $.each(gateRequirements.slots, (resourceId, requiredAmount) => {
                req.slots[resourceId] = Math.floor(requiredAmount * gateCostMultiplier);
                sharkmisc.tryAddProperty(creq.slots, resourceId, false);
            });
        }

        if (gateRequirements.upgrades) {
            req.upgrades = [];
            sharkmisc.tryAddProperty(creq, `upgrades`, {});
            $.each(gateRequirements.upgrades, (_index, upgradeId) => {
                req.upgrades.push(upgradeId);
                sharkmisc.tryAddProperty(creq.upgrades, upgradeId, false);
            });
        }

        if (gateRequirements.resources) {
            req.resources = {};
            sharkmisc.tryAddProperty(creq, `resources`, {});
            $.each(gateRequirements.resources, (resourceId, requiredAmount) => {
                req.resources[resourceId] = requiredAmount;
                sharkmisc.tryAddProperty(creq.resources, resourceId, false);
            });
        }
    },

    switchTo() {
        const gate = SharkGame.Gate;
        const content = $("#content");
        content.append($("<div>").attr("id", "tabMessage"));
        content.append($("<div>").attr("id", "buttonList"));

        SharkGame.Gate.getResourcesLeft();

        if (!gate.shouldBeOpen()) {
            if (SharkGame.WorldTypes[world.worldType].gateRequirements.slots) {
                const buttonList = $("#buttonList");
                $.each(gate.requirements.slots, (resource, requiredAmount) => {
                    if (!gate.completedRequirements.slots[resource]) {
                        const resourceName = sharktext.getResourceName(
                            resource,
                            false,
                            false,
                            sharkcolor.getElementColor("tooltipbox", "background-color")
                        );
                        SharkGame.Button.makeHoverscriptButton(
                            "gateCost-" + resource,
                            "Insert " + sharktext.beautify(requiredAmount) + " " + resourceName + " into " + resourceName + " slot",
                            buttonList,
                            gate.onGateButton,
                            gate.onHover,
                            gate.onUnhover
                        );
                    }
                });
            }
        } else {
            SharkGame.Button.makeButton("gateEnter", "Enter gate", $("#buttonList"), gate.onEnterButton);
        }

        let message = gate.getMessage();
        const tabMessageSel = $("#tabMessage");
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + gate.getSceneImagePath() + "' id='tabSceneImageEssence'>" + message;
            tabMessageSel.css("background-image", "url('" + gate.tabBg + "')");
        }
        tabMessageSel.html(message);
    },

    getMessage() {
        const gate = SharkGame.Gate;
        if (gate.shouldBeOpen()) {
            return gate.messageOpened;
        }

        const slotsLeft = gate.getSlotsLeft();
        const upgradesLeft = gate.getUpgradesLeft();
        const resourcesLeft = gate.getResourcesLeft();

        // this intentionally checks for !== false because if it is specifically false, then getSlotsLeft() found that this world has no slots
        if (slotsLeft !== false) {
            if (slotsLeft > 1) {
                return gate.message;
            } else if (slotsLeft === 1) {
                return gate.messageOneSlot;
            }
            // if we get here then slotsLeft somehow took on a value other than a positive integer or false
            // in this situation simply assume slotsLeft === 0 and continue with execution
        }

        // if there are no slots then see if there are any upgrades or resources needed
        if (upgradesLeft !== false || resourcesLeft !== false) {
            return gate.messagePaidNotOpen;
        }

        // if there are no upgrades needed, then that implies that there are no gate requirements
        // send an error to the log and return a debug message
        log.addError("No gate requirements found.");
        return "This is a failsafe message. Something has gone wrong internally.";
    },

    getSlotsLeft() {
        const gate = SharkGame.Gate;
        let incompleteSlots = 0;
        // counts up the number of slots which are *not* filled
        _.each(gate.completedRequirements.slots, (resource) => {
            incompleteSlots += resource ? 0 : 1;
        });

        // if there are any slots in the first place, return the number of slots unfilled
        // if there are not any slots, return false to identify this fact
        return _.size(gate.requirements.slots) !== 0 ? incompleteSlots : false;
    },

    getUpgradesLeft() {
        const gate = SharkGame.Gate;
        let incompleteUpgrades = 0;
        // counts up the number of required upgrades which are *not* purchased
        _.each(gate.completedRequirements.upgrades, (upgradeName) => {
            incompleteUpgrades += upgradeName ? 0 : 1;
        });

        // if there are any required upgrades in the first place, return the number of still required upgrades
        // if there are not any required upgrades, return false to identify this fact
        if (gate.requirements.upgrades) {
            return gate.requirements.upgrades.length === 0 ? incompleteUpgrades : false;
        } else {
            return false;
        }
    },

    getResourcesLeft() {
        const gate = SharkGame.Gate;

        $.each(gate.completedRequirements.resources, (resource) => {
            gate.checkResourceRequirements(resource);
        });

        const remaining = [];
        $.each(gate.completedRequirements.resources, (resource, completed) => {
            if (completed) {
                remaining.push(resource);
            }
        });
        return remaining || false;
    },

    onHover() {
        const gate = SharkGame.Gate;
        const button = $(this);
        const resourceName = button.attr("id").split("-")[1];
        const amount = res.getResource(resourceName);
        const required = gate.requirements.slots[resourceName];
        if (amount < required) {
            button.html(
                `Need <span class='click-passthrough' style='color:#FFDE0A'>${sharktext.beautify(
                    required - amount
                )}</span> more ${sharktext.getResourceName(
                    resourceName,
                    false,
                    false,
                    sharkcolor.getElementColor(button.attr("id"), "background-color")
                )} for ${sharktext.getResourceName(
                    resourceName,
                    false,
                    false,
                    sharkcolor.getElementColor(button.attr("id"), "background-color")
                )} slot`
            );
        }
    },

    onUnhover() {
        const gate = SharkGame.Gate;
        const button = $(this);
        const resourceName = button.attr("id").split("-")[1];
        const required = gate.requirements.slots[resourceName];
        button.html(
            "Insert " +
                sharktext.beautify(required) +
                " " +
                sharktext.getResourceName(resourceName, false, false, sharkcolor.getElementColor(button.attr("id"), "background-color")) +
                " into " +
                sharktext.getResourceName(resourceName, false, false, sharkcolor.getElementColor(button.attr("id"), "background-color")) +
                " slot"
        );
    },

    update() {},

    onGateButton() {
        const gate = SharkGame.Gate;
        const resourceId = $(this).attr("id").split("-")[1];

        let message = "";
        const cost = gate.requirements.slots[resourceId] * (res.getResource("numen") + 1);
        if (res.getResource(resourceId) >= cost) {
            gate.completedRequirements.slots[resourceId] = true;
            res.changeResource(resourceId, -cost);
            $(this).remove();
            if (gate.shouldBeOpen()) {
                message = gate.messageAllPaid;
                // add enter gate button
                SharkGame.Button.makeButton("gateEnter", "Enter gate", $("#buttonList"), gate.onEnterButton);
            } else {
                message = gate.messagePaid;
            }
        } else {
            message = gate.messageCantPay + "<br/>";
            const diff = cost - res.getResource(resourceId);
            message += sharktext.beautify(diff) + " more.";
        }
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + gate.getSceneImagePath() + "' id='tabSceneImageEssence'>" + message;
        }
        $("#tabMessage").html(message);
    },

    onEnterButton() {
        $(this).remove();
        SharkGame.Gate.enterGate();
    },

    enterGate() {
        $("#tabMessage").html(SharkGame.Gate.messageEnter);
        SharkGame.wonGame = true;
        main.endGame();
    },

    shouldBeOpen() {
        return _.every(SharkGame.Gate.completedRequirements, (requirementType) => _.every(requirementType));
    },

    checkUpgradeRequirements(upgradeName) {
        const gate = SharkGame.Gate;
        if (gate.completedRequirements.upgrades && gate.completedRequirements.upgrades[upgradeName] === false) {
            gate.completedRequirements.upgrades[upgradeName] = true;
        }
    },

    checkResourceRequirements(resourceName) {
        const gate = SharkGame.Gate;
        if (gate.requirements.resources && res.getResource(resourceName) >= gate.requirements.resources[resourceName]) {
            gate.completedRequirements.resources[resourceName] = true;
        }
    },

    getSceneImagePath() {
        const gate = SharkGame.Gate;
        const slotsLeft = gate.getSlotsLeft();
        const upgradesLeft = gate.getUpgradesLeft();
        const resourcesLeft = gate.getResourcesLeft();

        // lots of complicated logic here
        // basically:
        // - if the gate is open, show it as open
        // - if the gate has more than 1 slot left, show it as closed
        // - if the gate has 1 slot left and filling that slot would open it, then do the 1 slot remaining
        // - if the gate has 1 slot left but filling that slot would NOT open it (there's an upgrade requirement), show it as closed
        // - if all slots are filled but an upgrade is still needed then show the closed-but-filled image
        if (gate.shouldBeOpen()) {
            return gate.sceneOpenImage;
        } else if (slotsLeft > 1) {
            return gate.sceneClosedImage;
        } else if (slotsLeft === 1 && !upgradesLeft && !resourcesLeft) {
            return gate.sceneAlmostOpenImage;
        } else if (!slotsLeft && (upgradesLeft || resourcesLeft)) {
            return gate.sceneClosedButFilledImage;
        } else {
            return gate.sceneClosedImage;
        }
    },
};
