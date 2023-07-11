"use strict";
SharkGame.Settings = {
    current: {},

    // Internal / No category
    buyAmount: {
        defaultSetting: 1,
        options: [1, 10, 100, -3, -2, -1, "custom"],
    },

    grottoMode: {
        defaultSetting: "simple",
        options: ["simple", "advanced"],
    },

    showPercentages: {
        defaultSetting: "absolute",
        options: ["absolute", "percentage"],
    },

    // PERFORMANCE

    framerate: {
        defaultSetting: 20,
        name: "Framerate/TPS",
        desc: "How fast to update the game.",
        category: "PERFORMANCE",
        options: [1, 2, 5, 10, 20, 30],
        onChange() {
            main.applyFramerate();
        },
    },

    showAnimations: {
        defaultSetting: true,
        name: "Show Animations",
        desc: "Whether to show animated transitions.",
        category: "PERFORMANCE",
        options: [true, false], // might remove this option? could be a pain to continue supporting it
    },

    // LAYOUT

    minimizedTopbar: {
        defaultSetting: true,
        name: "Minimized Title Bar",
        desc: "Whether to minimize the title bar at the top.",
        category: "LAYOUT",
        options: [true, false],
        onChange() {
            SharkGame.TitleBarHandler.updateTopBar();
        },
    },

    logLocation: {
        defaultSetting: "right",
        name: "Log Location",
        desc: "Where to put the log.",
        category: "LAYOUT",
        options: ["right", "left", "top"],
        onChange() {
            log.moveLog();
        },
    },

    groupResources: {
        defaultSetting: true,
        name: "Group Resources",
        desc: "Whether to categorize resources in the table.",
        category: "LAYOUT",
        options: [true, false],
        onChange() {
            res.rebuildTable = true;
        },
    },

    smallTable: {
        defaultSetting: false,
        name: "Smaller Table",
        desc: "Whether to make the stuff table smaller.",
        category: "LAYOUT",
        options: [true, false],
        onChange() {
            res.rebuildTable = true;
        },
    },

    logMessageMax: {
        defaultSetting: 30,
        name: "Max Log Messages",
        desc: "Max number of messages kept in the log.",
        category: "LAYOUT",
        options: [5, 10, 15, 20, 30, 60],
        onChange() {
            log.correctLogLength();
        },
    },

    sidebarWidth: {
        defaultSetting: "30%",
        name: "Sidebar Width",
        desc: "How much screen space the sidebar should take.",
        category: "LAYOUT",
        options: ["25%", "30%", "35%"],
        onChange() {
            const sidebar = $("#sidebar");
            if (SharkGame.Settings.current.showAnimations) {
                sidebar.animate({ width: SharkGame.Settings.current.sidebarWidth }, 100);
            } else {
                sidebar.width(SharkGame.Settings.current.sidebarWidth);
            }
        },
    },

    // APPEARANCE

    notation: {
        defaultSetting: "default",
        name: "Number Notation",
        desc: "How numbers should be formatted.",
        category: "APPEARANCE",
        options: ["default", /* "exponen", */ "SI"],
        onChange() {
            res.rebuildTable = true;
            stats.recreateIncomeTable = true;
        },
    },

    colorCosts: {
        defaultSetting: "color",
        name: "Color Resource Names",
        desc: "How to color names of resources.",
        category: "APPEARANCE",
        options: ["color", "bright", "none"],
        onChange() {
            res.rebuildTable = true;
            stats.recreateIncomeTable = true;
        },
    },

    boldCosts: {
        defaultSetting: true,
        name: "Bold Resource Names",
        desc: "Should resource names be bolded?",
        options: [true, false],
        category: "APPEARANCE",
        onChange() {
            res.rebuildTable = true;
            stats.recreateIncomeTable = true;
        },
    },

    alwaysSingularTooltip: {
        defaultSetting: false,
        name: "Tooltip Always Singular",
        desc: "Should the tooltip only show what one of each thing produces?",
        category: "APPEARANCE",
        options: [true, false],
    },

    tooltipQuantityReminders: {
        defaultSetting: true,
        name: "Tooltip Amount Reminder",
        desc: "Should tooltips tell you much you own of stuff?",
        category: "APPEARANCE",
        options: [true, false],
    },

    enableThemes: {
        defaultSetting: true,
        name: "Enable Planet-dependent Styles",
        desc: "Should page colors change for different planets?",
        options: [true, false],
        category: "APPEARANCE",
        onChange() {
            if (SharkGame.Settings.current.enableThemes) {
                document.querySelector("body").classList.remove("no-theme");
            } else {
                document.querySelector("body").classList.add("no-theme");
            }
        },
    },

    showIcons: {
        defaultSetting: true,
        name: "Show Action Button icons",
        desc: "Show button icons?",
        category: "APPEARANCE",
        options: [true, false],
    },

    showTabImages: {
        defaultSetting: true,
        name: "Show Tab Header Images",
        desc: "Show art?",
        category: "APPEARANCE",
        options: [true, false],
        onChange() {
            SharkGame.TabHandler.changeTab(SharkGame.Tabs.current);
        },
    },

    // ACCESSIBILITY

    doAspectTable: {
        defaultSetting: "tree",
        name: "Aspect Table or Tree",
        desc: "Draw a visual aspect tree or a more accessible aspect table?",
        category: "ACCESSIBILITY",
        options: ["tree", "table"],
    },

    verboseTokenDescriptions: {
        defaultSetting: false,
        name: "Verbose Token",
        desc: "Should tokens display text saying where they are?",
        category: "ACCESSIBILITY",
        options: [true, false],
        onChange() {
            res.tokens.updateTokenDescriptions();
        },
    },

    minuteHandEffects: {
        defaultSetting: true,
        name: "Minute Hand Special Effects",
        desc: "Should the minute hand glow a ton?",
        category: "ACCESSIBILITY",
        options: [true, false],
        onChange() {
            res.minuteHand.updatePowers();
        },
    },

    // OTHER

    idleEnabled: {
        defaultSetting: true,
        name: "Stored Offline Progress",
        desc: "Should the game store idle progress for later use? (otherwise, it will not go idle and will have real offline progress)",
        category: "OTHER",
        options: [true, false],
        onChange() {
            res.minuteHand.setup();
        },
    },

    showTooltips: {
        defaultSetting: true,
        name: "Tooltips",
        desc: "Whether to show informational tooltips when hovering over certain stuff.",
        category: "OTHER",
        options: [true, false],
    },

    updateCheck: {
        defaultSetting: true,
        name: "Check for updates",
        desc: "Whether to notify you of new updates.",
        category: "OTHER",
        options: [true, false],
        onChange() {
            clearInterval(SharkGame.Main.checkForUpdateHandler);
            if (SharkGame.Settings.current.updateCheck) {
                SharkGame.Main.checkForUpdateHandler = setInterval(main.checkForUpdates, 300000);
            }
        },
    },

    truePause: {
        defaultSetting: false,
        name: "True Pause",
        desc: "When using the pause button aspect, should the game not build up idle time?",
        category: "OTHER",
        options: [true, false],
    },

    offlineModeActive: {
        defaultSetting: true,
        name: "Offline Progress",
        desc: "Should there be ANY offline progress?",
        category: "OTHER",
        options: [true, false],
    },

    // SAVES (Needs to come last due to hard-coded import/export/wipe buttons at the bottom)

    autosaveFrequency: {
        // times given in minutes
        defaultSetting: 5,
        name: "Autosave Frequency",
        desc: "Number of minutes between autosaves.",
        category: "SAVES",
        options: [1, 2, 5, 10, 30],
        onChange() {
            clearInterval(main.autosaveHandler);
            main.autosaveHandler = setInterval(main.autosave, SharkGame.Settings.current.autosaveFrequency * 60000);
            log.addMessage(
                "Now autosaving every " +
                    SharkGame.Settings.current.autosaveFrequency +
                    " minute" +
                    sharktext.plural(SharkGame.Settings.current.autosaveFrequency) +
                    "."
            );
        },
    },
};
