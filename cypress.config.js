const { defineConfig } = require("cypress");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const addCucumberPreprocessorPlugin = preprocessor.addCucumberPreprocessorPlugin;

module.exports = defineConfig({
    e2e: {
        specPattern: "cypress/integration/**/*.feature", // Matches your feature file location
        setupNodeEvents: async (on, config) => {
            // Add the Cucumber preprocessor plugin
            await addCucumberPreprocessorPlugin(on, config);

            // Add the ESBuild preprocessor for parsing .feature files
            on(
                "file:preprocessor",
                createBundler({
                    plugins: [preprocessor.createEsbuildPlugin(config)],
                })
            );

            // Return the updated config object
            return config;
        },
    },
});
