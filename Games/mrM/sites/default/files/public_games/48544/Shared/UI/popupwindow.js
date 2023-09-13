const POPUP_FRAME_SETS = {
    0: {
        // Earth
        backgroundImage: popupBackgroundLight,
        popupFrameImage: popupFrame,
        closeButtonImage: closei,
        activeTabImage: activeTab,
        inactiveTabImage: inactiveTab,
        frameWidth: 24,
        rightShadowWidth: 8,
        bottomShadowHeight: 11
    },
    1: {
        // Moon
        backgroundImage: moonPopupBackground,
        popupFrameImage: moonPopupFrame,
        closeButtonImage: moonClosei,
        activeTabImage: moonActiveTab,
        inactiveTabImage: moonInactiveTab,
        frameWidth: 24,
        rightShadowWidth: 8,
        bottomShadowHeight: 11
    },
    2: {
        // Titan
        backgroundImage: titanPopupBackground,
        popupFrameImage: titanPopupFrame,
        closeButtonImage: titanClosei,
        activeTabImage: titanActiveTab,
        inactiveTabImage: titanInactiveTab,
        frameWidth: 24,
        rightShadowWidth: 8,
        bottomShadowHeight: 11
    }
};

class PopupWindow extends UiLayer
{
    layerName = "";
    zIndex = 3;
    isRendered = false;
    isPopup = true;
    allowBubbling = false;
    currentTabIndex = 0;

    constructor(boundingBox)
    {
        super(boundingBox);
        if(this.context)
        {
            this.context.canvas.style.x = boundingBox.x;
            this.context.canvas.style.y = boundingBox.y;
            this.context.canvas.style.width = boundingBox.width;
            this.context.canvas.style.height = boundingBox.height;
        }
    }

    open()
    {
        showDiv(this.domElementId, this.zIndex);
        this.onOpen.fire();
    }

    // Return whether the window was allowed to close.
    close()
    {
        hideDiv(this.domElementId);
        this.onClose.fire();
        return true;
    }

    setBoundingBox()
    {
        this.boundingBox = this.context.canvas.getBoundingClientRect();
        this.boundingBox.x /= uiScaleX;
        this.boundingBox.y /= uiScaleY;
        this.boundingBox.width /= uiScaleX;
        this.boundingBox.height /= uiScaleY;
    }
}

class TabbedPopupWindow extends PopupWindow
{
    tabsContainer;
    tabs;
    bodyContainer;
    tabWidth = 120;
    tabHeight = 39;
    tabSpacing = 5;
    tabYOffset = 0;

    backgroundImage = POPUP_FRAME_SETS[EARTH_INDEX].backgroundImage;
    popupFrameImage = POPUP_FRAME_SETS[EARTH_INDEX].popupFrameImage;
    closeButtonImage = POPUP_FRAME_SETS[EARTH_INDEX].closeButtonImage;
    activeTabImage = POPUP_FRAME_SETS[EARTH_INDEX].activeTabImage;
    inactiveTabImage = POPUP_FRAME_SETS[EARTH_INDEX].inactiveTabImage;

    frameWidth = POPUP_FRAME_SETS[EARTH_INDEX].frameWidth;
    rightShadowWidth = POPUP_FRAME_SETS[EARTH_INDEX].rightShadowWidth;
    bottomShadowHeight = POPUP_FRAME_SETS[EARTH_INDEX].bottomShadowHeight;

    frameWidthFraction = 0.038;
    frameHeightFraction = 0.056;
    frameRightShadowFraction = 0.013;
    frameBottomShadowFraction = 0.049;

    constructor(boundingBox, tabWidth, tabHeight, tabSpacing)
    {
        super(boundingBox);
    }


    onTabChange()
    {
        // OVERRIDE THIS IN SUBCLASSES
        // This function is called after this.currentTabIndex is updated
    }

