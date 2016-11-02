export function curry2<A, B, R>(f: (a: A, b: B) => R): (a: A) => (b: B) => R {
  return (a) => (b) => f(a, b);
}

export function curry3<A, B, C, R>(f: (a: A, b: B, c: C) => R): (a: A) => (b: B) => (c: C) => R {
  return (a) => (b) => (c) => f(a, b, c);
}
