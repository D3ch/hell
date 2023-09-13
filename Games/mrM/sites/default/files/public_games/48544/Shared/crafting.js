var hasCraftedABlueprint = false;

function canCraftBlueprint(category, blueprintId, level = 0, ingredients = null, alreadyCheckedIsknown = false)
{
    if(!alreadyCheckedIsknown)
    {
        if(!isBlueprintKnown(category, blueprintId))
        {
            return false;
        }
    }
    var blueprint = getBlueprintById(category, blueprintId);
    if(!blueprint.craftedItem.item.canCraft()) return false;
    if(level == -1 && blueprint.levels)
    {
        if(Object.keys(blueprint.levels[0]).length == 0 || blueprint.levels[0].ingredients.length == 0)
        {
            level = blueprint.craftedItem.item.getCurrentLevel() + 1;
        }
        else
        {
            level = blueprint.craftedItem.item.getCurrentLevel();
        }
    }
    if(ingredients === null)
    {
        ingredients = getBlueprintIngredients(category, blueprintId, level);
    }
    if(!ingredients) return false;
    for(var i in ingredients)
    {
        if(!ingredients[i].item.hasQuantity(ingredients[i].quantity))
        {
            return false;
        }
    }
    return true;
}


function canCraftAnyBlueprint(blueprintCategory = -1)
{
    var blueprintList = getKnownBlueprints(blueprintCategory);
    for(var i in blueprintList)
    {
        if(canCraftBlueprint(blueprintList[i].category, blueprintList[i].id))
        {
            return true;
        }
    }
    return false;
}

function getCraftableBlueprintCount(blueprintCategory = -1)
{
    var count = 0;
    var blueprintList = getKnownBlueprints(blueprintCategory);
    for(var i in blueprintList)
    {
        if(canCraftBlueprint(blueprintList[i].category, blueprintList[i].id, -1))
        {
            ++count;
        }
    }
    return count;
}

function getBlueprintNotCraftableReason(category, blueprintId, level = 0)
{
    if(!isBlueprintKnown(category, blueprintId))
    {
        return _("You do not know this blueprint");
    }
    var blueprint = getBlueprintById(category, blueprintId);
    if(isBlueprintUpgradeable(category, blueprintId) &&
        (level > blueprint.levels.length - 1 || level >= blueprint.craftedItem.item.getMaxLevel()))
    {
        return _("You have fully upgraded this item");
    }
    if(!blueprint.craftedItem.item.canCraft())
    {
        return blueprint.craftedItem.item.getNotCraftableReason();
    }
    var ingredients = getBlueprintIngredients(category, blueprintId, level);
    for(var i in ingredients)
    {
        if(!ingredients[i].item.hasQuantity(ingredients[i].quantity))
        {
            return _("You do not have the required ingredients");
        }
    }
    return "";
}

function craftBlueprint(category, blueprintId, level = 0, ingredients = null)
{
    var blueprint = getBlueprintById(category, blueprintId);
    if(!canCraftBlueprint(category, blueprintId, level, ingredients)) return false;
    if(ingredients === null)
    {
        ingredients = getBlueprintIngredients(category, blueprintId, level);
    }
    for(var i in ingredients)
    {
        ingredients[i].item.spendQuantity(ingredients[i].quantity);
    }
    if(level > 0 && blueprint.levels)
    {
        blueprint.craftedItem.item.upgradeToLevel(level);
    }
    else
    {
        blueprint.craftedItem.item.grantQuantity(blueprint.craftedItem.quantity);
    }
    hasCraftedABlueprint = true;
    return true;
}

function getBlueprintById(category, id)
{
    if(!craftingBlueprints[category]) return null;
    if(craftingBlueprints[category][id] && craftingBlueprints[category][id].id == id)
    {
        return craftingBlueprints[category][id];
    }
    for(var i = 0; i < craftingBlueprints[category].length; ++i)
    {
        if(craftingBlueprints[category][i].id == id)
        {
            return craftingBlueprints[category][i];
        }
    }
    throw "Invalid blueprint ID";
}

var cachedKnownblueprints;
var lastDepthCached;

function getKnownBlueprints(blueprintCategory = -1)
{
    if(isSimulating && blueprintCategory == -1 && lastDepthCached == depth)
    {
        return cachedKnownblueprints;
    }
    else
    {
        var result = [];
        for(var i = 0; i < knownBlueprints.length; ++i)
        {
            if(knownBlueprints[i] != "") //AO: Figure out why an empty string is being appended to this, shouldn't need to do this
            {
                var split = knownBlueprints[i].split('.');
                var category = split[0];
                var id = split[1];
                if(blueprintCategory == -1 || blueprintCategory == category)
                {
                    result.push(getBlueprintById(category, id));
                }
            }
        }
        let resultsSorted = result.sort((a, b) => a.id - b.id);

        if(blueprintCategory == -1)
        {
            cachedKnownblueprints = resultsSorted;
            lastDepthCached = depth;
        }

        return resultsSorted;
    }
}

