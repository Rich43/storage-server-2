Feature: Media Management

  Scenario: List all media
    Given the database is seeded with media data
    When I request the media list
    Then I should see the following media:
      | title       | description               |
      | Test Media  | This is a test media entry |

  Scenario: Create a new media item
    Given the server is running
    When I create a new media item:
      | title         | description       |
      | New Media Item | New description |
    Then the media list should include:
      | title         | description       |
      | New Media Item | New description |
