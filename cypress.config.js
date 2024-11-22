import { defineConfig } from "cypress";
import * as preprocessor from "@badeball/cypress-cucumber-preprocessor";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";

export default defineConfig({
    e2e: {
        specPattern: "cypress/integration/**/*.feature", // Matches your feature file location
        setupNodeEvents: async (on, config) => {
            // Add the Cucumber preprocessor plugin
            await preprocessor.addCucumberPreprocessorPlugin(on, config);

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
