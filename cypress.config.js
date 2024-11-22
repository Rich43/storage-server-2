const { defineConfig } = require("cypress");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");

module.exports = defineConfig({
    e2e: {
        specPattern: "cypress/e2e/**/*.feature", // Location of your .feature files
        setupNodeEvents(on, config) {
            preprocessor.addCucumberPreprocessorPlugin(on, config).then();
            return config;
        },
    },
});
