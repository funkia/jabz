export function mixin(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      if (!(name in derivedCtor)) {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      }
    });
  });
}
