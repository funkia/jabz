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
