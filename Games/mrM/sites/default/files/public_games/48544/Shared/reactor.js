const NEAR_ZERO_FLOAT_ERROR_ADJUSTMENT = 0.00001;

const REACTOR_DEPTH = 1133;
const MAX_REACTOR_CELLS_ROWS = 9;
const MAX_REACTOR_CELLS_COLUMNS = 9;
const EMPTY_INTEGER_VALUE = 0;
const REACTOR_LAYOUTS = {
    1: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    2: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    3: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    4: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    5: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
};
const DIRECTIONS = [
    [0, -1],
    [-1, 0],
    [0, 1],
    [1, 0]
];

var savedReactorLayouts = [[], [], [], [], [], [], [], [], [], []];
var savedReactorLayoutNames = ["", "", "", "", "", "", "", "", "", ""];

function saveReactorLayout(layout)
{
    if(savedReactorLayouts[9].length > 0)
    {
        showAlertPrompt("You have too many reactor layouts. You must delete one before adding anymore.")
    }
    else 
    {
        var name = document.getElementById("simpleInputFieldText").value;
        document.getElementById("simpleInputFieldText").value = "";

        if(name.length > 0)
        {
            var layoutToSave = [];

            layout.forEach(row =>
            {
                row.forEach(cell =>
                {
                    if(!FUEL_ROD_TYPES.includes(cell))
                    {

                        layoutToSave.push(cell);
                    }
                    else
                    {
                        layoutToSave.push(0);
                    }
                })
            })

            for(var i = 0; i < savedReactorLayouts.length; i++)
            {
                if(savedReactorLayouts[i].length == 0)
                {
                    savedReactorLayoutNames[i] = name;
                    savedReactorLayouts[i] = layoutToSave;
                    break;
                };
            }
        }
    }

}

function loadReactorLayout(index)
{
    reactor.grid.grid.forEach((row, rowIndex) =>
    {
        row.forEach((cell, cellIndex) =>
        {
            var correspondingSavedLayoutCell = (rowIndex * 9) + cellIndex;
            if(FUEL_ROD_TYPES.includes(reactor.grid.grid[rowIndex][cellIndex]))
            {
                if(reactor.grid.getFuelCellRemainingEnergy(cellIndex, rowIndex) != reactorComponents[reactor.grid.grid[rowIndex][cellIndex]].totalEnergyOutput)
                {
                    reactor.grid.deleteFuelCellState(cellIndex, rowIndex);
                    reactor.grid.deleteComponentInCellAndRemoveQuantityOwned(cellIndex, rowIndex);
                }
                else if(reactor.grid.isFuelCellBurnedUp(cellIndex, rowIndex))
                {
                    reactor.grid.collectFuelCell(cellIndex, rowIndex);
                }
                else
                {
                    reactor.grid.deleteFuelCellState(cellIndex, rowIndex);
                    reactor.grid.grid[rowIndex][cellIndex] = savedReactorLayouts[index][correspondingSavedLayoutCell];
                }
            }
            else
            {
                reactor.grid.grid[rowIndex][cellIndex] = savedReactorLayouts[index][correspondingSavedLayoutCell];
            }
        })
    })
    reactor.grid.fuelCellRemainingEnergy = [];
    reactor.grid.isGridDirty = true;
}

class ReactorGrid
{
    //[Y][X]
    //[ROW][COLUMN]
    grid = [
        [EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE],
        [EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE],
        [EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE],
        [EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE],
        [EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE],
        [EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE],
        [EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE],
        [EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE],
        [EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE, EMPTY_INTEGER_VALUE],
    ];

    fuelCellRemainingEnergy = [];
    isGridDirty = true;
    componentInFocusX;
    componentInFocusY;

    //cached values
    cachedHeatPerSystem = [];
    cachedEnergyPerSecond = 0;
    cachedMaxBatteryCapacity = 0;
    cachedSystems = [];

    constructor()
    {

    }

    numGridColumns()
    {
        return this.grid[0].length;
    }

    numGridRows()
    {
        return this.grid.length;
    }

    setComponentAsInFocus(x, y)
    {
        this.componentInFocusX = x;
        this.componentInFocusY = y;
    }

    unsetComponentAsInFocus(x, y)
    {
        if(x == this.componentInFocusX && y == this.componentInFocusY)
        {
            this.componentInFocusX = null;
            this.componentInFocusY = null;
        }
    }

