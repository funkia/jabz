const Metalsmith = require('metalsmith');
const browserSync = require('metalsmith-browser-sync');
const watch = require('metalsmith-watch');
const pug = require('metalsmith-pug/lib/node6');
const sass = require('metalsmith-sass');
const highlight = require('metalsmith-code-highlight');
const metalsmithPrism = require('metalsmith-prism');
const markdown = require("jstransformer-markdown-it");

Metalsmith(__dirname)
  .source('./docs')
  .destination('./docs-build')
  .use(pug({pretty: true, filters: {markdown}}))
  // .use(highlight({}))
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
  // .use(browserSync({
  //   server : "./docs-build",
  //   files  : ["**/*.html", "**/*.css"]
  // }))
  .build(function(err) {
    if (err) throw err;
  });
