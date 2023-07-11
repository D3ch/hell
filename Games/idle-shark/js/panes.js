SharkGame.Panes = {
    credits:
        "<p>This game was originally created in 3 days for Seamergency 2014.<br/>" +
        "<span class='smallDesc'>(Technically it was 4 days, but sometimes plans go awry.)</span></p>" +
        "<p>It was made by <a href='http://cirri.al'>Cirr</a> who needs to update his website.<br/>" +
        "He has a rarely updated <a href='https://twitter.com/Cirrial'>Twitter</a> though.</p>" +
        "<p>Additional code and credit help provided by Dylan and Sam Red.<br/>" +
        "<span class='smallDesc'>Dylan is also graciously hosting the original game.</span></p>" +
        "<br><p><a href='https://github.com/spencers145/SharkGame'>NEW FRONTIERS</a> created by base4/spencers145.<br/>" +
        "Art and sprite contributions by Jay, <a href='https://www.imdb.com/name/nm12683932/'>Noah Deibler,</a> and <a href='https://twitter.com/vhs_static'>@vhs_static</a> and friends.<br/>" +
        "Additional help from <a href='https://github.com/stampyzfanz'>Ixbixbam</a>.<br/>" +
        "<span class='smallDesc'>Ixbix's games at his little corner of the internet are </span><a href='https://stampyzfanz.github.io/'>here</a><span class='smallDesc'>.</span><br/>" +
        '<span>With help by <a href="https://github.com/Toby222">Toby</a></span><br/>',

    ending:
        "<p>Congratulations! You did it.<br/>You saved the sharks!</p>" +
        "<p>The gate leads away from this strange ocean...</p>" +
        "<p>Back home to the oceans you came from!</p>" +
        "<h3>Or are they?</h3>",
    cheats:
        "<p>You enter the space between worlds.</p>" +
        "<p><strong>1000 essence.</strong> You glow. The ether flows through you like blood.</p>" +
        "<p>Your long journey has made you strong, fast, and clever. Your power grows with every world you visit.</p>" +
        "<p>Your radiant energy shines through the deepest chasms and the smuggest grins; the iciest cold and the bleakest cities. You are something much more than a shark now.</p>" +
        "<p>And yet...your home is nowhere in sight.</p>" +
        "<p>You stop to ponder this conundrum.</p>" +
        "<p>If your home is truly lost, then what is the point?</p>" +
        "<p>Is the journey the point? Or is it perhaps the power? In truth, it was always your decision. No-one can make it for you.</p>" +
        "<p>But regardless, your adventure has come to an end...for now. You can always come back again. Perhaps when there are more places to visit, and things to see, you will find what you seek.</p>" +
        "<hr>" +
        "<p><strong>Cheats unlocked.</strong></p>" +
        "<p>Visit a world to engage in ridiculous hijinks.</p>" +
        "<p>Thank you for playing New Frontiers! I hope to see you back again next update.</p>",
    help:
        "<p>This game is a game about resources and discovery, and does not demand your full attention. " +
        "It will happily run in the background, and works even while closed.</p>" +
        "<p>To begin, you should catch fish. Once you have some fish, more actions will become available.</p>" +
        "<p>If you are ever stuck, double-check that you have already bought everything, then make sure there's not a resource you've been neglecting.</p>" +
        "<p>If you are still stuck, or if you think it's a bug, you can always ask for help on the <a href='https://discord.gg/nN7BQDJR2G' target='blank_'>discord server</a>.</p>",

    donate:
        "<h2>You can donate to various projects and organizations below to help support sea life:</h2>" +
        "<span class='smallDescAllowClicks'>(seems only fitting, given the original game was made for a charity event)</span>" +
        "<p><strong>#TeamSeas</strong> is a project which is using donations to take over 30 million pounds of trash out of the ocean. You can <a href='https://teamseas.org/'>donate to #TeamSeas here</a>.</p>" +
        "<p><strong>The Shark Trust</strong> is an organization that exists solely to advocate for research into, education about, and fair treatment of sharks. You can <a href='https://www.sharktrust.org/Listing/Category/donate' target='_blank'>donate to the Shark Trust here</a>.</p>" +
        "<p><span class='smallDescAllowClicks'>(But if you'd rather, you can also " +
        "<a href='https://www.paypal.com/cgi-bin/" +
        "webscr?cmd=_donations&business=G3WPPAYAWTJCJ&lc=GB&" +
        "item_name=Shark%20Game%20Developer%20Support&" +
        "item_number=Shark%20Game%20Support&no_note=1&" +
        "no_shipping=1&currency_code=USD&" +
        "bn=PP%2dDonationsBF%3adonate%2epng%3aNonHosted' " +
        "target='_blank'>support the developer of the original shark game,</a>" +
        " if you'd like.)</span></p>" +
        "<p>The developers of the mod are not currently taking donations.</p>",

    notice:
        "<p>Welcome to the open <b>alpha</b> of v0.2 for New Frontiers.</p>" +
        "<p>v0.2 is a total rework.<br/>Right now only four worlds (besides the starter world) are playable.<br><b>Things will be missing.</b> New stuff will be added.</p>" +
        "<p>To give feedback or contribute, check out our <a href='https://discord.gg/eYqApFkFPY'>Discord</a>.</p>" +
        "<p>To play the stable (OUTDATED) version (with all planets), visit <a href='https://spencers145.github.io/SharkGame/'>this link</a>.</p>",

    safariNotice:
        "It seems you are using Safari.<br />This browser is currently not well-tested due to lack of corresponding hardware.<br />" +
        "If you are willing to help us test it, please join us on <a href='https://discord.gg/s4tTj7y72z'>Discord</a>, or message" +
        " <a target='_blank' href='https://www.reddit.com/user/toby_prime'>Toby</a> or" +
        " <a target='_blank' href='https://www.reddit.com/user/SpencerS145/'>Base</a> on Reddit.",
};

