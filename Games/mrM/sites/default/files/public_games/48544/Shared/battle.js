var monsterskilled = 0;
var whackosKilled = 0;
var battleWaiting = [];

//########## BATTLE SETUP #####################################

var monsterAtkTime = 0;
var monsterAtk = 1; //adjust for hp growth rate
var monsterMaxHP = 1; //adjust for atk growth rate
var monsterHP = 1;
var monsterID = 0;
var depthOfMonster = 0;
function userMaxHealth()
{
    var baseHealth = 800;
    var depthBonus = depth - 300 + Math.max(((depth - 1000) * 2), 0);
    var questBonus = (numQuestsCompleted() * 3);
    var buildingBonus = (gemForgeStructure.level * 3 * oilrigStructure.level);
    var weaponBonus = 0;
    for(var i = 0; i < battleInventory.length; i++)
    {
        if(battleInventory[i].length > 7)
        {
            weaponBonus += battleInventory[i][4]
        }
    }
    return (baseHealth + weaponBonus + ((depthBonus + questBonus + buildingBonus) * 4)) * STAT.battleHealthMultiplier();
}

var atkWeps = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var battleActive = false;
var userMaxHP = 1000;
var userHP = 1000;

function getEquip(E)
{
    if(E < 0 || E >= battleEquipStats.length)
    {
        console.warn("Attempting to grant invalid weapon");
        return;
    }
    var doesntHave = true;
    var emptySlot = 999;
    for(var Es = 0; Es < battleInventory.length; Es++)
    {
        if(battleInventory[Es].length > 0)
        {
            if(E == battleInventory[Es][0])
            {
                doesntHave = false;
                Es = 999; //exit loop check
            }
        }
        else
        {
            if(emptySlot == 999)
            {
                emptySlot = Es;
            }
        }
    }
    if(doesntHave && emptySlot < 999)
    {
        battleInventory[emptySlot] = [E, 0, 0, 0, 0, 0, 0, 0];
        makeBlueprintAvailable(2, E);
        learnBlueprint(2, E);
        newNews(_("The monster dropped a") + " " + getInventoryWeaponName(emptySlot) + "!", true);
    }
}

function hasEquip(E)
{
    var doesntHave = true;
    var emptySlot = 999;
    for(var Es = 0; Es < battleInventory.length; Es++)
    {
        if(battleInventory[Es].length > 0)
        {
            if(E == battleInventory[Es][0])
            {
                doesntHave = false;
                Es = 999; //exit loop check
            }
        }
        else
        {
            if(emptySlot == 999)
            {
                emptySlot = Es;
            }
        }
    }

    if(doesntHave && emptySlot < 999)
    {
        return false;
    }
    else
    {
        return true;
    }
}

// Bosses

var bossesDefeated = 0;
var bossStats = [
    [400, 8, _("Overlord"), bossLevel1, bossReward],
    [500, 9, _("The Unnammed"), bossLevel2, bossReward],
    [600, 10, _("Immortal Warlock"), bossLevel3, bossReward],
    [700, 11, _("Beast"), bossLevel4, grantChestCompressor],
    [800, 12, _("Ancient Wizard"), bossLevel5, bossReward],
    [900, 13, _("Radioactive Butcher"), bossLevel6, bossReward],
    [1132, 20, _("The Infected"), bossLevel7, bossReward],
    [1232, 21, _("The Infector"), bossLevel8, bossReward],
    [1332, 22, _("Zorgax"), bossLevel9, bossReward],
    [1432, 23, _("Ancient Defender"), bossLevel10, bossReward],
    [1532, 24, _("Squido"), bossLevel11, bossReward],
    [1632, 25, _("Lunarios"), bossLevel12, bossReward],
    [1732, 26, _("Bargo"), bossLevel13, bossReward],
    [1914, 33, _("Angler"), bossLevel14, bossReward]
];
//depth, monsterId, name, level, rewardFunction

function grantChestCompressor()
{
    chestCompressorStructure.level = 1;
    learnBlueprint(3, 12);
    newNews(_("Discovered the Chest Compressor!"));
}

function bossReward()
{
    return openGoldChest();
}

function getBossLevelAsset(depth)
{
    for(var i = bossesDefeated; i < bossStats.length; i++)
    {
        if(bossStats[i][0] == depth)
        {
            return bossStats[i][3];
        }
    }
    return level2;
}