function getAvailableBlueprints(onlyUnknown = true)
{
    var result = [];
    for(var i = 0; i < availableBlueprints.length; ++i)
    {
        var split = availableBlueprints[i].split('.');
        var category = split[0];
        var id = split[1];
        if(!onlyUnknown || !isBlueprintKnown(category, id))
        {
            result.push(getBlueprintById(category, id));
        }
    }
    return result;
}

function getUnownedBlueprints(category)
{
    if(craftingBlueprints[category])
    {
        return craftingBlueprints[category].filter(blueprint => !isBlueprintKnown(category, blueprint.id));
    }

    return [];
}

function learnBlueprint(category, blueprintId, notifyPlayer = true, alreadyCheckedIsknown = false)
{
    if(!alreadyCheckedIsknown)
    {
        alreadyCheckedIsknown = !isBlueprintKnown(category, blueprintId);
    }

    if(getBlueprintById(category, blueprintId) && alreadyCheckedIsknown)
    {
        if(category == 1 && notifyPlayer && !isDrillBlueprintHigherLevelThanEquippedPart(getBlueprintById(category, blueprintId)))
        {
            // Override notifyPlayer setting if drill blueprint is too low level 
            // to be displayed in the crafting menu
            notifyPlayer = false;
        }
        knownBlueprints.push(category + "." + blueprintId);
        isKnownBlueprintsDirty = true;
        if(notifyPlayer)
        {
            flagBlueprintAsUnseen(category, blueprintId);
        }
    }
}

function learnAllBlueprints()
{
    knownBlueprints = []
    for(var i in craftingBlueprints)
    {
        for(var j in craftingBlueprints[i])
        {
            knownBlueprints.push(i + "." + craftingBlueprints[i][j].id);
            flagBlueprintAsUnseen(i, craftingBlueprints[i][j].id);
        }
    }
    isKnownBlueprintsDirty = true;
}

function learnRangeOfBlueprints(category, firstBlueprintId, lastBlueprintId)
{
    for(var id = firstBlueprintId; id <= lastBlueprintId; ++id)
    {
        learnBlueprint(category, id, false);
    }
}

// For testing
function unlearnBlueprint(blueprintCategory, blueprintId)
{
    for(var i = 0; i < knownBlueprints.length; ++i)
    {
        if(knownBlueprints[i] == blueprintCategory + "." + blueprintId)
        {
            knownBlueprints.splice(i);
        }
    }
}

function makeBlueprintAvailable(category, blueprintId)
{
    if(getBlueprintById(category, blueprintId) && !isBlueprintAvailable(category, blueprintId))
    {
        availableBlueprints.push(category + "." + blueprintId);
        isKnownBlueprintsDirty = true;
    }
}

function isBlueprintKnown(category, blueprintId)
{
    for(var i = 0; i < knownBlueprints.length; ++i)
    {
        if(knownBlueprints[i] == category + "." + blueprintId) return true;
    }
    return false;
}

function isAllBlueprintsInCategoryKnown(category)
{
    for(var j in craftingBlueprints[category])
    {
        if(!isBlueprintKnown(category, craftingBlueprints[category][j].id))
        {
            return false;
        }
    }
    return true;
}

function isBlueprintAvailable(category, blueprintId)
{
    // if (isBlueprintKnown(category, blueprintId)) return false;
    for(var i = 0; i < availableBlueprints.length; ++i)
    {
        if(availableBlueprints[i] == category + "." + blueprintId) return true;
    }
    return false;
}

function getBlueprintNotAvailableReason(category, blueprintId)
{
    var blueprint = getBlueprintById(category, blueprintId);
    if(blueprint.price && money < blueprint.price)
    {
        return _("You can't afford this blueprint");
    }
    return "";
}

function getCompleteBlueprintPrice(blueprint)
{
    return doBigIntDecimalMultiplication(blueprint.price, STAT.blueprintPriceMultiplier());
}

function isBlueprintUnseen(category, blueprintId)
{
    return unseenBlueprints.includes(category + "." + blueprintId);
}

function flagBlueprintAsUnseen(category, blueprintId)
{
    if(!isBlueprintUnseen(category, blueprintId))
    {
        unseenBlueprints.push(category + "." + blueprintId);
    }
}

function flagBlueprintAsSeen(category, blueprintId)
{
    var i = unseenBlueprints.indexOf(category + "." + blueprintId);
    if(i >= 0)
    {
        unseenBlueprints.splice(i, 1);
    }
}

