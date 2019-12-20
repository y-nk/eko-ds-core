"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FROM = 'from';
exports.TO = 'to';
exports.add = function (context, node, data) {
    if (data === void 0) { data = {}; }
    if (!(node in context.nodes))
        context.nodes[node] = __assign(__assign({}, data), { id: node });
    return context.nodes[node];
};
exports.del = function (context, node) {
    if (!(node in context.nodes))
        throw new Error("No Such Node - (" + node + ")");
    exports.edgesOf(context, node)
        .forEach(function (edge) { return exports.unlink(context, edge[exports.FROM], edge[exports.TO]); });
    var _a = context.nodes, _b = node, dead = _a[_b], others = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
    context.nodes = others;
};
exports.link = function (context, from, to, cost, data) {
    if (data === void 0) { data = {}; }
    var notfound = [from, to].filter(function (node) { return !(node in context.nodes); });
    if (notfound.length)
        throw new Error("No Such Node - (" + notfound.join(', ') + ")");
    try {
        return exports.edgeFor(context, from, to);
    }
    catch (error) {
        var edge = __assign(__assign({}, data), { from: from, to: to, cost: cost });
        context.edges.push(edge);
        return edge;
    }
};
exports.unlink = function (context, from, to) {
    var edge = exports.edgeFor(context, from, to);
    context.edges.splice(context.edges.indexOf(edge), 1);
};
exports.edgesOf = function (context, node, direction) {
    if (!(node in context.nodes))
        throw new Error("No Such Node - (" + node + ")");
    if (!direction)
        return context.edges.filter(function (edge) { return edge[exports.FROM] === node || edge[exports.TO] === node; });
    return context.edges.filter(function (edge) { return edge[direction] === node; });
};
exports.edgeFor = function (context, from, to) {
    var edge = exports.edgesOf(context, from).find(function (edge) { return edge[exports.TO] === to; });
    if (!edge)
        throw new Error("No Such Route \u2013 (" + from + " -> " + to + ")");
    return edge;
};
exports.routeFor = function (context, nodes) { return (nodes.slice(0, -1).reduce(function (route, node, index) { return (__spreadArrays(route, [exports.edgeFor(context, node, nodes[index + 1])])); }, [])); };
exports.costOf = function (route) { return (route.reduce(function (sum, edge) { return sum + edge.cost; }, 0)); };
var NOOP = function () { return true; };
var SAFEGUARD = 0x4bed;
exports.routesFor = function (context, from, to, filter, occurences) {
    if (filter === void 0) { filter = NOOP; }
    if (occurences === void 0) { occurences = 1; }
    var solutions = [];
    var candidates = exports.edgesOf(context, from, exports.FROM)
        .map(function (from) { return [from]; });
    var safeguard = 0;
    var _loop_1 = function () {
        var candidate = candidates.shift();
        var now = candidate[candidate.length - 1];
        if (exports.costOf(candidate) === 0 || !filter(candidate))
            return "continue";
        if (now[exports.TO] === to)
            solutions.push(candidate);
        if (now.to !== to || occurences > 1)
            exports.edgesOf(context, now[exports.TO], exports.FROM)
                .map(function (edge) { return __spreadArrays(candidate, [edge]); })
                .filter(function (route) { return (route
                .filter(function (e, i, a) { return a.indexOf(e) === i; })
                .every(function (uniq) { return route.filter(function (edge) { return edge === uniq; }).length <= occurences + 1; })); })
                .forEach(function (route) { return candidates.push(route); });
    };
    while (candidates.length && safeguard++ < SAFEGUARD) {
        _loop_1();
    }
    if (!solutions.length)
        throw new Error("No Such Route \u2013 (" + from + " -> " + to + ")");
    return solutions;
};
