class EventHook
{
    _callbacks = [];

    // Add a new callback function
    addCallback(callbackFunction)
    {
        if (typeof (callbackFunction) != 'function')
        {
            throw "Callback must be a function";
        }
        this._callbacks.push(callbackFunction);
    }

    // Deletes all matching callback functions
    deleteCallback(callbackFunction)
    {
        for (var i = this._callbacks.length - 1; i >= 0; --i)
        {
            if (this._callbacks[i] === callbackFunction)
            {
                this._callbacks.splice(i, 1);
            }
        }
    }

    // Call all callback functions. Deletes any that are invalid or throw exceptions
    fire(...params)
    {
        var invalidCallbackIndices = [];
        for (var i = 0; i < this._callbacks.length; ++i)
        {
            if (typeof (this._callbacks[i]) != 'function')
            {
                invalidCallbackIndices.push(i);
                console.warn("Attempting to call invalid callback");
                continue;
            }
            else
            {
                try
                {
                    this._callbacks[i](...params);
                }
                catch(error)
                {
                    invalidCallbackIndices.push(i);
                    console.error(error);
                    continue;
                }
            }
        }
        
        if(invalidCallbackIndices.length > 0)
        {
            for (var i = this._callbacks.length - 1; i >= 0; --i)
            {
                if (invalidCallbackIndices.includes(i))
                {
                    this._callbacks.splice(i, 1);
                }
            }
        }
    }
}