"use strict";
SharkGame.Tabs = {
    current: "home",
};

SharkGame.TabHandler = {
    init() {
        SharkGame.Tabs.current = "home";

        $(window).on("resize", _.debounce(this.validateTabWidth, 300));

        function debounced() {
            return _.debounce(
                (_entries) => {
                    const content = _entries[0].target;
                    const $content = $(content);
                    $content.css("position", "static");
                    const boundingBox = content.getBoundingClientRect();
                    if ($content.offset().top + boundingBox.height < $(window).height()) {
                        $content.css("top", $content.offset().top);
                    }
                },
                400,
                { maxWait: 600 }
            );
        }

        const resizeObserver = new ResizeObserver(debounced());
        resizeObserver.observe(document.getElementById("content"));
    },

    keybindSwitchTab(tab) {
        if (SharkGame.Tabs[tab].discovered) {
            SharkGame.TabHandler.changeTab(tab);
            if (!$("#tooltipbox").hasClass("forIncomeTable")) home.onHomeUnhover();
        }
    },

    checkTabUnlocks() {
        $.each(SharkGame.Tabs, (tabName, tab) => {
            if (tabName === "current" || tab.discovered) {
                return;
            }
            let reqsMet = true;

            // check resources
            if (tab.discoverReq.resource) {
                reqsMet &&= res.checkResources(tab.discoverReq.resource, true);
            }

            const upgradeTable = SharkGame.Upgrades.getUpgradeTable();
            // check upgrades
            if (tab.discoverReq.upgrade) {
                let anyUpgradeExists = false;
                _.each(tab.discoverReq.upgrade, (upgradeName) => {
                    if (upgradeTable[upgradeName]) {
                        anyUpgradeExists = true;
                        reqsMet = reqsMet && SharkGame.Upgrades.purchased.includes(upgradeName);
                    }
                });
                if (!anyUpgradeExists) {
                    reqsMet = false;
                }
            }

            if (tab.discoverReq.flag) {
                $.each(tab.discoverReq.flag, (flagName, matchedValue) => {
                    if (SharkGame.flags[flagName]) {
                        reqsMet = reqsMet && SharkGame.flags[flagName] === matchedValue;
                    } else if (SharkGame.persistentFlags[flagName]) {
                        reqsMet = reqsMet && SharkGame.persistentFlags[flagName] === matchedValue;
                    } else {
                        reqsMet = false;
                        return false;
                    }
                });
            }

            if (reqsMet) {
                // special logic for special tabs
                switch (tabName) {
                    case `reflection`:
                        if (!SharkGame.persistentFlags.seenReflection) log.addDiscovery("Discovered " + tab.name + "!");
                        break;
                    case `cheats`:
                        if (!SharkGame.persistentFlags.seenCheatsTab) log.addDiscovery("Discovered " + tab.name + "!");
                        break;
                    default:
                        log.addDiscovery("Discovered " + tab.name + "!");
                }

                // unlock tab!
                this.discoverTab(tabName);
            }
        });
    },

    isTabUnlocked(tabName) {
        return SharkGame.Tabs[tabName].discovered;
    },

    validateTabWidth() {
        const logLocation = SharkGame.Settings.current.logLocation;
        if (logLocation !== "left" && logLocation !== "top") {
            $("#tabList").css("margin-right", $(window).width() - document.getElementById("content").getBoundingClientRect().right + 14 + "px");
        }
    },

    setUpTab() {
        const tabs = SharkGame.Tabs;
        // empty out content div
        const content = $("#content");

        content.empty();
        $("#contentMenu").empty();
        $("#contentMenu").append(
            `<ul id="tabList" class="${
                SharkGame.Settings.current.minimizedTopbar ? "" : "notFixed"
            }"></ul></div><div id="tabBorder" class="clear-fix">`
        );

        this.validateTabWidth();

        this.createTabNavigation();

        // set up tab specific stuff
        const tab = tabs[tabs.current];
        const tabCode = tab.code;
        tabCode.switchTo();
    },

    createTabMenu() {
        this.createTabNavigation();
    },

    registerTab(tab) {
        SharkGame.Tabs[tab.tabId] = {
            id: tab.tabId,
            name: tab.tabName,
            discovered: tab.tabDiscovered,
            code: tab,
            discoverReq: tab.discoverReq || {},
        };
    },

    updateRegistration(tab) {
        SharkGame.Tabs[tab.tabId].name = tab.tabName;
        SharkGame.Tabs[tab.tabId].discoverReq = tab.discoverReq || {};
    },

    createTabNavigation() {
        const tabs = SharkGame.Tabs;
        const tabList = $("#tabList");
        tabList.empty();
        // add navigation
        // check if we have more than one discovered tab, else bypass this
        let numTabsDiscovered = 0;
        $.each(tabs, (_tabName, tab) => {
            if (tab.discovered) {
                numTabsDiscovered++;
            }
        });
        if (numTabsDiscovered > 1) {
            // add a header for each discovered tab
            // make it a link if it's not the current tab
            $.each(tabs, (tabId, tabData) => {
                const onThisTab = SharkGame.Tabs.current === tabId;
                if (tabData.discovered) {
                    const tabListItem = $("<li>");
                    if (onThisTab) {
                        tabListItem.html(tabData.name);
                    } else {
                        tabListItem.append(
                            $("<a>")
                                .attr("id", "tab-" + tabId)
                                .attr("href", "javascript:;")
                                .html(tabData.name)
                                .on("click", function callback() {
                                    const tab = $(this).attr("id").split("-")[1];
                                    SharkGame.TabHandler.changeTab(tab);
                                })
                        );
                        if (!tabData.seen) {
                            tabListItem.addClass("newTab");
                        }
                    }
                    tabList.append(tabListItem);
                }
            });
        }
    },

    changeTab(tab) {
        SharkGame.Tabs.current = tab;
        SharkGame.Tabs[tab].seen = true;
        this.setUpTab();
    },

    discoverTab(tab) {
        SharkGame.Tabs[tab].discovered = true;

        if ((tab === `reflection` && SharkGame.persistentFlags.seenReflection) || (tab === `cheats` && SharkGame.persistentFlags.seenCheatsTab)) {
            SharkGame.Tabs[tab].seen = true;
        }

        // force a total redraw of the navigation
        this.createTabMenu();
    },
};
