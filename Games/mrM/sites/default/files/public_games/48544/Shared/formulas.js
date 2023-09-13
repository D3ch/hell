const Formula = {
    "linear": function (x, coefficient = 0)
    {
        return function (input)
        {
            return (x * input) + coefficient;
        }
    },
    "quadratic": function (x2, x = 0, coefficient = 0)
    {
        return function (input)
        {
            return (x2 * x2 * input) + (x * input) + coefficient;
        }
    },
    "cubic": function (x3, x2 = 0, x = 0, coefficient = 0)
    {
        return function (input)
        {
            return (x3 * x3 * x3 * input) + (x2 * x2 * input) + (x * input) + coefficient;
        }
    }
}