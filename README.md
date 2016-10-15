<img align="right" src="https://avatars0.githubusercontent.com/u/21360882?v=3&s=200">

# Jabz

Powerful and practical abstractions for JavaScript. Functors, Monads,
Traversables and all that jazz.

[![Build Status](https://travis-ci.org/Funkia/jabz.svg?branch=master)](https://travis-ci.org/Funkia/jabz)
[![codecov](https://codecov.io/gh/Funkia/jabz/branch/master/graph/badge.svg)](https://codecov.io/gh/Funkia/jabz)
[![Gitter chat](https://badges.gitter.im/Join_Chat.svg)](https://gitter.im/funkia/General?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Goals and features

* Be as simple and convenient as possible in usage
* Allow for performant implementations
* Support TypeScript to the extent possible
* Provide implementations of often used instances
* Provide commonly used derived functions
* Do-notation
* [Seamless instances](#seamless-instances)

## Differences from fantasy-land

* Several derived methods are part of the specification which allows
  for efficient specialized implementation.
* Static `lift` instead of `ap` in applicative. This allows for more
  performant implementation. Also can be typed with TypeScript.
* And more.

## Rough spec

### Semigroup

A semigroup is a structure that can be combined through a method
called `merge`. The `merge` operation must be associative.

#### Methods

* `merge`

### Monoid

A monoid must be a semigroup. In addition to the `merge` method a
monoid must have a static method `identity`.

#### Methods

* `identity` (static)

### Functor

A functor is a structure that contains values. It provides a method
`map` that applies a function to the values in the functor.

#### Minimal complete definition

`map`

#### Methods

* `map`
* `mapTo` (_deriveable_)

### Applicative

#### Methods

* `of` (static)
* `lift` (static)

### Monad

#### Minimal complete definition

`chain` or `flatten`.

#### Methods

* `chain` (_deriveable_)
* `flatten` (_deriveable_)

### Foldable

#### Minimal complete definition

`foldMapId`

#### Methods

* `foldMapId`
* `foldMap` (_deriveable_)
* `fold` (_deriveable_)
* `size` (_deriveable_)

### Traversable

A traversable offers a function `traverse` that allows one to apply a
function to the values in the traversable. It is quite similar to a
functors `map`. But the function is a allowed to return values in an
applicative. `traverse` applies the function and runs the returned
applicative in sequence.

#### Methods

* `traverse`


## Seamless instances

Seamless instances means that certain native JavaScript types can be
used as if they implemented the abstractions relevant for them.

* `string`, the primitive, implements setoid, monoid.

## Instances

The Jabz library contains a set of common structures. Below is an
overview along with the abstractions that they implement.

* Sum — Semigroup, Monoid
* Endo — Semigroup, Monoid
* Maybe — Functor, Applicative, Monad, Foldable, Traversable
* Either — Functor, Applicative
* State — Functor, Applicative, Monad
* Writer — Functor, Applicative, Monad
* [IO](#io) — Functor, Applicative, Monad

### IO

The IO monad represents imperative computations. These computations
may be asynchronous.

#### `of`

```ts
of: <A>(a: A) => IO<A>
```

Returns an imperative computation that has no effects but deliver the
result `a`.

#### `call`

```ts
call: <A, B>(f: (...as: A) => B, ...args: A) => IO<B>
```

Takes a function of _n_ arguments that returns a value of type `B`.
`args` must match the functions signature. The returned computation
invokes the function with the arguments and returns its result.

#### `callP`

```ts
call: <A, B>(f: (...as: A) => Promise<B>, ...args: A) =>
IO<Either<any, B>>
```

Takes a function of _n_ arguments that returns a promise. `args` must
be _n_ arguments matching the functions signature. The returned
computation invokes `f` with the arguments and finishes once the
promise resolves or rejects. If the promise resolves the result will
be its result in a `right` otherwise the result is the rejection value
in a `left`.

#### `runIO`

```ts
runIO: <A>(comp: IO<A>): Promise<A>
```

Impure function that executes the computation and returns a promise
that resolves with the result of executing the computation.
