"use strict";
SharkGame.Home = {
    tabId: "home",
    tabDiscovered: true,
    tabSeen: true,
    tabName: "Home Sea",
    tabBg: "img/bg/bg-homesea.png",

    currentButtonTab: null,
    currentExtraMessageIndex: null,

    buttonNamesList: [],

    // Priority: later messages display if available, otherwise earlier ones.
    extraMessages: {
        // FIRST RUN
        start: [
            {
                name: "start-you-are-a-shark",
                message: "You feel a bit hungry.",
            },
            {
                name: "start-shark",
                unlock: { totalResource: { fish: 5 } },
                message: "You attract the attention of a shark. Maybe they can help you catch fish!",
            },
            {
                name: "start-sharks",
                unlock: { resource: { shark: 2 } },
                message: "More sharks swim over, curious and watchful.",
            },
            {
                name: "start-ray",
                unlock: { resource: { shark: 5 } },
                message: "Some rays drift over.",
            },
            {
                name: "start-quite-the-group",
                unlock: { resource: { shark: 6, ray: 2 } },
                message: "You have quite the group going now.",
            },
            {
                name: "start-crab",
                unlock: { resource: { shark: 10, ray: 4 } },
                message: "Some curious crabs come over.",
            },
            {
                name: "start-tribe",
                unlock: { resource: { shark: 12, ray: 4, crab: 5 } },
                message: "Your new tribe is at your command!",
            },
            {
                name: "start-crystals",
                unlock: { resource: { shark: 1, crystal: 10 } },
                message: "The crystals are shiny. Some sharks stare at them curiously.",
            },
            {
                name: "start-science",
                unlock: { resource: { scientist: 1 } },
                message: "The science sharks swim in their own school.",
            },
            {
                name: "start-discoveries",
                unlock: { upgrade: ["crystalContainer"] },
                message: "More discoveries are needed.",
            },
            {
                name: "start-nurse",
                unlock: { resource: { nurse: 1 } },
                message: "The shark community grows with time.",
            },
            {
                name: "start-exploration",
                unlock: { upgrade: ["exploration"] },
                message: "You hear faint songs and cries in the distance.",
            },
            {
                name: "start-machines",
                unlock: { upgrade: ["automation"] },
                message: "Machines to do things for you.<br>Machines to do things faster than you or any shark.",
            },
            {
                name: "start-chasm",
                unlock: { upgrade: ["farExploration"] },
                message: "This place is not your home. You remember a crystal blue ocean.<br>The chasms beckon.",
            },
            {
                name: "start-gate",
                unlock: { upgrade: ["gateDiscovery"] },
                message: "The gate beckons. The secret must be unlocked.",
            },
        ],

        // LATER RUNS
        marine: [
            {
                name: "marine-default",
                message: "Schools of fish fill the vast expanse. This place feels so familiar.",
            },
            {
                name: "marine-noticed-lobsters",
                unlock: { upgrade: ["crystalContainer"] },
                message: "You notice some creatures on the ocean floor. They laze about and ignore your presence.",
            },
            {
                name: "marine-noticed-lobsters-2",
                unlock: { upgrade: ["seabedGeology"] },
                message: "You notice some creatures on the ocean floor. They laze about and ignore your presence.",
            },
            {
                name: "marine-lobsters",
                unlock: { totalResource: { lobster: 1 } },
                message: "The lobsters work, but seem carefree. They worry about nothing.",
            },
            {
                name: "marine-lobsters-talk",
                unlock: { totalResource: { lobster: 125 } },
                message: "When the lobsters talk, they speak of the good old days. They talk a lot.",
            },
            {
                name: "marine-calcinium",
                unlock: { totalResource: { calcinium: 1 } },
                message: "Calcinium. It's rough, hard, and chalky. It feels fragile, but isn't.",
            },
            {
                name: "marine-robotics",
                unlock: { totalResource: { clamScavenger: 1 } },
                message: "A cold, rough limb fishes clams out of the seabed. The lobsters watch intently.",
            },
            {
                // do color transition 1 here
                name: "marine-bioengineering",
                unlock: { upgrade: ["bioengineering"] },
                message:
                    "Stone-to-brain interface. Shelbernetic enhancements. Population automation. The lobsters say that calcinium is an extension of life itself.",
            },
            {
                // second color transition
                name: "marine-sentience",
                unlock: { upgrade: ["sentientCircuitBoards"] },
                message: "All of us have boards now. Children are born half-machine. The lobsters call it effective.",
                // we can't understand it, no, we could never hope to understand it like the lobsters do
                // 'they [the circuits] even die...just like us.'
            },
            {
                // final color transition
                name: "marine-abandoned",
                unlock: { upgrade: ["mobiusShells"] },
                message: "Murk spills out of the frenzy. A rancid fog begins to descend. This dying world drags everyone down with it.",
            },
        ],

        haven: [
            {
                name: "haven-default",
                message: "These oceans are rich with life. A thriving reef surrounds you.",
            },
            {
                name: "haven-dolphin-observes",
                unlock: { totalResource: { coral: 75 } },
                message: "A... thing observes us from afar. What the heck is that??",
                scales: true,
            },
            {
                name: "haven-dolphins",
                unlock: { totalResource: { dolphin: 1 }, homeAction: ["getDolphin"] },
                message:
                    "A dolphin joins the frenzy. We told it to go get fish, but it came back with coral. It insists that the coral is more valuable.",
            },
            {
                name: "haven-dolphin-empire",
                unlock: { totalResource: { dolphin: 20 } },
                message:
                    "The dolphin pods that work with us speak of a star-spanning empire of their kind. They ask where our empire is. And they smile.",
                scales: true,
            },
            {
                name: "haven-papyrus",
                unlock: { upgrade: ["sunObservation"] },
                message: "Pieces of condensed kelp (???) are washing up in the currents.<br/>Something is carved into them.",
            },
            {
                name: "haven-stories",
                unlock: { upgrade: ["delphineHistory"] },
                message:
                    "The dolphin's self-indulgent tales make frequent references to a mystical gate. And, they don't know where it is. Of course they don't.",
            },
            {
                name: "haven-whales",
                unlock: { totalResource: { whale: 1 }, homeAction: ["getWhale"] },
                message: "The whales speak rarely to us, working in silence as they sing to the ocean. What do they sing for?",
            },
            {
                name: "haven-history",
                unlock: { upgrade: ["retroactiveRecordkeeping"] },
                message:
                    "The grand sum of all dolphin knowledge is laid out before us,<br/>and it is pitifully small. The original collections have been lost to time.",
            },
            {
                name: "haven-song",
                unlock: { upgrade: ["whaleSong"] },
                message: "The whale song fills you with the same feeling as the gates. But so much smaller.",
            },
            {
                name: "haven-done",
                unlock: { resource: { chorus: 1 } },
                message: "The great song booms across the open water, carrying itself to all corners of the ocean.<br/>The gate reacts.",
            },
        ],

        tempestuous: [
            {
                name: "tempestuous-default",
                message: "The storm never ends, and many are lost to its violent throes.",
            },
        ],

        volcanic: [
            {
                name: "volcanic-default",
                message: "Scorching vents fill the sea with white and black smoke. There's not a shark in sight.",
            },
            {
                name: "volcanic-shrimp-contact",
                unlock: { totalResource: { sponge: 1 } },
                message: `You are approached by a single shrimp. They relay a message to you: stop harvesting sponges, or face the wrath of the king of shrimps.`,
            },
            {
                name: "volcanic-shrimp-threat",
                unlock: {
                    custom() {
                        return SharkGame.flags.prySpongeGained > 200 && !SharkGame.flags.gotFarmsBeforeShrimpThreat;
                    },
                },
                message: `You are approached by an army of shrimp. They relay a very clear message to you: cooperate, or be destroyed. You decide to stop harvesting sponges.`,
            },
            {
                name: "volcanic-shrimp-communication",
                unlock: { upgrade: ["consistentCommunication"] },
                message: "The homes (sponges) left behind by shrimp joining the frenzy may now be taken for ourselves.",
            },
            {
                name: "volcanic-monarchy",
                unlock: { totalResource: { queen: 1 } },
                message: "The shrimps follow a caste system with the king of shrimps on top. They ask who your king is.",
            },
            {
                name: "volcanic-shrimps",
                unlock: { upgrade: ["sustainableSolutions"] },
                message:
                    "The shrimp speak of an ancient visitor who violated their world, and how they wish to restore it. They work hard for their future.",
            },
            {
                name: "volcanic-smithing",
                unlock: { totalResource: { porite: 1 } },
                message: "Porite: glassy hunks sealed on the outside but porous on the inside: it's lightweight, yet it stays strong.",
            },
            {
                name: "volcanic-noticed",
                unlock: { upgrade: ["glassTempering"] },
                message: "The king has finally caught wind of your plans, rumors say. They say he plans to destroy the entire frenzy.",
            },
            {
                name: "volcanic-acolytes",
                unlock: { upgrade: ["algaeAcolytes"] },
                message: "The acolytes gather. They pray for their king. They pray for their world. They pray for you.",
            },
            // Rumor has it that the king of shrimps guards the key to a secret, sacred gate in his sandcastle.
            {
                name: "volcanic-beauty",
                unlock: { upgrade: ["finalDraft"] },
                message: "The king is speechless. As he views the great industrial city, his subjects gather and cheer, celebrating his arrival.",
            },
            {
                name: "volcanic-hope",
                unlock: { upgrade: ["apologeticAmnesty"] },
                message: `"Perhaps not all sharks are so vile," says the king of shrimps. "Perhaps, you will be different."`,
            },
        ],

        abandoned: [
            {
                name: "abandoned-default",
                message: "The tar clogs the gills of everyone here. This dying world drags everyone down with it.",
            },
            {
                name: "abandoned-octopus-scrutinizes",
                unlock: { upgrade: ["statsDiscovery"] },
                message: "An octopus wanders over. It scrutinizes your attempt at organization.",
            },
            {
                name: "abandoned-octopus",
                unlock: { totalResource: { octopus: 1 } },
                message: "The octopus works tirelessly.",
            },
            {
                name: "abandoned-octopuses",
                unlock: { totalResource: { octopus: 8 } },
                message: "More octopuses join. They work in perfect unison.",
            },
            {
                name: "abandoned-production",
                unlock: { upgrade: ["octopusMethodology"] },
                message:
                    "The octopuses speak of production and correct action. They speak of unity through efficiency. They regard us with cold, neutral eyes.",
            },
            {
                name: "abandoned-spronge",
                unlock: { resource: { spronge: 1 } },
                message: "Residue pumps through spronge like blood. It pulses and throbs.",
            },
            {
                name: "abandoned-exploration",
                unlock: { upgrade: ["exploration"] },
                message: "Great spires loom in the distance. Loose cables are strung together on the horizon.",
            },
            {
                name: "abandoned-gate",
                unlock: { upgrade: ["farAbandonedExploration"] },
                message:
                    "This gate stands inert and lifeless like the city around it. The slots are already filled, but it looks like it's turned off.",
            },
            {
                name: "abandoned-reverse-engineering",
                unlock: { upgrade: ["reverseEngineering"] },
                message:
                    "The components spin and whirr and click together, but their purpose eludes us. What secrets are you hiding in your mechanisms?",
            },
            {
                name: "abandoned-high-energy-fusion",
                unlock: { upgrade: ["highEnergyFusion"] },
                message: "The light is blinding, but the output is worth it. The pieces of a broken past unite to create a brighter future.",
            },
            {
                name: "abandoned-done",
                unlock: { upgrade: ["artifactAssembly"] },
                message: "...",
            },
            {
                name: "abandoned-tar-one",
                unlock: { resource: { tar: 5 } },
                message: "The tar is killing everything! Maybe a filter could save us?",
            },
            {
                name: "abandoned-tar-two",
                unlock: { resource: { tar: 200 } },
                message: "Only machines will remain. All is lost. <span class='smallDesc'>All is lost.</span>",
            },
        ],

        shrouded: [
            {
                name: "shrouded-default",
                message: "The crystals are easier to find, but the darkness makes it hard to find anything else.",
            },
            {
                name: "shrouded-eel-onlookers",
                unlock: { upgrade: ["crystalContainer"] },
                message: "Divers have reported sightings of wiggly things on the ocean floor. They dart into their holes when approached.",
            },
            {
                name: "shrouded-eels",
                unlock: { totalResource: { eel: 1 } },
                message: "The eels chatter among their hiding places. They like the sharks.",
            },
            {
                name: "shrouded-distant-chimaeras",
                unlock: { upgrade: ["exploration"] },
                message: "In the fog of darkness, the shapes of strange creatures can be made out. They dart away when light approaches.",
            },
            {
                name: "shrouded-chimaeras",
                unlock: { totalResource: { chimaera: 1 } },
                message:
                    "The chimaeras imply they are ancient kin of the shark kind, reunited through wild coincidence. We don't understand, but they seem to think we do.",
            },
            {
                name: "shrouded-arcana",
                unlock: { totalResource: { arcana: 5 } },
                message: "These hadal artifacts glow faintly, only in pitch blackness. That glow makes you feel something that you don't understand.",
            },
            {
                name: "shrouded-power",
                unlock: { totalResource: { sacrifice: 100 } },
                message:
                    "Every broken shard disintegrates in a blinding flash of light. That familiar feeling washes over you with every sacrifice. The sharp snap of broken arcana echoes in your mind.",
            },
            {
                name: "shrouded-city",
                unlock: { upgrade: ["arcaneHeart"] },
                message: "The sounds of explorers echo endlessly through the tunnels of the broken city. The eels say they are filled with hope.",
            },
            {
                name: "shrouded-truth",
                unlock: { totalResource: { sacrifice: 9000000000000000 } },
                message: "A team of eels get your attention. They show you something that they found in the caverns. It's a book on making arcana.",
            },
        ],

        frigid: [
            {
                name: "frigid-default",
                message: "Giant shards of glassy ice surround you on all sides.",
            },
            {
                name: "frigid-ice-one",
                unlock: { resource: { ice: 100 } },
                message: "You feel tired.",
            },
            {
                name: "frigid-icy-doom",
                unlock: { resource: { ice: 500 } },
                message: "So cold. So hungry. <span class='smallDesc'>So hopeless.</span>",
            },
            {
                name: "frigid-distant-village",
                unlock: { totalResource: { science: 8 } },
                message: "While scanning the horizon, you notice a gap in the ice. You peer through it, and spot something else.",
                scales: true,
            },
            {
                name: "frigid-village",
                unlock: { upgrade: ["civilContact"] },
                message:
                    "A small village of squid greets you respectfully. The water in this place is a little warmer, and you hear a quiet, ambient hum.",
            },
            {
                name: "frigid-urchins",
                unlock: { totalResource: { urchin: 2 } },
                message:
                    "The urchins scuttle along the ground and hop about, gathering kelp and placing it into a large, central pile. They know nothing but the kelp.",
            },
            {
                name: "frigid-teamwork",
                unlock: { totalResource: { extractionTeam: 1 } },
                message: "The squid champion the value of teamwork and the necessity of cooperation. They say they follow by example.",
            },
            {
                name: "frigid-machine",
                unlock: { totalResource: { squid: 125 } },
                message:
                    "In the center of the settlement lies a vibrating...thing, and a strange gate. The thing buzzes loudly, casting enormous energy across the water.",
                scales: true,
            },
            {
                name: "frigid-squid",
                unlock: { totalResource: { squid: 250 } },
                message: "The squid speak of an ancient visitor who saved their world. They ask if you too, have seen this visitor.",
                scales: true,
            },
            {
                name: "frigid-suspicion",
                unlock: { upgrade: ["automation"] },
                message: "The squid describe the machine with fascination. They ask if we feel the same. They see something we do not.",
            },
            {
                name: "frigid-battery",
                unlock: { upgrade: ["internalInquiry"] },
                message:
                    "Buried deep within the complex lies a massive, dimly glowing battery. The squid say replacing it will get the machine running at full power.",
            },
            {
                name: "frigid-heat-returns",
                unlock: { upgrade: ["rapidRecharging"] },
                message: "A wave of heat washes over you, and the dingy complex comes back to life. The gate turns on.",
            },
            /* {
                name: "frigid-end",
                unlock: { upgrade: ["rapidRepairs"] },
                message: "The gate opens. The squid bid you farewell.",
            }, */
            // another one: "the maw of the gate opens"
        ],
        /*
        {
            message:
                "The jagged seafloor looks ancient, yet pristine.<br>Sponges thrive in great numbers on the rocks.",
        },
        */
    },

    init() {
        SharkGame.TabHandler.registerTab(this);
        SharkGame.HomeActions.generated = {};

        /*         // populate action discoveries (and reset removals)
        _.each(SharkGame.HomeActions.getActionTable(), (actionData) => {
            actionData.discovered = false;
            actionData.newlyDiscovered = false;
            actionData.isRemoved = false;
        }); */

        home.currentExtraMessageIndex = -1;
        home.currentButtonTab = "all";
    },

    setup() {
        // rename home tab
        const tabName = SharkGame.WorldTypes[world.worldType].name + " Ocean";
        home.tabName = tabName;
        if (SharkGame.Tabs.home) {
            SharkGame.Tabs.home.name = tabName;
        }
        home.discoverActions();
    },

    switchTo() {
        this.buttonNamesList = [];
        const content = $("#content");
        const tabMessage = $("<div>").attr("id", "tabMessage");
        content.append(tabMessage);
        home.currentExtraMessageIndex = -1;
        home.updateMessage(true);
        // button tabs
        const buttonTabDiv = $("<div>").attr("id", "homeTabs");
        content.append(buttonTabDiv);
        home.createButtonTabs();
        // buy amount buttons
        if (SharkGame.persistentFlags.revealedBuyButtons) {
            main.createBuyButtons("buy", content, "append");
        }
        // button list
        const buttonList = $("<div>").attr("id", "buttonList").addClass("homeScreen");
        content.append(buttonList);
        // background art!
        if (SharkGame.Settings.current.showTabImages) {
            tabMessage.css("background-image", "url('" + home.tabBg + "')");
        }
        this.update();
    },

    discoverActions() {
        $.each(SharkGame.HomeActions.getActionTable(), (actionName, actionData) => {
            actionData.discovered = home.areActionPrereqsMet(actionName);
            actionData.newlyDiscovered = false;
        });
    },

    createButtonTabs() {
        const buttonTabDiv = $("#homeTabs");
        const buttonTabList = $("<ul>").attr("id", "homeTabsList");
        buttonTabDiv.empty();
        let tabAmount = 0;

        if (!SharkGame.persistentFlags.revealedButtonTabs) return;

        // add a header for each discovered category
        // make it a link if it's not the current tab
        $.each(SharkGame.HomeActionCategories, (categoryName, category) => {
            const onThisTab = home.currentButtonTab === categoryName;

            let categoryDiscovered = false;
            if (categoryName === "all") {
                categoryDiscovered = true;
            } else {
                // Check if any action in category is discovered
                categoryDiscovered = _.some(category.actions, (actionName) => {
                    const actionTable = SharkGame.HomeActions.getActionTable();
                    // True if it exists and is discovered
                    return _.has(actionTable, actionName) && actionTable[actionName].discovered;
                });
            }

            if (categoryDiscovered) {
                const tabListItem = $("<li>");
                if (onThisTab) {
                    tabListItem.html(category.name);
                } else {
                    tabListItem.append(
                        $("<a>")
                            .attr("id", "buttonTab-" + categoryName)
                            .attr("href", "javascript:;")
                            .html(category.name)
                            .on("click", function callback() {
                                if ($(this).hasClass(".disabled")) return;
                                const tab = $(this).attr("id").split("-")[1];
                                home.changeButtonTab(tab);
                            })
                    );
                    if (category.hasNewItem) {
                        tabListItem.addClass("newItemAdded");
                    }
                }
                buttonTabList.append(tabListItem);
                tabAmount++;
            }
        });
        // finally at the very end just throw the damn list away if it only has two options
        // "all" + another category is completely pointless
        if (tabAmount > 2) {
            buttonTabDiv.append(buttonTabList);
        }
    },

    updateTab(tabToUpdate) {
        // return if we're looking at all buttons, no change there
        if (home.currentButtonTab === "all") {
            return;
        }
        SharkGame.HomeActionCategories[tabToUpdate].hasNewItem = true;
        const tabItem = $("#buttonTab-" + tabToUpdate);
        if (tabItem.length > 0) {
            tabItem.parent().addClass("newItemAdded");
        } else {
            home.createButtonTabs();
        }
    },

    changeButtonTab(tabToChangeTo) {
        SharkGame.HomeActionCategories[tabToChangeTo].hasNewItem = false;
        if (tabToChangeTo === "all") {
            _.each(SharkGame.HomeActionCategories, (category) => {
                category.hasNewItem = false;
            });
        }
        home.currentButtonTab = tabToChangeTo;
        $("#buttonList").empty();
        home.createButtonTabs();
        home.update();
    },

    getButtonTabs() {
        const buttonTabsArray = [];
        $.each(SharkGame.HomeActionCategories, (categoryName) => {
            if ($(`#buttonTab-${categoryName}`).html() || home.currentButtonTab === categoryName) {
                buttonTabsArray.push(categoryName);
            }
        });
        return buttonTabsArray;
    },

    getNextButtonTab() {
        const tabs = this.getButtonTabs();
        const currentTabIndex = tabs.indexOf(home.currentButtonTab);

        if (currentTabIndex === tabs.length - 1) {
            return tabs[0];
        }
        return tabs[currentTabIndex + 1];
    },

    getPreviousButtonTab() {
        const tabs = this.getButtonTabs();
        const currentTabIndex = tabs.indexOf(home.currentButtonTab);

        if (currentTabIndex === 0) {
            return tabs[tabs.length - 1];
        }
        return tabs[currentTabIndex - 1];
    },

    updateMessage(suppressAnimation) {
        const worldType = SharkGame.WorldTypes[world.worldType];
        const events = home.extraMessages[world.worldType];

        const selectedIndex = _.findLastIndex(events, (extraMessage) => {
            // check if all requirements met
            if (_.has(extraMessage, "unlock")) {
                let requirementsMet = true;
                requirementsMet =
                    requirementsMet &&
                    _.every(extraMessage.unlock.resource, (requiredAmount, resourceId) => {
                        return res.getResource(resourceId) >= requiredAmount;
                    });
                requirementsMet =
                    requirementsMet &&
                    _.every(extraMessage.unlock.totalResource, (requiredAmount, resourceId) => {
                        return res.getTotalResource(resourceId) >= requiredAmount;
                    });
                requirementsMet =
                    requirementsMet && _.every(extraMessage.unlock.upgrade, (upgradeId) => SharkGame.Upgrades.purchased.includes(upgradeId));
                requirementsMet =
                    requirementsMet &&
                    _.every(extraMessage.unlock.homeAction, (actionName) => {
                        const action = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName);
                        return action.discovered && !action.newlyDiscovered;
                    });
                if (extraMessage.unlock.custom) {
                    requirementsMet = requirementsMet && extraMessage.unlock.custom();
                }

                return requirementsMet;
            }
            return true;
        });

        // only edit DOM if necessary
        if (home.currentExtraMessageIndex !== selectedIndex) {
            home.currentExtraMessageIndex = selectedIndex;
            const messageData = events[selectedIndex];
            const tabMessage = $("#tabMessage");
            let sceneDiv;
            if (SharkGame.Settings.current.showTabImages) {
                sceneDiv = $("#tabSceneImage");
                if (sceneDiv.length === 0) {
                    sceneDiv = $("<div>").attr("id", "tabSceneImage");
                }
            }
            let message = "<strong class='medDesc'>You are a shark in a " + worldType.shortDesc + " sea.</strong>";
            message += "<br><strong id='extraMessage'><br></strong>";
            tabMessage.html(message).prepend(sceneDiv);

            const extraMessageSel = $("#extraMessage");
            if (!suppressAnimation && SharkGame.Settings.current.showAnimations) {
                extraMessageSel.animate({ opacity: 0 }, 200, () => {
                    $(extraMessageSel).animate({ opacity: 1 }, 200).html(messageData.message);
                });
                sceneDiv.animate({ opacity: 0 }, 500, () => {
                    if (SharkGame.Settings.current.showTabImages) {
                        SharkGame.changeSprite(SharkGame.spriteHomeEventPath, messageData.name, sceneDiv, "missing");
                    }
                    $(sceneDiv).animate({ opacity: 1 }, 500);
                });
            } else {
                extraMessageSel.html(events[selectedIndex].message);
                if (SharkGame.Settings.current.showTabImages) {
                    SharkGame.changeSprite(SharkGame.spriteHomeEventPath, messageData.name, sceneDiv, "missing");
                }
            }
        }
    },

    update() {
        // for each button entry in the home tab,
        $.each(SharkGame.HomeActions.getActionTable(), (actionName, actionData) => {
            const actionTab = home.getActionCategory(actionName);
            const onTab = actionTab === home.currentButtonTab || home.currentButtonTab === "all";
            if (onTab && !actionData.isRemoved) {
                const button = $("#" + actionName);
                if (button.length === 0) {
                    if (actionData.discovered || home.areActionPrereqsMet(actionName)) {
                        if (!actionData.discovered) {
                            actionData.discovered = true;
                            actionData.newlyDiscovered = true;
                        }
                        home.addButton(actionName);
                        home.createButtonTabs();
                    }
                } else {
                    // button exists
                    home.updateButton(actionName);
                }
            } else {
                if (!actionData.discovered) {
                    if (home.areActionPrereqsMet(actionName)) {
                        actionData.discovered = true;
                        actionData.newlyDiscovered = true;
                        home.updateTab(actionTab);
                    }
                }
            }
        });

        // update home message
        home.updateMessage();

        // update hovering messages
        if (document.getElementById("tooltipbox").className.split(" ").includes("forHomeButtonOrGrotto")) {
            if (document.getElementById("tooltipbox").attributes.current) {
                home.onHomeHover(null, document.getElementById("tooltipbox").attributes.current.value);
            }
        }
    },

    updateButton(actionName) {
        if (!sharkmath.getBuyAmount()) {
            return;
        }
        const amountToBuy = new Decimal(sharkmath.getBuyAmount());

        const button = $("#" + actionName);
        const actionData = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName);

        if (actionData.removedBy) {
            if (home.shouldRemoveHomeButton(actionData)) {
                button.remove();
                SharkGame.HomeActions.getActionTable()[actionName].isRemoved = true;
                SharkGame.HomeActions.getActionTable()[actionName].discovered = true;
                return;
            }
        }
        let amount = amountToBuy;
        let enableButton = true;
        if (amountToBuy.lessThan(0)) {
            // unlimited mode, calculate the highest we can go
            const max = home.getMax(actionData);
            const divisor = new Decimal(1).dividedBy(amountToBuy.times(-1));
            amount = max.times(divisor);
            if (amount.lessThan(1)) {
                if (amount.times(amountToBuy.times(-1)).greaterThanOrEqualTo(1 - SharkGame.EPSILON)) {
                    enableButton = true;
                } else {
                    enableButton = false;
                }
                amount = new Decimal(1);
            }
            amount = amount.round();
        }
        const actionCost = home.getCost(actionData, amount);

        // keep button disabled if the max returned less than 1
        if (enableButton) {
            // disable button if resources can't be met
            enableButton = res.checkResources(actionCost);
        }

        if ($.isEmptyObject(actionCost)) {
            enableButton = true; // always enable free buttons
        }

        let label = actionData.name;
        if (!$.isEmptyObject(actionCost) && amount.greaterThan(1)) {
            label += " (" + sharktext.beautify(amount.toNumber()) + ")";
        }

        if (enableButton) {
            button.removeClass("disabled");
        } else {
            button.addClass("disabled");
        }

        // check for any infinite quantities
        if (_.some(actionCost, (cost) => !cost.isFinite())) {
            label += "<br>Maxed out";
        } else {
            const costText = sharktext.resourceListToString(actionCost, !enableButton, sharkcolor.getElementColor(actionName, "background-color"));
            if (costText !== "") {
                label += "<br>Cost: " + costText;
            }
        }

        label = $('<span id="' + actionName + 'Label" class="click-passthrough">' + label + "</span>");

        // Only redraw the whole button when necessary.
        // This is necessary when buttons are new, or the icon setting has been changed.
        // We can detect both cases for the icon-on settings by making sure we have an icon
        // class that matches the setting.
        // The icon-off setting is a little trickier.  It needs two cases.  We check for a lack of spans to
        // see if the button is new, then check for the presence of any icon to see if the setting changed.
        if (button.html().includes("button-icon") !== SharkGame.Settings.current.showIcons) {
            button.html(label);

            let spritename;
            switch (actionName) {
                case "getUrchin":
                    spritename = Math.random() < 0.002 ? "actions/getUrchinHatted" : "actions/getUrchin";
                    break;
                case "getLobster":
                    spritename = Math.random() < 0.002 ? "actions/getLobter" : "actions/getLobster";
                    break;
                default:
                    spritename = "actions/" + actionName;
            }
            if (SharkGame.Settings.current.showIcons) {
                const iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "general/missing-action");
                if (iconDiv) {
                    iconDiv.addClass("button-icon");
                    button.prepend(iconDiv);
                }
            }
        } else {
            // The button already exists, so don't waste time drawing the icon.
            // Only redraw the label, and even then only if it's changed.
            const labelSpan = $("#" + actionName + "Label");

            // Quote-insensitive comparison, because the helper methods beautify the labels using single quotes
            // but jquery returns the same elements back with double quotes.
            if (label.html() !== labelSpan.html()) {
                labelSpan.html(label.html());
            }
        }
    },

    areActionPrereqsMet(actionName) {
        const action = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName);
        if (action.unauthorized) {
            return false;
        } else if (!_.isUndefined(action.unauthorized)) {
            return true;
        }
        // check to see if this action should be forcibly removed
        if (action.removedBy && home.shouldRemoveHomeButton(action)) {
            return false;
        }

        // check resource prerequisites
        if (action.prereq.resource && !res.checkResources(action.prereq.resource, true)) {
            return false;
        }

        // check if resource cost exists
        if (!_.every(action.cost, (cost) => world.doesResourceExist(cost.resource))) {
            return false;
        }

        // check special worldtype prereqs
        if (action.prereq.world && world.worldType !== action.prereq.world) {
            return false;
        }

        // check the special worldtype exclusions
        if (action.prereq.notWorlds && action.prereq.notWorlds.includes(world.worldType)) {
            return false;
        }

        // check upgrade prerequisites
        if (!_.every(action.prereq.upgrade, (upgradeId) => SharkGame.Upgrades.purchased.includes(upgradeId))) {
            return false;
        }
        // check if resulting resource exists
        if (!_.every(action.effect.resource, (_amount, resourceId) => world.doesResourceExist(resourceId))) {
            return false;
        }
        // if nothing fails, return true
        return true;
    },

    shouldHomeButtonBeUsable(_actionData) {
        let shouldBeUsable = true;

        if (cad.pause || cad.stop) {
            shouldBeUsable = false;
        }
        // this function might contain more stuff later
        // for now, the only exception to being able to
        // use home buttons is if the game is paused
        return shouldBeUsable;
    },

    shouldRemoveHomeButton(action) {
        let disable = false;
        $.each(action.removedBy, (kind, when) => {
            switch (kind) {
                case "totalResourceThreshold":
                    disable = disable || _.some(when, (resourceObject) => res.getTotalResource(resourceObject.resource) >= resourceObject.threshold);
                    break;
                case "otherActions":
                    disable = disable || _.some(when, (otherAction) => home.areActionPrereqsMet(otherAction));
                    break;
                case "upgrades":
                    disable = disable || _.some(when, (upgrade) => SharkGame.Upgrades.purchased.includes(upgrade));
                    break;
                case "custom":
                    disable = disable || when();
            }
        });
        return disable;
    },

    addButton(actionName) {
        this.buttonNamesList.push(actionName);

        const buttonListSel = $("#buttonList");
        const actionData = SharkGame.HomeActions.getActionTable()[actionName];

        const buttonSelector = SharkGame.Button.makeHoverscriptButton(
            actionName,
            actionData.name,
            buttonListSel,
            home.onHomeButton,
            home.onHomeHover,
            home.onHomeUnhover
        ); // box-shadow: 0 0 6px 3px #f00, 0 0 3px 1px #ff1a1a inset;
        buttonSelector.html($("<span id='" + actionName + "Label' class='click-passthrough'></span>"));
        home.updateButton(actionName);
        if (SharkGame.Settings.current.showAnimations) {
            buttonSelector.hide().css("opacity", 0).slideDown(50).animate({ opacity: 1.0 }, 50);
        }
        if (home.shouldBeNewlyDiscovered(actionName, actionData)) {
            buttonSelector.addClass("newlyDiscovered");
        }
        // still need to add increases/decreases check here, but this is not relevant to the actual game yet so i dont care
        if (home.doesButtonGiveNegativeThing(actionData)) {
            buttonSelector.addClass("gives-consumer");
        }
    },

    doesButtonGiveNegativeThing(actionData) {
        let givesBadThing = false;
        $.each(actionData.effect.resource, (resourceName) => {
            // still need to add increases/decreases check here, but this is not relevant to the actual game yet so i dont care
            if (
                _.some(
                    SharkGame.ResourceMap.get(resourceName).income,
                    (incomeAmount, resource) =>
                        world.doesResourceExist(resource) &&
                        ((incomeAmount < 0 && !res.isInCategory(resource, "harmful")) || (res.isInCategory(resource, "harmful") && incomeAmount > 0))
                )
            ) {
                givesBadThing = true;
                return false;
            }
        });
        return givesBadThing;
    },

    shouldBeNewlyDiscovered(actionName, actionData) {
        if (SharkGame.Aspects.pathOfTime.level) {
            if (actionName === "getCrab" && world.doesResourceExist("crab")) return false;
            if (actionName === "getDiver" && world.doesResourceExist("diver")) return false;
        }
        return actionData.newlyDiscovered;
    },

    getActionCategory(actionName) {
        return _.findKey(SharkGame.HomeActionCategories, (category) => {
            return _.some(category.actions, (action) => action === actionName);
        });
    },

    onHomeButton(_placeholder, actionName) {
        const amountToBuy = new Decimal(sharkmath.getBuyAmount());
        let button;
        if (!actionName) {
            // get related entry in home button table
            button = $(this);
            actionName = button.attr("id");
        } else {
            button = $("#" + actionName);
        }

        if (SharkGame.Keybinds.bindMode) {
            SharkGame.Keybinds.settingAction = actionName;
            SharkGame.Keybinds.updateBindModeState();
            return;
        }

        if (button.hasClass("disabled")) return;
        const action = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName);
        let actionCost = {};
        let amount = new Decimal(0);
        if (amountToBuy.lessThan(0)) {
            // unlimited mode, calculate the highest we can go
            const max = home.getMax(action);
            // floor max
            if (max > 0) {
                // convert divisor from a negative number to a positive fraction
                const divisor = new Decimal(1).dividedBy(amountToBuy.times(-1));
                amount = max.times(divisor);
                // floor amount
                amount = amount.round();
                // make it worth entering this function
                if (amount.lessThan(1)) amount = new Decimal(1);
                actionCost = home.getCost(action, amount);
            } else {
                return;
            }
        } else {
            actionCost = home.getCost(action, amountToBuy);
            amount = amountToBuy;
        }

        if ($.isEmptyObject(actionCost) && !amount.equals(0)) {
            // free action
            // do not repeat or check for costs
            if (action.effect.resource) {
                res.changeManyResources(action.effect.resource);
            }
            if (action.effect.events) {
                _.each(action.effect.events, (eventName) => {
                    SharkGame.Events[eventName].trigger();
                });
            }
            log.addMessage(SharkGame.choose(action.outcomes));
        } else if (amount.greaterThan(0)) {
            // cost action
            if (action.effect.events) {
                _.each(action.effect.events, (eventName) => {
                    SharkGame.Events[eventName].trigger();
                });
            }

            // did the player just purchase sharkonium?
            if (actionName === "transmuteSharkonium") {
                // did they only buy one for some reason?
                if (amountToBuy.equals(1)) {
                    // keep track of how many times they've done that
                    if (!SharkGame.persistentFlags.individuallyBoughtSharkonium) {
                        SharkGame.persistentFlags.individuallyBoughtSharkonium = 0;
                    }
                    if (SharkGame.persistentFlags.individuallyBoughtSharkonium !== -1) {
                        SharkGame.persistentFlags.individuallyBoughtSharkonium += 1;
                    }
                } else {
                    // otherwise they know what they're doing, stop keeping track
                    SharkGame.persistentFlags.individuallyBoughtSharkonium = -1;
                }
                // see remindAboutBuyMax event
            }

            // check cost, only proceed if sufficient resources (prevention against lazy cheating, god, at least cheat in the right resources)
            if (res.checkResources(actionCost)) {
                // take cost
                res.changeManyResources(actionCost, true);
                // execute effects
                if (action.effect.resource) {
                    let resourceChange;
                    if (!amount.equals(1)) {
                        resourceChange = res.scaleResourceList(action.effect.resource, amount);
                    } else {
                        resourceChange = action.effect.resource;
                    }
                    res.changeManyResources(resourceChange);
                }
                // print outcome to log
                if (!action.multiOutcomes || amount.equals(1)) {
                    log.addMessage(SharkGame.choose(action.outcomes));
                } else {
                    log.addMessage(SharkGame.choose(action.multiOutcomes));
                }
            } else {
                log.addMessage("You can't afford that!");
            }
        }
        if (button.hasClass("newlyDiscovered")) {
            SharkGame.HomeActions.getActionTable()[actionName].newlyDiscovered = false;
            button.removeClass("newlyDiscovered");
        }
        // disable button until next frame
        button.addClass("disabled");
    },

    onHomeHover(mouseEnterEvent, actionName) {
        if (!SharkGame.Settings.current.showTooltips || (!actionName && !mouseEnterEvent) || !main.shouldShowTooltips()) {
            return;
        }

        if (!actionName) {
            const button = $(this);
            actionName = button.attr("id");
        }

        $("#tooltipbox").removeClass("gives-consumer");

        const actionData = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName);
        const effects = actionData.effect;
        const validGenerators = {};
        $.each(effects.resource, (resource) => {
            $.each(SharkGame.ResourceMap.get(resource).income, (incomeResource) => {
                const genAmount = res.getProductAmountFromGeneratorResource(resource, incomeResource, 1);
                if (genAmount !== 0 && world.doesResourceExist(incomeResource)) {
                    validGenerators[incomeResource] = genAmount;
                }
            });
        });

        let buyingHowMuch = 1;
        if (
            !SharkGame.Settings.current.alwaysSingularTooltip &&
            actionData.cost.length > 0 &&
            !_.some(actionData.cost, (costData) => {
                return costData.costFunction === "unique";
            })
        ) {
            buyingHowMuch = sharkmath.getPurchaseAmount(undefined, home.getMax(actionData).toNumber());
            if (buyingHowMuch < 1) {
                buyingHowMuch = 1;
            }
        }

        const usePlural =
            (_.some(effects.resource, (_amount, name) => sharktext.getDeterminer(name)) &&
                (buyingHowMuch > 1 || _.some(effects.resource, (amount) => amount > 1))) ||
            _.keys(effects.resource).length > 1;
        let addedAnyLabelsYet = false; // this keeps track of whether or not little tooltip text has already been appended

        // append valid stuff for generators like production
        let text = "";

        if (_.some(validGenerators, (amount) => amount > 0)) {
            if (_.some(validGenerators, (amount, resourceName) => amount > 0 && res.isInCategory(resourceName, "harmful"))) {
                $("#tooltipbox").addClass("gives-consumer");
            }
            text += "<span class='littleTooltipText'>PRODUCE" + (usePlural ? "" : "S") + "</span><br/>";
            addedAnyLabelsYet = true;
        }

        $.each(validGenerators, (incomeResource, amount) => {
            if (amount > 0) {
                text +=
                    sharktext
                        .beautifyIncome(
                            buyingHowMuch * amount,
                            " " +
                                sharktext.getResourceName(incomeResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color"))
                        )
                        .bold() + "<br/>";
            }
        });

        if (_.some(validGenerators, (amount) => amount < 0)) {
            if (_.some(validGenerators, (amount, resourceName) => amount < 0 && !res.isInCategory(resourceName, "harmful"))) {
                $("#tooltipbox").addClass("gives-consumer");
            }
            text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "and " : "") + "CONSUME" + (usePlural ? "" : "S") + "</span><br/>";
            addedAnyLabelsYet = true;
        }

        $.each(validGenerators, (incomeResource, amount) => {
            if (amount < 0) {
                text +=
                    sharktext
                        .beautifyIncome(
                            -buyingHowMuch * amount,
                            " " +
                                sharktext.getResourceName(incomeResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color"))
                        )
                        .bold() + "<br/>";
            }
        });

        const condensedObject = res.condenseNode(effects.resource);

        if (!$.isEmptyObject(condensedObject.resAffect.increase)) {
            if (_.some(validGenerators, (_degree, resourceName) => res.isInCategory(resourceName, "harmful"))) {
                $("#tooltipbox").addClass("gives-consumer");
            }
            text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "and " : "") + "INCREASE" + (usePlural ? "" : "S") + "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.resAffect.increase, (affectedResource, degreePerPurchase) => {
                text +=
                    sharktext.boldString("all ") +
                    sharktext.getResourceName(affectedResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" gains ") +
                    " by " +
                    sharktext.boldString(sharktext.beautify(buyingHowMuch * degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.resAffect.decrease)) {
            if (_.some(condensedObject.resAffect.decrease, (_degree, resourceName) => !res.isInCategory(resourceName, "harmful"))) {
                $("#tooltipbox").addClass("gives-consumer");
            }
            text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "and " : "") + "DECREASE" + (usePlural ? "" : "S") + "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.resAffect.decrease, (affectedResource, degreePerPurchase) => {
                text +=
                    sharktext.boldString("all ") +
                    sharktext.getResourceName(affectedResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" gains ") +
                    " by " +
                    sharktext.boldString(sharktext.beautify(buyingHowMuch * degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.resAffect.multincrease)) {
            if (_.some(condensedObject.resAffect.multincrease, (_degree, resourceName) => res.isInCategory(resourceName, "harmful"))) {
                $("#tooltipbox").addClass("gives-consumer");
            }
            text +=
                "<span class='littleTooltipText'>" +
                (addedAnyLabelsYet ? "and " : "") +
                "MULTIPLICATIVELY INCREASE" +
                (usePlural ? "" : "S") +
                "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.resAffect.multincrease, (affectedResource, degreePerPurchase) => {
                degreePerPurchase = degreePerPurchase ** buyingHowMuch - 1;
                text +=
                    sharktext.boldString("all ") +
                    sharktext.getResourceName(affectedResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" gains ") +
                    " by " +
                    sharktext.boldString(sharkmath.beautif(degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.resAffect.multdecrease)) {
            if (_.some(condensedObject.resAffect.multdecrease, (_degree, resourceName) => !res.isInCategory(resourceName, "harmful"))) {
                $("#tooltipbox").addClass("gives-consumer");
            }
            text +=
                "<span class='littleTooltipText'>" +
                (addedAnyLabelsYet ? "and " : "") +
                "MULTIPLICATIVELY DECREASE" +
                (usePlural ? "" : "S") +
                "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.resAffect.multdecrease, (affectedResource, degreePerPurchase) => {
                degreePerPurchase = 1 - degreePerPurchase ** buyingHowMuch;
                text +=
                    sharktext.boldString("all ") +
                    sharktext.getResourceName(affectedResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" gains ") +
                    " by " +
                    sharktext.boldString(sharktext.beautify(degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.genAffect.increase)) {
            text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "and " : "") + "INCREASE" + (usePlural ? "" : "S") + "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.genAffect.increase, (affectedGenerator, degreePerPurchase) => {
                text +=
                    sharktext.getResourceName(affectedGenerator, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" speed ") +
                    " by " +
                    sharktext.boldString(sharktext.beautify(buyingHowMuch * degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.genAffect.decrease)) {
            text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "and " : "") + "DECREASE" + (usePlural ? "" : "S") + "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.genAffect.decrease, (affectedGenerator, degreePerPurchase) => {
                text +=
                    sharktext.getResourceName(affectedGenerator, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" speed ") +
                    " by " +
                    sharktext.boldString(sharktext.beautify(buyingHowMuch * degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.genAffect.multincrease)) {
            text +=
                "<span class='littleTooltipText'>" +
                (addedAnyLabelsYet ? "and " : "") +
                "MULTIPLICATIVELY INCREASE" +
                (usePlural ? "" : "S") +
                "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.genAffect.multincrease, (affectedGenerator, degreePerPurchase) => {
                degreePerPurchase = degreePerPurchase ** buyingHowMuch - 1;
                text +=
                    sharktext.getResourceName(affectedGenerator, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" speed ") +
                    " by " +
                    sharktext.boldString(sharktext.beautify(degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.genAffect.multdecrease)) {
            text +=
                "<span class='littleTooltipText'>" +
                (addedAnyLabelsYet ? "and " : "") +
                "MULTIPLICATIVELY DECREASE" +
                (usePlural ? "" : "S") +
                "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.genAffect.multdecrease, (affectedGenerator, degreePerPurchase) => {
                degreePerPurchase = 1 - degreePerPurchase ** buyingHowMuch;
                text +=
                    sharktext.getResourceName(affectedGenerator, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" speed ") +
                    " by " +
                    sharktext.boldString(sharktext.beautify(degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (actionData.getSpecialTooltip) {
            text += actionData.getSpecialTooltip() + "<br>";
        }

        if (SharkGame.HomeActions.getActionTable()[actionName].helpText) {
            text +=
                "<hr class='hrForTooltipSeparation'><span class='medDesc'>" + SharkGame.HomeActions.getActionTable()[actionName].helpText + "</span>";
        }

        $.each(effects.resource, (resource, amount) => {
            if (buyingHowMuch * amount !== 1) {
                text =
                    sharktext.beautify(buyingHowMuch * amount).bold() +
                    " " +
                    sharktext
                        .getResourceName(resource, false, buyingHowMuch * amount, sharkcolor.getElementColor("tooltipbox", "background-color"))
                        .bold() +
                    "<br>" +
                    (SharkGame.Settings.current.tooltipQuantityReminders
                        ? "<span class='medDesc littleTooltipText'>(you have " + sharktext.beautify(res.getResource(resource)) + ")</span><br>"
                        : "") +
                    text;
            } else {
                const determiner = sharktext.getDeterminer(resource);
                text =
                    (determiner ? determiner + " " : "") +
                    sharktext.getResourceName(resource, false, 1, sharkcolor.getElementColor("tooltipbox", "background-color")).bold() +
                    "<br>" +
                    (SharkGame.Settings.current.tooltipQuantityReminders
                        ? "<span class='medDesc littleTooltipText'>(you have " + sharktext.beautify(res.getResource(resource)) + ")</span><br>"
                        : "") +
                    text;
            }
        });

        if (document.getElementById("tooltipbox").innerHTML !== text.replace(/'/g, '"').replace(/br\//g, "br")) {
            document.getElementById("tooltipbox").innerHTML = text;
        }

        if ($("#tooltipbox").attr("current") !== actionName) {
            $("#tooltipbox").removeClass("forIncomeTable").attr("current", "");
            $("#tooltipbox").addClass("forHomeButtonOrGrotto").attr("current", actionName);
        } else {
            $("#tooltipbox").removeClass("forIncomeTable").addClass("forHomeButtonOrGrotto");
        }
    },

    onHomeUnhover() {
        document.getElementById("tooltipbox").innerHTML = "";
        $("#tooltipbox").removeClass("forHomeButtonOrGrotto").attr("current", "").removeClass("gives-consumer");
    },

    getCost(action, amount) {
        /** @type {Record<Resource, number>} */
        const calcCost = {};
        const rawCost = action.cost;

        _.each(rawCost, (costObj) => {
            const resource = SharkGame.PlayerResources.get(action.max);
            const currAmount = new Decimal(resource.amount);
            const priceIncrease = new Decimal(costObj.priceIncrease);
            let cost = new DecimalHalfRound(0);

            switch (costObj.costFunction) {
                case "constant":
                    cost = sharkmath.constantCost(currAmount, amount, priceIncrease);
                    break;
                case "linear":
                    cost = sharkmath.linearCost(currAmount, amount, priceIncrease);
                    break;
                case "unique":
                    cost = sharkmath.uniqueCost(currAmount, amount, priceIncrease);
                    break;
            }
            if (cost.abs().minus(cost.round()).lessThan(SharkGame.EPSILON)) {
                cost = cost.round();
            }
            calcCost[costObj.resource] = cost;
        });
        return calcCost;
    },

    getMax(action) {
        let max = new Decimal(1);
        if (action.max) {
            // max is used as the determining resource for linear cost functions
            const resource = SharkGame.PlayerResources.get(action.max);
            const currAmount = new Decimal(resource.amount);
            max = new Decimal(1e308);
            _.each(action.cost, (costObject) => {
                const costResource = new Decimal(SharkGame.PlayerResources.get(costObject.resource).amount);
                const priceIncrease = new Decimal(costObject.priceIncrease);
                let subMax = new DecimalHalfRound(-1);

                switch (costObject.costFunction) {
                    case "constant":
                        subMax = sharkmath.constantMax(typeof costResource === "object" ? new Decimal(0) : 0, costResource, priceIncrease);
                        break;
                    case "linear":
                        subMax = sharkmath.linearMax(currAmount, costResource, priceIncrease).minus(currAmount);
                        break;
                    case "unique":
                        subMax = sharkmath.uniqueMax(currAmount, costResource, priceIncrease).minus(currAmount);
                        break;
                }
                // prevent flashing action costs
                if (subMax.minus(subMax.round()).abs().lessThan(SharkGame.EPSILON)) {
                    subMax = subMax.round();
                }
                subMax = new Decimal(subMax);
                max = Decimal.min(max, subMax);
            });
        }
        return max.round();
    },
};
