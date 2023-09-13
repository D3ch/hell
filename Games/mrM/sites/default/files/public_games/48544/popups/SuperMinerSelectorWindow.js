class SuperMinerSelectorWindow extends PopupWindow
{
    layerName = "SuperMinerSelectorWindow"; // Used as key in activeLayers
    domElementId = "SPECIALD";
    context = SPC;

    isRendered = true;
    isPopup = true;
    allowBubbling = false;
    zIndex = 4;


    constructor(boundingBox, superMiner)
    {
        super(boundingBox); // Need to call base class constructor

        this.superMiner = superMiner;
        this.bg = superMiner.rarity.mediumFrame
        this.madeAChoice = false;

        this.setBoundingBox();
    }

    setBoundingBox()
    {
        this.boundingBox = this.context.canvas.getBoundingClientRect();
        this.boundingBox.x /= uiScaleX;
        this.boundingBox.y /= uiScaleY;
        this.boundingBox.width /= uiScaleX;
        this.boundingBox.height /= uiScaleY;

        this.clearHitboxes();

        this.skillButton = this.addHitbox(new Hitbox(
            {
                x: this.boundingBox.width * .116,
                y: this.boundingBox.height * .473,
                width: relativeWidth(this.bg) * .1075,
                height: relativeWidth(this.bg) * .1075
            },
            {},
            'cursor',
            "skillButton"
        ));

        this.equipButton = this.addHitbox(new Hitbox(
            {
                x: this.boundingBox.width * .125,
                y: this.boundingBox.height * .57,
                width: relativeWidth(this.bg) * .4,
                height: relativeHeight(this.bg) * .075
            },
            {
                onmousedown: () =>
                {
                    if(superMinerManager.isFull())
                    {
                        showConfirmationPrompt(
                            _("You have no slots available to equip {0}. Do you want to make room or scrap {0} for {1} Super Miner Souls?", this.superMiner.name, this.superMiner.scrapAmount()),
                            _("Make room"),
                            () =>
                            {
                                if(activeLayers.Super && activeLayers.Super.showScrapButtons == false)
                                {
                                    activeLayers.Super.showScrapButtons = true;
                                    activeLayers.Super.initializeScrollboxContents();
                                }
                            },
                            _("Scrap"),
                            () =>
                            {
                                this.madeAChoice = true;
                                if(superMinerManager.removePendingSuperMiner())
                                {
                                    this.superMiner.scrap();
                                }
                                closeUi(this);
                                if(activeLayers.Super)
                                {
                                    activeLayers.Super.showScrapButtons = false;
                                    activeLayers.Super.initializeScrollboxContents();
                                }
                            }
                        )
                    }
                    else
                    {
                        this.madeAChoice = true;
                        if(superMinerManager.removePendingSuperMiner())
                        {
                            superMinerManager.addSuperMiner(this.superMiner);
                        }
                        closeUi(this);
                        if(activeLayers.Super)
                        {
                            activeLayers.Super.showScrapButtons = false;
                            activeLayers.Super.initializeScrollboxContents();
                        }
                    }
                }
            },
            'pointer',
            "equipButton"
        ));

        this.scrapButton = this.addHitbox(new Hitbox(
            {
                x: this.boundingBox.width * .125,
                y: this.boundingBox.height * .63,
                width: relativeWidth(this.bg) * .4,
                height: relativeHeight(this.bg) * .075
            },
            {
                onmousedown: () =>
                {
                    showConfirmationPrompt(
                        _("Are you sure you want to scrap {0} for {1} Super Miner Souls?", this.superMiner.name, this.superMiner.scrapAmount()),
                        _("Yes"),
                        () =>
                        {
                            this.madeAChoice = true;
                            if(superMinerManager.removePendingSuperMiner())
                            {
                                this.superMiner.scrap();
                            }
                            closeUi(this);
                            if(activeLayers.Super)
                            {
                                activeLayers.Super.showScrapButtons = false;
                                activeLayers.Super.initializeScrollboxContents();
                            }
                        },
                        _("No")
                    )
                }
            },
            'pointer',
            "scrapButton"
        ));
    }

    close()
    {
        if(!this.madeAChoice)
        {
            showConfirmationPrompt(
                _("Are you sure you want to scrap {0} for {1} Super Miner Souls?", this.superMiner.name, this.superMiner.scrapAmount()),
                _("Yes"),
                () =>
                {
                    if(superMinerManager.removePendingSuperMiner())
                    {
                        this.superMiner.scrap();
                    }
                    if(activeLayers.Super)
                    {
                        activeLayers.Super.showScrapButtons = false;
                        activeLayers.Super.initializeScrollboxContents();
                    }
                },
                _("No"),
                () => 
                {
                    openUiWithoutClosing(SuperMinersWindow, null, 0, true, this.superMiner);
                    this.setBoundingBox();
                }
            )
        }
        else
        {
            return super.close();
        }
    }

    render()
    {
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);

        drawColoredRect(this.context, 0, 0, this.boundingBox.width, this.boundingBox.height, "#000000", 0.5);
        this.context.font = (this.boundingBox.height * 0.025) + "px KanitB";
        this.context.lineWidth = 6;

        let buttonIcon = this.superMiner.buttonIcon;
        let rarity = this.superMiner.rarity.name;
        let portrait = this.superMiner.portrait;

        let popupWidth = relativeWidth(this.bg) * .5;
        let popupHeight = relativeHeight(this.bg) * .5;
        let popupX = this.boundingBox.width * .11;
        let popupY = this.boundingBox.height * 0.25;
        let xOffset = popupX + (this.boundingBox.width * 0.005);

        //background
        this.context.drawImage(this.bg, 0, 0, this.bg.width, this.bg.height, popupX, popupY, popupWidth, popupHeight);

        //**********************
        //Foreground stuff below
        //**********************

        //name
        this.context.fillStyle = "#000000";
        fillTextShrinkToFit(this.context, this.superMiner.name, popupX, popupY + (popupHeight * .062), popupWidth, "center");

        //portrait
        this.context.drawImage(portrait, 0, 0, portrait.width, portrait.height, popupX + (popupWidth * 0.21), popupY + (popupHeight * 0.11), relativeWidth(portrait) * .5, relativeHeight(portrait) * .5);

        //rarity
        this.context.font = (this.boundingBox.height * 0.015) + "px KanitB";
        this.context.strokeStyle = "#FFFFFF";
        this.context.lineWidth = 2;
        strokeTextShrinkToFit(this.context, rarity, popupX, popupY + (popupHeight * .605), popupWidth, "center");
        this.context.fillStyle = "#A25D03";
        fillTextShrinkToFit(this.context, rarity, popupX, popupY + (popupHeight * .605), popupWidth, "center");
        this.context.strokeStyle = "#000000"

        if(buttonIcon)
        {
            let button = this.getHitboxById("skillButton");
            this.context.drawImage(buttonIcon, 0, 0, buttonIcon.width, buttonIcon.height, button.boundingBox.x, button.boundingBox.y, button.boundingBox.width, button.boundingBox.height);
        }

        //description (handled by the super miner class, did it this way incase we want multiple things shown for certain miners)
        this.context.fillStyle = "#FFFFFF";
        this.context.font = (this.boundingBox.height * 0.02) + "px Verdana";
        if(this.superMiner.renderDescription)
        {
            this.superMiner.renderDescription(this.context, popupX + (popupWidth * 0.3), popupY + (popupHeight * .725), popupWidth * 0.65, popupHeight * 0.29);
        }

        let equipButton = this.getHitboxById("equipButton")
        if(equipButton)
        {
            this.context.drawImage(startb, 0, 0, startb.width, startb.height, equipButton.boundingBox.x, equipButton.boundingBox.y, equipButton.boundingBox.width, equipButton.boundingBox.height)
            this.context.lineWidth = 5;
            this.context.strokeStyle = "#000000";
            this.context.fillStyle = "#FFFFFF";
            strokeTextWrapWithHeightLimit(this.context, _("Equip"), equipButton.boundingBox.x + (equipButton.boundingBox.width * 0.1), equipButton.boundingBox.y + (equipButton.boundingBox.height * 0.7), equipButton.boundingBox.width * 0.8, equipButton.boundingBox.height * .7, "center");
            fillTextWrapWithHeightLimit(this.context, _("Equip"), equipButton.boundingBox.x + (equipButton.boundingBox.width * 0.1), equipButton.boundingBox.y + (equipButton.boundingBox.height * 0.7), equipButton.boundingBox.width * 0.8, equipButton.boundingBox.height * .7, "center");
        }

        let scrapButton = this.getHitboxById("scrapButton")
        if(scrapButton)
        {
            this.context.drawImage(stopb, 0, 0, stopb.width, stopb.height, scrapButton.boundingBox.x, scrapButton.boundingBox.y, scrapButton.boundingBox.width, scrapButton.boundingBox.height)
            this.context.lineWidth = 5;
            this.context.strokeStyle = "#000000";
            this.context.fillStyle = "#FFFFFF";
            strokeTextWrapWithHeightLimit(this.context, _("Scrap"), scrapButton.boundingBox.x + (scrapButton.boundingBox.width * 0.1), scrapButton.boundingBox.y + (scrapButton.boundingBox.height * 0.7), scrapButton.boundingBox.width * 0.8, scrapButton.boundingBox.height * .7, "center");
            fillTextWrapWithHeightLimit(this.context, _("Scrap"), scrapButton.boundingBox.x + (scrapButton.boundingBox.width * 0.1), scrapButton.boundingBox.y + (scrapButton.boundingBox.height * 0.7), scrapButton.boundingBox.width * 0.8, scrapButton.boundingBox.height * .7, "center");
        }


        super.render(); // Render any child layers


    }
}