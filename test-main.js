require('source-map-support').install();
// setup test env
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

// Include tests with require.context
var unitTests = require.context("./lib", true, /-test\.js$/);
var integrationTests = require.context("./tests/integration", true, /-test\.js$/);

// components
var components = require.context("./lib", true, /(!-test)\.js$/);

// Run the tests
unitTests.keys().forEach(unitTests);
integrationTests.keys().forEach(integrationTests);

components.keys().forEach(components);