    initializeTabs(tabNames)
    {
        this.tabs = [];
        this.tabsContainer = new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.boundingBox.width,
                height: this.tabHeight
            },
            {}, "", "tabsContainer"
        );
        this.tabsContainer.isPermanent = true;
        var tabIndex = 0;
        var tabLength = (tabNames == undefined) ? 0 : tabNames.length;

        var maximumTabWidth = this.tabsContainer.boundingBox.width / tabLength;
        var sizeMultipleOfPreset = maximumTabWidth / (this.tabWidth + this.tabSpacing);
        if(sizeMultipleOfPreset < 1)
        {
            this.tabWidth *= sizeMultipleOfPreset;
            this.tabHeight *= sizeMultipleOfPreset;
            this.tabSpacing *= sizeMultipleOfPreset;
            this.tabYOffset = this.tabHeight * (1 - sizeMultipleOfPreset) / 2;
        }

        for(var i in tabNames)
        {
            var tab = new Hitbox(
                {
                    x: tabIndex * (this.tabWidth + this.tabSpacing),
                    y: this.tabYOffset,
                    width: this.tabWidth,
                    height: this.tabHeight
                },
                {
                    onmousedown: this.createTabChangeFunctionForIndex(tabIndex)
                },
                "pointer", "tab_" + tabIndex
            );
            tab.render = this.createTabRenderFunction(this, i, tabNames[i]).bind(tab);
            this.tabsContainer.addHitbox(tab);
            this.tabs.push(tab);
            ++tabIndex;
        }
        var frameOverlap = 0.023 * this.boundingBox.height;
        var frameXScale = popupFrame.width / this.boundingBox.width;
        var frameYScale = popupFrame.height / (this.boundingBox.height - this.tabsContainer.boundingBox.y);
        var frameWidth = this.frameWidthFraction * this.boundingBox.width / uiScaleX;
        var frameHeight = this.frameHeightFraction * this.boundingBox.height / uiScaleY;
        var frameRightShadowWidth = this.frameRightShadowFraction * this.boundingBox.width / uiScaleX;
        var frameBottomShadowWidth = this.frameBottomShadowFraction * this.boundingBox.height / uiScaleY;
        this.tabsContainer.render = function ()
        {
            this.renderChildren();
            var coords = this.getRelativeCoordinates(0, this.boundingBox.height, this.parent);
            var context = this.parent.context;
            context.drawImage(this.parent.backgroundImage, coords.x, coords.y - frameOverlap, this.boundingBox.width - frameRightShadowWidth, this.parent.boundingBox.height - coords.y - frameBottomShadowWidth + frameOverlap);
            // drawFrame(context, this.parent.popupFrameImage, coords.x, coords.y - frameOverlap, this.boundingBox.width - 8, this.parent.boundingBox.height - coords.y + frameOverlap - 11, 48, this.parent.frameWidth, this.parent.rightShadowWidth, this.parent.bottomShadowHeight);
            context.drawImage(this.parent.popupFrameImage, coords.x, coords.y - frameOverlap, this.boundingBox.width, this.parent.boundingBox.height - coords.y + frameOverlap);
        }
        this.bodyContainer = new Hitbox(
            {
                x: frameWidth,
                y: this.tabsContainer.boundingBox.height + frameHeight - frameOverlap,
                width: this.boundingBox.width - (2 * frameWidth + frameRightShadowWidth),
                height: this.boundingBox.height - this.tabsContainer.boundingBox.height - (2 * frameHeight + frameBottomShadowWidth) + 2 * frameOverlap
            },
            {}, "", "bodyContainer"
        );
        this.addHitbox(this.tabsContainer);
        this.addHitbox(this.bodyContainer);
        this.closeButton = this.addHitbox(new Button(
            this.closeButtonImage, "", "", "",
            {
                x: this.boundingBox.width * .94,
                y: this.tabHeight - frameOverlap - this.boundingBox.width * 0.0125,
                width: this.boundingBox.width * .05,
                height: this.boundingBox.width * .05
            },
            {
                onmousedown: function ()
                {
                    closeUi(this.parent);
                    if(!mutebuttons) closeAudio[rand(0, closeAudio.length - 1)].play();
                }
            },
            'pointer',
            "closeButton"
        ));
    }

    initializeTabNotifications(notificationIds)
    {
        if (notificationIds.length > this.tabs.length)
        {
            return;
        }

        for (var i in notificationIds)
        {
            if (notificationIds[i] && notificationIds[i].length > 0)
            {
                var icon = new NotificationIcon(0, 0, notificationIds[i]);
                var iconWidth = icon.boundingBox.width;
                icon.boundingBox.x = this.tabs[i].boundingBox.width - iconWidth * 0.5;
                icon.boundingBox.y = -iconWidth;
                icon.renderOnStage = true;
                icon.phaseShift = rand(0, 25);
                this.tabs[i].addHitbox(icon);
            }
        }
    }

    createTabRenderFunction(parentElement, tabIndex, tabName)
    {
        var frameOverlap = 0.023 * this.boundingBox.height;
        var frameXScale = popupFrame.width / this.boundingBox.width;
        var frameYScale = popupFrame.height / (this.boundingBox.height - this.tabsContainer.boundingBox.y);
        var frameWidth = 0.038 * this.boundingBox.width / uiScaleX;
        var frameHeight = 0.056 * this.boundingBox.height / uiScaleY;
        var frameRightShadowWidth = 0.017 * this.boundingBox.width / uiScaleX;
        var frameBottomShadowWidth = 0.049 * this.boundingBox.height / uiScaleY;
        return function ()
        {
            var context = parentElement.context;
            var relativeCoords = this.getRelativeCoordinates(0, 0, parentElement);
            var tabImageXScale = 1.06; // Tab images have a drop shadow; need to adjust size so the body fills the bounding box
            var tabImageYScale = 1.3;
            context.save();
            if(parentElement.currentTabIndex == tabIndex)
            {
                context.drawImage(parentElement.activeTabImage, relativeCoords.x, relativeCoords.y, this.boundingBox.width * tabImageXScale, this.boundingBox.height * tabImageYScale);
                context.fillStyle = "#F2F2F2";
            }
            else
            {
                context.drawImage(parentElement.inactiveTabImage, relativeCoords.x, relativeCoords.y, this.boundingBox.width * tabImageXScale, this.boundingBox.height * tabImageYScale);
                context.fillStyle = "#999999";
            }
            context.textBaseline = "middle";
            context.font = "16px KanitM";
            fillTextShrinkToFit(
                context,
                tabName,
                relativeCoords.x + (this.boundingBox.width * .05),
                relativeCoords.y + parentElement.tabHeight / 2 - frameOverlap / 4,
                this.boundingBox.width * .9,
                "center");
            if(this.flickerStart)
            {
                if(parentElement.currentTabIndex == tabIndex || (this.flickerEnd > 0 && Math.floor(new Date().getTime()) > this.flickerEnd))
                {
                    this.flickerStart = 0;
                }
                else
                {
                    var flickerMaxOpacity = 0.35;
                    var flickerT = ((Math.floor(new Date().getTime()) - this.flickerStart) % this.flickerPeriod) / (this.flickerPeriod / 2);
                    if(flickerT > 1)
                    {
                        flickerT = 2 - flickerT;
                    }
                    context.save();
                    context.globalCompositeOperation = "source-atop";
                    context.globalAlpha = flickerMaxOpacity * flickerT;
                    context.fillStyle = "#FFFFFF";
                    context.fillRect(relativeCoords.x, relativeCoords.y, this.boundingBox.width, this.boundingBox.height);
                    context.restore();
                }
            }
            context.restore();
            this.renderChildren();
        }
    }

    createTabChangeFunctionForIndex(tabIndex)
    {
        return function ()
        {
            if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
            this.parent.parent.openTab(tabIndex);
        }
    }

    openTab(tabIndex)
    {
        if(this.currentTabIndex != tabIndex)
        {
            this.currentTabIndex = tabIndex;
            this.onTabChange();
        }
    }

    flickerTab(tabIndex, flickerPeriod, maxNumberOfFlashes = 0)
    {
        var tab = this.tabs[tabIndex];
        tab.flickerStart = Math.floor(new Date().getTime());
        tab.flickerPeriod = flickerPeriod;
        if(maxNumberOfFlashes > 0)
        {
            tab.flickerEnd = Math.floor(new Date().getTime()) + (flickerPeriod * maxNumberOfFlashes);
        }
        else
        {
            tab.flickerEnd = 0;
        }
    }

    setFrameImagesByWorldIndex(worldIndex)
    {
        this.backgroundImage = POPUP_FRAME_SETS[worldIndex].backgroundImage;
        this.popupFrameImage = POPUP_FRAME_SETS[worldIndex].popupFrameImage;
        this.closeButtonImage = POPUP_FRAME_SETS[worldIndex].closeButtonImage;
        this.activeTabImage = POPUP_FRAME_SETS[worldIndex].activeTabImage;
        this.inactiveTabImage = POPUP_FRAME_SETS[worldIndex].inactiveTabImage;
        this.frameWidth = POPUP_FRAME_SETS[worldIndex].frameWidth;
        this.rightShadowWidth = POPUP_FRAME_SETS[worldIndex].rightShadowWidth;
        this.bottomShadowHeight = POPUP_FRAME_SETS[worldIndex].bottomShadowHeight;
    }
}