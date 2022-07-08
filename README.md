# Projects Client Library

Copyright © Bentley Systems, Incorporated. All rights reserved. See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.

[iTwin.js](http://www.itwinjs.org) is an open source platform for creating, querying, modifying, and displaying Infrastructure Digital Twins. To learn more about the iTwin Platform and its APIs, visit the [iTwin developer portal](https://developer.bentley.com/).

If you have questions, or wish to contribute to iTwin.js, see our [Contributing guide](./CONTRIBUTING.md).

## About this Repository

Contains the __@itwin/projects-client__ package that wraps sending requests to the project service. Visit the [Projects API](https://developer.bentley.com/apis/projects/) for more documentation on the project service.

## Running Tests

In order to run the integration tests, first add a `.env` file containing valid values for:

```Typescript
#  Dev:"dev-", QA:"qa-", Prod: ""
IMJS_URL_PREFIX=

#  ** Regular **
IMJS_TEST_REGULAR_USER_NAME=
IMJS_TEST_REGULAR_USER_PASSWORD=

# ** Browser test oidc client registration with auth code flow **
IMJS_OIDC_BROWSER_TEST_CLIENT_ID=
IMJS_OIDC_BROWSER_TEST_REDIRECT_URI=
IMJS_OIDC_BROWSER_TEST_SCOPES=
```

Once the config values are added run `npm install`, `npm run build`, and `npm run test` to execute the integration tests.
