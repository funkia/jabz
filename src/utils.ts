export function id<A>(a: A): A {
  return a;
}

export function apply<A, B>(f: (a: A) => B, a: A): B {
  return f(a);
}

export function mixin(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      if (!(name in derivedCtor) && !(name in derivedCtor.prototype)) {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      }
    });
  });
}

export function add(n: number, m: number): number {
  return n + m;
}

export function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
  return (a: A) => f(g(a));
}

export function impurePush<A>(arr: A[], a: A): A[] {
  arr.push(a);
  return arr;
}

export function cons<A>(a: A, as: A[]): A[] {
  return [a].concat(as);
}

export function curry3<A, B, C, R>(f: (a: A, b: B, c: C) => R): (a: A) => (b: B) => (c: C) => R {
  return (a) => (b) => (c) => f(a, b, c);
}

export function curry2<A, B, R>(f: (a: A, b: B) => R): (a: A) => (b: B) => R {
  return (a) => (b) => f(a, b);
}

export function flip<A, B, C>(f: (a: A, b: B) => C): (b: B, a: A) => C {
  return (b, a) => f(a, b);
}

export function foldlArray<A, B>(f: (acc: B, a: A) => B, init: B, a: A[]): B {
  for (let i = 0; i < a.length; ++i) {
    init = f(init, a[i]);
  }
  return init;
}

export function foldlArray1<A>(f: (acc: A, a: A) => A, a: A[]): A {
  let init = a[0];
  for (let i = 1; i < a.length; ++i) {
    init = f(init, a[i]);
  }
  return init;
}

export function arrayFlatten<A>(m: A[][]): A[] {
  let result: A[] = [];
  for (let i = 0; i < m.length; ++i) {
    for (let j = 0; j < m[i].length; ++j) {
      result.push(m[i][j]);
    }
  }
  return result;
}

export function deepEqual(a: any, b: any): boolean {
  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a);
    for (const key of aKeys) {
      if (!deepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  } else {
    return a === b;
  }
}

export type F0<Z> =
  () => Z;
export type F1<A, Z> =
  (a: A) => Z;
export type F2<A, B, Z> =
  (a: A, b: B) => Z;
export type F3<A, B, C, Z> =
  (a: A, b: B, c: C) => Z;
export type F4<A, B, C, D, Z> =
  (a: A, b: B, c: C, d: D) => Z;
export type F5<A, B, C, D, E, Z> =
  (a: A, b: B, c: C, d: D, e: E) => Z;
