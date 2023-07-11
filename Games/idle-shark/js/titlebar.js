"use strict";
SharkGame.TitleBar = {
    saveLink: {
        name: "save",
        main: true,
        onClick() {
            try {
                SharkGame.Save.saveGame();
            } catch (err) {
                log.addError(err);
            }
            log.addMessage("Saved game.");
        },
    },

    optionsLink: {
        name: "options",
        main: true,
        onClick() {
            SharkGame.PaneHandler.showOptions();
        },
    },

    /*     helpLink: {
        name: "help",
        main: true,
        onClick() {
            SharkGame.PaneHandler.showHelp();
        },
    }, */

    skipLink: {
        name: "skip",
        main: true,
        onClick() {
            if (main.isFirstTime()) {
                // save people stranded on home world
                if (confirm("Do you want to reset your game?")) {
                    // just reset
                    main.resetGame();
                }
            } else if (confirm("Is this world causing you too much trouble? Want to go back to the gateway?")) {
                SharkGame.wonGame = false;
                main.endGame();
            }
        },
    },

    funFactsLink: {
        name: "fun fact",
        main: false,
        onClick() {
            SharkGame.FunFacts.showFact();
        },
    },

    changelogLink: {
        name: "changelog",
        main: false,
        onClick() {
            SharkGame.PaneHandler.showChangelog();
        },
    },

    /* creditsLink: {
        name: "credits",
        main: false,
        onClick() {
            SharkGame.PaneHandler.addPaneToStack("Credits", SharkGame.Panes.credits);
        },
    }, */ // credits now at bottom of page

    donateLink: {
        name: "donate",
        main: false,
        onClick() {
            SharkGame.PaneHandler.addPaneToStack("Donate", SharkGame.Panes.donate);
        },
    },

    discordLink: {
        name: "discord",
        main: false,
        link: "https://discord.gg/eYqApFkFPY",
    },

    hubLink: {
        name: "back to hub",
        main: false,
        onClick() {
            try {
                SharkGame.Save.saveGame();
            } catch (err) {
                log.addError(err);
            }
            log.addMessage("Saved game.");
            window.location.href = "https://shark.tobot.dev/";
        },
    },

    /* noticeLink: {
        name: "notice",
        main: false,
        onClick() {
            SharkGame.PaneHandler.addPaneToStack("v0.2 OPEN ALPHA NOTICE", SharkGame.Panes.notice);
        },
    }, */
};

SharkGame.TitleBarHandler = {
    init() {
        SharkGame.TitleBarHandler.wipeTitleBar();
    },

    correctTitleBar() {
        if (main.isFirstTime()) {
            SharkGame.TitleBar.skipLink.name = "reset";
        } else {
            // and then remember to actually set it back once it's not
            SharkGame.TitleBar.skipLink.name = "skip";
        }
        this.setUpTitleBar();
    },

    updateTopBar() {
        if (SharkGame.Settings.current.minimizedTopbar) {
            document.querySelector("body").classList.add("top-bar");
            $("#wrapper").removeClass("notMinimized");
            $("#tabList").removeClass("notFixed");
        } else {
            document.querySelector("body").classList.remove("top-bar");
            $("#wrapper").addClass("notMinimized");
            $("#tabList").addClass("notFixed");
        }
    },

    wipeTitleBar() {
        $("#titlemenu").empty();
        $("#subtitlemenu").empty();
    },

    setUpTitleBar() {
        const titleMenu = $("#titlemenu");
        const subTitleMenu = $("#subtitlemenu");
        SharkGame.TitleBarHandler.wipeTitleBar();
        $.each(SharkGame.TitleBar, (linkId, linkData) => {
            let option;
            if (linkData.link) {
                option = "<li><a id='" + linkId + "' href='" + linkData.link + "' target='_blank'>" + linkData.name + "</a></li>";
            } else {
                option = "<li><a id='" + linkId + "' href='javascript:;'>" + linkData.name + "</a></li>";
            }
            if (linkData.main) {
                titleMenu.append(option);
            } else {
                subTitleMenu.append(option);
            }
            $("#" + linkId).on("click", linkData.onClick);
        });
    },
};
