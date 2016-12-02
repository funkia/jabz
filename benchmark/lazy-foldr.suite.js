const Suite = require("./default-suite").Suite;

function thunkFn(init, idx, f, list) {
  return () => {
    if (idx === list.length) {
      return init;
    } else {
      return f(list[idx], thunkFn(init, idx + 1, f, list));
    }
  };
}

function lazyFoldrLambda(f, init, list) {
  if (list.length === 0) {
    return init;
  } else {
    return f(list[0], thunkFn(init, 1, f, list));
  }
}

class Thunk {
  constructor(init, idx, f, list) {
    this.init = init;
    this.idx = idx;
    this.f = f;
    this.list = list;
  }
  force() {
    if (this.idx === this.list.length) {
      return this.init;
    } else {
      return this.f(
        this.list[this.idx],
        new Thunk(this.init, this.idx + 1, this.f, this.list)
      );
    }
  }
}

function lazyFoldrObj(f, init, list) {
  if (list.length === 0) {
    return init;
  } else {
    return f(list[0], new Thunk(init, 1, f, list));
  }
}

var array = [];
for (var i = 0; i < 1000; i++) {
  array[i] = i;
}

lazyFoldrLambda((n, m) => n + m(), 0, array);

module.exports = Suite("Lazy foldr")
  .add("function", () => {
    return lazyFoldrLambda((n, m) => n + m(), 0, array);
  })
  .add("object", () => {
    return lazyFoldrObj((n, m) => n + m.force(), 0, array);
  })
  .run({async: true});
