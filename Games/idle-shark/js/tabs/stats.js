"use strict";
SharkGame.Stats = {
    tabId: "stats",
    tabDiscovered: false,
    tabSeen: false,
    tabName: "Grotto",
    tabBg: "img/bg/bg-grotto.png",

    sceneImage: "img/events/misc/scene-grotto.png",

    recreateIncomeTable: null,
    incomeTableEmpty: true,

    discoverReq: { upgrade: ["statsDiscovery"] },

    bannedDisposeCategories: ["special", "harmful", "hidden"],

    message:
        "The grotto is a place to keep a better track of resources." +
        "</br></br>You can also dispose of those you don't need anymore." +
        "</br>Disposing specialists returns them to their normal, previous lives.",

    init() {
        SharkGame.TabHandler.registerTab(this);
    },

    setup() {
        stats.recreateIncomeTable = true;
    },

    switchTo() {
        const content = $("#content");
        content.append($("<div>").attr("id", "tabMessage"));
        const statsContainer = $("<div>").attr("id", "statsContainer");
        content.append(statsContainer);

        statsContainer.append($("<div>").attr("id", "statsUpperContainer").append($("<div>").attr("id", "incomeData")));
        statsContainer.append($("<div>").attr("id", "statsLeftContainer").append($("<div>").attr("id", "disposeResource")));
        statsContainer.append($("<div>").attr("id", "statsRightContainer").append($("<div>").attr("id", "generalStats")));

        statsContainer.append($("<div>").addClass("clear-fix"));
        let message = stats.message;
        const tabMessageSel = $("#tabMessage");
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + stats.sceneImage + "' id='tabSceneImage'>" + message;
            tabMessageSel.css("background-image", "url('" + stats.tabBg + "')");
        }
        tabMessageSel.html(message);

        const disposeSel = $("#disposeResource");
        disposeSel.append($("<h3>").html("Dispose of Stuff"));
        main.createBuyButtons("rid", disposeSel, "append");
        stats.createDisposeButtons();

        const table = stats.createIncomeTable();
        const incomeDataSel = $("#incomeData");
        incomeDataSel.append($("<h3>").html("Income Details"));
        incomeDataSel.append(
            $("<p>")
                .html("(Listed below are resources, the income each resource gives you, and the total income you're getting from each thing.)")
                .addClass("medDesc")
        );

        const switchButtonDiv = $("<div>");
        switchButtonDiv.css({
            margin: "auto",
            "margin-bottom": "15px",
            clear: "both",
        });

        SharkGame.Button.makeButton("switchButton", "Swap Producers and Produced", switchButtonDiv, stats.toggleSwitch).addClass("min-block");
        if (SharkGame.Settings.current.grottoMode === "simple") {
            SharkGame.Button.makeButton("modeButton", "Swap to Advanced mode", switchButtonDiv, stats.toggleMode).addClass("min-block");
        } else {
            SharkGame.Button.makeButton("modeButton", "Swap to Simple mode", switchButtonDiv, stats.toggleMode).addClass("min-block");
        }
        incomeDataSel.append(switchButtonDiv);

        incomeDataSel.append(table);
        incomeDataSel.append($("<div>").attr("id", "tableKey"));
        stats.updateTableKey();

        const genStats = $("#generalStats");
        genStats.append($("<h3>").html("General Stats"));
        const firstTime = main.isFirstTime();
        genStats.append(
            $("<p>").html("Real time since you began your journey:<br/><span id='gameTime' class='timeDisplay'></span>").addClass("medDesc")
        );
        if (!firstTime) {
            genStats.append(
                $("<p>").html("Relative time since you came through the gate:<br/><span id='runTime' class='timeDisplay'></span>").addClass("medDesc")
            );
            if (SharkGame.persistentFlags.scouting === false) {
                genStats.append($("<p>").html(`Par: ${gateway.getPar()} minutes`).addClass("medDesc"));
            }
        }
        genStats.append($("<h3>").html("Total Ocean Resources Acquired"));
        if (!firstTime) {
            genStats.append(
                $("<p>").html("Essence given is the total acquired for the entire game and not just for this world.").addClass("medDesc")
            );
        }
        genStats.append(stats.createTotalAmountTable());
        this.update();
    },

    update() {
        stats.updateDisposeButtons();
        stats.updateIncomeTable();
        stats.updateTotalAmountTable();
        if (stats.recreateIncomeTable) {
            stats.createIncomeTable();
            stats.createTotalAmountTable();
            stats.recreateIncomeTable = false;
        }

        stats.updateTimers();

        if (document.getElementById("tooltipbox").attributes.current) {
            stats.networkTextEnter(null, document.getElementById("tooltipbox").attributes.current.value);
        }
    },

    createDisposeButtons() {
        const buttonDiv = $("#disposeResource").addClass("disposeArrangement");
        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            if (res.getTotalResource(resourceId) > 0 && stats.bannedDisposeCategories.indexOf(res.getCategoryOfResource(resourceId)) === -1) {
                SharkGame.Button.makeButton(
                    "dispose-" + resourceId,
                    "Dispose of<br/>" +
                        sharktext.getResourceName(resourceId, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")),
                    buttonDiv,
                    stats.onDispose
                );
            }
        });
    },

    updateDisposeButtons() {
        SharkGame.ResourceMap.forEach((_resource, resourceName) => {
            if (res.getTotalResource(resourceName) > 0 && stats.bannedDisposeCategories.indexOf(res.getCategoryOfResource(resourceName)) === -1) {
                const button = $("#dispose-" + resourceName);
                const resourceAmount = res.getResource(resourceName);
                let amountToDispose = sharkmath.getBuyAmount();
                if (amountToDispose < 0) {
                    const max = resourceAmount;
                    const divisor = Math.floor(amountToDispose) * -1;
                    amountToDispose = Math.floor(max / divisor);
                }
                const disableButton = resourceAmount < amountToDispose || amountToDispose <= 0;
                let label =
                    "Dispose of " +
                    sharktext.beautify(amountToDispose) +
                    "<br/>" +
                    sharktext.getResourceName(
                        resourceName,
                        disableButton,
                        amountToDispose,
                        sharkcolor.getElementColor("dispose-" + resourceName, "background-color")
                    );
                if (amountToDispose <= 0) {
                    label =
                        "Can't dispose any more " +
                        sharktext.getResourceName(
                            resourceName,
                            disableButton,
                            amountToDispose,
                            sharkcolor.getElementColor("dispose-" + resourceName, "background-color")
                        );
                }

                if (button.html() !== label.replace(/'/g, '"').replace("<br/>", "<br>")) {
                    button.html(label);
                }

                if (disableButton) {
                    button.addClass("disabled");
                } else {
                    button.removeClass("disabled");
                }
            }
        });
    },

    onDispose() {
        const resourceName = $(this).attr("id").split("-")[1];
        const resourceAmount = res.getResource(resourceName);
        let amountToDispose = SharkGame.Settings.current.buyAmount;
        if (amountToDispose < 0) {
            const max = resourceAmount;
            const divisor = Math.floor(amountToDispose) * -1;
            amountToDispose = max / divisor;
        }
        if (resourceAmount >= amountToDispose) {
            res.changeResource(resourceName, -amountToDispose);
            const category = SharkGame.ResourceCategories[res.getCategoryOfResource(resourceName)];
            const employmentPool = res.getBaseOfResource(resourceName);
            if (employmentPool) {
                res.changeResource(employmentPool, amountToDispose);
            }
            log.addMessage(SharkGame.choose(category.disposeMessage));
        } else {
            log.addMessage("Can't dispose that much! You don't have enough of it.");
        }
    },

    updateTimers() {
        // update run times
        const gameTime = sharktext.formatTime(_.now() - SharkGame.timestampGameStart);
        if ($("#gameTime").html() !== gameTime) {
            $("#gameTime").html(gameTime);
        }

        const runTime = sharktext.formatTime(sharktime.getRunTime());
        if ($("#runTime").html() !== runTime) {
            $("#runTime").html(runTime);
        }
    },

    updateIncomeTable() {
        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            if (res.getTotalResource(resourceId) > 0) {
                if (SharkGame.ResourceMap.get(resourceId).income) {
                    const income = SharkGame.ResourceMap.get(resourceId).income;
                    $.each(income, (incomeKey, incomeValue) => {
                        let cell = $("#income-" + resourceId + "-" + incomeKey);
                        let realIncome;
                        if (SharkGame.BreakdownIncomeTable.get(resourceId)) {
                            realIncome = SharkGame.BreakdownIncomeTable.get(resourceId)[incomeKey];
                        } else {
                            return true;
                        }
                        const changeChar = !(realIncome < 0) ? "+" : "";
                        let newValue =
                            "<span style='color: " +
                            res.TOTAL_INCOME_COLOR +
                            "'>" +
                            (changeChar + sharktext.beautifyIncome(realIncome)).bold() +
                            "</span>";

                        if (cell.html() !== newValue.replace(/'/g, '"')) {
                            cell.html(newValue);
                        }

                        if (SharkGame.Settings.current.switchStats) {
                            cell = $("#table-amount-" + resourceId + "-" + incomeKey);
                        } else {
                            cell = $("#table-amount-" + resourceId);
                        }

                        newValue = !sharktext.shouldHideNumberOfThis(resourceId)
                            ? "<div style='text-align:right'>" + sharktext.beautify(res.getResource(resourceId)).bold() + "</div>"
                            : "";
                        if (cell.html() !== newValue.replace(/'/g, '"')) {
                            cell.html(newValue);
                        }

                        if (SharkGame.Settings.current.grottoMode === "advanced") {
                            cell = $("#network-" + resourceId + "-" + incomeKey)
                                .on("mouseenter", stats.networkTextEnter)
                                .on("mouseleave", stats.networkTextLeave);
                            newValue =
                                "<span style='color:" +
                                res.RESOURCE_AFFECT_MULTIPLIER_COLOR +
                                "'>x" +
                                sharktext.beautify(
                                    res.getNetworkIncomeModifier("generator", resourceId) * res.getNetworkIncomeModifier("resource", incomeKey),
                                    false,
                                    2
                                ) +
                                "</span>";
                            if (cell.html() !== newValue.replace(/'/g, '"')) {
                                cell.html(newValue);
                            }
                        } else {
                            cell = $("#base-income-" + resourceId + "-" + incomeKey);
                            newValue =
                                "<span style='color:" +
                                res.INCOME_COLOR +
                                "'>" +
                                (!(SharkGame.BreakdownIncomeTable.get(resourceId)[incomeKey] < 0) ? "+" : "") +
                                sharktext.beautify(
                                    (incomeValue *
                                        res.getNetworkIncomeModifier("generator", resourceId) *
                                        res.getNetworkIncomeModifier("resource", incomeKey)) /
                                        SharkGame.persistentFlags.dialSetting,
                                    false,
                                    2
                                ) +
                                "/s" +
                                "</span>";
                            if (cell.html() !== newValue.replace(/'/g, '"')) {
                                cell.html(newValue);
                            }
                        }
                    });
                }
            }
        });
    },

    updateTotalAmountTable() {
        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            const totalResource = res.getTotalResource(resourceId);
            if (totalResource > 0 && res.getCategoryOfResource(resourceId) !== "hidden") {
                const cell = $("#totalAmount-" + resourceId);
                const newValue = sharktext.beautify(totalResource);
                const oldValue = cell.html();

                if (oldValue !== newValue.replace(/'/g, '"')) {
                    cell.html(newValue);
                }
            }
        });
    },

    createIncomeTable() {
        /** @type {JQuery<HTMLTableElement} */
        let incomesTable = $("#incomeTable");
        if (incomesTable.length === 0) {
            incomesTable = $("<table>").attr("id", "incomeTable");
        } else {
            incomesTable.empty();
        }

        let formatCounter = 1;

        const drawnResourceMap = new Map();
        SharkGame.ResourceMap.forEach((generatorData, generatorName) => {
            if (res.getTotalResource(generatorName) > 0 && generatorData.income) {
                // if the resource has an income requiring any costs
                // and it isn't a forced income
                // do not display the resource's income if it requires a non-existent resource (looking at you, sponge)
                for (const incomeResourceName in generatorData.income) {
                    // skip income that doesn't exist
                    if (SharkGame.PlayerResources.get(incomeResourceName) < generatorData.income[incomeResourceName] && !generatorData.forceIncome)
                        return;
                }

                $.each(generatorData.income, (incomeKey, incomeValue) => {
                    if (world.doesResourceExist(incomeKey) && SharkGame.FlippedBreakdownIncomeTable.get(incomeKey) && incomeValue !== 0) {
                        if (SharkGame.Settings.current.switchStats) {
                            // Switch it!
                            if (!drawnResourceMap.has(incomeKey)) {
                                drawnResourceMap.set(incomeKey, {});
                            }

                            drawnResourceMap.get(incomeKey)[generatorName] = incomeValue;
                        } else {
                            if (!drawnResourceMap.has(generatorName)) {
                                drawnResourceMap.set(generatorName, {});
                            }

                            // Copy all the good incomes over
                            drawnResourceMap.get(generatorName)[incomeKey] = incomeValue;
                        }
                    }
                });
            }
        });

        drawnResourceMap.forEach((headingData, headingName) => {
            // if the resource has an income requiring any costs
            // and it isn't a forced income
            // do not display the resource's income if it requires a non-existent resource (looking at you, sponge)
            const subheadings = Object.keys(headingData).length;

            let resourceMapRow = $("<tr>");
            let counter = 0;

            const rowStyle = formatCounter % 2 === 0 ? "evenRow" : "oddRow";

            if (!SharkGame.Settings.current.switchStats) {
                resourceMapRow.append(
                    $("<td>")
                        .attr("rowspan", subheadings)
                        .html(
                            !sharktext.shouldHideNumberOfThis(headingName)
                                ? "<div style='text-align:right'>" + sharktext.beautify(res.getResource(headingName)).bold() + "</div>"
                                : ""
                        )
                        .addClass(rowStyle)
                        .attr("id", "table-amount-" + headingName)
                );
            }
            resourceMapRow.append(
                $("<td>")
                    .html(
                        sharktext.getResourceName(
                            headingName,
                            undefined,
                            undefined,
                            rowStyle === "evenRow" ? sharkcolor.getVariableColor("--color-dark") : sharkcolor.getVariableColor("--color-darker")
                        )
                    )
                    .attr("rowspan", subheadings)
                    .addClass(rowStyle)
            );

            function addCell(text, rowspan, id) {
                if (id) {
                    if (id.includes("network")) {
                        resourceMapRow.append(
                            $("<td>")
                                .attr("rowspan", rowspan === "inline" ? 1 : subheadings)
                                .attr("id", id)
                                .html(text ? `<span style='color:${text[0]}'>${text[1]}</span>` : undefined)
                                .addClass(rowStyle)
                                .on("mouseenter", stats.networkTextEnter)
                                .on("mouseleave", stats.networkTextLeave)
                        );
                    } else {
                        resourceMapRow.append(
                            $("<td>")
                                .attr("rowspan", rowspan === "inline" ? 1 : subheadings)
                                .attr("id", id)
                                .html(text ? `<span style='color:${text[0]}'>${text[1]}</span>` : undefined)
                                .addClass(rowStyle)
                        );
                    }
                } else {
                    resourceMapRow.append(
                        $("<td>")
                            .attr("rowspan", rowspan === "inline" ? 1 : subheadings)
                            .html(text ? `<span style='color:${text[0]}'>${text[1]}</span>` : undefined)
                            .addClass(rowStyle)
                    );
                }
            }

            const multipliers = {
                upgrade: [],
                world: [],
                aspect: [],
            };

            $.each(headingData, (subheadingKey, _subheadingValue) => {
                const incomeKey = SharkGame.Settings.current.switchStats ? headingName : subheadingKey;
                const generatorName = SharkGame.Settings.current.switchStats ? subheadingKey : headingName;
                multipliers.upgrade.push(res.getMultiplierProduct("upgrade", generatorName, incomeKey));
                multipliers.world.push(res.getMultiplierProduct("world", generatorName, incomeKey));
                multipliers.aspect.push(res.getMultiplierProduct("aspect", generatorName, incomeKey));
            });
            $.each(multipliers, (category, values) => {
                // thanks stackoverflow
                multipliers[category] =
                    values.filter((value, index, list) => {
                        return list.indexOf(value) === index;
                    }).length !== 1;
            });

            $.each(headingData, (subheadingKey, subheadingValue) => {
                const incomeKey = SharkGame.Settings.current.switchStats ? headingName : subheadingKey;
                const generatorName = SharkGame.Settings.current.switchStats ? subheadingKey : headingName;
                const incomeValue = subheadingValue;

                let realIncome;
                if (SharkGame.BreakdownIncomeTable.get(generatorName)) {
                    realIncome = SharkGame.BreakdownIncomeTable.get(generatorName)[incomeKey];
                } else {
                    formatCounter++;
                    return false;
                }

                const changeChar = !(realIncome < 0) ? "+" : "";

                if (SharkGame.Settings.current.switchStats) {
                    resourceMapRow.append(
                        $("<td>")
                            .html(
                                !sharktext.shouldHideNumberOfThis(generatorName)
                                    ? "<div style='text-align:right'>" + sharktext.beautify(res.getResource(subheadingKey)).bold() + "</div>"
                                    : ""
                            )
                            .addClass(rowStyle)
                            .attr("id", "table-amount-" + generatorName + "-" + incomeKey)
                    );
                }
                resourceMapRow.append(
                    $("<td>")
                        .html(
                            sharktext.getResourceName(
                                subheadingKey,
                                undefined,
                                undefined,
                                rowStyle === "evenRow" ? sharkcolor.getVariableColor("--color-dark") : sharkcolor.getVariableColor("--color-darker")
                            )
                        )
                        .addClass(rowStyle)
                );

                const baseIncomeChangeChar =
                    incomeValue *
                        res.getNetworkIncomeModifier("generator", generatorName, incomeValue) *
                        res.getNetworkIncomeModifier("resource", incomeKey, incomeValue) <
                    0
                        ? ""
                        : "+";
                // which mode are we in?
                if (SharkGame.Settings.current.grottoMode === "advanced") {
                    addCell(
                        [
                            res.INCOME_COLOR,
                            baseIncomeChangeChar +
                                sharktext.beautify(
                                    SharkGame.ResourceMap.get(generatorName).baseIncome[incomeKey] / SharkGame.persistentFlags.dialSetting,
                                    false,
                                    2
                                ) +
                                "/s",
                        ],
                        "inline",
                        "advanced-base-income-" + generatorName + "-" + incomeKey
                    );
                    if (multipliers.upgrade || counter === 0) {
                        const upgradeMutiplier = res.getMultiplierProduct("upgrade", generatorName, incomeKey);
                        if (upgradeMutiplier !== 1) {
                            addCell(
                                [res.UPGRADE_MULTIPLIER_COLOR, "x" + sharktext.beautify(upgradeMutiplier, false, 1)],
                                multipliers.upgrade ? "inline" : undefined
                            );
                        } else addCell(undefined, multipliers.upgrade ? "inline" : undefined);
                    }

                    if (multipliers.world || counter === 0) {
                        const worldMultiplier = res.getMultiplierProduct("world", generatorName, incomeKey);
                        if (worldMultiplier !== 1) {
                            addCell(
                                [res.WORLD_MULTIPLIER_COLOR, "x" + sharktext.beautify(worldMultiplier, false, 1)],
                                multipliers.world ? "inline" : undefined
                            );
                        } else addCell(undefined, multipliers.world ? "inline" : undefined);
                    }

                    if (multipliers.aspect || counter === 0) {
                        const aspectMultiplier = res.getMultiplierProduct("aspect", generatorName, incomeKey);
                        if (aspectMultiplier !== 1) {
                            addCell(
                                [res.ASPECT_MULTIPLIER_COLOR, "x" + sharktext.beautify(aspectMultiplier, false, 1)],
                                multipliers.aspect ? "inline" : undefined
                            );
                        } else addCell(undefined, multipliers.aspect ? "inline" : undefined);
                    }

                    const resourceAffectMultiplier =
                        res.getNetworkIncomeModifier("generator", generatorName, incomeValue) *
                        res.getNetworkIncomeModifier("resource", incomeKey, incomeValue);
                    if (resourceAffectMultiplier !== 1) {
                        addCell(
                            [res.RESOURCE_AFFECT_MULTIPLIER_COLOR, "x" + sharktext.beautify(resourceAffectMultiplier, false, 2)],
                            "inline",
                            "network-" + generatorName + "-" + incomeKey
                        );
                    } else addCell(undefined, "inline");
                } else {
                    addCell(
                        [
                            res.INCOME_COLOR,
                            baseIncomeChangeChar +
                                sharktext.beautify(
                                    (incomeValue *
                                        res.getNetworkIncomeModifier("generator", generatorName, incomeValue) *
                                        res.getNetworkIncomeModifier("resource", incomeKey, incomeValue)) /
                                        SharkGame.persistentFlags.dialSetting,
                                    false,
                                    2
                                ) +
                                "/s",
                        ],
                        "inline",
                        "base-income-" + generatorName + "-" + incomeKey
                    );
                }

                addCell(undefined, "inline");

                if (SharkGame.Settings.current.incomeTotalMode === "percentage") {
                    addCell(
                        [
                            res.TOTAL_INCOME_COLOR,
                            sharktext.boldString(Math.min((realIncome / SharkGame.PlayerIncomeTable.get(incomeKey)) * 100, 100).toFixed(0) + "%"),
                        ],
                        "inline",
                        "income-" + generatorName + "-" + incomeKey
                    );
                } else {
                    addCell(
                        [res.TOTAL_INCOME_COLOR, sharktext.boldString(changeChar + sharktext.beautifyIncome(realIncome))],
                        "inline",
                        "income-" + generatorName + "-" + incomeKey
                    );
                }

                counter++;
                incomesTable.append(resourceMapRow);
                resourceMapRow = $("<tr>");
            });

            // throw away dangling values
            resourceMapRow = null;
            formatCounter++;
        });

        if (drawnResourceMap.size && !_.isUndefined(incomesTable[0].children[0])) {
            const row = $("<tr>");
            let columns = incomesTable[0].children[0].children.length;

            if (SharkGame.Settings.current.switchStats) {
                row.append(
                    $("<td>")
                        .html("<span><u>" + "RESOURCE".bold() + "</u></span>")
                        .addClass("evenRow")
                );
                row.append(
                    $("<td>")
                        .html("<span><u>" + "AMOUNT".bold() + "</u></span>")
                        .addClass("evenRow")
                );

                row.append(
                    $("<td>")
                        .html("<span><u>" + "GENERATOR".bold() + "</u></span>")
                        .addClass("evenRow")
                );
            } else {
                row.append(
                    $("<td>")
                        .html("<span><u>" + "AMOUNT".bold() + "</u></span>")
                        .addClass("evenRow")
                );
                row.append(
                    $("<td>")
                        .html("<span><u>" + "GENERATOR".bold() + "</u></span>")
                        .addClass("evenRow")
                );

                row.append(
                    $("<td>")
                        .html("<span><u>" + "RESOURCE".bold() + "</u></span>")
                        .addClass("evenRow")
                );
            }

            row.append(
                $("<td>")
                    .html("<span><u><b>" + (SharkGame.Settings.current.grottoMode === "advanced" ? "BASE INCOME" : "INCOME PER") + "</b></u></span>")
                    .addClass("evenRow")
            );

            columns -= 4;

            if (SharkGame.Settings.current.grottoMode === "advanced") {
                function tooltip($elt, html) {
                    return $elt.on("mouseenter", () => $("#tooltipbox").html(html)).on("mouseleave", () => $("#tooltipbox").html(""));
                }

                row.append(
                    tooltip(
                        $("<td>")
                            .html("<div style='text-align:center; color:" + res.UPGRADE_MULTIPLIER_COLOR + "'><strong>U</strong></div>")
                            .addClass("evenRow"),
                        "<strong>U</strong>pgrade effects"
                    )
                );
                if (main.isFirstTime()) {
                    row.append($("<td>").html(undefined).addClass("evenRow"));
                    row.append($("<td>").html(undefined).addClass("evenRow"));
                    row.append($("<td>").html(undefined).addClass("evenRow"));
                } else {
                    row.append(
                        tooltip(
                            $("<td>")
                                .html("<div style='text-align:center; color:" + res.WORLD_MULTIPLIER_COLOR + "'><strong>W</strong></div>")
                                .addClass("evenRow"),
                            "<strong>W</strong>orld effects"
                        )
                    );
                    row.append(
                        tooltip(
                            $("<td>")
                                .html("<div style='text-align:center; color:" + res.ASPECT_MULTIPLIER_COLOR + "'><strong>A</strong></div>")
                                .addClass("evenRow"),
                            "<strong>A</strong>spect effects"
                        )
                    );
                    row.append(
                        tooltip(
                            $("<td>")
                                .html("<div style='text-align:center; color:" + res.RESOURCE_AFFECT_MULTIPLIER_COLOR + "'><strong>R</strong></div>")
                                .addClass("evenRow"),
                            "How some <strong>R</strong>esources affect each other"
                        )
                    );
                }
                columns -= 4;
            }
            while (columns > 1) {
                columns -= 1;
                row.append($("<td>").html(undefined).addClass("evenRow"));
            }

            if (res.getSpecialMultiplier() !== 1) {
                row.append(
                    $("<td>")
                        .html("x" + res.getSpecialMultiplier())
                        .addClass("evenRow")
                        .attr("rowspan", incomesTable.find("tr").length + 1)
                );
            }

            row.append($("<td>").html("<span><u><b>TOTAL</b></u></span>").addClass("evenRow"));

            incomesTable.prepend(row);
            SharkGame.Stats.incomeTableEmpty = false;
        } else {
            incomesTable.prepend($("<tr>").append($("<td>").html("<span><i><b>There's nothing here.</b></i></span>")));
            SharkGame.Stats.incomeTableEmpty = true;
        }
        return incomesTable;
    },

    createTotalAmountTable() {
        let totalAmountTable = $("#totalAmountTable");
        if (totalAmountTable.length === 0) {
            totalAmountTable = $("<table>").attr("id", "totalAmountTable");
        } else {
            totalAmountTable.empty();
        }

        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            if (res.getTotalResource(resourceId) > 0 && res.getCategoryOfResource(resourceId) !== "hidden") {
                const row = $("<tr>");

                row.append(
                    $("<td>").html(sharktext.getResourceName(resourceId, undefined, undefined, sharkcolor.getVariableColor("--color-darker")))
                );
                row.append(
                    $("<td>")
                        .html(sharktext.beautify(res.getTotalResource(resourceId)))
                        .attr("id", "totalAmount-" + resourceId)
                );

                totalAmountTable.append(row);
            }
        });

        return totalAmountTable;
    },

    toggleSwitch() {
        SharkGame.Settings.current.switchStats = !SharkGame.Settings.current.switchStats;
        SharkGame.Stats.createIncomeTable();
    },

    toggleMode() {
        if (SharkGame.Settings.current.grottoMode === "simple") {
            SharkGame.Settings.current.grottoMode = "advanced";
            document.getElementById("modeButton").innerHTML = "Swap to Simple mode";
        } else {
            SharkGame.Settings.current.grottoMode = "simple";
            document.getElementById("modeButton").innerHTML = "Swap to Advanced mode";
        }
        stats.createIncomeTable();
        stats.updateTableKey();
    },

    updateTableKey() {
        if (SharkGame.Settings.current.grottoMode !== "advanced" || SharkGame.Stats.incomeTableEmpty) {
            document.getElementById("tableKey").innerHTML = "";
            return;
        }

        if (world.worldType !== "start") {
            document.getElementById("tableKey").innerHTML =
                "<br> <b><u>TABLE KEY</b></u>" +
                `<br> <span style='color:${res.UPGRADE_MULTIPLIER_COLOR}'><b>This color</b></span> is for <strong>U</strong>pgrade effects.` +
                `<br> <span style='color:${res.WORLD_MULTIPLIER_COLOR}'><b>This color</b></span> is for <strong>W</strong>orld effects.` +
                `<br> <span style='color:${res.ASPECT_MULTIPLIER_COLOR}'><b>This color</b></span> is for <strong>A</strong>spect effects.` +
                `<br> <span style='color:${res.RESOURCE_AFFECT_MULTIPLIER_COLOR}'><b>This color</b></span> is for how some <strong>R</strong>esources affect each other.`;
        } else {
            document.getElementById("tableKey").innerHTML =
                "<br> <b><u>TABLE KEY</b></u>" +
                `<br> <span style='color:${res.UPGRADE_MULTIPLIER_COLOR}'><b>This color</b></span> is for upgrade effects.`;
        }
    },

    networkTextEnter(_mouseEnterEvent, networkResource = "nothing") {
        if (!networkResource || !networkResource.includes("network")) {
            networkResource = $(this).attr("id");
            if (!networkResource || !networkResource.includes("network")) return;
        }

        const idArray = networkResource.split("-");
        const generatorName = idArray[1];
        const generatedName = idArray[2];

        let addedAnyLabelsYet = false;

        let text = "";

        const generatorObject = {};
        generatorObject[generatorName] = 1;
        const generatorCondensedObject = res.condenseNode(generatorObject, true);

        const generatedObject = {};
        generatedObject[generatedName] = 1;
        const generatedCondensedObject = res.condenseNode(generatedObject, true);

        if (_.some(generatorCondensedObject.genAffect, (category) => !$.isEmptyObject(category))) {
            text += sharktext.getResourceName(generatorName, false, 1, sharkcolor.getElementColor("tooltipbox", "background-color")) + " income<br>";
            if (!$.isEmptyObject(generatorCondensedObject.genAffect.increase)) {
                addedAnyLabelsYet = true;
                text += "<span class='littleTooltipText'>IS INCREASED BY</span><br>";
                $.each(generatorCondensedObject.genAffect.increase, (affector, degree) => {
                    const amount = SharkGame.Settings.current.alwaysSingularTooltip ? 1 : res.getResource(affector);
                    text +=
                        sharktext.boldString(sharktext.beautify(degree * 100 * amount) + "%") +
                        " from " +
                        sharktext.boldString(sharktext.beautify(amount)) +
                        " " +
                        sharktext.getResourceName(affector, false, amount, sharkcolor.getElementColor("tooltipbox", "background-color"));
                });
            }

            if (!$.isEmptyObject(generatorCondensedObject.genAffect.decrease)) {
                text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "<br>then " : "") + "IS DECREASED BY</span><br>";
                addedAnyLabelsYet = true;
                $.each(generatorCondensedObject.genAffect.decrease, (affector, degree) => {
                    const amount = SharkGame.Settings.current.alwaysSingularTooltip ? 1 : res.getResource(affector);
                    text +=
                        sharktext.boldString(sharktext.beautify(-degree * 100 * amount) + "%") +
                        " from " +
                        sharktext.boldString(sharktext.beautify(amount)) +
                        " " +
                        sharktext.getResourceName(affector, false, amount, sharkcolor.getElementColor("tooltipbox", "background-color"));
                });
            }

            if (!$.isEmptyObject(generatorCondensedObject.genAffect.multincrease)) {
                text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "<br>then " : "") + "IS MULTIPLICATIVELY INCREASED BY</span><br>";
                addedAnyLabelsYet = true;
                $.each(generatorCondensedObject.genAffect.multincrease, (affector, degree) => {
                    const amount = SharkGame.Settings.current.alwaysSingularTooltip ? 1 : res.getResource(affector);
                    text +=
                        sharktext.boldString(sharktext.beautify((degree ** amount - 1) * 100) + "%") +
                        " from " +
                        sharktext.boldString(sharktext.beautify(amount)) +
                        " " +
                        sharktext.getResourceName(affector, false, amount, sharkcolor.getElementColor("tooltipbox", "background-color"));
                });
            }

            if (!$.isEmptyObject(generatorCondensedObject.genAffect.multdecrease)) {
                text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "<br>then " : "") + "IS MULTIPLICATIVELY DECREASED BY</span><br>";
                addedAnyLabelsYet = true;
                $.each(generatorCondensedObject.genAffect.multdecrease, (affector, degree) => {
                    const amount = SharkGame.Settings.current.alwaysSingularTooltip ? 1 : res.getResource(affector);
                    text +=
                        sharktext.boldString(sharktext.beautify((1 - degree ** amount) * 100) + "%") +
                        " from " +
                        sharktext.boldString(sharktext.beautify(amount)) +
                        " " +
                        sharktext.getResourceName(affector, false, amount, sharkcolor.getElementColor("tooltipbox", "background-color"));
                });
            }
        }

        if (_.some(generatedCondensedObject.resAffect, (category) => !$.isEmptyObject(category))) {
            if (addedAnyLabelsYet) {
                addedAnyLabelsYet = false;
                text += "<hr class='hrForTooltipJuxtaposition'>";
            }
            text += sharktext.getResourceName(generatedName, false, 1, sharkcolor.getElementColor("tooltipbox", "background-color")) + " gains<br>";
            if (!$.isEmptyObject(generatedCondensedObject.resAffect.increase)) {
                addedAnyLabelsYet = true;
                text += "<span class='littleTooltipText'>ARE INCREASED BY</span><br>";
                $.each(generatedCondensedObject.resAffect.increase, (affector, degree) => {
                    const amount = SharkGame.Settings.current.alwaysSingularTooltip ? 1 : res.getResource(affector);
                    text +=
                        sharktext.boldString(sharktext.beautify(degree * 100 * amount) + "%") +
                        " from " +
                        sharktext.boldString(sharktext.beautify(amount)) +
                        " " +
                        sharktext.getResourceName(affector, false, amount, sharkcolor.getElementColor("tooltipbox", "background-color"));
                });
            }

            if (!$.isEmptyObject(generatedCondensedObject.resAffect.decrease)) {
                text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "<br>then " : "") + "ARE DECREASED BY</span><br>";
                addedAnyLabelsYet = true;
                $.each(generatedCondensedObject.resAffect.decrease, (affector, degree) => {
                    const amount = SharkGame.Settings.current.alwaysSingularTooltip ? 1 : res.getResource(affector);
                    text +=
                        sharktext.boldString(sharktext.beautify(-degree * 100 * amount) + "%") +
                        " from " +
                        sharktext.boldString(sharktext.beautify(amount)) +
                        " " +
                        sharktext.getResourceName(affector, false, amount, sharkcolor.getElementColor("tooltipbox", "background-color"));
                });
            }

            if (!$.isEmptyObject(generatedCondensedObject.resAffect.multincrease)) {
                text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "<br>then " : "") + "ARE MULTIPLICATIVELY INCREASED BY</span><br>";
                addedAnyLabelsYet = true;
                $.each(generatedCondensedObject.resAffect.multincrease, (affector, degree) => {
                    const amount = SharkGame.Settings.current.alwaysSingularTooltip ? 1 : res.getResource(affector);
                    text +=
                        sharktext.boldString(sharktext.beautify((degree ** amount - 1) * 100) + "%") +
                        " from " +
                        sharktext.boldString(sharktext.beautify(amount)) +
                        " " +
                        sharktext.getResourceName(affector, false, amount, sharkcolor.getElementColor("tooltipbox", "background-color"));
                });
            }

            if (!$.isEmptyObject(generatedCondensedObject.resAffect.multdecrease)) {
                text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "<br>then " : "") + "ARE MULTIPLICATIVELY DECREASED BY</span><br>";
                addedAnyLabelsYet = true;
                $.each(generatedCondensedObject.resAffect.multdecrease, (affector, degree) => {
                    const amount = SharkGame.Settings.current.alwaysSingularTooltip ? 1 : res.getResource(affector);
                    text +=
                        sharktext.boldString(sharktext.beautify((1 - degree ** amount) * 100) + "%") +
                        " from " +
                        sharktext.boldString(sharktext.beautify(amount)) +
                        " " +
                        sharktext.getResourceName(affector, false, amount, sharkcolor.getElementColor("tooltipbox", "background-color"));
                });
            }
        }

        if (document.getElementById("tooltipbox").innerHTML !== text.replace(/'/g, '"')) {
            document.getElementById("tooltipbox").innerHTML = text;
        }
        $("#tooltipbox").removeClass("forIncomeTable").attr("current", "");
        $("#tooltipbox").addClass("forHomeButtonOrGrotto").attr("current", networkResource);
    },

    networkTextLeave() {
        document.getElementById("tooltipbox").innerHTML = "";
        $("#tooltipbox").removeClass("forHomeButtonOrGrotto").attr("current", "");
    },
};
