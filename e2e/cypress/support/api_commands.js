// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import merge from 'merge-deep';

import {getRandomInt} from '../utils';

import users from '../fixtures/users.json';
import theme from '../fixtures/theme.json';

// *****************************************************************************
// Read more:
// - https://on.cypress.io/custom-commands on writing Cypress commands
// - https://api.mattermost.com/ for Mattermost API reference
// *****************************************************************************

/**
 * List users that are not team members
 * @param {String} teamId - The team GUID
 * @param {Integer} page - The desired page of the paginated list
 * @param {Integer} perPage - The number of users per page
 * All parameter required
 */
Cypress.Commands.add('apiGetUsersNotInTeam', (teamId, page = 0, perPage = 60) => {
    return cy.request({
        method: 'GET',
        url: `/api/v4/users?not_in_team=${teamId}&page=${page}&per_page=${perPage}`,
        headers: {'X-Requested-With': 'XMLHttpRequest'},
    });
});

// *****************************************************************************
// Users
// https://api.mattermost.com/#tag/users
// *****************************************************************************

/**
 * Creates a new user via the API, adds them to 3 teams, and sets preference to bypass tutorial.
 * Then logs in as the user
 * @param {Object} user - Object of user email, username, and password that you can optionally set.
 * @param {Array} teamIDs - list of teams to add the new user to
 * @param {Boolean} bypassTutorial - whether to set user preferences to bypass the tutorial on first login (true) or to show it (false)
 * Otherwise use default values
 @returns {Object} Returns object containing email, username, id and password if you need it further in the test
 */

Cypress.Commands.add('createNewUser', (user = {}, teamIds = [], bypassTutorial = true) => {
    const timestamp = Date.now();

    const {email = `user${timestamp}@sample.mattermost.com`, username = `user${timestamp}`, password = 'password123'} = userData;

    // # Create a new user
    return mm.api.user.create({email, username, password}).then((userResponse) => {
        // Safety assertions to make sure we have a valid response
        expect(userResponse).to.have.property('body').to.have.property('id');

        const userId = userResponse.body.id;

        if (teamIds && teamIds.length > 0) {
            teamIds.forEach((teamId) => {
                mm.api.team.addUserToTeam(teamId, userId);
            });
        } else {
            // Get teams, select the first three, and add new user to that team
            cy.request('GET', '/api/v4/teams').then((teamsResponse) => {
                // Verify we have at least 2 teams in the response to add the user to
                expect(teamsResponse).to.have.property('body').to.have.length.greaterThan(1);

                // Pull out only the first 2 teams
                teamsResponse.body.slice(0, 2).map((t) => t.id).forEach((teamId) => {
                    mm.api.team.addUserToTeam(teamId, userId);
                });
            });
        }

        // # If the bypass flag is true, bypass tutorial
        if (bypassTutorial === true) {
            const preferences = [{
                user_id: userId,
                category: 'tutorial_step',
                name: userId,
                value: '999',
            }];
        
            mm.api.user.saveUserPreference(preferences, userId);
        }
        // Wrap our user object so it gets returned from our cypress command
        cy.wrap({email, username, password, id: userId});
    });
});

/**
 * Creates a new user via the API , adds them to 3 teams, and sets preference to bypass tutorial.
 * Then logs in as the user
 * @param {Object} user - Object of user email, username, and password that you can optionally set.
 * @param {Boolean} bypassTutorial - Whether to set user preferences to bypass the tutorial (true) or to show it (false)
 * Otherwise use default values
 @returns {Object} Returns object containing email, username, id and password if you need it further in the test
 */
Cypress.Commands.add('loginAsNewUser', (user = {}, bypassTutorial = true) => {
    return cy.createNewUser(user, [], bypassTutorial).then((newUser) => {
        cy.request({
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            url: '/api/v4/users/login',
            method: 'POST',
            body: {login_id: newUser.username, password: newUser.password},
        }).then(() => {
            cy.visit('/');

            return cy.wrap(newUser);
        });
    });
});

// *****************************************************************************
// Posts
// https://api.mattermost.com/#tag/posts
// *****************************************************************************

/**
* Unpins pinned posts of given postID directly via API
* This API assume that the user is logged in and has cookie to access
* @param {String} postId - Post ID of the pinned post to unpin
*/
Cypress.Commands.add('apiUnpinPosts', (postId) => {
    return cy.request({
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        url: '/api/v4/posts/' + postId + '/unpin',
        method: 'POST',
    });
});

// *****************************************************************************
// Webhooks
// https://api.mattermost.com/#tag/webhooks
// *****************************************************************************

Cypress.Commands.add('apiCreateWebhook', (hook = {}, isIncoming = true) => {
    const hookUrl = isIncoming ? '/api/v4/hooks/incoming' : '/api/v4/hooks/outgoing';
    const options = {
        url: hookUrl,
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        method: 'POST',
        body: hook,
    };

    return cy.request(options).then((response) => {
        const data = response.body;
        return {...data, url: isIncoming ? `${Cypress.config().baseUrl}/hooks/${data.id}` : ''};
    });
});
