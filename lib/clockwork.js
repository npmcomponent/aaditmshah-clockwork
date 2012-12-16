var clockwork = function (exports) {
    "use strict";

    var classProto = exports.classProto = Class.prototype = new Function;
    var functProto = exports.functProto = Function.prototype;

    var bind = functProto.bind;
    var unbind = exports.unbind = bind.bind(bind);
    exports.Class = classProto.constructor = Class;
    exports.replacePrototypeOf = replacePrototypeOf;
    exports.instantiate = instantiate;

    return exports;

    function Class(body, base) {
        var derived = typeof base === "function";
        var instance = base instanceof Class;

        if (derived) {
            construct.__proto__ = base;
            var child = construct.prototype;
            var parent = child.__proto__ = base.prototype;
            if (!instance) replacePrototypeOf(base, functProto, classProto);
        } else construct.__proto__ = classProto;

        return construct;

        function construct() {
            if (derived) var uber = augment.bind(this);
            body.call(this, uber).apply(this, arguments);
        }

        function augment() {
            var uber = this.__proto__;

            if (uber === child) {
                uber = this.__proto__ = instantiate(base, arguments);
                replacePrototypeOf(uber, parent, child);
            }

            return uber;
        }
    }

    function replacePrototypeOf(object, oldProto, newProto) {
        var proto = object.__proto__;

        while (proto !== oldProto) {
            object = proto;
            proto = object.__proto__;
        }

        object.__proto__ = newProto;
    }

    function instantiate(constructor, args) {
        return new (unbind(constructor, null).apply(null, args));
    }
}(typeof exports === "object" ? exports : {});
