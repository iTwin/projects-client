# Projects Client Library

Copyright © Bentley Systems, Incorporated. All rights reserved. See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.

[iTwin.js](http://www.itwinjs.org) is an open source platform for creating, querying, modifying, and displaying Infrastructure Digital Twins. To learn more about the iTwin Platform and its APIs, visit the [iTwin developer portal](https://developer.bentley.com/).

If you have questions, or wish to contribute to iTwin.js, see our [Contributing guide](./CONTRIBUTING.md).

## About this Repository

Contains the __@itwin/projects-client__ package that wraps sending requests to the project service. Visit the [Projects API](https://developer.bentley.com/apis/projects/) for more documentation on the project service.

## Build Instructions

The initial setup steps must be run to prepare for development. Afterwards use the established setup steps to update, build, and verify your local work.

#### Initial setup

1. Clone repository: `git clone`
2. Install dependencies: `npm install`
3. Setup git hooks using a repository specific git config: `npm run config:githooks`

#### Established setup

1. Pull updates to the repository: `git pull`
2. Install dependencies: `npm install`
3. Build source: `npm run build`
4. Run tests: `npm run test`
5. Run linters: `npm run lint`

> Note: It is a good idea to `npm install` after each `git pull` as dependencies may have changed.
