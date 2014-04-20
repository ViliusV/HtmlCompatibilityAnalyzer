// Third party or custom functions, utilities
Lib = new function() {
    this.isUndefinedNullOrEmpty = function (s) {
        return (s === undefined || s === null || s === "");
    };

    this.isNumber = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    this.degreesToRadians =  function(deg) {
        return 2 * Math.PI * deg / 360;
    }

    this.radiansToDegrees = function(rad) {
        return 360 * rad/(2 * Math.PI);
    }

};