function isBossLevel(depth)
{
    for(var i = bossesDefeated; i < bossStats.length; i++)
    {
        if(bossStats[i][0] == depth)
        {
            return true;
        }
    }
    return false;
}


function isStalledDueToBoss()
{
    if(bossesDefeated < bossStats.length)
    {
        if(bossStats[bossesDefeated][0] <= depth)
        {
            return true;
        }
    }
    return false;
}

function depthOfDeepestBossReached()
{
    return bossStats[bossesDefeated][0];
}

var isBossBattleActive = false;
var bossBattleId = -1;
function startBossBattle(bossId)
{
    if(bossStats[bossId][0] > depth) return;

    if(bossesDefeated == bossId && bossStats.length > bossId)
    {
        var bossMonsterId = bossStats[bossId][1];
        battleui(bossMonsterId, 1);

        isBossBattleActive = true;
        bossBattleId = bossId;
    }
    else
    {
        newNews(_("You must defeat boss at {0}", bossStats[bossesDefeated][0]));
    }
}

//Monsters
var monsterStats = [
    [],
    [12, 70, 1000, 1.05, 1.05, "Rocket", monster01, 1000000000n, 2, 100],
    [22, 120, 1000, 1.05, 1.05, "Ramer", monster02, 2000000000n, 3, 100],
    [30, 270, 1200, 1.05, 1.05, "Stone Man", monster03, 5000000000n, 4, 200],
    [40, 500, 1200, 1.05, 1.05, "RockLord", monster04, 5000000000n, 5, 200],
    [60, 500, 1000, 1.05, 1.05, "Ting", monster05, 50000000000n, 6, 200],
    [125, 600, 2250, 1.05, 1.05, "Blurk", monster06, 100000000000n, 7, 200],
    [200, 600, 1500, 1.05, 1.05, "Blurk", monster06, 250000000000n, 8, 200],
    [30, 300, 1000, 1.00, 1.00, _("Underlord"), DemonBoss, 0n, 2, 200], //400
    [45, 780, 2000, 1.00, 1.00, _("The Unnamed"), AbominationBoss, 0n, 2, 200], //500
    [55, 900, 2000, 1.00, 1.00, _("Immortal Warlock"), WarlockBoss, 0n, 2, 200], //600
    [65, 950, 2500, 1.00, 1.00, _("Beast"), DemonBoss, 0n, 2, 200], //700
    [105, 1300, 3000, 1.00, 1.00, _("Ancient Wizard"), AncientBoss, 0n, 2, 200], //800
    [150, 1500, 3000, 1.00, 1.00, _("Radioactive Butcher"), RadioactiveBoss, 0n, 2, 200], //900

    //World 2 - Monsters
    [250, 760, 2200, 1.05, 1.05, "Purpa", monster08, 500000000000n, 4, 100],
    [275, 1500, 2200, 1.05, 1.05, "Blurb", monster09, 700000000000n, 5, 100],
    [300, 1500, 2200, 1.05, 1.05, "Blinky", monster10, 1000000000000n, 6, 100],
    [325, 2000, 2500, 1.05, 1.05, "Bulda", monster11, 1400000000000n, 7, 100],
    [350, 2000, 1300, 1.05, 1.05, "Whacko", monster12, 3000000000000n, 8, 100],
    [375, 3000, 1500, 1.05, 1.05, "Godu", monster13, 5000000000000n, 9, 100],

    //World 2 - Bosses
    [200, 2500, 2500, 1.00, 1.00, _("The Infected"), TheInfected, 0n, 2, 200], //World 2 - 100
    [300, 3500, 2700, 1.00, 1.00, _("The Infector"), TheInfector, 0n, 2, 200], //World 2 - 200
    [375, 4000, 2800, 1.00, 1.00, _("Zorgax - 036"), Zorgax, 0n, 2, 200], //World 2 - 300
    [500, 8000, 4000, 1.00, 1.00, _("Ancient Defender"), AncientDefender, 0n, 2, 200], //World 2 - 400
    [500, 9000, 3000, 1.00, 1.00, _("Squido"), Squido, 0n, 2, 200], //World 2 - 500
    [500, 7000, 2000, 1.00, 1.00, _("Lunarios"), Lunarios, 0n, 2, 200], //World 2 - 600
    [600, 10000, 3000, 1.00, 1.00, _("Bargo"), Bargo, 0n, 2, 200], //World 2 - 700

    //World 2 - 400KM+ monsters
    [600, 1500, 1000, 1.05, 1.05, "Woobla", monster14, 7000000000000n, 10, 100],
    [650, 1700, 1000, 1.05, 1.05, "Wormer", monster15, 10000000000000n, 11, 100],
    [675, 1800, 1500, 1.05, 1.05, "Wooblo", monster16, 25000000000000n, 11, 100],
    [750, 2000, 1500, 1.05, 1.05, "Sploog", monster17, 50000000000000n, 11, 100],

    //world 3 - Monsters
    [750, 2500, 1250, 1.05, 1.05, "Razors", monster18, 25000000000000n, 11, 100],
    [775, 2500, 1250, 1.05, 1.05, "Wriggleys", monster19, 50000000000000n, 11, 100],

    //world 3 - Bosses
    [800, 5000, 1500, 1.00, 1.00, _("Angler"), Angler, 0n, 2, 200] //World 3 - 100

];
//base atk, base hp, atk speed, hp growth rate, atk growth rate, name, icon, DEPRECATED, item drop id 

