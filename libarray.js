"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.equal = function (a, b) { return (a === b || (a.length === b.length && !a.some(function (e, i) { return e !== b[i]; }))); };
exports.indexesOf = function (needle, haystack) { return (haystack
    .reduce(function (array, entry, index) { return (entry === needle[0] ? array.concat(index) : array); }, [])
    .filter(function (offset) { return (needle.every(function (entry, index) { return entry === haystack[offset + index]; })); })); };
exports.replaceBy = function (pattern, item, source) {
    var clone = __spreadArrays(source);
    exports.indexesOf(pattern, source)
        .reverse()
        .forEach(function (index) { return clone.splice(index, pattern.length, item); });
    return clone;
};
exports.patternsOf = function (source, min, max) {
    if (min === void 0) { min = 2; }
    if (max === void 0) { max = NaN; }
    var reports = [];
    if (isNaN(max))
        max = (source.length * .5) | 0;
    for (var size = min; size <= max; size++) {
        var _loop_1 = function (i) {
            var pattern = source.slice(i, i + size);
            if (!reports.find(function (report) { return exports.equal(report.pattern, pattern); })) {
                var count = exports.indexesOf(pattern, source).length;
                if (count > 1)
                    reports.push({ pattern: pattern, count: count });
            }
        };
        for (var i = 0; i < source.length - size; i++) {
            _loop_1(i);
        }
    }
    return reports;
};
