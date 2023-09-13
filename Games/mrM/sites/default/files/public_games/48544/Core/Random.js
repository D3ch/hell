const RAND_MAX = 2147483646;

// https://en.wikipedia.org/wiki/Linear_congruential_generator
// https://en.wikipedia.org/wiki/Lehmer_random_number_generator
class Random
{
    seed;

    constructor()
    {
        this.srand(parseInt(Math.random() * RAND_MAX)); //set initial seed
    }

    roll()
    {
        if(!this.seed)
        {
            console.warn("roll() called without a seed");
            this.srand(parseInt(Math.random() * RAND_MAX)); //reset seed
        }
        this.seed = (this.seed * 16807) % (RAND_MAX + 1);
        return this.seed;
    }

    rand(min, max = NaN)
    {
        return this.integer(min, max);
    }

    randBigInt(min, max)
    {
        var difference = (max - min);
        if(difference < Number.MAX_SAFE_INTEGER)
        {
            var result = this.roll() * parseFloat(difference);
            return min + BigInt(result);
        }
        else
        {
            var randomValue = this.roll();
            var elevatedDecimal = Math.round(randomValue * 10000);
            return min + (difference * BigInt(elevatedDecimal)) / 10000n;
        }
    }

    boolean(chance)
    {
        return this.randFloat() < chance;
    }

    /**
     * Generates and returns a random number between $min and $max (Including both values).
     * This will propagate the seed to its next value.
     *
     * @param	min
     * @param	max
     * @return The generated number
    */
    range(min, max)
    {
        if(isNaN(min) || isNaN(max))
        {
            throw new Error("min or max is NaN");
        }
        return this.roll() % (max - min + 1) + min;
    }

    /**
     * Generate and returns a random integer between min-max.
     * 
     * integer(49) returns random integer between 0-49
     * integer(20,49); // returns an integer between 20-49 inclusive
     * 
     * @param	min
     * @param	max
     * @return
    */
    integer(min, max = NaN) 
    {
        if(isNaN(max)) {max = min; min = 0;}
        // Need to use floor instead of bit shift to work properly with negative values:
        return Math.floor(this.range(min, max));
    }

    /**
     * Generates and returns a floating point (double) between 0 and 1.
     * This will propagate the seed to its next value.
     * @return The generated floating point number
    */
    randFloat()
    {
        return this.roll() / RAND_MAX;
    }

    /**
     * Seeds the random number generator with the specified seed value.
    */
    srand(newSeed)
    {
        if(newSeed != parseInt(newSeed))
        {
            throw new Error("Seed should be a whole number");
        }
        if(newSeed <= 0 || newSeed > RAND_MAX)
        {
            throw new Error("Seed out of range");
        }
        this.seed = newSeed;
    }
}