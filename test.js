var getUknownTuple = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var total = 0;
    var str = '';
    args.forEach(function (args) {
        if (typeof args == 'number') {
            total += args;
        }
        else {
            str.concat(args);
        }
    });
    return [total, str];
};
console.log(getUknownTuple(1, 2, 3, 'abc', 'cdf'));
