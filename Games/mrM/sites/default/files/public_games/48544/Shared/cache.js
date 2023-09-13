class Cache
{
    cache = {};
    cacheEntries = 0;
    name = "";

    constructor(name)
    {
        this.name = name;
    }

    exists(key)
    {
        return this.cache.hasOwnProperty(key);
    }

    set(key, value)
    {
        if(!this.exists(key))
        {
            this.cacheEntries++;
        }
        this.cache[key] = value;
    }

    get(key)
    {
        if(this.exists(key))
        {
            return this.cache[key]
        }
        return null;
    }

    delete(key)
    {
        if(this.exists(key))
        {
            this.cache[key] = null;
            delete this.cache[key];
            this.cacheEntries--;
        }
    }
}

var assetCache = new Cache("Composited Assets");
var textSizeCache = new Cache("Composited Assets");