    getComponentTypeInCellAtLocation(x, y)
    {
        return this.grid[y][x];
    }

    update()
    {
        if(this.isGridDirty)
        {
            //caching update order here is important
            this.cachedSystems = this.getDistinctSystemFormations();
            this.cachedEnergyPerSecond = this.energyProductionRatePerSecond();
            this.cachedHeatPerSystem = this.computedHeatPerSystem();
            this.cachedMaxBatteryCapacity = this.maxBatteryCapacity();

            this.isGridDirty = false;
        }
    }

    addComponentToCell(x, y, componentType, previousGridX = null, previousGridY = null)
    {
        //add checks
        this.grid[y][x] = componentType;

        if(reactorComponents[componentType].hasOwnProperty("totalEnergyOutput") && reactorComponents[componentType].totalEnergyOutput != null)
        {
            var indexForFuelCell = this.getIndexForFuelCell(previousGridX, previousGridY);
            if(previousGridX != null && indexForFuelCell != null)
            {
                var currentDecayStateIndex = indexForFuelCell;
                this.fuelCellRemainingEnergy[currentDecayStateIndex].x = x;
                this.fuelCellRemainingEnergy[currentDecayStateIndex].y = y;
            }
            else
            {
                var remainingEnergy = reactorComponents[componentType].totalEnergyOutput;
                this.fuelCellRemainingEnergy.push({"y": y, "x": x, "remainingEnergy": remainingEnergy});
            }
        }

        this.isGridDirty = true;
    }

    removeComponentFromCell(x, y)
    {
        this.grid[y][x] = EMPTY_INTEGER_VALUE;
        this.isGridDirty = true;
    }

    deleteComponentInCellAndRemoveQuantityOwned(x, y)
    {
        var cellType = this.getComponentTypeInCellAtLocation(x, y);
        if(cellType > 0)
        {
            reactorComponents[cellType].numOwned--;
            this.removeComponentFromCell(x, y);
        }
    }

    getIndexForFuelCell(x, y)
    {
        for(var i = 0; i < this.fuelCellRemainingEnergy.length; i++)
        {
            if(this.fuelCellRemainingEnergy[i].y == y && this.fuelCellRemainingEnergy[i].x == x)
            {
                return i;
            }
        }
        return null;
    }

    isFuelCellBurnedUp(x, y)
    {
        return this.fuelCellPercentBurned(x, y) >= 1;
    }

    getFuelCellRemainingEnergy(x, y)
    {
        var fuelCellIndex = this.getIndexForFuelCell(x, y);
        if(fuelCellIndex != null)
        {
            var cellType = this.getComponentTypeInCellAtLocation(x, y);
            return (1 - this.fuelCellPercentBurned(x, y)) * reactorComponents[cellType].totalEnergyOutput;
        }
        else
        {
            return 0;
        }
    }

    fuelCellPercentBurned(x, y)
    {
        var fuelCellIndex = this.getIndexForFuelCell(x, y);
        if(fuelCellIndex != null)
        {
            var cellType = this.getComponentTypeInCellAtLocation(x, y);
            return 1 - (this.fuelCellRemainingEnergy[fuelCellIndex].remainingEnergy / reactorComponents[cellType].totalEnergyOutput);
        }
        return 1;
    }

    deleteFuelCellState(x, y)
    {
        var index = this.getIndexForFuelCell(x, y);
        this.fuelCellRemainingEnergy.splice(index, 1);

        this.isGridDirty = true;
    }

    numOfTypeOnGrid(type)
    {
        var resultNum = 0;
        for(var i = 0; i < MAX_REACTOR_CELLS_COLUMNS; i++)
        {
            for(var j = 0; j < MAX_REACTOR_CELLS_ROWS; j++)
            {
                if(this.grid[i][j] == type)
                {
                    resultNum++;
                }
            }
        }
        return resultNum;
    }

    isWithinGridRange(x, y)
    {
        return this.grid.length > y && this.grid[0].length > x && y >= 0 && x >= 0;
    }

