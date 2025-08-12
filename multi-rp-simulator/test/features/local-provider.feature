
This tests that the local provider and RP are listening, logs in, then logs out. 

  Backgrounds: browser, local-provider, local-rp

    When the relying party is listening
    And the openid provider is listening
    And the openid provider has an oidc well-known configuration

    When I open the relying party page
    And I click on English
    Then the URI should match relying party home english page

    When I input "1400" for max_age
    And I click on login
    Then the URI should match relying party login english page
    And I click on client1

    Start step delay of 300

The local provider will accept any username and pasword for this test.

    When I click on debug
    Then I should see "client_id: 'client1'" 
    And I should see "ui_locales: 'en-CA'" 
    And I should see "max_age: '1400'" 

    When I input "pw_771_abc" for password
    And I click on Sign-in
    Then the URI should match openid provider interaction page

    When I click on Continue
    Then the URI should match relying party success english page
    And I should see "Authentication Response"
    And I should see "aud: client1"
    And I should see "Logout"

    When I click on logout
    And I click "Yes, sign me out"
    Then the URI should match relying party login english page