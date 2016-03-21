

var unitTests = require.context("./lib", true, /-test\.js$/);
var integrationTests = require.context("./tests/integration", true, /-test\.js$/);

unitTests.keys().forEach(unitTests);
integrationTests.keys().forEach(integrationTests);
