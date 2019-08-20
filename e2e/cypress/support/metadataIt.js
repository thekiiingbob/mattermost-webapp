// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// Capture the original 'it' from mocha
const mochaIt = global.it;

async function metadataIt(name, metadataOrTestFn, testFn = null) {
    const hasMetadata = typeof metadataOrTestFn === 'object';

    // If we have metadata, use testFn, if not use the 2nd
    // argument as the testFn
    const actualTestFn = hasMetadata ? testFn : metadataOrTestFn;

    const actualMetadata = hasMetadata ? metadataOrTestFn : null;

    const determineSkip = (testTags) => {
        const tags = Cypress.env('tags');

        // If there are tags, we only want to run tests
        // that include those tags
        if (tags) {
            return !tags.map((tag) => {
                return testTags.includes(tag);
            }).some((result) => {
                return result === true;
            });
        }

        return false;
    };

    // If we have metadata, and the metadata has tags
    // we need to determine if we should actually run
    // the test.
    if (actualMetadata && actualMetadata.tags) {
        const shouldSkip = determineSkip(actualMetadata.tags);

        if (shouldSkip) {
            return mochaIt.skip(name, () => {
            // empty body for test
            });
        }
    }

    // Return the native mocha 'it' and attach
    // our metadata to the mocha context so it
    // is available for reporting
    return mochaIt(name, function() {
        this.test.metadata = actualMetadata;
        actualTestFn();
    });
}

// Reassign the global 'it' with our custom function
global.it = metadataIt;

