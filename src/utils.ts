export function id<A>(a: A): A {
  return a;
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
