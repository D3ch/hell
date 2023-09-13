class DialogueWindow extends PopupWindow
{
    layerName = "DialogueWindow"
    domElementId = "DIALOGUED"
    context = DIALOGUE;

    allowBubbling = false;

    dialogueFont = "16px KanitM";
    nameFont = "14px KanitM";

    backgroundImageSrc = "Shared/Assets/UI/tooltip_background.webp";
    backgroundImage;
    frameWidth;
    frameHeight;

    zIndex = 999;

    currentDialogue;
    renderedTextInfo;
    currentCharIndex;
    dialogueSpeed = 2; // New characters per frame
    isTextAnimating = false;
    textSounds = [new Audio("Shared/Audio/click1.wav"), new Audio("Shared/Audio/click2.wav"), new Audio("Shared/Audio/click3.wav"), new Audio("Shared/Audio/click4.wav"), new Audio("Shared/Audio/click5.wav")];

    constructor(boundingBox)
    {
        super(boundingBox);
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        this.backgroundImage = new Image();
        this.backgroundImage.src = this.backgroundImageSrc;

        this.frameWidth = 12;
        this.frameHeight = 12;

        this.addHitbox(new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.boundingBox.width,
                height: this.boundingBox.height
            },
            {
                onmousedown: function ()
                {
                    if(this.isTextAnimating)
                    {
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                        this.skipTextAnimation();
                    }
                    else if(this.currentDialogue.clickToContinue)
                    {
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                        dialogueManager.next();
                    }
                }.bind(this)
            }
        ));

        var buttonWidth = this.boundingBox.height * 0.5;
        var buttonHeight = this.boundingBox.height * 0.1

        this.addHitbox(new Button(
            upgradeb, _("Skip"), "9px KanitM", "#000000",
            {
                x: this.frameWidth + this.boundingBox.width * 0.025,
                y: this.boundingBox.height - this.frameHeight - 1.1 * buttonHeight,
                width: buttonWidth,
                height: buttonHeight
            },
            {
                onmousedown: function ()
                {
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    dialogueManager.finish();
                }
            }
        ))

        this.textX = this.frameWidth + this.boundingBox.height * 0.5 + this.boundingBox.width * 0.075;
        this.textY = this.frameHeight + this.boundingBox.width * 0.025;

        for(var sound of this.textSounds)
        {
            sound.volume = 0.1;
        }

        this.updateCurrentDialogue();
    }

    render()
    {
        if(dialogueManager.isDirty)
        {
            this.updateCurrentDialogue();
        }
        this.context.save();
        var coords = this.getGlobalCoordinates(0, 0);
        var portraitWidth = this.boundingBox.height * 0.5;
        var portraitPadding = this.boundingBox.width * 0.025;
        var portraitX = this.frameWidth + portraitPadding;
        var portraitY = this.frameHeight + portraitPadding;
        this.context.drawImage(
            this.backgroundImage,
            0,
            0,
            this.boundingBox.width,
            this.boundingBox.height
        );
        drawFrame(
            this.context,
            popupFrame,
            0,
            0,
            this.boundingBox.width,
            this.boundingBox.height,
            this.frameWidth
        );

        // DRAW PORTRAIT
        this.context.fillStyle = "#000000";
        this.context.globalAlpha = 0.35;
        this.context.fillRect(
            portraitX,
            portraitY,
            portraitWidth,
            portraitWidth
        )
        this.context.globalAlpha = 1;
        if(this.currentDialogue.spritesheet)
        {
            if(this.isTextAnimating && this.currentDialogue.spritesheet.isPaused)
            {
                this.currentDialogue.spritesheet.goToFrame(1);
                this.currentDialogue.spritesheet.play();
            }
            else if(!this.isTextAnimating)
            {
                this.currentDialogue.spritesheet.playUntilFinished();
            }
            this.currentDialogue.spritesheet.drawAnimation(
                this.context,
                portraitX,
                portraitY,
                portraitWidth,
                portraitWidth
            );
        }
        else
        {
            drawImageFitInBox(
                this.context,
                this.currentDialogue.image,
                portraitX,
                portraitY,
                portraitWidth,
                portraitWidth
            );
        }
        drawFrame(
            this.context,
            itemFrame,
            portraitX,
            portraitY,
            portraitWidth,
            portraitWidth,
            6,
            4,
            0,
            0
        );
        this.context.fillStyle = "#333333";
        this.context.textBaseline = "top";
        this.context.font = this.nameFont;
        fillTextWrap(
            this.context,
            this.currentDialogue.name,
            portraitX,
            portraitY + portraitWidth + portraitPadding / 2,
            portraitWidth,
            "center",
            0.2
        );

        this.context.globalAlpha = 0.2;
        this.context.strokeStyle = "#000000";
        this.context.lineWidth = 1;
        this.context.beginPath();
        this.context.moveTo(portraitX + portraitWidth + portraitPadding, this.frameHeight);
        this.context.lineTo(portraitX + portraitWidth + portraitPadding, this.boundingBox.height - this.frameHeight);
        this.context.stroke();

        // RENDER TEXT

        this.renderDialogue();

        if(this.currentDialogue.clickToContinue)
        {
            this.context.globalAlpha = 0.2 + (0.8 * oscillate(currentTime(), 500));
            this.context.textBaseline = "bottom";
            var fontSize = 12;
            this.context.font = fontSize + "px KanitM";
            var t = oscillate(currentTime(), 500)
            var r = Math.round(46 * t);
            var g = Math.round(163 * t);
            var b = Math.round(69 * t);
            this.context.fillStyle = rgbToHex(r, g, b);
            fillTextWrap(
                this.context,
                _("Click to continue..."),
                this.frameWidth,
                this.boundingBox.height - this.frameHeight,
                this.boundingBox.width - 2 * this.frameWidth,
                "right"
            );
        }
        this.context.restore();
        this.renderChildren();
    }

    updateCurrentDialogue()
    {
        var speaker = dialogueManager.getCurrentSpeaker();
        var dialogue = dialogueManager.getCurrentDialogue();
        var newDialogue = {
            name: speaker.name,
            image: speaker.image,
            spritesheet: speaker.spritesheet,
            text: dialogue.text,
            clickToContinue: dialogue.clickToContinue,
            position: dialogue.position
        }
        if(this.currentDialogue != newDialogue)
        {
            this.setWindowPosition(newDialogue.position)
        }

        // Assuming this will be the only listener for dialogue changes
        dialogueManager.isDirty = false;
        this.currentDialogue = newDialogue;
        this.currentCharIndex = 0;

        this.context.font = this.dialogueFont;
        this.renderedTextInfo = fillTextWrapWithHeightLimit(
            this.context,
            this.currentDialogue.text,
            this.textX,
            this.textY,
            this.boundingBox.width - this.textX - this.frameWidth,
            this.boundingBox.height - 2 * this.textY,
            "left",
            0.2,
            "top",
            true
        );
        console.log(this.renderedTextInfo);
    }

    renderDialogue()
    {
        if(this.currentCharIndex < this.currentDialogue.text.length)
        {
            this.currentCharIndex += this.dialogueSpeed;
            this.isTextAnimating = true;
            if(!mutebuttons) this.textSounds[rand(0, clickAudio.length - 1)].play();
        }
        else
        {
            this.isTextAnimating = false;
        }
        this.context.save();
        this.context.globalAlpha = 1;
        this.context.fillStyle = "#333333";
        this.context.font = this.renderedTextInfo.font;

        var remainingChars = this.currentCharIndex;
        for(var line of this.renderedTextInfo.lines)
        {
            this.context.fillText(
                line.text.slice(0, remainingChars),
                line.x,
                line.y
            );
            remainingChars -= line.text.length;
            if(remainingChars <= 0)
            {
                break;
            }
        }
        this.context.restore();
    }

    skipTextAnimation()
    {
        this.currentCharIndex = this.currentDialogue.text.length;
    }

    setWindowPosition(newPositionValues)
    {
        var div = document.getElementById(this.domElementId);
        if(newPositionValues)
        {
            this.setWindowPositionValue(div, "left", newPositionValues.x);
            this.setWindowPositionValue(div, "top", newPositionValues.y);
            this.setWindowPositionValue(div, "width", newPositionValues.width);
            this.setWindowPositionValue(div, "height", newPositionValues.height);
        }
        else
        {
            div.style.left = "";
            div.style.top = "";
            div.style.width = "";
            div.style.height = "";
        }
        this.setBoundingBox();
    }

    setWindowPositionValue(windowDiv, key, value)
    {
        if(value || value === 0)
        {
            if(typeof (value) == "string")
            {
                windowDiv.style[key] = value;
            }
            else
            {
                windowDiv.style[key] = value + "px";
            }
        }
        else
        {
            windowDiv.style[key] = "";
        }
    }
}