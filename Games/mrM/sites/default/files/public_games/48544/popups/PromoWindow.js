class PromoPopup extends TabbedPopupWindow
{
    layerName = "promopopup"; // Used as key in activeLayers
    domElementId = "PROMOD"; // ID of dom element that gets shown or hidden
    context = PROMO;         // Canvas rendering context for popup
    promoUrl = "https://play.google.com/store/apps/details?id=com.playsaurus.mrmine&hl=en_US&gl=US";
    promoAsset = activePromoAsset;
    promoText1 = "MrMine is now out on Google Play!";
    promoText2 = "Now you can manage your mine on the go!";

    constructor(boundingBox)
    {
        super(boundingBox); // Need to call base class constructor
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        this.initializeTabs(Object.values({}));

        this.addHitbox(new Button(
            JustUpgrade, _("Play on Mobile"), "26px KanitB", "#000000",
            {
                x: this.boundingBox.width * 0.3,     // Copied from renderButton call below
                y: this.boundingBox.height * 0.80,
                width: this.boundingBox.width * 0.4,
                height: this.boundingBox.height * 0.10
            },
            {
                onmousedown: function ()
                {
                    promosClicked.push(CURRENTLY_ACTIVE_PROMO_ID);
                    openExternalLinkInDefaultBrowser(this.parent.promoUrl);
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                }
            },
            'pointer',
            "upgradeButton"
        ));
        lastTimeSeenPromo = currentTime();
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.context.restore();
        super.render();

        this.context.fillStyle = "#FFFFFF";
        this.context.drawImage(this.promoAsset, 0, 0, this.promoAsset.width, this.promoAsset.height, Math.round(this.boundingBox.width * .2), Math.round(this.boundingBox.height * .13), Math.round(this.boundingBox.width * .6), Math.round(this.boundingBox.height * .495));
        this.context.font = "13px Verdana";
        this.context.fillText(this.promoText1, this.boundingBox.width * .5 - this.context.measureText(this.promoText1).width / 2, this.boundingBox.height * .690);
        this.context.font = "13px Verdana";
        this.context.fillText(this.promoText2, this.boundingBox.width * .5 - this.context.measureText(this.promoText2).width / 2, this.boundingBox.height * .74);
    }
}