Array.prototype.query = function(sql) {
    return alasql(sql, [this]);
};