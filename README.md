<img align="right" src="https://avatars0.githubusercontent.com/u/21360882?v=3&s=200">

# Jabz

Powerful and practical abstractions for JavaScript. Functors, Monads,
Traversables and all that jazz.

[![Build Status](https://travis-ci.org/Funkia/jabz.svg?branch=master)](https://travis-ci.org/Funkia/jabz)
[![codecov](https://codecov.io/gh/Funkia/jabz/branch/master/graph/badge.svg)](https://codecov.io/gh/Funkia/jabz)

## Goals

* Be simple and convenient as possible in usage
* Allow for performant implementations
* Support TypeScript to the extent possible
* Provide implementations of often used instances
* Provide commonly used derived functions

## Features

* Do-notation
* Structures
  * Monoid
  * Applicative
  * Monad
* Implementations
  * Maybe
* [Seamless instances](#seamless-instances)

## Differences from fantasy-land

* Several derived methods are part of the specification which allows
  for efficient specialized implementation.
* Static `lift` instead of `ap` in applicative. This allows for more
  performant implementation. Also can be typed with TypeScript.

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