var monstersOnLevels = [
    [[1, 1], [1, 2], [1, 2]],
    [[1, 2], [1, 3], [1, 3]],
    [[1, 4], [2, 1], [2, 2]],
    [[2, 1], [2, 2], [1, 3]],
    [[2, 1], [2, 2], [2, 3]],
    [[2, 2], [2, 3], [2, 1]],
    [[2, 3], [2, 3], [2, 2]],
    [[2, 3], [2, 3], [2, 3]],
    [[2, 3], [2, 3], [2, 3]],
    [[2, 4], [2, 4], [2, 4]], //390-400

    [[2, 5], [2, 5], [3, 1]],
    [[3, 1], [3, 2], [3, 2]],
    [[3, 1], [3, 2], [3, 2]],
    [[3, 2], [3, 2], [3, 3]],
    [[3, 3], [3, 3], [3, 3]],
    [[3, 3], [3, 1], [3, 3]],
    [[3, 3], [3, 2], [3, 3]],
    [[3, 3], [3, 3], [3, 4]],
    [[3, 4], [3, 4], [3, 4]],
    [[3, 4], [3, 4], [3, 4]], //490-500

    [[3, 5], [3, 5], [4, 1]],
    [[4, 1], [4, 2], [3, 2]],
    [[4, 1], [4, 2], [3, 2]],
    [[4, 2], [4, 2], [3, 3]],
    [[4, 3], [4, 3], [3, 3]],
    [[4, 3], [4, 1], [3, 3]],
    [[4, 3], [4, 2], [3, 3]],
    [[4, 3], [4, 3], [3, 4]],
    [[4, 4], [4, 4], [3, 4]],
    [[4, 4], [4, 4], [3, 4]], //590-600

    [[4, 5], [4, 5], [5, 1]],
    [[5, 1], [5, 2], [4, 2]],
    [[5, 1], [5, 2], [4, 2]],
    [[5, 2], [5, 2], [4, 3]],
    [[5, 3], [5, 3], [4, 3]],
    [[5, 3], [5, 1], [4, 3]],
    [[5, 3], [5, 2], [4, 3]],
    [[5, 3], [5, 3], [4, 4]],
    [[5, 4], [5, 4], [4, 4]],
    [[5, 4], [5, 4], [4, 4]], //690-700

    [[5, 5], [5, 5], [6, 1]],
    [[6, 1], [6, 2], [5, 2]],
    [[6, 1], [6, 2], [5, 2]],
    [[6, 2], [6, 2], [5, 3]],
    [[6, 3], [6, 3], [5, 3]],
    [[6, 3], [6, 1], [5, 3]],
    [[6, 3], [6, 2], [5, 3]],
    [[6, 3], [6, 3], [5, 4]],
    [[6, 4], [6, 4], [5, 4]],
    [[6, 4], [6, 4], [7, 1]], //790-800

    [[6, 5], [6, 5], [7, 1]],
    [[6, 6], [6, 6], [7, 2]],
    [[7, 1], [7, 2], [6, 6]],
    [[7, 1], [7, 2], [6, 6]],
    [[7, 2], [7, 3], [7, 1]],
    [[7, 2], [7, 3], [7, 1]],
    [[7, 3], [7, 3], [7, 2]],
    [[7, 3], [7, 3], [7, 2]],
    [[7, 4], [7, 3], [7, 3]],
    [[7, 4], [7, 4], [7, 3]], //890-900

    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]], //990-1000

    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],
    [[14, 1], [14, 1], [14, 1]],
    [[14, 1], [14, 2], [14, 1]],
    [[15, 1], [14, 2], [14, 3]],
    [[15, 1], [15, 1], [15, 2]],
    [[15, 1], [15, 2], [15, 3]],
    [[15, 2], [15, 3], [16, 1]],
    [[15, 3], [15, 4], [16, 1]],
    [[15, 4], [16, 1], [16, 2]], //1090-1100

    [[16, 1], [16, 1], [16, 2]],
    [[16, 1], [16, 2], [16, 3]],
    [[16, 2], [16, 3], [17, 1]],
    [[16, 3], [17, 1], [17, 1]],
    [[17, 1], [17, 1], [17, 2]],
    [[17, 1], [17, 2], [17, 3]],
    [[17, 2], [17, 2], [17, 3]],
    [[17, 3], [17, 4], [18, 1]],
    [[17, 4], [18, 1], [18, 1]],
    [[18, 1], [18, 1], [18, 2]], //1190-1200

    [[18, 1], [18, 1], [18, 2]],
    [[18, 1], [18, 2], [18, 2]],
    [[18, 1], [18, 2], [18, 3]],
    [[18, 2], [18, 2], [18, 3]],
    [[18, 2], [18, 3], [18, 3]],
    [[18, 2], [18, 3], [18, 4]],
    [[18, 3], [18, 3], [18, 4]],
    [[18, 3], [18, 4], [19, 1]],
    [[18, 4], [18, 4], [19, 1]],
    [[18, 5], [19, 1], [19, 2]], //1290-1300

    [[19, 1], [19, 1], [19, 2]],
    [[19, 1], [19, 2], [19, 2]],
    [[19, 1], [19, 2], [19, 3]],
    [[19, 2], [19, 2], [19, 3]],
    [[19, 2], [19, 3], [19, 3]],
    [[19, 2], [19, 3], [19, 4]],
    [[19, 3], [19, 3], [19, 4]],
    [[19, 4], [19, 4], [27, 1]],
    [[19, 4], [19, 4], [27, 1]],
    [[19, 4], [27, 1], [27, 2]], //1390-1400

    [[27, 1], [27, 1], [27, 2]],
    [[27, 1], [27, 2], [27, 2]],
    [[27, 1], [27, 2], [27, 3]],
    [[27, 2], [27, 2], [27, 3]],
    [[27, 2], [27, 3], [27, 3]],
    [[27, 2], [27, 3], [27, 4]],
    [[27, 3], [27, 3], [27, 4]],
    [[27, 4], [27, 4], [28, 1]],
    [[27, 4], [27, 4], [28, 1]],
    [[28, 1], [28, 2], [28, 2]], //1490-1500

    [[28, 1], [28, 1], [28, 2]],
    [[28, 1], [28, 2], [28, 2]],
    [[28, 1], [28, 2], [28, 3]],
    [[28, 2], [28, 2], [28, 3]],
    [[28, 2], [28, 3], [28, 3]],
    [[28, 2], [28, 3], [28, 4]],
    [[28, 3], [28, 3], [28, 4]],
    [[28, 4], [28, 4], [29, 1]],
    [[28, 4], [28, 4], [29, 1]],
    [[29, 1], [29, 2], [29, 2]], //1590-1600

    [[29, 1], [29, 1], [29, 2]],
    [[29, 1], [29, 2], [29, 2]],
    [[29, 1], [29, 2], [29, 3]],
    [[29, 2], [29, 2], [29, 3]],
    [[29, 2], [29, 3], [29, 3]],
    [[29, 2], [29, 3], [29, 4]],
    [[29, 3], [29, 3], [29, 4]],
    [[29, 4], [29, 4], [30, 1]],
    [[29, 4], [29, 4], [30, 1]],
    [[30, 1], [30, 2], [30, 2]], //1690-1700

    [[30, 1], [30, 1], [30, 2]],
    [[30, 1], [30, 2], [30, 2]],
    [[30, 1], [30, 2], [30, 3]],
    [[30, 2], [30, 2], [30, 3]],
    [[30, 2], [30, 3], [30, 3]],
    [[30, 2], [30, 3], [30, 4]],
    [[30, 3], [30, 3], [30, 4]],
    [[30, 4], [30, 4], [30, 4]],
    [[30, 4], [30, 4], [30, 4]],
    [[30, 4], [30, 4], [30, 4]], //1790-1800

    [[7, 4], [7, 4], [7, 4]],
    [[31, 1], [31, 1], [31, 1]],
    [[31, 1], [31, 1], [31, 1]],
    [[31, 1], [31, 1], [31, 2]],
    [[31, 1], [31, 2], [31, 2]],
    [[31, 2], [31, 2], [31, 2]],
    [[31, 2], [31, 2], [31, 3]],
    [[31, 2], [31, 3], [31, 3]],
    [[31, 3], [31, 3], [31, 3]],
    [[31, 3], [31, 4], [31, 4]], //1890-1900

    [[32, 1], [32, 1], [32, 2]],
    [[32, 1], [32, 2], [32, 2]],
    [[32, 1], [32, 2], [32, 3]],
    [[32, 2], [32, 2], [32, 3]],
    [[32, 2], [32, 3], [32, 3]],
    [[32, 2], [32, 3], [32, 4]],
    [[32, 3], [32, 3], [32, 4]],
    [[32, 4], [32, 4], [32, 4]],
    [[32, 4], [32, 4], [32, 4]],
    [[32, 4], [32, 4], [32, 4]] //1990-2000
];

