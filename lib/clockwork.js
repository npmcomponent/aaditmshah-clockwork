var clockwork = function (exports) {
    "use strict";

    var functProto = exports.functProto = Function.prototype;
    var objectProto = exports.objectProto = Object.prototype;
    var arrayProto = exports.arrayProto = Array.prototype;

    var bind = functProto.bind;

    var unbind = exports.unbind = bind.bind(bind);
    var callable = exports.callable = unbind(functProto.call);
    var applicable = exports.applicable = unbind(functProto.apply);

    bind = exports.bind = applicable(bind);

    var arrayFrom = exports.arrayFrom = callable(arrayProto.slice);
    var classOf = exports.classOf = callable(objectProto.toString);

    exports.Class = (Class.prototype = new Function).constructor = Class;
    exports.instantiate = instantiate;
    exports.typeOf = typeOf;

    return exports;

    function Class(body, base) {
        var derived = base instanceof Class;

        if (derived) {
            construct.__proto__ = base;
            var child = construct.prototype;
            var parent = child.__proto__ = base.prototype;
        } else construct.__proto__ = Class.prototype;

        return construct;

        function construct() {
            if (derived) var uber = augments.bind(this);
            body.call(this, uber).apply(this, arguments);
        }

        function augments() {
            if (this.__proto__ === child) {
                var hyper = this.__proto__ = instantiate(base, arguments);
                var proto = hyper.__proto__;

                while (proto !== parent) {
                    hyper = proto;
                    proto = hyper.__proto__;
                }

                hyper.__proto__ = child;
            }

            return this.__proto__;
        }
    }

    function instantiate(constructor, args, prototype) {
        if (prototype) {
            var proto = constructor.prototype;
            constructor.prototype = prototype;
        }

        var instance = new (bind(constructor, [null].concat(arrayFrom(args))));
        if (proto) constructor.prototype = proto;
        return instance;
    }

    function typeOf(value) {
        if (value === null) return "null";
        if (typeof value === "undefined") return "undefined";
        return classOf(value).slice(8, -1).toLowerCase();
    }
}(typeof exports === "object" ? exports : {});
