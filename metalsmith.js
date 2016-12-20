const fs = require("fs");
const Metalsmith = require('metalsmith');
const watch = require('metalsmith-watch');
const pug = require('metalsmith-pug/lib/node6');
const sass = require('metalsmith-sass');
const metalsmithPrism = require('metalsmith-prism');
const markdown = require("jstransformer-markdown-it");
const marked = require("marked");
const yaml = require("js-yaml");

marked.setOptions({
  langPrefix: 'language-'
});

function loadYamlDoc(path) {
  try {
    return yaml.safeLoad(fs.readFileSync(`./docs/${path}.yaml`, 'utf8'));
  } catch(e) {
    console.log(e);
    throw e;
  }
}

const abstractions = [
  "semigroup", "monoid",
  "functor", "applicative", "monad",
  "foldable", "traversable"
].map(loadYamlDoc);

const implementations = [
  "maybe", "either", "cons", "infinitelist", "writer"
].map(loadYamlDoc);

Metalsmith(__dirname)
  .source('./docs')
  .destination('./docs-build')
  .use(pug({
    pretty: true,
    filters: {markdown},
    locals: {
      abstractions, implementations, marked
    }
  }))
  .use(metalsmithPrism())
  .use(sass({
    outputStyle: "expanded"
  }))
  .use(watch({
    paths: {
      "${source}/**/*": true,
      "**/*.pug": "**/*.pug"
    },
    livereload: true
  }))
  .build(function(err) {
    if (err) throw err;
  });