//done in increments of ten representing the x*10 amount after 500
//micro [monster id, monster lvl]
//macro [75%,20%,5%]

//##############################################################

function preparebattle(x, y)
{
    if(!battleActive && !isBossBattleActive)
    {
        //monsterLvl = y
        monsterAtkTime = currentTime();
        monsterAtk = Math.floor(monsterStats[x][0] * Math.pow(monsterStats[x][4], y));
        monsterMaxHP = Math.floor(monsterStats[x][1] * Math.pow(monsterStats[x][3], y));
        monsterHP = monsterMaxHP;
        monsterID = x;
        dealtDmg = [];
        takenDmg = [];

        atkWeps = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        //battleActive = true;

        userMaxHP = userMaxHealth();
        userHP = userMaxHP;
    }
}

function atk(x)
{
    if(battleActive && x > -1 && ((currentTime() - atkWeps[x]) >= getInventoryWeaponSpeed(x)))
    {
        atkWeps[x] = currentTime();
        var damageToDeal = Math.round(getInventoryWeaponAttack(x) * STAT.battleDamageMultiplier());
        var critChance = STAT.battleCritChance();
        var isCrit = rand(0, 100) < critChance;
        if(isCrit)
        {
            damageToDeal *= 2;
        }

        monsterHP -= damageToDeal;
        if(damageToDeal > 0)
        {
            dealtDmg.push([damageToDeal, currentTime(), isCrit]);
        }
        if(battleInventory[x][0] == 10)
        {
            userHP += (userMaxHP * .05);
            if(userHP > userMaxHP)
            {
                userHP = userMaxHP;
            }
        }
        if(battleInventory[x][0] == 11)
        {
            for(var i = 0; i < atkWeps.length; i++)
            {
                if(i != x)
                {
                    atkWeps[i] -= getInventoryWeaponSpeed(i) * 0.33;
                }
            }
        }
        if(monsterHP <= 0)
        {
            wonBattle();
        }
    }
}

