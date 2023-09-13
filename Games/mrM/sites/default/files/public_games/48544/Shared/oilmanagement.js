var oilRigTime = 0;
var oilRigStats = [
    [7200, 1],
    [3600, 2],
    [1800, 4],
    [900, 16],
    [600, 32],
    [400, 100],
    [300, 200],
    [250, 400],
    [100, 1000],
    [100, 2000],
    [80, 4000],
    [50, 8000],
    [45, 12000],
    [40, 16000],
    [36, 20000],
    [33, 25000],
    [30, 30000]
];
//generation time (seconds), max hold

var oilRigUpgradeCosts = [
    100000000000, //100BIL
    250000000000, //250BIL
    500000000000, //500BIL
    1000000000000, //1T
    2000000000000, //2T
    3000000000000, //3T
    5000000000000, //5TRIL
    10000000000000, //10T
    50000000000000, //50T
    100000000000000, //100T
    500000000000000, //500T
    3000000000000000, // 3q
    50000000000000000, // 50q
    500000000000000000, // 500q
    20000000000000000000, // 20Q
    600000000000000000000, // 600Q
];

function oilLogic(seconds)
{
    oilRigTime += seconds;
    if(!isOilRigFull())
    {
        if(oilRigTime >= (oilRigStats[oilrigStructure.level][0] * STAT.oilGenerationMultiplier()))
        {
            oilRigTime -= (oilRigStats[oilrigStructure.level][0] * STAT.oilGenerationMultiplier());
            worldResources[OIL_INDEX].numOwned++;
            oilLogic(0);
        }
    }
    else
    {
        oilRigTime = 0;
    }
}

function isOilRigFull()
{
    return numOilOwned() >= oilRigStats[oilrigStructure.level][1];
}

function oilGeneratedPerHour()
{
    return parseInt((60 * 60) / oilRigStats[oilrigStructure.level][0]);
}

//Get how many seconds left to full
function oilTimeToFull()
{
    //Max Oil * Seconds per oil = total seconds to full
    var secondsToFull = oilRigStats[oilrigStructure.level][1] * (oilRigStats[oilrigStructure.level][0] * STAT.oilGenerationMultiplier())

    //Subtract oil owned * seconds to account for progress
    secondsToFull -= numOilOwned() * (oilRigStats[oilrigStructure.level][0] * STAT.oilGenerationMultiplier())

    //subtract oilRigTime to account for current generation progress (if below 0 just return 0)
    return (secondsToFull - oilRigTime) <= 0 ? 0 : (secondsToFull - oilRigTime)
}

function getOilRigAsset()
{
    if(oilrigStructure.level <= 1)
    {
        return Oil_Extractor;
    }
    else if(oilrigStructure.level <= 3)
    {
        return Oil_Extractor2;
    }
    else if(oilrigStructure.level <= 5)
    {
        return Oil_Extractor3;
    }
    else if(oilrigStructure.level <= 7)
    {
        return Oil_Extractor4;
    }
    else if(oilrigStructure.level <= 9)
    {
        return Oil_Extractor5;
    }
    else if(oilrigStructure.level > 9)
    {
        return Oil_Extractor6;
    }
}