class SuperMinerBlackWindow extends PopupWindow
{
    layerName = "SuperMinerBlackWindow";
    domElementId = "SUPBD";
    context = SBD;

    isRendered = true;
    isPopup = true;
    allowBubbling = false;
    zIndex = 4;

    animationDuration = 1000;
    animationTimer;

    superMinerFrameWidth = 0.25;
    buttonWidth = 0.15;
    buttonAreaWidth = 0.5;

    constructor(boundingBox, superMiner)
    {
        super(boundingBox);
        this.setBoundingBox();

        this.superMiner = superMiner;
        this.animationTimer = this.animationDuration;

        this.initMinerPortrait();
        this.initButtons();
    }

    initMinerPortrait()
    {
        var minerFrame = this.superMiner.rarity.popupFrame;
        var minerFrameWidth = this.boundingBox.width * this.superMinerFrameWidth;
        var minerFrameHeight = minerFrame.height * (minerFrameWidth / minerFrame.width);

        var minerPortraitFrame = this.addHitbox(new Hitbox(
            {
                x: (this.boundingBox.width - minerFrameWidth) / 2,
                y: this.boundingBox.height * 0.4 - minerFrameHeight / 2,
                width: minerFrameWidth,
                height: minerFrameHeight
            },
            {},
            ""
        ));

        // PORTRAIT
        minerPortraitFrame.render = function ()
        {
            var coords = this.getRelativeCoordinates(0, 0, this.parent);
            this.parent.context.drawImage(
                this.parent.superMiner.rarity.popupFrame,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height
            );

            drawImageFitInBox(
                this.parent.context,
                this.parent.superMiner.portrait,
                coords.x + (this.boundingBox.width * 0.205),
                coords.y + (this.boundingBox.height * 0.031),
                this.boundingBox.width * .593,
                this.boundingBox.height * .621
            );

            if(this.parent.superMiner.buttonIcon)
            {
                drawImageFitInBox(
                    this.parent.context,
                    this.parent.superMiner.buttonIcon,
                    coords.x + this.boundingBox.width * 0.398,
                    coords.y + this.boundingBox.height * 0.776,
                    this.boundingBox.width * 0.208,
                    this.boundingBox.height * 0.217
                );
            }
            this.renderChildren();
        }

        // RARITY TEXT
        minerPortraitFrame.addHitbox(new Hitbox(
            {
                x: minerFrameWidth * 0.25,
                y: minerFrameHeight * 0.67,
                width: minerFrameWidth * 0.50,
                height: minerFrameHeight * 0.05
            },
            {}
        )).render = function ()
            {
                var coords = this.getRelativeCoordinates(0, 0, this.parent.parent);
                var context = this.parent.parent.context;
                var rarity = this.parent.parent.superMiner.rarity.name
                context.save();
                context.font = this.boundingBox.height + "px KanitB";
                context.strokeStyle = "#FFFFFF";
                context.lineWidth = 2;
                strokeTextShrinkToFit(
                    context,
                    rarity,
                    coords.x,
                    coords.y,
                    this.boundingBox.width,
                    "center"
                );
                context.fillStyle = "#A25D03";
                fillTextShrinkToFit(
                    context,
                    rarity,
                    coords.x,
                    coords.y,
                    this.boundingBox.width,
                    "center"
                );
                context.restore();
            }

        // NAME
        this.addHitbox(new Hitbox(
            {
                x: this.boundingBox.width * 0.1,
                y: minerPortraitFrame.boundingBox.y - this.boundingBox.height * 0.055,
                width: this.boundingBox.width * 0.8,
                height: this.boundingBox.height * 0.05
            },
            {},
            ""
        )).render = function ()
            {
                var coords = this.getRelativeCoordinates(0, 0, this.parent);
                this.parent.context.save();
                this.parent.context.textBaseline = "top";
                this.parent.context.font = this.boundingBox.height + "px KanitB";
                this.parent.context.fillStyle = "#FFFFFF";
                fillTextShrinkToFit(
                    this.parent.context,
                    this.parent.superMiner.name,
                    coords.x,
                    coords.y,
                    this.boundingBox.width,
                    "center"
                );
                this.parent.context.restore();
            }

        // DESCRIPTION
        this.addHitbox(new Hitbox(
            {
                x: minerPortraitFrame.boundingBox.x,
                y: minerPortraitFrame.boundingBox.y + minerFrameHeight + this.boundingBox.height * 0.01,
                width: minerFrameWidth,
                height: this.boundingBox.height * 0.13
            },
            {},
            ""
        )).render = function ()
            {
                var coords = this.getRelativeCoordinates(0, 0, this.parent);
                this.parent.context.save();
                this.parent.context.textBaseline = "top";
                this.parent.context.font = (this.boundingBox.height * 0.25) + "px Verdana";
                this.parent.context.fillStyle = "#FFFFFF";
                this.parent.superMiner.renderDescription(
                    this.parent.context,
                    coords.x,
                    coords.y,
                    this.boundingBox.width,
                    this.boundingBox.height,
                    "center"
                );
                this.parent.context.restore();
            }
    }

