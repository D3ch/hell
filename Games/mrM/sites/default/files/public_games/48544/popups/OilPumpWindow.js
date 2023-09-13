class OilPumpWindow extends TabbedPopupWindow
{
    layerName = "oilPump"; // Used as key in activeLayers
    domElementId = "OILD"; // ID of dom element that gets shown or hidden
    context = OIL;         // Canvas rendering context for popup

    constructor(boundingBox)
    {
        super(boundingBox); // Need to call base class constructor
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        this.initializeTabs(Object.values({}));

        // Time to full tooltip
        this.addHitbox(new Hitbox(
            {
                x: this.boundingBox.width * 0.33,
                y: (this.boundingBox.height) * 0.33,
                width: this.boundingBox.width * 0.35,
                height: this.boundingBox.height * 0.4
            },
            {
                onmouseenter: function ()
                {
                    var timeTillFull = new Date(0);
                    timeTillFull.setSeconds(oilTimeToFull());

                    showTooltip(_("Time Until Full"), "<center>" + timeTillFull.toISOString().substr(11, 8) + "</center>", mouseX, mouseY)
                },
                onmouseexit: function ()
                {
                    hideTooltip()
                }
            },
            'pointer',
            "currencyTooltip"
        ));
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.context.restore();
        super.render();

        if(oilRigStats[oilrigStructure.level][1] > numOilOwned())
        {
            this.context.drawImage(getOilRigAsset(), 200 * getAnimationFrameIndex(4, 10), 0, 200, 200, this.boundingBox.width * .3, this.boundingBox.height * .15, this.boundingBox.width * .4, this.boundingBox.height * .5);
        }
        else
        {
            this.context.drawImage(getOilRigAsset(), 0, 0, 200, 200, this.boundingBox.width * .3, this.boundingBox.height * .16, this.boundingBox.width * .4, this.boundingBox.height * .5);
        }

        this.context.drawImage(darkdot, 0, 0, 1, 1, this.boundingBox.width * .1, this.boundingBox.height * .7, this.boundingBox.width * .8, this.boundingBox.height * .07);
        if(numOilOwned() < oilRigStats[oilrigStructure.level][1])
        {
            this.context.drawImage(darkdot, 0, 0, 1, 1, this.boundingBox.width * .1, this.boundingBox.height * .7, this.boundingBox.width * .8 * (oilRigTime / (oilRigStats[oilrigStructure.level][0] * STAT.oilGenerationMultiplier())), this.boundingBox.height * .07);
        }

        this.context.drawImage(OIL_icon, 0, 0, 50, 50, this.boundingBox.width * .455 - (this.context.measureText(_("Current Oil") + ": " + numOilOwned() + "/" + oilRigStats[oilrigStructure.level][1]).width / 2), this.boundingBox.height * .71, this.boundingBox.width * .04, this.boundingBox.height * .05);

        this.context.fillStyle = "#FFFFFF";
        this.context.fillText(_("Current Oil") + ": " + numOilOwned() + "/" + oilRigStats[oilrigStructure.level][1], this.boundingBox.width * .5 - (this.context.measureText(_("Current Oil") + ": " + numOilOwned() + "/" + oilRigStats[oilrigStructure.level][1]).width / 2), this.boundingBox.height * .75);
        this.context.fillText(_("Oil Pump Lvl.{0}", oilrigStructure.level), this.boundingBox.width * .05, this.boundingBox.height * .2);
    }
}
