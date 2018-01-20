Array.prototype.getFields = function(field) {
    return this.map(function(o) {
        return o[field];
    });
};

Array.prototype.equals = function(array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        } else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};

Array.prototype.diff = function(a) {
    return this.filter(function(i) { return a.indexOf(i) < 0; });
};

Array.prototype.query = function(sql) {
    return alasql(sql, [this]);
};