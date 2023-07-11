"use strict";
SharkGame.Recycler = {
    tabId: "recycler",
    tabDiscovered: false,
    tabSeen: false,
    tabName: "Recycler",
    tabBg: "img/bg/bg-recycler.png",

    sceneImage: "img/events/misc/scene-recycler.png",

    discoverReq: {
        upgrade: ["recyclerDiscovery"],
    },

    message: "Convert things into residue, and residue into things!<br/><span class='medDesc'>Feed the machines. Feed them.</span>",

    recyclerInputMessages: [
        "The machines grind and churn.",
        "Screech clunk chomp munch erp.",
        "Clunk clunk clunk screeeeech.",
        "The recycler hungrily devours the stuff you offer.",
        "The offerings are no more.",
        "Viscous, oily mess sloshes within the machine.",
        "The recycler reprocesses.",
    ],

    recyclerOutputMessages: [
        "A brand new whatever!",
        "The recycler regurgitates your demand, immaculately formed.",
        "How does a weird blackish gel become THAT?",
        "Some more stuff to use! Maybe even to recycle!",
        "Gifts from the machine! Gifts that may have cost a terrible price!",
        "How considerate of this unfeeling, giant apparatus! It provides you stuff at inflated prices!",
    ],

    allowedCategories: {
        machines: "linear",
        stuff: "constant",
        processed: "constant",
        animals: "constant",
    },

    bannedResources: ["essence", "junk", "science", "seaApple", "coalescer", "ancientPart", "filter", "world", "sacrifice", "aspectAffect"],

    efficiency: "NA",
    hoveredResource: "NA",
    expectedOutput: "NA",
    expectedJunkSpent: "NA",

    init() {
        SharkGame.TabHandler.registerTab(this);
    },

    setup() {
        /* doesnt need to do anything */
    },

    switchTo() {
        const content = $("#content");
        content.append($("<div>").attr("id", "tabMessage"));
        const container = $("<div>").attr("id", "recyclerContainer");
        container.append($("<div>").attr("id", "inputButtons"));
        container.append($("<div>").attr("id", "junkDisplay"));
        container.append($("<div>").attr("id", "outputButtons"));
        content.append(container);
        content.append($("<div>").addClass("clear-fix"));
        let message = rec.message;
        const tabMessageSel = $("#tabMessage");
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + rec.sceneImage + "' id='tabSceneImageRed'>" + message;
            tabMessageSel.css("background-image", "url('" + rec.tabBg + "')");
        }
        tabMessageSel.html(message);

        main.createBuyButtons("eat", container, "prepend");
        rec.createButtons();
    },

    update() {
        rec.updateExpectedOutput();
        rec.updateExpectedJunkSpent();
        rec.updateJunkDisplay();
        rec.updateButtons();
    },

    updateJunkDisplay() {
        const junkAmount = res.getResource("junk");
        const junkDisplay = $("#junkDisplay");

        let junkString = "";
        if (rec.expectedOutput !== "NA" && rec.expectedOutput !== 0) {
            junkString = "<span class='click-passthrough' style='color:#FFE436'>" + sharktext.beautify(junkAmount + rec.expectedOutput) + "</span> ";
        } else if (rec.expectedJunkSpent !== "NA" && rec.expectedJunkSpent !== 0) {
            junkString =
                "<span class='click-passthrough' style='color:#FFE436'>" + sharktext.beautify(junkAmount - rec.expectedJunkSpent) + "</span> ";
        } else {
            junkString = sharktext.beautify(junkAmount);
        }

        const newValue = "CONTAINS:<br/>" + junkString.bold() + " RESIDUE<br/><br/>" + rec.getRecyclerEfficiencyString() + rec.getTarString().bold();
        const oldValue = junkDisplay.html();

        // Fix up beautified strings to match jquery returns for matching purposes.
        if (oldValue !== newValue.replace(/'/g, '"').replace(/<br\/>/g, "<br>")) {
            junkDisplay.html(newValue);
        }
    },

    updateButtons() {
        SharkGame.ResourceMap.forEach((_resource, resourceName) => {
            if (res.getTotalResource(resourceName) > 0) {
                const inputButton = $("#input-" + resourceName);
                // If this is a resource that's not in the recycler, skip it entirely.
                if (inputButton.length === 0) {
                    return true;
                }
                const outputButton = $("#output-" + resourceName);
                const resourceAmount = new Decimal(res.getResource(resourceName));

                // determine amounts for input and what would be retrieved from output
                const buy = new Decimal(sharkmath.getBuyAmount());
                let inputAmount = buy;
                let outputAmount = buy;
                const maxOutputAmount = rec.getMaxToBuy(resourceName);
                if (buy < 0) {
                    const divisor = buy.round().times(-1);
                    inputAmount = resourceAmount.dividedBy(divisor).round();
                    outputAmount = maxOutputAmount.dividedBy(divisor).round();
                }

                // update input button
                let disableButton = resourceAmount.lessThan(inputAmount) || inputAmount.lessThanOrEqualTo(0);
                let label = "Recycle ";
                if (inputAmount.greaterThan(0)) {
                    if (rec.expectedJunkSpent !== "NA" && rec.expectedJunkSpent !== 0 && !disableButton && resourceName === rec.hoveredResource) {
                        if (buy < 0) {
                            label +=
                                "<span class='click-passthrough' style='color:#FFDE0A'>" +
                                sharktext.beautify(Number(inputAmount.plus(outputAmount).dividedBy(buy.times(-1)))) +
                                "</span> ";
                        } else {
                            label += "<span class='click-passthrough' style='color:#FFDE0A'>" + sharktext.beautify(Number(inputAmount)) + "</span> ";
                        }
                    } else {
                        label += sharktext.beautify(Number(inputAmount)) + " ";
                    }
                }

                if (disableButton) {
                    inputButton.addClass("disabled");
                } else {
                    inputButton.removeClass("disabled");
                }

                label += sharktext.getResourceName(
                    resourceName,
                    disableButton,
                    buy,
                    sharkcolor.getElementColor("input-" + resourceName, "background-color")
                );
                if (inputButton.html() !== label.replace(/'/g, '"')) {
                    inputButton.html(label);
                }

                // update output button
                disableButton = maxOutputAmount.lessThan(outputAmount) || outputAmount.lessThanOrEqualTo(0);
                label = "Convert to ";
                if (outputAmount > 0) {
                    if (rec.expectedOutput !== "NA" && rec.expectedOutput !== 0 && !disableButton) {
                        label += "<span class='click-passthrough' style='color:#FFDE0A'>" + sharktext.beautify(Number(outputAmount)) + "</span> ";
                    } else {
                        label += sharktext.beautify(Number(outputAmount)) + " ";
                    }
                }

                if (disableButton) {
                    outputButton.addClass("disabled");
                } else {
                    outputButton.removeClass("disabled");
                }

                label += sharktext.getResourceName(
                    resourceName,
                    disableButton,
                    buy,
                    sharkcolor.getElementColor("output-" + resourceName, "background-color")
                );
                if (outputButton.html() !== label.replace(/'/g, '"')) {
                    outputButton.html(label);
                }
            }
        });
    },

    createButtons() {
        const inputButtonDiv = $("#inputButtons");
        const outputButtonDiv = $("#outputButtons");
        SharkGame.ResourceMap.forEach((_resource, resourceName) => {
            if (
                res.getTotalResource(resourceName) > 0 &&
                rec.allowedCategories[res.getCategoryOfResource(resourceName)] &&
                rec.bannedResources.indexOf(resourceName) === -1
            ) {
                SharkGame.Button.makeHoverscriptButton(
                    "input-" + resourceName,
                    "Recycle " + sharktext.getResourceName(resourceName, undefined, undefined, sharkcolor.getVariableColor("--color-light")),
                    inputButtonDiv,
                    rec.onInput,
                    rec.onInputHover,
                    rec.onInputUnhover
                );
                SharkGame.Button.makeHoverscriptButton(
                    "output-" + resourceName,
                    "Convert to " + sharktext.getResourceName(resourceName, undefined, undefined, sharkcolor.getVariableColor("--color-light")),
                    outputButtonDiv,
                    rec.onOutput,
                    rec.onOutputHover,
                    rec.onOutputUnhover
                );
            }
        });
    },

    onInput() {
        const button = $(this);
        if (button.hasClass("disabled")) return;
        const resourceName = button.attr("id").split("-")[1];
        const resourceAmount = res.getResource(resourceName);
        const junkPerResource = SharkGame.ResourceMap.get(resourceName).value;
        const amount = sharkmath.getPurchaseAmount(resourceName);

        if (resourceAmount >= amount * (1 - SharkGame.EPSILON)) {
            res.changeResource("junk", amount * junkPerResource * rec.getEfficiency());
            res.changeResource(resourceName, -amount);
            res.changeResource("tar", Math.max(amount * junkPerResource * 0.0000002 + res.getProductAmountFromGeneratorResource("filter", "tar"), 0));
            log.addMessage(SharkGame.choose(rec.recyclerInputMessages));
        } else {
            log.addError("Not enough resources for that transaction. This might be caused by putting in way too many resources at once.");
        }

        rec.updateEfficiency(resourceName);

        // disable button until next frame
        button.addClass("disabled");
    },

    onOutput() {
        const button = $(this);
        if (button.hasClass("disabled")) return;
        const resourceName = button.attr("id").split("-")[1];
        const junkAmount = new Decimal(res.getResource("junk"));
        const junkPerResource = new Decimal(SharkGame.ResourceMap.get(resourceName).value);

        if (rec.expectedOutput !== "NA") {
            return;
        }

        const selectedAmount = new Decimal(sharkmath.getBuyAmount());
        let amount = selectedAmount;
        if (selectedAmount < 0) {
            const divisor = selectedAmount.round().times(-1);
            amount = rec.getMaxToBuy(resourceName).dividedBy(divisor);
        }

        const currentResourceAmount = new Decimal(res.getResource(resourceName));
        let junkNeeded;

        const costFunction = rec.allowedCategories[res.getCategoryOfResource(resourceName)];
        if (costFunction === "linear") {
            junkNeeded = sharkmath.linearCost(currentResourceAmount, amount, junkPerResource);
        } else if (costFunction === "constant") {
            junkNeeded = sharkmath.constantCost(currentResourceAmount, amount, junkPerResource);
        }

        if (junkAmount.greaterThanOrEqualTo(junkNeeded.times(1 - SharkGame.EPSILON))) {
            res.changeResource(resourceName, Number(amount));
            res.changeResource("junk", -Number(junkNeeded));
            log.addMessage(SharkGame.choose(rec.recyclerOutputMessages));
        } else {
            log.addMessage("You don't have enough for that!");
        }

        // disable button until next frame
        button.addClass("disabled");
    },

    getMaxToBuy(resource) {
        const resourceAmount = new Decimal(res.getResource(resource));
        const junkPricePerResource = new Decimal(SharkGame.ResourceMap.get(resource).value);
        let junkAmount = new Decimal(res.getResource("junk"));

        if (rec.expectedOutput !== "NA") {
            junkAmount = junkAmount.plus(rec.expectedOutput);
        }

        const category = res.getCategoryOfResource(resource);

        let max = new Decimal(0);
        if (rec.allowedCategories[category]) {
            const costFunction = rec.allowedCategories[category];

            if (costFunction === "linear") {
                max = sharkmath.linearMax(resourceAmount, junkAmount, junkPricePerResource).minus(resourceAmount);
            } else if (costFunction === "constant") {
                max = sharkmath.constantMax(resourceAmount, junkAmount, junkPricePerResource).minus(resourceAmount);
            }
        }
        return max.round();
    },

    onInputHover() {
        const button = $(this);
        const resource = button.attr("id").split("-")[1];

        if (button.is(".disabled")) {
            return;
        }

        rec.hoveredResource = resource;
        rec.updateEfficiency(resource);
        rec.updateExpectedOutput();
    },

    onInputUnhover() {
        rec.efficiency = "NA";
        rec.hoveredResource = "NA";
        rec.expectedOutput = "NA";
    },

    onOutputHover() {
        const button = $(this);
        const resource = button.attr("id").split("-")[1];

        if (button.is(".disabled")) {
            return;
        }

        rec.efficiency = "NA";
        rec.hoveredResource = resource;
        rec.updateExpectedJunkSpent();
    },

    onOutputUnhover() {
        rec.hoveredResource = "NA";
        rec.expectedJunkSpent = "NA";
    },

    getTarString() {
        const buy = sharkmath.getBuyAmount();

        if (world.worldType === "abandoned") {
            if (rec.efficiency === "NA") {
                return "<br/><br/><br/><br/>";
            }

            const tarTolerance = -res.getProductAmountFromGeneratorResource("filter", "tar");
            let produced = SharkGame.ResourceMap.get(rec.hoveredResource).value * 0.0000002;
            if (buy > 0) {
                produced *= buy;
            } else {
                produced *= res.getResource(rec.hoveredResource) / -buy;
            }
            let amountstring = sharktext.beautify(produced);
            amountstring =
                "<br/><br/>AND " +
                amountstring.bold() +
                " " +
                sharktext.getResourceName("tar", undefined, undefined, sharkcolor.getElementColor("junkDisplay"));
            if (tarTolerance > 0) {
                amountstring +=
                    "<br/>(" +
                    sharktext.beautify(Math.max(produced - tarTolerance, 0)) +
                    " " +
                    sharktext.getResourceName("tar", undefined, undefined, sharkcolor.getElementColor("junkDisplay")) +
                    " WITH<br/>" +
                    sharktext.getResourceName("filter", false, 2, sharkcolor.getElementColor("junkDisplay")) +
                    ")";
            }
            return amountstring;
        }
        return "";
    },

    getRecyclerEfficiencyString() {
        if (rec.efficiency === "NA" || rec.hoveredResource === "NA" || rec.expectedOutput === 0) {
            return "<br/><br/><br/><br/><br/><br/>";
        }

        let amountstring = "";
        if (sharkmath.getBuyAmount() > 0) {
            amountstring = sharktext.beautify(rec.efficiency * sharkmath.getBuyAmount());
        } else {
            amountstring = sharktext.beautify((rec.efficiency * res.getResource(rec.hoveredResource)) / -sharkmath.getBuyAmount());
        }

        return (
            (rec.getEfficiency() * 100).toFixed(2).toString().bold() +
            "<b>%<br/>EFFICIENCY</b><br/><br/>EQUIVALENT TO:<br/>" +
            amountstring.bold() +
            " " +
            sharktext.getResourceName(rec.hoveredResource, undefined, undefined, sharkcolor.getElementColor("junkDisplay")).bold() +
            "<br/>WORTH OF RESIDUE"
        );
    },

    updateExpectedOutput() {
        const resource = rec.hoveredResource;
        if (resource === "NA" || rec.expectedJunkSpent !== "NA") {
            rec.expectedOutput = "NA";
            return;
        }
        const amount = res.getResource(resource);
        const buy = sharkmath.getBuyAmount();

        if (buy > 0) {
            if (buy <= amount) {
                rec.expectedOutput = 0;
            } else {
                rec.expectedOutput = buy * rec.getEfficiency() * SharkGame.ResourceMap.get(resource).value;
            }
        } else {
            const realBuy = amount / -buy;
            if (realBuy < 1) {
                rec.expectedOutput = 0;
                return;
            }
            rec.expectedOutput = realBuy * rec.getEfficiency() * SharkGame.ResourceMap.get(resource).value;
        }
    },

    updateExpectedJunkSpent() {
        const resource = rec.hoveredResource;
        if (resource === "NA" || rec.expectedOutput !== "NA") {
            rec.expectedJunkSpent = "NA";
            return;
        }
        const buy = new Decimal(sharkmath.getBuyAmount());

        const max = rec.getMaxToBuy(resource);

        const resourceAmount = new Decimal(res.getResource(resource));
        const value = new Decimal(SharkGame.ResourceMap.get(resource).value);

        if (buy > 0) {
            if (buy <= max) {
                switch (rec.allowedCategories[res.getCategoryOfResource(resource)]) {
                    case "constant":
                        rec.expectedJunkSpent = Number(buy * value);
                        break;
                    case "linear":
                        rec.expectedJunkSpent = Number(sharkmath.linearCost(resourceAmount, buy, value));
                }
            } else {
                rec.expectedJunkSpent = 0;
            }
        } else {
            const realBuy = max.dividedBy(buy.times(-1)).round();
            if (realBuy === 0) {
                rec.expectedJunkSpent = 0;
                return;
            }
            switch (rec.allowedCategories[res.getCategoryOfResource(resource)]) {
                case "constant":
                    rec.expectedJunkSpent = Number(realBuy.times(value));
                    break;
                case "linear":
                    rec.expectedJunkSpent = Number(sharkmath.linearCost(resourceAmount, realBuy, value));
            }
        }

        if (rec.expectedJunkSpent < 0) {
            rec.expectedJunkSpent = 0;
        }
    },

    getEfficiency() {
        if (rec.efficiency === "NA") {
            return 1;
        }
        rec.updateEfficiency(rec.hoveredResource);
        return rec.efficiency.toFixed(4);
    },

    updateEfficiency(resource) {
        let maxEfficiencyRecyclePowerOfTen = 5;
        let baseEfficiency = 0.5;

        if (SharkGame.Upgrades.purchased.includes("superprocessing")) {
            maxEfficiencyRecyclePowerOfTen = 8;
            baseEfficiency = 1;
        }

        const purchaseAmount = sharkmath.getPurchaseAmount(resource);
        // check if the amount to eat is less than the threshold
        if (purchaseAmount <= Math.pow(10, maxEfficiencyRecyclePowerOfTen)) {
            rec.efficiency = baseEfficiency;
        } else {
            // otherwise, scale back based purely on the number to process
            // 'cheating' by lowering the value of n is ok if the player wants to put in a ton of effort
            // the system is more sensible, and people can get a feel for it easier if i make this change
            // the amount that this effects things isn't crazy high either, so
            rec.efficiency = 1 / (Math.log10(purchaseAmount) - maxEfficiencyRecyclePowerOfTen + Math.round(1 / baseEfficiency));
        }
    },
};
