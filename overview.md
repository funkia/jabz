Jabz provides the following abstractions

* [Semigroup](#Semigroup)
* [Monoid](#Monoid)
* [Functor](#Functor)
* [Applicative](#Applicative)
* [Monad](#Monad)
* [Foldable](#Foldable)
* [Traversable](#Traversable)

Jabz provides the following implementations of the abstractions.

| Name                          | Semigroup | Monoid | Functor | Applicative | Monad | Foldable | Traversable |
| ----------------------------- | --------- | ------ | ------- | ----------- | ----- | -------- | ----------- |
| [Maybe](#Maybe)               |           |        | ✔︎       | ✔︎           | ✔︎     | ✔︎        | ✔︎          |
| [Either](#Either)             |           |        | ✔︎       | ✔︎           |       |          |            |
| [Cons](#Cons)                 | ✔︎         | ✔︎      | ✔︎       | ✔︎           | ✔︎     | ✔︎        | ✔︎          |
| [InfiniteList](#InfiniteList) |           |        | ✔︎       | ✔︎           | ✔︎     | ✔︎        | ✔︎          |
| [Writer](#Writer)             |           |        | ✔︎       | ✔ | ✔ | |
| Identity                      |           |        | ✔︎       | ✔︎           | ✔︎     | ✔︎        | ✔︎          |
| Const                         |           |        | ✔︎       | ✔︎           | ✔︎     | ✔︎        | ✔︎          |
