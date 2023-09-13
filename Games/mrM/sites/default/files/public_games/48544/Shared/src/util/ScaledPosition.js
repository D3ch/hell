class ScaledPosition
{
    constructor(x, y)
    {
        this._x = x;
        this._y = y;
    }

    get x()
    {
        return mainw * this._x;
    }

    get y()
    {
        return mainh * this._y;
    }
}