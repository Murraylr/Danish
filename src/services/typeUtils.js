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
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxiedPropertiesOf = exports.omitProperty = void 0;
function omitProperty(obj, key) {
    var o = __assign({}, obj);
    delete o[key];
    return o;
}
exports.omitProperty = omitProperty;
function proxiedPropertiesOf() {
    return new Proxy({}, {
        get: function (_, prop) { return prop; },
        set: function () {
            throw Error('Set not supported');
        },
    });
}
exports.proxiedPropertiesOf = proxiedPropertiesOf;
