# Lexer #

An elegant, incremental framework which pushes the envelope of JavaScript technology behind a simple and coherent API. It allows programmers to write reusable, extensible and maintainable code using classical object oriented constructs.

## Installation ##

Clockwork can be installed on [node.js](http://nodejs.org/ "node.js") via the [node package manager](https://npmjs.org/ "npm") using the command `npm install clockworks`.

You can install it as a [component](https://github.com/component/component "component/component") for web apps using the command `component install aaditmshah/clockwork`.

## Philosophy ##

Clockwork is designed as an incremental framework. The main objective of clockwork is to create object oriented constructs such as classes which allow programmers to write maintainable code. However in the process it also exposes the features used to create the contructs themselves. In essence clockwork securely exports every single feature it uses, offering a great deal of flexibilty to programmers while keeping the size of the overall application to a minimum.

While clockwork exports a myriad of features care is taken to ensure that the API is loosely coupled and cohesive, and only those features which are absolutely essential are implemented and exported - thus keeping the API coherent. Unlike many other frameworks clockwork doesn't extend native types with a host of utility methods which may or may not be used by the programmer. Instead it focuses on delivering a set of core features which allow new functionality to be easily implemented, thus extending it.

The long term objective of clockwork is to provide a sufficiently expressive runtime for a superset of JavaScript which compiles down to JavaScript. This runtime will include support for classes, interfaces and a list of other object oriented constructs which will allow programmers to write industry level production ready code in JavaScript. In a nutshell we're implementing JavaScript 2.0 features for modern day JavaScript interpreters so that everyone can take advantage of them.

## Core Features ##

Clockwork is a hands on open source project which is continuously evolving. Currently the only core feature implemented is classes, but we're working on a bunch of new features including a dynamic type system, interfaces, polymorphic functions and much more. If you're interested in contributing to clockwork then fork it on Github. We're always open to new suggestions. Clockwork will finally become the runtime of a superset of JavaScript, so you may also give your input on the syntax of the new elements added to the language.

### Classes ###

The first core feature exported by clockwork is classes. Unlike [other patterns](http://ejohn.org/blog/simple-javascript-inheritance/ "John Resig -   Simple JavaScript Inheritance") used to implement classical inheritance in JavaScript clockwork classes more closely resemble Java classes, which is great because it'll eventually become the runtime of a superset of JavaScript which will have classes similar to Java classes.

In addition clockwork classes have several advantages over other class patterns:

1. Classes are created using a `Class` constructor instead of a pattern like `Class.extend`. This ensures that all classes are instances of `Class`.
2. The body of a class is a function and not an object containing the properties and methods of the class. This makes it possible to have closures and private variables.
3. Classes need not have any special method like `init` or `extends` to tell the constructor how to create the class. Instead a cleaner and safer approach is used.
4. Static members defined on classes are inherited by derived classes just like any other member. AFAIK clockwork classes are the only ones which support this feature.
5. You may prevent costly base class initialization by simply not calling the base class constructor. However this prevents you from using public base class methods not defined on the base class prototype.
6. Classes behave just like ordinary JavaScript constructors and the `instanceof` operator always works as expected (even when a derived class hasn't called the base class constructor).
7. The code for the `Class` constructor itself is the smallest there is and very efficient. It relies heavily on `__proto__` (which is it's only disadvantage as it won't work in Rhino). However, it's also its biggest advantage. Besides, the `__proto__` property is [here to stay](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/proto "__proto__ - JavaScript | MDN").

So without further ado let's dive into some actual code:

```javascript
var clockwork = require("clockworks");
var Class = clockwork.Class;

var Rectangle = Class(function () {
    var width;
    var height;

    function constructor(length, breadth) {
        width = length;
        height = breadth;
    }

    this.area = function () {
        return width * height;
    };

    return constructor;
});

var rectangle = new Rectangle(3, 7);
console.log(rectangle.area());
```

In the above program we're creating a simple `Rectangle` class with two private variables `width` and `height`. The `constructor` accepts two arguments and stores them. The public method `area` multiplies and returns the width and height of the instance. It's important to note that the class body function must always return the constructor of the class or else an error will occur. Now let's look at some inheritance:

```javascript
var Square = Class(function (uber) {
    return function (side) {
        uber(side, side);
    };
}, Rectangle);

var square = new Square(5);
console.log(square.area());
```

Inheritance is as simple as passing the base class to extend as the second argument to the `Class` constructor. Notice that the class body function now accepts a single parameter called `uber`. This is the base class constructor used to initialze the base class. In this example the constructor of `Square` invokes the constructor of `Rectangle`. If we hadn't done so then the method `area` would be `undefined` on the instance of `Square`. Let's proceed:

```javascript
var Cube = Class(function () {
    var side;

    function constructor() {
        side = arguments[0];
        uber = uber(side);
    }

    this.area = function () {
        return 6 * uber.area();
    };

    this.volume = function () {
        return side * uber.area();
    };

    return constructor;
}, Square);

var cube = new Cube(5);
console.log(cube.area());
console.log(cube.volume());
```

Here we've used multilevel inheritance, and the `area` method of `Cube` shadows the `area` method of `Rectangle`. However we may still access the base class method. When we call the base class constructor `uber` we get an instance of the base class. Since we don't need the base class constructor anymore we store this instance as `uber` itself. This allows us to call the base class `area` method as `uber.area` from the `area` and `volume` methods of `Cube`.

Clockwork classes have a lot more to them. Like normal constructor functions you may define methods on their prototypes and they will shared amongst all the instances of the class, or you may define static members on the class itself and they'll be inherited by base classes. This construct is continuously evolving and the amount of documentation required for such little code is mind boggling. I would appreciate it if you could help me write proper documentation so that I could concentrate on implementing other features.

## Additional Features ##

In addition to core features clockwork also exports every feature used to create the core features. These include various properties and methods:

1. Properties
   1. functProto - An alias of `Function.prototype`.
   2. arrayProto - An alias of `Array.prototype`.
2. Methods
   1. unbind - An alias of `bind.bind`. Used to unbind a function so that it may easily to bound to something else.
   2. callable - An alias of `call.bind`. Used to unbind a function so that it may be called with another `this` pointer.
   3. applicable - An alias of `apply.bind`. Used to unbind a function so that it an array of arguments may be applied to it, with another `this` pointer.
   4. bind - An alias of `bind.apply`. Used to bind an array of arguments along with the `this` pointer to a function.
   5. arrayFrom - An alias of `slice.call`. Used to convert an arguments object into an array.
   6. instantiate - A special function used to instantiate a constructor using an array of arguments, and an optional `prototype` object.

Since the `instantiate` method is a little ambiguous we'll explain it in more detail with an example:

```javascript
function f(a, b) {
    console.log(a + b);
}

function g(a, b) {
    console.log(a - b);
}

var h = instantiate(f, [3, 2], g.prototype); // => 5
console.log(h instanceof g);                 // => true
```

We normally create instances of a function using the `new` keyword. Sometimes however the arguments of the function are in the form of an array or an `arguments` object. In that case we can't simply use the `new` keyword with an `apply`. The `instantiate` function allows us to create an instance of a constructor (the first argument) from an array of arguments (the second argument). An optional third argument is used to specify the `prototype` object used to override the default prototype of the constructor. Hence in the above code although `h` was created from `f` it's actually an instance of `g`.

## Contribution ##

Clockwork is a very ambitious project. I'm always open to new suggestions and help. If you wish to contribute then fork my project or feel free to drop me an email at [aaditmshah@myopera.com](mailto:aaditmshah@myopera.com). It's also a very demanding project so if you would like to see more development then please consider making a donation, however small. Contact me for more details.