    getDistinctSystemFormations()
    {
        var numRows = this.numGridColumns();
        var numCols = this.numGridRows();

        var coordinates = [];
        for(var i = 0; i < numRows; i++)
        {
            for(var j = 0; j < numCols; j++)
            {
                if(!CONNECTING_TYPES.includes(this.grid[i][j]))
                {
                    continue;
                }
                var systemCoordinates = [];
                this.depthFirstSearch(this.grid, i, j, i, j, systemCoordinates);
                coordinates.push(systemCoordinates);
            }
        }

        //Reset the grid *= -1 modifiers from above DFS iterations
        for(var i = 0; i < numRows; i++)
        {
            for(var j = 0; j < numCols; j++)
            {
                this.grid[i][j] = Math.abs(this.grid[i][j]);
            }
        }

        return coordinates;
    }

    //Function to perform dfs of the input grid
    depthFirstSearch(grid, x0, y0, i, j, systemCoordinates)
    {
        var rows = grid.length;
        var cols = grid[0].length;

        if(i < 0 || i >= cols || j < 0 || j >= rows || !CONNECTING_TYPES.includes(grid[i][j])) //if in bounds of grid
        {
            return;
        }

        grid[i][j] *= -1;
        systemCoordinates.push({"x": j, "y": i, "type": grid[i][j] * -1});

        for(var direction in DIRECTIONS)
        {
            this.depthFirstSearch(grid, x0, y0, i + DIRECTIONS[direction][0], j + DIRECTIONS[direction][1], systemCoordinates);
        }
    }

    numDistincSystems()
    {
        return this.getDistinctSystemFormations().length;
    }

    maxBatteryCapacity()
    {
        var gridRows = this.numGridRows();
        var gridColumns = this.numGridColumns();
        var buffPerGridTiles = this.buffMultiplierArray();

        var totalCapacity = 0;
        //for each fan see how many systems it is touching and reduce heat per system by its amount of reduction
        for(var i = 0; i < gridRows; i++)
        {
            for(var j = 0; j < gridColumns; j++)
            {
                //find its reduction by taking number of sides touching system / total sides touching systems * total heat reduction
                if(BATTERY_TYPES.includes(this.grid[i][j]))
                {
                    var buffMultiplierForCell = buffPerGridTiles[i][j];
                    totalCapacity += buffMultiplierForCell * reactorComponents[this.grid[i][j]].energyStorage;
                }
            }
        }
        return totalCapacity;
    }

    energyProductionRatePerSecond()
    {
        var gridRows = this.numGridRows();
        var gridColumns = this.numGridColumns();

        //form grid for multiplying cells
        var buffPerGridTiles = this.buffMultiplierArray();
        var productionPerSecond = 0;

        for(var i = 0; i < gridRows; i++)
        {
            for(var j = 0; j < gridColumns; j++)
            {
                //find its reduction by taking number of sides touching system / total sides touching systems * total heat reduction
                if(FUEL_ROD_TYPES.includes(this.grid[i][j]) && !this.isFuelCellBurnedUp(j, i))
                {
                    var buffMultiplierForCell = buffPerGridTiles[i][j];
                    var cellProduction = buffMultiplierForCell * reactorComponents[this.grid[i][j]].energyProductionPerSecond;
                    productionPerSecond += cellProduction;
                }
            }
        }
        return productionPerSecond;
    }

    buffMultiplierArray()
    {
        var gridRows = this.numGridRows();
        var gridColumns = this.numGridColumns();
        //form grid for multiplying cells
        var buffPerGridTiles = create2dArray(gridRows, gridColumns, 1.0);

        //for each buff tile apply the tile as a multiplier to a grid
        for(var i = 0; i < gridRows; i++)
        {
            for(var j = 0; j < gridColumns; j++)
            {
                if(BUFF_TYPES.includes(this.grid[i][j]))
                {
                    var buffType = reactorComponents[this.grid[i][j]];
                    for(var k = 0; k < buffType.buffDirections.length; k++)
                    {
                        var xBuffed = j + buffType.buffDirections[k].x;
                        var yBuffed = i + buffType.buffDirections[k].y;
                        if(this.isWithinGridRange(xBuffed, yBuffed))
                        {
                            buffPerGridTiles[yBuffed][xBuffed] += buffType.buffAmountMultiplierPerDirection;
                        }
                    }
                }
            }
        }
        return buffPerGridTiles;
    }