function monsterAttacked()
{
    var monDmgTemp = rand(Math.ceil(monsterAtk * .5), Math.floor(monsterAtk * 1.5));
    userHP -= monDmgTemp;
    takenDmg.push([monDmgTemp, currentTime()]);
    if(userHP <= 0)
    {
        lostBattle();
    }
}

function wonBattle()
{
    //handle possible equip drops
    //end battle
    battleActive = false;
    battleui(0, 0);
    monsterskilled++;
    if(monsterStats[monsterID][5] == "Whacko")
    {
        whackosKilled++;
    }

    if(!isBossBattleActive)
    {
        //process drops
        var dropMultiplier = BigInt(Math.floor(Math.pow((depthOfMonster / depth), 2) * 100 * depthMultiplier()));
        var dropCoin = (dropMultiplier * (valueOfMineralsPerSecond() * 60n * 60n * 3n)) / 100n
        trackEvent_GainedMoney(dropCoin, 5);
        addMoney(dropCoin);
        newNews(monsterStats[monsterID][5] + " " + _("dropped") + " $" + beautifynum(dropCoin) + "", true);

        var randomDrop = rand(0, 1000);
        if(randomDrop < (31 - monsterID))
        {
            getEquip(monsterStats[monsterID][8]);
        }
    }
    else
    {
        trackEvent_FinishBossBattle(1);
        isBossBattleActive = false;
        bossStats[bossBattleId][4]();
        bossesDefeated++;
        if(!mutebuttons) defeatBossAudio.play();
        bossBattleId = -1;
    }
}

