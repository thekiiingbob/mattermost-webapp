// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. 1. Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************
/* eslint max-nested-callbacks: ["error", 4] */

function verifySystemMessage(post) {
    cy.get(post).
        invoke('attr', 'class').
        should('contain', 'post--system').
        and('not.contain', 'same--root').
        and('not.contain', 'other--root').
        and('not.contain', 'current--user').
        and('not.contain', 'post--comment').
        and('not.contain', 'post--root');

    cy.get(post).
        find('.status-wrapper .status svg').
        should('not.be.visible');
}

describe('MM-15240 - no status on a system message', () => {
    before(() => {
        // # Login and go to /
        mm.api.user.login('user-1');
        cy.visit('/');

        // # Post a regular message
        cy.postMessage('Test for no status of a system message');

        // # Update the header
        cy.getCurrentChannelId().then((channelId) => {
            cy.apiPatchChannel(
                channelId,
                {header: ' Updating header'.repeat(Math.floor(Math.random() * 10))}
            );
        });
    });

    const displayTypes = ['compact', 'clean'];

    displayTypes.forEach((type) => {
        it(`should have no status with ${type} display`, () => {
            // # Set message display
            mm.userPrefs.saveMessageDisplay(type);

            // # Get last post
            cy.getLastPostId().then((postId) => {
                cy.get(`#post_${postId}`).as('SystemMessage');
            });

            // * Verify it is a system message and that the status icon is not visible
            verifySystemMessage('@SystemMessage');
        });
    });
});
