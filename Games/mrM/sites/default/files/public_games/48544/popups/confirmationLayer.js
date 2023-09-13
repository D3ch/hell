class ConfirmationWindow extends PopupWindow
{
    layerName = "confirmationLayer"; // Used as key in activeLayers
    domElementId = "CONFIRMATIOND";
    context = CON;  // Canvas rendering context for popup
    zIndex = 999;

    openTimestamp = "";

    // Relative to screen size
    bodyWidth = 0.5;
    bodyHeight = 0.5;

    // Relative to body size
    bodyPadding = 0.005;
    textAreaHeight = 0.7;
    buttonWidth = 0.35;
    buttonHeight = 0.2;
    bodyFontSize = 0.1;

    frameWidth = 24;

    text;
    yesButtonText;
    noButtonText;
    yesFunction;
    noFunction;

    actionTaken = false;

    constructor(boundingBox, text, yesButtonText = _("YES"), noButtonText = _("NO"), yesFunction = null, noFunction = null)
    {
        super(boundingBox);
        this.setBoundingBox();
        this.context.canvas.parentElement.style.visibility = "visible";

        this.openTimestamp = performance.now();
        this.layerName += this.openTimestamp;

        this.text = text;
        this.yesButtonText = yesButtonText;
        this.noButtonText = noButtonText;
        this.yesFunction = yesFunction;
        this.noFunction = noFunction;
        this.disabledHitboxes = [];

        this.initHitboxes();
    }

    initHitboxes()
    {
        this.clearHitboxes();
        this.createBody();
        this.createButtons();
    }

    createBody()
    {
        this.body = this.addHitbox(new Hitbox(
            {
                x: (this.boundingBox.width * (1 - this.bodyWidth)) / 2,
                y: (this.boundingBox.height * (1 - this.bodyHeight)) / 2,
                width: this.boundingBox.width * this.bodyWidth,
                height: this.boundingBox.height * this.bodyHeight
            },
            {},
            ""
        ));

        this.body.render = function ()
        {
            var popupFrameWidth = 24;
            var renderedFrameWidth = this.parent.frameWidth;
            var shadowWidth = 7;
            var shadowHeight = 11;

            var coords = this.getRelativeCoordinates(0, 0, this.parent);
            var context = this.parent.context;
            context.drawImage(
                lilpopupBackground,
                coords.x + renderedFrameWidth,
                coords.y + renderedFrameWidth,
                this.boundingBox.width - 2 * renderedFrameWidth,
                this.boundingBox.height - 2 * renderedFrameWidth
            );
            drawFrame(
                context,
                lilpopupFrame,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height,
                renderedFrameWidth,
                popupFrameWidth,
                shadowHeight,
                shadowWidth
            )
            this.renderChildren();
        }

        var padding = this.boundingBox.width * this.bodyPadding + this.frameWidth;
        this.body.bodyContainer = this.body.addHitbox(new Hitbox(
            {
                x: padding,
                y: padding,
                width: this.body.boundingBox.width - 2 * padding,
                height: this.body.boundingBox.height - 2 * padding
            },
            {},
            ""
        ));

        this.body.bodyContainer.render = function ()
        {
            var root = this.parent.parent;
            var coords = this.getRelativeCoordinates(0, 0, root);
            var context = root.context;
            var textAreaHeight = root.textAreaHeight - (isSimpleInputVisible() ? 0.17 : 0);
            context.save();
            context.fillStyle = "#FFFFFF";
            context.strokeStyle = "#000000";
            context.font = (this.boundingBox.height * root.bodyFontSize) + "px KanitM";
            context.lineWidth = 6;
            context.textBaseline = 'top';
            strokeTextWrapWithHeightLimit(
                context,
                root.text,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height * textAreaHeight,
                "center",
                0.25,
                "center"
            );
            fillTextWrapWithHeightLimit(
                context,
                root.text,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height * textAreaHeight,
                "center",
                0.25,
                "center"
            );
            context.restore();
            this.renderChildren();
        }
    }

    createButtons()
    {
        var container = this.body.bodyContainer.boundingBox;

        var yesButtonX, noButtonX;
        var yesButtonY, noButtonY;
        var buttonRegionCenterY = container.height * (0.5 + this.textAreaHeight / 2) - (container.height * this.buttonHeight) / 2

        if(this.noButtonText == "")
        {
            // Center yes button
            yesButtonX = container.width * (1 - this.buttonWidth) / 2;
            yesButtonY = buttonRegionCenterY;
        }
        else if(this.buttonWidth >= 0.5)
        {
            // Vertically stack the buttons
            yesButtonX = container.width * (1 - this.buttonWidth) / 2;
            yesButtonY = buttonRegionCenterY - (container.height * this.buttonHeight * 0.6);

            noButtonX = container.width * (1 - this.buttonWidth) / 2;
            noButtonY = buttonRegionCenterY + (container.height * this.buttonHeight * 0.6);
        }
        else
        {
            yesButtonX = (container.width / 2 - container.width * this.buttonWidth) / 2;
            yesButtonY = buttonRegionCenterY;

            noButtonX = (3 * container.width / 2 - container.width * this.buttonWidth) / 2;
            noButtonY = buttonRegionCenterY;
        }
        this.createButton(
            startb,
            this.yesButtonText,
            {
                x: yesButtonX,
                y: yesButtonY,
                width: container.width * this.buttonWidth,
                height: container.height * this.buttonHeight
            },
            this.yesFunction
        );
        this.createButton(
            stopb,
            this.noButtonText,
            {
                x: noButtonX,
                y: noButtonY,
                width: container.width * this.buttonWidth,
                height: container.height * this.buttonHeight
            },
            this.noFunction
        );
    }

    createButton(image, text, boundingBox, clickFunction)
    {
        var button = this.body.bodyContainer.addHitbox(new Hitbox(
            boundingBox,
            {
                onmousedown: function (clickFunction)
                {
                    if(clickFunction)
                    {
                        clickFunction();
                    }
                    this.actionTaken = true;
                    this.close();
                }.bind(this, clickFunction)
            }
        ));
        button.render = function (root, image, text)
        {
            var coords = this.getRelativeCoordinates(0, 0, root);
            var context = root.context;
            context.drawImage(image, coords.x, coords.y, this.boundingBox.width, this.boundingBox.height);

            context.font = (this.boundingBox.height * 0.8) + "px KanitM";
            context.fillStyle = "#FFFFFF";
            context.textBaseline = "middle";
            context.lineWidth = this.boundingBox.height * 0.08;
            drawNineSlice(
                context,
                image,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height,
                31,
                24
            );
            strokeTextShrinkToFit(
                context,
                text,
                coords.x + (this.boundingBox.width * 0.075),
                coords.y + (this.boundingBox.height * 0.51),
                this.boundingBox.width * .85,
                "center"
            );
            fillTextShrinkToFit(
                context,
                text,
                coords.x + (this.boundingBox.width * 0.075),
                coords.y + (this.boundingBox.height * 0.51),
                this.boundingBox.width * .85,
                "center"
            );

        }.bind(button, this, image, text);
    }

    render()
    {
        if(!isDivVisible(this.domElementId))
        {
            showDiv(this.domElementId, this.zIndex);
        }
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        drawColoredRect(this.context, 0, 0, this.boundingBox.width, this.boundingBox.height, "#000000", 0.5);

        this.renderChildren();
    }

    close()
    {
        // Call noFunction if the window is closed by some external means before an action is taken
        if(!this.actionTaken && this.noFunction)
        {
            this.noFunction();
        }

        hideSimpleInput();
        delete activeLayers[this.layerName];
        return super.close();
    }
}