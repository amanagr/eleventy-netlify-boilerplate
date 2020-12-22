const markdownIt = require("markdown-it");
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const ErrorOverlayPlugin = require('eleventy-plugin-error-overlay');

const shortcodes = require('./utils/shortcodes');
const transforms = require('./utils/transforms');

module.exports = function (config) {
	const manifestPath = path.resolve(__dirname, '_site/assets/manifest.json');

	// Allow eleventy to understand yaml files
	config.addDataExtension('yml', (contents) => yaml.safeLoad(contents));

	// Shows error name, message, and fancy stacktrace
	config.addPlugin(ErrorOverlayPlugin);

	// Transforms
	Object.keys(transforms).forEach((key) => {
		config.addTransform(key, transforms[key]);
	});

	// Shortcodes
	config.addNunjucksAsyncShortcode('image', shortcodes.image);
	config.addNunjucksAsyncShortcode('background_image', shortcodes.background_image);
	config.addNunjucksAsyncShortcode('webpack', shortcodes.webpack);

	// Pass-through files
    // Copy complete directories to _site folder so that they
    // are available to be rendered.
    config.addPassthroughCopy("src/admin");
	config.addPassthroughCopy('src/_headers');
	// Everything inside static is copied verbatim to `_site`
	config.addPassthroughCopy('src/assets/static');

	// BrowserSync Overrides
	config.setBrowserSyncConfig({
		...config.browserSyncConfig,
		// Reload when manifest file changes
		files: [manifestPath],
		// Show 404 page on invalid urls
		callbacks: {
		  ready: (err, browserSync) => {
			browserSync.addMiddleware('*', (req, res) => {
			  const fourOFour = fs.readFileSync('_site/404.html');
			  res.write(fourOFour);
			  res.end();
			});
		  }
		},
		// Speed/clean up build time
		ui: false,
		ghostMode: false
	});

    // Eleventy doesn't watch changes in files / folders mentioned
    // in .gitignore by default. We disabled that feature since we
    // want eleventy to watch changes in the sass compiles css folder.
    config.setUseGitIgnore(false);

    // Filters
    function sortByPosition(values) {
        return values.sort((a, b) =>
            Math.sign(a.data.position - b.data.position)
        );
    }

    function sortByTitle(values) {
        return values.sort((a, b) => Math.sign(a.data.title - b.data.title));
    }

    config.addFilter("sortByPosition", sortByPosition);
    config.addFilter("sortByTitle", sortByTitle);

    const md = new markdownIt({
        html: true,
    });

    config.addFilter("markdown", (content) => {
        return md.render(content);
    });

    return {
		dir: { input: 'src' },
		// Allow nunjucks, markdown and 11ty files to be processed
		// templateFormats: ['njk', 'md', '11ty.js'],
		// htmlTemplateEngine: 'njk',
		// Allow pre-processing `.md` files with nunjucks
		// thus transforming the shortcodes
		// markdownTemplateEngine: 'njk'
	};
};
