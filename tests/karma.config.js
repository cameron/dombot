module.exports = function (config) {
  config.set({
    browsers: [ 'PhantomJS' ],
    singleRun: false,
    frameworks: [ 'jasmine' ],
    files: [
      '../webpack/build/test.bundle.js'
    ],
    reporters: [ 'dots' ],
    browserNoActivityTimeout: 30000,
    plugins: [
      require("karma-jasmine"),
      require("karma-phantomjs-launcher"),
      require("karma-sourcemap-loader")
    ],
    captureTimeout: 60000
  });
};