function getUnseenBlueprints()
{
    var result = [];
    for(var i = 0; i < unseenBlueprints.length; ++i)
    {
        if(unseenBlueprints[i] != "") //AO: Figure out why an empty string is being appended to this, shouldn't need to do this
        {
            var split = unseenBlueprints[i].split('.');
            var category = split[0];
            var id = split[1];
            result.push(getBlueprintById(category, id));
        }
    }
    return result;
}

function filterBlueprintsByCategory(blueprintArray, category)
{
    return filterBlueprints(
        blueprintArray,
        function (blueprint) {return blueprint.category == category;}
    );
}

function filterBlueprints(blueprintArray, checkFunction)
{
    var result = [];
    for(var i in blueprintArray)
    {
        var blueprint = blueprintArray[i];
        if(typeof (blueprint) == "string")
        {
            blueprintCategoryAndId = blueprint.split(".");
            if(blueprintCategoryAndId.length != 2) continue;
            blueprint = getBlueprintById(blueprintCategoryAndId[0], blueprintCategoryAndId[1]);
            if(!blueprint) continue;
        }
        if(checkFunction(blueprint))
        {
            result.push(blueprintArray[i]);
        }
    }
    return result;
}


function filterBlueprintsByCategoryAndLevel(blueprintArray, category)
{
    return filterBlueprints(
        blueprintArray,
        function (blueprint)
        {
            return (blueprint.category == category) && isDrillBlueprintHigherLevelThanEquippedPart(blueprint)
        }
    );
}

function filterLowLevelDrillBlueprints(blueprintArray)
{
    return filterBlueprints(
        blueprintArray,
        function (blueprint)
        {
            return (blueprint.category != 1) || isDrillBlueprintHigherLevelThanEquippedPart(blueprint)
        }
    );
}

function isDrillBlueprintHigherLevelThanEquippedPart(blueprint)
{
    var blueprintDrillEquipStats = getDrillEquipByBlueprintId(blueprint.id);
    var blueprintLevel = blueprintDrillEquipStats.level;
    var currentLevelForType = drillState.equipFromType(blueprintDrillEquipStats.type).level;

    return blueprintLevel > currentLevelForType;
}

function sortBlueprintsBySubcategory(blueprintArray)
{
    var result = {};
    for(var i in blueprintArray)
    {
        if(!result[blueprintArray[i].subcategory])
        {
            result[blueprintArray[i].subcategory] = [];
        }
        result[blueprintArray[i].subcategory].push(blueprintArray[i]);
    }
    return result;
}

function sortBlueprintsByShopSubcategory(blueprintArray)
{
    var result = {};
    for(var i in blueprintArray)
    {
        if(!result[blueprintArray[i].shopSubcategory])
        {
            result[blueprintArray[i].shopSubcategory] = [];
        }
        result[blueprintArray[i].shopSubcategory].push(blueprintArray[i]);
    }
    return result;
}

function getBlueprintForCraftingItem(craftingItem, onlySearchKnownBlueprints)
{
    var searchableBlueprints;
    if(onlySearchKnownBlueprints)
    {
        searchableBlueprints = getKnownBlueprints();
    }
    else
    {
        searchableBlueprints = craftingBlueprints.flat();
    }
    for(var i in searchableBlueprints)
    {
        if(searchableBlueprints[i].craftedItem.item.constructor.name == craftingItem.constructor.name &&
            searchableBlueprints[i].craftedItem.item.id == craftingItem.id)
        {
            return searchableBlueprints[i];
        }
    }
    return null;
}

function getBlueprintIngredients(category, blueprintId, level = 0)
{
    var blueprint = getBlueprintById(category, blueprintId)
    if(blueprint.levels)
    {
        if(!blueprint.levels[level]) return null;
        return blueprint.levels[level].ingredients;
    }
    else
    {
        return blueprint.ingredients;
    }
}

function getRawIngredientsForBlueprint(blueprint, level = 0)
{
    var rawIngredients = {};
    var ingredients;
    if(blueprint.levels)
    {
        ingredients = blueprint.levels[level].ingredients;
    }
    else
    {
        ingredients = blueprint.ingredients;
    }
    for(var i in ingredients)
    {
        var ingredientBlueprint = getBlueprintForCraftingItem(ingredients[i].item);
        if(ingredientBlueprint)
        {
            var rawIngredientsForIngredient = getRawIngredientsForBlueprint(ingredientBlueprint, level);
            for(var j in rawIngredientsForIngredient)
            {
                if(!rawIngredients[j])
                {
                    rawIngredients[j] = 0;
                }
                rawIngredients[j] += rawIngredientsForIngredient[j] * ingredients[i].quantity;
            }
        }
        else
        {
            rawIngredients[ingredients[i].item.getName()] = ingredients[i].quantity;
        }
    }
    return rawIngredients;
}

