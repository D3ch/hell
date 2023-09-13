//Simply holds data associated with an asset
class AssetData
{
    id;
    spritesheet;
    numFrames;
    numColumns;

    //initialized values
    numRows;
    frameWidth;
    frameHeight;
    numPixelsPerFrame;
    totalPixels;

    constructor(spritesheet, numFrames, numColumns)
    {
        this.id = spritesheet.id;
        this.spritesheet = spritesheet;
        this.numFrames = numFrames;
        this.numColumns = numColumns;
    }

    //sets some values, call after load
    init()
    {
        this.numRows = Math.ceil(this.numFrames / this.numColumns);
        this.frameWidth = this.spritesheet.width / this.numColumns;
        this.frameHeight = this.spritesheet.height / this.numRows;
        this.numPixelsPerFrame = this.frameWidth * this.frameHeight;
        this.totalPixels = this.spritesheet.width * this.spritesheet.height;
    }
}

//Holder of keyed AssetData definitions
class AssetDataManager
{
    assetDatas = {};
    numAssets = 0;

    constructor()
    {

    }

    getAssetData(id)
    {
        if(this.assetDatas.hasOwnProperty(id))
        {
            return this.assetDatas[id];
        }
        else
        {
            return null; //return "broken" assetdata?
        }
    }

    addAssetData(assetData)
    {
        if(assetData.id == null)
        {
            console.error("Empty Asset Data");
        }
        else
        {
            this.assetDatas[assetData.id] = assetData;
            this.numAssets++;
        }
    }
}
var assetDataManager = new AssetDataManager();