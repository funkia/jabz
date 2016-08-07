# Jabz

Powerful and practical abstractions for JavaScript. Functors, Monads,
Traversables and all that jazz.

## Goals

* Be simple and convenient in usage
* Allow for performant implementations
* Support TypeScript to the extent possible
* Provide a set of implementations for often used instances
* Provide a set of common derived functions

## Features

* Do-notation
* Structures
  * Monoid
  * Applicative
  * Monad
* Implementations
  * Maybe

## Differences from fantasy-land

* Several derived methods are part of the specification which allows
  for efficient specialized implementation.
* Static `lift` instead of `ap` in applicative. This allows for more
  performant implementation. Also can be typed with TypeScript.

## Rough spec

### Semigroup

A semigroup is a structure that can be combined.

#### Methods

* `merge`

### Monoid

#### Methods

* `identity` (static)

### Functor

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

Todo.