function generateTooltipForBlueprint(blueprint)
{
    var ingredients = getRawIngredientsForBlueprint(blueprint);
    var formattedIngredients = "";
    for(key in ingredients)
    {
        formattedIngredients += key + " x" + ingredients[key] + "\n";
    }
    return {
        "title": blueprint.name,
        "description": formattedIngredients
    };
}

function generateHtmlForIngredients(ingredients, showSufficiencyIconsAndText = true)
{
    var rawIngredients = {};
    for(var i in ingredients)
    {
        rawIngredients[ingredients[i].item.getName()] = {
            "quantity": ingredients[i].quantity,
            "hasQuantity": ingredients[i].item.hasQuantity(ingredients[i].quantity),
            "image": ingredients[i].item.getIcon(),
            "imageUrl": ingredients[i].item.getIcon().src
        };
    }
    var htmlToRender = "";
    for(var i in rawIngredients)
    {
        var sufficiencyClassDesignater = "";
        var sufficiencyImageHtml = "";
        if(showSufficiencyIconsAndText)
        {
            sufficiencyClassDesignater = rawIngredients[i].hasQuantity ? "" : "Insufficient";
            var sufficiencyImageDesignator = rawIngredients[i].hasQuantity ? "Shared/Assets/UI/checkmark2b.webp" : "Shared/Assets/UI/xmark.webp";
            sufficiencyImageHtml = "<div class='tooltipImageCheckMark'><img src='" + sufficiencyImageDesignator + "' style='width: 10px; height: 10px;'></div>";
        }
        htmlToRender +=
            "<div class='tooltipImageContainer" + sufficiencyClassDesignater + "'>" +
            "<img src='" + rawIngredients[i].imageUrl + "' style='width: 40px; height: 40px;'>" +
            "<div class='tooltipImageTextOverlay" + sufficiencyClassDesignater + "'>x" + shortenNum(rawIngredients[i].quantity) + "</div>" +
            sufficiencyImageHtml +
            "</div>";
    }
    return htmlToRender;
}

function generatePrettyBlueprintTooltip(blueprint, level = 0)
{
    var ingredients;
    if(blueprint.levels)
    {
        ingredients = blueprint.levels[level].ingredients;
    }
    else
    {
        ingredients = blueprint.ingredients;
    }

    var htmlToRender = generateHtmlForIngredients(ingredients);
    return {
        "title": blueprint.name,
        "description": htmlToRender
    };
}

function isBlueprintUpgradeable(category, blueprintId)
{
    var blueprint = getBlueprintById(category, blueprintId);
    return blueprint.levels ? true : false;
}

function initAvailableBlueprints()
{
    learnRangeOfBlueprints(4, 0, 5);
    for(var i = 0; i < 6; i++)
    {
        learnBlueprint(4, i, false);
    }

    learnRangeOfBlueprints(1, 0, 15);
    if(hasFoundGolem == 1)
    {
        learnRangeOfBlueprints(1, 16, 31);
    }
    if(depth >= 225)
    {
        learnRangeOfBlueprints(1, 32, 47);
        hasFoundGidget = 1;
    }
    if(depth >= 1032)
    {
        learnRangeOfBlueprints(1, 61, 69);
    }
    if(depth >= 1257)
    {
        learnRangeOfBlueprints(1, 79, 87);
    }
    if(depth >= 1814)
    {
        learnRangeOfBlueprints(1, 107, 119);
    }

    reactor.learnReactorBlueprintsForLevel();
    learnReachedStructures();
    learnReachedDroneBlueprints();
}

function hasIngredientsForDrillUpgradeLevel(craftingItems)
{
    var ingredientsCraftable = 0;
    for(var i = 0; i < craftingItems.length; i++)
    {
        if(craftingItems[i].item.hasQuantity(craftingItems[i].quantity / 10))
        {
            ingredientsCraftable++;
        }
    }

    return ingredientsCraftable >= craftingItems.length;
}

function getIngredientListWithDiscounts(ingredients)
{
    var discountedIngredients = [];
    for(var i in ingredients)
    {
        discountedIngredients[i] = {
            item: ingredients[i].item,
            quantity: getDiscountedIngredientQuantity(ingredients[i])
        }
    }
    return discountedIngredients;
}

function getDiscountedIngredientQuantity(ingredient)
{
    if(ingredient.item instanceof MoneyCraftingItem)
    {
        return doBigIntDecimalMultiplication(ingredient.quantity, STAT.blueprintPriceMultiplier());
    }
    else
    {
        return ingredient.quantity;
    }
}