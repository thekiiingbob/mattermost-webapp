// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
module.exports = async function bobit(name, metadataOrTestFn, testFn = null) {
    console.log('metadataOrTestFn type', typeof metadataOrTestFn);
    const hasMetadata = typeof metadataOrTestFn === 'object';

    // If we have metadata, use testFn, if not use the 2nd
    // argument as the testFn
    const actualTestFn = hasMetadata ? testFn : metadataOrTestFn;

    const actualMetadata = hasMetadata ? metadataOrTestFn : null;

    const determineSkip = (testTags) => {
        const tags = Cypress.env('tags');

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
            return it.skip(name, () => {
            // empty body for test
            });
        }
    }

    // Return the native mocha 'it' and attach
    // our metadata to the mocha context so it
    // is available for reporting
    return it(name, function() {
        this.test.metadata = actualMetadata;
        actualTestFn();
    });
};