const sass = require('./build-process/sass-process');

module.exports = function (eleventyConfig) {
  // Eleventy doesn't watch changes in files / folders mentioned
  // in .gitignore by default. We disabled that feature since we
  // want eleventy to watch changes in the sass compiles css folder.
  eleventyConfig.setUseGitIgnore(false);

  // Copy complete directories to _site folder so that they
  // are available to be rendered.
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.on('beforeBuild', () => {
    // Sass pre-processing
    sass('./src/styles/main.scss', './_site/src/styles/main.css');
  });
  eleventyConfig.addWatchTarget('./src/styles/*.scss')

  return {
    dir: {
      input: 'src',
    }
  };
};
