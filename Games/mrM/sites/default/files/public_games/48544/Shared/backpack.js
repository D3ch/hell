var backpack = [];
var backpackSize = 100;
var isBackpackDirty = false;
var isCraftNotificationOn = false;

if (backpack.length < backpackSize)
{
    initBackpack(backpackSize);    
}

// #######################################################
// #################### BACKPACK API #####################
// #######################################################

function initBackpack(size)
{
    var backpackLength = backpack.length/2;
    for (var i = 0; i < size - backpackLength; ++i)
    {
        backpack.push(-1, 0);    
    }
}

function getBackpackSize()
{
    return backpack.length / 2;
}

function getItemInBackpackById(itemId)
{
    var results = [];
    for (var i = 0; i < backpack.length * 2; i += 2)
    {
        if (backpack[i] == itemId && backpack[i+1] > 0)
        {
            results.push({
                id: itemId,
                quantity: backpack[i + 1],
                slot: i / 2
            });
        }
    }
    return results;
}

function getItemInBackpackSlot(slotIndex)
{
    if (slotIndex >= backpack.length / 2 || slotIndex < 0 || isBackpackSlotEmpty(slotIndex))
    {
        return null;    
    }
    return {
        id: backpack[2 * slotIndex],
        quantity: backpack[2 * slotIndex + 1],
        slot: slotIndex
    }
}

function getAllItemsInBackpack()
{
    var backpackItems = [];
    var item;
    for (var i = 0; i < backpack.length / 2; ++i)
    {
        if (item = getItemInBackpackSlot(i))
        {
            backpackItems.push(item);
        }    
    }
    return backpackItems;
}

function getQuantityOfItemInBackpack(itemId, maxCount=-1)
{
    var count = 0;
    for (var i = 0; i < backpack.length*2 && (maxCount == -1 || count < maxCount); i += 2)
    {
        if (backpack[i] == itemId)
        {
            count += backpack[i + 1];    
        }
    }
    return count;
}

function addItemToBackpack(itemId, quantity, slotIndex=-1)
{
    var itemInBackpackSlot;
    var itemInBackpack;
    var firstEmptySlot;
    if (!getItemById(itemId))
    {
        return;
    }
    if (slotIndex > backpack.length)
    {
        throw "Invalid backpack slot";    
    }
    if (slotIndex > -1 && (itemInBackpackSlot = getItemInBackpackSlot(slotIndex)) && itemInBackpackSlot.id == itemId)
    {
        // Slot is specified and the new item matches the item already in that slot
        backpack[slotIndex * 2 + 1] += quantity;  
    }
    else if (slotIndex > -1 && itemInBackpackSlot === null)
    {
        // Slot is specified and is empty
        backpack[slotIndex * 2] = itemId;  
        backpack[slotIndex * 2 + 1] = quantity;  
    }
    else if ((itemInBackpack = getItemInBackpackById(itemId)) && itemInBackpack.length > 0)
    {
        // Slot isn't specified, but a stack of the item is already in the backpack
        backpack[itemInBackpack[0].slot * 2 + 1] += quantity;
        slotIndex = itemInBackpack[0].slot;
    }
    else if ((firstEmptySlot = getFirstEmptySlotInBackpack()) !== null)
    {
        // The item is not already in the backpack, but there are empty slots
        backpack[firstEmptySlot * 2] = itemId;    
        backpack[firstEmptySlot * 2 + 1] = quantity;  
        slotIndex = firstEmptySlot;
    }
    else
    {
        return false;
    }
    isBackpackDirty = true;
    return slotIndex;
}

function removeItemFromBackpackSlot(slotIndex, quantity = 0)
{
    var quantityInBackpack = backpack[slotIndex * 2 + 1];
    isBackpackDirty = true;
    if (quantity == 0 || quantityInBackpack <= quantity)
    {
        backpack[slotIndex * 2] = -1;    
        backpack[slotIndex * 2 + 1] = 0;
        return quantityInBackpack;
    }
    else
    {
        backpack[slotIndex * 2 + 1] -= quantity;
        return quantity;
    }
}

function removeItemFromBackpackById(itemId, quantity = 0)
{
    var itemsInBackpack = getItemInBackpackById(itemId);
    var quantityRemoved = 0;
    var i = 0;
    while (i < itemsInBackpack.length && (quantity == 0 || quantityRemoved < quantity))
    {
        quantityRemoved += removeItemFromBackpackSlot(itemsInBackpack[i].slot, quantity - quantityRemoved);
        ++i;
    }
    return quantityRemoved;
}

