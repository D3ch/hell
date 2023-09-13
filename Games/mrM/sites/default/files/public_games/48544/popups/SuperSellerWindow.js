class SuperSellerWindow extends TabbedPopupWindow
{
    layerName = "SupSell"; // Used as key in activeLayers
    domElementId = "SUPSELLD"; // ID of dom element that gets shown or hidden
    context = SSD;         // Canvas rendering context for popup

    constructor(boundingBox, superSeller)
    {
        super(boundingBox);
        if(!boundingBox)
        {
            this.setBoundingBox();
        }
        this.initializeTabs(Object.values({}));

        this.superMiner = superSeller;

        this.resources = {
            minerals: worldResources.filter(resource =>
                (!resource.isIsotope && resource.isOnHeader && resource.index <= highestOreUnlocked) ||
                (resource.isIsotope && resource.index <= highestIsotopeUnlocked))
                .sort((a, b) => a.isIsotope - b.isIsotope)
        };

        //maybe want to do this later? with headers displayed for minerals and isotopes seperately.
        // this.resources = {
        //     minerals: worldResources.filter(resource => (!resource.isIsotope && resource.isOnHeader && resource.index <= highestOreUnlocked)),
        //     isotopes: worldResources.filter(resource => (resource.isIsotope && resource.index <= highestIsotopeUnlocked))
        // }

        this.mineralPane = new Scrollbox(
            this.boundingBox.width * .95,
            this.boundingBox.height + ((this.boundingBox.height * 0.04) * Math.floor(this.resources.minerals.length / 8)),
            this.context,
            0,
            this.boundingBox.height * 0.15,
            this.boundingBox.width * 0.95,
            this.boundingBox.height * 0.76,
            15

        );
        this.addHitbox(this.mineralPane);
        this.mineralPane.setVisible(true);
        this.mineralPane.setEnabled(true);


        this.initializeSuperMinerHitboxes();
    }


    initializeSuperMinerHitboxes()
    {
        this.mineralPane.clearHitboxes();

        //minerals first
        for(var i = 0; i < this.resources.minerals.length; i++)
        {
            this.mineralPane.addHitbox(new Hitbox(
                {
                    x: (this.mineralPane.boundingBox.width * (0.06 + (0.02 * (i % 8)))) + ((this.mineralPane.boundingBox.width * 0.1) * (i % 8)),
                    y: (this.mineralPane.boundingBox.height * (0.04 + (0.02 * Math.floor(i / 8)))) + ((this.mineralPane.boundingBox.width * 0.1) * Math.floor(i / 8)),
                    width: (this.mineralPane.boundingBox.width * 0.1),
                    height: (this.mineralPane.boundingBox.width * 0.1),
                },
                {
                    onmousedown: this.clickedMineral(i)

                },
                'pointer',
                'mineral_' + i
            ));
        }


    }

    clickedMineral(i)
    {
        return function ()
        {
            let mineralId = this.getRootLayer().resources.minerals[i].index;
            console.log(this.getRootLayer())
            this.getRootLayer().superMiner.attachedMineralId = mineralId;
            openUi(SuperMinerWindow, null, this.getRootLayer().superMiner);
        }
    }

    drawMineral(resource, slotX, slotY, slotSize)
    {

        this.mineralPane.context.drawImage(
            darkdot,
            0,
            0,
            darkdot.width,
            darkdot.height,
            slotX,
            slotY,
            slotSize,
            slotSize
        );

        //draw mineral
        this.mineralPane.context.drawImage(
            resource.largeIcon,
            0,
            0,
            resource.largeIcon.width,
            resource.largeIcon.height,
            slotX,
            slotY,
            slotSize,
            slotSize
        );

        //drawframe
        drawFrame(
            this.mineralPane.context,
            itemFrame,
            slotX,
            slotY,
            slotSize,
            slotSize,
            4,
            4,
            0,
            0
        );
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.context.restore();
        super.render(); // Render any child layers

        this.context.fillStyle = "#000000";
        this.context.font = (this.boundingBox.height * 0.07) + "px KanitM"
        fillTextShrinkToFit(this.context, _("Select A Mineral"), this.boundingBox.width * .025, this.boundingBox.height * .05, this.boundingBox.width * .95, "Center");

        this.mineralPane.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.mineralPane.context.font = (this.mineralPane.boundingBox.height * .1) + "px KanitM"
        this.mineralPane.context.fillStyle = "#000000";

        //minerals 
        for(var i = 0; i < this.resources.minerals.length; i++)
        {
            let mineralHitbox = this.mineralPane.getHitboxById("mineral_" + i);
            let resource = this.resources.minerals[i];
            if(mineralHitbox)
            {
                let boundingBox = mineralHitbox.boundingBox;
                this.drawMineral(resource, boundingBox.x, boundingBox.y, boundingBox.width);
            }
        }

        //isotopes

    }

}