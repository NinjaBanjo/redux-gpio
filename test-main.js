// setup test env
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

// Include tests with require.context
var unitTests = require.context("./lib", true, /-test\.js$/);
var integrationTests = require.context("./tests/integration", true, /-test\.js$/);

// Run the tests
unitTests.keys().forEach(unitTests);
integrationTests.keys().forEach(integrationTests);
