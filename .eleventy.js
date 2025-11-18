import eleventyNavigationPlugin from "@11ty/eleventy-navigation";

export default function(eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  // eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  // Passthrough copy for assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/site.webmanifest");
  eleventyConfig.addPassthroughCopy("src/*.png");
  eleventyConfig.addPassthroughCopy("src/*.svg");

  // Passthrough copy for coverage map CSV from _data
  eleventyConfig.addPassthroughCopy({
    "src/_data/austin-mesh-rangetests.csv": "assets/data/austin-mesh-rangetests.csv"
  });

  // Passthrough copy for node_modules dependencies
  eleventyConfig.addPassthroughCopy({
    "node_modules/@11ty/is-land/is-land.js": "assets/js/is-land.js",
    "node_modules/@lowlighter/matcha/dist/matcha.css": "assets/css/matcha.css",
    "node_modules/leaflet/dist/leaflet.css": "assets/css/leaflet.css",
    "node_modules/leaflet/dist/leaflet.js": "assets/js/leaflet.js",
    "node_modules/leaflet/dist/images": "assets/css/images",
    "node_modules/leaflet.heat/dist/leaflet-heat.js": "assets/js/leaflet-heat.js"
  });

  // Passthrough CNAME for GitHub custom domain
  eleventyConfig.addPassthroughCopy("CNAME");

  // Add hash filter for cache busting
  eleventyConfig.addFilter("hash", function(url) {
    // Simple timestamp-based hash for cache busting
    // In production, you might want content-based hashing
    return `${url}?v=${Date.now()}`;
  });

  // Add date filter for formatting dates
  eleventyConfig.addFilter("readableDate", function(dateObj) {
    return new Date(dateObj).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Configure directories
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    // Use Liquid for HTML files (default)
    htmlTemplateEngine: "liquid",
    // Use Liquid for markdown files
    markdownTemplateEngine: "liquid"
  };
}
