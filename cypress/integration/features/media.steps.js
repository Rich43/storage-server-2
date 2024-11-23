import { Given, When, Then } from "@cucumber/cucumber";

const API_URL = "http://localhost:4000/graphql";

Given("the server is running", () => {
    // Check if the server's health endpoint is accessible
    cy.request("http://localhost:4000/health").its("status").should("eq", 200);
});

Given("the database is seeded with media data", () => {
    cy.exec("npm run bdd:setup"); // Ensure migrations and seed data are applied
});

When("I request the media list", function () {
    cy.request({
        method: "POST",
        url: API_URL,
        body: {
            query: `
                query {
                    lists {
                        listMedia {
                            title
                            description
                        }
                    }
                }
            `,
        },
    }).then((response) => {
        this.response = response.body.data.lists.listMedia;
    });
});

Then("I should see the following media:", function (dataTable) {
    const expectedMedia = dataTable.hashes();
    expect(this.response).to.deep.equal(expectedMedia);
});

When("I create a new media item:", function (dataTable) {
    const media = dataTable.hashes()[0];
    cy.request({
        method: "POST",
        url: API_URL,
        body: {
            query: `
                mutation CreateMedia($input: CreateMediaInput!) {
                    media {
                        createMedia(input: $input) {
                            title
                            description
                        }
                    }
                }
            `,
            variables: {
                input: {
                    title: media.title,
                    description: media.description,
                    url: "http://example.com",
                    mimetype: "text/plain",
                },
            },
        },
    }).then((response) => {
        this.createdMedia = response.body.data.media.createMedia;
    });
});

Then("the media list should include:", function (dataTable) {
    const expectedMedia = dataTable.hashes()[0];
    expect(this.createdMedia).to.include(expectedMedia);
});