    burnFuelCells()
    {
        var systems = this.cachedSystems;
        //form grid for multiplying cells
        var buffPerGridTiles = this.buffMultiplierArray();

        for(var i = 0; i < systems.length; i++)
        {
            for(var j = 0; j < systems[i].length; j++)
            {
                if(FUEL_ROD_TYPES.includes(systems[i][j].type))
                {
                    var buffMultiplierForCell = buffPerGridTiles[systems[i][j].y][systems[i][j].x];
                    var amountToBurn = buffMultiplierForCell * reactorComponents[systems[i][j].type].energyProductionPerSecond;
                    var fuelCellIndex = this.getIndexForFuelCell(systems[i][j].x, systems[i][j].y);
                    if(fuelCellIndex != null && this.fuelCellPercentBurned(systems[i][j].x, systems[i][j].y) < 1)
                    {
                        this.fuelCellRemainingEnergy[fuelCellIndex].remainingEnergy -= amountToBurn;

                        if(this.fuelCellPercentBurned(systems[i][j].x, systems[i][j].y) >= 1)
                        {
                            this.isGridDirty = true;
                        }
                    }
                }
            }
        }
    }

    collectFuelCell(gridSlotX, gridSlotY)
    {
        if(this.isFuelCellBurnedUp(gridSlotX, gridSlotY))
        {
            //can collect
            var fuelCellType = this.getComponentTypeInCellAtLocation(gridSlotX, gridSlotY);
            if(FUEL_ROD_TYPES.includes(fuelCellType) && reactorComponents[fuelCellType].numOwned > 0)
            {
                //give ingredients
                var ingredients = reactorComponents[fuelCellType].rewardOutput;
                for(var i = 0; i < ingredients.length; i++)
                {
                    var ingredientEntry = ingredients[i];
                    ingredientEntry.item.grantQuantity(ingredientEntry.quantity);
                    newNews(_("You gained {0} x {1} from the reactor", beautifynum(ingredientEntry.quantity), ingredientEntry.item.getName()), true);
                }

                //remove the fuel cell
                this.deleteFuelCellState(gridSlotX, gridSlotY);
                this.deleteComponentInCellAndRemoveQuantityOwned(gridSlotX, gridSlotY);
            }
        }
    }

    computedHeatPerSystem() //if not <= 0 shouldn't run
    {
        var systems = duplicate2dArray(this.cachedSystems);
        var gridRows = this.numGridRows();
        var gridColumns = this.numGridColumns();
        //form array of heat per system
        var heatPerSystem = [];
        //form grid for multiplying cells
        var buffPerGridTiles = this.buffMultiplierArray();

        //for each system add the fuel rod heat
        for(var i = 0; i < systems.length; i++)
        {
            heatPerSystem.push({"heat": 0, "fans": [], "systems": deepCopyObject(systems[i])});
            var isValidSystem = false;
            for(var j = 0; j < systems[i].length; j++)
            {
                if(reactorComponents[systems[i][j].type].heat > 0 && !this.isFuelCellBurnedUp(systems[i][j].x, systems[i][j].y))
                {
                    var buffMultiplier = buffPerGridTiles[systems[i][j].y][systems[i][j].x];
                    heatPerSystem[i].heat += reactorComponents[systems[i][j].type].heat * buffMultiplier;
                    isValidSystem = true;
                }
            }
            if(!isValidSystem)
            {
                systems.splice(i, 1);
                heatPerSystem.splice(i, 1);
                i--;
            }
        }

        //for each fan see how many systems it is touching and reduce heat per system by its amount of reduction
        for(var i = 0; i < gridRows; i++)
        {
            for(var j = 0; j < gridColumns; j++)
            {
                //find its reduction by taking number of sides touching system / total sides touching systems * total heat reduction
                if(this.grid[i][j] == FAN_TYPE)
                {
                    var buffMultiplierForCell = buffPerGridTiles[i][j];

                    var systemsOnSides = [];
                    for(var k = 0; k < systems.length; k++)
                    {
                        for(var l = 0; l < systems[k].length; l++)
                        {
                            if(Math.abs(systems[k][l].y - i) + Math.abs(systems[k][l].x - j) == 1)
                            {
                                systemsOnSides.push(k); //push side touching
                            }
                        }
                    }
                    for(var k = 0; k < systemsOnSides.length; k++)
                    {
                        heatPerSystem[systemsOnSides[k]].heat += (reactorComponents[FAN_TYPE].heat * buffMultiplierForCell) / systemsOnSides.length;
                        heatPerSystem[systemsOnSides[k]].fans.push({"x": j, "y": i})
                    }
                }
            }
        }

        for(var i = 0; i < heatPerSystem.length; i++)
        {
            if(heatPerSystem[i].heat < NEAR_ZERO_FLOAT_ERROR_ADJUSTMENT && heatPerSystem[i].heat > 0)
            {
                heatPerSystem[i].heat = 0;
            }
        }

        return heatPerSystem;
    }

