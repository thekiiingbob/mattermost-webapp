// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {getRandomInt} from '../../../utils';

function create(name, displayName, type = 'O') {
    const uniqueName = `${name}-${getRandomInt(9999).toString()}`;

    return cy.request({
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        url: '/api/v4/teams',
        method: 'POST',
        body: {
            name: uniqueName,
            display_name: displayName,
            type,
        },
    }).then((response) => {
        expect(response.status).to.match(/20\d/);
        cy.wrap(response);
    });
}

/**
 * Deletes a team directly via API
 * This API assume that the user is logged in and has cookie to access
 * @param {String} teamId - The team ID to be deleted
 * All parameter required
 */
function deleteTeam(teamId, permanent = false) {
    return cy.request({
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        url: '/api/v4/teams/' + teamId + (permanent ? '/?permanent=true' : ''),
        method: 'DELETE',
    }).then((response) => {
        expect(response.status).to.match(/20\d/);
        cy.wrap(response);
    });
}

/**
 * Gets a list of the current user's teams
 * This API assume that the user is logged
 * no params required because we are using /me to refer to current user
 */

function get() {
    return cy.request({
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        url: 'api/v4/users/me/teams',
        method: 'GET',
    }).then((response) => {
        expect(response.status).to.match(/20\d/);
        cy.wrap(response);
    });
}

/**
 * Add user into a team directly via API
 * This API assume that the user is logged in and has cookie to access
 * @param {String} teamId - The team ID
 * @param {String} userId - ID of user to be added into a team
 * All parameter required
 */
function addUserToTeam(teamId, userId) {
    return cy.request({
        method: 'POST',
        url: `/api/v4/teams/${teamId}/members`,
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        body: {team_id: teamId, user_id: userId},
        qs: {team_id: teamId},
    }).then((response) => {
        expect(response.status).to.match(/20\d/);
        cy.wrap(response);
    });
}

/**
 * Join teammates directly via API
 * @param {String} teamId - The team GUID
 * @param {Array} teamMembers - The user IDs to join
 * All parameter required
 */
function addUsersToTeam(teamId, teamMembers) {
    return cy.request({
        method: 'POST',
        url: `/api/v4/teams/${teamId}/members/batch`,
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        body: teamMembers,
    }).then((response) => {
        expect(response.status).to.match(/20\d/);
        cy.wrap(response);
    });
}

module.exports = {create, deleteTeam, get, addUserToTeam, addUsersToTeam};