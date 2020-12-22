const fs = require('fs');
const path = require('path');
const { outdent } = require('outdent');
const Image = require('@11ty/eleventy-img');

const iconDefaultSize = 24;
const defaultSizes = '90vw';
const defaultImagesSizes = [1920, 1280, 640, 320];

const isFullUrl = (url) => {
    try {
        return !!new URL(url);
    } catch {
        return false;
    }
};

const manifestPath = path.resolve(__dirname, '../_site/assets/manifest.json');

module.exports = {
    // Allow embedding webpack assets pulled out from `manifest.json`
    // {% webpack "main.css" %}
    webpack: async (name) =>
        new Promise((resolve) => {
            fs.readFile(manifestPath, { encoding: 'utf8' }, (err, data) =>
                resolve(err ? `/assets/${name}` : JSON.parse(data)[name])
            );
        }),

	background_image: async (src, format) => {

        const extension = path.extname(src).slice(1).toLowerCase();
        const fullSrc = isFullUrl(src) ? src : `./${src}`;

        let stats;
		if (format === undefined ) {
			format = 'jpeg'
		}

        try {
            stats = await Image(fullSrc, {
                widths: [null],
                formats: [format],
				urlPath: '/assets/images/',
                outputDir: '_site/assets/images/',
            });
        } catch (e) {
            console.log('\n\x1b[31mERROR\x1b[0m creating image:');
            console.log(`> (${fullSrc})`);
            console.log(`  ${e}\n`);
            return '';
        }
		return stats[Object.keys(stats).reverse()[0]][0]['url'];
	},

    // Allow embedding responsive images
    // {% image "image.jpeg", "Image alt", "my-class"%}
    // {% image [100,100], "image.jpeg", "Image alt", "my-class", "Image title" %}
    image: async (...args) => {
        let fallbackWidth, fallbackHeight;

        if (Array.isArray(args[0])) {
            [fallbackWidth, fallbackHeight] = args.shift();
        }

        const src = args[0];
        const alt = args[1];
        const className = args[2];
        const sizes = args[3] ? args[3] : defaultSizes;

        const extension = path.extname(src).slice(1).toLowerCase();
        const fullSrc = isFullUrl(src) ? src : `./${src}`;

        let stats;
        try {
            stats = await Image(fullSrc, {
                widths: defaultImagesSizes,
                formats:
                    extension === 'webp'
                        ? ['webp', 'jpeg']
                        : ['webp', extension],
                urlPath: '/assets/images/',
                outputDir: '_site/assets/images/',
            });
        } catch (e) {
            console.log('\n\x1b[31mERROR\x1b[0m creating image:');
            console.log(`> (${fullSrc})`);
            console.log(`  ${e}\n`);
            return '';
        }

        const fallback = stats[extension].reverse()[0];
        const picture = outdent({ newline: '' })`
    <picture>
      ${Object.values(stats)
          .map(
              (image) =>
                  `<source type="image/${image[0].format}" srcset="${image
                      .map((entry) => `${entry.url} ${entry.width}w`)
                      .join(', ')}" sizes="${sizes}">`
          )
          .join('')}
      <img
        class="${className ? `${className} img-fluid` : 'img-fluid'}"
        loading="lazy"
        src="${fallback.url}"
        width="${fallbackWidth ? fallbackWidth : fallback.width}"
        height="${fallbackHeight ? fallbackHeight : fallback.height}" alt="${alt}">
    </picture>`;
		return picture;
    },
};