    isCellInOverheatingSystem(cellX, cellY)
    {
        for(var i = 0; i < this.cachedHeatPerSystem.length; i++)
        {
            if(this.cachedHeatPerSystem[i].heat > 0)
            {
                for(var j = 0; j < this.cachedHeatPerSystem[i].systems.length; j++)
                {
                    if(this.cachedHeatPerSystem[i].systems[j].x == cellX && this.cachedHeatPerSystem[i].systems[j].y == cellY)
                    {
                        return true;
                    }
                }
                for(var j = 0; j < this.cachedHeatPerSystem[i].fans.length; j++)
                {
                    if(this.cachedHeatPerSystem[i].fans[j].x == cellX && this.cachedHeatPerSystem[i].fans[j].y == cellY)
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    getSystemCellsToHighlightForCell(cellX, cellY)
    {
        var results = [];
        for(var i = 0; i < this.cachedHeatPerSystem.length; i++)
        {
            var isMatch = false;
            for(var j = 0; j < this.cachedHeatPerSystem[i].systems.length; j++)
            {
                if(this.cachedHeatPerSystem[i].systems[j].x == cellX && this.cachedHeatPerSystem[i].systems[j].y == cellY)
                {
                    isMatch = true;
                    break;
                }
            }
            if(!isMatch)
            {
                for(var j = 0; j < this.cachedHeatPerSystem[i].fans.length; j++)
                {
                    if(this.cachedHeatPerSystem[i].fans[j].x == cellX && this.cachedHeatPerSystem[i].fans[j].y == cellY)
                    {
                        isMatch = true;
                        break;
                    }
                }
            }
            if(isMatch)
            {
                var newSystemEntry = [];
                newSystemEntry = newSystemEntry.concat(this.cachedHeatPerSystem[i].systems.slice(0, this.cachedHeatPerSystem[i].systems.length));
                newSystemEntry = newSystemEntry.concat(this.cachedHeatPerSystem[i].fans.slice(0, this.cachedHeatPerSystem[i].fans.length));
                results.push(newSystemEntry);
            }
        }
        return results;
    }

    getCellHoveredSystemIndex(cellX, cellY)
    {
        if(this.componentInFocusX != null && this.componentInFocusY != null)
        {
            var systemsInFocus = reactor.grid.getSystemCellsToHighlightForCell(this.componentInFocusX, this.componentInFocusY);
            for(var i = 0; i < systemsInFocus.length; i++)
            {
                for(var j = 0; j < systemsInFocus[i].length; j++)
                {
                    if(systemsInFocus[i][j].x == cellX && systemsInFocus[i][j].y == cellY)
                    {
                        return i;
                    }
                }
            }
            return -1;
        }
        return -1;
    }

    getSystemHeatForFuelCell(cellX, cellY)
    {
        for(var i = 0; i < this.cachedHeatPerSystem.length; i++)
        {
            for(var j = 0; j < this.cachedHeatPerSystem[i].systems.length; j++)
            {
                if(this.cachedHeatPerSystem[i].systems[j].x == cellX && this.cachedHeatPerSystem[i].systems[j].y == cellY)
                {
                    return this.cachedHeatPerSystem[i].heat;
                }
            }
        }
        return 0;
    }
}


class Reactor
{
    grid;
    isRunning = true; //needed for rendering optimization
    totalRuntimeSecs = 0;
    componentBlueprintsUnlockedPerLevel = {
        1: [0, 3, 6, 9, 10, 13, 21, 24, 18],
        2: [1, 4, 7, 11, 22, 19],
        3: [2, 5, 8, 12, 23, 20, 14],
        4: [15, 16],
        5: [17, 25, 26, 27]
    };

    constructor()
    {
        this.grid = new ReactorGrid();
    }

    //Runs each second
    update()
    {
        this.grid.update();

        if(this.isRunning != this.isAbleToRun())
        {
            this.isRunning = this.isAbleToRun();
            if(!this.isRunning && depth >= 1134)
            {
                newNews(_("The Reactor Stopped Running"), true);
            }
        }

        if(this.isRunning)
        {
            this.totalRuntimeSecs++;
            worldResources[NUCLEAR_ENERGY_INDEX].numOwned += this.grid.cachedEnergyPerSecond;

            this.grid.burnFuelCells();
        }

        if(this.currentBatteryCharge() > this.grid.cachedMaxBatteryCapacity)
        {
            worldResources[NUCLEAR_ENERGY_INDEX].numOwned = this.grid.cachedMaxBatteryCapacity;
        }
        if(worldResources[NUCLEAR_ENERGY_INDEX].numOwned < 0)
        {
            worldResources[NUCLEAR_ENERGY_INDEX].numOwned = 0;
        }
    }

    isAtMaxLevel()
    {
        return !REACTOR_LAYOUTS.hasOwnProperty(reactorStructure.level + 1);
    }

    isAbleToRun()
    {
        return this.hasExistingSystem() && !this.isTooHot() && !this.isEnergyDeficient();
    }

    getReasonForNotRunning()
    {
        if(!this.hasExistingSystem())
        {
            if(this.grid.numOfTypeOnGrid(FAN_TYPE) > 1)
            {
                if(isMobile())
                {
                    return _("All of your fuel rods have fully burned. Tap your fuel rods to collect the reward materials and to delete them.");
                }
                else
                {
                    return _("All of your fuel rods have fully burned. Click your fuel rods to collect the reward materials and to delete them.");
                }
            }

            if(isMobile())
            {
                return _("Tap the backpack and drag components on to the grid. A fuel rod generates energy and heat. Fans cool the fuel rods. Batteries store energy.");
            }
            else
            {
                return _("Drag components from the left to the grid. A fuel rod generates energy and heat. Fans cool the fuel rods. Batteries store energy.");
            }
        }
        if(this.isTooHot())
        {
            return _("One or more of your fuel rods is too hot and needs to be cooled further.");
        }
        if(this.isEnergyDeficient())
        {
            return _("You are using more energy than you are producing and you do not have the necessary energy held in batteries.");
        }
        return "Unknown (Contact Support)";
    }

    getReactorStats()
    {
        return _("Energy/Sec: {0}", beautifynum(reactor.grid.energyProductionRatePerSecond())) + " - " +
            _("Battery: {0}", beautifynum(reactor.currentBatteryCharge()) + "/" + beautifynum(reactor.grid.maxBatteryCapacity()));
    }

    hasExistingSystem()
    {
        return this.grid.cachedHeatPerSystem.length > 0;
    }

    isTooHot()
    {
        for(var i = 0; i < this.grid.cachedHeatPerSystem.length; i++)
        {
            if(this.grid.cachedHeatPerSystem[i].heat > 0)
            {
                return true;
            }
        }
        return false;
    }

    isEnergyDeficient()
    {
        return (this.currentBatteryCharge() + this.grid.cachedEnergyPerSecond) < 0 && this.grid.cachedEnergyPerSecond < 0;
    }

    currentBatteryCharge()
    {
        return numStoredNuclearEnergyOwned();
    }

    isCellUsable(x, y)
    {
        return REACTOR_LAYOUTS[reactorStructure.level][x][y] == 1;
    }

    numOfTypeInInventory(type)
    {
        if(!reactorComponents.hasOwnProperty(type)) return 0;
        return reactorComponents[type].numOwned - this.grid.numOfTypeOnGrid(type);
    }

    getTypeForSlot(slot)
    {
        var typeId = 1;
        var existingIndexes = 0;
        while(existingIndexes < slot)
        {
            if(typeId >= reactorComponents.length)
            {
                return -1;
            }

            if(reactor.numOfTypeInInventory(typeId) > 0)
            {
                existingIndexes++;
            }
            typeId++;
        }
        return typeId - 1;
    }

    getSlotForType(type)
    {
        var slotIndex = 1;
        var existingIndexes = 0;
        while(slotIndex < type)
        {
            if(slotIndex >= reactorComponents.length)
            {
                return -1;
            }

            if(reactor.numOfTypeInInventory(slotIndex) > 0)
            {
                existingIndexes++;
            }
            slotIndex++;
        }
        return existingIndexes;
    }

    learnReactorBlueprintsForLevel()
    {
        for(var i = reactorStructure.level; i >= 1; i--)
        {
            for(var j = 0; j < this.componentBlueprintsUnlockedPerLevel[i].length; j++)
            {
                learnBlueprint(6, this.componentBlueprintsUnlockedPerLevel[i][j]);
            }
        }
    }
}
var reactor = new Reactor();