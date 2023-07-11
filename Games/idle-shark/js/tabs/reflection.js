"use strict";
SharkGame.Reflection = {
    tabId: "reflection",
    tabDiscovered: false,
    tabSeen: false,
    tabName: "Reflection",
    tabBg: "img/bg/bg-gate.png",

    sceneImage: "img/events/misc/scene-reflection.png",

    discoverReq: {
        resource: {
            essence: 1,
        },
    },

    message:
        "You may not remember everything, but you are something more than a shark now." +
        "</br><span='medDesc'>Reflect upon the changes in yourself and reality you have made here.</span>",

    init() {
        SharkGame.TabHandler.registerTab(this);
    },

    setup() {
        /* doesnt need to do anything */
    },

    switchTo() {
        const ref = SharkGame.Reflection;
        const content = $("#content");
        content.append($("<div>").attr("id", "tabMessage"));
        content.append($(`<h2>`).attr(`id`, `enabledAspectHead`));
        content.append($("<div>").attr("id", "aspectList"));
        content.append($(`<h2>`).attr(`id`, `disabledAspectHead`));
        content.append($("<div>").attr("id", "disabledAspectList"));
        let message = ref.message;
        const tabMessageSel = $("#tabMessage");
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + ref.sceneImage + "' id='tabSceneImageEssence'>" + message;
            tabMessageSel.css("background-image", "url('" + ref.tabBg + "')");
        }
        tabMessageSel.html(message);

        ref.updateAspectList();
        SharkGame.persistentFlags.seenReflection = true;
    },

    update() {},

    updateAspectList() {
        const listSel = $("#aspectList");
        $.each(SharkGame.Aspects, (aspectId, aspectData) => {
            if (aspectData.level > 0 && !aspectData.ignore) {
                let aspectLabel = aspectData.name + "<br><span class='medDesc reflectionText'>";
                if (aspectData.level >= aspectData.max) {
                    aspectLabel += "(Maximum Level)";
                } else {
                    aspectLabel += "(Level: " + sharktext.beautify(aspectData.level) + ")";
                }
                aspectLabel += `<br>${aspectData.getEffect(aspectData.level)}</span>`;

                const item = $("<div>").addClass("aspectDiv");
                item.append(aspectLabel);
                listSel.append(item);

                if (SharkGame.Settings.current.showIcons) {
                    // FIXME: artifacts -> aspects
                    // base: ditto what i said above
                    const iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, "aspects/" + aspectId, null, "aspects/apotheosis");
                    if (iconDiv) {
                        iconDiv.addClass("button-icon");
                        iconDiv.addClass("gatewayButton");
                        item.prepend(iconDiv);
                    }
                }
            }
        });
        if ($("#aspectList > div").length === 0) {
            listSel.append("<p><em>You have no aspects to you yet.</em></p>");
        }

        const listSelDisabled = $("#disabledAspectList");
        $.each(SharkGame.persistentFlags.aspectStorage, (aspectId, aspectLevel) => {
            const ASPECT_DATA = SharkGame.Aspects[aspectId];
            if (aspectLevel && ASPECT_DATA && !ASPECT_DATA.ignore) {
                let aspectLabel = ASPECT_DATA.name + "<br><span class='medDesc reflectionText'>";
                if (aspectLevel >= ASPECT_DATA.max) {
                    aspectLabel += "(Maximum Level)";
                } else {
                    aspectLabel += "(Level: " + sharktext.beautify(aspectLevel) + ")";
                }
                aspectLabel += `<br>${ASPECT_DATA.getEffect(aspectLevel)}</span>`;

                const item = $("<div>").addClass("disabledAspectDiv");
                item.append(aspectLabel);
                listSelDisabled.append(item);

                if (SharkGame.Settings.current.showIcons) {
                    // FIXME: artifacts -> aspects
                    // base: ditto what i said above
                    const iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, "aspects/" + aspectId, null, "aspects/apotheosis");
                    if (iconDiv) {
                        iconDiv.addClass("button-icon");
                        iconDiv.addClass("gatewayButton");
                        item.prepend(iconDiv);
                    }
                }
            }
        });
        if ($("#disabledAspectList > div").length !== 0) {
            $(`#disabledAspectHead`).html(`Disabled Aspects`);
            $(`#enabledAspectHead`).html(`Enabled Aspects`);
        }
    },
};
