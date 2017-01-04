### Maybe

Maybe is a container that may contain one or zero elements.

Maybe is an instance of the following abstractions: functor, applicative, monad, foldable and traversal.

Import with.

```
import {just, nothing, ...} from "jabz/maybe";
```

--fn: Maybe<A>: class

Type of maybe values.

--fn: Maybe#match: <K>(m: MaybeMatch<A, K>): K

Pattern matching on `Maybe` values. `MaybeMatch<A, K>` must be a
object with a `nothing` and `just` properties containing functions
that returns `K`.

```javascript
maybeAge.match({
  just: (n) => `You're ${n} years old'`,
  nothing: () => `No age provided :(`
});
```

--fn: just: <A>(a: A): Maybe<A>

Creates a Maybe with just the value a.

```javascript
map(double, just(4)); //=> just(8)
```

--fn: nothing: Maybe<any>

A Maybe with no value inside

```
map(double, nothing); //=> nothing
```
