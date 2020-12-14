const sass = require("./build-process/sass-process");
const minifyJs = require("./build-process/js-process");
const markdownIt = require("markdown-it");
const Image = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
    // Eleventy doesn't watch changes in files / folders mentioned
    // in .gitignore by default. We disabled that feature since we
    // want eleventy to watch changes in the sass compiles css folder.
    eleventyConfig.setUseGitIgnore(false);

    // Copy complete directories to _site folder so that they
    // are available to be rendered.
    eleventyConfig.addPassthroughCopy("src/admin");
    eleventyConfig.addPassthroughCopy("images");

    // Sass pre-processing
    eleventyConfig.on("beforeBuild", () => {
        sass("./src/styles/main.scss", "./_site/src/styles/main.css");
    });
    eleventyConfig.addWatchTarget("./src/styles/*.scss");

    // Minify JS
    eleventyConfig.on("beforeBuild", () => {
        minifyJs("./src/js/main.js", "./_site/src/js/main.js");
    });
    eleventyConfig.addWatchTarget("./src/js/*.js");

    // Filters
    function sortByPosition(values) {
        return values.sort((a, b) =>
            Math.sign(a.data.position - b.data.position)
        );
    }

    function sortByTitle(values) {
        return values.sort((a, b) => Math.sign(a.data.title - b.data.title));
    }

    eleventyConfig.addFilter("sortByPosition", sortByPosition);
    eleventyConfig.addFilter("sortByTitle", sortByTitle);

    const md = new markdownIt({
        html: true,
    });

    eleventyConfig.addFilter("markdown", (content) => {
        return md.render(content);
    });

    eleventyConfig.addNunjucksAsyncShortcode("Image", async (src, alt, cls) => {
        if (!alt) {
          throw new Error(`Missing \`alt\` on Image from: ${src}`);
        }

        let stats = await Image(src, {
          widths: [null, 1400, 992, 576],
          formats: ["jpeg", "webp"],
          urlPath: "/assets/optimized/",
          outputDir: "./_site/assets/optimized/",
        });

        let lowestSrc = stats["jpeg"][0];

        const srcset = Object.keys(stats).reduce(
          (acc, format) => ({
            ...acc,
            [format]: stats[format].reduce(
              (_acc, curr) => `${_acc} ${curr.srcset} ,`,
              ""
            ),
          }),
          {}
        );

        const source = `<source type="image/webp" srcset="${srcset["webp"]}" >`;

        const img = `<img
          class="${cls}"
          loading="lazy"
          alt="${alt}"
          src="${lowestSrc.url}"
          srcset="${srcset["jpeg"]}"
          style="max-width: 100%">`;

        return `<picture> ${source} ${img} </picture>`;
    });

    return {
        dir: {
            input: "src",
        },
    };
};
