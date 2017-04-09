<img align="right" src="https://avatars0.githubusercontent.com/u/21360882?v=3&s=200">

# Jabz

Powerful and practical abstractions for JavaScript. Functors, monads,
foldables traversables and all that jazz.

[![Build Status](https://travis-ci.org/Funkia/jabz.svg?branch=master)](https://travis-ci.org/Funkia/jabz)
[![codecov](https://codecov.io/gh/Funkia/jabz/branch/master/graph/badge.svg)](https://codecov.io/gh/Funkia/jabz)
[![Gitter chat](https://badges.gitter.im/Join_Chat.svg)](https://gitter.im/funkia/General?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Goals and features

* Be as simple and convenient as possible in usage
* Allow for performant implementations
* Support TypeScript to the extent possible
* Batteries included. Provide implementations of often used instances
  and commonly used utility functions.
* Do-notation
* [Seamless instances](#seamless-instances)

For a more detailed introduction to the design of the specification
and a comparison to Fantasy Land please
see [this blog post](http://vindum.io/blog/introducing-jabz/).

## Install

```
npm install @funkia/jabz
```

## Documentation

See [the API documentation](https://funkia.github.io/jabz/) and the
example below.

Note that the specification for the abstractions is not written down
formally yet. But the source code contain TypeScript interfaces that
documents the different required methods. The laws associated with the
abstractions are as expected if one is familiar with them.

## Example

This example demonstrates some of what Jabz can do by implementing a
simple singly linked list aka. a cons list. 

```js
@monad @traversable
class Cons {
  constructor(v, t) {
    this.val = v;
    this.tail = t;
  }
  concat(c) {
    return this === nil ? c : cons(this.val, this.tail.concat(c));
  }
  of(b: B) {
    return cons(b, nil);
  }
  chain<B>(f) {
    return this === nil ? nil : f(this.val).concat(this.tail.chain(f));
  }
  traverse<B>(a, f) {
    return this === nil ? a.of(nil) : lift(cons, f(this.val), this.tail.traverse(a, f));
  }
}
const nil = new Cons(undefined, undefined);
function cons(a: A, as) {
  return new Cons(a, as);
}
function fromArray(as) {
  return as.length === 0 ? nil : cons(as[0], fromArray(as.slice(1)));
}
```

Since `Cons` contains the methods `of` and `chain` it can
implement monad. This is done with the `@monad` decorator. JavaScript
decorators are just plain old functions so they can also be used
without the decorator syntax

```js
monad(Cons);
```

The function allows implementations flexibility in what methods they
choose to provide. For instance monad can also be implemented by
defining a `of`, a `map` and a `chain` method.

Similar to Monad, Traversable is implemented by defining the
`traverse` method and using the `traversable` decorator.

When we implement Monad Jabz automatically derives implementations for
Functor and Applicative. Likewise when we implement Traversable it
derives Foldable. Thus, Jabz can give us a lot of things for free just
from the few methods the `Cons` class defines.

Map functions over elements in the list.
```js
mapTo((n) => n * n, fromArray([1, 2, 3, 4])); //=> [1, 4, 9, 16]
```

Change each element in the list to a constant.

```js
mapTo(8, fromArray([1, 2, 3, 4])); //=> [8, 8, 8, 8]
```

Apply a list of functions to a list of values.

```js
ap(fromArray([(n) => n * 2, (n) => n * n]), fromArray(1, 2, 3)); //=> [2, 4, 6, 1, 4, 9]
```

Folding.

```js
foldr((n, m) => n + m, 3, fromArray([1, 2, 3, 4, 5])); //=> 18
```

Find an element satisfying a predicate.

```js
find((n) => n > 6, fromArray([1, 8, 3, 7, 5])); //=> just(8)
findLast((n) => n > 6, fromArray([1, 8, 3, 7, 5])); //=> just(7)
```

We can convert a cons-list to an array

```js
toArray(fromArray([1, 2, 3, 4])); //=> [1, 2, 3, 4]
```

We can flatten nested cons-lists.

```js
flatten(fromArray([fromArray([1, 2]), fromArray([3, 4, 5])])); //=> [1, 2, 3, 4, 5]
```

## Seamless instances

Seamless instances means that certain native JavaScript types can be
used as if they implemented the abstractions relevant for them.

* `string`, implements setoid and monoid.
* `array`, implements setoid, monoid, functor, foldable and traversable.