function lostBattle()
{
    if(isBossBattleActive)
    {
        trackEvent_FinishBossBattle(0);
    }
    newNews(_("You lost the Battle"), true);
    newNews(_("Become stronger by upgrading your weapons or finding more in chests"), true);
    battleActive = false;
    battleui(0, 0);
    isBossBattleActive = false;
    bossBattleId = -1;
}

function upgradeInventory(x)
{
    if(battleInventory[x].length > 2)
    {
        var currentEquipLvl = battleInventory[x][4];
        if(worldResources[OIL_INDEX].numOwned >= upgradeEquipCosts[battleInventory[x][0]][currentEquipLvl][0] &&
            money >= (upgradeEquipCosts[battleInventory[x][0]][currentEquipLvl][1]) &&
            !battleInventory[x][6])
        {
            worldResources[OIL_INDEX].numOwned -= upgradeEquipCosts[battleInventory[x][0]][currentEquipLvl][0];
            subtractMoney((upgradeEquipCosts[battleInventory[x][0]][currentEquipLvl][1]));
            battleInventory[x][6] = 1;
            battleInventory[x][5] = (upgradeEquipCosts[battleInventory[x][0]][currentEquipLvl][2] * STAT.gemSpeedMultiplier());
        }
        else
        {
            newNews(_("An Error occured. Do you have enough money and oil?"));
        }
    }
}

function upgradelogic(t)
{
    /*for(var Inv = 0; Inv < battleInventory.length; Inv++)
    {
        if(battleInventory[Inv].length > 2)
        {
            if(battleInventory[Inv][6] == 1)
            {
                battleInventory[Inv][5] -= t;
                if(battleInventory[Inv][5] < 0)
                {
                    battleInventory[Inv][5] = 0;
                    battleInventory[Inv][6] = 0;

                    battleInventory[Inv][3] += upgradeEquipCosts[battleInventory[Inv][0]][battleInventory[Inv][4]][3];
                    battleInventory[Inv][2] -= upgradeEquipCosts[battleInventory[Inv][0]][battleInventory[Inv][4]][4];

                    battleInventory[Inv][4]++;

                    newNews(battleEquipStats[battleInventory[Inv][0]][3] + " " + _("Upgraded to Lvl") + " " + battleInventory[Inv][4] + "", true);
                }
            }
        }
    }*/
    oilLogic(t);
}

function battlerand()
{
    if(battleSpawnRoller.boolean(.07))
    {
        var workersAtDepth = workersHiredAtDepth(depth);
        var spawnX = battleSpawnRoller.rand(1, workersAtDepth);
        var spawnY = battleSpawnRoller.rand(Math.max(304, Math.floor(depth * .5)), depth);
        spawnBattleOnFloor(spawnY, spawnX);
    }
}

function spawnBattleOnFloor(spawnY, spawnX)
{
    if(battleWaiting.length == 0 && depth > 303)
    {
        if(!isDepthWithoutWorkers(spawnY))
        {
            newNews(_("Miner #{0} is being attacked at Depth {1}km!", spawnX, spawnY), true);
            var somePrand = battleSpawnRoller.rand(0, 100);
            var whichFromTable = 0;
            if(somePrand < 5)
            {
                whichFromTable = 2;
            }
            else if(somePrand < 25)
            {
                whichFromTable = 1;
            }
            var spawnMonDetails = monstersOnLevels[Math.floor((spawnY - 300) / 10)][whichFromTable];
            battleWaiting = [spawnX, spawnY, spawnMonDetails[0], spawnMonDetails[1]];
        }
    }
}