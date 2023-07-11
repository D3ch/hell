"use strict";
SharkGame.Log = {
    initialised: false,
    messages: [],
    totalCount: 0,

    init() {
        this.moveLog();
        log.initialised = true;

        $(window).on("resize", _.debounce(this.changeHeight, 300));
        this.changeHeight();
    },

    moveLog() {
        $("#log").remove();
        const logDiv = $("<div id='log'></div>");

        switch (SharkGame.Settings.current.logLocation) {
            case "left":
                $("#sidebar").append(logDiv.append("<h3>Log<h3/>").append($("<ul id='messageList'></ul>").addClass("forLeftSide")));
                $("#wrapper").removeClass("topLogActive");
                $("#titlebackground").removeClass("topLogActive");
                $("#tabList").css("margin-right", 0);
                break;
            case "top":
                $("#titlebar").append(logDiv);
                logDiv
                    .append($("<button id='extendLog' class='min close-button'>⯆</button>").on("click", log.toggleExtendedLog))
                    .append("<ul id='messageList'></ul>");
                $("#wrapper").addClass("topLogActive");
                $("#titlebackground").addClass("topLogActive");
                $("#tabList").css("margin-right", 0);
                break;
            default:
                $("#rightLogContainer").append(logDiv.append("<h3>Log<h3/>").append($("<ul id='messageList'></ul>").addClass("forRightSide")));
                $("#wrapper").removeClass("topLogActive");
                $("#titlebackground").removeClass("topLogActive");
                $("#rightLogContainer").css("position", "static").css("top", $("#rightLogContainer").offset().top).css("position", "sticky");
                SharkGame.TabHandler.validateTabWidth();
                this.changeHeight();
        }

        const prevMessages = _.cloneDeep(log.messages);
        log.messages = [];
        _.each(prevMessages, (message) => {
            if (message.hasClass("discovery")) {
                log.addDiscovery(message.html());
            } else if (message.hasClass("error")) {
                log.addError(message.html());
            } else {
                log.addMessage(message.html());
            }
        });
    },

    changeHeight() {
        if (SharkGame.Settings.current.logLocation !== "left" && SharkGame.Settings.current.logLocation !== "top") {
            const maxHeight =
                $(window).outerHeight(true) - document.getElementById("messageList").getBoundingClientRect().top - $("#copyright").height() - 10;
            $("#messageList").css("max-height", maxHeight + "px");
        }
    },

    isNextMessageEven() {
        return this.totalCount % 2 === 1;
    },

    addMessage(message) {
        const showAnims = SharkGame.Settings.current.showAnimations;

        if (!log.initialised) {
            log.init();
        }
        const messageItem = $("<li>").html(message);

        if (log.isNextMessageEven()) {
            messageItem.addClass("evenMessage");
        }

        function height(elt, position) {
            return (
                elt.getBoundingClientRect().top +
                (position === "bottom" ? elt.getBoundingClientRect().y : 0) -
                messageList.getBoundingClientRect().top
            );
        }

        const messageList = document.querySelector("#messageList");
        log.messages.push(messageItem);

        if (messageList.scrollTop !== 0) {
            messageItem.prependTo("#messageList");
            let highestVisible = null;
            for (let i = log.messages.length - 1; i > 0; i--) {
                if (height(log.messages[i][0], "bottom") > 0) {
                    highestVisible = i;
                    break;
                }
            }

            const desiredTopElt = log.messages[_.clamp(highestVisible + 1, log.messages.length - 1)][0];
            const desiredTop = messageList.scrollTop + height(desiredTopElt, "top");
            $(messageList).animate({ scrollTop: desiredTop + "px" }, 50, "linear");
        } else if (showAnims) {
            messageItem.hide().css("opacity", 0).prependTo("#messageList").slideDown(50).animate({ opacity: 1.0 }, 100);
        } else {
            messageItem.prependTo("#messageList");
        }

        log.correctLogLength();

        this.totalCount += 1;

        return messageItem;
    },

    addError(message) {
        if (message instanceof Error) {
            console.error(message);
            message = message.message;
        }
        const messageItem = log.addMessage("Error: " + message);
        messageItem.addClass("error");
        return messageItem;
    },

    addDiscovery(message) {
        const messageItem = log.addMessage(message);
        messageItem.addClass("discovery");
        return messageItem;
    },

    correctLogLength() {
        const showAnims = SharkGame.Settings.current.showAnimations;
        const logMax = SharkGame.Settings.current.logMessageMax;

        if (log.messages.length >= logMax) {
            while (log.messages.length > logMax) {
                const oldestMessage = log.messages[0];
                // remove oldest message
                if (showAnims) {
                    log.messages[0].animate({ opacity: 0 }, 100, "swing", () => {
                        $(oldestMessage).remove();
                    });
                } else {
                    oldestMessage.remove();
                }

                // shift array (remove first item)
                log.messages.shift();
            }
        }
    },

    clearMessages(logThing = true) {
        // remove each element from page
        _.each(log.messages, (message) => {
            message.remove();
        });
        // wipe array
        log.messages = [];
        if (logThing) log.addMessage("Log cleared.");
    },

    toggleExtendedLog() {
        const title = $("#title");
        const messageList = $("#messageList");
        if (messageList.hasClass("scrollable")) {
            title.removeClass("biggerTitleDiv");
            messageList.removeClass("scrollable");
            $("#extendLog").html("⯆");
        } else {
            title.addClass("biggerTitleDiv");
            messageList.addClass("scrollable");
            $("#extendLog").html("⯅");
        }
    },

    haveAnyMessages() {
        return log.messages.length > 0;
    },
};
