// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import merge from 'merge-deep';

// *****************************************************************************
// System config
// https://api.mattermost.com/#tag/system
// *****************************************************************************

function get() {
    // # Get current settings
    return cy.request('/api/v4/config').then((response) => {
        expect(response.status).to.match(/20\d/);
        cy.wrap(response);
    });
}

function update(newSettings = {}) {
    // # Get current settings
    return cy.request('/api/v4/config').then((getResponse) => {
        const oldSettings = getResponse.body;

        const settings = merge(oldSettings, newSettings);

        // # Set the modified settings
        cy.request({
            url: '/api/v4/config',
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            method: 'PUT',
            body: settings,
        }).then((response) => {
            expect(response.status).to.match(/20\d/);
            cy.wrap(response);
        });
    });
}

module.exports = {get, update};