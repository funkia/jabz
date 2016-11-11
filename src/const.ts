import {Applicative, applicative, AbstractApplicative} from "./applicative";
import Endo from "./monoids/endo";

export class ConstEndo<M, N> extends AbstractApplicative<N> {
  constructor(private m: Endo<M>) {
    super();
  }
  map<A, B>(f: (a: A) => B): ConstEndo<M, B> {
    return <any>this;
  }
  static of<B>(b: B): ConstEndo<any, any> {
    return new ConstEndo(Endo.identity());
  }
  of<B>(b: B): ConstEndo<any, any> {
    return new ConstEndo(Endo.identity());
  }
  ap<B>(a: ConstEndo<M, (a: N) => B>): ConstEndo<M, B> {
    return new ConstEndo(a.m.combine(this.m));
  }
  get(): Endo<M> {
    return this.m;
  }
}