SharkGame.PaneHandler = {
    paneStack: [],
    currentPane: undefined,

    init() {
        SharkGame.PaneHandler.wipeStack();
        SharkGame.PaneHandler.buildPane();
    },

    buildPane() {
        const pane = $("<div>").attr("id", "pane");
        $("body").append(pane);

        // set up structure of pane
        const titleDiv = $("<div>").attr("id", "paneHeader");
        titleDiv.append($("<div>").attr("id", "paneHeaderTitleDiv"));
        titleDiv.append(
            $("<div>")
                .attr("id", "paneHeaderCloseButtonDiv")
                .append(
                    $("<button>")
                        .attr("id", "paneHeaderCloseButton")
                        .addClass("min close-button")
                        .html("✕")
                        .on("click", SharkGame.PaneHandler.nextPaneInStack)
                )
        );
        pane.append(titleDiv);
        pane.append($("<div>").attr("id", "paneHeaderEnd").addClass("clear-fix"));
        pane.append($("<div>").attr("id", "paneContent"));

        pane.hide();
        SharkGame.paneGenerated = true;
        return pane;
    },

    addPaneToStack(title, contents, notCloseable, fadeInTime = 600, customOpacity) {
        const stackObject = [title, contents, notCloseable, fadeInTime, customOpacity];
        if (this.currentPane) {
            this.paneStack.push(_.cloneDeep(this.currentPane));
        }
        this.currentPane = stackObject;
        this.showPane(title, contents, notCloseable, fadeInTime, customOpacity, true);
    },

    swapCurrentPane(title, contents, notCloseable, fadeInTime = 600, customOpacity) {
        const stackObject = [title, contents, notCloseable, fadeInTime, customOpacity];
        this.currentPane = stackObject;
        this.showPane(title, contents, notCloseable, fadeInTime, customOpacity);
    },

    wipeStack() {
        SharkGame.PaneHandler.paneStack = [];
        SharkGame.PaneHandler.currentPane = undefined;
        SharkGame.PaneHandler.hidePane();
    },

    nextPaneInStack() {
        const panehandler = SharkGame.PaneHandler;
        panehandler.currentPane = panehandler.paneStack.pop();
        if (panehandler.currentPane) {
            panehandler.showPane(
                panehandler.currentPane[0],
                panehandler.currentPane[1],
                panehandler.currentPane[2],
                panehandler.currentPane[3],
                panehandler.currentPane[4]
            );
        } else {
            panehandler.hidePane();
        }
    },

    isStackClosable() {
        let canCloseAll;
        if (this.currentPane) {
            canCloseAll = !this.currentPane[2];
        } else {
            return true;
        }

        _.each(this.paneStack, (pane) => {
            canCloseAll = canCloseAll && !pane[2];
        });

        return canCloseAll;
    },

    tryClosePane() {
        if (this.isPaneUp() && this.isCurrentPaneCloseable()) {
            this.nextPaneInStack();
            return true;
        }
    },

    tryWipeStack() {
        while (this.currentPane) {
            if (!this.tryClosePane()) {
                return false;
            }
        }
        return true;
    },

    isPaneUp() {
        return !$(`#pane`).is(`:hidden`) && $(`#pane`).html();
    },

    isCurrentPaneCloseable() {
        if (this.currentPane) {
            return !this.currentPane[2];
        }
        return false;
    },

    isPaneAlreadyUp(title) {
        let alreadyUp;
        if (this.currentPane) {
            alreadyUp = this.currentPane[0] === title;
        } else {
            return false;
        }

        _.each(this.paneStack, (pane) => {
            alreadyUp = alreadyUp || pane[0] === title;
        });

        return alreadyUp;
    },

    showPane(title, contents, notCloseable, fadeInTime, customOpacity, preserveElements) {
        const pane = $("#pane");

        // begin fading in/displaying overlay if it isn't already visible
        const overlay = $("#overlay");
        const overlayOpacity = $(`#overlay`).hasClass(`gateway`) ? 1.0 : customOpacity || 0.5;

        SharkGame.OverlayHandler.revealOverlay(fadeInTime, overlayOpacity);

        // adjust header
        const titleDiv = $("#paneHeaderTitleDiv");
        const closeButtonDiv = $("#paneHeaderCloseButtonDiv");

        if (!title || title === "") {
            titleDiv.hide();
        } else {
            titleDiv.show();
            if (!notCloseable) {
                // put back to left
                titleDiv.css({ float: "left", "text-align": "left", clear: "none" });
                titleDiv.html("<h3>" + title + "</h3>");
            } else {
                // center
                titleDiv.css({ float: "none", "text-align": "center", clear: "both" });
                titleDiv.html("<h2>" + title + "</h2>");
            }
        }
        if (notCloseable) {
            closeButtonDiv.hide();
        } else {
            closeButtonDiv.show();
        }

        let paneContent;
        if (!preserveElements) {
            paneContent = $("#paneContent");
            paneContent.empty();
        } else {
            const originalContent = $("#paneContent");
            originalContent.detach();

            pane.append($("<div>").attr("id", "paneContent"));
            paneContent = $("#paneContent");
        }

        // adjust content
        paneContent.append(contents);
        if (SharkGame.Settings.current.showAnimations && customOpacity) {
            pane.show().css("opacity", 0).animate({ opacity: 1.0 }, fadeInTime);
        } else {
            pane.show();
        }

        if (!notCloseable) {
            document.getElementById("overlay").addEventListener("click", SharkGame.PaneHandler.nextPaneInStack);
            overlay.addClass("pointy");
        } else {
            document.getElementById("overlay").removeEventListener("click", SharkGame.PaneHandler.nextPaneInStack);
            overlay.removeClass("pointy");
        }
    },

    hidePane() {
        document.getElementById("overlay").removeEventListener("click", SharkGame.PaneHandler.nextPaneInStack);
        $("#overlay").removeClass("pointy");
        SharkGame.OverlayHandler.hideOverlay();
        $("#pane").hide();
    },

    showOptions() {
        const optionsContent = SharkGame.PaneHandler.setUpOptions();
        SharkGame.PaneHandler.addPaneToStack("Options", optionsContent);
    },

    setUpOptions() {
        const optionsTable = $("<table>").attr("id", "optionTable");

        // add settings specified in settings.js
        const categories = {};
        $.each(SharkGame.Settings, (name, setting) => {
            if (typeof setting.category === "string") {
                if (!categories[setting.category]) {
                    categories[setting.category] = [];
                }
                categories[setting.category].push(name);
            }
        });

        $.each(categories, (category, settings) => {
            optionsTable.append(
                $("<tr>").html("<h3><br><span style='text-decoration: underline'>" + sharktext.boldString(category) + "</span></h3>")
            );
            _.each(settings, (settingName) => {
                const setting = SharkGame.Settings[settingName];
                if (settingName === "current") {
                    return;
                }
                const optionRow = $("<tr>");

                // show setting name
                optionRow.append(
                    $("<td>")
                        .addClass("optionLabel")
                        .html(setting.name + ":" + "<br/><span class='smallDesc'>(" + setting.desc + ")</span>")
                );

                const currentSetting = SharkGame.Settings.current[settingName];

                // show setting adjustment buttons
                $.each(setting.options, (index, optionValue) => {
                    const isSelectedOption = optionValue === currentSetting;
                    optionRow.append(
                        $("<td>").append(
                            $("<button>")
                                .attr("id", "optionButton-" + settingName + "-" + index)
                                .addClass("option-button" + (isSelectedOption ? " disabled" : ""))
                                .html(typeof optionValue === "boolean" ? (optionValue ? "on" : "off") : optionValue)
                                .on("click", SharkGame.PaneHandler.onOptionClick)
                        )
                    );
                });

                optionsTable.append(optionRow);
            });
        });

        // SAVE IMPORT/EXPORT
        // add save import/export
        let row = $("<tr>");
        row.append(
            $("<td>").html(
                "Import/Export Save:<br/><span class='smallDesc'>(Turn your save into text for other people to load, or as a backup.)</span>"
            )
        );
        row.append(
            $("<td>").append(
                $("<button>")
                    .html("import")
                    .addClass("option-button")
                    .on("click", function callback() {
                        if ($(this).hasClass("disabled")) return;
                        const importText = $("#importExportField").val();
                        if (importText === "") {
                            SharkGame.PaneHandler.nextPaneInStack();
                            log.addError("You need to paste something in first!");
                        } else if (confirm("Are you absolutely sure? This will override your current save.")) {
                            SharkGame.Save.importData(importText);
                        }
                    })
            )
        );
        row.append(
            $("<td>").append(
                $("<button>")
                    .html("export")
                    .addClass("option-button")
                    .on("click", function callback() {
                        if ($(this).hasClass("disabled")) return;
                        $("#importExportField").val(SharkGame.Save.exportData());
                    })
            )
        );
        // add the actual text box
        row.append($("<td>").attr("colSpan", 4).append($("<input>").attr("type", "text").attr("id", "importExportField")));
        optionsTable.append(row);

        // BACKUP MANAGEMENT
        row = $("<tr>");
        const row2 = $("<tr>");
        row.append($("<td>").html("Save Backups:<br/><span class='smallDesc'>(Create a backup save.)</span>"));
        row2.append($("<td>").html("Load Backups:<br/><span class='smallDesc'>(Load a backup save.)</span>"));

        _.each([`1`, `2`, `3`], (tag) => {
            row.append(
                $(`<td>`).append(
                    $(`<button>`)
                        .html(`save ${tag}`)
                        .addClass(`option-button`)
                        .on(`click`, () => {
                            if (SharkGame.Save.savedGameExists(`Backup${tag}`)) {
                                if (!confirm(`There is already a save in this slot. Overwrite it?`)) {
                                    return;
                                }
                            }
                            SharkGame.Save.createTaggedSave(`Backup${tag}`);
                            $(`#load${tag}`).removeClass(`disabled`);
                        })
                )
            );

            const loadButton = $(`<button>`)
                .html(`load ${tag}`)
                .attr(`id`, `load${tag}`)
                .addClass(`option-button`)
                .on(`click`, () => {
                    if (!$(`#load${tag}`).hasClass(`disabled`) && SharkGame.Save.savedGameExists(`Backup${tag}`)) {
                        if (
                            confirm(
                                `Are you absolutely sure you want to load this save${SharkGame.Save.getTaggedSaveCharacteristics(`Backup${tag}`)}?`
                            )
                        ) {
                            SharkGame.Save.loadTaggedSave(`Backup${tag}`);
                        }
                    }
                });

            if (!SharkGame.Save.savedGameExists(`Backup${tag}`)) {
                loadButton.addClass(`disabled`);
            }

            row2.append($(`<td>`).append(loadButton));
        });

        optionsTable.append(row);

        if (SharkGame.persistentFlags.unlockedDebug) {
            const loadButton = $(`<button>`)
                .html(`load pre-cheats backup`)
                .attr(`id`, `loadCheats`)
                .addClass(`option-button`)
                .on(`click`, () => {
                    if (!$(`#loadCheats`).hasClass(`disabled`) && SharkGame.Save.savedGameExists(`BackupCheats`)) {
                        if (
                            confirm(
                                `Are you absolutely sure you want to load this save${SharkGame.Save.getTaggedSaveCharacteristics(`BackupCheats`)}?`
                            )
                        ) {
                            SharkGame.Save.loadTaggedSave(`BackupCheats`);
                        }
                    }
                });

            if (!SharkGame.Save.savedGameExists(`BackupCheats`)) {
                loadButton.addClass(`disabled`);
            }
            row2.append(loadButton);
        }

        optionsTable.append(row2);

        // SETTING WIPE
        row = $("<tr>");
        row.append($("<td>").html("Wipe Settings:<br/><span class='smallDesc'>(Change all settings to default.)</span>"));
        row.append(
            $("<td>").append(
                $("<button>")
                    .html("wipe")
                    .addClass("option-button")
                    .on("click", () => {
                        if (confirm("Are you absolutely sure you want to wipe your settings to default?")) {
                            $.each(SharkGame.Settings.current, (settingName) => {
                                if (SharkGame.Settings[settingName]) {
                                    SharkGame.Settings.current[settingName] = SharkGame.Settings[settingName].defaultSetting;
                                    if (typeof SharkGame.Settings[settingName].onChange === "function") {
                                        SharkGame.Settings[settingName].onChange();
                                    }
                                }
                            });
                            SharkGame.Keybinds.resetKeybindsToDefault();
                            SharkGame.PaneHandler.nextPaneInStack();
                            SharkGame.PaneHandler.showOptions();
                        }
                    })
            )
        );
        optionsTable.append(row);

        // SAVE WIPE
        // add save wipe
        row = $("<tr>");
        row.append(
            $("<td>").html("Wipe Save:<br/><span class='smallDesc'>(Completely wipe your main save and reset the game. COMPLETELY. FOREVER.)</span>")
        );
        row.append(
            $("<td>").append(
                $("<button>")
                    .html("wipe")
                    .addClass("option-button")
                    .on("click", () => {
                        if (confirm("Are you absolutely sure you want to wipe your save?\nIt'll be gone forever!")) {
                            main.resetGame();
                        }
                    })
            )
        );
        optionsTable.append(row);

        if (SharkGame.persistentFlags.unlockedDebug) {
            row = $("<tr>");
            row.append($("<td>").html("Hide Cheats:<br/><span class='smallDesc'>(Hide or show cheats.)</span>"));
            row.append(
                $("<td>").append(
                    $("<button>")
                        .html("show")
                        .addClass("option-button")
                        .on("click", () => {
                            cad.debug();
                        })
                )
            );
            row.append(
                $("<td>").append(
                    $("<button>")
                        .html("hide")
                        .addClass("option-button")
                        .on("click", () => {
                            cad.hideDebug();
                        })
                )
            );
            optionsTable.prepend(row);

            optionsTable.prepend(
                $("<tr>").html("<h3><br><span style='text-decoration: underline'>" + sharktext.boldString(`CHEATS and DEBUG`) + "</span></h3>")
            );
        }

        row = $("<tr>");
        row.append($("<td>").html("Keybinds:<br/><span class='smallDesc'>(Change keybinds.)</span>"));
        row.append(
            $("<td>").append(
                $("<button>")
                    .html("change")
                    .addClass("option-button")
                    .on("click", () => {
                        SharkGame.PaneHandler.showKeybinds();
                    })
            )
        );
        optionsTable.prepend(row);

        optionsTable.prepend($("<tr>").html("<h3><br><span style='text-decoration: underline'>" + sharktext.boldString(`KEYBINDS`) + "</span></h3>"));

        return optionsTable;
    },

    onOptionClick() {
        if ($(this).hasClass("disabled")) return;
        const buttonLabel = $(this).attr("id");
        const settingInfo = buttonLabel.split("-");
        const settingName = settingInfo[1];
        const optionIndex = parseInt(settingInfo[2]);

        // change setting to specified setting!
        SharkGame.Settings.current[settingName] = SharkGame.Settings[settingName].options[optionIndex];

        // update relevant table cell!
        // $('#option-' + settingName)
        //     .html("(" + ((typeof newSetting === "boolean") ? (newSetting ? "on" : "off") : newSetting) + ")");

        // enable all buttons
        $('button[id^="optionButton-' + settingName + '"]').removeClass("disabled");

        // disable this button
        $(this).addClass("disabled");

        // if there is a callback, call it, else call the no op
        (SharkGame.Settings[settingName].onChange || $.noop)();
    },

    showKeybinds() {
        if (SharkGame.Keybinds.waitForKey) {
            SharkGame.Keybinds.waitForKey = false;
        }

        const keybindTable = $(`<table>`).attr(`id`, `keybindTable`);

        let row = $(`<tr>`);
        row.append(
            $(`<td>`).append(
                $(`<button>`)
                    .html(`new bind`)
                    .attr(`id`, `new-bind-button`)
                    .on(`click`, function () {
                        $(this).html(`press some keys...`);
                        SharkGame.Keybinds.waitForKey = true;
                    })
            )
        );
        keybindTable.append(row);

        $.each(SharkGame.Keybinds.keybinds, (boundKey, boundAction) => {
            row = $(`<tr>`).attr(`id`, SharkGame.Keybinds.compressKeyID(boundKey));
            row.append($(`<td>`).html(boundKey));

            if (SharkGame.Keybinds.actions.includes(boundAction)) {
                const selector = $("<select>").on(`change`, function () {
                    SharkGame.Keybinds.addKeybind(boundKey, $(this)[0].value);
                    console.debug(`bound ${boundKey} to ${$(this)[0].value}`);
                });
                _.each(SharkGame.Keybinds.actions, (potentialBoundAction, i) => {
                    selector.append(
                        `<option${i % 2 === 0 ? ' class="evenMessage"' : ""} ${boundAction === potentialBoundAction ? ` selected` : ``}>` +
                            potentialBoundAction +
                            "</option>"
                    );
                });
                row.append(selector);
            } else {
                row.append($(`<td>`).html(SharkGame.Keybinds.cleanActionID(boundAction)));
            }

            row.append(
                $(`<td>`).append(
                    $("<button>")
                        .addClass("min close-button")
                        .html("✕")
                        .on(`click`, () => {
                            $(`#${SharkGame.Keybinds.compressKeyID(boundKey)}`).remove();
                            delete SharkGame.Keybinds.keybinds[boundKey];
                        })
                )
            );
            keybindTable.append(row);
        });

        SharkGame.PaneHandler.addPaneToStack("Keybinds", keybindTable);
    },

    showChangelog() {
        const changelogContent = $("<div>").attr("id", "changelogDiv");
        $.each(SharkGame.Changelog, (version, changes) => {
            const segment = $("<div>").addClass("paneContentDiv");
            segment.append($("<h3>").html(version + ": "));
            const changeList = $("<ul>");
            _.each(changes, (changeLogEntry) => {
                changeList.append($("<li>").html(changeLogEntry));
            });
            segment.append(changeList);
            changelogContent.append(segment);
        });
        SharkGame.PaneHandler.addPaneToStack("Changelog", changelogContent);
    },

    showHelp() {
        const helpDiv = $("<div>");
        helpDiv.append($("<div>").append(SharkGame.Panes.help).addClass("paneContentDiv"));
        SharkGame.PaneHandler.addPaneToStack("Help", helpDiv);
    },

    showAspectWarning() {
        const aspectWarnDiv = $("<div>");
        aspectWarnDiv.append(
            $("<div>")
                .attr("id", "aspectInnerWarning")
                .append(
                    "Uh oh!<br>Your save has aspects that are no longer in the game!<br>I'm sorry, but there's only one way we can fix this:<br>your <strong>aspects</strong> have been <strong>refunded</strong><br>so that you can <strong>replace them</strong> with <strong>new ones</strong>.<br><br>Remember that you can use the <strong>skip</strong> button<br>in the top-left of the screen to go back to the gateway.<br>"
                )
                .addClass("paneContentDiv")
        );
        SharkGame.Button.makeButton(
            "confirmUnderstood",
            "I understand my <br><strong>ASPECTS</strong> ARE <strong>REFUNDED</strong>",
            aspectWarnDiv,
            () => {
                SharkGame.PaneHandler.nextPaneInStack();
                SharkGame.missingAspects = false;
            }
        );
        this.addPaneToStack("THAT'S NOT GOOD...", aspectWarnDiv, true);
    },

    showUnlockedCheatsMessage() {
        this.addPaneToStack("...", SharkGame.Panes.cheats);
    },
};
