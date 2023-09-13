
const ChestType = Object.freeze({
    "basic": 0,
    "gold": 1,
    "black": 2
});

const Chest = (function ()
{
    class TreasureChest
    {
        constructor(spawnDepth, worker, type, source)
        {
            this.depth = spawnDepth;
            this.worker = worker;
            this.type = type;
            this.source = source;
        }
    }

    function naturalChest(source, spawnDepth, worker, type)
    {

        if(type == ChestType.gold && !isOfflineProgressActive)
        {
            if(metalDetectorStructure.level > 0) {newNews(_("The Metal Detector Detected a Golden Chest!"), true);}
            if(metalDetectorStructure.level > 2) {newNews(_("Gold Chest is around Depth {0} Km", spawnDepth), true);}
        }

        return new TreasureChest(
            spawnDepth,
            worker,
            type,
            source.name
        );
    }

    function rewardedChest(source, spawnDepth, worker, type)
    {
        return new TreasureChest(
            spawnDepth,
            worker,
            type,
            source.name
        );
    }

    return {
        natural: {
            name: 'natural',
            new: naturalChest
        },
        purchased: {
            name: 'purchased',
            new: rewardedChest
        },
        quest: {
            name: 'quest',
            new: rewardedChest
        },
        excavation: {
            name: 'excavation',
            new: rewardedChest
        },
        cave: {
            name: 'cave',
            new: rewardedChest
        },
        buff: {
            name: 'buff',
            new: naturalChest
        },
        metaldetector: {
            name: 'metaldetector',
            new: naturalChest
        },
        superminer: {
            name: 'superminer',
            new: naturalChest
        }
    };
})();