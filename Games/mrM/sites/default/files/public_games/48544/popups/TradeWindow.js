class TradeWindow extends TabbedPopupWindow
{
    layerName = "tradingPost"; // Used as key in activeLayers
    domElementId = "TRADINGPOSTD"; // ID of dom element that gets shown or hidden
    context = TRADINGPOST;         // Canvas rendering context for popup
    worldIndex;

    defaultWidth;
    defaultHeight;

    trades = [];
    tradeBox1;
    tradeBox2;
    tradeButton1;
    tradeButton2;

    getWorld()
    {
        return worlds[this.worldIndex];
    }

    constructor(boundingBox, worldIndex)
    {
        super(boundingBox);
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        this.setFrameImagesByWorldIndex(worldIndex);

        this.defaultWidth = this.boundingBox.width;
        this.defaultHeight = this.boundingBox.height;
        this.initializeTabs([]);
        this.worldIndex = worldIndex;
        this.tradeBox1 = this.createTradeBox(0);
        this.tradeBox1.boundingBox.x = 300;
        this.tradeBox1.boundingBox.y = 100;
        this.addHitbox(this.tradeBox1);
        this.tradeBox2 = this.createTradeBox(1);
        this.addHitbox(this.tradeBox2);
        var fontSize = Math.min(14, 0.032 * this.boundingBox.height);
        this.tradeButton1 = new Button(
            JustUpgrade, _("MAKE TRADE"), fontSize + "px Verdana", "#000000",
            {
                x: -100, // Coordinates are set in render()
                y: -100,
                width: this.boundingBox.width * .20,
                height: this.boundingBox.height * .05
            },
            {
                onmousedown: function ()
                {
                    var trade = getTradesForWorld(this.getRootLayer().worldIndex)[0];
                    makeTrade(this.getRootLayer().worldIndex, trade);
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                },
                onmouseenter: function ()
                {
                    var trade = this.getRootLayer().trades[0];
                    var tradeStrings = generateTradeOfferStrings(trade);
                    var coords = this.getGlobalCoordinates(0, this.boundingBox.height);
                    showTooltip(_("Value"), _("Payment Value: ") + tradeStrings.paymentValueString + "<br><br>" + _("Reward Value: ") + tradeStrings.rewardValueString, coords.x, coords.y);
                },
                onmouseexit: function ()
                {
                    hideTooltip();
                }
            },
            'pointer',
            "tradeButton1"
        );
        this.tradeButton2 = new Button(
            JustUpgrade, _("MAKE TRADE"), fontSize + "px Verdana", "#000000",
            {
                x: -100, // Coordinates are set in render()
                y: -100,
                width: this.boundingBox.width * .20,
                height: this.boundingBox.height * .05
            },
            {
                onmousedown: function ()
                {
                    var trade = getTradesForWorld(this.getRootLayer().worldIndex)[1];
                    makeTrade(this.getRootLayer().worldIndex, trade);
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                },
                onmouseenter: function ()
                {
                    var trade = this.getRootLayer().trades[1];
                    var tradeStrings = generateTradeOfferStrings(trade);
                    var coords = this.getGlobalCoordinates(0, this.boundingBox.height);
                    showTooltip(_("Value"), _("Payment Value: ") + tradeStrings.paymentValueString + "<br><br>" + _("Reward Value: ") + tradeStrings.rewardValueString, coords.x, coords.y);
                },
                onmouseexit: function ()
                {
                    hideTooltip();
                }
            },
            'pointer',
            "tradeButton2"
        );
        this.newTradeButton = new Button(
            JustUpgrade, _("New Trade"), fontSize + "px Verdana", "#000000",
            {
                x: -100, // Coordinates are set in render()
                y: -100,
                width: this.boundingBox.width * .20,
                height: this.boundingBox.height * .05
            },
            {
                onmousedown: function ()
                {
                    confirmRerollTrade(this.getRootLayer().worldIndex);
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                },
                onmouseenter: function ()
                {
                    var coords = this.getGlobalCoordinates(0, this.boundingBox.height);
                    showTooltip(_("New Trade"), _("Pay 1 ticket to get a new trade"), coords.x, coords.y);
                },
                onmouseexit: function ()
                {
                    hideTooltip();
                }
            },
            'pointer',
            "newTradeButton"
        );
        this.timer = new Hitbox(
            {
                x: this.bodyContainer.boundingBox.x + this.boundingBox.width * 0.03,
                y: this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height - this.boundingBox.height * 0.16,
                width: this.boundingBox.width * 0.2,
                height: this.boundingBox.height * 0.08,
            },
            {
                onmouseenter: function ()
                {
                    var coords = this.getGlobalCoordinates(0, this.boundingBox.height);
                    showTooltip(_("Time Left In Trade"), "", coords.x, coords.y);
                },
                onmouseexit: function ()
                {
                    hideTooltip();
                }
            }
        )
        this.extendTradeButton = new Button(
            JustUpgrade, _("Extend Trade"), fontSize + "px Verdana", "#000000",
            {
                x: this.timer.boundingBox.x,
                y: this.timer.boundingBox.y + this.timer.boundingBox.height,
                width: this.timer.boundingBox.width,
                height: this.boundingBox.height * .05
            },
            {
                onmousedown: function ()
                {
                    confirmExtendTrade(this.getRootLayer().worldIndex);
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                },
                onmouseenter: function ()
                {
                    var coords = this.getGlobalCoordinates(0, this.boundingBox.height);
                    showTooltip(_("Extend Trade"), _("Pay 1 ticket to extend the trade duration by 1 hour"), coords.x, coords.y);
                },
                onmouseexit: function ()
                {
                    hideTooltip();
                }
            },
            'pointer',
            "extendTradeButton"
        );
        this.addHitbox(this.tradeButton1);
        this.addHitbox(this.tradeButton2);
        this.addHitbox(this.newTradeButton);
        this.addHitbox(this.timer);
        this.addHitbox(this.extendTradeButton);
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.defaultWidth, this.defaultHeight);
        this.context.restore();
        super.render(); // Render any child layers

        this.context.fillStyle = "#FFFFFF";
        this.trades = getTradesForWorld(this.worldIndex);
        if(!isTradeAvailable(this.trades[0]) && !isTradeAvailable(this.trades[1]))
        {
            this.boundingBox.width = this.defaultWidth;
            this.boundingBox.height = this.defaultHeight;
            var fontSize = Math.min(14, 0.032 * this.boundingBox.height);
            var fontToUse = fontSize + "px Verdana";
            this.context.font = fontToUse;
            this.tradeBox1.setVisible(false)
            this.tradeBox1.setEnabled(false)
            this.tradeBox2.setVisible(false)
            this.tradeBox2.setEnabled(false)
            this.tradeButton1.setVisible(false)
            this.tradeButton1.setEnabled(false)
            this.tradeButton2.setVisible(false)
            this.tradeButton2.setEnabled(false)
            this.extendTradeButton.setVisible(false)
            this.extendTradeButton.setEnabled(false)
            this.newTradeButton.setVisible(true)
            this.newTradeButton.setEnabled(true)
            var message = _("There's nobody here...") + " <br> " + _("Upgrade your trading post to decrease time between trades.");
            var messageBox = fillTextWrap(this.context, _(message), this.bodyContainer.boundingBox.x, this.bodyContainer.boundingBox.y + this.boundingBox.height * 0.3, this.bodyContainer.boundingBox.width, "center");
            this.newTradeButton.boundingBox.x = this.boundingBox.width / 2 - this.newTradeButton.boundingBox.width / 2;
            this.newTradeButton.boundingBox.y = this.boundingBox.height / 2 - this.newTradeButton.boundingBox.height / 2;
            var remainingTime = getNextTradeTimeForWorld(this.worldIndex) - playtime;

            renderProgressBar(
                this.context,
                _("New Trade In {0}", formattedCountDown(remainingTime)),
                darkdot,
                darkdot,
                this.boundingBox.width * 0.2,
                this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height - this.boundingBox.height * 0.16,
                this.boundingBox.width * 0.6,
                this.boundingBox.height * 0.08,
                "#FFFFFF",
                0
            );
        }
        else if(!isTradeAvailable(this.trades[0]) || !isTradeAvailable(this.trades[1]))
        {
            this.tradeBox1.setVisible(false)
            this.tradeBox1.setEnabled(false)
            this.tradeBox2.setVisible(false)
            this.tradeBox2.setEnabled(false)
            this.tradeButton1.setVisible(false)
            this.tradeButton1.setEnabled(false)
            this.tradeButton2.setVisible(false)
            this.tradeButton2.setEnabled(false)
            this.newTradeButton.setVisible(false)
            this.newTradeButton.setEnabled(false)
            this.extendTradeButton.setVisible(false)
            this.extendTradeButton.setEnabled(false)

            var message = _("There was an error, please contact a dev with your export code if you are able to.\nThis error should resolve itself on the next trade.");
            fillTextWrap(this.context, message, this.bodyContainer.boundingBox.x, this.bodyContainer.boundingBox.y + this.boundingBox.height * 0.3, this.bodyContainer.boundingBox.width, "center");

            var duration = this.trades[0][TRADE_INDEX_DURATION];
            var startTime = this.trades[0][TRADE_INDEX_START_TIME];
            if(isNaN(duration) || isNaN(startTime))
            {
                duration = this.trades[1][TRADE_INDEX_DURATION];
                startTime = this.trades[1][TRADE_INDEX_START_TIME];
            }
            var remainingTime = duration - ((currentTime() / 1000) - startTime);
            var percentComplete = (duration - remainingTime) / duration;
            renderProgressBar(
                this.context,
                _("Time Remaining: {0}", formattedCountDown(remainingTime)),
                darkdot,
                darkdot,
                this.boundingBox.width * 0.2,
                this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height - this.boundingBox.height * 0.16,
                this.boundingBox.width * 0.6,
                this.boundingBox.height * 0.08,
                "#FFFFFF",
                0
            );
        }
        else
        {
            this.tradeBox1.setVisible(true)
            this.tradeBox1.setEnabled(true)
            this.tradeBox2.setVisible(true)
            this.tradeBox2.setEnabled(true)
            this.tradeButton1.setVisible(true)
            this.tradeButton1.setEnabled(true)
            this.tradeButton2.setVisible(true)
            this.tradeButton2.setEnabled(true)
            this.newTradeButton.setVisible(true)
            this.newTradeButton.setEnabled(true)
            this.extendTradeButton.setVisible(true)
            this.extendTradeButton.setEnabled(true)
            var trader = traders[this.worldIndex][this.trades[0][TRADE_INDEX_TRADER]];
            var startTime = this.trades[0][TRADE_INDEX_START_TIME];
            var duration = this.trades[0][TRADE_INDEX_DURATION];
            var portrait = getTraderImage(this.worldIndex, this.trades[0][TRADE_INDEX_TRADER]);
            var portraitWidth = this.boundingBox.width * 0.2;
            var portraitHeight = portraitWidth * (portrait.height / portrait.width);
            var frameWidth = portraitWidth * 1.2;
            var frameHeight = portraitHeight * 1.2;
            var fontSize = Math.min(14, 0.032 * this.boundingBox.height);
            var fontToUse = fontSize + "px Verdana";
            this.context.font = fontToUse;
            /*this.context.drawImage(
                characterInfoFrame,
                this.bodyContainer.boundingBox.x + this.boundingBox.width * 0.02,
                this.bodyContainer.boundingBox.y + this.boundingBox.height * 0.06,
                frameWidth,
                frameHeight
            );*/
            this.context.drawImage(
                darkgreydot,
                this.bodyContainer.boundingBox.x + this.boundingBox.width * 0.03,
                this.bodyContainer.boundingBox.y + this.boundingBox.height * 0.09,
                portraitWidth,
                portraitHeight
            );
            this.context.drawImage(
                portrait,
                this.bodyContainer.boundingBox.x + this.boundingBox.width * 0.03,
                this.bodyContainer.boundingBox.y + this.boundingBox.height * 0.09,
                portraitWidth,
                portraitHeight
            );
            var traderName = fillTextShrinkToFit(
                this.context,
                trader.name,
                this.bodyContainer.boundingBox.x + this.boundingBox.width * 0.02,
                this.bodyContainer.boundingBox.y + frameHeight + this.boundingBox.height * 0.09,
                frameWidth,
                "center"
            );
            this.newTradeButton.boundingBox.x = this.bodyContainer.boundingBox.x + this.boundingBox.width * 0.03;
            this.newTradeButton.boundingBox.y = traderName.y1 + 18;
            var introDialogueIndex = Math.floor(this.trades[0][TRADE_INDEX_START_TIME]) % trader.introDialogue.length;
            var introDialogueBox = fillTextWrap(
                this.context,
                trader.introDialogue[introDialogueIndex],
                this.bodyContainer.boundingBox.x + frameWidth + 30,
                this.bodyContainer.boundingBox.y + Math.min(40, 0.066 * this.boundingBox.height),
                this.bodyContainer.boundingBox.width - frameWidth - 50
            );
            this.tradeBox1.boundingBox.x = introDialogueBox.x1;
            this.tradeBox1.boundingBox.y = introDialogueBox.y2;
            this.tradeBox1.boundingBox.width = this.bodyContainer.boundingBox.width - frameWidth - 50;

            this.tradeButton1.boundingBox.x = (this.tradeBox1.boundingBox.x + this.tradeBox1.boundingBox.width / 2 - this.boundingBox.width * .1);
            this.tradeButton1.boundingBox.y = (this.tradeBox1.boundingBox.y + this.tradeBox1.boundingBox.height + 5);

            this.tradeBox2.boundingBox.x = introDialogueBox.x1;
            this.tradeBox2.boundingBox.y = this.tradeButton1.boundingBox.y + this.tradeButton1.boundingBox.height + 7;
            this.tradeBox2.boundingBox.width = this.bodyContainer.boundingBox.width - frameWidth - 50;

            this.tradeButton2.boundingBox.x = (this.tradeBox2.boundingBox.x + this.tradeBox2.boundingBox.width / 2 - this.boundingBox.width * .1);
            this.tradeButton2.boundingBox.y = (this.tradeBox2.boundingBox.y + this.tradeBox2.boundingBox.height + 5);

            // this.boundingBox.height = Math.min(this.defaultHeight, this.tradeButton2.boundingBox.y + this.tradeButton2.boundingBox.height + 80)
            // document.getElementById("TRADINGPOSTD").style.height = this.boundingBox.height;

            var remainingTime = duration - ((currentTime() / 1000) - startTime);
            var percentComplete = (duration - remainingTime) / duration;
            renderProgressBar(
                this.context,
                formattedCountDown(remainingTime),
                darkdot,
                darkdot,
                this.timer.boundingBox.x,
                this.timer.boundingBox.y,
                this.timer.boundingBox.width,
                this.timer.boundingBox.height,
                "#FFFFFF",
                0
            );
        }
        this.context.restore();
    }

    createTradeBox(tradeIndex)
    {
        var iconWidth = Math.min(55, 0.091 * this.boundingBox.height);
        var iconHeight = iconWidth;
        var padding = 5;
        var width = this.boundingBox.width;
        var height = this.boundingBox.height;
        var arrowLength = width * 0.14;
        var arrowHeight = height * 0.12;
        var tradeBox = new Hitbox(
            {
                x: -300,
                y: -300,
                width: this.boundingBox.width * 0.5,
                height: Math.min(100, 0.17 * this.boundingBox.height)
            },
            {},
            ""
        );
        tradeBox.render = function ()
        {
            var context = this.getContext();
            var root = this.getRootLayer();
            if(root.trades.length == 0 || !isTradeAvailable(root.trades[0])) return;
            var trade = root.trades[tradeIndex];
            var tradeStrings = generateTradeOfferStrings(trade);
            var coords = this.getRelativeCoordinates(0, 0, root);
            var x = coords.x;
            var y = coords.y;
            context.save();
            context.fillStyle = "#000000";
            context.globalAlpha = 0.4;
            context.fillRect(x, y, this.boundingBox.width, this.boundingBox.height);
            context.globalAlpha = 1;
            context.fillStyle = "#FFFFFF";
            context.strokeStyle = "#FFFFFF";
            context.textBaseline = "top";
            var fontSize = Math.min(14, 0.032 * root.boundingBox.height);
            context.font = fontSize + "px Verdana";
            var paymentLabel = fillTextWrap(
                context,
                _("YOU PAY:"),
                x,
                y + padding,
                this.boundingBox.width / 2 - arrowLength / 2 - 2 * padding,
                "center",
                0.25
            );
            var paymentString = fillTextWrap(
                context,
                tradeStrings.paymentString,
                x,
                paymentLabel.y2 + iconHeight + 2 * padding,
                this.boundingBox.width / 2 - arrowLength / 2 - 2 * padding,
                "center",
                0.25
            );
            /*var paymentValueString = fillTextWrap(
                context,
                tradeStrings.paymentValueString,
                x,
                paymentLabel.y2 + iconHeight + 5 * padding,
                this.boundingBox.width / 2 - arrowLength / 2 - 2 * padding,
                "center",
                0.25
            );*/
            var rewardLabel = fillTextWrap(
                context,
                _("YOU RECEIVE:"),
                x + 3 * this.boundingBox.width / 4 + arrowLength / 4 - (this.boundingBox.width / 2 - arrowLength / 2 - 2 * padding) / 2,
                y + padding,
                this.boundingBox.width / 2 - arrowLength / 2 - 2 * padding,
                "center",
                0.25
            );
            var rewardString = fillTextWrap(
                context,
                tradeStrings.rewardString,
                x + 3 * this.boundingBox.width / 4 + arrowLength / 4 - (this.boundingBox.width / 2 - arrowLength / 2 - 2 * padding) / 2,
                rewardLabel.y2 + iconHeight + 2 * padding,
                this.boundingBox.width / 2 - arrowLength / 2 - 2 * padding,
                "center",
                0.25
            );
            /*var rewardValueString = fillTextWrap(
                context,
                tradeStrings.rewardValueString,
                x + 3 * this.boundingBox.width / 4 + arrowLength / 4 - (this.boundingBox.width / 2 - arrowLength / 2 - 2 * padding) / 2,
                rewardLabel.y2 + iconHeight + 5 * padding,
                this.boundingBox.width / 2 - arrowLength / 2 - 2 * padding,
                "center",
                0.25
            );*/
            if(paymentString.y2 - y > this.boundingBox.height) this.boundingBox.height = paymentString.y2 - y + 2 * padding;
            if(rewardString.y2 - y > this.boundingBox.height) this.boundingBox.height = rewardString.y2 - y + 2 * padding;
            //if(tradeStrings.paymentValueString.length > 1 && paymentValueString.y2 - y > this.boundingBox.height) this.boundingBox.height = paymentValueString.y2 - y + 2 * padding;
            //if(tradeStrings.rewardValueString.length > 1 && rewardValueString.y2 - y > this.boundingBox.height) this.boundingBox.height = rewardValueString.y2 - y + 2 * padding;
            // Draw arrow
            context.lineWidth = 3;
            context.beginPath();
            context.moveTo(x + this.boundingBox.width / 2 - arrowLength / 2, y + this.boundingBox.height / 2 + arrowHeight / 4);  // Top left of stem
            context.lineTo(x + this.boundingBox.width / 2 + arrowLength / 12, y + this.boundingBox.height / 2 + arrowHeight / 4); // Top right of stem
            context.lineTo(x + this.boundingBox.width / 2 + arrowLength / 12, y + this.boundingBox.height / 2 + arrowHeight / 2); // Top of point
            context.lineTo(x + this.boundingBox.width / 2 + arrowLength / 2, y + this.boundingBox.height / 2);                    // End of point
            context.lineTo(x + this.boundingBox.width / 2 + arrowLength / 12, y + this.boundingBox.height / 2 - arrowHeight / 2); // Bottom of point
            context.lineTo(x + this.boundingBox.width / 2 + arrowLength / 12, y + this.boundingBox.height / 2 - arrowHeight / 4); // Bottom right of stem
            context.lineTo(x + this.boundingBox.width / 2 - arrowLength / 2, y + this.boundingBox.height / 2 - arrowHeight / 4);  // Bottom left of stem
            context.closePath();
            // context.stroke();
            context.fill();
            context.restore();
            this.renderChildren();
        }

        var paymentBox = new Hitbox(
            {
                x: tradeBox.boundingBox.width / 4 - arrowLength / 8 - iconWidth / 2,
                y: 0,
                width: iconWidth,
                height: tradeBox.boundingBox.height
            },
            {},
            ""
        );

        tradeBox.addHitbox(paymentBox);

        paymentBox.render = function ()
        {
            var context = this.getContext();
            var root = this.getRootLayer();
            var trade = root.trades[tradeIndex];
            var coords = this.getRelativeCoordinates(0, 0, root);
            var x = coords.x;
            var y = coords.y;
            context.save();
            drawTradeIcon(
                context,
                trade[TRADE_INDEX_PAYMENT_TYPE],
                trade[TRADE_INDEX_PAYMENT_SUBTYPE],
                x,
                y,
                this.boundingBox.width,
                this.boundingBox.height
            );
            context.restore();
        }

        var rewardBox = new Hitbox(
            {
                x: 3 * tradeBox.boundingBox.width / 4 + 5 * arrowLength / 8,
                y: 0,
                width: iconWidth,
                height: tradeBox.boundingBox.height
            },
            {
                onmouseenter: function ()
                {
                    var coords = this.getGlobalCoordinates(0, this.boundingBox.height);
                    var trade = this.getRootLayer().trades[tradeIndex];
                    switch(trade[TRADE_INDEX_REWARD_TYPE])
                    {
                        case TRADE_TYPE_BUFF:
                            //AO: This is jank as hell fix this later
                            if(trade[TRADE_INDEX_REWARD_SUBTYPE] != 6)
                            {
                                buffs.showInactiveBuffTooltip(trade[TRADE_INDEX_REWARD_SUBTYPE], coords.x, coords.y, 50, 10);
                            }
                            else
                            {
                                buffs.showInactiveBuffTooltip(trade[TRADE_INDEX_REWARD_SUBTYPE], coords.x, coords.y, 50, 0.5);
                            }
                            break;
                        case TRADE_TYPE_RELIC:
                            showTooltipForUnequippedRelic(trade[TRADE_INDEX_REWARD_SUBTYPE], coords.x, coords.y);
                            break;
                        case TRADE_TYPE_BLUEPRINT:
                            var rewardBlueprintStats = getDrillEquipByBlueprintId(trade[TRADE_INDEX_REWARD_SUBTYPE]);
                            var drillPart = new DrillCraftingItem(rewardBlueprintStats.id);
                            var description = drillPart.getDescription();
                            showTooltip(rewardBlueprintStats.translatedName + " (Lvl " + rewardBlueprintStats.level + ")", description, coords.x, coords.y);
                            break;
                    }
                },
                onmouseexit: function ()
                {
                    hideTooltip();
                }
            },
            ""
        )

        tradeBox.addHitbox(rewardBox);

        rewardBox.render = function ()
        {
            var context = this.getContext();
            var root = this.getRootLayer();
            var trade = root.trades[tradeIndex];
            var coords = this.getRelativeCoordinates(0, 0, root);
            var x = coords.x;
            var y = coords.y;
            context.save();
            drawTradeIcon(
                context,
                trade[TRADE_INDEX_REWARD_TYPE],
                trade[TRADE_INDEX_REWARD_SUBTYPE],
                x,
                y,
                this.boundingBox.width,
                this.boundingBox.height
            );
            context.restore();
        }

        return tradeBox;
    }
}