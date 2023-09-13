class OfflineProgress extends TabbedPopupWindow
{
    layerName = "offlineProgress"; // Used as key in activeLayers
    domElementId = "OFFLINEPROGRESSD"; // ID of dom element that gets shown or hidden
    context = OFFLINEPROGRESS;         // Canvas rendering context for popup
    offlineProgressResults = {};
    openTime = 0;

    constructor(boundingBox)
    {
        super(boundingBox); // Need to call base class constructor
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        this.initializeTabs(Object.values({}));

        this.openTime = currentTime();
    }

    timeSinceOpened()
    {
        return currentTime() - this.openTime;
    }

    setOfflineProgressValues(offlineProgressResults)
    {
        this.offlineProgressResults = offlineProgressResults;
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.context.restore();
        super.render();

        this.context.fillStyle = "#FFFFFF";
        if(this.offlineProgressResults.hasOwnProperty("secondsOffline"))
        {
            if(managerStructure.level == 1)
            {
                this.context.drawImage(manager1, 0, 0, manager1.width, manager1.height, Math.ceil(offlineprogressdw * .02), offlineprogressdh * .14, Math.floor(offlineprogressdw * .14), Math.floor(offlineprogressdh * .30));
            }
            else if(managerStructure.level == 2)
            {
                this.context.drawImage(manager2, 0, 0, manager2.width, manager2.height, Math.ceil(offlineprogressdw * .02), offlineprogressdh * .14, Math.floor(offlineprogressdw * .14), Math.floor(offlineprogressdh * .30));
            }
            else
            {
                this.context.drawImage(manager3, 0, 0, manager3.width, manager3.height, Math.ceil(offlineprogressdw * .02), offlineprogressdh * .14, Math.floor(offlineprogressdw * .14), Math.floor(offlineprogressdh * .30));
            }

            this.context.font = "22px KanitM";
            fillTextShrinkToFit(
                this.context,
                _("While Offline Your Manager Gained You:"),
                this.boundingBox.width * .2,
                85,
                this.boundingBox.width * .7,
                "center"
            );
            fillTextShrinkToFit(
                this.context,
                _("+ " + this.offlineProgressResults.depth.toFixed(2) + "Km in Depth"),
                this.boundingBox.width * .2,
                115,
                this.boundingBox.width * .7,
                "center"
            );
            fillTextShrinkToFit(
                this.context,
                _("+ $" + beautifynum(this.offlineProgressResults.mineralValue)) + " in minerals",
                this.boundingBox.width * .2,
                145,
                this.boundingBox.width * .7,
                "center"
            );

            this.context.font = "14px KanitM";
            fillTextShrinkToFit(
                this.context,
                _("Level up your manager to improve offline efficiency and max offline duration."),
                this.boundingBox.width * .1,
                offlineprogressdh * .90,
                this.boundingBox.width * .8,
                "center"
            );
        }
    }

    close()
    {
        if(isPlayerReadyForPromo())
        {
            setTimeout(function () {openUi(PromoPopup);}, 100);
        }

        return super.close();
    }
}