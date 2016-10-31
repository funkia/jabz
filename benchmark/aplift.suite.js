const Suite = require("./default-suite").Suite;
const R = require("ramda");
const M = require("ramda-fantasy").Maybe;

const {Maybe, just} = require("../lib/maybe");

function add2(n, m) {
  return n + m;
}

function add3(n, m, p) {
  return n + m + p;
}

function add2C(n) {
  return (m) => n + m;
}

function add3C(n) {
  return (m) => (p) => n + m + p;
}

const j0 = just(1);
const j1 = just(3);
const j2 = just(5);
const j3 = just(9);
const j4 = just(13);

const mj0 = M.Just(1);
const mj1 = M.Just(3);
const mj2 = M.Just(5);
const mj3 = M.Just(9);
const mj4 = M.Just(13);

const lift = just(0).lift;

const liftedAdd2 = R.lift(R.curry(add2));
const liftedAdd3 = R.lift(R.curry(add3));

module.exports = Suite("`ap` vs `lift` on `Maybe`")
  .add("lift", () => {
    return lift(add2, lift(add2, j0, j1), lift(add3, j2, j3, j4)).val === 31;
  })
  .add("ap", () => {
    return j1.ap(j0.map(add2C)).ap((j4.ap(j3.ap(j2.map(add3C)))).map(add2C)).val === 31;
  })
  .add("Ramda lift", () => {
    return liftedAdd2(liftedAdd2(mj0, mj1), liftedAdd3(mj2, mj3, mj4)).value === 31;
  })
  .run({async: true});
