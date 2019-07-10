// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {getRandomInt} from '../../../utils';

function create(teamId, name, displayName, type = 'O', purpose = '', header = '') {
    const uniqueName = `${name}-${getRandomInt(9999).toString()}`;

    return cy.request({
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        url: '/api/v4/channels',
        method: 'POST',
        body: {
            team_id: teamId,
            name: uniqueName,
            display_name: displayName,
            type,
            purpose,
            header,
        },
    }).then((response) => {
        expect(response.status).to.match(/20\d/);
        cy.wrap(response);
    });
}

/**
 * Deletes a channel directly via API
 * This API assume that the user is logged in and has cookie to access
 * @param {String} channelId - The channel ID to be deleted
 * All parameter required
 */
function deleteChannel(channelId) {
    return cy.request({
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        url: '/api/v4/channels/' + channelId,
        method: 'DELETE',
    }).then((response) => {
        expect(response.status).to.match(/20\d/);
        cy.wrap(response);
    });
}

/**
 * Updates a channel directly via API
 * This API assume that the user is logged in and has cookie to access
 * @param {String} channelId - The channel's id, not updatable
 * @param {Object} channelData
 *   {String} name - The unique handle for the channel, will be present in the channel URL
 *   {String} display_name - The non-unique UI name for the channel
 *   {String} type - 'O' for a public channel (default), 'P' for a private channel
 *   {String} purpose - A short description of the purpose of the channel
 *   {String} header - Markdown-formatted text to display in the header of the channel
 * Only channelId is required
 */
function update(channelId, channelData) {
    return cy.request({
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        url: '/api/v4/channels/' + channelId,
        method: 'PUT',
        body: {
            id: channelId,
            ...channelData,
        },
    }).then((response) => {
        expect(response.status).to.match(/20\d/);
        cy.wrap(response);
    });
}

/**
 * Partially update a channel directly via API
 * This API assume that the user is logged in and has cookie to access
 * @param {String} channelId - The channel's id, not updatable
 * @param {Object} channelData
 *   {String} name - The unique handle for the channel, will be present in the channel URL
 *   {String} display_name - The non-unique UI name for the channel
 *   {String} purpose - A short description of the purpose of the channel
 *   {String} header - Markdown-formatted text to display in the header of the channel
 * Only channelId is required
 */
function patch(channelId, channelData) {
    return cy.request({
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        method: 'PUT',
        url: `/api/v4/channels/${channelId}/patch`,
        body: channelData,
    }).then((response) => {
        expect(response.status).to.match(/20\d/);
        cy.wrap(response);
    });
}

module.exports = {create, deleteChannel, update, patch};