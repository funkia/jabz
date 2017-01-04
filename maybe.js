module.exports = {
  name: 'Maybe',
  description: `
Maybe is a container that may contain one or zero elements.

Maybe is an instance of the following abstractions: functor, applicative, monad, foldable and traversable.

Import with.

\`\`\`javascript
import {just, nothing, ...} from "jabz/maybe";
\`\`\`
`,
  functions: [
    {
      name: `Maybe<A>`,
      type: `class`,
      description: `Type of maybe values.`
    }, {
      name: `Maybe#match`,
      type: '<K>(m: MaybeMatch<A, K>): K',
      description: `
Pattern matching on \`Maybe\` values. \`MaybeMatch<A, K>\` must be a
object with a \`nothing\` and \`just\` properties containing
functions that returns \`K\`.
\`\`\`javascript
maybeAge.match({
  just: (n) => \`You're \${n} years old\`,
  nothing: () => \`No age provided :(\`
});
\`\`\`
    `}, {
      name: `just`,
      type: `<A>(a: A): Maybe<A>`,
      description: `Creates a \`Maybe\` with no value inside.`},
    {
      name: `nothing`,
      type: `Maybe<any>`,
      description: `A \`Maybe\` with no value inside`}
  ]
};
