### Tutorial

`IO` is a structure used for expressing imperative computations in a
pure way. In a nutshell it gives us the convenience of imperative
programming while preserving the properties of a purely functional
programming.

Let's say we have a function `fire Missiles` that takes a number `n` and
then fires `n` missiles. If fewer than `n` missiles are available then
only that amount of missiles is fired. The function returns the amount
of missiles that was successfully fired.

```typescript
function fireMissiles(amount: number): number { ... }
```

Certainly that is a very easy way of firing missiles. But
unfortunately it is also impure. This, among other things, will make
it tricky to test code using `fireMissiles` without actually firing
missiles every time the test is run.

To solve the issue `IO` provides a method called `withEffects`. It
converts `fireMissiles` from an imperative procedure that actually
fires missiles to a pure function that merely returns a _description_
about how to fire missiles.

```typescript
const fireMissilesIO = withEffects(fireMissiles);
```

`fireMissilesIO` has the type `(amount: number) => IO<number>`. Here
`IO<number>` means that the function returns an IO-action that does
something and then produces a value of type `void`. The crucial
difference is that `fireMissilesIO` has no side-effects and that it
always return an equivalent IO-action when given the same number.

`IO` is a monad, so we can use it with go-notation.

```javascript
const fireMissilesAndNotify = fdo(function*(amount) {
  const n = yield fireMissiles(amount);
  yield sendMessage(`${n}` messages successfully fired);
  return n;
});
```

Here `sendMessage` has the type `(msg: string) => IO<void>`. It takes
a string and returns an IO-action that somehow sends the specified
message.

IO-actions can be asynchronous. Instead of `withEffects` we can use
`withEffectsP` to turn an impure function that returns a promise into
a pure function.

```javascript
const fetchIO = withEffectsP(fetch);
```
