# `IO` Tutorial

## Introduction

`IO` is a structure used for expressing imperative computations in a
pure way. In a nutshell it gives us the convenience of imperative
programming while preserving the properties of a purely functional
programming.

## Impure functions

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
missiles every time the tests are run.

## `IO` turns impure functions into pure ones

To solve the issue `IO` provides a method called `withEffects`. It
converts `fireMissiles` from an imperative procedure, that actually
fires missiles, to a pure function that merely returns a _description_
about how to fire missiles.

```typescript
const fireMissilesIO = withEffects(fireMissiles);
```

`fireMissilesIO` has the type `(amount: number) => IO<number>`. Here
`IO<number>` means an IO-action that does something and then produces
a value of type `number`. The crucial difference about
`fireMissilesIO` is that it has no side-effects and that it always
return an equivalent IO-action when given the same number. It is pure.

At first this might seem like nothing but a neat trick. But it
actually allows us to construct imperative computations in a
functional way. To work with IO-actions we can use the fact that `IO`
is a functor, an applicative and a monad. Thus we can for instance use
it with go-notation.

```javascript
const fireMissilesAndNotify = fgo(function*(amount) {
  const n = yield fireMissilesIO(amount);
  yield sendMessage(`${n} missiles successfully fired`);
  return n;
});
```

Here `sendMessage` has the type `(msg: string) => IO<void>`. It takes
a string and returns an IO-action that sends the specified message.

Notice that the above code _looks_ like imperative code. In a sense it
_is_ imperative code. It's a functional way of writing imperative
code. Since `sendMessage` is pure it satisfies referential
transparency. Instead of this:

```javascript
go(function*() {
  yield sendMessage("foo");
  yield sendMessage("foo");
});
```

We can write this:

```javascript
go(function*() {
  const sendFoo = sendMessage("foo");
  yield sendFoo;
  yield sendFoo;
});
```

If `sendMessage` had been impure this refactoring would not have
worked–the side-effect in `sendMessage` would only have been carried
out once. But since it's pure it's totally fine. In the dumb example
above it only made a small difference but in a real program being able
to perform such refactorings can be very beneficial.

## Asynchronous operations

IO-actions can be asynchronous. This makes it possible to express
asynchronous operations very conveniently. Instead of `withEffects` we
can use `withEffectsP` to turn an impure function that returns a
promise into a pure function.

```javascript
const fetchIO = withEffectsP(fetch);
```

Since promises can either resolve or reject `fetchIO` will return a
value of the type `IO<Either<any, Response>>`. A `right` value
indicates that the promise resolved and a `left` value that it
rejected.

An example of using `fetchIO` is below. Since parsing the body from a
`fetch` response as JSON is an asynchronous operation we define an
additional function `responseJson`.

```javascript
const responseJson = withEffectsP((response) => response.json());

const fetchUser = fgo(function*(userId) {
  // `eitherResponse` is either a response or an error
  const eitherResponse = yield fetchIO(usersUrl + "/" + userId);
  // we pattern match on `eitherResponse`
  return yield eitherResponse.match({
    right: (response) => responseJson(response),
    left: (_) => IO.of(left("Fetching user failed"))
  });
});
```

As defined above `fetchUser` takes a user id and returns
`IO<Either<string, User>>`. If the request fails `eitherResponse` is a
`left`. In that case the we yield an IO-action that does nothing
(created with `IO.of`) but contains a `left` with an error message.

## Running and testing

An IO-action can be run with the function `runIO`. The function
actually performs the operations in the IO-action and returns a
promise that resolves when it is done. `runIO` is an impure function.

Besides running IO-actions we can also test them. Or "dry-run" them.
To see how this works consider one of the previous examples with a
small bug added in:

```javascript
const fireMissilesAndNotify = fgo(function*(amount) {
  const n = yield fireMissilesIO(amount);
  yield sendMessage(`${amount} missiles successfully fired`);
  return n;
});
```

The error is that we don't send a message about how many missiles
where actually fired. Instead we send the number of missiles that
where requested to be fired. We can test the function with `testIO`:

```javascript
it("fires missiles and sends message", () => {
  testIO(fireMissilesAndNotify(10), [
    [fireMissilesIO(10), 10],
    [sendMessage(`10 missiles successfully fired`), undefined]
  ], 10);
});
```

The first argument to `testIO` is the IO-action to test. The second is
a list of pairs. The first element in each pair is an IO-action that
the code should attempt to perform, the second element is the value
that performing the action should return. The last argument is the
expected result of the entire computation.

However, the test above doesn't uncover the bug. Let's write another
one that does:

```javascript
it("fires missiles and sends message", () => {
  testIO(fireMissilesAndNotify(10), [
    [fireMissilesIO(10), 5],
    [sendMessage(`5 missiles successfully fired`), undefined]
  ], 5);
});
```

Here we specify that when the code attempts to run `fireMissilesIO(10)`
it should get back the response `5`. After this the next line will
throw because our implementation passes a string to `sendMessage` that
mentions `10` instead of `5`. Therefore `testIO` will throw and our
test will fail.
