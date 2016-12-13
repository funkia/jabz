Jabz provides the following abstractions

* [Semigroup](#semigroup)
* [Monoid](#monoid)
* [Functor](#functor)
* [Applicative](#applicative)
* [Monad](#monad)
* [Foldable](#foldable)
* [Traversable](#traversable)

Jabz provides the following implementations of the abstractions.

| Name                          | Semigroup | Monoid | Functor | Applicative | Monad | Foldable | Traversable |
| ----------------------------- | --------- | ------ | ------- | ----------- | ----- | -------- | ----------- |
| [Maybe](#maybe)               |           |        | ✔︎       | ✔︎           | ✔︎     | ✔︎        | ✔︎          |
| [Either](#either)             |           |        | ✔︎       | ✔︎           |       |          |            |
| [ConsList](#conslist)         |           |        | ✔︎       | ✔︎           | ✔︎     | ✔︎        | ✔︎          |
| [InfiniteList](#infinitelist) |           |        | ✔︎       | ✔︎           | ✔︎     | ✔︎        | ✔︎          |
| Identity                      |           |        | ✔︎       | ✔︎           | ✔︎     | ✔︎        | ✔︎          |
| Const                         |           |        | ✔︎       | ✔︎           | ✔︎     | ✔︎        | ✔︎          |