    initButtons()
    {
        var buttonWidth = this.boundingBox.width * this.buttonWidth;
        var buttonHeight = startb.height * (buttonWidth / startb.width);
        var buttonOffset = this.boundingBox.width * this.buttonAreaWidth / 2

        this.equipButton = this.addHitbox(new Hitbox(
            {
                x: buttonOffset + (this.boundingBox.width * this.buttonAreaWidth - 2 * buttonWidth) / 3,
                y: this.boundingBox.height - 2 * buttonHeight,
                width: buttonWidth,
                height: buttonHeight
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
                                this.madeAChoice = true;
                                openUiWithoutClosing(SuperMinerSelectorWindow, null, this.superMiner)
                                openUiWithoutClosing(SuperMinersWindow, null, 0, true);
                                closeUi(this);
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
                            }
                        )
                    }
                    else
                    {
                        this.madeAChoice = true;
                        superMinerManager.addSuperMiner(this.superMiner);
                        superMinerManager.removePendingSuperMiner();
                        closeUi(this);
                    }
                }
            },
            'pointer',
            "equipButton"
        ));

        this.equipButton.render = function ()
        {
            var coords = this.getRelativeCoordinates(0, 0, this.parent);
            var context = this.parent.context;
            context.save();
            context.drawImage(
                startb,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height
            )
            context.lineWidth = 5;
            context.strokeStyle = "#000000";
            context.fillStyle = "#FFFFFF";
            context.textBaseline = "top";
            context.font = this.boundingBox.height * 0.7 + "px KanitB";
            strokeTextWrapWithHeightLimit(
                context,
                _("Equip"),
                coords.x + (this.boundingBox.width * 0.1),
                coords.y + (this.boundingBox.height * 0.15),
                this.boundingBox.width * 0.8,
                this.boundingBox.height * .7,
                "center"
            );
            fillTextWrapWithHeightLimit(
                context,
                _("Equip"),
                coords.x + (this.boundingBox.width * 0.1),
                coords.y + (this.boundingBox.height * 0.15),
                this.boundingBox.width * 0.8,
                this.boundingBox.height * .7,
                "center"
            );
            context.restore();
        }

        this.scrapButton = this.addHitbox(new Hitbox(
            {
                x: buttonOffset + (2 * this.boundingBox.width * this.buttonAreaWidth - buttonWidth) / 3,
                y: this.boundingBox.height - 2 * buttonHeight,
                width: buttonWidth,
                height: buttonHeight
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
                        },
                        _("No")
                    )
                }
            },
            'pointer',
            "scrapButton"
        ));

        this.scrapButton.render = function ()
        {
            var coords = this.getRelativeCoordinates(0, 0, this.parent);
            var context = this.parent.context;
            context.drawImage(
                stopb,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height
            )
            context.lineWidth = 5;
            context.strokeStyle = "#000000";
            context.fillStyle = "#FFFFFF";
            context.textBaseline = "top";
            context.font = this.boundingBox.height * 0.7 + "px KanitB";
            strokeTextWrapWithHeightLimit(
                context,
                _("Scrap"),
                coords.x + (this.boundingBox.width * 0.1),
                coords.y + (this.boundingBox.height * 0.15),
                this.boundingBox.width * 0.8,
                this.boundingBox.height * .7,
                "center"
            );
            fillTextWrapWithHeightLimit(
                context,
                _("Scrap"),
                coords.x + (this.boundingBox.width * 0.1),
                coords.y + (this.boundingBox.height * 0.15),
                this.boundingBox.width * 0.8,
                this.boundingBox.height * .7,
                "center"
            );
        }
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
                    this.madeAChoice = true;
                    if(superMinerManager.removePendingSuperMiner())
                    {
                        this.superMiner.scrap();
                    }
                    return super.close();
                },
                _("No")
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

        let animationPercent = Math.min(1, (this.animationDuration - this.animationTimer) / this.animationDuration);
        var radius = lerp(0, Math.max(this.boundingBox.width, this.boundingBox.height), animationPercent);

        this.context.globalAlpha = 1 * (animationPercent * 3);
        this.context.globalCompositeOperation = "source-over";
        drawCircle(
            this.context,
            this.boundingBox.width / 2,
            this.boundingBox.height / 2,
            radius,
            "#000000",
            "#000000",
            0
        );

        if(animationPercent < 1)
        {
            this.context.globalCompositeOperation = "source-atop";
            this.animationTimer -= renderDeltaTime;
        }
        else
        {
            this.context.globalCompositeOperation = "source-over";
        }

        this.context.globalAlpha = 1;

        this.context.save();
        let starAnimationDuration = 2000;
        this.context.globalAlpha = 1 - oscillate(performance.now(), starAnimationDuration);
        var xOffset = (performance.now() % (starAnimationDuration * 10)) / (starAnimationDuration * 10);
        drawImageLoop(
            this.context,
            dots1,
            0,
            0,
            this.boundingBox.width,
            this.boundingBox.height,
            xOffset
        )
        this.context.globalAlpha = 0.7;
        xOffset = (performance.now() % (starAnimationDuration * 8)) / (starAnimationDuration * 8);
        drawImageLoop(
            this.context,
            dots2,
            0,
            0,
            this.boundingBox.width,
            this.boundingBox.height,
            xOffset
        )
        this.context.restore();
        this.renderChildren();
    }
}