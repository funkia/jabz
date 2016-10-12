const Metalsmith = require('metalsmith');
const browserSync = require('metalsmith-browser-sync');
const watch = require('metalsmith-watch');
const pug = require('metalsmith-pug/lib/node6');
const sass = require('metalsmith-sass');
const highlight = require('metalsmith-code-highlight');

Metalsmith(__dirname)
  .source('./docs')
  .destination('./docs-build')
  .use(pug({pretty: true}))
  .use(highlight({}))
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