function moveItemInBackpack(initialSlot, targetSlot)
{
    if (targetSlot < 0 || targetSlot >= getBackpackSize())
    {
        return;    
    }
    var itemInInitialSlot = getItemInBackpackSlot(initialSlot);
    var itemInTargetSlot = getItemInBackpackSlot(targetSlot);
    if (!itemInInitialSlot)
    {
        return;
    }
    removeItemFromBackpackSlot(initialSlot);
    if (itemInTargetSlot && itemInTargetSlot.id != itemInInitialSlot.id)
    {
        removeItemFromBackpackSlot(targetSlot);
        addItemToBackpack(itemInTargetSlot.id, itemInTargetSlot.quantity, initialSlot);
    }
    addItemToBackpack(itemInInitialSlot.id, itemInInitialSlot.quantity, targetSlot);
    isBackpackDirty = true;
}

function isBackpackSlotEmpty(slotIndex)
{
    return backpack[slotIndex * 2] < 0 || backpack[slotIndex * 2 + 1] <= 0;
}

function getFirstEmptySlotInBackpack()
{
    for (var i = 0; i < backpack.length * 2; i += 2)
    {
        if (backpack[i] < 0 || backpack[i + 1] <= 0)
        {
            return i / 2;
        }
    }
    return null;
}

function getItemById(id)
{
    if (backpackItems[id] && backpackItems[id].id == id)
    {
        return backpackItems[id];    
    }
    for (var i = 0; i < backpackItems.length; ++i)
    {
        if (backpackItems[i].id == id)
        {
            return backpackItems[i];    
        }
    }
    throw "Invalid item ID";
}

function generateTestBackpack(size)
{
    backpack = [];
    initBackpack(size);
    for (var i = 0; i < size; ++i)
    {
        var item = backpackItems[rand(0, backpackItems.length-1)];
        addItemToBackpack(item.id, rand(1, 99), i);
    }
}

// ###########################################################
// #################### ITEM DEFINITIONS #####################
// ###########################################################

var backpackItems = [
    {id: 0, name: "Iron Ingot", icon: ironIngotIcon},
    {id: 1, name: "Copper Ingot", icon: copperIngotIcon},
    {id: 2, name: "Silver Ingot", icon: silverIngotIcon},
    {id: 3, name: "Gold Ingot", icon: goldIngotIcon},
    {id: 4, name: "Platinum Ingot", icon: platinumIngotIcon},
    {id: 5, name: "Polished Diamond", icon: polishedDiamondIcon},
    {id: 6, name: "Tantalum Ingot", icon: tantalumIngotIcon},
    {id: 7, name: "Polished Black Opal", icon: polishedBlackOpalIcon},
    {id: 8, name: "Polished Red Diamond", icon: polishedRedDiamondIcon},
    {id: 9, name: "Polished Blue Obsidian", icon: polishedBlueObsidianIcon},
    {id: 10, name: "Refined Californium", icon: refindedCaliforniumIcon},
    {id: 11, name: "Aluminum Ingot", icon: aluminumIngotIcon},
    {id: 12, name: "Titanium Ingot", icon: titaniumIngotIcon},
    {id: 13, name: "Silicon Carbide", icon: siliconCarbideIcon},
    {id: 14, name: "Glass", icon: glassIcon},
    {id: 15, name: "Magnesium Ingot", icon: magnesiumIngotIcon},
    {id: 16, name: "Plastic", icon: plasticIcon},
    {id: 17, name: "Iron Pipe", icon: ironPipeIcon},
    {id: 18, name: "Copper Pipe", icon: copperPipeIcon},
    {id: 19, name: "Aluminum Pipe", icon: aluminumPipeIcon},
    {id: 20, name: "Iron Wire", icon: ironWireIcon},
    {id: 21, name: "Copper Wire", icon: copperWireIcon},
    {id: 22, name: "Silver Wire", icon: silverWireIcon},
    {id: 23, name: "Gold Wire", icon: goldWireIcon},
    {id: 24, name: "Platinum Wire", icon: platinumWireIcon},
    {id: 25, name: "Iron Bearing", icon: ironBearingIcon},
    {id: 26, name: "Ceramic Bearing", icon: ceramicBearingIcon},
    {id: 27, name: "Iron Gear", icon: ironGearIcon},
    {id: 28, name: "Titanium Gear", icon: titaniumGearIcon},
    {id: 29, name: "Aluminum Gear", icon: aluminumGearIcon},
    {id: 30, name: "Ceramic Gear", icon: ceramicGearIcon},
    {id: 31, name: "Metal Fan", icon: metalFanIcon},
    {id: 32, name: "Copper Heatsink", icon: copperHeatsinkIcon},
    {id: 33, name: "Transistor", icon: transistorIcon},
    {id: 34, name: "Resistor", icon: resistorIcon},
    {id: 35, name: "Computer Chip", icon: computerChipIcon},
    {id: 36, name: "Solar Panel", icon: solarPanelIcon},
    {id: 37, name: "Magnet", icon: magnetIcon},
    {id: 37, name: "Carbon Nanotube", icon: carbonNanotubeIcon},
]